/**
 * fix_rc_mcp_timeout.js
 *
 * Patch to apply to ~/propresenter-mcp/index.js (or wherever rc_get_rows /
 * rc_get_full_rundown are defined).
 *
 * ROOT CAUSE (ranked):
 *
 *   1. PARAMETER CASING BUG — The MCP tool schema uses lowercase `rundownID`,
 *      but the RC API expects `RundownID`. When the server passes the wrong
 *      casing in the query string the API returns an error body (HTTP 200).
 *      The server doesn't detect this as an error and either retries silently
 *      or hangs waiting for data that never comes. rc_ping has no ID param so
 *      it never triggers this path.
 *
 *   2. NO FAST-FAIL TIMEOUT — The HTTP fetch has no timeout. Claude Desktop's
 *      MCP client (DEFAULT_REQUEST_TIMEOUT_MSEC = 60 000 ms in the SDK,
 *      4-minute hard cancel in the app) fires before the server ever returns.
 *
 *   3. NO ERROR-BODY DETECTION — The server treats any 200 response as success,
 *      even when the body contains {"error": "Invalid API request"}.
 *
 * HOW TO APPLY:
 *
 *   1. Open ~/propresenter-mcp/index.js (or the file that registers rc_get_rows,
 *      rc_get_full_rundown tools)
 *   2. Find your existing fetchRC helper or the inline fetch calls
 *   3. Replace them with the rcFetch() helper below
 *   4. Fix parameter names per the mapping table at the bottom
 *   5. Restart the MCP server (quit and relaunch Claude Desktop or run_server.sh)
 *
 * TESTING (run on home Mac after applying):
 *
 *   node -e "
 *     const {rcFetch} = require('./index.js'); // adjust if helper is in a module
 *     rcFetch('getRows', {RundownID: 79}).then(console.log).catch(console.error);
 *   "
 */

// ── Drop-in replacement for your existing RC API helper ─────────────────────

const RC_API_BASE = "https://www.rundowncreator.com/davidrives/API.php";
const RC_TIMEOUT_MS = 25_000; // 25s — well under Claude Desktop's 60s limit

/**
 * Fetch from the Rundown Creator API with:
 *   - 25-second hard timeout (AbortController)
 *   - Error body detection (HTTP 200 with {"error":"..."} in body)
 *   - Clear error messages that surface in the Claude tool response
 *
 * @param {string} method  - RC API method name, e.g. "getRows"
 * @param {Record<string,string|number>} params - Additional query params
 * @returns {Promise<any>} - Parsed JSON response
 */
async function rcFetch(method, params = {}) {
  const apiKey   = process.env.RC_API_KEY   || process.env.RUNDOWN_API_KEY   || "danielallen";
  const apiToken = process.env.RC_API_TOKEN || process.env.RUNDOWN_API_TOKEN;

  if (!apiToken) {
    throw new Error("RC_API_TOKEN is not set. Add it to your .env file.");
  }

  const qs = new URLSearchParams({
    method,
    APIKey: apiKey,       // ← RC API requires EXACT casing: APIKey, APIToken
    APIToken: apiToken,
    ...params,            // ← callers must pass RundownID (capital R,D), not rundownID
  });

  const url = `${RC_API_BASE}?${qs}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RC_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        `RC API request timed out after ${RC_TIMEOUT_MS / 1000}s ` +
        `(method=${method}). The API may be slow or the credentials may be wrong.`
      );
    }
    throw new Error(`RC API network error (method=${method}): ${err.message}`);
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();

  // Detect auth / allowlist errors (the API uses HTTP 403 for IP blocks)
  if (response.status === 403) {
    throw new Error(
      `RC API returned 403 Forbidden (method=${method}). ` +
      "Your IP may not be on the RC allowlist, or credentials are invalid."
    );
  }

  // Detect error bodies that arrive as HTTP 200
  // The RC API returns {"error":"Invalid API request"} for bad params
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `RC API returned non-JSON (method=${method}, HTTP ${response.status}). ` +
      `Response: ${text.slice(0, 200)}`
    );
  }

  if (json && (json.error || json.Error || json.status === "error")) {
    const msg = json.error || json.Error || json.message || JSON.stringify(json);
    throw new Error(`RC API error (method=${method}): ${msg}`);
  }

  return json;
}

// ── PARAMETER CASING FIX TABLE ───────────────────────────────────────────────
//
// In your tool handlers, change the argument key before passing to rcFetch:
//
//   WRONG (what the MCP schema calls it)   →  CORRECT (what RC API expects)
//   ─────────────────────────────────────     ──────────────────────────────
//   rundownID                              →  RundownID
//   folderID                               →  FolderID
//   rowID                                  →  RowID
//   columnID                               →  ColumnID
//   layoutID                               →  LayoutID
//   templateID                             →  TemplateID
//
// Example — BEFORE (broken):
//
//   const data = await rcFetch("getRows", { rundownID: args.rundownID });
//                                           ^^^^^^^^^^
//                               RC API doesn't know this param, returns error
//
// Example — AFTER (fixed):
//
//   const data = await rcFetch("getRows", { RundownID: args.rundownID });
//                                          ^^^^^^^^^^
//                               Matches RC API exactly

// ── EXAMPLE FIXED TOOL HANDLERS ─────────────────────────────────────────────
//
// Replace your existing handler bodies with these patterns:

async function tool_rc_get_rows({ rundownID, getObjects, type }) {
  return rcFetch("getRows", {
    RundownID: rundownID,                        // ← fixed casing
    ...(getObjects != null && { GetObjects: getObjects }),
    ...(type       != null && { Type: type }),
  });
}

async function tool_rc_get_full_rundown({ rundownID }) {
  return rcFetch("getFullRundown", {
    RundownID: rundownID,                        // ← fixed casing
  });
}

async function tool_rc_ping() {
  return rcFetch("ping");
}

// ── OPTIONAL: Patch the MCP SDK timeout constant ─────────────────────────────
//
// If calls still time out after the above fix (because the API itself is slow),
// you can patch the SDK's hardcoded 60-second limit.
//
// WARNING: This gets wiped on `npm install`. Prefer fixing root cause above.
//
// Find the file:
//   find ~/propresenter-mcp/node_modules/@modelcontextprotocol \
//     -name "protocol.js" | head -3
//
// In that file, change:
//   DEFAULT_REQUEST_TIMEOUT_MSEC = 60000
// to:
//   DEFAULT_REQUEST_TIMEOUT_MSEC = 300000
//
// One-liner (run from ~/propresenter-mcp):
//   PROTO=$(find node_modules/@modelcontextprotocol -name "protocol.js" | head -1)
//   sed -i '' 's/DEFAULT_REQUEST_TIMEOUT_MSEC = 60000/DEFAULT_REQUEST_TIMEOUT_MSEC = 300000/g' "$PROTO"
//   grep DEFAULT_REQUEST_TIMEOUT_MSEC "$PROTO"  # verify

module.exports = { rcFetch, tool_rc_get_rows, tool_rc_get_full_rundown, tool_rc_ping };
