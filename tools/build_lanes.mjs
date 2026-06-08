#!/usr/bin/env node
// build_lanes.mjs
// Reads docs/_handoff/lanes.json (the single source of truth) and regenerates:
//   a. docs/_handoff/lanes.html  - self-contained, mobile-first interactive Command Center
//   b. docs/_handoff/LANES.md    - markdown mirror kept in sync with the json
//
// Run with: /opt/node22/bin/node tools/build_lanes.mjs
// No external dependencies. No network. The HTML embeds the data inline so it
// opens from a phone with no server and no fetch.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const HANDOFF = join(ROOT, "docs", "_handoff");
const JSON_PATH = join(HANDOFF, "lanes.json");
const HTML_PATH = join(HANDOFF, "lanes.html");
const MD_PATH = join(HANDOFF, "LANES.md");

// Status -> human label, ordering, and badge color (accessible contrast).
const STATUS = {
  open: { label: "Open", order: 1, bg: "#1d4ed8", fg: "#ffffff", md: "OPEN" },
  in_progress: { label: "In progress", order: 2, bg: "#b45309", fg: "#ffffff", md: "IN PROGRESS" },
  blocked: { label: "Blocked", order: 3, bg: "#b91c1c", fg: "#ffffff", md: "BLOCKED" },
  paused: { label: "Paused", order: 4, bg: "#6b7280", fg: "#ffffff", md: "PAUSED" },
  done: { label: "Done", order: 5, bg: "#15803d", fg: "#ffffff", md: "DONE" },
};

function statusMeta(s) {
  return STATUS[s] || { label: s, order: 9, bg: "#374151", fg: "#ffffff", md: String(s || "").toUpperCase() };
}

// The intro block for LANES.md is kept verbatim so the multi-session
// coordination notes survive every regeneration. Only the lane sections below
// the divider are regenerated from the json.
const MD_INTRO = `# GSR Work Lanes (living tracker)

This is the master list of workstreams ("lanes") in flight, what is done, what is
left, and a paste-ready prompt to resume each one in ANY session. It is NOT a
per-session report. It is the running to-do across the whole project.

> This file is generated from \`docs/_handoff/lanes.json\` by \`tools/build_lanes.mjs\`.
> Edit the json (or let the nightly job append activity), then rebuild. Do not
> hand-edit the lane sections below the divider; they will be overwritten.

## How to use this file (every session, read this first)
- This file is the shared brain. Any session can read AND update it.
- Before working a lane: \`git pull --rebase\`, then set that lane's **Status** to
  \`IN PROGRESS (your name/session, date)\` and push, so other sessions see it is taken.
- When you pause: update Done / To finish, set Status back to \`OPEN\` (or \`BLOCKED\`),
  commit and \`git pull --rebase\` then \`git push\`.
- Sessions do not share live memory, so each **Resume prompt** is self-contained:
  it tells a fresh session what to read first, then what to do.
- **Multiple sessions at once:** there is no live lock, only this file. To avoid two
  sessions colliding on the same files, either (a) one session owns a lane at a time
  (the IN PROGRESS flag), or (b) split a lane into sub-lanes that touch different files
  (e.g. "UI: Today screen" vs "UI: Schedule screen"). If two do edit the same file,
  git will flag a conflict on push, recoverable, but the flag above prevents most.
- **Command Center:** open \`docs/_handoff/lanes.html\` on a phone or laptop for a
  filterable, tap-to-copy view of every lane (it embeds the data, no server needed).

Always read \`/home/user/gsr-automation-v2/CLAUDE.md\` and
\`docs/_handoff/GSR-WORKFLOW-CANON.md\` before acting. All work lives in
gsr-automation-v2 now (blueprint is retired). Dev branch: \`claude/codebase-handoff-review-M9Aia\`.
`;

// ---------- helpers ----------

function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function relativeTime(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "unknown";
  const diff = Date.now() - then;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);
  let phrase;
  if (mins < 1) phrase = "just now";
  else if (mins < 60) phrase = `${mins} minute${mins === 1 ? "" : "s"}`;
  else if (hours < 24) phrase = `${hours} hour${hours === 1 ? "" : "s"}`;
  else phrase = `${days} day${days === 1 ? "" : "s"}`;
  if (phrase === "just now") return phrase;
  return diff >= 0 ? `${phrase} ago` : `in ${phrase}`;
}

function absoluteTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
}

// ---------- markdown ----------

function buildMarkdown(data) {
  const lines = [];
  lines.push(MD_INTRO.trimEnd());
  lines.push("");
  lines.push(`_Last updated ${absoluteTime(data.updated_at)} (${relativeTime(data.updated_at)})._`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const lane of data.lanes) {
    const sm = statusMeta(lane.status);
    lines.push(`## Lane ${lane.id} - ${lane.name}`);
    lines.push(`**Status:** ${sm.md}.`);
    if (lane.summary) lines.push(`**Summary:** ${lane.summary}`);
    if (lane.done && lane.done.length) {
      lines.push(`**Done:** ${lane.done.join(" ")}`);
    }
    if (lane.to_finish && lane.to_finish.length) {
      lines.push("**To finish:**");
      for (const t of lane.to_finish) lines.push(`- ${t}`);
    }
    if (lane.blocked_on) lines.push(`**Blocked on:** ${lane.blocked_on}`);
    if (lane.files && lane.files.length) {
      lines.push(`**Files:** ${lane.files.map((f) => "`" + f + "`").join(", ")}`);
    }
    if (lane.recent_activity && lane.recent_activity.length) {
      lines.push("**Recent activity:**");
      for (const a of lane.recent_activity) {
        const date = a.date ? `${a.date} - ` : "";
        lines.push(`- ${date}${a.text || a.message || ""}`);
      }
    }
    lines.push(`**Resume prompt:** \`${lane.resume_prompt}\``);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("## Done / closed lanes (for the record)");
  for (const c of data.closed || []) lines.push(`- ${c}`);
  lines.push("");
  return lines.join("\n");
}

// ---------- html ----------

function buildHtml(data) {
  const counts = {};
  for (const lane of data.lanes) counts[lane.status] = (counts[lane.status] || 0) + 1;

  // Counts header chips (only statuses that exist, in defined order).
  const orderedStatuses = Object.keys(STATUS).sort(
    (a, b) => statusMeta(a).order - statusMeta(b).order
  );

  const countChips = orderedStatuses
    .filter((s) => counts[s])
    .map((s) => {
      const sm = statusMeta(s);
      return `<span class="count-chip"><span class="dot" style="background:${sm.bg}"></span>${escHtml(
        sm.label
      )} ${counts[s]}</span>`;
    })
    .join("");

  const filterChips = [
    `<button class="chip active" data-filter="all" type="button">All ${data.lanes.length}</button>`,
  ]
    .concat(
      orderedStatuses
        .filter((s) => counts[s])
        .map((s) => {
          const sm = statusMeta(s);
          return `<button class="chip" data-filter="${s}" type="button">${escHtml(sm.label)} ${counts[s]}</button>`;
        })
    )
    .join("");

  const cards = data.lanes
    .map((lane) => {
      const sm = statusMeta(lane.status);
      const doneN = (lane.done || []).length;
      const toN = (lane.to_finish || []).length;
      const total = doneN + toN;
      const pct = total > 0 ? Math.round((doneN / total) * 100) : (lane.status === "done" ? 100 : 0);

      const doneItems = (lane.done || [])
        .map((d) => `<li class="done"><span class="mark" aria-hidden="true">&#10003;</span><span>${escHtml(d)}</span></li>`)
        .join("");
      const toItems = (lane.to_finish || [])
        .map((t) => `<li class="todo"><span class="mark" aria-hidden="true">&#9633;</span><span>${escHtml(t)}</span></li>`)
        .join("");
      const fileItems = (lane.files || [])
        .map((f) => `<code>${escHtml(f)}</code>`)
        .join("");
      const blocked = lane.blocked_on
        ? `<div class="blocked"><strong>Blocked on:</strong> ${escHtml(lane.blocked_on)}</div>`
        : "";
      const activity = (lane.recent_activity || []).length
        ? `<div class="block"><h3>Recent activity</h3><ul class="activity">${lane.recent_activity
            .map((a) => {
              const date = a.date ? `<span class="adate">${escHtml(a.date)}</span> ` : "";
              return `<li>${date}${escHtml(a.text || a.message || "")}</li>`;
            })
            .join("")}</ul></div>`
        : "";

      return `
    <section class="lane" data-status="${escHtml(lane.status)}">
      <button class="lane-head" type="button" aria-expanded="false">
        <span class="lane-title"><span class="lane-num">Lane ${lane.id}</span> ${escHtml(lane.name)}</span>
        <span class="badge" style="background:${sm.bg};color:${sm.fg}">${escHtml(sm.label)}</span>
        <span class="chev" aria-hidden="true">&#9656;</span>
      </button>
      <div class="lane-meta">
        <p class="summary">${escHtml(lane.summary || "")}</p>
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ${pct} percent">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-label">${doneN} done / ${total} total (${pct}%)</div>
      </div>
      <div class="lane-body" hidden>
        ${doneItems ? `<div class="block"><h3>Done</h3><ul class="items">${doneItems}</ul></div>` : ""}
        ${toItems ? `<div class="block"><h3>To finish</h3><ul class="items">${toItems}</ul></div>` : ""}
        ${blocked}
        ${fileItems ? `<div class="block"><h3>Files</h3><div class="files">${fileItems}</div></div>` : ""}
        ${activity}
        <button class="copy-btn" type="button" data-prompt="${escHtml(lane.resume_prompt)}">Copy resume prompt</button>
      </div>
    </section>`;
    })
    .join("\n");

  const closedItems = (data.closed || [])
    .map((c) => `<li>${escHtml(c)}</li>`)
    .join("");

  // Embed the raw data inline too, so the page is a true self-contained record.
  const embedded = JSON.stringify(data).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${escHtml(data.project)} - Command Center</title>
<style>
  :root {
    --bg: #0f1115;
    --panel: #181b22;
    --panel-2: #1f232c;
    --ink: #e8eaed;
    --ink-dim: #aab0bb;
    --line: #2c313c;
    --accent: #5b8def;
    --done: #2ea24a;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    background: var(--bg);
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  .wrap { max-width: 760px; margin: 0 auto; padding: 18px 14px 60px; }
  header h1 { font-size: 1.4rem; margin: 0 0 4px; }
  .updated { color: var(--ink-dim); font-size: 0.85rem; margin: 0 0 12px; }
  .counts { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 14px; }
  .count-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--panel); border: 1px solid var(--line);
    padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; color: var(--ink-dim);
  }
  .count-chip .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
  .filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 18px; position: sticky; top: 0; background: var(--bg); padding: 8px 0; z-index: 5; }
  .chip {
    background: var(--panel); color: var(--ink-dim); border: 1px solid var(--line);
    padding: 8px 14px; border-radius: 999px; font-size: 0.85rem; cursor: pointer;
    min-height: 40px;
  }
  .chip.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .lane {
    background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
    margin: 0 0 12px; overflow: hidden;
  }
  .lane-head {
    width: 100%; display: flex; align-items: center; gap: 10px;
    background: none; border: 0; color: var(--ink); text-align: left;
    padding: 14px; cursor: pointer; font-size: 1rem; min-height: 52px;
  }
  .lane-title { flex: 1; font-weight: 600; }
  .lane-num { color: var(--ink-dim); font-weight: 500; margin-right: 4px; }
  .badge { padding: 3px 9px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
  .chev { color: var(--ink-dim); transition: transform 0.15s ease; }
  .lane.open-card .chev { transform: rotate(90deg); }
  .lane-meta { padding: 0 14px 12px; }
  .summary { margin: 0 0 10px; color: var(--ink-dim); font-size: 0.9rem; }
  .progress { background: var(--panel-2); border-radius: 999px; height: 8px; overflow: hidden; }
  .progress-fill { background: var(--done); height: 100%; border-radius: 999px; }
  .progress-label { font-size: 0.78rem; color: var(--ink-dim); margin-top: 5px; }
  .lane-body { padding: 4px 14px 16px; border-top: 1px solid var(--line); }
  .block { margin: 14px 0 0; }
  .block h3 { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-dim); margin: 0 0 6px; }
  ul.items, ul.activity { list-style: none; margin: 0; padding: 0; }
  ul.items li { display: flex; gap: 8px; padding: 4px 0; font-size: 0.92rem; }
  ul.items li .mark { flex: 0 0 auto; line-height: 1.5; }
  li.done .mark { color: var(--done); }
  li.todo .mark { color: var(--ink-dim); }
  ul.activity li { font-size: 0.88rem; padding: 3px 0; color: var(--ink); }
  .adate { color: var(--ink-dim); font-variant-numeric: tabular-nums; }
  .blocked { margin: 14px 0 0; background: rgba(185,28,28,0.14); border: 1px solid rgba(185,28,28,0.4); border-radius: 8px; padding: 8px 10px; font-size: 0.88rem; }
  .files { display: flex; flex-wrap: wrap; gap: 6px; }
  .files code, .lane-body code {
    background: var(--panel-2); border: 1px solid var(--line); border-radius: 6px;
    padding: 3px 7px; font-size: 0.8rem; word-break: break-all;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .copy-btn {
    margin-top: 16px; width: 100%; min-height: 48px;
    background: var(--accent); color: #fff; border: 0; border-radius: 10px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
  }
  .copy-btn.copied { background: var(--done); }
  .closed { margin-top: 26px; }
  .closed h2 { font-size: 1rem; }
  .closed ul { color: var(--ink-dim); font-size: 0.88rem; padding-left: 18px; }
  .hidden { display: none !important; }
  @media (prefers-reduced-motion: reduce) { .chev { transition: none; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>${escHtml(data.project)} - Command Center</h1>
    <p class="updated">Last updated <span id="rel">${escHtml(relativeTime(data.updated_at))}</span> &middot; ${escHtml(absoluteTime(data.updated_at))}</p>
    <div class="counts">${countChips}</div>
  </header>

  <nav class="filters" aria-label="Filter lanes by status">${filterChips}</nav>

  <main id="lanes">
${cards}
  </main>

  <section class="closed">
    <h2>Done / closed lanes (for the record)</h2>
    <ul>${closedItems}</ul>
  </section>
</div>

<script id="lanes-data" type="application/json">${embedded}</script>
<script>
(function () {
  // Collapsible cards.
  document.querySelectorAll(".lane-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var lane = head.closest(".lane");
      var body = lane.querySelector(".lane-body");
      var open = lane.classList.toggle("open-card");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      if (body) body.hidden = !open;
    });
  });

  // Status filter chips.
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      document.querySelectorAll(".lane").forEach(function (lane) {
        var show = f === "all" || lane.getAttribute("data-status") === f;
        lane.classList.toggle("hidden", !show);
      });
    });
  });

  // Copy resume prompt with a brief confirmation.
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-prompt") || "";
      var done = function () {
        var orig = "Copy resume prompt";
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = orig; btn.classList.remove("copied"); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }
})();
</script>
</body>
</html>
`;
}

// ---------- main ----------

function main() {
  const data = JSON.parse(readFileSync(JSON_PATH, "utf8"));
  writeFileSync(HTML_PATH, buildHtml(data));
  writeFileSync(MD_PATH, buildMarkdown(data));
  console.log(`Wrote ${HTML_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(`Lanes: ${data.lanes.length}, closed: ${(data.closed || []).length}`);
}

main();
