#!/usr/bin/env python3
"""
AI Conversation Archaeology Tool
================================
Analyzes Claude.ai + ChatGPT data exports + a personal forensic report folder
to surface actionable insights.

Outputs the following artifacts as markdown:
  - stats.md                    - quantitative overview
  - CLAUDE.md                   - reusable context for future Claude sessions
  - decision_log.md             - significant decisions extracted from chats
  - automation_candidates.md    - recurring manual tasks worth automating
  - recurring_difficulties.md   - friction points and consistent struggles
  - ai_usage_profile.md         - your preferences and patterns
  - topic_clusters.md           - what you actually use AI for

Usage:
    1. Edit the CONFIG section below with your paths.
    2. export ANTHROPIC_API_KEY=sk-ant-...
    3. python3 archaeology.py [stage]
       where [stage] is one of: ingest, categorize, cluster, deep, extract, all
       (default: all)

Stages are resumable. The SQLite index at OUTPUT_DIR/index.db caches everything,
so re-running a stage just picks up where it left off.
"""

import os
import sys
import json
import zipfile
import sqlite3
import argparse
import re
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter, defaultdict
from typing import Optional, Iterator

# ===== CONFIG - EDIT THESE =====
CLAUDE_EXPORT_PATH = os.path.expanduser("~/Downloads/claude-export")
CHATGPT_EXPORT_PATH = os.path.expanduser("~/Downloads/chatgpt-export")
FORENSIC_REPORT_PATH = "/Users/claudefix/Documents/inventory-2026-05"
OUTPUT_DIR = os.path.expanduser("~/Documents/ai-archaeology-output")

# LLM settings
TIER1_MODEL = "claude-haiku-4-5-20251001"   # cheap, every conversation
TIER2_MODEL = "claude-sonnet-4-6"            # deeper analysis on top N
SYNTHESIS_MODEL = "claude-opus-4-7"          # final artifact synthesis
TIER2_TOP_N = 200                            # deep-analyze this many conversations
MAX_MESSAGES_PER_CONV_TIER1 = 6              # how much context for cheap pass
MAX_CHARS_PER_MESSAGE = 2000                 # truncate long messages

# ===== END CONFIG =====


def db_path() -> Path:
    return Path(OUTPUT_DIR) / "index.db"


def ensure_output_dir():
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)


def get_db() -> sqlite3.Connection:
    ensure_output_dir()
    conn = sqlite3.connect(db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_schema(conn: sqlite3.Connection):
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,           -- 'claude' or 'gpt'
        account TEXT,                   -- email or account hint if known
        title TEXT,
        created_at TEXT,
        updated_at TEXT,
        message_count INTEGER,
        char_count INTEGER,
        first_human_msg TEXT,
        last_msg TEXT,
        raw_path TEXT,                  -- where the conversation came from
        tier1_category TEXT,            -- assigned in stage 2
        tier1_summary TEXT,
        tier1_tools_mentioned TEXT,     -- JSON array
        tier1_done INTEGER DEFAULT 0,
        tier2_deep_analysis TEXT,       -- JSON, stage 4
        tier2_done INTEGER DEFAULT 0,
        interestingness REAL DEFAULT 0  -- ranking for tier 2 selection
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        idx INTEGER NOT NULL,
        sender TEXT NOT NULL,           -- 'human' or 'assistant'
        created_at TEXT,
        text TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE TABLE IF NOT EXISTS forensic_files (
        path TEXT PRIMARY KEY,
        size INTEGER,
        modified TEXT,
        ext TEXT,
        content_preview TEXT,
        category TEXT
    );

    CREATE TABLE IF NOT EXISTS run_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stage TEXT,
        started_at TEXT,
        finished_at TEXT,
        notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_conv_source ON conversations(source);
    CREATE INDEX IF NOT EXISTS idx_conv_tier1 ON conversations(tier1_done);
    CREATE INDEX IF NOT EXISTS idx_conv_tier2 ON conversations(tier2_done);
    """)
    conn.commit()


def log_stage_start(conn, stage: str):
    conn.execute(
        "INSERT INTO run_log (stage, started_at) VALUES (?, ?)",
        (stage, datetime.now(timezone.utc).isoformat())
    )
    conn.commit()


def log_stage_end(conn, stage: str, notes: str = ""):
    conn.execute(
        "UPDATE run_log SET finished_at = ?, notes = ? WHERE id = (SELECT MAX(id) FROM run_log WHERE stage = ?)",
        (datetime.now(timezone.utc).isoformat(), notes, stage)
    )
    conn.commit()


# ============================================================
# STAGE 1: INGEST
# ============================================================

def find_export_files(root_path: str, target_filenames: list) -> list:
    """Find target JSON files in a directory or zip."""
    root = Path(root_path)
    found = []
    if not root.exists():
        return found

    if root.is_file() and root.suffix == ".zip":
        with zipfile.ZipFile(root) as zf:
            for name in zf.namelist():
                base = Path(name).name
                if base in target_filenames:
                    found.append(("zip", root, name))
    elif root.is_dir():
        for p in root.rglob("*"):
            if p.is_file() and p.name in target_filenames:
                found.append(("file", p, None))
    return found


def load_json_from_export(source_tuple) -> Optional[list]:
    kind, root, inner = source_tuple
    try:
        if kind == "zip":
            with zipfile.ZipFile(root) as zf:
                with zf.open(inner) as f:
                    return json.load(f)
        else:
            with open(root, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"  WARN: could not read {root}/{inner}: {e}", file=sys.stderr)
        return None


def ingest_claude_export(conn: sqlite3.Connection):
    """Parse Claude.ai conversations.json. Format as of 2026:
    {
        "uuid": "...",
        "name": "...",
        "created_at": "...",
        "updated_at": "...",
        "account": {"uuid": "..."} OR "account_uuid": "..."
        "chat_messages": [
            {
                "uuid": "...",
                "text": "..." OR content: [{"type":"text","text":"..."}],
                "sender": "human"|"assistant",
                "created_at": "...",
            },
            ...
        ]
    }
    """
    print(f"[claude] scanning {CLAUDE_EXPORT_PATH}")
    sources = find_export_files(CLAUDE_EXPORT_PATH, ["conversations.json"])
    if not sources:
        print(f"  no conversations.json found at {CLAUDE_EXPORT_PATH}")
        return 0

    total = 0
    for src in sources:
        data = load_json_from_export(src)
        if not data:
            continue
        if isinstance(data, dict):
            # some exports wrap in {"conversations": [...]}
            data = data.get("conversations", []) or []
        for conv in data:
            conv_id = conv.get("uuid") or conv.get("id")
            if not conv_id:
                continue
            conv_id = f"claude::{conv_id}"
            title = conv.get("name") or conv.get("title") or ""
            created = conv.get("created_at")
            updated = conv.get("updated_at")
            account = ""
            acc = conv.get("account")
            if isinstance(acc, dict):
                account = acc.get("uuid", "") or acc.get("email", "")
            elif isinstance(acc, str):
                account = acc

            messages_raw = conv.get("chat_messages") or conv.get("messages") or []
            messages = []
            char_count = 0
            for i, m in enumerate(messages_raw):
                sender = m.get("sender") or m.get("role") or "unknown"
                # Normalize text
                text = m.get("text")
                if not text:
                    content = m.get("content")
                    if isinstance(content, list):
                        parts = []
                        for c in content:
                            if isinstance(c, dict) and c.get("type") == "text":
                                parts.append(c.get("text", ""))
                        text = "\n".join(parts)
                    elif isinstance(content, str):
                        text = content
                text = (text or "").strip()
                if not text:
                    continue
                char_count += len(text)
                messages.append({
                    "idx": i,
                    "sender": sender,
                    "created_at": m.get("created_at"),
                    "text": text,
                })

            if not messages:
                continue

            first_human = next((m["text"] for m in messages if m["sender"] == "human"), "")
            last_msg = messages[-1]["text"]

            conn.execute("""
                INSERT OR REPLACE INTO conversations
                (id, source, account, title, created_at, updated_at, message_count, char_count,
                 first_human_msg, last_msg, raw_path, tier1_done, tier2_done)
                VALUES (?, 'claude', ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        COALESCE((SELECT tier1_done FROM conversations WHERE id=?), 0),
                        COALESCE((SELECT tier2_done FROM conversations WHERE id=?), 0))
            """, (conv_id, account, title, created, updated, len(messages), char_count,
                  first_human[:5000], last_msg[:5000], str(src[1]), conv_id, conv_id))

            # Replace messages
            conn.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
            for m in messages:
                conn.execute("""
                    INSERT INTO messages (conversation_id, idx, sender, created_at, text)
                    VALUES (?, ?, ?, ?, ?)
                """, (conv_id, m["idx"], m["sender"], m["created_at"], m["text"]))
            total += 1
        conn.commit()

    print(f"[claude] ingested {total} conversations")
    return total


def _flatten_gpt_mapping(mapping: dict) -> list:
    """ChatGPT mapping is a tree. Flatten to chronological list."""
    if not mapping:
        return []
    # Find root (no parent or parent not in mapping)
    nodes = mapping
    root_id = None
    for nid, node in nodes.items():
        if not node.get("parent"):
            root_id = nid
            break
    if not root_id:
        # fall back to any node
        root_id = next(iter(nodes))

    out = []
    # DFS following children, picking the longest path (most-developed branch)
    def walk(node_id):
        node = nodes.get(node_id)
        if not node:
            return
        msg = node.get("message")
        if msg:
            out.append(msg)
        children = node.get("children") or []
        if children:
            # follow first child (chronological in most exports)
            walk(children[0])

    walk(root_id)
    return out


def ingest_gpt_export(conn: sqlite3.Connection):
    """Parse ChatGPT conversations.json. Format:
    [
        {
            "id": "...",
            "title": "...",
            "create_time": float (unix),
            "update_time": float (unix),
            "mapping": { node_id: {message:{...}, parent: id|None, children: [ids]} }
        },
        ...
    ]
    Each message: {id, author:{role:"user"|"assistant"|"system"}, create_time, content:{parts:[...]} | content_type:"text"}
    """
    print(f"[gpt] scanning {CHATGPT_EXPORT_PATH}")
    sources = find_export_files(CHATGPT_EXPORT_PATH, ["conversations.json"])
    if not sources:
        print(f"  no conversations.json found at {CHATGPT_EXPORT_PATH}")
        return 0

    total = 0
    for src in sources:
        data = load_json_from_export(src)
        if not data:
            continue
        if isinstance(data, dict):
            data = data.get("conversations", []) or []

        for conv in data:
            conv_id = conv.get("id") or conv.get("conversation_id")
            if not conv_id:
                continue
            conv_id = f"gpt::{conv_id}"
            title = conv.get("title", "")

            def ts_to_iso(t):
                if not t:
                    return None
                try:
                    return datetime.fromtimestamp(float(t), tz=timezone.utc).isoformat()
                except Exception:
                    return None

            created = ts_to_iso(conv.get("create_time"))
            updated = ts_to_iso(conv.get("update_time"))

            messages_raw = _flatten_gpt_mapping(conv.get("mapping") or {})

            messages = []
            char_count = 0
            for i, m in enumerate(messages_raw):
                if not m:
                    continue
                author = m.get("author") or {}
                role = author.get("role") if isinstance(author, dict) else "unknown"
                if role == "user":
                    sender = "human"
                elif role == "assistant":
                    sender = "assistant"
                elif role == "system":
                    continue  # skip system messages
                else:
                    sender = role or "unknown"

                content = m.get("content") or {}
                text = ""
                if isinstance(content, dict):
                    parts = content.get("parts") or []
                    text_parts = []
                    for p in parts:
                        if isinstance(p, str):
                            text_parts.append(p)
                        elif isinstance(p, dict):
                            text_parts.append(p.get("text", "") or json.dumps(p)[:200])
                    text = "\n".join(text_parts)
                elif isinstance(content, str):
                    text = content

                text = (text or "").strip()
                if not text:
                    continue
                char_count += len(text)
                messages.append({
                    "idx": i,
                    "sender": sender,
                    "created_at": ts_to_iso(m.get("create_time")),
                    "text": text,
                })

            if not messages:
                continue

            first_human = next((m["text"] for m in messages if m["sender"] == "human"), "")
            last_msg = messages[-1]["text"]

            conn.execute("""
                INSERT OR REPLACE INTO conversations
                (id, source, account, title, created_at, updated_at, message_count, char_count,
                 first_human_msg, last_msg, raw_path, tier1_done, tier2_done)
                VALUES (?, 'gpt', '', ?, ?, ?, ?, ?, ?, ?, ?,
                        COALESCE((SELECT tier1_done FROM conversations WHERE id=?), 0),
                        COALESCE((SELECT tier2_done FROM conversations WHERE id=?), 0))
            """, (conv_id, title, created, updated, len(messages), char_count,
                  first_human[:5000], last_msg[:5000], str(src[1]), conv_id, conv_id))

            conn.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
            for m in messages:
                conn.execute("""
                    INSERT INTO messages (conversation_id, idx, sender, created_at, text)
                    VALUES (?, ?, ?, ?, ?)
                """, (conv_id, m["idx"], m["sender"], m["created_at"], m["text"]))
            total += 1
        conn.commit()

    print(f"[gpt] ingested {total} conversations")
    return total


def ingest_forensic_report(conn: sqlite3.Connection):
    """Walk the forensic report folder and catalog everything."""
    print(f"[forensic] scanning {FORENSIC_REPORT_PATH}")
    root = Path(FORENSIC_REPORT_PATH)
    if not root.exists():
        print(f"  path does not exist: {root}")
        return 0

    total = 0
    text_exts = {".md", ".txt", ".json", ".csv", ".log", ".yaml", ".yml", ".html", ".xml"}

    for p in root.rglob("*"):
        if not p.is_file():
            continue
        try:
            stat = p.stat()
        except OSError:
            continue
        ext = p.suffix.lower()
        preview = ""
        if ext in text_exts and stat.st_size < 5_000_000:
            try:
                with open(p, "r", encoding="utf-8", errors="replace") as f:
                    preview = f.read(4000)
            except Exception:
                preview = ""

        # Categorize by name/path hints
        path_str = str(p).lower()
        if "drive" in path_str or "google" in path_str:
            category = "drive"
        elif "git" in path_str or "commit" in path_str or "repo" in path_str:
            category = "git"
        elif "inventory" in path_str or "manifest" in path_str:
            category = "inventory"
        elif ext == ".md":
            category = "report"
        else:
            category = "other"

        conn.execute("""
            INSERT OR REPLACE INTO forensic_files (path, size, modified, ext, content_preview, category)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (str(p), stat.st_size,
              datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
              ext, preview, category))
        total += 1
    conn.commit()
    print(f"[forensic] cataloged {total} files")
    return total


def stage_ingest():
    conn = get_db()
    init_schema(conn)
    log_stage_start(conn, "ingest")
    n_claude = ingest_claude_export(conn)
    n_gpt = ingest_gpt_export(conn)
    n_forensic = ingest_forensic_report(conn)
    log_stage_end(conn, "ingest",
                  notes=f"claude={n_claude} gpt={n_gpt} forensic={n_forensic}")
    conn.close()
    print(f"\nIngest complete: {n_claude} Claude convs, {n_gpt} GPT convs, {n_forensic} forensic files")


# ============================================================
# LLM client
# ============================================================

def get_anthropic_client():
    try:
        from anthropic import Anthropic
    except ImportError:
        print("ERROR: anthropic library not installed. Run: pip install anthropic tqdm")
        sys.exit(1)
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY env var not set.")
        sys.exit(1)
    return Anthropic(api_key=api_key)


def llm_call(client, model: str, system: str, user: str, max_tokens: int = 1024) -> str:
    msg = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    out = []
    for block in msg.content:
        if hasattr(block, "text"):
            out.append(block.text)
    return "".join(out)


def truncate(s: str, n: int) -> str:
    if not s:
        return ""
    if len(s) <= n:
        return s
    return s[:n] + "...[truncated]"


# ============================================================
# STAGE 2: TIER-1 CATEGORIZATION (every conversation)
# ============================================================

TIER1_SYSTEM = """You are an analyst building a profile of how a specific producer named Daniel uses AI assistants. He produces a weekly Christian creation-science TV show called The Genesis Science Report at David Rives Ministries. He is a non-developer who uses AI heavily for: script writing, voice/tone control, guest research and outreach, graphics/lower-thirds copy, distribution pipeline design (YouTube, Rumble, RightNow Media, Fireside, StreamHoster), Rundown Creator automation, tool research, and general production operations.

For each conversation you analyze, output a compact JSON object with these fields:
- category: one of [script-writing, voice-tone, guest-research, graphics-lower-thirds, distribution-ops, rundown-creator, tool-research, automation-design, troubleshooting, planning-strategy, learning-explainer, personal-non-gsr, other]
- summary: 1 sentence in the past tense, e.g. "Researched X to do Y"
- tools_mentioned: array of product/tool names mentioned (e.g. ["n8n","Rundown Creator","ffmpeg"])
- intent: one of [build, research, draft, debug, learn, decide, vent, explore]
- difficulty_signal: true if the conversation shows friction, repeated attempts, frustration, or unresolved questions; false otherwise
- decision_signal: true if a real decision was made or recommended (tool selection, architecture choice, plan committed to); false otherwise

Output ONLY the JSON. No prose, no markdown fences."""


def select_tier1_excerpt(conn, conv_id: str, max_messages: int) -> str:
    rows = conn.execute(
        "SELECT sender, text FROM messages WHERE conversation_id = ? ORDER BY idx",
        (conv_id,)
    ).fetchall()
    if not rows:
        return ""
    if len(rows) <= max_messages:
        chosen = rows
    else:
        # First 2 + last (max-2)
        chosen = list(rows[:2]) + list(rows[-(max_messages-2):])
    lines = []
    for r in chosen:
        prefix = "USER" if r["sender"] == "human" else "AI"
        lines.append(f"[{prefix}]: {truncate(r['text'], MAX_CHARS_PER_MESSAGE)}")
    return "\n\n".join(lines)


def stage_categorize():
    conn = get_db()
    init_schema(conn)
    log_stage_start(conn, "categorize")

    try:
        from tqdm import tqdm
    except ImportError:
        def tqdm(x, **kw): return x

    client = get_anthropic_client()

    pending = conn.execute(
        "SELECT id, title FROM conversations WHERE tier1_done = 0 ORDER BY created_at DESC"
    ).fetchall()
    print(f"[tier1] {len(pending)} conversations to categorize")

    for row in tqdm(pending, desc="tier1"):
        conv_id = row["id"]
        excerpt = select_tier1_excerpt(conn, conv_id, MAX_MESSAGES_PER_CONV_TIER1)
        if not excerpt:
            conn.execute("UPDATE conversations SET tier1_done = 1 WHERE id = ?", (conv_id,))
            continue

        user_msg = f"TITLE: {row['title']}\n\nEXCERPT:\n{excerpt}"
        try:
            out = llm_call(client, TIER1_MODEL, TIER1_SYSTEM, user_msg, max_tokens=500)
            # Extract JSON
            j = _extract_json(out)
            category = j.get("category", "other")
            summary = j.get("summary", "")
            tools = json.dumps(j.get("tools_mentioned", []))
            difficulty = 1 if j.get("difficulty_signal") else 0
            decision = 1 if j.get("decision_signal") else 0
            # interestingness score: longer + difficulty + decision = more interesting
            mc = conn.execute("SELECT message_count, char_count FROM conversations WHERE id = ?", (conv_id,)).fetchone()
            score = (mc["char_count"] or 0) / 1000.0
            if difficulty:
                score += 20
            if decision:
                score += 30

            conn.execute("""
                UPDATE conversations
                SET tier1_category = ?, tier1_summary = ?, tier1_tools_mentioned = ?,
                    tier1_done = 1, interestingness = ?
                WHERE id = ?
            """, (category, summary, tools, score, conv_id))
            conn.commit()
        except Exception as e:
            print(f"  WARN: tier1 failed for {conv_id}: {e}", file=sys.stderr)
            continue

    log_stage_end(conn, "categorize", notes=f"processed={len(pending)}")
    conn.close()


def _extract_json(s: str) -> dict:
    """Tolerant JSON extraction - handles markdown fences, prose around JSON."""
    s = s.strip()
    if s.startswith("```"):
        s = re.sub(r"^```(?:json)?\s*", "", s)
        s = re.sub(r"\s*```$", "", s)
    # Find first { and last }
    a = s.find("{")
    b = s.rfind("}")
    if a >= 0 and b > a:
        s = s[a:b+1]
    try:
        return json.loads(s)
    except Exception:
        return {}


# ============================================================
# STAGE 3: CLUSTER (lightweight - group by category + tools)
# ============================================================

def stage_cluster():
    conn = get_db()
    log_stage_start(conn, "cluster")

    # Aggregate by category
    rows = conn.execute("""
        SELECT tier1_category, COUNT(*) as n, AVG(char_count) as avg_chars
        FROM conversations
        WHERE tier1_done = 1
        GROUP BY tier1_category
        ORDER BY n DESC
    """).fetchall()
    print("\n[cluster] category breakdown:")
    for r in rows:
        print(f"  {r['tier1_category']:30s} {r['n']:5d}  avg_chars={int(r['avg_chars'] or 0)}")

    # Top tools mentioned
    tool_counter = Counter()
    for r in conn.execute("SELECT tier1_tools_mentioned FROM conversations WHERE tier1_tools_mentioned IS NOT NULL"):
        try:
            for t in json.loads(r["tier1_tools_mentioned"]):
                tool_counter[t.lower()] += 1
        except Exception:
            pass
    print("\n[cluster] top tools mentioned:")
    for t, n in tool_counter.most_common(30):
        print(f"  {t:30s} {n}")

    log_stage_end(conn, "cluster")
    conn.close()


# ============================================================
# STAGE 4: TIER-2 DEEP ANALYSIS (top N interesting)
# ============================================================

TIER2_SYSTEM = """You are doing deep analysis on a single conversation between Daniel (broadcast TV producer at David Rives Ministries, runs The Genesis Science Report) and an AI assistant. Output a JSON object:

{
  "what_was_attempted": "1-2 sentence description of what Daniel was trying to do",
  "outcome": "succeeded" | "partially-succeeded" | "blocked" | "unclear",
  "key_decisions": ["bullet of any decision made"],
  "tools_evaluated": ["any tool/library/service evaluated"],
  "friction_points": ["bullet of any difficulty, repeated attempt, frustration, or unresolved question"],
  "reusable_insight": "1 sentence: something extracted from this conversation that would help future AI sessions help Daniel better. Empty string if none.",
  "automation_candidate": "if Daniel was doing something manually that could be automated, describe in 1 sentence. Empty string if not applicable."
}

Output ONLY the JSON, no prose."""


def stage_deep_analyze():
    conn = get_db()
    log_stage_start(conn, "deep")

    try:
        from tqdm import tqdm
    except ImportError:
        def tqdm(x, **kw): return x

    client = get_anthropic_client()

    pending = conn.execute("""
        SELECT id, title FROM conversations
        WHERE tier1_done = 1 AND tier2_done = 0
        ORDER BY interestingness DESC
        LIMIT ?
    """, (TIER2_TOP_N,)).fetchall()
    print(f"[tier2] deep-analyzing top {len(pending)} conversations")

    for row in tqdm(pending, desc="tier2"):
        conv_id = row["id"]
        # Get the full conversation, truncated per-message
        msgs = conn.execute(
            "SELECT sender, text FROM messages WHERE conversation_id = ? ORDER BY idx",
            (conv_id,)
        ).fetchall()
        # Cap total at ~30k chars
        budget = 30_000
        excerpt_parts = []
        for m in msgs:
            t = truncate(m["text"], MAX_CHARS_PER_MESSAGE)
            block = f"[{'USER' if m['sender'] == 'human' else 'AI'}]: {t}"
            if budget - len(block) < 0:
                excerpt_parts.append("[...remaining conversation truncated...]")
                break
            excerpt_parts.append(block)
            budget -= len(block)
        excerpt = "\n\n".join(excerpt_parts)

        user_msg = f"TITLE: {row['title']}\n\nFULL CONVERSATION:\n{excerpt}"
        try:
            out = llm_call(client, TIER2_MODEL, TIER2_SYSTEM, user_msg, max_tokens=1500)
            j = _extract_json(out)
            conn.execute(
                "UPDATE conversations SET tier2_deep_analysis = ?, tier2_done = 1 WHERE id = ?",
                (json.dumps(j), conv_id)
            )
            conn.commit()
        except Exception as e:
            print(f"  WARN: tier2 failed for {conv_id}: {e}", file=sys.stderr)
            continue

    log_stage_end(conn, "deep", notes=f"processed={len(pending)}")
    conn.close()


# ============================================================
# STAGE 5: EXTRACT ARTIFACTS
# ============================================================

def write_md(name: str, content: str):
    p = Path(OUTPUT_DIR) / name
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  wrote {p}")


def stage_extract():
    conn = get_db()
    log_stage_start(conn, "extract")

    client = get_anthropic_client()

    # ----- stats.md -----
    total = conn.execute("SELECT COUNT(*) AS n FROM conversations").fetchone()["n"]
    by_source = conn.execute("SELECT source, COUNT(*) AS n FROM conversations GROUP BY source").fetchall()
    by_cat = conn.execute("""
        SELECT tier1_category, COUNT(*) AS n FROM conversations
        WHERE tier1_done = 1 GROUP BY tier1_category ORDER BY n DESC
    """).fetchall()
    by_intent = conn.execute("""
        SELECT json_extract(tier2_deep_analysis,'$.outcome') AS outcome, COUNT(*) AS n
        FROM conversations WHERE tier2_done = 1
        GROUP BY outcome ORDER BY n DESC
    """).fetchall()
    forensic = conn.execute("SELECT category, COUNT(*) AS n FROM forensic_files GROUP BY category").fetchall()

    lines = ["# Stats", "",
             f"- Total conversations: **{total}**"]
    for r in by_source:
        lines.append(f"  - {r['source']}: {r['n']}")
    lines.append("")
    lines.append("## Conversation categories")
    lines.append("| Category | Count |")
    lines.append("|---|---|")
    for r in by_cat:
        lines.append(f"| {r['tier1_category'] or 'uncategorized'} | {r['n']} |")
    lines.append("")
    lines.append("## Deep analysis outcomes (top-N tier-2)")
    lines.append("| Outcome | Count |")
    lines.append("|---|---|")
    for r in by_intent:
        lines.append(f"| {r['outcome'] or 'unknown'} | {r['n']} |")
    lines.append("")
    lines.append("## Forensic report files")
    lines.append("| Category | Count |")
    lines.append("|---|---|")
    for r in forensic:
        lines.append(f"| {r['category']} | {r['n']} |")
    write_md("stats.md", "\n".join(lines))

    # ----- topic_clusters.md -----
    lines = ["# Topic Clusters", "",
             "Top conversation categories with sample titles.", ""]
    for r in by_cat:
        cat = r["tier1_category"]
        lines.append(f"## {cat} ({r['n']})")
        samples = conn.execute("""
            SELECT title, tier1_summary FROM conversations
            WHERE tier1_category = ? AND tier1_summary IS NOT NULL AND tier1_summary != ''
            ORDER BY interestingness DESC LIMIT 10
        """, (cat,)).fetchall()
        for s in samples:
            lines.append(f"- **{s['title']}** — {s['tier1_summary']}")
        lines.append("")
    write_md("topic_clusters.md", "\n".join(lines))

    # ----- Aggregate tier-2 findings into bullet pools -----
    decisions = []
    frictions = []
    automations = []
    insights = []
    tools_pool = Counter()

    for r in conn.execute("""
        SELECT title, tier2_deep_analysis, tier1_tools_mentioned, created_at
        FROM conversations WHERE tier2_done = 1
    """):
        try:
            t = json.loads(r["tier2_deep_analysis"] or "{}")
        except Exception:
            continue
        title = r["title"]
        for d in t.get("key_decisions", []) or []:
            if d and len(d) > 5:
                decisions.append((title, d, r["created_at"]))
        for f in t.get("friction_points", []) or []:
            if f and len(f) > 5:
                frictions.append((title, f, r["created_at"]))
        a = t.get("automation_candidate", "")
        if a and len(a) > 5:
            automations.append((title, a, r["created_at"]))
        ins = t.get("reusable_insight", "")
        if ins and len(ins) > 5:
            insights.append((title, ins, r["created_at"]))
        try:
            for tool in json.loads(r["tier1_tools_mentioned"] or "[]"):
                tools_pool[tool.lower()] += 1
        except Exception:
            pass

    # ----- decision_log.md -----
    lines = ["# Decision Log",
             "",
             "Significant decisions extracted from deep-analyzed conversations.",
             ""]
    for title, d, dt in decisions:
        lines.append(f"- ({dt or '?'}) **{title}** — {d}")
    write_md("decision_log.md", "\n".join(lines))

    # ----- automation_candidates.md -----
    lines = ["# Automation Candidates",
             "",
             "Manual tasks worth automating, surfaced from your conversations.",
             ""]
    for title, a, dt in automations:
        lines.append(f"- **{title}** — {a}")
    write_md("automation_candidates.md", "\n".join(lines))

    # ----- recurring_difficulties.md -----
    lines = ["# Recurring Difficulties",
             "",
             "Friction points and consistent struggles across conversations.",
             ""]
    for title, f, dt in frictions:
        lines.append(f"- **{title}** — {f}")
    write_md("recurring_difficulties.md", "\n".join(lines))

    # ----- ai_usage_profile.md (synthesized by Opus) -----
    print("[extract] synthesizing AI usage profile via Opus...")
    sample_bullets = "\n".join([f"- {f}" for _, f, _ in frictions[:60]])
    sample_decisions = "\n".join([f"- {d}" for _, d, _ in decisions[:60]])
    sample_insights = "\n".join([f"- {i}" for _, i, _ in insights[:60]])
    top_tools = ", ".join([f"{t} ({n})" for t, n in tools_pool.most_common(30)])
    cat_table = "\n".join([f"- {r['tier1_category']}: {r['n']}" for r in by_cat])

    synthesis_prompt = f"""Below are extracts from analysis of Daniel's conversations with Claude and ChatGPT (broadcast TV producer at David Rives Ministries). Synthesize a personal profile of HOW he uses AI: his preferences, the patterns he falls into, what works well for him, what causes friction, and what AI assistants should know about him to be maximally useful.

CATEGORY BREAKDOWN:
{cat_table}

TOP TOOLS HE TALKS ABOUT:
{top_tools}

FRICTION POINTS (sample):
{sample_bullets}

DECISIONS HE'S MADE (sample):
{sample_decisions}

REUSABLE INSIGHTS (sample):
{sample_insights}

Output a markdown document with these sections:
# AI Usage Profile

## How Daniel uses AI
[2-3 paragraphs of observed patterns]

## What works well for him
[bulleted list]

## What causes friction
[bulleted list]

## Communication preferences observed
[bulleted list of style/format preferences inferred from the data]

## Recurring blind spots
[areas where the same difficulty appears repeatedly]

## Recommended adjustments for AI assistants
[concrete, actionable guidance for any future Claude/GPT session helping Daniel]

Be specific, cite patterns not platitudes. No filler. No hedging."""

    try:
        profile = llm_call(client, SYNTHESIS_MODEL,
                           "You are a careful analyst. Output only the requested markdown.",
                           synthesis_prompt, max_tokens=4000)
        write_md("ai_usage_profile.md", profile)
    except Exception as e:
        print(f"  WARN: profile synthesis failed: {e}")
        write_md("ai_usage_profile.md", f"# AI Usage Profile\n\n_Synthesis failed: {e}_\n")

    # ----- CLAUDE.md (synthesized by Opus) -----
    print("[extract] synthesizing CLAUDE.md via Opus...")
    claude_md_prompt = f"""Generate a CLAUDE.md file that Daniel can drop into any future Claude session (or store as project knowledge) to give it the context it needs to be maximally helpful from message one. The file should be self-contained, specific to him, and free of generic AI-assistant boilerplate.

CATEGORY BREAKDOWN (what he uses AI for):
{cat_table}

TOP TOOLS:
{top_tools}

REUSABLE INSIGHTS:
{sample_insights}

DECISIONS MADE:
{sample_decisions}

FRICTION POINTS:
{sample_bullets}

The CLAUDE.md must include:
- A one-paragraph identity statement (who he is, what he produces)
- A "What to do" section: how to communicate with him (format, tone, brevity)
- A "What he's building" section: his automation roadmap and active projects, derived from the data
- A "Locked references" section: any verbatim phrases, conventions, or constraints surfaced from the data
- A "Common pitfalls when helping Daniel" section: things to avoid based on observed friction
- A "Default to" section: when in doubt, do X

Keep it under 1500 words. No fluff."""

    try:
        claude_md = llm_call(client, SYNTHESIS_MODEL,
                             "You write concise, useful context documents. Output only the requested markdown.",
                             claude_md_prompt, max_tokens=4000)
        write_md("CLAUDE.md", claude_md)
    except Exception as e:
        print(f"  WARN: CLAUDE.md synthesis failed: {e}")
        write_md("CLAUDE.md", f"# CLAUDE.md\n\n_Synthesis failed: {e}_\n")

    log_stage_end(conn, "extract")
    conn.close()
    print(f"\nAll artifacts written to {OUTPUT_DIR}")


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="AI Conversation Archaeology")
    parser.add_argument("stage", nargs="?", default="all",
                        choices=["ingest", "categorize", "cluster", "deep", "extract", "all"])
    args = parser.parse_args()

    ensure_output_dir()

    if args.stage in ("ingest", "all"):
        print("\n=== STAGE 1: INGEST ===")
        stage_ingest()
    if args.stage in ("categorize", "all"):
        print("\n=== STAGE 2: TIER-1 CATEGORIZATION ===")
        stage_categorize()
    if args.stage in ("cluster", "all"):
        print("\n=== STAGE 3: CLUSTER ===")
        stage_cluster()
    if args.stage in ("deep", "all"):
        print("\n=== STAGE 4: TIER-2 DEEP ANALYSIS ===")
        stage_deep_analyze()
    if args.stage in ("extract", "all"):
        print("\n=== STAGE 5: EXTRACT ARTIFACTS ===")
        stage_extract()

    print("\nDone.")


if __name__ == "__main__":
    main()
