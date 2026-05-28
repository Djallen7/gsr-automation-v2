-- One-time bootstrap: insert 168 GSR guest profiles from GUEST_PROFILES.md
-- Run this once against the production Supabase project.
-- Uses ON CONFLICT DO NOTHING so it's safe to re-run.

-- ============================================================
-- SECTION 1: DECEASED — Do Not Contact
-- ============================================================

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, source)
VALUES (
  'Chuck', 'Thurston', 'Dr.', 'ER Physician', 'scienceandwonders.com',
  'Medicine, human body',
  ARRAY['medicine','human body'],
  true, true, true, false,
  'Confirmed deceased — noted explicitly in GSR Guest Contact List as "Medicine, Human Body - DECEASED."',
  'Remove from all active outreach lists permanently.',
  NULL, NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Rusty', 'Maisel',
  'Unconfirmed',
  ARRAY['unknown'],
  true, true, false,
  'Confirmed deceased — noted in GSR Guest Contact List secondary tab.',
  'Remove from all active outreach lists permanently.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Joe', 'Taylor',
  'Unconfirmed',
  ARRAY['unknown'],
  true, true, false,
  'Confirmed deceased — noted in GSR Guest Contact List secondary tab.',
  'Remove from all active outreach lists permanently.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Tommy', 'Mitchell', 'Dr.',
  'Unconfirmed',
  ARRAY['unknown'],
  true, true, false,
  'Confirmed deceased — noted in GSR Guest Contact List secondary tab.',
  'Remove from all active outreach lists permanently.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Buddy', 'Davis',
  'Unconfirmed',
  ARRAY['unknown'],
  true, true, false,
  'Confirmed deceased — noted in GSR Guest Contact List secondary tab.',
  'Remove from all active outreach lists permanently.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, source)
VALUES (
  'Henry', 'Morris', 'Dr.', 'Founder', 'Institute for Creation Research',
  'Apologetics, creationism',
  ARRAY['apologetics','creationism'],
  true, true, true, false,
  'Historical figure; listed in GSR contact database secondary tab but has been deceased for years.',
  'Remove from all active outreach lists permanently.',
  'ICR'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 2: DO NOT CONTACT
-- ============================================================

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, source)
VALUES (
  'Georgia', 'Purdom', 'Dr.', 'Researcher and Speaker', 'Answers in Genesis',
  'Molecular genetics, genomics, creation biology, human genetics',
  ARRAY['genetics','genomics','molecular biology','creation biology'],
  true, false, true, false,
  'Sent a flat refusal in July 2025: "Thanks for reaching out but I''m not interested in being interviewed." No reason given. iPhone reply. Personal refusal, not a scheduling issue — she is AiG staff and knows what GSR is.',
  'If there is a genuine new reason to try, go through AiG''s media coordination channels — do not cold-email her personally again. Her AiG email is gpurdom@answersingenesis.org but direct re-outreach would likely come across poorly given the terse prior refusal.',
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, source)
VALUES (
  'Robert', 'Lillis', 'Dr.', 'Planetary Scientist', 'Space Sciences Laboratory, UC Berkeley',
  'Planetary science, Mars atmosphere, ESCAPADE mission',
  ARRAY['planetary science','Mars','astrophysics','space science'],
  false, false, true, false,
  'Explicit principled refusal: "biblical young-earth creationism (as I believe your work promotes) is completely incompatible with scientific studies of our solar system." Cited all physical laws used in modern technology pointing to Earth being 4.556 billion years old. Polite but firm.',
  'Do not re-approach on any YEC-framing topic. If ever re-approached, it would need to be pure science curiosity with no worldview reference — and even then, probability of a productive outcome is very low.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Drew', 'Casper',
  'Publishing (general)',
  ARRAY['publishing','writing'],
  false, true, true,
  'Research conducted by Daniel generated "red flags" that were consolidated into an executive report for David. Not developed further as a guest candidate. Do not pursue without explicit clearance from David.',
  'Red flags were the determining factor. No further detail documented.'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 3: SENSITIVE (not also in Section 4 — insert once)
-- Note: Paul Nelson and Jake Hebert appear in both S3 and S4;
--       they are inserted once below in Section 4 with sensitive_flag=true.
-- ============================================================

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes)
VALUES (
  'John', 'Mackay',
  'Creationist Researcher and Speaker', 'Creation Research UK',
  'Geology, flood geology, biblical creation, North Sea stratigraphy',
  ARRAY['geology','flood geology','creation','stratigraphy'],
  true, false, false, true,
  'Wife''s health has been in serious ongoing crisis. First withdrawal: February 2025 — "With our gov demands re my wifes health care things have just got too complicated." Re-contacted September 2025; declined again: "Sadly wife not good so I''ll pass on request at present. Look forward to next opportunity." No confirmed resolution as of September 2025.',
  'Wait for him to signal readiness. Do not initiate unless he has indicated the situation has improved.',
  'Do not send a standard outreach template. Open with genuine personal acknowledgment of his situation. All scheduling logistics go through Nadina (nadina@creationresearchuk.com), not John directly.',
  'Past GSR and CTN appearances (multiple); last scheduled booking fell through February 2025.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes, website)
VALUES (
  'John Gideon', 'Hartnett', 'Dr.', 'Cosmologist and Author',
  'Cosmology, physics, young-earth cosmological models',
  ARRAY['cosmology','physics','young-earth','astrophysics'],
  'Gideon1952@proton.me',
  true, false, false, true,
  'Health issues flagged across multiple sessions. January 6, 2026 reply: "I am still with some health issue and prefer not to do this at this time." April 2026 planning session explicitly notes "Ruled out Dr. Hartnett due to health issues" — still active as of spring 2026.',
  'Gentle personal check-in only. No topic asks until health situation resolves.',
  'Decline was soft — left door open for future. Sign-off: "All lives matter." Open with a genuine personal check-in, not a topic pitch. Make the low-pressure out explicit. Do not use a standard outreach template.',
  'Past appearances on GSR Season 2 (confirmed). Listed as 1st choice for physics/time episode in 2026 Article Assignments.',
  'BibleScienceForum.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes)
VALUES (
  'Russ', 'Humphreys', 'Dr.', 'Creation Physicist',
  'Physics, cosmology, starlight and time, magnetic fields, young-universe models, helium diffusion, atomic decay rates',
  ARRAY['physics','cosmology','helium diffusion','magnetic fields','young-earth'],
  'drhumph@swcp.com',
  true, false, false, true,
  'Three documented declines: (1) Feb 2025 — rejected fine-tuned universe/quantum mechanics: "I''m not at all interested in the topic...it''s all baloney, speculation piled on speculation." (2) June 2025 — scheduling conflict only (journal deadline June 30); said "perhaps another occasion." (3) July 2025 — rejected imaginary time article: "I just can''t get enthused about ''imaginary time''...I can''t even work up enough enthusiasm to criticize it." Pattern: will not appear on quantum cosmology, imaginary time, or speculative physics.',
  'Completely approachable for topics in his core lane: helium diffusion, atomic decay rates, magnetic field evidence, young-universe physics. Avoid all quantum cosmology, imaginary time, or speculative physics. When he has a hard writing deadline, schedule around it.',
  'Blunt and opinionated but friendly underlying tone — declines are about topics, not about Daniel or GSR. Signs "Russ Humphreys."',
  'Past GSR appearances (multiple); listed in 2026 Article Assignments as 2nd choice for January time/physics episode.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes)
VALUES (
  'John', 'Byl', 'Dr.', 'Theologian and Scientist', 'Trinity Western University',
  'Galactic astronomy, theoretical physics, applied mathematics, philosophy of science, cosmology, probability',
  ARRAY['astronomy','philosophy of science','cosmology','mathematics','probability'],
  'byl@twu.ca',
  true, false, false, true,
  'Declined July 2025 on two grounds: (1) topic (communication technology breakthrough) was "just another sensationalized story" he considered not worth following up on; (2) he was "likely unavailable on August 7" regardless. He was critical of the article selection, calling it a minor advance hyped as a breakthrough.',
  'Approach again with foundational topics in his domain (philosophy of science, cosmology, probability). Avoid hyped tech breakthrough articles.',
  'High standards for what constitutes genuinely significant science. Contact: johnmbyl@gmail.com.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes)
VALUES (
  'Andy', 'McIntosh', 'Prof.', 'Professor of Thermodynamics and Combustion Theory (Emeritus)', 'University of Leeds',
  'Thermodynamics, combustion, information theory, biomimetics, engineering principles in biology, bombardier beetle, second law applications',
  ARRAY['thermodynamics','combustion','biomimetics','information theory','engineering'],
  'stuartburgess@live.co.uk',
  true, false, false, true,
  'Cancelled a scheduled Jupiter interview with short notice: "Apologies Daniel / David — Re Jupiter interview, I cannot do those dates and times — the diary is rather booked." Cancellation was also an expertise-fit issue — McIntosh is a thermodynamics/combustion engineer, not an astronomer. He referred Daniel to Danny Faulkner, Russ Humphreys, and Wayne Spencer.',
  'Strong returning guest for thermodynamics, combustion, biomimetics, bombardier beetle, information theory. Do NOT reach out for astronomy topics.',
  'Signs "In Christ, Andrew." Warm, service-oriented relationship. "Diary is rather booked" language suggests his schedule fills up — give lead time. Proactively sent related article after filming. NOTE: email listed is stuartburgess@live.co.uk in Drive — this is likely a data error; verify McIntosh''s correct contact.',
  'In-studio visit at Wonders Center (late 2025); two GSR segments filmed; prior remote appearance. Listed in 2026 Article Assignments for hydrogen fuel pre-ignition article.'
) ON CONFLICT DO NOTHING;

-- Jake Hebert: appears in Section 3 AND Section 4 — insert once with sensitive_flag=true
INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, re_approach_notes, communication_notes, notes, source)
VALUES (
  'Jake', 'Hebert', 'Dr.', 'Research Scientist', 'Institute for Creation Research',
  'Geophysics, climate, Ice Age (post-Flood model), ice core research, dinosaur growth rates, T. rex maturation timeline, flood geology, radiometric dating',
  ARRAY['geophysics','Ice Age','radiometric dating','dinosaur growth','flood geology'],
  'jhebert@ICR.org',
  true, false, false, true,
  'Multiple selective declines: (1) July 2025 — article too dated, no strong creation connection, "plate really full right now." (2) May 2026 — declined Antarctic ice core topic, redirected to Mike Oard: "He''s the guy who came up with the Flood Ice Age model in the first place." (3) Climate change topics: ICR president has directed staff not to address climate change — Hebert declined climate-related invitation citing this policy.',
  'Stay in his lane: Ice Age, radiometric dating, dinosaur growth rates, flood geology, cosmic ray data. For Antarctic ice core / Ice Age topics, contact Mike Oard first (Hebert''s own recommendation). Do not send climate change topics. Don''t rapid-fire outreach.',
  'Proactive and enthusiastic when a topic is right for him — he sent the T-rex growth rate story to Daniel himself. Provides detailed talking points. Reliable through ICR system.',
  'Ph.D. in Physics. Episodes: S03 Ep007 Interview 1 (T. rex growth study); YouTube episode (youtu.be/AXpfKjHJA68); multiple S02 appearances; S03 Ep07 (Feb, 10:10 AM).',
  'ICR'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 4: CONFIRMED APPEARED
-- (Paul Nelson and Jake Hebert inserted above with sensitive_flag=true)
-- ============================================================

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, source)
VALUES (
  'Michael', 'Houts', 'Dr.', 'Nuclear Engineer / NASA Researcher', 'NASA Marshall Space Flight Center',
  'Nuclear engineering, advanced nuclear propulsion systems, nuclear thermal propulsion, space program, quantum physics, intelligent design arguments from physics',
  ARRAY['nuclear engineering','space','propulsion','physics','NASA'],
  '(256)541-3699',
  true, false, false, false,
  'Signs emails "In Christ, Mike." Informal first name "Mike" appropriate. Close, warm relationship — proactively emails asking for interview questions before segments. Enthusiastic and reliable. Works at both NASA and a high school — factor both schedules when booking.',
  'Ph.D. in Nuclear Engineering, MIT. 11 years at Los Alamos National Laboratory. ~24 years at NASA Marshall Space Flight Center (retiring). NASA Distinguished Service Medal. NASA Exceptional Engineering Achievement Medal. Episodes: Ep20, S03 Ep007, multiple S02 episodes; S03 Ep09, S03 Ep20 (April 30, Madison AL); aired September 16, 2025.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, source)
VALUES (
  'Andrew', 'Fabich', 'Dr.', 'Professor of Microbiology', 'Truett McConnell University',
  'Microbiology, bacteriology, E. coli genetics, TMAO reduction research, genetic code design, selenocysteine, geosmin/petrichor, microbial biogeography, chimp-human DNA, creation biology',
  ARRAY['microbiology','genetics','bacteriology','creation biology','DNA'],
  'afabich@truett.edu',
  true, false, false, false,
  'Signs emails "In Christ, Andrew." Engaged and intellectually enthusiastic — actively sends his own article suggestions. Use casual collegial tone ("Andrew" not "Dr. Fabich"). Has a boss who may need to approve scheduling windows. Topic should be drawn from his own article suggestions where possible.',
  'Ph.D. in Microbiology. Episodes: Multiple S02 and S03; S03 Ep20 (April 30, Gainesville GA); S03 Ep23 (May 29); April filming block.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, source)
VALUES (
  'Joe', 'Deweese', 'Dr.', 'Professor of Biochemistry and Director of Undergraduate Research', 'Freed-Hardeman University',
  'Biochemistry, enzymology, extremophiles, PCR/Taq polymerase, DNA sequencing, nuclear metabolic organization, 4D genome complexity',
  ARRAY['biochemistry','enzymology','DNA','molecular biology','extremophiles'],
  true, false, false, false,
  'Dr. Joe Deweese, a biochemist, professor, and returning guest here on the Report',
  'Academic communicator — topics must be made TV-accessible. Use "casual for colleagues" tone. Daniel sends routine heads-up emails about airing.',
  'Episodes: S03 Ep006 Interview 1; YouTube episode aired alongside Jason Lisle; multiple prior appearances.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes, source)
VALUES (
  'Tim', 'Clarey', 'Dr.', 'Director of Research', 'Institute for Creation Research',
  'Geology, sedimentology, flood geology, megasequences, global catastrophism, Green River water gap, hydrogeology, dinosaur geology, tectonic shifts',
  ARRAY['geology','flood geology','catastrophism','sedimentology','tectonics'],
  'tclarey@icr.org',
  true, false, false, false,
  'a geologist and researcher with the Institute for Creation Research',
  'April scheduling confusion — replied "I can do this the last week of April, after Memorial Day" which was internally contradictory. Paywall issue with one article (NHM Australopithecus piece) — Daniel sent alternative non-paywalled version.',
  'Enthusiastic — "Yes, I would be very interested." ICR staff; some communication goes through institutional contacts (Mary Clair Kelly: mkelly@icr.org; media@icr.org).',
  'Ph.D. in Geology. Episodes: Multiple S02; S03 Ep01 (Jan 27); S03 Ep22 (May 29); Green River Mystery episode.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes, source)
VALUES (
  'Jason', 'Lisle', 'Dr.', 'Director of Research', 'Biblical Science Institute',
  'Astrophysics, cosmology, starlight and time problem, JWST galaxy discoveries, astronomy, physics, logic and apologetics',
  ARRAY['astrophysics','cosmology','JWST','astronomy','starlight'],
  'JPLISLE@GMAIL.COM',
  true, false, false, false,
  'astrophysicist Dr. Jason Lisle explores the breathtaking order and structure of the universe',
  'Scheduling goes through assistant Denise Toth (dtoth@... — exact email not recovered). Third attempt to book via Denise as of July 2025.',
  'Book through Denise Toth, not Lisle directly. Daniel prepares bullet points for the booking call. Reliable relationship once scheduled. Also listed as ALT 1 for January in 2026 schedule.',
  'Ph.D. in Astrophysics, University of Colorado. Formerly AiG. Episodes: S03 Ep006; January 27, 2026 Big Bang cosmology interview; YouTube episode posted.',
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, source)
VALUES (
  'Jeff', 'Tomkins', 'Dr.', 'Research Scientist', 'Institute for Creation Research',
  'Human genetics, genomics, chimp-human DNA comparisons, protein folding, new genes from non-coding DNA, language genetics, Neanderthal genetics, Miller-Urey experiment critique',
  ARRAY['genetics','genomics','DNA','Neanderthal','human origins'],
  'jtomkins@icr.org',
  true, false, false, false,
  'a geneticist who''s spent years comparing biblical history with the latest genetic research',
  'ICR staff. Sends formal materials packages (talking points docs, GSR Information doc, images). Reliable, organized contributor. Check prior topic coverage before booking.',
  'M.S. in Plant Science, University of Idaho; Ph.D. in Genetics, Clemson University. Episodes: S02 Ep035 Interview 2 (language genetics); Lucy and Neanderthals Revisited; S03 Ep02 (Jan 27); multiple prior.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, source)
VALUES (
  'Frank', 'Sherwin', 'Dr.', 'Science Writer and Researcher', 'Institute for Creation Research',
  'Zoology, parasitology, entomology, biology, creation biology, fossil evidence, exoplanet science rebuttal',
  ARRAY['zoology','parasitology','entomology','biology','fossils'],
  true, false, false, false,
  'Dr. Frank Sherwin takes the discovery apart and tells us what the coverage is leaving out',
  'ICR staff — contact through ICR channels. Follow-up emails sent with estimated air dates and social-sharing call-to-action. Dallas TX location noted for April shoot (2026).',
  'M.A. in Zoology. Episodes: S02 episodes (multiple); Ep016 (alongside Stephen Meyer); S03 Ep16 (April 29, Dallas TX).',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes, source)
VALUES (
  'Stephen', 'Meyer', 'Dr.', 'Senior Fellow and Director, Center for Science and Culture', 'Discovery Institute',
  'Philosophy of science, intelligent design, origin of life, origin of information, DNA information, cosmology and fine-tuning',
  ARRAY['intelligent design','philosophy of science','origin of life','information theory','DNA'],
  'stevemeyer@discovery.org',
  NULL, false, false, false,
  'Dr. Stephen Meyer joins us in-studio to explain why the information written into our DNA is the question materialistic science still can''t answer',
  'Initial Sunday interview date declined (prior commitment). Rescheduled to Wednesday April 1 or Thursday April 2 — very short notice. Multiple prior scheduling attempts failed before the April 2026 Nashville visit. Coordination chain: Tom Duke (ageofdesign@icloud.com) → Tom Winkler (twinkler@discovery.org) → Rob Crowther (rob@discovery.org) → Stephen Meyer.',
  'After in-studio visit, Meyer personally requested exchanging contact info with David Rives. Daniel described the session as "we loved having Stephen Meyer in studio." Meyer asked about specific YouTube channels to invite as collaborators. Use the Tom Duke / Discovery Institute chain for scheduling. Allow significant lead time.',
  'Ph.D. in Philosophy of Science, Cambridge University. Author of "Signature in the Cell," "Darwin''s Doubt," "Return of the God Hypothesis," film "The Story of Everything." Episodes: Ep016; S03 Ep16, S03 Ep18 (April 1-2, 2026, Nashville in-studio).',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

-- Paul Nelson: appears in Section 3 AND Section 4 — insert once with sensitive_flag=true
INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, re_approach_notes, communication_notes, notes, source)
VALUES (
  'Paul', 'Nelson', 'Dr.', 'Senior Fellow, Center for Science and Culture', 'Discovery Institute',
  'Philosophy of biology, evolutionary theory critique, Tree of Life vs. Web of Life metaphor, intelligent design, paleontology/fossil record critique',
  ARRAY['philosophy of biology','intelligent design','fossil record','evolution critique'],
  'paul.alfredp@gmail.com',
  NULL, false, false, true,
  'Two documented topic-based declines: (1) July 2025 — declined cosmology topic: "This topic involves cosmology, which is outside my knowledge base." (2) March 2026 — agreed to interview, then withdrew late-notice when he read the underlying paper (hybridization/network inference research by Tiley lab at NCSU): "It would be wildly irresponsible for me to comment publicly." The second withdrawal cost production scheduling.',
  'Always confirm topic match before booking. His domain: philosophy of biology, Tree of Life critique, fossil record, evolutionary theory. Never pitch cosmology, astronomy, or highly technical lab-methodology topics without pre-vetting with him first.',
  'Principled and rigorous about expertise boundaries. Both declines were substantive intellectual integrity, not evasiveness. Also reachable through Discovery Institute (Tom Winkler, Rob Crowther).',
  'Ph.D. in Philosophy of Biology, University of Chicago. Episodes: S03 Ep011 Interview 2; past Season 2; S03 March 2026 (two interviews on March 6).',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes)
VALUES (
  'Carl', 'Werner', 'Dr.', 'Author and Researcher', 'AVC Publishing',
  'Evolution evidence, fossil record, living fossils, Lucy fossil research, museum exhibit accuracy, whale evolution, dinosaur-to-bird evolution',
  ARRAY['fossils','evolution critique','paleontology','museum science','living fossils'],
  'avcpublishing@yahoo.com',
  true, false, false, false,
  'Dr. Carl Werner pulls back the curtain on how fossils are used to push evolution, and why the truth is often hidden in plain sight',
  'Session 145 — Daniel explicitly noted segments were feeling "stale and repetitive." Werner''s standard format was deemed too formulaic. A correspondent-style recurring format (pre-recorded investigative monologue) was brainstormed as an alternative.',
  'He writes his own scripts and sends them to Daniel. Very enthusiastic self-contributor. Friendly, familiar tone appropriate. Check whether format refresh has been implemented. Check prior coverage before assigning new topic.',
  'M.D. Episodes: Multiple S02 (museum bias/Smithsonian, whale evolution, Adam & Eve); S03 Ep04 (Jan, pre-recorded roll-in); S03 Ep15 (March); S03 Ep24 (May). Pre-recorded roll-in format; reduced to 1 per month.'
) ON CONFLICT DO NOTHING;
