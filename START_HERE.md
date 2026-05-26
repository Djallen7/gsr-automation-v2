# START HERE

**Last updated:** 2026-05-22
**Owner:** Daniel Allen
**Purpose:** If you (or a future Claude session, or anyone else) walk into this repo cold, read this first. Everything else is downstream.

---

## The decision

After a lot of conversation: **Supabase is the backend. Next.js is the dashboard. Lower-thirds approval is the first feature built.** Notion is no longer the spine. Everything else in the master context document remains aspirational and gets built in order after this first feature works.

If you've come here looking for a sprawling list of features to build, stop. That's the trap. Build *one* feature end-to-end. Then the next one. The foundation reveals itself through use.

---

## The principle

You do not have to design the entire system before you start. You will be tempted to. Resist this.

The reason is simple: every workflow you build forces you to make data model decisions. If you try to make all those decisions today before building anything, you'll guess wrong half the time and rebuild anyway. If you make them as each workflow demands them, you'll be right most of the time because you're solving real problems instead of imagined ones.

This is not a failure of planning. This is how production systems actually get built.

---

## What gets built first, and why

**Feature 1: Jakob lower-thirds approval workflow.**

The workflow is: Jakob builds graphics in his existing tool (Photoshop or AI-assisted), uploads them through the dashboard, the dashboard shows thumbnails in a review grid, Daniel approves each one or hits "regenerate" to get another AI variation with the same context, and approved graphics get queued for ProPresenter.

**Why this first:**

1. **Tiny blast radius.** If it breaks, Jakob goes back to the old workflow for that day. Nothing critical fails.
2. **Fast feedback loop.** Jakob makes 20 graphics in a sitting. You can test the entire workflow on 20 items in one afternoon, not wait a week for one episode.
3. **Contains every pattern you need later.** Database table, file uploads, AI calls, approval queue, dashboard view, role-based access. The next features are mostly variations on this same skeleton.
4. **No server dependencies.** Doesn't touch QNAP3, doesn't need read-only mirror, doesn't need IT involvement.
5. **No high-stakes deadlines.** Unlike YouTube upload, nothing publishes to the world if this misfires.
6. **Three tools, not ten.** Supabase + Next.js + Claude API. That's it. No n8n, no Playwright, no ProPresenter API yet (that's phase 2 of this same feature).

**What does NOT get built first:**

- The full dashboard (too much shell, not enough function)
- YouTube upload automation (too fragile for a first build, slow test loop, high stakes)
- ProPresenter integration (added as phase 2 of lower-thirds AFTER core approval works)
- Guest pipeline (waits until lower-thirds proves the patterns)
- Distribution automation (waits until the dashboard exists)
- Voice DNA finalization (parallel track, doesn't block this)
- Any tool swaps from the audit (none are urgent; revisit once lower-thirds ships)

---

## The order of operations

**Stage 0: Repo and account setup** (1-2 hours)

- Confirm gsr-automation-v2 repo is initialized on GitHub
- Create Supabase account, create one project on the Free tier for development
- Confirm Anthropic API key is in 1Password vault and accessible
- Verify Vercel account exists (or sign up — free hobby tier is fine for now)

**Stage 1: Schema for lower-thirds** (2-3 hours)

- Define 3 tables in Supabase: `graphics`, `graphics_variations`, `graphics_review_log`
- Enable row-level security; one policy: any authenticated team member can read, only producer roles can approve
- Test schema by inserting one row manually through Supabase Studio
- Document the schema in /docs/schema-lower-thirds.md

**Stage 2: Minimal Next.js dashboard** (1 week)

- Bootstrap Next.js 15 project with shadcn/ui
- One page: `/lower-thirds` showing the review grid
- Three components: thumbnail card, approve button, regenerate button
- Connect to Supabase with the official client
- Auth handled by Supabase (magic link email for the team)

**Stage 3: Upload flow for Jakob** (3-5 days)

- An `/upload` page where Jakob drags in a PNG
- Saves to Supabase Storage, creates a row in `graphics`
- Asks Jakob for two context fields: which episode, which segment
- Generates an automatic thumbnail (Supabase Storage already does this)

**Stage 4: AI regeneration** (3-5 days)

- "Regenerate" button calls Claude API with the original context
- Claude returns updated text suggestions for the lower third
- Note: this regenerates the TEXT for Jakob to re-render, not the image itself (rendering happens in his existing tool)
- A future phase can move to template-based image generation if that proves valuable

**Stage 5: Approval state and queue** (3 days)

- Approve button writes to `graphics_review_log` and sets status to "approved"
- An "approved queue" view shows everything ready for ProPresenter
- For now, this queue is just a list Daniel can hand-walk to ProPresenter
- Phase 2 (next feature) will automate the ProPresenter push

**Stage 6: Test with real episode** (1 week of real use)

- Use the workflow for a real shoot cycle
- Find bugs, fix them
- Document what worked and what didn't

**Total: about 3 weeks of focused work.** After this, you'll have the patterns down and feature 2 will be faster.

---

## What the system looks like at the end of feature 1

```
┌──────────────────────────────────────────────────┐
│ DASHBOARD (Next.js, hosted on Vercel)           │
│ - Login (Supabase magic link)                    │
│ - /lower-thirds (review grid)                    │
│ - /upload (Jakob's upload page)                  │
│ - /approved (queue for ProPresenter)             │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│ SUPABASE                                          │
│ - graphics (table)                                │
│ - graphics_variations (table)                     │
│ - graphics_review_log (table)                     │
│ - Storage bucket: lower-thirds-thumbnails         │
│ - Auth: team members                              │
└─────────┬─────────────────────────┬──────────────┘
          │                          │
          ▼                          ▼
   Claude API                  Jakob's machine
   (regeneration)              (creates graphics)
```

That's the whole system for feature 1. No server access. No n8n. No ProPresenter API. No transcription. Nothing complicated.

---

## What gets added in subsequent features (the order, not the design)

1. **Lower-thirds Phase 2:** ProPresenter API integration to push approved graphics directly. Adds Tailscale to the picture.
2. **Episode metadata:** Schema for episodes, transcripts, descriptions. Triggered by uploading a finished master.
3. **YouTube upload:** Once metadata generation is reliable, automate the upload.
4. **Guest pipeline:** Schema for guests, outreach, scheduling. Connects to existing Gmail.
5. **Distribution to other platforms:** RLN, Rumble, Cloudflare Stream (if you've swapped from StreamHoster by then), Transistor (if you've swapped from Fireside).
6. **n8n:** Only when you have 3+ workflows that need to run on schedules or react to events. Not before.

Each feature shares the dashboard, the database, the auth. You don't rebuild the foundation. You add tables and pages.

---

## What's archived from the previous plan

- The Notion-as-spine architecture from earlier conversations. Replaced by Supabase.
- The "build n8n on QNAP" idea from the original master context. Replaced by read-only constraint.
- The "host n8n cloud at $20/mo" assumption. We're not building n8n yet at all.
- The grand unified rollout plan. Replaced by feature-at-a-time.

None of this is wrong, exactly. It's just not the order of operations that works.

---

## Critical reminders

- **Don't add features to the dashboard that aren't part of an active workflow.** If you find yourself adding pages "because the dashboard needs them," stop.
- **Server stays read-only.** Even when ProPresenter integration is added, ProPresenter writes to its own files; the dashboard reads thumbnails via API.
- **Voice DNA samples are stored in the repo, not in Claude.ai Projects.** This is the path to making AI calls work from the backend later. For now, this is just a note — feature 1 doesn't need voice samples.
- **The audit document (the tool swap research) is reference, not a TODO list.** Most of those swaps wait. The two with clear ROI (Fireside → Transistor, StreamHoster → Cloudflare Stream) wait until distribution features get built, which is after the dashboard exists.

---

## When to come back to this document

- Anytime you start a new conversation with a Claude session, paste this in first.
- Anytime you're about to add a feature, check that it fits the "next feature in line" criteria.
- Anytime you're feeling overwhelmed by the architecture, re-read the Principle section. The point of this document is to stop the spiral.

---

## What I owe you next

After feature 1 (lower-thirds) is working in production for one episode cycle:

- A retro doc capturing what we learned about the patterns
- A schema for feature 2 (episode metadata) based on what we now know
- Updates to this document reflecting reality, not plans

Until then, this document is the plan. The other documents in this repo are reference material, not roadmap.
