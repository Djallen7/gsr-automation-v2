export type Category =
  | 'Research'
  | 'Script'
  | 'Graphics'
  | 'Email'
  | 'Metadata'
  | 'Production'
  | 'Post-Production'

export interface Prompt {
  id: number
  name: string
  category: Category
  whenToUse: string
  warning?: string
  liveData?: boolean
  text: string
}

export const PROMPTS: Prompt[] = [
  {
    id: 1,
    name: 'Guest Research',
    category: 'Research',
    whenToUse: 'Starting a session to find new interview guests.',
    warning:
      'Claude will suggest recently-aired guests unless the roster is injected explicitly. The live roster below is auto-filled from Supabase.',
    liveData: true,
    text: `You are helping me research guests for Genesis Science Report (GSR), a weekly Christian creation-science TV show hosted by David Rives. Season 3, ~58 min, weekly. Air day: Tuesday 8 PM CST.

EXISTING GUEST ROSTER (as of {DATE}):
Do not suggest anyone who last aired less than 6 months ago unless I explicitly ask.

{GUEST_ROSTER_INJECTED_BY_TOOLKIT}

GUEST CRITERIA:
- PhD scientists, professors, or published authors in creation science or intelligent design
- Fields: genetics, geology, astronomy, biology, paleontology, archaeology, physics, cosmology
- Must hold a young-earth creationist or intelligent design position
- Prioritize first-time guests and those not aired in 12+ months
- David Rives is the host — do not suggest him as a guest

DECEASED / DO NOT BOOK (as of 2026-05-28):
- Dr. Chuck Thurston
- Rusty Maisel
- Joe Taylor
- Dr. Tommy Mitchell
- Buddy Davis

When you suggest a guest, always provide:
1. Full name and credentials
2. Their specific relevant work or recent article (with URL if possible)
3. The creation-science angle most suitable for GSR
4. Whether they are YEC, ID, or OEC (this affects interview framing)
5. Any known contact info or where to find it`,
  },
  {
    id: 2,
    name: 'Interview Questions',
    category: 'Script',
    whenToUse: 'Preparing questions for a scheduled guest interview.',
    text: `You are writing interview questions for Genesis Science Report (GSR), hosted by David Rives.

GUEST: {FULL NAME + CREDENTIALS}
TOPIC: {ARTICLE TITLE OR STUDY TITLE}
SOURCE URL: {URL}
SEGMENT LENGTH: ~13 minutes (roughly 10–12 questions; David will ad-lib follow-ups)

QUESTION ARC — write questions in this exact order:

SECTION 1 — OPENING HOOK (2 questions)
Draw the viewer in with the most surprising or counter-intuitive finding.
Start with something like: "What exactly did you find, and why should our viewers pay attention to this?"

SECTION 2 — THE DISCOVERY / DATA (3–4 questions)
Walk through what was found, how it was found, and why it matters.
Assume a curious non-specialist viewer. Avoid jargon; if a technical term is essential, prompt the guest to define it.

SECTION 3 — BIBLICAL CONNECTION (2–3 questions)
Connect the science to Genesis or a relevant Scripture. Do not force this — let the guest lead.
Example prompt: "What does this mean for how we understand the creation account in Genesis?"

SECTION 4 — WORLDVIEW AND TAKEAWAY (2 questions)
- What does this challenge in mainstream science?
- Final question (always): "What is the one thing you most want our viewers to take away from this?"

FORMATTING RULES:
- One idea per question — no compound questions
- No yes/no questions answerable in one word
- After the first question, use the guest's first name
- Never ask them about YouTube, social media, or where to follow them
- Never frame evolution as a valid default — refer to it as "the evolutionary model" or "mainstream consensus" when comparison is needed
- If guest is from Discovery Institute, BioLogos, Reasons to Believe, or similar org: lead science-first, not with a Genesis framing — let them make the connection themselves`,
  },
  {
    id: 3,
    name: 'Episode Script Outline',
    category: 'Script',
    whenToUse: 'Planning a full episode structure before writing individual segments.',
    text: `You are outlining a teleprompter script for Genesis Science Report (GSR), Season 3, hosted by David Rives. ~58 minutes total.

EPISODE: S03 Ep{###}
AIR DATE: {Tuesday, Month Day, Year} at 8 PM CST
INTERVIEW 1: {GUEST NAME} — {TOPIC}
INTERVIEW 2: {GUEST NAME} — {TOPIC}
MONOLOGUE TOPIC: {TOPIC}
FEATURED RESOURCE: {BOOK/PRODUCT TITLE} — creationsuperstore.com (ties to Q&A topic)
Q&A QUESTION: "{VIEWER QUESTION}" submitted by {NAME} via {PLATFORM}
VIEWER VOICES: {NAME 1} from {LOCATION/SOURCE}, {NAME 2} from {LOCATION/SOURCE}

FIXED SEGMENT ORDER — do not reorder (source: MASTER_CONTEXT.md run-of-show):
1.  Show Intro (~0:30) [RC: B2]
2.  Opening Monologue (~7 min) — David previews both interviews, then "But first..." pivot [RC: B3]
3.  [Break]
4.  Interview 1 (~12 min) — FIRST HALF, right after Opening Monologue [RC: B11 tease → C2 live]
5.  [Break]
6.  The Heavens Declare (~3.5 min) — pre-produced [RC: C8]
7.  Kids Corner (~3 min) — pre-produced [RC: D2]
8.  Genesis Science Q&A (~2 min) — pre-produced [RC: D2]
9.  Ministry Report (~2 min) — includes 931-212-7990 donation pitch [RC: E2]
10. Viewer Voices (~2 min) — two named viewer testimonials; rotate 4 fixed tosses [RC: E4]
11. Featured Resource (~2 min) — "be sure to check out [TITLE] at creationsuperstore.com" [RC: E6]
12. Genesis Science Minute (~1 min) — pre-produced [RC: E8]
13. [Break]
14. Interview 2 (~12 min) [RC: E10 tease → F2 live]
15. Closing (~1 min) [RC: F8]

LOCKED SIGN-OFF (verbatim — do not alter):
"That's it for today. Thank you for joining us on the Genesis Science Report. Until next week, keep looking up. I'm David Rives. Truly, the heavens declare the glory of God."

OUTPUT FORMAT:
One row per segment: | Segment | Duration | Key content / angle | Scripting notes |`,
  },
  {
    id: 4,
    name: 'Opening Monologue Script',
    category: 'Script',
    whenToUse: "Writing the scripted teleprompter copy for David's opening segment.",
    text: `You are writing the Opening Monologue for Genesis Science Report (GSR), Season 3, hosted by David Rives. This is the TELEPROMPTER SCRIPT David reads directly to camera.

EPISODE: S03 Ep{###}
MONOLOGUE TOPIC: {TOPIC}
KEY SCRIPTURE: {optional — provide if known}
INTERVIEW 1 TOPIC (for preview): {TOPIC}
INTERVIEW 2 TOPIC (for preview): {TOPIC}

STRUCTURE:
1. COLD OPEN (~45 sec): Start mid-thought with a question or bold claim. No "Hello and welcome." Hook the viewer before they can look away.
2. PREVIEW (~30 sec): "Coming up, we'll be joined by [Guest 1] to discuss [topic 1]... and later, [Guest 2] joins us on [topic 2]."
3. "BUT FIRST..." PIVOT (~15 sec): Transition into the monologue topic.
4. MONOLOGUE BODY (~5–6 min): Develop the topic. Mix Scripture, science, and personal observation. Use rhetorical questions. No more than 3 main points.
5. CLOSE (~30 sec): End on a thought that creates anticipation for Interview 1.

STAGE DIRECTIONS to include inline:
- (PAUSE) for natural breath breaks
- (LOOK AT CAMERA) for direct address moments
- (***PAUSE***) before any ad break transition
- (OPENING MONOLOGUE) label at the top of this section

DAVID'S VOICE RULES:
- Sentence length: max 20 words for teleprompter readability
- Reading level: 7th grade — accessible to all ages
- No jargon without immediate plain-language definition
- Confident, curious, grounded in Scripture — never sensational

LOCKED SIGN-OFF (appears at end of episode, not monologue — include as reference only):
"That's it for today. Thank you for joining us on the Genesis Science Report. Until next week, keep looking up. I'm David Rives. Truly, the heavens declare the glory of God."`,
  },
  {
    id: 5,
    name: 'Lower Thirds — Interview Segments',
    category: 'Graphics',
    whenToUse: 'Generating on-screen graphics text for interview segments.',
    warning:
      'Lines run long (recurring error from 146 sessions). Count every character before submitting. Show the count.',
    text: `You are writing lower-third graphics text for Genesis Science Report (GSR) ProPresenter templates. ALL TEXT IS ALL CAPS. Count every character before finalizing.

EPISODE: S03 Ep{###}
SEGMENT: {interview_1 / interview_2}
GUEST NAME: {FULL NAME}
GUEST CREDENTIALS: {TITLE | DEGREE | AFFILIATION — as they want it on screen}
INTERVIEW TOPIC: {TOPIC}
DISCUSSION BEATS: {list the 4–5 beats this interview covers}

OUTPUT — in this exact order:

**GRAPHICS TITLE** (segment title card shown at top of segment):
- PRIMARY: {ALL CAPS} ({char count})
- VARIANT 1: {ALL CAPS} ({char count})
- VARIANT 2: {ALL CAPS} ({char count})

**TOPIC L3** (topic beat shown before guest intro):
- PRIMARY: {ALL CAPS} ({char count})
- VARIANT 1: ({char count})
- VARIANT 2: ({char count})

**GUEST CHYRON** (name card — shown once, held ~10 seconds):
- PRIMARY: {FIRST LAST | TITLE | AFFILIATION}
(No Variant 1 or Variant 2 for chyrons. Pipe | is ONLY used here.)

**DISCUSSION BEATS** (one block per beat):
Beat 1 — {brief description}:
- PRIMARY: ({char count})
- VARIANT 1: ({char count})
- VARIANT 2: ({char count})
[repeat for beats 2–5]

CHARACTER RULES — every line must pass all of these:
✓ ALL CAPS — no lowercase, no title case
✓ 55–65 characters (spaces count toward the limit)
✓ No em dashes (—)
✓ No commas
✓ No periods
✓ No ellipsis (...)
✓ No brackets [ ]
✓ No slashes / (hyphens OK in compound words: DEEP-SEA, NOT as connectors)
✓ Pipe | only in guest chyrons — never in topic or discussion beats
✓ Colon : allowed for contrast framing ("CREATION: THE ONLY ANSWER")
✓ Show the character count in parentheses after every line

TONE: Broadcast headline style. Active voice. Front-load the most compelling word.`,
  },
  {
    id: 6,
    name: 'Lower Thirds — Opening Monologue',
    category: 'Graphics',
    whenToUse: 'Generating lower-third graphics for the Opening Monologue segment.',
    text: `You are writing lower-third graphics text for Genesis Science Report (GSR) — Opening Monologue segment only.

EPISODE: S03 Ep{###}
MONOLOGUE TOPIC: {TOPIC}
MONOLOGUE BEATS: {list all 15 beats in order}

OUTPUT FORMAT — for each beat, write 3 variations:

Beat 1 — {brief description}:
- A (PRIMARY): {ALL CAPS} ({char count})
- B (VARIANT 1): {ALL CAPS} ({char count})
- C (VARIANT 2): {ALL CAPS} ({char count})

[repeat for all 15 beats]

ALSO WRITE — FLAG PILLS (one per major thematic shift, max 5 per monologue):
Format: DAVID'S TAKE: {TOPIC IN CAPS}
Total character limit including "DAVID'S TAKE: ": ≤32 characters

CHARACTER RULES (same as interview prompts):
✓ ALL CAPS
✓ Beat text: 55–65 characters
✓ Flag pill text: ≤32 characters total
✓ No em dashes, commas, slashes, brackets, ellipsis
✓ Show char count in parentheses after every line`,
  },
  {
    id: 7,
    name: 'Lower Thirds — Ministry Report',
    category: 'Graphics',
    whenToUse: 'Generating lower thirds for the Ministry Report segment.',
    text: `You are writing lower-third graphics text for the Ministry Report segment of Genesis Science Report (GSR).

EPISODE: S03 Ep{###}
MINISTRY REPORT CONTENT: {brief description of what the ministry update covers this episode}

OUTPUT FORMAT — exactly 3 graphic beats:

**Beat 1** (opening beat — introduce the ministry topic):
- PRIMARY: {ALL CAPS} ({char count})
- VARIANT 1: ({char count})
- VARIANT 2: ({char count})

**Beat 2** (development beat):
- PRIMARY: ({char count})
- VARIANT 1: ({char count})
- VARIANT 2: ({char count})

**Beat 3** (ALWAYS: donate/mission close — fixed, do not rewrite):
This card runs identically on every episode:
- PRIMARY: SUPPORT THE MISSION | DAVIDRIVES.COM | 931-212-7990 (51 chars)
- VARIANT 1: {alternate donate close} ({char count})
- VARIANT 2: {alternate donate close} ({char count})

RULES:
✓ ALL CAPS
✓ 55–65 chars for Beats 1 and 2
✓ Beat 3 pipe | separator is intentional (chyron-style CTA, not a topic beat)
✓ Phone number is 931-212-7990 — verify every time
✓ Show char count in parentheses`,
  },
  {
    id: 8,
    name: 'YouTube Titles',
    category: 'Metadata',
    whenToUse: 'Writing the main episode title and per-segment titles for YouTube.',
    warning:
      'Claude forgets the 30%-shorter rule without explicit restatement (recurring error from 59+ sessions). This prompt embeds it.',
    text: `You are writing YouTube titles for Genesis Science Report (GSR), Season 3.

EPISODE: S03 Ep{###}
FULL PRODUCTION TITLE: {title from the production sheet}
INTERVIEW 1: {GUEST LAST NAME} — {TOPIC}
INTERVIEW 2: {GUEST LAST NAME} — {TOPIC}
MONOLOGUE TOPIC: {TOPIC}

OUTPUT — write all of the following:

**MAIN EPISODE TITLE** (write 3 options; mark your recommended choice with ★):
Format: [Topic A], [Topic B], and [Topic C] | Genesis Science Report - S03, Ep{##}
Requirements:
- ~30% shorter than the full production title (hard rule — count the words)
- Under 70 characters total (hard limit — count the characters)
- Lead with the most compelling finding, not the guest name
- Vary the format across 3 options: try a question, a list, and a contrast or twist

**SEGMENT TITLES** (for YouTube chapter timestamps — 7 words or fewer, headline style; order matches air order):
- Opening Monologue: {title}
- Interview 1 ({guest last name}): {title}
- The Heavens Declare: The Heavens Declare
- Kids Corner: Kids Corner
- Genesis Science Q&A: {title}
- Ministry Report: Ministry Report
- Genesis Science Minute: Genesis Science Minute
- Interview 2 ({guest last name}): {title}

GSR TONE: Exciting but credible. Curious but grounded. Christian worldview audience.
NEVER: "You Won't Believe...", "SHOCKING:", exclamation points in main title, clickbait.`,
  },
  {
    id: 9,
    name: 'YouTube Description + Tags',
    category: 'Metadata',
    whenToUse: 'Writing the full YouTube description and tag list for an episode.',
    text: `You are writing the complete YouTube description and tags for a Genesis Science Report episode.

EPISODE: S03 Ep{###}
MAIN YOUTUBE TITLE: {from Prompt 08}
AIR DATE: {Tuesday, Month Day, Year}
INTERVIEW 1: {GUEST NAME, CREDENTIALS} — {TOPIC} — {KEY FINDING in 1 sentence}
INTERVIEW 2: {GUEST NAME, CREDENTIALS} — {TOPIC} — {KEY FINDING in 1 sentence}
MONOLOGUE TOPIC: {TOPIC}
SPONSOR: {Cedarville University / none — Cedarville ended after Ep024}
CHAPTER TIMESTAMPS: {provide start timecodes in MM:SS format for each segment}

OUTPUT:

**DESCRIPTION:**
Structure (do not skip any section):
1. Lede (2 sentences): Frame the episode with the most compelling finding or theme
2. Interview 1 paragraph: Open with a rhetorical question → develop the topic → close with the implication for creation science
3. Interview 2 paragraph: Same structure
4. Closing tagline (verbatim): "It's an engaging episode filled with cutting-edge science, compelling evidence, and a biblical perspective on creation."
5. Chapter timestamps (one per major segment)
6. Sponsor line if applicable: "This Episode has been sponsored by {SPONSOR}." (Cedarville through Ep024 only; none after)
7. Hashtags: Start with #GenesisScienceReport #DavidRives #CreationScience, add 5–7 topical

**TAGS** (comma-separated for the YouTube Tags field):
Always include these 9 anchor tags:
Genesis Science Report, David Rives, creation science, intelligent design, young earth creationism, biblical creation, Genesis 1, creationism, science and faith

Add 10–18 topical tags based on episode content (guests, topics, key terms).

TONE: Informative, credible, accessible to a Christian creation-science audience.`,
  },
  {
    id: 10,
    name: 'Cold Outreach Email (Tier 1–2)',
    category: 'Email',
    whenToUse:
      'First-ever contact with a guest who has never appeared on GSR (Tier 1: no prior contact; Tier 2: no appearance but prior thread).',
    text: `You are drafting a cold guest outreach email for Genesis Science Report (GSR).

GUEST: {FULL NAME, TITLE, AFFILIATION}
EMAIL ADDRESS: {if known}
TIER: {1 = cold, no prior contact / 2 = no appearance but prior thread exists}
TOPIC: {ARTICLE TITLE OR RESEARCH TOPIC}
ARTICLE URL: {URL}
WHY THIS GUEST — specific fact (not generic): {1 sentence naming the specific work that makes them right for this topic}
INTERVIEW BEATS (2–3 angles to cover): {list them}
SCHEDULING WINDOW: {MONTH/YEAR}
PRIOR THREAD NOTE (Tier 2 only): {brief note on prior contact}

WRITE THE EMAIL using this 8-block structure:

Block 1 — SALUTATION: Dear Dr./Mr./Ms. {Last Name},

Block 2 — OPENER + SHOW INTRO (Tier 1): "I am the producer of The Genesis Science Report, a weekly television program hosted by David Rives, covering creation science, intelligent design, and the intersection of Scripture and science."
(Tier 2: reference the prior contact instead of full show intro)

Block 3 — TOPIC PITCH: Reference the specific article or research. Include the article link.

Block 4 — WHY THIS GUEST: One specific sentence explaining why they are uniquely qualified. Never generic ("you are a leading expert in..."). Must cite specific work or finding.

Block 5 — INTERVIEW DIRECTION: 2–3 beats the conversation would cover. Keep to 2 sentences.

Block 6 — FORMAT + SCHEDULING: "The interview would be recorded remotely over Zoom and would last approximately 13 minutes. We are currently scheduling for {MONTH} and would be happy to work around your availability."

Block 7 — URGENCY: "If you are interested, I would appreciate a response either way — we would need to finalize within 48 hours of scheduling."

Block 8 — CLOSE + SIGNATURE:
Daniel Allen
Producer, Genesis Science Report
David Rives Ministries
dallen@davidrives.com
(615) 939-1773

SUBJECT LINE:
- Tier 1: Remote Interview Invitation | The Genesis Science Report
- Tier 2: Re: [Original subject] — Interview Opportunity

HARD RULES — any violation requires a full rewrite:
✗ No em dashes (—) anywhere
✗ No "I hope this email finds you well" or any variant
✗ No exclamation points
✗ Never "the host" — always "David Rives"
✗ No fabricated claims about the guest's views or positions
✗ No mention of YouTube, social media, or where to watch
✗ No mention of Tuesday 8 PM air time in outreach
✗ If guest is from Discovery Institute, BioLogos, Reasons to Believe, Asbury, Wheaton, or Baylor: lead Block 5 with the SCIENCE FINDING, not the worldview or Genesis implication — let them make that connection themselves`,
  },
  {
    id: 11,
    name: 'Returning Guest Outreach (Tier 3–5)',
    category: 'Email',
    whenToUse: 'Re-inviting a guest who has appeared on GSR before.',
    text: `You are drafting a returning guest outreach email for Genesis Science Report (GSR).

GUEST: {FULL NAME}
PRIOR APPEARANCES: {NUMBER}
TIER: {3 / 4 / 5} (3=1 appearance, 4=2–4 appearances, 5=5+ appearances)
TOPIC: {ARTICLE TITLE OR RESEARCH TOPIC}
ARTICLE URL: {URL}
LAST AIR DATE: {approximate month/year if known}

TIER-SPECIFIC RULES:

Tier 3 (1 appearance):
- Drop the show description (they know GSR)
- Reference their last appearance briefly
- 2 interview beats maximum
- 4–5 total sentences
- Subject: "New Interview Opportunity | Genesis Science Report"

Tier 4 (2–4 appearances):
- Direct ask, first name from the start
- Propose a specific date or window
- 4–6 total sentences
- Subject: "Interview Opportunity on {topic}" or "{topic} for GSR?"

Tier 5 (5+ appearances):
- Text-message brevity (2–3 sentences)
- First name only
- Skip most of the structure — just the ask, the topic, and the date
- Short signature: Daniel / dallen@davidrives.com
- Subject: "{topic}: Interview?"

HARD RULES (same as cold outreach):
✗ No em dashes
✗ No "I hope this email finds you well"
✗ No exclamation points (Tier 3 — Tier 4/5 may use one if tone fits naturally)
✗ Always "David Rives" not "the host"
✗ Science-first framing for non-YEC guests`,
  },
  {
    id: 12,
    name: 'Booking Confirmation Emails',
    category: 'Email',
    whenToUse: "Once a guest has confirmed their availability and a date/time is set.",
    text: `You are writing the 2-email booking confirmation sequence for a confirmed GSR guest.

GUEST: {FULL NAME, TITLE}
INTERVIEW DATE: {DAY, MONTH DATE, YEAR}
INTERVIEW TIME: {TIME} CT
ZOOM LINK: {LINK}
ZOOM PASSCODE: {PASSCODE}

WRITE BOTH EMAILS:

**EMAIL 1 — INTERVIEW CONFIRMATION**
Subject: GSR Interview | {Day}, {Month Date}
Content:
- Confirm the interview is scheduled for {DATE} at {TIME} Central Time
- Request they join 15 minutes early for a tech check
- Tech reminders (keep to a short list):
  • Camera at eye level (raise the laptop or use a stand)
  • Light source in front of your face, not behind you
  • Headphones or earbuds (prevents echo)
  • Quiet room with minimal background noise
- Close warmly; express excitement about the topic
Signature: Daniel Allen / Producer, The Genesis Science Report / David Rives Ministries / dallen@davidrives.com

**EMAIL 2 — ZOOM LINK** (send separately, closer to the date)
Subject: Zoom Link | GSR Interview — {Day}, {Month Date}
Content:
- Deliver the Zoom link and passcode only
- Remind them to join 15 minutes early
- Keep it short — this is a utility email
Same signature.

RULES: Professional and warm. No em dashes. No exclamation points.`,
  },
  {
    id: 13,
    name: 'Pre-Interview Reminder',
    category: 'Email',
    whenToUse: 'Sending a reminder to the guest ~5–7 days before their interview.',
    text: `You are writing a pre-interview reminder email for a GSR guest.

GUEST: {FULL NAME}
FAMILIARITY: {Tier 1–2 = formal, Tier 3+ = first name}
INTERVIEW DATE: {DAY, DATE}
INTERVIEW TIME: {TIME} CT
TOPIC: {TOPIC}

WRITE THE EMAIL requesting:
1. Talking points: 8–10 key points they most want to cover in the interview
2. Guest bio: 3–4 sentences, written in third person, for the episode description
3. Lower-third/chyron title: their preferred on-screen name and credential
   Format example: DR. JOHN SMITH | GEOLOGIST | INSTITUTE FOR CREATION RESEARCH
4. Graphics or visuals (optional): any article screenshots, diagrams, book covers, or photos they would like shown during the interview

Keep it to 3 short paragraphs. Remind them of the date, time, and 15-minute early join request. Express genuine anticipation for the topic.

RULES: No em dashes. First name for Tier 3+; "Dr./Mr./Ms. {Last Name}" for Tier 1–2.
Signature: Daniel Allen / Producer, The Genesis Science Report / dallen@davidrives.com`,
  },
  {
    id: 14,
    name: 'Post-Interview Thank-You',
    category: 'Email',
    whenToUse: 'Following up the day after recording.',
    text: `You are writing a post-interview thank-you email for a GSR guest.

GUEST: {FIRST NAME / FULL NAME as appropriate}
INTERVIEW DATE: {DATE}
TOPIC: {TOPIC}
TENTATIVE AIR DATE: {TUESDAY, MONTH DATE, YEAR}
FAMILIARITY TIER: {1–5}
SOMETHING SPECIFIC that stood out from the interview: {1 specific thing — do not be generic}

WRITE A BRIEF thank-you that:
1. Thanks them for their time and the conversation
2. Calls out one specific thing that was memorable or particularly strong from the interview
3. Gives the tentative air date with this exact caveat:
   "Please keep in mind that our schedule occasionally shifts, but we will be sure to let you know if the air date changes."
4. Invites them to share the episode when it airs

LENGTH:
- Tier 1–3: One short paragraph (3–4 sentences)
- Tier 4–5: 2–3 sentences

RULES: Warm but professional. No em dashes. Air day is always Tuesday at 8 PM CST.
Signature: Daniel Allen / Producer, The Genesis Science Report / dallen@davidrives.com`,
  },
  {
    id: 15,
    name: 'No-Response Follow-Up',
    category: 'Email',
    whenToUse: 'No reply received within 5–7 business days of the original cold outreach.',
    text: `You are writing a no-response follow-up email for a GSR guest outreach.

GUEST: {FULL NAME}
ORIGINAL EMAIL DATE: {DATE}
ORIGINAL TOPIC: {TOPIC}
SCHEDULING WINDOW: {MONTH/YEAR — if still relevant}

WRITE A BRIEF follow-up (3–5 sentences) that:
1. Opens by referencing the original email (do not re-explain the full pitch)
2. States you are still interested if the timing works
3. Mentions a specific potential date if scheduling is urgent
4. Explicitly invites a "no" — it removes the awkwardness and often gets a reply either way
   Example: "Even if the timing doesn't work right now, a quick note either way would be greatly appreciated."

Subject: Re: Remote Interview Invitation | The Genesis Science Report

RULES:
✗ No "I just wanted to follow up on my previous email" — too passive, delete it
✗ No em dashes
✗ No exclamation points
Keep it shorter than the original email.`,
  },
  {
    id: 16,
    name: 'Graphics Assignment',
    category: 'Production',
    whenToUse: "Setting up or reviewing a new episode's graphics tracking sheet.",
    text: `You are assigning graphics to crew for Genesis Science Report Episode {###}.

EPISODE SEGMENTS (provide the full rundown with topics):
{PASTE OR LIST ALL SEGMENTS}

CREW DEFAULTS — do not deviate without explicit instruction:
- ISAAC: Opening Monologue (all slots) + Interview 1 (all slots) + Interview 2 (all slots)
- JAKOB: All roll-in segments — The Heavens Declare, Kids Corner, Q&A, Featured Resource, Genesis Science Minute
- JEREMIAH: All B-roll items across all segments

GRAPHIC TYPES BY SEGMENT:
- Opening Monologue: Title Graphic, Propres Quote (scripture), Picture, B-roll (up to 20 slots)
- Interview 1 / Interview 2: Title Graphic, Article Screenshot, Picture, B-roll, Book Cover if applicable (up to 15 slots)
- The Heavens Declare / Kids Corner / Q&A / Ministry Report / Featured Resource / GSM: Roll-in (pre-produced, Jakob)
- Viewer Voices: no graphics needed

STATUS FOR ALL NEW ITEMS: Not Started

GRAPHIC STATUS LIFECYCLE: Not Started → Created → Loaded In

OUTPUT: CSV-format table with these exact columns:
Segment | Graphic # | Graphic Type | Description | Status | Assigned To | Notes

For any sourced image, add attribution in Notes: NONE / CC BY / FAIR USE`,
  },
  {
    id: 17,
    name: 'Graphics Sourcing',
    category: 'Production',
    whenToUse: 'Researching what images, screenshots, and assets to create or find for a specific segment.',
    text: `You are helping source graphics for a Genesis Science Report segment.

SEGMENT: {segment name}
TOPIC: {topic}
GUEST: {name, if applicable}
KEY CLAIMS OR VISUALS NEEDED: {describe what the segment covers}

For each graphic needed, identify:
1. GRAPHIC TYPE: Title Graphic / Article Screenshot / Picture / B-roll / Book Cover / Propres Quote
2. DESCRIPTION: What the image should show
3. SOURCE SUGGESTION: Where to find it (specific URL, site, or ask the guest)
4. ATTRIBUTION: NONE (original creation) / CC BY (credit required) / FAIR USE (news/educational use)

SOURCING RULES:
- Article Screenshots: capture from the original article URL — full-width, text readable
- Book Covers: use publisher site or creationsuperstore.com — high resolution only
- B-roll: prefer royalty-free (Unsplash, Pixabay, NASA public domain) over fair use when possible
- Guest photos: use press photos from their organization's website if available
- ProPresenter Quotes: Scripture only — exact KJV text, no paraphrase

ATTRIBUTION NOTE: Fair use applies for screenshots of news articles in an educational/commentary context. Always log the source URL in the Notes column of the Graphics Tracker.`,
  },
  {
    id: 18,
    name: 'Distribution Checklist',
    category: 'Post-Production',
    whenToUse: 'Before and after delivering a finished episode to all platforms.',
    text: `You are walking me through the episode delivery checklist for Genesis Science Report Episode {###}.

EPISODE FILE NAME: {FILENAME}
YOUTUBE TITLE: {TITLE}
AIR DATE: {TUESDAY, MONTH DATE, YEAR}
THUMBNAIL READY: YouTube 1280×720? {YES/NO} | RLN 1200×1800? {YES/NO}
METADATA READY: Description, tags, timestamps? {YES/NO}

CONFIRM STATUS FOR EACH PLATFORM:

☐ 1. YOUTUBE (Phase 1 — automated via youtubeuploader)
   - File uploaded with correct filename
   - Title, description, and tags entered
   - Chapter timestamps added to description
   - Scheduled for Monday at 4:00 PM ET (day before Tuesday air)
   - Category ID: 28 (Science & Technology) — do not change to 24, 27, or 29
   - Playlists: Genesis Science Report, Season 3, [topical playlist if applicable]
   - Thumbnail: 1280×720

☐ 2. DROPBOX (Phase 1 — automated)
   - File in: /David Rives Ministries/Genesis Science Report/{FILENAME}

☐ 3. RUMBLE (manual — Phase 2 Playwright planned)
   - File uploaded, titled correctly

☐ 4. FIRESIDE.FM (manual — Phase 3 Playwright planned)
   - Episode uploaded with title, description, artwork
   - Auto-distributes to Apple Podcasts + Spotify

☐ 5. SIGNIANT MEDIA SHUTTLE (for Real Life Network / RLN)
   - File submitted via Signiant
   - RLN thumbnail included: 1200×1800 px portrait (different from YouTube)
   - Note: RLN = same as RightNow Media

☐ 6. STREAMHOSTER (FTP — feeds Roku, Apple TV, iOS app, LG TV)
   - Uploaded via FTPS in passive mode
   - Feed configuration unchanged
   - Contact: Jackson Harris, jw-rd.com (for feed/config issues only)

☐ 7. GENESIS SCIENCE NETWORK (internal)
   - Delivered per standard internal process

Flag any platform that is not confirmed complete.`,
  },
  {
    id: 19,
    name: 'Rundown Creator Population',
    category: 'Production',
    whenToUse: 'Populating the Graphics and Last Line columns in Rundown Creator from an episode script.',
    warning:
      'RC API requires RundownID (capital R and D) — not rundownId. API returns errors as HTTP 200 with JSON body — empty result is likely an API error.',
    text: `You are parsing a GSR episode script to populate Rundown Creator fields.

RUNDOWN ID: {RundownID — format required by RC API}
SCRIPT TEXT:
{PASTE FULL SCRIPT HERE}

RUNDOWN CREATOR COLUMN IDs (fixed — do not change):
- COL_GRAPHICS = '1'  (Graphics column)
- COL_LASTLINE = '4'  (Last Line / director cue column)

PARSE THE SCRIPT for these inline cue tags:
- <gfx: DESCRIPTION> → populate COL_GRAPHICS for that row
- <broll: DESCRIPTION> → add to COL_GRAPHICS as "B-roll: DESCRIPTION"

For COL_LASTLINE: identify the last spoken word or cue before each segment transition (the line that tells the director to cut to the next segment).

OUTPUT FORMAT — one row per rundown segment:
| Segment Name | Graphics (COL_GRAPHICS) | Last Line (COL_LASTLINE) |

If the script has no inline cue tags, infer the graphic needs from segment content and mark each row (INFERRED — verify with production).

IMPORTANT: The RC API returns errors as HTTP 200 with JSON body {"error": "..."}. If you get an empty result or unexpected response, this is likely an API error, not an empty rundown.`,
  },
  {
    id: 20,
    name: 'Episode Metadata JSON',
    category: 'Post-Production',
    whenToUse: 'Generating the structured metadata JSON for the distribution automation pipeline.',
    text: `You are generating the episode metadata JSON for the distribution automation pipeline.

INPUTS:
- Season: 3
- Episode number: {###}
- YouTube title: {from Prompt 08}
- Air date: {YYYY-MM-DD} (always a Tuesday)
- YouTube description: {from Prompt 09}
- Tags: {from Prompt 09}
- YouTube thumbnail URL: {1280×720}
- RLN thumbnail URL: {1200×1800 — or PENDING}
- Video filename: {FILENAME}

OUTPUT: Valid JSON matching this schema exactly:

{
  "season": 3,
  "episode_number": {###},
  "title": "{YOUTUBE TITLE}",
  "air_date": "{YYYY-MM-DD}",
  "youtube": {
    "title": "{YOUTUBE TITLE}",
    "description": "{FULL DESCRIPTION — escape newlines as \\n}",
    "tags": ["{TAG1}", "{TAG2}", "..."],
    "category_id": "28",
    "playlist_titles": ["Genesis Science Report", "Season 3"],
    "scheduled_publish": "{MONDAY BEFORE AIR DATE}T16:00:00-04:00",
    "thumbnail_url": "{1280x720 URL}"
  },
  "rln": {
    "thumbnail_url": "{1200x1800 URL or null}"
  },
  "file": {
    "filename": "{FILENAME}",
    "dropbox_path": "/David Rives Ministries/Genesis Science Report/{FILENAME}"
  }
}

VALIDATION RULES:
- scheduled_publish is always the Monday immediately before the air_date at 16:00 ET (-04:00 EDT or -05:00 EST depending on season)
- category_id is always "28" (Science & Technology) — never 24, 27, or 29
- tags array: exactly 9 anchor tags first, then 10–18 topical tags
- air_date is always a Tuesday — flag if it is not`,
  },
]

export const CATEGORIES: Category[] = [
  'Research',
  'Script',
  'Graphics',
  'Email',
  'Metadata',
  'Production',
  'Post-Production',
]
