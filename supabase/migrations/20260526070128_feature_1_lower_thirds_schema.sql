-- Feature 1: Lower-thirds approval workflow schema
-- Source: FEATURE_1_LOWER_THIRDS.md (with guest_name added on episodes per
-- FEATURE_1_BOOTSTRAP_IMPORT.md so we don't need a second migration later).

create type graphic_status as enum (
  'pending_review',
  'approved',
  'rejected',
  'needs_revision'
);

create type graphic_segment as enum (
  'opening_monologue',
  'interview_1',
  'interview_2',
  'kids_corner',
  'genesis_science_qa',
  'ministry_report',
  'viewer_voices',
  'featured_resource',
  'heavens_declare',
  'genesis_science_minute',
  'other'
);

create table episodes (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  episode_number int not null,
  air_date date,
  title text,
  guest_name text,
  created_at timestamptz default now(),
  unique (season, episode_number)
);

create table graphics (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid references episodes(id),
  segment graphic_segment not null,
  beat_number int,
  initial_text text not null,
  approved_text text,
  status graphic_status default 'pending_review',
  current_image_url text not null,
  uploaded_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  uploaded_at timestamptz default now(),
  approved_at timestamptz
);

create table graphics_variations (
  id uuid primary key default gen_random_uuid(),
  graphic_id uuid references graphics(id) on delete cascade,
  variation_number int not null,
  text_content text not null,
  generated_by text not null,
  generation_context jsonb,
  created_at timestamptz default now(),
  unique (graphic_id, variation_number)
);
