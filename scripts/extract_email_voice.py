#!/usr/bin/env python3
"""
GSR Email Voice Extractor — Full Thread Edition
Extracts complete email threads (both directions) to map Daniel's conditional
response behavior: what came in, what he decided to say back, and how much.

Voice modeling requires pairs, not isolated outgoing emails.

Usage:
    python3 extract_email_voice.py

Output:
    ~/Downloads/gsr_email_voice_data.json
"""

import os
import json
import email
import mailbox
import re
from pathlib import Path
from collections import defaultdict
from email.utils import parsedate_to_datetime

FOLDER = Path("/Users/claudefix/Downloads/Email")
OUTPUT = Path("/Users/claudefix/Downloads/gsr_email_voice_data.json")

DANIEL_ADDRS = {"dallen@davidrives.com", "danielallen.tn@gmail.com"}


# ─── Body extraction ──────────────────────────────────────────────────────────

def get_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    return part.get_payload(decode=True).decode("utf-8", errors="replace")
                except Exception:
                    pass
    else:
        try:
            return msg.get_payload(decode=True).decode("utf-8", errors="replace")
        except Exception:
            return str(msg.get_payload())
    return ""


def strip_quoted(body):
    """Remove quoted reply lines and signature blocks."""
    lines = []
    for line in body.splitlines():
        s = line.strip()
        if s.startswith(">"):
            continue
        if s.startswith("On ") and " wrote:" in s:
            break
        if re.match(r"^-{2,}$|^_{2,}$", s):
            break
        if s in ("Best,", "Best regards,", "Thanks,", "Regards,"):
            lines.append(line)
            break  # keep sign-off line but stop there
        lines.append(line)
    return "\n".join(lines).strip()


def clean_addr(addr):
    if not addr:
        return ""
    if "<" in addr:
        return addr.split("<")[1].rstrip(">").strip().lower()
    return addr.strip().lower()


def addr_list(raw):
    if not raw:
        return []
    return [clean_addr(a) for a in raw.replace(";", ",").split(",") if "@" in a]


def is_daniel(addr):
    return clean_addr(addr) in DANIEL_ADDRS


def parse_date(date_str):
    try:
        return parsedate_to_datetime(date_str).isoformat()
    except Exception:
        return date_str or ""


def classify_incoming(subject, body, word_count):
    """Rough classification of what kind of email Daniel received."""
    subj_lower = (subject or "").lower()
    body_lower = (body or "").lower()

    if word_count < 30:
        length_class = "very_short"
    elif word_count < 80:
        length_class = "short"
    elif word_count < 200:
        length_class = "medium"
    else:
        length_class = "long"

    if any(k in subj_lower or k in body_lower for k in ["confirm", "confirmed", "sounds good", "works for me", "perfect"]):
        msg_type = "confirmation"
    elif any(k in subj_lower or k in body_lower for k in ["unable", "decline", "can't", "cannot", "won't be able", "not available", "pass"]):
        msg_type = "decline"
    elif any(k in subj_lower or k in body_lower for k in ["question", "?", "what is", "how do", "can you", "could you", "wondering"]):
        msg_type = "question"
    elif any(k in subj_lower or k in body_lower for k in ["reschedule", "change", "postpone", "delay", "move"]):
        msg_type = "reschedule"
    elif any(k in subj_lower or k in body_lower for k in ["thank", "appreciate", "grateful", "enjoyed"]):
        msg_type = "thanks"
    elif any(k in subj_lower or k in body_lower for k in ["zoom", "link", "join", "meeting id"]):
        msg_type = "logistics"
    else:
        msg_type = "other"

    return {"type": msg_type, "length_class": length_class}


def classify_response(body, word_count):
    if word_count < 20:
        return "minimal"       # 1-2 sentences, almost a text
    elif word_count < 60:
        return "brief"         # 2-4 sentences
    elif word_count < 150:
        return "standard"      # paragraph or two
    else:
        return "extended"      # went long, in-depth


# ─── Parse all messages ───────────────────────────────────────────────────────

def process_msg(msg):
    frm = msg.get("From", "") or ""
    to_raw = msg.get("To", "") or ""
    cc_raw = msg.get("Cc", "") or ""
    subj = msg.get("Subject", "") or ""
    date_raw = msg.get("Date", "") or ""
    msg_id = msg.get("Message-ID", "") or ""
    in_reply_to = msg.get("In-Reply-To", "") or ""
    references = msg.get("References", "") or ""

    raw_body = get_body(msg)
    body = strip_quoted(raw_body)

    if len(body.strip()) < 20:
        return None

    from_addr = clean_addr(frm)
    to_addrs = addr_list(to_raw)
    cc_addrs = addr_list(cc_raw)
    all_recipients = to_addrs + cc_addrs

    direction = "sent" if is_daniel(from_addr) else "received"

    # Only keep emails that involve Daniel
    daniel_involved = is_daniel(from_addr) or any(is_daniel(a) for a in all_recipients)
    if not daniel_involved:
        return None

    word_count = len(body.split())

    return {
        "msg_id": msg_id.strip(),
        "in_reply_to": in_reply_to.strip(),
        "references": references.strip(),
        "date": parse_date(date_raw),
        "direction": direction,
        "from": from_addr,
        "to": to_raw,
        "subject": subj,
        "body": body[:4000],
        "word_count": word_count,
    }


# ─── Thread assembly ──────────────────────────────────────────────────────────

def normalize_subject(subj):
    """Strip Re:/Fwd: prefixes to find thread root subject."""
    return re.sub(r"^(re|fwd|fw):\s*", "", (subj or "").lower().strip(), flags=re.IGNORECASE).strip()


def build_threads(all_messages):
    """
    Group messages into threads by subject + participants.
    Falls back to subject matching if Message-ID chains are incomplete.
    """
    threads = defaultdict(list)

    # First pass: group by normalized subject
    for msg in all_messages:
        key = normalize_subject(msg["subject"])
        threads[key].append(msg)

    # Sort each thread by date
    result = []
    for key, msgs in threads.items():
        msgs_sorted = sorted(msgs, key=lambda x: x["date"])
        if len(msgs_sorted) < 1:
            continue

        # Extract participants
        participants = set()
        for m in msgs_sorted:
            participants.add(m["from"])
            for a in addr_list(m["to"]):
                participants.add(a)
        participants.discard("")

        non_daniel = [p for p in participants if not is_daniel(p)]
        daniel_msgs = [m for m in msgs_sorted if m["direction"] == "sent"]
        received_msgs = [m for m in msgs_sorted if m["direction"] == "received"]

        if not daniel_msgs:
            continue  # skip threads where Daniel never sent anything

        # Build response pairs: (incoming, daniel_response) for each of Daniel's replies
        pairs = []
        for i, dmsg in enumerate(msgs_sorted):
            if dmsg["direction"] != "sent":
                continue

            # Find the most recent received message before this sent message
            preceding = [
                m for m in msgs_sorted
                if m["direction"] == "received" and m["date"] < dmsg["date"]
            ]
            trigger = preceding[-1] if preceding else None

            incoming_class = classify_incoming(
                trigger["subject"] if trigger else "",
                trigger["body"] if trigger else "",
                trigger["word_count"] if trigger else 0
            ) if trigger else {"type": "new_thread", "length_class": "n/a"}

            response_class = classify_response(dmsg["body"], dmsg["word_count"])

            pairs.append({
                "trigger": trigger,
                "response": dmsg,
                "incoming_type": incoming_class["type"],
                "incoming_length": incoming_class["length_class"],
                "response_length_class": response_class,
                "thread_position": i,
                "thread_total_length": len(msgs_sorted),
            })

        result.append({
            "thread_subject": msgs_sorted[0]["subject"],
            "normalized_subject": key,
            "message_count": len(msgs_sorted),
            "daniel_sent_count": len(daniel_msgs),
            "received_count": len(received_msgs),
            "participants": list(non_daniel),
            "date_first": msgs_sorted[0]["date"],
            "date_last": msgs_sorted[-1]["date"],
            "full_thread": msgs_sorted,
            "response_pairs": pairs,
        })

    return result


def assign_relationship_tiers(threads):
    """Count Daniel's sent emails per external recipient across all threads."""
    per_recipient = defaultdict(list)

    for thread in threads:
        for pair in thread["response_pairs"]:
            for addr in addr_list(thread["response_pairs"][0]["response"]["to"] if thread["response_pairs"] else ""):
                if not is_daniel(addr):
                    per_recipient[addr].append(pair["response"])

    tiers = {}
    for addr, msgs in per_recipient.items():
        count = len(msgs)
        if count == 1:
            tier = "new"
        elif count <= 5:
            tier = "establishing"
        elif count <= 15:
            tier = "established"
        else:
            tier = "recurring"
        tiers[addr] = {"count": count, "tier": tier}

    return tiers


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not FOLDER.exists():
        print(f"ERROR: Email folder not found at {FOLDER}")
        return

    print(f"Scanning {FOLDER} ...")
    all_messages = []
    file_count = 0
    error_count = 0

    for root, dirs, files in os.walk(FOLDER):
        for fname in files:
            fpath = Path(root) / fname

            if fname.endswith(".mbox"):
                try:
                    for msg in mailbox.mbox(fpath):
                        record = process_msg(msg)
                        if record:
                            all_messages.append(record)
                    file_count += 1
                except Exception as e:
                    error_count += 1
                    print(f"  mbox error {fpath.name}: {e}")

            elif fname.endswith(".emlx"):
                try:
                    with open(fpath, "rb") as f:
                        content = f.read()
                    nl = content.index(b"\n")
                    msg = email.message_from_bytes(content[nl + 1:])
                    record = process_msg(msg)
                    if record:
                        all_messages.append(record)
                    file_count += 1
                except Exception:
                    error_count += 1

    print(f"Processed {file_count} files ({error_count} errors)")
    print(f"Total messages (both directions): {len(all_messages)}")

    sent = [m for m in all_messages if m["direction"] == "sent"]
    received = [m for m in all_messages if m["direction"] == "received"]
    print(f"  Sent by Daniel: {len(sent)}")
    print(f"  Received: {len(received)}")

    print("Assembling threads...")
    threads = build_threads(all_messages)
    print(f"Threads assembled: {len(threads)}")

    relationship_tiers = assign_relationship_tiers(threads)
    tier_counts = defaultdict(int)
    for v in relationship_tiers.values():
        tier_counts[v["tier"]] += 1

    # Response pattern summary for quick analysis
    all_pairs = []
    for thread in threads:
        for pair in thread["response_pairs"]:
            all_pairs.append({
                "incoming_type": pair["incoming_type"],
                "incoming_length": pair["incoming_length"],
                "response_length_class": pair["response_length_class"],
                "response_word_count": pair["response"]["word_count"],
                "thread_length": pair["thread_total_length"],
                "thread_position": pair["thread_position"],
                "participants": thread["participants"],
            })

    output = {
        "summary": {
            "total_messages": len(all_messages),
            "sent_by_daniel": len(sent),
            "received": len(received),
            "threads": len(threads),
            "response_pairs": len(all_pairs),
            "unique_recipients": len(relationship_tiers),
            "relationship_tiers": dict(tier_counts),
        },
        "relationship_tiers": relationship_tiers,
        "threads": threads,
        "response_pairs_flat": all_pairs,
    }

    with open(OUTPUT, "w") as f:
        json.dump(output, f, indent=2)

    size_mb = OUTPUT.stat().st_size / 1024 / 1024
    print(f"\nOutput: {OUTPUT}")
    print(f"File size: {size_mb:.1f} MB")
    print(f"Summary: {output['summary']}")

    print("\nTop 15 most-contacted recipients:")
    top = sorted(relationship_tiers.items(), key=lambda x: -x[1]["count"])[:15]
    for addr, info in top:
        print(f"  {addr}: {info['count']} emails ({info['tier']})")


if __name__ == "__main__":
    main()
