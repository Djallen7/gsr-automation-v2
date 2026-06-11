# Transcript pull kit (run on your Mac, ~10 minutes of your attention)

Why this exists: the cloud research session is IP-blocked by YouTube for transcript pulls
(live-tested 2026-06-11). Your Mac's home IP is not. This kit pulls captions for all 99 seed
videos in `urls.txt`, resumable, one command after setup.

## Step 1 — one-time setup (Terminal)

```bash
brew install yt-dlp ffmpeg
cd ~/Documents/GitHub/gsr-automation-v2/docs/_handoff/2026-06-11-transcript-pull-kit
```

## Step 2 — the pull (safe to re-run; it skips what is already done)

Quit Chrome first if you use the Chrome line. Firefox needs no quitting.

```bash
yt-dlp --write-auto-subs --write-subs --sub-langs en --skip-download \
  --sub-format vtt --cookies-from-browser firefox \
  --download-archive done.txt --sleep-requests 2 \
  -a urls.txt -o "transcripts/%(id)s.%(ext)s"
```

No Firefox? Use `--cookies-from-browser chrome` with Chrome fully quit (Chrome running =
encrypted cookies = failure). It takes a while with the polite 2-second sleeps; let it run.

## Step 3 — if a chunk of videos fail with "PO token" or 403 errors

Run the token provider, then re-run Step 2 (it resumes where it left off):

```bash
docker run -d -p 4416:4416 brainicism/bgutil-ytdlp-pot-provider
pip install -U bgutil-ytdlp-pot-provider
```

No Docker? Skip it and tell the session which videos failed; rung 8 (local Whisper) or a
paid rung (your one-tap yes) catches the stragglers.

## Step 4 — hand the results back

```bash
git checkout claude/vigilant-ramanujan-kt4fdc && git pull
git add docs/_handoff/2026-06-11-transcript-pull-kit/transcripts docs/_handoff/2026-06-11-transcript-pull-kit/done.txt
git commit -m "transcripts: seed-corpus caption pull from Mac" && git push
```

Then tell any session: "transcripts are in, resume R1 mining." It takes over from there
(mining, claim ledger, R6 lead expansion).
