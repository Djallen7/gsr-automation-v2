-- Enhance graphics table with sourcing and notes fields
-- Non-breaking: all new columns nullable

ALTER TABLE graphics
  ADD COLUMN IF NOT EXISTS notes             text,
  ADD COLUMN IF NOT EXISTS asset_source_urls text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_doc        text;

-- source_doc: which script/doc this L3 text came from
-- (previously buried in generation_context jsonb on graphics_variations — surfaced here for queryability)
-- asset_source_urls: array of URLs for footage/image sourcing (Storyblocks, NASA SVS, etc.)
-- notes: freeform production note on this specific graphic

COMMENT ON COLUMN graphics.source_doc IS 'Source document reference, e.g. "S3 EP12 - John Smith Interview/Script.gdoc"';
COMMENT ON COLUMN graphics.asset_source_urls IS 'Candidate URLs for footage or image sourcing (Storyblocks, NASA SVS, Pexels, etc.)';
COMMENT ON COLUMN graphics.notes IS 'Freeform production note visible in approval UI';
