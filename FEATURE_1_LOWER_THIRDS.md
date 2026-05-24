# Feature 1 Spec: Lower-Thirds Approval Workflow

**Goal:** Replace the current "Jakob makes graphics → texts/emails Daniel → Daniel approves over messaging → graphics get loaded into ProPresenter manually" loop with a dashboard-based workflow that takes minutes instead of hours per episode cycle.

**Out of scope for this feature:** ProPresenter automatic push, video transcription, episode metadata, distribution, guest pipeline, anything else. Those are later features.

---

## User stories

**As Jakob, I want to:**
- Upload a lower-third PNG with one click
- Tag it with the episode and segment it belongs to
- See the status of everything I've uploaded
- Know when something has been rejected so I can fix it

**As Daniel, I want to:**
- See thumbnails of all pending lower thirds in a grid
- Approve or reject each one with a single click
- Hit "regenerate text" on a rejected one and get an AI-generated alternative based on the same context
- See an approved queue so I know what's ready for ProPresenter

**As the system, I need to:**
- Store the uploaded image and its metadata
- Track every state change (uploaded → reviewed → approved/rejected → regenerated)
- Allow multiple text variations per graphic without losing history

---

## Database schema (Supabase Postgres)

Three tables. Keep it small.

### Table 1: `episodes`

This isn't strictly necessary for feature 1, but you'll need it for feature 2 and lower-thirds need to reference episodes, so we set it up minimally now.

```sql
create table episodes (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  episode_number int not null,
  air_date date,
  title text,
  created_at timestamptz default now(),
  unique (season, episode_number)
);
```

### Table 2: `graphics`

The main table. One row per graphic Jakob creates.

```sql
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
```

### Table 3: `graphics_variations`

Stores every regenerated text variation. Even if a graphic gets approved on variation 4, you still have variations 1-3 in history.

```sql
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
```

`generated_by` is either 'human' (for the initial upload), 'claude-opus-4-7' (for AI regeneration), etc.

`generation_context` is a JSON blob with whatever context was used: guest name, episode topic, segment type, brand rules. Storing it as JSON lets the schema evolve without migrations.

### Row-level security (RLS)

```sql
-- Enable RLS on all tables
alter table episodes enable row level security;
alter table graphics enable row level security;
alter table graphics_variations enable row level security;

-- Everyone authenticated can read everything (small team)
create policy "read_all_authenticated" on episodes for select using (auth.role() = 'authenticated');
create policy "read_all_authenticated" on graphics for select using (auth.role() = 'authenticated');
create policy "read_all_authenticated" on graphics_variations for select using (auth.role() = 'authenticated');

-- Anyone authenticated can insert graphics (Jakob, Isaac, etc.)
create policy "insert_graphics_authenticated" on graphics for insert with check (auth.role() = 'authenticated');
create policy "insert_variations_authenticated" on graphics_variations for insert with check (auth.role() = 'authenticated');

-- Only producers can update approval status
-- (Producer role to be added via Supabase auth metadata; for prototype, allow all authenticated)
create policy "update_graphics_authenticated" on graphics for update using (auth.role() = 'authenticated');
```

When the team grows or you need stricter access, change the producer-only policies. For prototype, everyone can do everything.

### Storage bucket

Create one Supabase Storage bucket called `lower-thirds`. Public read, authenticated write. The `current_image_url` field in `graphics` stores the public URL.

---

## Page-by-page UI spec

Built in Next.js 15 + shadcn/ui. Each page is one file.

### `/login`
- Single field: email
- Sends magic link via Supabase Auth
- Redirects to `/lower-thirds` after auth

### `/upload`
- Drag-and-drop zone for PNG file (max 5 MB)
- Dropdown: episode (auto-populated from `episodes` table; if none, type a number and one gets created)
- Dropdown: segment (from the enum)
- Number field: beat number (optional, defaults to next available for that episode + segment)
- Textarea: initial text (what the lower third should say)
- Submit button

After submit:
- File uploads to Supabase Storage
- Row created in `graphics` with status `pending_review`
- Row created in `graphics_variations` with variation 1, source 'human'
- Redirects to `/lower-thirds` showing the new entry

### `/lower-thirds` (the review grid)
- Grid of cards, one per graphic with status `pending_review`
- Each card shows: thumbnail, episode + segment + beat, initial text, who uploaded
- Three buttons per card: Approve, Reject, Regenerate
- Filters at top: episode, segment, uploader

Approve → status becomes `approved`, `approved_at` and `approved_by` set, card disappears from review grid.

Reject → status becomes `rejected`, card moves to a "rejected" section.

Regenerate → calls `/api/regenerate` (see below), shows a loading spinner, returns a new variation, displays it as a side-by-side comparison: original text vs new text. Daniel picks one. The chosen one becomes the new `approved_text` (if approving) or replaces `initial_text` for further review.

### `/approved`
- List of all graphics with status `approved`
- Grouped by episode → segment → beat
- For each: thumbnail, approved text, "Mark as added to ProPresenter" checkbox
- This is the manual handoff queue until ProPresenter automation is built in phase 2

### `/api/regenerate` (Next.js API route, server-side only)
- Takes a graphic ID
- Pulls the latest text + context (episode topic, segment, guest if applicable, brand rules)
- Calls Claude API with a structured prompt: "Generate one alternative lower-third text given this context. Constraints: under 8 words, no em dashes, must reference [the topic/guest/etc]."
- Stores result as a new variation row
- Returns the new text

---

## Build sequence (the exact order)

### Stage 0: Account setup (do this once, ~2 hours)

1. Confirm gsr-automation-v2 repo exists on GitHub. If not, create it.
2. Go to supabase.com, sign in with GitHub or email. Create one project named "gsr-prod" (or "gsr-dev" if you want to play first).
3. Save the project URL and anon key somewhere safe. The Supabase Studio is at `https://supabase.com/dashboard/project/[your-project-id]`.
4. Confirm your Anthropic API key is in 1Password. If not, get one from console.anthropic.com.
5. Sign up for Vercel (free hobby tier). Connect it to your GitHub.

### Stage 1: Schema (~3 hours)

1. Open Supabase Studio → SQL Editor.
2. Paste the three `CREATE TABLE` statements from above. Run them.
3. Paste the RLS policies. Run them.
4. Create the storage bucket: Storage → New Bucket → "lower-thirds" → public read, authenticated write.
5. Test: in the Table Editor, insert one fake episode row, one fake graphic row, one fake variation row. Confirm they appear.

This stage you do yourself in the Supabase web UI. There's no code to run.

### Stage 2: Next.js shell (~1 week)

1. Locally on your Mac, in a fresh folder, run `npx create-next-app@latest gsr-dashboard`. Pick TypeScript, App Router, Tailwind, src/ directory.
2. `cd gsr-dashboard && npx shadcn@latest init`. Pick the default theme for now (we'll brand it later).
3. Install shadcn components you'll need: `npx shadcn@latest add button card input textarea select dialog form sonner`
4. Install Supabase client: `npm install @supabase/supabase-js @supabase/ssr`
5. Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings.
6. Add `.env.local` to `.gitignore` (it should be already).
7. Build the `/login` page. Test that magic link auth works.
8. Push to GitHub. Deploy to Vercel. Verify the deployed version logs you in.

This is the longest stage because it's setup-heavy. After this, the rest moves fast.

### Stage 3: Upload page (~3-5 days)

1. Build the `/upload` page. Form first, no actual upload yet.
2. Wire up the file upload to Supabase Storage.
3. Wire up the form submit to insert into `graphics` and `graphics_variations`.
4. Test the whole flow: upload a real PNG, see it in Supabase Studio.

### Stage 4: Review grid (~3 days)

1. Build the `/lower-thirds` page.
2. Fetch graphics where `status = 'pending_review'`.
3. Display them as a grid of cards.
4. Wire up Approve, Reject (no Regenerate yet — that's stage 5).
5. Test: have Jakob upload 5 fake graphics, approve 3, reject 2.

### Stage 5: AI regeneration (~3-5 days)

1. Create the `/api/regenerate` route.
2. Add the Anthropic SDK: `npm install @anthropic-ai/sdk`
3. Write the prompt. Test it with one real graphic context. Iterate until output is good.
4. Wire the Regenerate button to the API route.
5. Display the side-by-side comparison UI.

### Stage 6: Approved queue (~2 days)

1. Build the `/approved` page.
2. List approved graphics grouped by episode/segment.
3. Add the "Mark as added to ProPresenter" checkbox (just a status flag for now).

### Stage 7: Real episode test (~1 week of actual production use)

1. Have Jakob upload real graphics for the next shoot.
2. Use the workflow exactly as designed.
3. Note what breaks, what's slow, what's confusing.
4. Fix the top 3 issues. Leave the rest for later iteration.

---

## What's deliberately NOT in this feature

- ProPresenter API integration. Phase 2 of this same feature.
- Image regeneration (AI generates new PNGs). Probably not worth doing; Jakob's tool produces better-looking output.
- Brand template enforcement. Phase 3 if needed.
- Multi-language support. Maybe never.
- Mobile-optimized UI. Desktop-first; mobile later if anyone uses it on mobile.
- Email/Slack notifications when a graphic is approved/rejected. Add when the team asks for it.

---

## Definition of done

Feature 1 is done when:

1. Jakob has uploaded graphics for one real episode through the dashboard
2. Daniel has approved them through the dashboard
3. Approved graphics made it into ProPresenter (manually, from the queue view)
4. The team prefers this to the old workflow
5. Daniel can hand the START_HERE.md + this spec + the working dashboard to another Claude session and they can pick up feature 2

That's it. No "polished," no "perfected," no "every edge case handled." Working and preferred. Then move on.
