-- Expand distributions platform CHECK constraint with full platform list
-- Archaeology revealed: Streamhoster, GodTube, RLN (RightNow Media), iOS/Apple TV apps,
-- Facebook, Instagram, TikTok, Spotify, OTA broadcast

ALTER TABLE distributions DROP CONSTRAINT IF EXISTS distributions_platform_check;

ALTER TABLE distributions ADD CONSTRAINT distributions_platform_check
  CHECK (platform IN (
    'youtube',              -- genesissciencenetwork YouTube channel
    'rumble',               -- Rumble channel
    'godtube',              -- GodTube (uploads same as Rumble, tags from YouTube)
    'fireside_podcast',     -- Fireside.fm MP3 podcast
    'spotify',              -- Spotify podcast (via Fireside feed)
    'apple_podcasts',       -- Apple Podcasts (via Fireside feed)
    'streamhoster',         -- Streamhoster: primary source for Roku, Apple TV, LG TV, iOS app
    'ios_app',              -- GSN iOS app (fed by Streamhoster)
    'apple_tv_app',         -- Apple TV app (fed by Streamhoster)
    'real_life_network',    -- Signiant Media Shuttle delivery to RLN
    'rightnow_media',       -- RightNow Media Google Form submission
    'network_partner',      -- Dropbox delivery (no metadata required)
    'tbn_c21c',             -- Creation in the 21st Century on TBN
    'creation_tv_network',  -- CTN broadcast (Christian Television Network)
    'genesis_science_network', -- genesissciencenetwork.com web stream
    'ota_broadcast',        -- OTA TV (Nashville Ch 31.8, Greenville SC, etc.)
    'facebook',             -- Facebook video / Watch
    'instagram',            -- Instagram Reels / clips
    'tiktok',               -- TikTok clips
    'social_clip',          -- Generic short-form social clip
    'other'
  ));

-- Audio normalization note (stored in distributions.notes when relevant):
-- RLN requires -20 LKFS audio normalization before delivery
-- Streamhoster replaces YouTube TV/app embeds (YouTube V3 caps at 480p on tvOS)
