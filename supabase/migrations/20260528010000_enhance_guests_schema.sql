-- Enhance guests + episode_guests schema based on 168-person real-data scan
-- Adds safety flags (deceased, do_not_contact), outreach guidance fields,
-- credential display line, and episode-level topic/decline tracking.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. guests — safety flags (highest priority)
-- ─────────────────────────────────────────────────────────────────────────────
-- is_deceased: 6 confirmed deceased in the roster. These must NEVER appear
-- on any outreach list. Boolean makes it trivial to filter them out.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS is_deceased boolean NOT NULL DEFAULT false;

-- do_not_contact: flat refusals (Georgia Purdom, Rob Lillis) and red-flag
-- situations (Drew Casper). Separate from is_deceased — person is alive but
-- should not be contacted for any reason.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS do_not_contact boolean NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. guests — sensitive outreach flags
-- ─────────────────────────────────────────────────────────────────────────────
-- sensitive_flag: quick boolean for "check before emailing this person."
-- True for anyone with health issues, family situations, or past conflicts.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS sensitive_flag boolean NOT NULL DEFAULT false;

-- sensitive_notes: the actual situation to know.
-- Examples: "Wife has serious health issues — declined Feb 2025 and Sept 2025.
--            Do not send standard template. Personal check-in only."
-- Keep this honest and specific — vague notes are useless.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS sensitive_notes text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. guests — re-approach guidance
-- ─────────────────────────────────────────────────────────────────────────────
-- re_approach_after: earliest date to contact a declined/unavailable guest again.
-- NULL means no known restriction.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS re_approach_after date;

-- re_approach_notes: topic or format constraints for re-approach.
-- Examples: "Avoid quantum cosmology topics — declined 3x on this."
--           "Needs slides + longer format than standard GSR segment."
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS re_approach_notes text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. guests — profile completeness fields
-- ─────────────────────────────────────────────────────────────────────────────
-- credentials_display: the as-aired credential line for the chyron/lower-third.
-- Verified from actual script intros and lower-thirds sessions.
-- Example: "Geneticist, Institute for Creation Research"
-- Different from job_title (internal label) — this is what goes on screen.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS credentials_display text;

-- source: how this person came into the GSR orbit.
-- Values in practice: 'CMI', 'Discovery Institute', 'AiG', 'self-pitched',
-- 'ICR', 'referral', 'article-assignment', 'age-of-design', etc.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS source text;

-- website: personal, ministry, or institutional site.
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS website text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. episode_guests — episode-level detail
-- ─────────────────────────────────────────────────────────────────────────────
-- topic: what they discussed in this specific episode/segment.
-- Example: "Ancient DNA and post-Flood genetics", "Helium diffusion in zircons"
ALTER TABLE public.episode_guests
  ADD COLUMN IF NOT EXISTS topic text;

-- decline_reason: why they said no when booking_status = 'declined'.
-- Example: "Wife health issues", "Topic outside expertise", "Too recent (April 2026)"
ALTER TABLE public.episode_guests
  ADD COLUMN IF NOT EXISTS decline_reason text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. RLS policies for new columns
-- ─────────────────────────────────────────────────────────────────────────────
-- New columns on guests and episode_guests inherit the existing table-level
-- RLS policies (authenticated read/insert/update). No new policies needed.

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Indexes for the most common filter patterns
-- ─────────────────────────────────────────────────────────────────────────────
-- Outreach safety filters: always filter deceased + do_not_contact first.
CREATE INDEX IF NOT EXISTS guests_safety_flags_idx
  ON public.guests (is_deceased, do_not_contact, sensitive_flag);

-- Re-approach date: find who becomes contactable in a given window.
CREATE INDEX IF NOT EXISTS guests_re_approach_after_idx
  ON public.guests (re_approach_after)
  WHERE re_approach_after IS NOT NULL;

-- Source: find all CMI guests, all Discovery Institute guests, etc.
CREATE INDEX IF NOT EXISTS guests_source_idx
  ON public.guests (source)
  WHERE source IS NOT NULL;
