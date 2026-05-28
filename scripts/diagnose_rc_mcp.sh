#!/usr/bin/env bash
# diagnose_rc_mcp.sh
# Run this on the home Mac from ~/propresenter-mcp/ to diagnose RC MCP timeouts.
# Usage: bash ~/gsr-automation-v2/scripts/diagnose_rc_mcp.sh
#
# The script will never print tokens — it reads them from your local config only.

set -euo pipefail

RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
BLD='\033[1m'
RST='\033[0m'

SERVER_DIR="$HOME/propresenter-mcp"
RC_BASE="https://www.rundowncreator.com/davidrives/API.php"
RUNDOWN_ID=79

echo ""
echo -e "${BLD}=== RC MCP Diagnostic Tool ===${RST}"
echo "Running on: $(hostname) at $(date)"
echo ""

# ── Step 1: Find the server directory ────────────────────────────────────────
echo -e "${BLD}[1/6] Server directory${RST}"
if [ ! -d "$SERVER_DIR" ]; then
  echo -e "${RED}✗ $SERVER_DIR not found. Run this script on the home Mac.${RST}"
  exit 1
fi
echo -e "${GRN}✓ Found: $SERVER_DIR${RST}"
ls "$SERVER_DIR"
echo ""

# ── Step 2: Find the API token (never prints it) ───────────────────────────
echo -e "${BLD}[2/6] Locating API credentials${RST}"

API_KEY=""
API_TOKEN=""

# Try common config file locations
for cfg_path in \
  "$SERVER_DIR/.env" \
  "$SERVER_DIR/config.json" \
  "$SERVER_DIR/config/rc.json" \
  "$HOME/.config/propresenter-mcp/config.json" \
  "$HOME/.propresenter-mcp.env"
do
  if [ -f "$cfg_path" ]; then
    echo "  Found config: $cfg_path"
    # Extract without printing values
    if [[ "$cfg_path" == *.env ]]; then
      KEY=$(grep -i "RC_API_KEY\|RUNDOWN.*KEY\|APIKey" "$cfg_path" 2>/dev/null | head -1 | sed 's/.*=//;s/"//g' || true)
      TOK=$(grep -i "RC_API_TOKEN\|RUNDOWN.*TOKEN\|APIToken" "$cfg_path" 2>/dev/null | head -1 | sed 's/.*=//;s/"//g' || true)
    else
      KEY=$(python3 -c "import json,sys; d=json.load(open('$cfg_path')); print(d.get('apiKey',d.get('APIKey','')))" 2>/dev/null || true)
      TOK=$(python3 -c "import json,sys; d=json.load(open('$cfg_path')); print(d.get('apiToken',d.get('APIToken','')))" 2>/dev/null || true)
    fi
    [ -n "$KEY" ] && API_KEY="$KEY"
    [ -n "$TOK" ] && API_TOKEN="$TOK"
  fi
done

# Try env vars
[ -z "$API_KEY" ]   && API_KEY="${RC_API_KEY:-${RUNDOWN_API_KEY:-}}"
[ -z "$API_TOKEN" ] && API_TOKEN="${RC_API_TOKEN:-${RUNDOWN_API_TOKEN:-}}"

# Try 1Password if still missing
if [ -z "$API_TOKEN" ] && command -v op &>/dev/null; then
  echo "  Trying 1Password for RC token..."
  API_TOKEN=$(op item get "Rundown Creator API" --fields "APIToken" --reveal 2>/dev/null || \
              op item get "rundown creator" --fields "token" --reveal 2>/dev/null || true)
fi

if [ -z "$API_TOKEN" ]; then
  echo -e "${YLW}⚠ Could not find API token automatically.${RST}"
  echo "  Set RC_API_TOKEN in your env or create $SERVER_DIR/.env with:"
  echo "  RC_API_KEY=danielallen"
  echo "  RC_API_TOKEN=your-token-here"
  echo ""
  echo "  Continuing with unauthenticated tests only."
  AUTH_PARAMS=""
else
  echo -e "${GRN}✓ Found API token (not shown)${RST}"
  [ -z "$API_KEY" ] && API_KEY="danielallen"
  AUTH_PARAMS="&APIKey=${API_KEY}&APIToken=${API_TOKEN}"
fi
echo ""

# ── Step 3: Raw API response time tests ───────────────────────────────────
echo -e "${BLD}[3/6] API endpoint response times (raw curl, no MCP layer)${RST}"

test_endpoint() {
  local label="$1"
  local url="$2"
  local result
  result=$(curl -s -w "HTTP_%{http_code} TIME_%{time_total} SIZE_%{size_download}" \
    -o /tmp/rc_diag_response.txt \
    --max-time 30 \
    "$url" 2>&1) || { echo "  ${label}: curl error / timeout after 30s"; return; }

  local http time size
  http=$(echo "$result" | grep -o 'HTTP_[0-9]*' | cut -d_ -f2)
  time=$(echo "$result" | grep -o 'TIME_[0-9.]*' | cut -d_ -f2)
  size=$(echo "$result" | grep -o 'SIZE_[0-9]*' | cut -d_ -f2)
  local body
  body=$(cat /tmp/rc_diag_response.txt | head -c 200)

  local status_color="$GRN"
  [ "$http" != "200" ] && status_color="$RED"

  echo -e "  ${label}:"
  echo -e "    HTTP ${status_color}${http}${RST} | ${time}s | ${size} bytes"
  echo "    Body preview: $body"
  echo ""
}

# Test ping (lightweight - should always work)
test_endpoint "rc_ping" "${RC_BASE}?method=ping${AUTH_PARAMS}"

# Test getRows - key failing call
test_endpoint "getRows (RundownID=${RUNDOWN_ID} - correct casing)" \
  "${RC_BASE}?method=getRows&RundownID=${RUNDOWN_ID}${AUTH_PARAMS}"

# Test with WRONG casing to confirm the bug
test_endpoint "getRows (rundownID=${RUNDOWN_ID} - WRONG casing)" \
  "${RC_BASE}?method=getRows&rundownID=${RUNDOWN_ID}${AUTH_PARAMS}"

# Test getFullRundown
test_endpoint "getFullRundown (RundownID=${RUNDOWN_ID})" \
  "${RC_BASE}?method=getFullRundown&RundownID=${RUNDOWN_ID}${AUTH_PARAMS}"

# ── Step 4: Check server code for timeout config ───────────────────────────
echo -e "${BLD}[4/6] Inspecting MCP server for timeout settings${RST}"
echo ""

# Find the main server entry point
MAIN_FILE=""
for f in "$SERVER_DIR/index.js" "$SERVER_DIR/src/index.js" "$SERVER_DIR/server.js" "$SERVER_DIR/dist/index.js"; do
  [ -f "$f" ] && MAIN_FILE="$f" && break
done

if [ -z "$MAIN_FILE" ]; then
  echo -e "${YLW}⚠ Could not find main server file. Searching...${RST}"
  MAIN_FILE=$(find "$SERVER_DIR" -name "*.js" -not -path "*/node_modules/*" | head -5)
  echo "  Found: $MAIN_FILE"
fi

echo "  Main file: ${MAIN_FILE:-not found}"
echo ""

# Check for timeout patterns in all JS files
echo "  Searching for timeout/retry patterns in server code:"
grep -rn "timeout\|setTimeout\|retry\|MAX_RETRIES\|maxTimeout\|DEFAULT_REQUEST_TIMEOUT" \
  "$SERVER_DIR" --include="*.js" --include="*.ts" \
  --exclude-dir=node_modules 2>/dev/null | head -20 || echo "  (no timeout patterns found)"
echo ""

# Check for parameter passing patterns (the casing bug)
echo "  Checking how rundownID is passed to the API:"
grep -rn "RundownID\|rundownID\|rundown_id\|getRows\|getFullRundown" \
  "$SERVER_DIR" --include="*.js" --include="*.ts" \
  --exclude-dir=node_modules 2>/dev/null | head -20 || echo "  (no matches found)"
echo ""

# Check MCP SDK version (affects DEFAULT_REQUEST_TIMEOUT_MSEC)
echo "  MCP SDK version:"
cat "$SERVER_DIR/node_modules/@modelcontextprotocol/sdk/package.json" 2>/dev/null | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print('  version:', d.get('version','?'))" 2>/dev/null || \
  echo "  (SDK not in node_modules — check package.json)"

MCP_TIMEOUT_FILE=$(find "$SERVER_DIR/node_modules/@modelcontextprotocol" -name "protocol.js" 2>/dev/null | head -1)
if [ -n "$MCP_TIMEOUT_FILE" ]; then
  echo "  DEFAULT_REQUEST_TIMEOUT_MSEC in SDK:"
  grep "DEFAULT_REQUEST_TIMEOUT_MSEC" "$MCP_TIMEOUT_FILE" 2>/dev/null || echo "  (not found)"
fi
echo ""

# ── Step 5: Measure response size if auth worked ──────────────────────────
if [ -n "$AUTH_PARAMS" ] && [ -f /tmp/rc_diag_response.txt ]; then
  echo -e "${BLD}[5/6] Response size check${RST}"
  SIZE=$(wc -c < /tmp/rc_diag_response.txt)
  echo "  Last response was: ${SIZE} bytes"
  if [ "$SIZE" -gt 10000 ]; then
    echo -e "${YLW}  ⚠ Response is ${SIZE} bytes — large payloads over stdio can cause timeouts${RST}"
  else
    echo -e "${GRN}  ✓ Response size is reasonable${RST}"
  fi
  echo ""
fi

# ── Step 6: Summary ───────────────────────────────────────────────────────
echo -e "${BLD}[6/6] Diagnosis summary${RST}"
echo ""
echo "  Compare the two getRows tests above:"
echo "  - If 'RundownID' (correct) returns 200 quickly → parameter casing fix is the issue"
echo "  - If 'rundownID' (wrong) returns an error body but NOT a timeout → server retry loop"
echo "  - If both return 200 but take >5s → API is genuinely slow → need response pagination"
echo "  - If either hangs for 30s and curl times out → network or auth issue"
echo ""
echo "  Check the MCP SDK timeout above:"
echo "  - If DEFAULT_REQUEST_TIMEOUT_MSEC = 60000, Claude Desktop kills calls after 60s"
echo "  - Patching it to 300000 in that file buys time but is fragile"
echo ""
echo -e "${BLD}Next step: apply the fix from scripts/fix_rc_mcp_timeout.js${RST}"
echo ""
