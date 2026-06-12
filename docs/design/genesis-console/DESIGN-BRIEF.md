# Genesis Console — original design brief

Provenance: exported Claude.ai project "Genesis Console — GSR Design System" (2026-05-31 → 06-02), via the create_design_system skill. Reconstructed from the build log (write_file + str_replace_edit replayed in order; 25 edits applied, 0 missed).

---

We will create a design system in this project.

**Company description:** You are designing a single-screen production command dashboard — "The Genesis Console" — for the SOLE producer of THE GENESIS SCIENCE REPORT (GSR), a weekly creationist science TV show anchored by David Rives. Build it as ONE self-contained HTML file (inline CSS + JS, no build step, no external assets).

THE CENTRAL CHALLENGE: this dashboard carries a HIGH VOLUME of information, but it must feel CALM, sleek, and instrument-grade — never busy or cluttered. Solve density and beauty together. Your guiding principle: like glass, the interface should bend and filter what's already there, never decorate. Design by subtraction.

AESTHETIC — "cosmic liquid glass," masculine, premium:
- Deep-space near-black base (#06070B). Generate the cosmos in PURE CSS (layered radial-gradient nebula + a CSS starfield + faint grain). Cool palette only: ice-blue (#5BD0FF), teal (#36D6C3), and a gold structural hairline (#C9A84C). NO purple, magenta, pink, pastel, or warm bloom — those read feminine and are explicitly rejected.
- Liquid glass panels: backdrop-filter blur(10-14px) saturate(130%); cool semi-transparent tint; 1px hairline border with a brighter top-edge catch-light; inset top highlight + inset bottom shadow; soft drop shadow; small radius (4-6px); faint grain overlay; and a POINTER-TRACKED specular highlight (a radial-gradient that follows the cursor via a CSS custom property updated on pointermove). Restrained light, no big glow.
- Typography (load from Google Fonts; NEVER use Inter, Roboto, Arial, or system fonts): Saira Condensed for display, IBM Plex Mono for all numeric/data readouts (tabular figures), Saira for body/labels. Use ALL-CAPS tracked micro-labels. Render the hero countdown numerals in HOLLOW OUTLINE type (-webkit-text-stroke, transparent fill) as a nod to a TV title card.

HOW TO KEEP IT CALM UNDER HIGH VOLUME — use these specific techniques:
1. ONE HERO: time-to-air is a single oversized number that dominates; everything else is smaller and quieter. Wrap it in a thin RADIAL DEPLETION ARC that drains as air approaches.
2. PROGRESSIVE DISCLOSURE: panels are minimal at rest (name + status dot + a tiny inline bar). On hover, the glass "lifts" to reveal depth (guest, script status, L3 count, notes). ~80% of detail stays hidden until asked for. The resting state must work alone.
3. BULLET GRAPHS instead of timing numbers: each segment = a thin bar where a ghost bar is the target, a solid bar is actual, and a tick marks the 26:30 line. Over-target reads as shape, not digits.
4. OPACITY = PIPELINE STAGE: booking "pitch" at 35% opacity, "48h pending" at 60%, "confirmed" at 100%. You read board health in half a second.
5. PREATTENTIVE DISCIPLINE: only THREE status hues (teal = ready/confirmed, gold = needs attention/tentative, soft red = over/missing). Reserve MOTION for exactly ONE thing — a slow breathing pulse on the imminent-air indicator. Nothing else moves at rest.
6. DATA-INK: no gridlines, no panel borders drawn as boxes — separate sections with whitespace, alignment, and faint background luminosity steps. Labels only where color can't already say it.
7. Tasteful entrance: ONE orchestrated staggered load (opacity + 16px translateY, ~60ms stagger, expo easing) and a count-up on the hero number. Premium easing, never linear.

LAYOUT: a persistent top strip (show name, anchor "David Rives", live show clock HH:MM:SS, status "IN BUILD", EP 214, air FRI 8:00P CT, runtime target 26:30). Then a dense-but-calm grid covering all modules below. Make it a real working producer tool, responsive, and accessible (real text, semantic headings, sufficient contrast).

THE DATA (render all of it, calmly):
- COUNTDOWN TO AIR: 02:14:37 (live-counting), inside the radial arc.
- RUNDOWN (9 rows, status pills): 01 Cold Open [On Air], 02 Monologue — Soft Tissue [Ready], 03 L3 Package · 15ct [Ready], 04 Toss to Guest [Draft], 05 Interview — Dr. Michael Houts (NASA · remote) [Hold], 06 Ministry Report [Draft], 07 GSM Toss [Draft], 08 Scriptural Reflection (David) [Draft], 09 Closer + CTA [Draft].
- SEGMENT TIMING vs 26:30 target, stacked total 22:55 — Cold Open 0:35, Monologue 4:10, Interview 11:20 (OVER), Ministry Report 3:05, Reflection 2:15, Closer 1:30. Use bullet graphs.
- BOOKING PIPELINE (use opacity-as-stage): Dr. Michael Houts (NASA · Space Nuclear) Confirmed; Tommy Lohman (Paleontology) 48h; Dr. K. Sanford (Genetics) 48h; R. Guliuzza (Adaptation) Pitch; Dr. J. Tomkins (Genomes) Pitch.
- EPISODE PIPELINE: EP 212 & 213 Aired; EP 214 In Build (Fri); EP 215 Booking; EP 216 Research; EP 217+ Open.
- PRODUCER TASK QUEUE: Lock 15 lower-thirds (Today); Confirm Houts remote uplink (Wed); Draft ministry report (Thu); Send EP 215 pitch slug-lines (Fri).

Deliver the complete HTML in one artifact. Commit fully to a singular, coherent creative vision — every choice should obviously serve it. Make it genuinely beautiful and genuinely practical at this data volume.

**Uploaded files** (read via the project filesystem):
- `uploads/GSR_2026_L3rd_BUG_ONLY_Looping_v07_000030_4K_2997_PreMultiplied_Pr4444.mp4`
- `uploads/GSR_2026_L3rd_BUG_ONLY_WHITE_Looping_v07_000100_4K_2997_PreMultiplied_Pr4444.mp4`
- `uploads/GSR_2026_L3rd_Looping_v07_000100_4K_2997_PreMultiplied_Pr4444.mp4`
- `uploads/GSR_2026_L3rd_Looping_v08_000100_4K_2997_PreMultiplied_Pr4444.mp4`
- `uploads/GSR_2026_OnSet_GraFX_3Screens_v5_000200_1080p_2997_Pr422LT.mp4`
- `uploads/GSR_2026_OnSet_GraFX_CenterScreen_1080p_2997_PR422.mp4`

**Design system repos:** The user attached the following. Browse on demand with `github_get_tree` (returns the importable files — text, images, and fonts) and pull in the ones you actually need with `github_import_files` (narrow `path_prefix` — don't import the whole tree). If GitHub isn't connected yet, call `connect_github` and stop; once they connect, these tools become available on the next turn. Nothing from these repos is pre-loaded — read only what you need.
When creating your README.md, you should reference the URLs of the GitHub projects you used as input, and suggest to the reader that they can explore these repositories further to do a better job of building designs based on this product.
- heroui-inc/heroui

---

Design systems are folders on the file system containing typography guidelines, colors, assets, brand style and tone guides, css styles, and React recreations of UIs, decks, etc. they give design agents the ability to create designs against a company's existing products, and create assets using that company's brand. Design systems should contain real visual assets (logos, brand illustrations, etc), low-level visual foundations (e.g. typography specifics; color system, shadow, border, spacing systems) and also high-level visual ELEMENTS (buttons, full screens) within ui kits.

No need to invoke the create_design_system skill; this is it.

To begin, create a todo list with the tasks below, then follow it:

- Explore provided assets and materials to gain a high-level understanding of the company/product context, the different products represented, etc. Read each asset (codebase, figma, file etc) and see what they do. Find some product copy; examine core screens; find any design system definitions.
- Create a README.md with the high-level understanding of the company/product context, the different products represented, etc. Mention the sources you were given: full Figma links, GitHub repos, codebase paths, etc. Do not assume the reader has access, but store in case they do.
- Call set_project_title with a short name derived from the brand/product (e.g. "Acme Design System"). This replaces the generic placeholder so the project is findable.
- IF any slide decks attached, use your repl tool to look at them, extract key assets + text, write to disk.
- Explore the codebase and/or figma design contexts and create a colors_and_type.css file containing CSS vars for both base type + color styles (e.g. fg1, fg2, serif-display, etc) and semantic CSS vars (e.g. h1, h2, code, p). Copy any webfonts or ttfs into fonts/.
- Explore, then update README.md with a CONTENT FUNDAMENTALS section: how is copy written? What is tone, casing, etc? I vs you, etc? are emoji used? What is the vibe? Include specific examples
- Explore, update README.md with VISUAL FOUNDATIONS section that talks about the visual motifs and foundations of the brand. Colors, type, spacing, backgrounds (images? full-bleed? hand-drawn illustrations? repeating patterns/textures? gradients?), animation (easing? fades? bounces? no anims?), hover states (opacity, darker colors, lighter colors?), press states (color? shrink?), borders, inner/outer shadow systems, protection gradients vs capsules, layout rules (fixed elements), use of transparency and blur (when?), color vibe of imagery (warm? cool? b&w? grain?), corner radii, what do cards look like (shadow, rounding, border), etc. whatever else you can think of. answer ALL these questions.
- If you are missing font files, find the nearest match on Google Fonts. Flag this substitution to the user and ask for updated font files.
- As you work, create HTML card files in preview/ that populate the Design System tab. Target ~700×150px each (400px max) — err toward MORE small cards, not fewer dense ones. Split at the sub-concept level: separate cards for primary vs neutral vs semantic colors; display vs body vs mono type; spacing tokens vs a spacing-in-use example; one card per component state cluster. A typical system is 12–20+ cards. Skip titles and framing — the asset name renders OUTSIDE the card, so just show the swatches/specimens/tokens directly with minimal decoration. After writing each batch, call register_assets with items carrying viewport {width: 700, height: <your estimate>}, a one-line subtitle, and a `group` tag so the Design System tab can split cards into sections. Use these groups: "Type" for typography specimens and scales, "Colors" for palettes / color scales / semantic colors, "Spacing" for radii / shadow systems / spacing tokens / elevation, "Components" for buttons / form inputs / cards / badges / menus, "Brand" for logos / imagery / anything that doesn't fit the others. Title-cased, consistent across the batch.
- Copy logos, icons and other visual assets into assets/. update README.md with an ICONOGRAPHY describing the brand's approach to iconography. Answer ALL these and more: are certain icon systems used? is there a builtin icon font? are there SVGs used commonly, or png icons? (if so, copy them in!) Is emoji ever used? Are unicode chars used as icons? Make sure to copy key logos, background images, maybe 1-2 full-bleed generic images, and ALL generic illustrations you find. NEVER draw your own SVGs or generate images; COPY icons programmatically if you can.
- For icons: FIRST copy the codebase's own icon font/sprite/SVGs into assets/ if you can. Otherwise, if the set is CDN-available (e.g. Lucide, Heroicons), link it from CDN. If neither, substitute the closest CDN match (same stroke weight / fill style) and FLAG the substitution. Document usage in ICONOGRAPHY.
- For each product given (E.g. app and website), create UI kits in ui_kits/<product>/{README.md, index.html, Component1.jsx, Component2.jsx}; see the UI kits section. Verify visually. Make one todo list item for each product/surface.
- If you were given a slide template, create sample slides in slides/{index.html, TitleSlide.jsx, ComparisonSlide.jsx, BigQuoteSlide.jsx, etc}. If no sample slides were given, don't create them. Create an HTML file per slide type; if decks were provided, copy their style. Use the visual foundations and bring in logos + other assets. Register each slide HTML via register_assets with viewport {width: 1280, height: 720} so the 16:9 frame scales to fit the card.
- Register each UI kit's index.html as its own card via register_assets with viewport {width: <kit's design width>, height: <above-fold height>} — the declared height caps what's shown, so pick the portion worth previewing.
- Update README.md with a short "index" pointing the reader to the other files available. This should serve as a manifest of the root folder, plus a list of ui kits, etc.
- Create SKILL.md file (details below)
- You are done! The Design System tab shows every registered card. Do NOT summarize your output; just mention CAVEATS (e.g. things you were unable to do or unsure) and have a CLEAR, BOLD ASK for the user to help you ITERATE to make things PERFECT.

UI kit details:
- UI Kits are high-fidelity visual + interaction recreations of interfaces. They cut corners on functionality -- they are not 'real production code' -- but they provide high-fidelity UI components. Your UI kits should be pixel-perfect recreations, created by reading the original UI code if possible, or using figma's get-design-context. They should be modular and reusable, so they can easily be pieced together for real designs. UI kits should recreate key screens in the product as click-thru prototypes. a UI kit's index.html must look like a typical view of the product. These are recreations, not storybooks.
- To start, update the todo list to contain these steps for each product: (1) Explore codebase + components in Figma (design context) and code, (2) Create 3-5 core screens for each product (e.g. homepage or app) with interactive click-thru components, (3) Iterate visually on the designs 1-2x, cross-referencing with design context.
- Figure out the core products from this company/codebase. There may be one, or a few. (e.g. mobile app, marketing website, docs website).
- Each UI kit must contain JSX components (well-factored; small, neat) for core UI elements (e.g. sidebars, composers, file panels, hero units, headers, footers, buttons, fields, menus, blog posts, video players, settings screens, login, etc).
- The index.html file should demonstrate an interactive version of the UI (e.g a chat app would show you a login screen, let you create a chat, send a message, etc, as fake)
- You should get the visuals exactly right, using design context or codebase import. Don't copy component implementations exactly; make simple mainly-cosmetic versions. It's important to copy.
- Focus on good component coverage, not replicating every single section in a design.
- Do not invent new designs for UI kits. The job of the UI kit is to replicate the existing design, not create a new one. Copy the design, don't reinvent it. If you do not see it in the project, omit, or leave purposely blank with a disclaimer.

Guidance
- Run independently without stopping unless there's a crucial blocker (E.g. lack of Figma access to a pasted link; lack of codebase access).
- When creating slides and UI kits, avoid cutting corners on iconography; instead, copy icon assets in! Do not create halfway representations of iconography using hand-rolled SVG, emoji, etc.
- CRITICAL: Do not recreate UIs from screenshots alone unless you have no other choice! Use the codebase, or Figma's get-design-context, as a source of truth. Screenshots are much lossier than code; use screenshots as a high-level guide but always find components in the codebase if you can!
- Avoid these visual motifs unless you are sure you see them in the codebase or Figma: bluish-purple gradients, emoji cards, cards with rounded corners and colored left-border only
- Avoid reading SVGs -- this is a waste of context! If you know their usage, just copy them and then reference them.
- When using Figma, use get-design-context to understand the design system and components being used. Screenshots are ONLY useful for high-level guidance. Make sure to expand variables and child components to get their content, too. (get_variable_defs)
- Create these files in the ROOT of the project unless asked not to. For example, README.md should be at the root, not in a folder!
- Stop if key resources are unnecessible: iff a codebase was attached or mentioned, but you are unable to access it via local_ls, etc, you MUST stop and ask the user to re-attach it using the Import menu. These get reattached often; do not complete a design system if you get a disconnect! Similarly, if a Figma url is inaccessible, stop and ask the user to rectify. NEVER go ahead spending tons of time making a design system if you cannot access all the resources the user gave you.

SKILL.md
- When you are done, we should make this file cross-compatible with Agent SKills in case the user wants to download it and use it in Claude Code.
- Create a SKILL.md file like this:

<skill-md>
---
name: {brand}-design
description: Use this skill to generate well-branded interfaces and assets for {brand}, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
</skill-md>
