-- Correct distributions platform list to match actual repo documentation
-- Source of truth: docs/GSR_METADATA_PATTERN.md + docs/MASTER_CONTEXT.md
-- 6 real platforms only. Prior migration had noise (GodTube, OTA, RightNow Media
-- as separate from RLN, iOS app, Apple TV app, TBN, CTN, etc.)
--
-- Real Life Network = RightNow Media — same delivery target via Signiant Media Shuttle
-- Roku/Apple TV/iOS app = all fed by StreamHoster (one upload, not separate targets)
-- Spotify/Apple Podcasts = fed automatically via Fireside.fm RSS (not separate uploads)
-- social_clip kept as placeholder — content_clips table handles clip-level tracking

ALTER TABLE distributions DROP CONSTRAINT IF EXISTS distributions_platform_check;

ALTER TABLE distributions ADD CONSTRAINT distributions_platform_check
  CHECK (platform IN (
    'youtube',              -- Main post: Monday 4PM ET, private until approved; 3 playlists
    'rumble',               -- Secondary video; no API, browser automation
    'dropbox',              -- Network partner delivery; no metadata required
    'fireside_podcast',     -- Podcast MP3; also feeds Spotify + Apple Podcasts via RSS
    'real_life_network',    -- Signiant Media Shuttle delivery (also called RightNow Media)
    'streamhoster',         -- FTP; feeds Roku, Apple TV, iOS app, LG TV (one upload)
    'genesis_science_network', -- genesissciencenetwork.com web stream
    'social_clip',          -- Short-form clip (handled by content_clips table; tracked here for episode-level status)
    'other'
  ));
