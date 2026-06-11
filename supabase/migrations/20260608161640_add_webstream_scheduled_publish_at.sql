-- Expand-contract step 1 of 2: rename the generic weekly-publish milestone column
-- from youtube_scheduled_publish_at to webstream_scheduled_publish_at, safely.
--
-- "webstream" = the weekly online-release umbrella (the Monday 4PM ET drop) that fans
-- out to ALL platforms (YouTube, Rumble, StreamHoster, GSN, podcast). YouTube is just
-- ONE target under it, so the generic milestone should not be named after one platform.
--
-- This migration is ADDITIVE ONLY. It adds the new column and backfills it from the old
-- one. It does NOT drop, rename-in-place, or alter youtube_scheduled_publish_at, because
-- the currently-deployed app still references that column; dropping it now would break
-- production. The contract step (dropping youtube_scheduled_publish_at) ships in a LATER
-- migration AFTER this branch is deployed to main. See docs/AUTOMATION_ROADMAP.md.
--
-- Note: "webstream publish/release" (this weekly multi-platform milestone) is a distinct
-- idea from the canon's "web-stream / OTT target (StreamHoster/GSN)". Do not conflate them.

ALTER TABLE episodes
  ADD COLUMN IF NOT EXISTS webstream_scheduled_publish_at timestamptz;

COMMENT ON COLUMN episodes.webstream_scheduled_publish_at IS 'Weekly webstream release milestone (the Monday 4PM ET drop across YouTube/Rumble/StreamHoster/GSN/podcast). Default: next available Monday 4:00 PM ET. Override when needed. Replaces youtube_scheduled_publish_at (dropped in a later contract migration).';

-- Backfill from the old column; idempotent (only fills rows not yet set).
UPDATE episodes
  SET webstream_scheduled_publish_at = youtube_scheduled_publish_at
  WHERE webstream_scheduled_publish_at IS NULL;
