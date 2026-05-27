-- Natural key for episodes: (season, episode_number).
-- Lets /api/import upsert episodes from the extraction-prompt JSON
-- without race conditions or duplicate rows.
-- Idempotent.

alter table public.episodes
  drop constraint if exists episodes_season_episode_number_unique;

alter table public.episodes
  add constraint episodes_season_episode_number_unique
  unique (season, episode_number);
