# Mobile-First Design for an Operational Dashboard

Research brief, 2026-06-08
Module 04 of the GSR UI-research set.

Audience: the GSR per-role production-pipeline dashboard. Primary user is Daniel, a non-developer, ADHD, time-pressed owner who lives on his phone. Stack: Next.js 16 + shadcn/ui + Tailwind v4 on Vercel.

Locked decisions this brief supports (do not relitigate):
- Bottom tab bar, 4 destinations: Today, Episodes, Approvals (with badge count), More.
- No hamburger.
- Push notifications are the real front door, deep-linking to the exact task.
- Confirmations are one-tap choices.

Web research was live for this brief (June 2026). Every number below traces to a named primary source with a URL. No URLs or quotes are invented.

---

## 0. The one-paragraph thesis

For a phone-first ADHD owner, the screen is not the front door, the notification is. The job of the UI is to take a person who arrived from a push notification straight to one decision, make that decision a single thumb-reachable tap, and never make him hunt. Design the phone screen first and treat the desktop as the enhancement, not the reverse. Everything below is in service of that.

---

## 1. Mobile-first method: smallest screen first, then enhance up

Mobile-first means you design and build the smallest, most constrained screen first, then progressively add capability as the viewport grows. The discipline matters because the small screen forces brutal content prioritization: there is only room for what the user actually needs right now, so secondary material gets cut or deferred instead of crowding the primary action. When you start on desktop and shrink down, the opposite happens. You try to cram a wide layout into a narrow one and everything competes.

Why this fits Daniel specifically:
- Content priority: on the Today screen, the single most important thing is "what needs you right now." One primary action, visible without scrolling, above everything else. Reference material (full episode history, settings) lives deeper or on the More tab.
- Progressive enhancement: the same data that collapses to a color bar on his phone (section 4) can fan out into the full 9-stage desktop matrix when a producer opens it on a laptop. Build the phone version first; the desktop matrix is the enhancement.
- ADHD load: every extra choice on screen is a chance to get pulled off task. Smallest-screen-first naturally produces the least cluttered default.

Thumb-zone ergonomics and reachability. Around three quarters of users operate their phones with their thumbs, and the reachable area is not the whole screen. The screen divides into a green zone (bottom-center, easy reach), a yellow zone (mid-screen and sides, reachable with a stretch), and a red zone (top corners, awkward or impossible one-handed). Tap accuracy and speed are dramatically better in the natural bottom zone than in the stretch zone. Practical rule for GSR: primary actions and navigation live in the bottom third. Destructive or rarely-used controls can sit up top where an accidental thumb-brush is unlikely.
Source: Nielsen Norman Group, "The Thumb Zone" research as summarized in current mobile-UX literature; primary reachability model traces to Steven Hoober's field study of how people hold phones (https://www.lukew.com/ff/entry.asp?1085 collects the touch-target data; thumb-zone summary at https://parachutedesign.ca/blog/thumb-zone-ux/).

Why bottom nav beats top nav and hamburger on mobile. Top nav and hamburger icons sit in the red zone (top corners), the hardest place to reach one-handed. A persistent bottom bar sits in the green zone and stays put as the user scrolls. This is exactly why the locked decision is correct.

---

## 2. Navigation: the bottom tab bar

Best-practice rules for a bottom navigation bar, from Material Design 3's Navigation Bar guidance:
- Use 3 to 5 top-level destinations of roughly equal importance. Fewer than 3 should be tabs instead; more than 5 puts tap targets too close together and they get mis-hit. GSR's 4 (Today, Episodes, Approvals, More) sits right in the sweet spot.
- Destinations must be persistent and consistent across screens, so the user always knows where they are and where home is.
- Each destination is an icon plus a text label. Do not rely on icon-only; labels remove the guessing, which matters for a non-developer.
- Avoid scrollable content inside the bar; keep it fixed.
Source: Material Design 3, Navigation bar guidelines, https://m3.material.io/components/navigation-bar/guidelines

Badges. The Approvals badge count is the correct pattern: a numeric badge on a persistent destination is the lightweight, always-visible signal that there is work waiting, without forcing a notification or a screen change. It pairs naturally with the exception-queue model in section 3, the badge is the resting-state version of the push notification.

When a "More" tab is right. A "More" (or overflow) tab is the correct choice when you have more than 5 genuine destinations but only 3 to 4 deserve a permanent slot. It keeps the primary bar uncluttered while still giving everything else a discoverable, labeled home, unlike a hamburger, "More" is visible and self-describing. GSR's settings, guests, toolkit, and similar secondary pages belong behind More. The test: if Daniel needs it daily, it earns a top slot; if occasionally, it goes under More.

Why hamburger menus hurt discoverability (the established critique). Nielsen Norman Group ran a 179-participant study (with WhatUsersDo) comparing hidden navigation (hamburger), visible navigation, and combo navigation across 6 sites on both phones and desktops. Findings:
- Hidden navigation cut content discoverability by about 20% versus visible or combo navigation.
- On mobile, users were 15% slower with hidden navigation; on desktop, at least 39% slower.
- Hidden navigation was used far less: on mobile, 57% of the time versus 86% for combo navigation.
- Perceived task difficulty rose 21% with hidden navigation.
- Conclusion, in NN/G's words: hidden navigation significantly decreases user experience both on mobile and on desktop.
For an ADHD owner who will not go digging, "out of sight, out of mind" is not a metaphor, it is the failure mode. The bottom bar keeps the four things that matter literally always on screen.
Sources: Nielsen Norman Group, "Hamburger Menus and Hidden Navigation Hurt UX Metrics," https://www.nngroup.com/articles/hamburger-menus/ ; and "Beyond the Hamburger: What Makes Navigation Discoverable on Mobile," https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/

---

## 3. Notifications as the front door

The model: Daniel rarely opens the app cold to browse. The expected loop is "phone buzzes -> notification states the one thing that needs him -> tap -> he is on the exact task -> one-tap decision -> done." The app's home screen is the fallback, not the entry point.

Deep-linking to the exact task. The notification must not drop the user on a generic home or list screen and make him navigate. It deep-links to the specific item (this episode, this approval). In Next.js terms this is a stable per-item route (e.g. /approvals/[id]) that the push payload carries, so a cold tap from the lock screen lands on the decision. This is the single highest-leverage detail in the whole design for this user, it removes navigation entirely from the critical path.

Notification UX best practices (NN/G, "Five Mistakes in Designing Mobile Push Notifications"):
- Relevance over volume. Do not notify for every event. Notifying for everything is the top mistake; it trains the user to swipe all of them away (and to disable notifications, which kills the front door). Notify only when Daniel must act.
- Actionable and self-explanatory. The headline alone should convey the purpose and required action. NN/G's example: Uber's "Rate your trip" tells you what to do without opening anything. GSR equivalent: "Approve lower thirds for Ep 214?" not "You have a new update."
- Timely and concise. Users expect push to be brief and only for urgent content. Send at the moment the decision is actually needed, not batched hours later.
Source: Nielsen Norman Group, "Five Mistakes in Designing Mobile Push Notifications," https://www.nngroup.com/articles/push-notification/ ; related: "Transactional Notifications," https://www.nngroup.com/articles/transactional-notifications/

How this fits an exception-queue model. An exception queue surfaces only the items that need human judgment; the routine cases flow through automatically. Push notifications are the natural delivery mechanism for that queue: each exception that needs Daniel becomes one notification, deep-linked to that one item. The Approvals badge (section 2) is the same queue's resting-state count. When the queue is empty, there are no notifications and the badge is gone, which is exactly the calm default an ADHD user needs. The system should never notify just to be seen; silence means "nothing needs you," and that has to stay true or the front door loses its trust.

---

## 4. Responsive data-density: the matrix collapse

The desktop view of the pipeline is a dense matrix: each episode is a row, each of the 9 production stages is a column, cells show stage status. That matrix is unreadable on a 390px-wide phone, and forcing horizontal scroll across 9 columns is a known anti-pattern.

The collapse pattern (recommended):
- Default (collapsed) phone row, per episode: one horizontal segmented color bar representing the 9 stages (each segment colored by status: done / in-progress / blocked / not-started), plus the air date and a single status chip summarizing overall state ("On track," "Needs you," "At risk"). That is the entire glanceable row: progress, deadline, headline status.
- Tap to expand: the row opens into a vertical stepper, one stage per line, top to bottom, each with its own status and any action. Vertical stepping is the correct mobile transform of horizontal columns, it uses the axis the phone actually has (scroll down), keeps each stage at full touch-target size, and reads in natural reading order.

Why this works for Daniel: the segmented bar is a single-glance health read (he can triage the whole season by scanning color), the status chip gives him the one word he needs, and detail is one tap away only when he wants it. No horizontal scrolling, no 9 tiny cells fighting for a thumb.

Responsive table patterns generally (in order of preference for this case):
1. Priority columns / progressive disclosure: show only the most important fields on small screens, reveal the rest on tap or on a wider viewport. (This is the collapse above.)
2. Cards: each row becomes a stacked card on mobile. Good fallback if the segmented bar proves too abstract.
3. Avoid: raw horizontal-scroll tables and "zoom out" miniature tables, both fail the thumb-zone and legibility tests.
The general principle is the same as section 1: prioritize content for the small screen first, then let the desktop matrix be the enhanced, denser view of the identical data.

---

## 5. Touch ergonomics: the exact numbers

Use these as hard rules in the shadcn/Tailwind component sizing. They are the authoritative figures from the named standards:

- Apple Human Interface Guidelines: minimum 44 x 44 points for any tappable control. This is Apple's baseline for accurate finger tapping.
  Source: Apple HIG, https://developer.apple.com/design/human-interface-guidelines/accessibility (and Apple's "UI Design Do's and Don'ts," https://developer.apple.com/design/tips/)
- Material Design 3 (Android/Google): recommended minimum 48 x 48 dp touch target (about 9mm physical, roughly a fingertip), even when the visible icon is smaller (e.g. a 24dp icon padded out to a 48dp target). Pointer (mouse/stylus) targets minimum 44 x 44 dp.
  Source: Material Design accessibility, https://m3.material.io/foundations/designing/structure and https://m2.material.io/design/usability/accessibility.html
- Spacing between targets: at least 8 dp of space between adjacent targets to prevent mis-taps and keep density balanced.
  Source: Material Design, as above.
- WCAG 2.2 Success Criterion 2.5.8, Target Size (Minimum), Level AA: targets at least 24 x 24 CSS pixels, OR undersized targets spaced so a 24px-diameter circle centered on each does not overlap a neighbor. Note this is the accessibility floor, not the comfortable target; Apple's 44 and Material's 48 are the usability recommendations and align with WCAG 2.5.5 (Level AAA, 44 x 44 CSS px).
  Source: W3C WAI, "Understanding SC 2.5.8: Target Size (Minimum)," https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

Practical GSR rule of thumb: build interactive controls at 44 to 48px minimum, with 8px+ gaps. Treat 24px as the absolute legal/accessibility floor you never go below, not a target to design to.

One-tap confirmations and avoiding tiny controls. The locked decision (confirmations as one-tap choices) is the right ergonomic call: a destructive or important action should present full-width, clearly labeled buttons (e.g. "Approve" / "Not yet"), each comfortably above 44px tall and in the thumb zone, rather than a tiny "OK"/"Cancel" pair or a small toggle. For an ADHD user under time pressure, big labeled buttons reduce both mis-taps and decision friction. Never put a critical action behind a small icon-only control.

---

## 6. PWA / install-to-homescreen and offline (brief, and relevant)

This is relevant for a phone-first owner, lightly:
- Install to home screen (PWA): a Next.js app with a web manifest and a service worker can be added to the iOS/Android home screen and launch full-screen like a native app, no app store. For Daniel this means a real icon he taps, not a bookmark he forgets. It also enables web push on supported platforms, the front door from section 3. Worth doing.
- Offline: full offline editing is overkill here and adds sync complexity the system does not need. The useful, low-cost win is graceful degradation: cache the last-loaded Today/Approvals view so a momentary dead zone shows the last known state instead of a blank error, and queue a tap so a flaky connection does not lose his approval. Do the read-cache and the queued-action; skip a full offline database.
- Caveat: iOS web push requires the site to be installed to the home screen as a PWA. If push is the front door, prompting Daniel to install is not optional polish, it is what makes notifications work on an iPhone. Verify current iOS behavior at build time.

---

## Best cited sources (the 8 to teach from)

1. Material Design 3, Navigation bar guidelines (3-5 destinations, persistent, icon+label, badges) - https://m3.material.io/components/navigation-bar/guidelines
2. Nielsen Norman Group, "Hamburger Menus and Hidden Navigation Hurt UX Metrics" (the 20% discoverability drop, 15% mobile / 39% desktop slowdown) - https://www.nngroup.com/articles/hamburger-menus/
3. Nielsen Norman Group, "Beyond the Hamburger: What Makes Navigation Discoverable on Mobile" - https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/
4. Nielsen Norman Group, "Five Mistakes in Designing Mobile Push Notifications" (relevance, timing, actionable headlines) - https://www.nngroup.com/articles/push-notification/
5. Apple Human Interface Guidelines, Accessibility (44 x 44 pt minimum touch target) - https://developer.apple.com/design/human-interface-guidelines/accessibility
6. Material Design accessibility / structure (48 x 48 dp touch target, 8dp spacing) - https://m3.material.io/foundations/designing/structure and https://m2.material.io/design/usability/accessibility.html
7. W3C WAI, "Understanding SC 2.5.8: Target Size (Minimum)" (WCAG 2.2 AA, 24 x 24 CSS px floor) - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
8. Steven Hoober / LukeW, touch-target and how-people-hold-phones field data (thumb-zone evidence base) - https://www.lukew.com/ff/entry.asp?1085

Supplementary: NN/G "Transactional Notifications" (https://www.nngroup.com/articles/transactional-notifications/); thumb-zone summary (https://parachutedesign.ca/blog/thumb-zone-ux/).
