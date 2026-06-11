import re, pathlib
for vtt in pathlib.Path("transcripts").glob("*.vtt"):
    lines, seen, out = vtt.read_text(errors="ignore").splitlines(), set(), []
    for ln in lines:
        ln = re.sub(r"<[^>]+>", "", ln).strip()
        if (not ln or "-->" in ln or ln == "WEBVTT" or ln.isdigit()
            or ln.startswith(("Kind:", "Language:", "NOTE"))): continue
        if ln not in seen:
            seen.add(ln); out.append(ln)
    vtt.with_suffix(".txt").write_text("\n".join(out))
print("done")
