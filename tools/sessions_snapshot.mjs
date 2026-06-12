import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { homedir } from 'os';
import { spawnSync } from 'child_process';

// --- Part A: try claude agents --json ---
let agentSessions = [];
try {
  const result = spawnSync('claude', ['agents', '--json'], { encoding: 'utf8', timeout: 15000 });
  if (result.status === 0 && result.stdout) {
    const parsed = JSON.parse(result.stdout);
    if (Array.isArray(parsed)) agentSessions = parsed;
  }
} catch {
  // claude CLI missing or failed — proceed with filesystem scan only
}

// Build lookup by session_id
const agentMap = {};
for (const s of agentSessions) {
  const id = s.session_id || s.id || s.sessionId;
  if (id) agentMap[id] = s;
}

// --- Part B: scan ~/.claude/projects/*/*.jsonl ---
const projectsRoot = join(homedir(), '.claude', 'projects');
const sessions = [];

let projectDirs = [];
try {
  projectDirs = readdirSync(projectsRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => join(projectsRoot, d.name));
} catch {
  // projects dir missing — leave sessions empty
}

for (const projDir of projectDirs) {
  const projectName = basename(projDir);
  let files = [];
  try {
    files = readdirSync(projDir, { withFileTypes: true })
      .filter(f => f.isFile() && f.name.endsWith('.jsonl'))
      .map(f => join(projDir, f.name));
  } catch {
    continue;
  }

  for (const filePath of files) {
    try {
      const sessionId = basename(filePath, '.jsonl');
      const stat = statSync(filePath);
      const lastActivity = stat.mtime.toISOString();
      const agent = agentMap[sessionId] || {};
      sessions.push({
        project: projectName,
        session_id: sessionId,
        last_activity: lastActivity,
        state: agent.state || 'unknown',
        summary: agent.summary || '',
      });
    } catch {
      // skip unreadable file
    }
  }
}

// Sort newest first
sessions.sort((a, b) => b.last_activity.localeCompare(a.last_activity));

// --- Write output ---
const outDir = join(import.meta.dirname || process.cwd(), '..', 'docs', '_handoff');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'sessions-snapshot.json');

const output = {
  generated_at: new Date().toISOString(),
  sessions,
};

writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Wrote ${sessions.length} sessions to ${outPath}`);
