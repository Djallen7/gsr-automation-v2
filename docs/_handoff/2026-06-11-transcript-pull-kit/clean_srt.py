import re, json, pathlib
src = pathlib.Path.home() / "Downloads" / "Nate Herk - Video Database" / "Transcripts"
kit = pathlib.Path("docs/_handoff/2026-06-11-transcript-pull-kit")
dst = kit / "transcripts"; dst.mkdir(exist_ok=True)
q = json.load(open("docs/_handoff/2026-06-11-video-research-queue.json"))
ids = [re.search(r"(?:youtu\.be/|watch\?v=)([\w-]{6,})", v["url"]).group(1) for v in q["videos"]]
n = 0
for srt in src.glob("*.srt"):
    vid = next((i for i in ids if i in srt.name), None)
    if not vid or (dst / f"{vid}.txt").exists(): continue
    lines, seen, out = srt.read_text(errors="ignore").splitlines(), set(), []
    for ln in lines:
        ln = re.sub(r"<[^>]+>", "", ln).strip()
        if not ln or "-->" in ln or ln.isdigit(): continue
        if ln not in seen: seen.add(ln); out.append(ln)
    (dst / f"{vid}.txt").write_text("\n".join(out)); n += 1
print("converted", n, "| total txt now", len(list(dst.glob("*.txt"))))
