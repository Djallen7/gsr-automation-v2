#!/usr/bin/env python3
"""
GSR Email Voice Extractor
Pulls all sent emails from the Apple Mail export folder, groups by recipient,
and builds relationship-tier data for voice model analysis.

Usage:
    python3 extract_email_voice.py

Output:
    ~/Downloads/gsr_email_voice_data.json
"""

import os
import json
import email
import mailbox
from pathlib import Path
from collections import defaultdict

FOLDER = Path("/Users/claudefix/Downloads/Email")
OUTPUT = Path("/Users/claudefix/Downloads/gsr_email_voice_data.json")
FROM_ADDR = "dallen@davidrives.com"


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


def clean_addr(addr):
    if "<" in addr:
        return addr.split("<")[1].rstrip(">").strip().lower()
    return addr.strip().lower()


def strip_quoted_reply(body):
    """Remove quoted reply lines (lines starting with >) and trailing signatures."""
    lines = []
    for line in body.splitlines():
        stripped = line.strip()
        if stripped.startswith(">"):
            continue
        if stripped.startswith("On ") and " wrote:" in stripped:
            break  # everything below is quoted
        if stripped in ("--", "---", "____"):
            break  # signature block
        lines.append(line)
    return "\n".join(lines).strip()


def process_msg(msg):
    frm = msg.get("From", "")
    if FROM_ADDR not in frm:
        return None

    to_raw = msg.get("To", "") or ""
    subj = msg.get("Subject", "") or ""
    date = msg.get("Date", "") or ""
    raw_body = get_body(msg)
    body = strip_quoted_reply(raw_body)

    if len(body.strip()) < 40:
        return None  # skip near-empty emails

    recipients = [
        clean_addr(a)
        for a in to_raw.replace(";", ",").split(",")
        if "@" in a
    ]

    return {
        "date": date,
        "to": to_raw,
        "subject": subj,
        "body": body[:4000],
        "word_count": len(body.split()),
        "recipients": recipients,
    }


def main():
    if not FOLDER.exists():
        print(f"ERROR: Email folder not found at {FOLDER}")
        print("Check the path and try again.")
        return

    print(f"Scanning {FOLDER} ...")
    all_sent = []
    by_recipient = defaultdict(list)
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
                            all_sent.append(record)
                            for r in record["recipients"]:
                                by_recipient[r].append(record)
                    file_count += 1
                except Exception as e:
                    error_count += 1

            elif fname.endswith(".emlx"):
                try:
                    with open(fpath, "rb") as f:
                        content = f.read()
                    nl = content.index(b"\n")
                    msg = email.message_from_bytes(content[nl + 1:])
                    record = process_msg(msg)
                    if record:
                        all_sent.append(record)
                        for r in record["recipients"]:
                            by_recipient[r].append(record)
                    file_count += 1
                except Exception:
                    error_count += 1

    print(f"Processed {file_count} files ({error_count} errors)")
    print(f"Found {len(all_sent)} sent emails to {len(by_recipient)} recipients")

    # Build relationship tiers
    relationship_data = []
    for addr, msgs in by_recipient.items():
        msgs_sorted = sorted(msgs, key=lambda x: x["date"])
        count = len(msgs_sorted)

        if count == 1:
            tier = "new"
        elif count <= 5:
            tier = "establishing"
        elif count <= 15:
            tier = "established"
        else:
            tier = "recurring"

        relationship_data.append({
            "recipient": addr,
            "email_count": count,
            "tier": tier,
            "first_email": msgs_sorted[0],
            "most_recent": msgs_sorted[-1],
            "sample_middle": msgs_sorted[count // 2] if count > 2 else None,
            "all_emails": msgs_sorted,  # full history per recipient
        })

    relationship_data.sort(key=lambda x: -x["email_count"])

    tier_counts = {
        "new": len([r for r in relationship_data if r["tier"] == "new"]),
        "establishing": len([r for r in relationship_data if r["tier"] == "establishing"]),
        "established": len([r for r in relationship_data if r["tier"] == "established"]),
        "recurring": len([r for r in relationship_data if r["tier"] == "recurring"]),
    }

    output = {
        "total_sent": len(all_sent),
        "unique_recipients": len(by_recipient),
        "relationship_tiers": tier_counts,
        "relationships": relationship_data,
        "all_sent_chronological": sorted(all_sent, key=lambda x: x["date"]),
    }

    with open(OUTPUT, "w") as f:
        json.dump(output, f, indent=2)

    size_mb = OUTPUT.stat().st_size / 1024 / 1024
    print(f"\nDone. Output saved to: {OUTPUT}")
    print(f"File size: {size_mb:.1f} MB")
    print(f"Relationship tiers: {tier_counts}")
    print("\nTop 10 most-contacted recipients:")
    for r in relationship_data[:10]:
        print(f"  {r['recipient']}: {r['email_count']} emails ({r['tier']})")


if __name__ == "__main__":
    main()
