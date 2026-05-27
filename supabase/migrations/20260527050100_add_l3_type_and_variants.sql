-- Add per-graphic L3 type classification + the 3-column variant system
-- introduced by the v2 extraction prompt.
--
-- l3_type is text with a CHECK constraint rather than a Postgres enum
-- so future value additions don't run into ALTER TYPE ADD VALUE's
-- non-transactional limitation.
--
-- var_1/var_2 hold the alternate copy lines from the extraction prompt's
-- 3-column system. They are nullable; only episode_intro_l3,
-- segment_graphics_title, and topic_l3 are expected to use them.
-- primary continues to map to the existing initial_text column for
-- backward compatibility with the approve/reject flow.

alter table public.graphics
  add column if not exists l3_type text,
  add column if not exists var_1 text,
  add column if not exists var_2 text;

alter table public.graphics
  drop constraint if exists graphics_l3_type_check;

alter table public.graphics
  add constraint graphics_l3_type_check
  check (l3_type is null or l3_type in (
    'episode_intro_l3',
    'monologue_beat',
    'segment_graphics_title',
    'topic_l3',
    'guest_chyron',
    'discussion_l3',
    'generic_safety_net',
    'qa_topic_l3',
    'mr_topic_l3',
    'mr_cta_l3',
    'correspondent_chyron',
    'viewer_l3',
    'resource_l3',
    'cta_l3',
    'other'
  ));

create index if not exists graphics_l3_type_idx
  on public.graphics (l3_type)
  where l3_type is not null;
