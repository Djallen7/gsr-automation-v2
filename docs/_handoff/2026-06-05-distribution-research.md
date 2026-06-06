# Distribution Research Brief (June 2026)

**Compiled** 2026-06-05 from a 4-agent web-research pass (Rumble, YouTube, multi-platform/clips, podcast/GSN/setup), each adversarial about vendor claims. Every line carries a verdict and sources. Feeds the rebuild of the Distribution module (M9) and the AUTOMATION_ROADMAP.

## RECONCILIATION (added 2026-06-06): this web brief is NOT the platform list

This brief was a web-research pass and it OMITTED established GSR targets that live in the repo. The authoritative platform list is the live `distributions.platform` enum + `config/production.json` + **GSR-WORKFLOW-CANON.md section 11 (Established Distribution Stack & Vendor Registry)** — read that first. Targets this brief missed: **StreamHoster** (FTPS; one upload feeds Roku, Apple TV, iOS app, LG TV; exists because YouTube caps tvOS embeds at 480p); **Signiant Media Shuttle -> Real Life Network** (= RightNow Media; -20 LKFS audio normalization; 1200x1800 thumbnail); **Dropbox** network-partner station delivery; **Genesis Science Network** web/OTT (Roku Direct Publisher feed). Status of the other names (Daniel, gospel 2026-06-06): **GodTube is retired**; **OTA broadcast is fed FROM the Dropbox drop** (not a separate target); **TBN c21c is a finished archive already in Dropbox, no action**; **CTN (Creation TV Network) and WWN ARE in the build** (lower cadence than the weekly shows, but still implemented; add them to the distributions enum). The notes below on YouTube/Rumble/Transistor/Vizard still stand, but they are a slice of the stack, not the whole.

## Headline corrections to earlier assumptions

1. **"Rumble via YouTube channel sync, near-zero build" is WRONG.** Rumble's own blog says YouTube throttled/blocked the auto-sync in late 2023 and it was never reliably restored. Do not depend on it. (Validated Daniel's flag.)
2. **YouTube uploads cannot run on Vercel** (4.5 MB / 15-min function limits). Heavy media (upload + transcription) runs on the Mac or a small worker; the dashboard only triggers and tracks.
3. **`youtubeuploader` is dormant** (last release Aug 2024). Use the official `googleapis` Node client (handles resumable upload + retries).

## 1. Rumble

- **YouTube->Rumble sync: unreliable, structural.** Confirmed: Rumble corp blog (Jan 2024) says Google "began blocking the automatic syncs or slowing them to a snail's pace." Build as if it does not exist. Source: https://corp.rumble.com/blog/update-on-automated-channel-syncs-from-youtube/
- **Official Rumble Upload API EXISTS and is the automatable path** (token-gated). `POST https://rumble.com/api/simple-upload.php` (multipart: access_token, title, description, license_type, channel_id, video, thumbnail, captions). A server-side POST fits the cloud-APIs-only stack, no browser automation. Source: https://www.rumbleplayer.com/developers/Rumble-Upload-API.html
- **The API is legitimate but the documented token contact is stale (verified 2026-06-06).** Rumble's own help domain `help.rumble.com/Rumble-Upload-API.html` 302-redirects to the `rumbleplayer.com/developers` portal, so the API is sanctioned by Rumble. BUT the only contact that page lists is **bd@rumble.com, which BOUNCED for Daniel**, and the dev portal is intermittently returning 503. This is a lightly-maintained, partner-gated path, not self-serve. **Use the monitored channels instead:** `support@rumble.com` (24-hr email SLA) or the live chat on the upload/account page (weekdays 9-5 ET, bottom-right) and ask them to route an "Upload API access token" request, citing the help.rumble.com doc. The **Partner Program** (https://ads.rumble.com/) is the realistic lever for a weekly long-form ministry channel (partner status typically unlocks API access). Sources: https://help.rumble.com/Rumble-Upload-API.html (redirects to portal), https://rumble.support/help/general-questions-58 , https://ads.rumble.com/
- **Long-form quality risk (matters more than the sync):** Rumble historically caps resolution by length (HD up to ~46-61 min, 720p beyond). A 58-min cut risks landing at **720p**, an on-screen credibility risk. Verify the current tier on Rumble's live upload help before promising HD. Source: https://x.com/rumblevideo/status/1608188500351848448
- Avoid: Selenium browser-upload scripts (brittle, account-risk). "Rumble Cloud" is unrelated IaaS, not video.
- **Recommendation:** treat **manual web upload as the real Phase-1 path** (the token route is uncertain). Pursue the Upload API token via `support@rumble.com` / live chat / the Partner Program (NOT the bounced bd@ address); build the API path only once a token is actually in hand. Never depend on the sync. Verify the 58-min resolution tier.

## 2. YouTube (the anchor)

- **Resumable upload** for multi-GB files via the official `googleapis` Node client (it owns chunking/308/retries). Run it **locally on the Mac or a worker, not Vercel.** Sources: https://developers.google.com/youtube/v3/guides/using_resumable_upload_protocol , https://vercel.com/docs/functions/limitations
- **`videos.insert`** sets title, description, tags, `categoryId 28`, privacy, `publishAt`. Captions (`captions.insert`, SRT) and thumbnail (`thumbnails.set`) are separate calls. Chapters = `00:00`-leading timecodes in the description (can fail silently). Source: https://developers.google.com/youtube/v3/docs/videos/insert
- **The audit gate is the long pole and a silent trap:** until the Google project is audited, every API-uploaded video is locked **private**, irreversibly per video (re-upload only). Phase 1 = upload **private + human flips public** (or scheduled `publishAt`, which itself requires privacy=private). **Start the audit form now;** no published SLA. Sources: https://support.google.com/youtube/answer/7300965 , https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits
- **Quota** is a non-issue: ~100 units/upload since Dec 2025, 10,000/day. 
- **OAuth:** one-time consent (Desktop app, scope `youtube.upload`, offline) -> refresh token; store client_id/secret/refresh_token in one 1Password item; the local uploader reads via `op`.

## 3. Multi-platform + clips/social

- **No reliable "one file -> many platforms incl. Rumble" SaaS.** Dedicated publish-by-URL APIs (Upload-Post ~free->$16/mo; Blotato $29/mo) cover YouTube/TikTok/IG/FB/X but **not Rumble**. Sources: https://www.upload-post.com/ , https://www.blotato.com/
- **Clips: Vizard** (recommended) handles 58-min inputs, public REST API on all paid plans (~$14.50/mo), built-in scheduler, n8n template. **Opus Clip** has the best AI but **API is enterprise-gated** (manual clipping only). Sources: https://vizard.ai/pricing , https://www.opus.pro/pricing . Keep a human "review clips before publish" gate at first.
- **Never route the multi-GB master through Make/n8n** (they OOM / hit file caps); pass URLs and let each platform pull. Sources: https://community.n8n.io/t/handling-large-video-files-in-n8n-workflow/121280

## 4. Podcast, GSN/OTT, and setup automation

- **Fireside.fm = read-only API confirmed** (no publish). Migrate the podcast to **Transistor.fm** (recommended): real 3-step upload API on the entry tier, no per-hour cap (download-based), transcripts-via-API, private-podcast support. Buzzsprout also has a write API but per-hour upload caps fit a weekly long-form show poorly. **301-redirect the Fireside feed** to preserve Apple/Spotify subscribers, but first **verify Fireside permits a 301 on the outgoing feed.** Sources: https://developers.transistor.fm/ , https://fireside.fm/docs/api
- **GSN (Roku/OTT): generate a Roku Direct Publisher JSON feed** from the episodes table (a Next.js route or Edge Function); Roku polls it -> near hands-off ingestion. The real work is hosting each episode MP4 at a stable public HTTPS URL with Roku-spec encoding (H.264/HLS). **Verify GSN's Roku channel is Direct Publisher (feed-driven), not a custom SDK channel** (the latter has no generic feed path). Sources: https://developer.roku.com/docs/direct-publisher/getting-started/content-feed.md
- **Orchestration: prefer native Supabase Cron -> Edge Function** for scheduled publish jobs (sub-minute, ~150s, $0, on-stack) over Vercel Cron (Hobby ~1/day). Use **Make.com only** if a connector is genuinely missing. Sources: https://supabase.com/docs/guides/cron
- **Secrets: a 1Password Service Account** (token in env, scoped vault) injects tokens into unattended jobs via `op run`/`op read`. Note: **1Password does NOT refresh OAuth tokens** for you, the code must do the refresh exchange and write the rotated token back, with an **alert on auth failure** (or unattended publishing dies silently).

## Recommended distribution stack (lean, ~$15-35/mo)

- **Master -> local Mac/worker** runs transcription (WhisperKit+SpeakerKit) and the **YouTube resumable upload** (googleapis client). Dashboard (Vercel) triggers + tracks only.
- **YouTube:** the anchor + the canonical URL. Upload private + `publishAt` (Mon 4 ET) once audited; private + human-flip until then.
- **Rumble:** request the Upload API token; manual fallback; verify HD tier.
- **Podcast:** migrate Fireside -> Transistor (publish API), verify the 301 first.
- **GSN:** generate a Roku Direct Publisher JSON feed; host the MP4 at a public URL.
- **Clips/social:** Vizard (API + scheduler), human review gate at first; Upload-Post for any extra socials.
- **Schedule:** Supabase Cron -> Edge Function. **Secrets:** 1Password Service Account.

## TODOs this surfaced (for Daniel / the roadmap)

- Email **bd@rumble.com** to request a Rumble Upload API access token.
- **Verify Rumble's current length/resolution tier** for a 58-min upload (720p risk).
- **Start the YouTube/Google API audit** now (long pole; private-lock until cleared).
- **Verify Fireside allows a 301 redirect** before any Transistor migration.
- **Confirm GSN's Roku channel is Direct Publisher** (feed-ingestable) vs a custom SDK channel.
- Decide Phase-1 scope: almost certainly YouTube (private-first) + manual Rumble; Transistor/Roku/clips as fast-follows.
