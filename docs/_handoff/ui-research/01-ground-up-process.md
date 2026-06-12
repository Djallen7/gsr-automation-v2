# How to Design a Dashboard UI From the Ground Up

Teaching module brief for the GSR production-pipeline dashboard.
Date: 2026-06-08
Audience: Daniel (owner, non-developer, builds via Claude Code, lives on his phone)

---

## How to read this document

This is a teaching brief, not a spec. It walks from "what does this person need" to "what screens and components exist," grounded in established design canon. Every principle ends with a one-line tie back to GSR so you can see it in your own show, not in the abstract.

The whole module rests on one locked idea you already settled: the dashboard's only two jobs are (1) tell each person WHAT NEEDS THEM NOW, and (2) show whether the two batches will MAKE THEIR AIR DATES. Everything below is in service of those two jobs. If a screen or widget does not serve one of them, it does not earn a place.

A note on sources: I ran live web research on 2026-06-08 and confirmed each cited source exists at the URL given. Sources are named by author/org and title so they remain citable even if a link rots. No quotes or URLs are invented.

---

## Part 1. The ground-up process (7 concrete steps)

This is the spine of the module. It runs from people to pixels. A non-designer can do every step with a notebook and a list. Do them in order; do not skip to "screens."

### Step 1. List the jobs, per person (Jobs To Be Done)

Before any screen, write down what each person is trying to get done. Not features. Jobs. The Jobs To Be Done lens (Clayton Christensen's milkshake story; Tony Ulwick's Outcome-Driven Innovation) says people "hire" a tool to make progress in a situation. Write each as: "When [situation], I want to [motivation], so I can [outcome]."

GSR examples, one per role:
- Daniel: "When I open my phone between meetings, I want to see what is stuck or waiting on me, so I can unblock it before it threatens an air date."
- Myriam: "When an episode finishes editing, I want to know it is ready for metadata and a thumbnail, so I can publish it before Monday 4pm."
- Isaac: "When a script locks, I want to know which graphics and ProPresenter files are due, so I can build them in batch."
- Interns: same as Isaac minus editing.

Output of this step: one short list of job statements per role. Nothing visual yet.

Cite: Tony Ulwick / Clayton Christensen, "Jobs-to-be-Done" (https://strategyn.com/jobs-to-be-done/ and https://jobs-to-be-done.com/jobs-to-be-done-is-for-more-than-just-milkshakes-fd5737c75cc1).

### Step 2. Turn each job into the questions it asks

Every job is really a question the person needs answered fast. Convert each job statement into the literal question in their head.

GSR examples:
- Daniel: "What is at risk of missing air? What is waiting on my approval right now?"
- Myriam: "Which episodes are ready for me to upload and mark aired?"
- Isaac: "Which episodes need graphics or a ProPresenter load this week?"

Output: a question list per role. This is the real requirements doc. It is more honest than a feature list because it is phrased the way the user actually thinks.

### Step 3. Name the data each question needs (information needs)

For each question, write the smallest set of data that answers it. This is where you resist the urge to show everything. If a field does not help answer a question from Step 2, it does not belong on a primary screen.

GSR example: "What is at risk?" needs, per episode: air date, current stage, whether the stage is overdue, and who owns the next action. That is four fields. It does NOT need runtime, guest bios, or file paths. Those answer other questions and live on a drill-down.

Output: a question -> data map. Keep it ruthless.

### Step 4. Group the data into an information architecture (IA)

Now organize. The reliable pattern for "many items in flight" is three layers (covered in depth in Part 4):
1. An exception/action queue ("what needs me now").
2. An overview matrix (episodes x stages) for the make-the-date question.
3. Drill-down detail per item.

Group your Step 3 data into these three buckets. Anything that is not an action and not a status-at-a-glance falls to the drill-down.

GSR example: "approve this script" is queue. "Episode 312 is on Edit, due Friday, on track" is matrix. "Episode 312 guest contact, file links, notes" is drill-down.

### Step 5. Set the layout hierarchy (most important first)

Decide what the eye hits first, second, third. Refactoring UI's rule is blunt: "Not all elements are equal" - design hierarchy by deciding what matters most and making it visually loudest, demoting the rest with size, weight, and color (Adam Wathan and Steve Schoger, Refactoring UI). Apple's Human Interface Guidelines say the same under Clarity and hierarchy: establish a clear visual hierarchy so the most important information leads.

Borrow the newsroom inverted pyramid: most important first, supporting detail below, nice-to-have last. On a phone this is literal vertical order.

GSR example, Daniel's home order, top to bottom: (1) at-risk count and the single worst item, (2) his approval queue, (3) the two-batch matrix, (4) everything else behind a tap.

### Step 6. Choose components for each piece of data

Only now pick the UI parts. Match the component to the data shape:
- A single number that signals health -> a stat/metric tile or a colored status pill.
- A list of "do this next" items -> an action queue list with one primary button each.
- Many items across the same set of stages -> a grid/matrix (rows = items, columns = stages), not a wall of separate cards (see Part 3's widget-vs-matrix rule).
- Full record of one item -> a detail page or sheet.

Use a known component library so you are not inventing widgets: shadcn/ui (already in this repo) for the parts, with Material Design and Apple HIG as the reasoning references for tables, lists, and touch targets.

GSR example: the pipeline is one matrix component, not nine separate stage widgets.

### Step 7. Design the states (empty, loading, partial, error, done)

A screen is not one picture; it is a set of states. NN/g's heuristics demand "Visibility of system status" and "Help users recognize, diagnose, and recover from errors" (Jakob Nielsen, 10 Usability Heuristics). For each screen define what it shows when: there is nothing to do (empty/done), data is loading, data is stale, something failed, and the happy path.

GSR example: when Daniel's queue is empty the screen should say "Nothing needs you. Both batches on track." in plain language, not a blank panel. When an import errors, say what failed and the one step to fix it.

---

## Part 2. Operational vs analytical dashboards (and why operational wins here)

Stephen Few, in Information Dashboard Design, classifies dashboards by role: strategic, analytical, and operational, and says the role has the greatest impact on the design. The distinction that matters for you:

- Analytical dashboard: built for thinking and exploring. Trends, comparisons, drilling into "why did this change over six months." Slower cadence. Charts and history. Think a year-over-year viewership report.
- Operational dashboard: built for monitoring and acting right now. Real-time status, exceptions, "what is off track this minute." Few says operational dashboards should be real-time and support immediate response, and that they must make exceptions jump out.

GSR is an operational problem. You are not analyzing history; you are running ten episodes through a pipeline against two hard deadlines (Tuesday 8pm air, Monday 4pm publish). The question is never "what is the trend," it is "what is stuck and will we make it." That is monitoring plus exceptions, which is the operational pattern exactly. So the home screen is an exception/action queue, not a chart deck.

The deeper reason: an operational dashboard that surfaces exceptions respects a time-pressed, ADHD owner on a phone. It tells him the 3 things that are off, not the 47 things that are fine. Analytical dashboards make you go look; operational dashboards come find you.

Cite: Stephen Few, Information Dashboard Design (O'Reilly / Analytics Press) - see review and overview at https://www.uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php and https://www.perceptualedge.com/library.php.

---

## Part 3. IA patterns for "many items in flight": queue + matrix + drill-down

When you have many items moving through the same set of steps (10 episodes through 9 stages), three patterns combine:

1. The action queue (the exception list). A flat list of "things that need a human," sorted by urgency. This is the front door. Stephen Few's monitoring principle: surface what is off, not everything. It directly answers "what needs me now."

2. The pipeline matrix (the grid). Rows = episodes, columns = the 9 stages, each cell shows that stage's status (done / in progress / blocked / overdue / not started). One glance answers "will both batches make their dates." This is the at-a-glance monitor Few describes as the heart of a dashboard.

3. The drill-down (detail on demand). Tap a cell or an episode to see the full record. This is progressive disclosure (Jakob Nielsen, NN/g): show the few important things first, defer the rest to a secondary screen, which reduces cognitive load.

### The rule of thumb: widget vs grid/matrix

This is the most useful single heuristic in the module:

- Use a separate WIDGET (its own tile/card) when a thing is unique - one number, one chart, one standalone status. A widget is for one subject.
- Use a GRID / MATRIX when you have MANY items that share the SAME attributes. The moment you find yourself about to build the second card that looks like the first, stop: that is a row in a table, not another widget.

Said plainly: repetition is a table. Uniqueness is a widget. Nine stage-widgets that each list episodes is the wrong shape; one matrix with episodes down the side and stages across the top is the right shape. Material Design's data-table guidance and Apple HIG's lists-and-tables guidance exist precisely for this "many items, same columns" case.

GSR example: "episodes at risk" is a count = one widget. "Every episode and what stage it is on" = one matrix. Do not build a card per episode.

Cite: Jakob Nielsen, "Progressive Disclosure," NN/g (https://www.nngroup.com/articles/progressive-disclosure/); Apple HIG "Lists and tables" (https://developer.apple.com/design/human-interface-guidelines/lists-and-tables); Material Design (https://m3.material.io/).

---

## Part 4. What earns the home screen (the 5-element cap and one focal point)

A phone home screen is scarce real estate and you have an ADHD, time-pressed user. Two rules govern it:

1. One focal point. The single most important thing on the screen should be unmistakable and biggest. Refactoring UI: hierarchy is everything; not all elements are equal; make the primary thing visually dominant and mute everything else. Apple HIG echoes it under Clarity.

2. A hard cap of about 5 primary elements. This is a working budget, not a law of nature, but it forces the demotion decisions that keep the screen scannable. Anything beyond the cap must earn its place by bumping something off, or it gets demoted to a drill-down via progressive disclosure.

How to decide what earns a slot: run each candidate through Steps 1-3. Does it answer a top question for THIS person right now? If yes, it can compete for the 5 slots. If it answers a "later" or "sometimes" question, it is a drill.

GSR example, Daniel's 5 on the phone:
1. At-risk headline (focal point): "1 episode at risk of missing Tuesday."
2. Approval queue: the items waiting on his yes.
3. Batch A matrix (pre-production 5).
4. Batch B matrix (post-production 5).
5. A single "everything else" entry point.

Demoted to drills: guest details, file paths, runtimes, per-stage notes, history. They answer real questions, just not the home-screen ones.

Scoped views per role follow the same recipe with that person's Step 2 questions: Myriam's home leads with "ready to publish," Isaac's with "graphics/ProPresenter due," interns get Isaac's minus editing. Same skeleton, different top questions, which is the NN/g "Match between system and the real world" heuristic - the screen speaks each person's job.

---

## Part 5. The frameworks and heuristics to cite (the canon for this module)

Lead the teaching module with these five principles. They are the ones that actually drive the GSR design:

1. Jobs To Be Done before screens. Design from "what is each person trying to get done," not from features. (Ulwick / Christensen.)

2. Operational, exception-first, not analytical. Surface what is off and what needs action now; this fits a deadline-driven pipeline. (Stephen Few, Information Dashboard Design.)

3. Repetition is a table, uniqueness is a widget. Many items sharing the same columns = one matrix, not many cards. (Material Design / Apple HIG tables; the widget-vs-grid rule.)

4. Progressive disclosure with a focal point and a ~5-element cap. Show the few most important things; defer the rest to a tap. (Jakob Nielsen / NN/g; Refactoring UI hierarchy.)

5. Design states and speak the user's language. Every screen needs empty/loading/error/done states, plain words, and visible system status. (NN/g 10 Usability Heuristics.)

### Cited sources (confirmed live 2026-06-08)

1. Jakob Nielsen, "10 Usability Heuristics for User Interface Design," Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/ (use especially: Visibility of system status; Match between system and real world; Error recovery; Aesthetic and minimalist design.)
2. Jakob Nielsen, "Progressive Disclosure," Nielsen Norman Group. https://www.nngroup.com/articles/progressive-disclosure/
3. Stephen Few, Information Dashboard Design: The Effective Visual Communication of Data / Displaying Data for At-a-Glance Monitoring (O'Reilly / Analytics Press). Overview and review: https://www.uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php ; author library: https://www.perceptualedge.com/library.php
4. Adam Wathan and Steve Schoger, Refactoring UI (especially "Hierarchy is Everything" / "Not all elements are equal"). https://www.refactoringui.com/
5. Tony Ulwick (Outcome-Driven Innovation) and Clayton Christensen (the milkshake study), Jobs-to-be-Done. https://strategyn.com/jobs-to-be-done/ and https://jobs-to-be-done.com/jobs-to-be-done-is-for-more-than-just-milkshakes-fd5737c75cc1
6. Apple, Human Interface Guidelines - foundations (Clarity, hierarchy) and "Lists and tables." https://developer.apple.com/design/human-interface-guidelines/ and https://developer.apple.com/design/human-interface-guidelines/lists-and-tables
7. Google, Material Design (data tables, lists; cross-device system). https://m3.material.io/

---

## One-page recap for Daniel

1. Write what each person is trying to get done, then the question in their head.
2. List the smallest data that answers each question. Cut everything else.
3. Sort that data into three layers: a "needs you now" queue, an episodes-x-stages matrix, and tap-for-detail.
4. On the phone home, one biggest thing, about five total, the rest behind a tap.
5. Many episodes with the same stages is ONE matrix, never a card per episode.
6. The dashboard is operational: it tells you what is off and whether you will make air, it does not make you go analyze.
