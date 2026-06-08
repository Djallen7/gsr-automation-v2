#!/usr/bin/env node
// nightly_lanes_update.mjs
// Nightly job: tags the last ~24h of commits on the current branch to lanes by
// keyword, APPENDS them as dated entries to each matched lane's recent_activity
// in lanes.json (it records what happened; it does NOT auto-mark to_finish items
// done), bumps updated_at, regenerates lanes.html + LANES.md via build_lanes.mjs,
// then commits and pushes.
//
// Run with: /opt/node22/bin/node tools/nightly_lanes_update.mjs
// Safe to run repeatedly. No-op-friendly when there are no new commits.

import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const JSON_PATH = join(ROOT, "docs", "_handoff", "lanes.json");
const BUILD_SCRIPT = join(HERE, "build_lanes.mjs");

function git(args, opts = {}) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", ...opts }).trim();
}

function tryGit(args) {
  try {
    return { ok: true, out: git(args) };
  } catch (e) {
    return { ok: false, out: (e.stdout || "") + (e.stderr || "") + String(e.message || "") };
  }
}

// Per-lane keyword sets. A commit subject matching any keyword (case-insensitive,
// word-ish boundary) tags that lane. Commits matching nothing go to "general".
const LANE_KEYWORDS = {
  1: ["ui", "design", "mock", "bake-off", "bakeoff", "preview", "screenshot", "dashboard screen", "today screen", "schedule matrix"],
  2: ["course", "module", "lesson", "curriculum", "m13", "gating"],
  3: ["episode", "segment", "guest", "dataset", "chyron", "scripts row", "ep1", "ep9", "ep16", "ep18", "shoot date"],
  4: ["rundown", "rundown creator", " rc ", "rc-", "getrundowns", "getrows", "getscript", "rc sync"],
  5: ["basecamp", "oauth", "2026 schedule", "schedule view", "refresh token"],
  6: ["webstream", "youtube_scheduled", "rename", "expand-contract", "publish_at"],
  7: ["pr ", "pull request", "draft pr", "squash", "merge to main", "ship", "vercel preview", "tsc", "eslint"],
  8: ["canon", "standard", "data standard", "hygiene", "affiliation", "workflow-canon"],
  9: ["research", "research-queue", "research queue", "autonomous", "loop", "optimization report"],
};

function tagLane(subject) {
  const s = (" " + subject + " ").toLowerCase();
  for (const [id, kws] of Object.entries(LANE_KEYWORDS)) {
    for (const kw of kws) {
      if (s.includes(kw.toLowerCase())) return Number(id);
    }
  }
  return "general";
}

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function main() {
  // Read recent commits. Format: <shortsha>\x1f<subject>
  const since = "24 hours ago";
  const res = tryGit(["log", `--since=${since}`, "--no-merges", "--pretty=format:%h%x1f%s"]);
  if (!res.ok) {
    console.error("git log failed:", res.out);
    process.exit(1);
  }

  const raw = res.out.trim();
  const commits = raw
    ? raw.split("\n").map((line) => {
        const [sha, subject] = line.split("\x1f");
        return { sha: (sha || "").trim(), subject: (subject || "").trim() };
      }).filter((c) => c.sha)
    : [];

  if (commits.length === 0) {
    console.log("No commits in the last 24 hours. Nothing to append.");
    // Still safe: do not bump updated_at or churn the tree when nothing happened.
    return;
  }

  const data = JSON.parse(readFileSync(JSON_PATH, "utf8"));
  const laneById = new Map(data.lanes.map((l) => [l.id, l]));
  const today = isoDate();

  // Build a set of activity entries already recorded (by sha) per lane, so reruns
  // do not duplicate.
  function alreadyHasSha(lane, sha) {
    return (lane.recent_activity || []).some((a) => a.sha === sha);
  }

  let general = data.lanes.find((l) => l.id === "general");
  const generalCommits = [];

  let appended = 0;
  for (const c of commits) {
    const laneId = tagLane(c.subject);
    if (laneId === "general") {
      generalCommits.push(c);
      continue;
    }
    const lane = laneById.get(laneId);
    if (!lane) continue;
    if (!Array.isArray(lane.recent_activity)) lane.recent_activity = [];
    if (alreadyHasSha(lane, c.sha)) continue;
    lane.recent_activity.push({ date: today, sha: c.sha, text: c.subject });
    appended++;
  }

  // General bucket: a synthetic lane-less entry kept in data.general (does not
  // pollute the 9 real lanes). Created only when needed.
  if (generalCommits.length) {
    if (!Array.isArray(data.general)) data.general = [];
    for (const c of generalCommits) {
      if (data.general.some((a) => a.sha === c.sha)) continue;
      data.general.push({ date: today, sha: c.sha, text: c.subject });
      appended++;
    }
  }

  if (appended === 0) {
    console.log(`Found ${commits.length} commit(s) but all were already recorded. No change.`);
    return;
  }

  data.updated_at = new Date().toISOString();
  writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`Appended ${appended} activity entr${appended === 1 ? "y" : "ies"} across lanes.`);

  // Regenerate html + md.
  execFileSync(process.execPath, [BUILD_SCRIPT], { cwd: ROOT, stdio: "inherit" });

  // Commit and push. Rebase first to stay current with the remote branch.
  git(["add", "-A"]);
  const status = git(["status", "--porcelain"]);
  if (!status) {
    console.log("Working tree clean after build. Nothing to commit.");
    return;
  }

  const pull = tryGit(["pull", "--rebase"]);
  if (!pull.ok) console.warn("git pull --rebase warning:", pull.out);

  const msg = `nightly: lanes activity update ${today}`;
  const commit = tryGit(["commit", "-m", msg]);
  if (!commit.ok) {
    console.warn("git commit said:", commit.out);
  } else {
    console.log(commit.out);
  }

  const push = tryGit(["push"]);
  if (!push.ok) {
    console.error("git push failed:", push.out);
    process.exit(1);
  }
  console.log("Pushed.");
}

main();
