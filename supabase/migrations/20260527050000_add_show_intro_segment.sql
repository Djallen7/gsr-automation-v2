-- New segment value for the show open.
-- Lives in its own migration because ALTER TYPE ADD VALUE cannot run
-- inside the same transaction as the schema changes that depend on it.

alter type public.graphic_segment add value if not exists 'show_intro';
