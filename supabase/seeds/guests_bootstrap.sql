-- One-time bootstrap: insert GSR guest profiles from GUEST_PROFILES.md (168 named in file; 209 total rows including stub entries from contact list)
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

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, source)
VALUES (
  'Jeff', 'Williams', 'Col.', 'NASA Astronaut (Ret.) / Colonel, U.S. Army (Ret.)', 'ICR',
  'Space, ISS operations, astronaut experience, spaceflight, Artemis program, science and faith',
  ARRAY['space','NASA','ISS','astronautics','spaceflight'],
  true, false, false, false,
  'astronaut Colonel Jeff Williams joins us to talk about the uncertain future of the International Space Station',
  'Contact through ICR: icr.org. Established relationship.',
  'Record-holder for most cumulative days in space by an American (at time of sessions). Episodes: S03 episode on ISS future; S02 Ep028_B (Stranded Astronauts return home); S03 Ep10 (Feb, 1:40 PM); Artemis 2 segment.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, source)
VALUES (
  'Brian', 'Thomas', 'Dr.', 'Research Scientist', 'Institute for Creation Research',
  'Paleontology, soft tissue fossils, dinosaur collagen preservation, Archaeopteryx specimen analysis, radiometric dating, paleobiochemistry, rapid speciation',
  ARRAY['paleontology','soft tissue','dinosaur','collagen','radiometric dating'],
  'bthomas@icr.org',
  true, false, false, false,
  'Two documented issues: (1) After filming a dinosaur collagen segment, the scientific community challenged the paper. Conclusion ("endogenous dinosaur collagen") was upheld despite pushback, but air date was delayed. (2) Session 134 — Brian missed a scheduled interview entirely because his studio was occupied: "Am filming this afternoon. Busy all day and it looks like our studio is set up for another task." ICR studio availability is a recurring scheduling variable.',
  'ICR staff. Apologetic and gracious when issues arise. Check internal ICR studio availability before committing. Returns emails same-day.',
  'Ph.D. in Paleontology. Co-author of dinosaur collagen study in Analytical Chemistry (ACS, doi: 10.1021/acs.analchem.4c03115). Episodes: S02 Ep024 Interview 2; S03 Ep14 (March); S03 Ep17 (April 30, Dallas TX); Archaeopteryx specimen session.',
  'ICR'
) ON CONFLICT DO NOTHING;

-- Jake Hebert: appears in Section 3 AND Section 4 — insert once with sensitive_flag=true
INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, re_approach_notes, communication_notes, notes, source)
VALUES (
  'Jake', 'Hebert', 'Dr.', 'Research Scientist / Geophysicist', 'Institute for Creation Research',
  'Geophysics, climate, Ice Age post-Flood model, ice core research, dinosaur growth rates, T. rex maturation, flood geology, radiometric dating',
  ARRAY['geophysics','Ice Age','flood geology','radiometric dating','paleontology'],
  'jhebert@ICR.org',
  true, false, false, true,
  'Multiple selective declines: (1) July 2025 — article too dated, no strong creation connection, "plate really full right now." (2) May 2026 — declined Antarctic ice core topic, redirected to Mike Oard: "He''s the guy who came up with the Flood Ice Age model in the first place." (3) Climate change topics: ICR president has directed staff not to address climate change — Hebert declined climate-related invitation citing this policy.',
  'Stay in his lane: Ice Age, radiometric dating, dinosaur growth rates, flood geology, cosmic ray data. For Antarctic ice core / Ice Age topics, contact Mike Oard first (Hebert''s own recommendation). Do not send climate change topics.',
  'Proactive and enthusiastic when a topic is right — he sent the T-rex growth rate story to Daniel himself. Provides detailed talking points. Reliable through ICR system.',
  'Ph.D. in Physics. Episodes: S03 Ep007 Interview 1 (T. rex growth study); YouTube episode (youtu.be/AXpfKjHJA68); multiple S02; scheduled S03 Ep07 (Feb, 10:10 AM).',
  'ICR'
) ON CONFLICT DO NOTHING;

-- credentials_display from section 4 Jake Hebert entry
UPDATE public.guests SET credentials_display = 'Jake Hebert, a geophysicist and creation researcher who has published extensively on dinosaur growth rates and longevity'
WHERE first_name = 'Jake' AND last_name = 'Hebert';

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes)
VALUES (
  'Jerry', 'Bergman', 'Dr.', 'Professor, Author and Researcher',
  'Human origins critique, Lucy fossil analysis, evolutionary anthropology critique, Darwin''s late-life doubts, natural selection critiques, biology, psychology',
  ARRAY['anthropology','evolution critique','human origins','Darwin','biology'],
  true, false, false, false,
  'Doctor Jerry Bergman joins us to discuss why the fossil, known as Lucy, may not be the transitional figure that it''s often claimed to be',
  'Prolific — many topics have been covered; must check prior coverage before pitching. Liverpool collagen topic is "old news" and Behemoth topic already covered.',
  'No contact info listed in Drive documents. Contact through session email threads or institutional affiliation. Recurring guest with established relationship.',
  'Ph.D. (multiple — biology, chemistry, psychology, anthropology implied). Episodes: Lucy and Neanderthals Revisited; S03 Ep02 (Jan 27); S03 filming June 15 afternoon; February 2026 appearance. Darwin''s late-life doubts / Cambridge Correspondence Project was most recent topic.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Gordon', 'Wilson', 'Dr.', 'Senior Fellow of Natural History', 'New Saint Andrews College',
  'Natural history, ecology, environmental science, taxonomy, creation biology, Chernobyl mutant dogs, animal behavior, predation and venom',
  ARRAY['natural history','ecology','biology','creation','zoology'],
  'gwilson@nsa.edu', '(208) 882-1566',
  true, false, false, false,
  'Requested spacing of appearances: "you can space my appearances out over months since I am working on many things." He asked Canon Press to send a book (David Rives signed copy) to a museum. NOTE: "Glenn Wilson" (soil physicist) and "Gordon Wilson" are two different people — do not conflate.',
  'Highly engaged — proactive about future content. Asks thoughtful questions about viewership and preparation. Warm relationship. Respect spacing requests — don''t over-schedule.',
  'Ph.D. in Environmental Studies; Moscow, ID. Episodes: S02 Ep048 Interview 1 (Chernobyl mutant dogs); S03 Ep12 (March); S03 Ep26 (June 29, 9:30 AM); March 6 (12:30 PM). Has proposed Saturn''s moon Iapetus and Creation Safaris as future topics.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Glenn', 'Wilson', 'Dr.', 'Soil Physicist and Researcher',
  'Soil physics, hydrology, earth sciences, land degradation',
  ARRAY['soil physics','hydrology','earth science','geology'],
  'g_r_wilson11@hotmail.com',
  true, false, false, false,
  'NOTE: Glenn Wilson (soil physicist) and Gordon Wilson (natural history/New Saint Andrews) are two different people. Minor eye doctor appointments affected earlier date (February 14); chose March 6 instead.',
  'Warm, enthusiastic — called a topic "right down my wheelhouse." Has mentioned wanting to connect with David for in-studio content.',
  'Ph.D. Affiliated with creationresearchusa.org. Episodes: March 6, 2026 interview; 2026 Article Assignments; multiple 2025 appearances.',
  'creationresearchusa.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Rob', 'Stadler', 'Dr.', 'Biomedical Engineer / Author',
  'Biomedical science, origin of life, cellular chemistry, ATP synthase, intelligent design, engineering principles in biology',
  ARRAY['biomedical','origin of life','intelligent design','biochemistry','engineering'],
  'stadlerrw@gmail.com',
  NULL, false, false, false,
  'Dr. Rob Stadler returns to tackle an even deeper question: Could the chemistry of life really come together by chance',
  'First interview was "very, very abrupt" — short answers. Daniel had to develop more questions to prevent short answers. Document format miscommunication: Stadler compiled materials as one combined document when Daniel needed separate forms. Traveled to Nashville from out of state — reimbursement check issued.',
  'Warm, thoughtful, professional. Coordinated through Tom Duke (ageofdesign@icloud.com) as intermediary — also works directly. Pre-interview: explicitly discuss segment structure and expected answer length to avoid short answers. Be explicit about document format requirements upfront.',
  'Episodes: S02 Ep015; S03 Ep03 (Jan 22, In Studio, Parts 1 & 2); Unwrapped lecture (January 2026); multiple other appearances.',
  'scientificevolution.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, website)
VALUES (
  'David', 'Coppedge', 'Former NASA Systems Administrator / Creation Science Researcher',
  'Space science, Cassini/Saturn/Enceladus mission, planetary exploration, Creation Safaris, longevity research',
  ARRAY['space','Cassini','Saturn','planetary science','astronomy'],
  '661-755-4193',
  true, false, false, false,
  'ICR president has directed that ICR-affiliated guests not address climate change topics. Enceladus materials were very detailed — he sent a docx, zip with photos, video references. He is detail-oriented and hands-on with prep.',
  'Proactive and detail-oriented — sends comprehensive materials in advance. Can be verbose in his prep docs. Warm, collaborative relationship. Avoid climate change topics per ICR policy context.',
  'Former systems administrator, NASA Cassini mission (JPL). Episodes: S02 Ep (Hard Questions series, "Where Is Heaven?"); S03 Ep03 (Jan 27); S03 Ep25 (June 15); Creation Safaris segment; Enceladus presentation.',
  'crev.info'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Don', 'DeYoung', 'Dr.', 'Professor Emeritus of Physics', 'Grace College',
  'Cosmology, astronomy, physics, limits of science, young-universe models',
  ARRAY['cosmology','astronomy','physics','young-earth'],
  'deyoundb@grace.edu',
  true, false, false, false,
  'Daniel sent Zoom link follow-up for confirmation. Standard professional relationship.',
  'Episodes: S03 Ep01 (Jan 27–28, two slots); confirmed for 11:30 AM CT January 27, 2026 interview (cosmological limits); appears alongside Tim Clarey.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'David A.', 'DeWitt', 'Dr.', 'Dean, College of Arts and Sciences', 'Columbia International University',
  'Neuroscience, brain as integrated network, biomedical sciences, creation biology, genetics, origins',
  ARRAY['neuroscience','brain','biomedical','genetics','creation biology'],
  'david.dewitt@ciu.edu', '(803) 807-5493',
  true, false, false, false,
  'Could not make February 13 date; rescheduled to March 6.',
  'Standard professional email tone. Full confidentiality notice in email signature. Reliable — responded promptly.',
  'Ph.D. in Neuroscience. Formerly Director, Center for Creation Studies, Liberty University. Episodes: Season 2 teaser (YouTube: youtu.be/Cnit_4W657c); S03 Ep08 (recorded 3/6); March 6 (12:30 PM CT).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Ian', 'Macreadie', 'Dr.', 'Researcher', 'RMIT University',
  'Molecular biology, microbiology',
  ARRAY['molecular biology','microbiology','biology'],
  'ian.macreadie@rmit.edu.au',
  false, false, false,
  'Note: listed as "Dr. Ian McCready" in some session records and "Dr. Ian Macreadie" in the Drive contact list — same person. Australia-based.',
  'Ph.D. in molecular biology and microbiology. Episodes: Season 2 teaser (YouTube: youtu.be/Cnit_4W657c alongside Dr. DeWitt); S03 Ep08 (record 3/6); March 6 (3:30 PM).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes)
VALUES (
  'Billy', 'Hallowell', 'CBN Investigative Journalist / Podcast Host', 'CBN',
  'UFO disclosure, supernatural investigation, faith-culture journalism, Christian journalism, spiritual deception',
  ARRAY['UFOs','supernatural','journalism','faith','media'],
  true, false, false, false,
  'Billy Hallowell, welcome to the Report',
  'In-studio guest for some segments. UFO framing must avoid implying the government is announcing demons — reframe as spiritual counter-narrative to government disclosure. CTN: casual conversational questions, add background intro. GSR: use Barentine-format script.',
  'Host of "Into the Supernatural" podcast; produced CBN documentary "Investigating the Supernatural: Angels and Demons." Episodes: S02 Ep (UFO disclosure/spiritual deception, in-studio); S03 Ep21 (May 28, pre-recorded); multiple CTN crossover segments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Scott', 'Stripling', 'Dr.', 'Director of Excavations', 'Associates for Biblical Research',
  'Biblical archaeology, excavations, Shiloh excavations',
  ARRAY['biblical archaeology','excavations','history','scripture'],
  true, false, false, false,
  'Very brief email responses. Warm, blessed tone. Flexible on timing. Prefers not to receive questions in advance: "Feel free to ask anything you want. I prefer not to know the questions in advance." Signs as "SS." Location: Katy, TX.',
  'Episodes: Session 17 episode (first appearance); April 29, 2026 (S03 Ep17, 10:45 AM, Katy TX).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'John', 'Barentine', 'Dr.', 'Executive Director', 'Dark Sky Consulting',
  'Astronomy, light pollution, dark skies, satellite light pollution',
  ARRAY['astronomy','light pollution','dark skies','satellite'],
  NULL, false, false, false,
  'His interview script format became the internal template reference ("Barentine-format") for how GSR structures scripts — he is not just a guest but an inadvertent production reference point.',
  'Follow-up sent with estimated air date. Good communicator. Location: Tucson, AZ. Formerly International Dark-Sky Association.',
  'Listed as Dr. John C. Barentine in article assignments. Episodes: Session 17 episode (first appearance); S03 Ep18 (April 30, 10:30 AM, Tucson AZ).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Tom', 'Rogers', 'President / Co-Author', 'The Atomic Biology Institute',
  'Atomic biology, molecular design, creation biology, bone marrow/red blood cell production, intelligent design at cellular level',
  ARRAY['atomic biology','molecular design','cellular biology','intelligent design'],
  'tom.rogers@atomicbiology.com',
  true, false, false, false,
  'Tom followed up after April 30 recording asking if the audio was usable — suggesting audio quality concerns arose post-recording. Scheduled air date of June 9 confirms it was usable enough to proceed.',
  'Professional and polite. Asked for interview questions in advance. Blessings-based sign-off. B.C. Canada — factor in timezone. Scheduling managed through coordinator named Derek.',
  'Co-Author of "Darwin''s Replacement." Location: Gibsons, British Columbia, Canada. Episodes: S03 Ep019 Interview 2 (confirmed); April 30, 2026 (11:00 AM); June 9, 2026 scheduled air date. Coordinate through Derek.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Eric', 'Hedin', 'Dr.', 'Professor of Physics',
  'Physics, cosmology, scientific evidence for design, limits of materialism, science and belief',
  ARRAY['physics','cosmology','intelligent design','materialism'],
  true, false, false, false,
  'Thorough and prepared — submitted possible discussion points in advance along with bio and book cover images. Prayerful tone. Did not have an external camera or microphone before booking — needed to purchase. Last name pronunciation: "Hedeen." Based in Muncie, Indiana (Eastern time zone). Verify he now has proper audio/video equipment.',
  'Author of "Canceled Science: What Some Atheists Don''t Want You to See." Episodes: S03 Ep05 (Jan, 2:30 PM confirmed); interview confirmed for January 16, 2026; air date next night at 8 PM CST.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes)
VALUES (
  'Michael', 'Maughon', 'Wildlife Educator', 'Genesis Animal Sanctuary',
  'Live animals (snakes, parrots/birds), wildlife, Created Kinds demonstrations',
  ARRAY['wildlife','animals','zoology','education','Created Kinds'],
  'michaelmaughon@gmail.com',
  true, false, false, false,
  'wildlife educator Michael Maughon',
  'Segment format must differ from standard interview — should feature him holding a live animal, with animals as the visual hook. Format is hands-on demonstration, not sit-down interview. Note: name spelled both "Mahone" and "Maughon" — use "Maughon" as canonical spelling per Drive document.',
  'Strong on-camera presence and professional setup. Must be booked as in-studio live animal demonstration segment. Casual, warm relationship.',
  'Episodes: Multiple in-studio segments; snake segment; parrot/Created Kinds segment; S02 Ep030, 031, 032, 034; multiple 2026 appearances.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Ming', 'Wang', 'Dr.', 'Ophthalmologist and Laser Eye Surgeon', 'Wang Vision Institute',
  'Ophthalmology, laser eye surgery, intelligent design (the eye as evidence), faith and science, personal testimony',
  ARRAY['ophthalmology','medicine','intelligent design','eye','faith'],
  NULL, false, false, false,
  'June 1 travel window — scheduling had to work around it. David Rives personally asked Daniel to reach out. Confirmed arrival 10am, filming start 10:30am.',
  'Sent extensive materials/links in advance. Do not send CTN questionnaire — enough background gathered from his submitted materials. GSR segment: eye design evidence. CTN segment: faith, conviction, Angel Studios film, amniotic membrane patent donation, blind orphan work. Ask rather than declare for logistics.',
  'M.D., Ph.D. Founder of Wang Vision Institute, Nashville TN. Involved in Angel Studios film; amniotic membrane patent donated to charity; works with blind orphans internationally. Episodes: S03 Ep24 (June 15); studio taping at Wonders Center June 15.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'David', 'Legates', 'Dr.', 'Professor of Climatology', 'Cornwall Alliance',
  'Climatology, precipitation, climate change, spatial statistics, planetary boundaries critique',
  ARRAY['climatology','climate','statistics','environment'],
  NULL, false, false, false,
  'Legates corrected Daniel about his expertise: "my background is in climatology, not aquatic ecosystems." Questions 3–6 were within his area; questions 1 and 2 he could only comment on broadly. Do not introduce him as an aquatic or ecosystem scientist.',
  'Precise about his credentials — correct any title or expertise misstatement promptly. Submitted his own bio. Good communicator. Cornwall Alliance affiliation.',
  'Ph.D. in Climatology, University of Delaware. Formerly Delaware State Climatologist; formerly Deputy Assistant Secretary of Commerce for Observation and Prediction. Episodes: S03 Ep21 (May 28, 9:45 AM); confirmed May 29, 2026; planetary boundaries segment. Email: david@cornwallalliance.org.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, website)
VALUES (
  'James', 'Tour', 'Dr.', 'Professor of Chemistry', 'Rice University',
  'Synthetic chemistry, nanotechnology, origin of life critique, abiogenesis critique, intelligent design',
  ARRAY['chemistry','nanotechnology','origin of life','abiogenesis','intelligent design'],
  'tour@rice.edu',
  NULL, false, false, false,
  'Referenced as part of "Age of Design" collaboration launch',
  'Businesslike, specific about logistics. Self-sufficient studio setup in his Rice office (6K camera, good audio and lighting). Works through Brandon (camera operator) and Tom Duke (Age of Design). Requests raw footage copy for social media (@drjamestour). Also coordinated through Tom Duke (ageofdesign@icloud.com) and Rob Crowther at Discovery Institute.',
  'Ph.D. Prominent ID/creationist voice in origin-of-life debate. Social media: @drjamestour. Episodes: Age of Design 4-part series (parts 1–2 aired, parts 3–4 upcoming); S02 Ep047 area; October 2, 2025 morning filming.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Artem R.', 'Oganov', 'Dr.', 'Distinguished Professor', 'Skoltech',
  'Crystal structure prediction, nuclear fusion, materials science',
  ARRAY['crystal structure','materials science','physics','nuclear'],
  false, false, false, false,
  'Secular Russian physicist — not a creationist. Connected through "Age of Design" network or science crossover angle. Expressed genuine interest in future contact: "It was my pleasure. I hope the viewers of GSR will find it interesting. Let''s stay in touch!"',
  'Warm, intellectually engaged. Approaching him on crossover science topics (crystal science, materials, physics) rather than worldview content is the correct lane.',
  'Member of Academia Europaea; Fellow of American Physical Society and Royal Society of Chemistry. PhD from University College London 2002; postdoc ETH Zurich. Born 1975 Moscow. Episodes: S02 Ep047, Interviews 2 & 3 (September 2025 recording); joined from Moscow at 9:50 AM Central.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, website)
VALUES (
  'Joseph', 'Hubbard', 'Researcher, Speaker and Director', 'Creation Research UK',
  'Paleobiology, geology, zoology, dinosaurs, paleontology, biblical archaeology, flood deposits, fine-tuning arguments, Tell Fara/Shuruppak flood layer, ancient civilizations',
  ARRAY['paleobiology','geology','biblical archaeology','flood deposits','dinosaurs'],
  true, false, false, false,
  'Joseph Hubbard, a researcher, speaker, and director of Creation Research UK. Joseph has spent years connecting science with Scripture',
  'All scheduling through Nadina (nadina@creationresearchuk.com). Joseph expressed eagerness to return: "Joe is eager to be back on with David." UK-based — timezone coordination required.',
  'Location: Oswestry, UK. Episodes: S02 Ep027 Interview 1 (fine-tuning/universe); Episode 019 (biblical archaeology/flood deposits); S03 Ep19 (April 29, 1:00 PM confirmed).',
  'creationresearchuk.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Bodie', 'Hodge', 'Author, Speaker and Biblical Apologist', 'Answers in Genesis',
  'Biblical apologetics, biblical authority, creationism, Tower of Babel, cultural/worldview debates, mechanical engineering',
  ARRAY['apologetics','biblical authority','creationism','Babel','engineering'],
  true, false, false, false,
  'Bodie Hodge, author, speaker, and biblical apologist with Answers in Genesis',
  'When booked via Session 83, he was already on-site filming other shows — GSR interview was piggyback on existing visit. Was briefly out of state after confirmation (talking points delayed); submitted them, confirming segment proceeded.',
  'Casual, collegial tone. Signs off "God bless, Bodie." Direct contact via iPhone. Most efficient to book him when he''s already coming to the Wonders Center for other reasons.',
  'M.S. in Mechanical Engineering (Purdue). Son-in-law of Ken Ham. President and CEO of Biblical Authority Ministries. Episodes: In-studio on Satanic Temple school initiative; Unwrapped event speaker (April 17, Tower of Babel); S02 Ep033_A; Ministry Report events.',
  'biblicalauthorityministries.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Tommy', 'Lohman', 'Dr.', 'Researcher', 'Glendive Dinosaur & Fossil Museum',
  'Paleontology, dinosaurs, soft tissue fossils, collagen preservation, dragon legends/cultural memory',
  ARRAY['paleontology','dinosaurs','soft tissue','fossils','dragon legends'],
  'tommy@creationtruth.org',
  true, false, false, false,
  'Liverpool collagen is "old news" and Behemoth topic already covered. Must find fresh topics each booking — check prior coverage.',
  'Engaged and proactive — submits talking points himself. Casual tone appropriate. Must find fresh topics each booking.',
  'Episodes: S03 Ep09 (recorded 3/6, aired April 2026); Session 107 — talking points confirmed. Session 74 selected Nagatitan dragon legends/cultural memory as fresh angle.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Michael', 'Lienau', 'Film/TV Director, Producer, DP',
  'Mount St. Helens, volcanic geology, documentary filmmaking, visual storytelling',
  ARRAY['Mount St. Helens','geology','documentary','filmmaking','volcanology'],
  NULL, false, false, false,
  'Enthusiastic and collaborative — proactively sent physical products (DVD, book, flipbook) to David. Experienced producer with high production standards. He asked about virtual studio setup options to display Mount St. Helens content during interview. He described the interview as "an honor to be on your show." Tone: ask rather than declare for logistics.',
  '40+ years producing/directing. Creator of Mount St. Helens documentary with commemorative DVD, Children''s Activity Book, and Active Volcanoes flipbook. Episodes: Confirmed June 25, 3:30pm CST; June 25, 2026.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Ed', 'Holroyd', 'Dr.', 'Retired Astrophysicist / Atmospheric Scientist',
  'Astrophysics, atmospheric science, solar flares, radio blackouts',
  ARRAY['astrophysics','atmospheric science','solar','radio'],
  NULL, false, false, false,
  'Explicitly noted he was rusty: "I certainly know the basics...but I have not practiced discussing these issues for many years." Requested brushing-up materials before interview.',
  'Candid about gaps; asked for more information to prepare. Signs "Ed Holroyd." Provide extra background/talking points before interview.',
  'Degrees in astrophysics and atmospheric science; retired/long removed from active practice. Episodes: Confirmed for interview, August 2025.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Seth', 'Dillon', 'CEO', 'The Babylon Bee',
  'Satire, media, Christian worldview, cultural commentary, scientism critique',
  ARRAY['satire','media','Christian worldview','culture'],
  NULL, false, false, false,
  'All scheduling through Morgan Lager (Executive Assistant, phone: 561-315-9891). Not a creation scientist — cultural/faith commentator role. Thursday, 1pm ET available window confirmed in Session 106. Mostly available mornings, latest 1pm ET.',
  'Episodes: Segment on satire and scientism; in-studio (CTN/cultural commentary context primarily).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Steve', 'Furber', 'Emeritus Professor / Computer Scientist', 'University of Manchester',
  'Neural simulation, computer architecture, artificial intelligence limitations, brain modeling, consciousness limits of AI',
  ARRAY['AI','neural simulation','computer architecture','consciousness','brain'],
  false, false, false, false,
  'Mainstream computer scientist, not a creationist — crossover booking via "AI limits vs. consciousness" angle.',
  'Prepared detailed talking points in academic Q&A format. Signed "Steve Furber." Excellent communicator. SpiNNaker uses 1 million processor cores — strong visual/descriptive hook.',
  'Emeritus Professor. Inventor of the ARM microprocessor. Co-designer of SpiNNaker (Spiking Neural Network Architecture). Episodes: S03 Ep07 (Feb, 10:45 AM); YouTube episode (youtu.be/AXpfKjHJA68 alongside Jake Hebert).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Stuart', 'Burgess', 'Dr.', 'Professor of Engineering Design', 'University of Bristol',
  'Biomechanics, engineering principles in biology, intelligent design in biological systems, human body design',
  ARRAY['biomechanics','engineering','intelligent design','biology','human body'],
  'stuartburgess@live.co.uk',
  true, false, false, false,
  'Was ruled out for April 2026 cycle as "too recent — just appeared." Re-emerged as candidate in Session 144 when he proactively reached out about his new book.',
  'He initiated proactive contact in Session 144 proposing himself for a segment tied to his "Ultimate Engineering" book launch (Feb 2026, Discovery Institute). Strong repeat guest candidate with book hook. UK-based — remote interview format.',
  'Professor of Engineering Design, University of Bristol (UK). 200+ research papers. Recipient of top UK mechanical engineering award (2019). Book: "Ultimate Engineering — an engineer investigates the biomechanics of the human body" (Feb 2026). Episodes: S02 Ep019_b (Feb 2025); S03 Ep14 (2:45 PM March 6).',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes)
VALUES (
  'Brian', 'Young', 'Dr.', 'Speaker and Educator',
  'Generation Z, faith culture, youth ministry, Christian worldview, cultural pressure on faith',
  ARRAY['youth ministry','faith','culture','Christian worldview','Generation Z'],
  true, false, false, false,
  'Brian Young joins us for a timely conversation about Generation Z, cultural pressure, and why more young people may be rethinking what they''ve been told about truth, identity, and faith',
  'Cultural/faith commentator rather than hard-science guest.',
  'Episodes: S02 Ep048 Interview 2; "Science Faith and Culture" episode. Scheduled in 2026 as S03 Ep10 (Feb, 2:15 PM).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Jay', 'Wile', 'Dr.', 'Author / Curriculum Creator',
  'Nuclear chemistry, homeschool science education, creation science',
  ARRAY['nuclear chemistry','education','homeschool','creation science'],
  'jlwile@gmail.com',
  true, false, false, false,
  'Known contact with established email. Homeschool curriculum focus ("Exploring Creation with..." / "Berean Builders Homeschool Science K-12") is a distinguishing angle.',
  'Ph.D. in Nuclear Chemistry. Episodes: S02 Ep022_A (March 2025, chromosome fusion article); listed in 2025 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes, website)
VALUES (
  'Jay', 'Seegert', 'Speaker and Scientist', 'The Starting Point Project',
  'DNA information, creation science, digital biology, evolution/origins critiques, hominid fossils, ancient DNA',
  ARRAY['DNA','information theory','creation','origins','biology'],
  'jay@thestartingpointproject.com',
  true, false, false, false,
  'Jay Seegert, a speaker and scientist, will join us to discuss why this breakthrough points to a Creator',
  'Good communicator.',
  'Episodes: Episode alongside Dr. Carl Werner (Adam and Eve episode, 1/12/25 air date); S02 Ep017_B (Feb 2025); listed in 2026 article assignments (genetics/human origins).',
  'thestartingpointproject.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Michael', 'Oard', 'Retired Atmospheric Scientist / Creation Researcher',
  'Atmospheric science, Ice Age, post-Flood Ice Age model, Antarctic ice cores, flood geology, earth sciences',
  ARRAY['atmospheric science','Ice Age','flood geology','ice cores','earth science'],
  true, false, false, false,
  'Referred by Jake Hebert for Antarctic ice core topics. Hebert''s language: "He''s the guy who came up with the Flood Ice Age model in the first place." Primary contact for Antarctic ice core, Ice Age, flood geology topics.',
  'B.S. and M.S. in Atmospheric Science, University of Washington. Retired from U.S. National Weather Service (30 years). Prolific creation researcher. Originator of the post-Flood Ice Age model. Episodes: Referenced across multiple sessions as returning/confirmed guest; bio shortened for TV intro/lower third formats (Session 108).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Charles G.', 'Jackson', 'Dr.', 'Creationist Speaker and Educator',
  'Creation science, apologetics, AI/ecology/environmental topics, evolutionary metaphysics, astronomy',
  ARRAY['creation science','apologetics','astronomy','ecology','AI'],
  true, false, false, false,
  'Did not respond to Daniel''s initial phone call in Session 155 — Daniel sent email instead.',
  'Texted Daniel topic ideas informally. Casual communication style. Initially required alternative contact research.',
  'Episodes: Episode 13 (Session 25); pre-air notification (Session 0 alongside Paul Nelson); March 6, 2026 (two episodes, S03 Ep11 and S03 Ep13); multiple appearances in 2026 schedule.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Mike', 'Riddle', 'Dr.', 'Creation Trainer',
  'Apologetics, course training',
  ARRAY['apologetics','training','creation'],
  true, false, false, false,
  'Creation Training for Biblical Truth and Leadership. Appeared prior seasons. No contact info in database, no recent session data.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, website)
VALUES (
  'Nate', 'Loper', 'Canyon Ministries Educator', 'Canyon Ministries',
  'Archaeology, canyon geology, outdoor education',
  ARRAY['archaeology','canyon','geology','outdoor education'],
  'nate@canyonministries.org',
  true, false, false, false,
  'Internal contributor/co-host in some segments, not always a traditional outside guest.',
  'Episodes: S02 Ep047 (Interviews 2 & 3 alongside Dr. Artem Oganov); listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, credentials_display, communication_notes, notes)
VALUES (
  'Steve', 'Berger', 'Pastor and Founder', 'Ambassador Services International (ASI)',
  'Faith, politics, Christian values in government, Israel, theology',
  ARRAY['faith','theology','Israel','politics'],
  true, false, false, false,
  'a seasoned pastor and founder of Ambassador Services International (ASI)',
  'CTN context primarily. Contact via Ambassador Services International.',
  'Episodes: CTN podcast crossover segment about faith in government.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Doug', 'Velting', 'Wildlife/Nature Expert and Author',
  'God''s design in animals — porcupine, harpy eagle, Rocky Mountain goat, South Sudan antelope migration, wildlife',
  ARRAY['wildlife','animals','zoology','creation','ecology'],
  'dougandrenee.velting@gmail.com',
  true, false, false, false,
  'Commercially motivated about book promotion — asked how often he could appear in Season 3 "to generate money for both the ministry and me." Creation Superstore (Kristin) was slow to approve book for sale. Daniel had to diplomatically manage frequency expectations. Segments done from remote (family member homes at times) — webcam guidance may be needed.',
  'Casual, warm relationship. Signs "Doug." Webcam/Zoom guidance may be needed for remote segments. Commercial interest in book promotion requires diplomatic management. Also listed as creationengcon@aol.com in Drive.',
  'Author (creation-focused animals book — first book pending publication). Episodes: S02 Ep031_B (porcupine segment); harpy eagle segment; S03 Ep12 (March); March 6 (4:00 PM); multiple 2025 and 2026 appearances.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, website)
VALUES (
  'Dan', 'Biddle', 'Dr.', 'Behavioral Scientist',
  'genesisapologetics.com',
  'Psychology, statistics, anthropology, human evolution',
  ARRAY['psychology','statistics','anthropology','human origins'],
  true, false, false, false,
  'Contact through genesisapologetics.com.',
  'Appeared prior seasons. On contact list.',
  'genesisapologetics.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Micah', 'Bowman', 'Ph.D. Student',
  'Biology, animals, environmental science',
  ARRAY['biology','animals','environment'],
  false, false, false,
  'Field unconfirmed. Appeared prior seasons. On contact list.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Tim', 'Chaffey', 'Content Manager, Attractions Division', 'Answers in Genesis',
  'Theology, apologetics',
  ARRAY['theology','apologetics'],
  'tchaffey@answersingenesis.org',
  true, false, false, false,
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, website)
VALUES (
  'Ray', 'Comfort', 'Dr.', 'Christian Evangelist and Author', 'Living Waters',
  'Evangelism, general evolution critique',
  ARRAY['evangelism','apologetics','evolution critique'],
  true, false, false, false,
  'Contact through livingwaters.com.',
  'Television host. Appeared prior seasons. On contact list.',
  'livingwaters.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, source)
VALUES (
  'Randy', 'Guliuzza', 'Dr.', 'President', 'Institute for Creation Research',
  'Biological adaptation, engineering principles in biology, human body, apologetics',
  ARRAY['biology','engineering','adaptation','human body','apologetics'],
  true, false, false, false,
  'Contact through ICR (icr.org).',
  'Medical doctor and engineer. National speaker. Appeared prior seasons. Also mentioned as NRB 2026 potential guest.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, source, website)
VALUES (
  'Ken', 'Ham', 'Founder and CEO', 'Answers in Genesis',
  'Apologetics, biblical creation',
  ARRAY['apologetics','creation','biblical authority'],
  true, false, false, false,
  'Contact through answersingenesis.org.',
  'Appeared prior seasons. On contact list.',
  'AiG', 'answersingenesis.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Terry', 'Mortenson', 'Dr.', 'Researcher and Speaker', 'Answers in Genesis',
  'History of geology, flood geology, theological history',
  ARRAY['geology','flood geology','history','theology'],
  'tmortenson@answersingenesis.org',
  true, false, false, false,
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, website)
VALUES (
  'Ian', 'Juby', 'Independent Creation Researcher and Filmmaker',
  'Geology, biology, astronomy, paleontology, anthropology, human evolution, fossil tracks',
  ARRAY['geology','paleontology','anthropology','astronomy','fossils'],
  'ianjuby@ianjuby.org', '(613) 281-5585',
  true, false, false, false,
  'Canada-based. Direct contact via email.',
  'Creator of "Genesis and the Jurassic" series. Episodes: Listed in multiple 2025 and 2026 article assignments. Appeared prior seasons.',
  'IanJuby.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'John', 'Whitmore', 'Dr.', 'Geologist', 'Cedarville University',
  'Geology, dinosaurs, paleontology',
  ARRAY['geology','dinosaurs','paleontology'],
  'johnwhitmore@cedarville.edu',
  true, false, false, false,
  'Episodes: S02 Ep021_B ("Geologists Found Ancient Bird Footprints"); listed in 2025 and 2026 article assignments. Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, notes, website)
VALUES (
  'Chris', 'Rupe', 'Dr.', 'Creation Researcher',
  'Biology, geology, evolution critique',
  ARRAY['biology','geology','evolution critique'],
  'chrisr@back2genesis.org',
  true, false, false, false,
  'Episodes: S02 Ep021_A (Feb 2025, "evolution predictable"). Appeared prior seasons.',
  'back2genesis.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Gary', 'Parker', 'Dr.', 'Biologist',
  'Biology, evolution critique',
  ARRAY['biology','evolution critique'],
  'Creation@strato.net',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, source)
VALUES (
  'Andrew', 'Snelling', 'Dr.', 'Geologist', 'Answers in Genesis',
  'Geology, creation geology',
  ARRAY['geology','creation','flood geology'],
  true, false, false, false,
  'Data entry error in Drive — his contact email field shows david.dewitt@ciu.edu (Dr. DeWitt''s email), likely a copy-paste error. Do not use that email for Snelling.',
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Caroline', 'Leaf', 'Dr.', 'Neuroscientist, Audiologist and Pathologist',
  'Neuroscience, audiology, pathology',
  ARRAY['neuroscience','audiology','pathology'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Jack', 'Cuozzo', 'Dr.', 'Dentist and Cranial Growth Researcher',
  'Dentistry, cranial research, Neanderthal skull analysis',
  ARRAY['dentistry','cranial research','Neanderthal','anthropology'],
  'drjackcuozzo@mac.com',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'John', 'Sanford', 'Dr.', 'Geneticist', 'FMS Foundation',
  'Genetics, genetic entropy',
  ARRAY['genetics','genetic entropy','genomics'],
  'jsanford@FMSFound.org',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Ben', 'Carson', 'Dr.', 'Neurosurgeon',
  'Medicine, neurology, human body, neurosurgery, brain',
  ARRAY['neurosurgery','medicine','brain','neurology'],
  NULL, false, false, false,
  'High-profile figure — contact through assistant Garrison Grisedale (garrison.grisedale@americancornerstone.org). Andrew Hughes also listed as assistant.',
  'Appeared prior seasons. On contact list.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Kurt', 'Wise', 'Dr.', 'Geologist and Paleontologist', 'Truett McConnell University',
  'Geology, paleontology, creation science',
  ARRAY['geology','paleontology','creation science'],
  'kwise@truett.edu',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Bryan', 'Osborne', 'Former Public School Teacher / Speaker', 'Answers in Genesis',
  'Apologetics',
  ARRAY['apologetics','education'],
  true, false, false, false,
  'Contact through answersingenesis.org.',
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Mark', 'Horstemeyer', 'Dr.', 'Dean of Engineering', 'Liberty University',
  'Mechanical engineering, materials science, football helmet engineering, sports concussion biomechanics, Creationeering',
  ARRAY['mechanical engineering','materials science','biomechanics','engineering','Creationeering'],
  'mhorstemeyer@liberty.edu',
  true, false, false, false,
  'Drive email has a typo ("libery.edu"); correct form is likely mhorstemeyer@liberty.edu.',
  '"Creationeering" is his coined term — use it naturally in pitches. Also invited for new segment in Sessions 95–96; no confirmed response.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Michele', 'Bachmann', 'Hon.', 'Former U.S. Congresswoman', 'Regent University',
  'Politics, dangers of abandoning Christian principles in society',
  ARRAY['politics','Christian values','government','apologetics'],
  'mbachmann@regent.edu',
  true, false, false, false,
  'Contact through assistant Anita Reed (anitree@regent.edu).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Stephen', 'Falling', 'Dr.', 'Chemist',
  'Chemistry',
  ARRAY['chemistry'],
  NULL, false, false, false,
  'Listed for Arctic sea ice / climatology article (2025). Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Alan', 'White', 'Dr.', 'Chemist',
  'Chemistry',
  ARRAY['chemistry'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, notes)
VALUES (
  'Verle', 'Bell', 'Dr.', 'Psychiatrist',
  'Psychiatry, medicine, pain research',
  ARRAY['psychiatry','medicine','pain','neuroscience'],
  'verle.bell@gmail.com',
  NULL, false, false, false,
  'Drive email truncated — "verle.belle@gmail.co" is likely missing the "m." Verify email before contact.',
  'Listed for "God''s Gift of Pain" article (March ALT 2, 2025 article assignments). Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'John', 'Rankin', 'Dr.', 'Researcher', 'La Trobe University',
  'Cosmology, mathematical physics',
  ARRAY['cosmology','mathematical physics','astrophysics'],
  'j.rankin@latrobe.edu.au',
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Albert', 'Mills', 'Dr.', 'Researcher', 'Saint Mary''s University',
  'Animal embryology, reproductive physiology',
  ARRAY['embryology','reproductive physiology','biology'],
  'albert.mills@smu.ca',
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Eugene', 'Chaffin', 'Dr.', 'Physicist',
  'Nuclear physics, radiometric dating critique',
  ARRAY['nuclear physics','radiometric dating','physics'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Ross H.', 'McKenzie', 'Dr.', 'Physicist', 'University of Queensland',
  'Condensed matter physics, quantum science',
  ARRAY['condensed matter','quantum physics','physics'],
  'mckenzie@physics.uq.edu.au',
  false, false, false, false,
  'Secular physicist. Confirm editorial intent before outreach — crossover booking.',
  'Appeared prior seasons. Listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Gerald', 'Gabrielse', 'Dr.', 'Physicist', 'Northwestern University',
  'Quantum physics',
  ARRAY['quantum physics','physics'],
  'gerald.gabrielse@northwestern.edu', '847-467-7370',
  false, false, false, false,
  'Secular physicist.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Robert J.', 'Marks', 'Dr.', 'Professor of Electrical and Computer Engineering', 'Baylor University',
  'Electrical and computer engineering, information theory, intelligent design',
  ARRAY['electrical engineering','information theory','intelligent design','computer science'],
  'Robert_Marks@baylor.edu', '(254) 710-7302',
  NULL, false, false, false,
  'Strong ID/engineering credentials. Listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Bernard', 'Haisch', 'Dr.', 'Astrophysicist', 'California Institute for Physics and Astrophysics',
  'Astrophysics',
  ARRAY['astrophysics','physics'],
  'haisch@calphysics.org',
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Michael', 'Egnor', 'Dr.', 'Neurosurgeon', 'Stony Brook University Medicine',
  'Neurosurgery, head trauma, brain cancer, intelligent design and neuroscience',
  ARRAY['neurosurgery','brain','intelligent design','neuroscience'],
  'Michael.egnor@stonybrookmedicine.edu',
  NULL, false, false, false,
  'ID-friendly neurosurgeon — good fit for brain/consciousness design arguments. Listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, re_approach_notes)
VALUES (
  'Peter', 'Dodson', 'Dr.', 'Professor Emeritus', 'University of Pennsylvania',
  'Paleontology (expertise ends at ~65 million years ago per his own words)',
  ARRAY['paleontology','dinosaurs','deep time','fossils'],
  'DODSONP@UPENN.EDU', '215-898-8784',
  false, false, false, false,
  'Secular paleontologist. Declined July/August 2025 interview (human lineage fossils) — outside his expertise AND unavailable on August 7 due to travel. Said "Perhaps another time on another topic." His expertise ends at 65 million years ago — do not pitch Cenozoic human origins topics.',
  'Left door open. For GSR, only useful as "establishment perspective" voice on non-human paleontology. Secular — confirm editorial intent.',
  'Non-human paleontology only. Confirm editorial intent with David before outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Ron G.', 'Samec', 'Dr.', 'Astronomer', 'Bob Jones University',
  'Astronomy, physics/astronomy education',
  ARRAY['astronomy','physics','education'],
  'rsamec@bju.edu',
  true, false, false, false,
  'BJU affiliation — strong YEC/creation context. Listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes)
VALUES (
  'Deborah', 'Haarsma', 'Dr.', 'Astrophysicist',
  'Astrophysics',
  ARRAY['astrophysics','astronomy'],
  'dhaarsma1@gmail.com',
  false, false, false, false,
  'Haarsma is associated with BioLogos (evolutionary creationism) — worth confirming editorial fit with David before outreach. No doctrinal flag documented beyond BioLogos affiliation.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Rob', 'Sheldon', 'Dr.', 'Astrophysicist', 'University of Calgary',
  'Astrophysics',
  ARRAY['astrophysics','physics'],
  'sheldon@ucalgary.ca',
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Mary', 'Schweitzer', 'Dr.', 'Professor', 'NC State University',
  'Ecology and evolution, taxonomy, vertebrate paleontology, molecular biology',
  ARRAY['paleontology','soft tissue','molecular biology','dinosaur','evolution'],
  'schweitzer@ncsu.edu',
  false, false, false, false,
  'Secular scientist who famously discovered soft tissue in T. rex bones. Her findings have been cited extensively by creation scientists. Her own interpretation differs from a YEC perspective. Confirm editorial intent before outreach.',
  'Confirm editorial intent with David before outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Christian', 'Kammerer', 'Dr.', 'Paleontologist', 'North Carolina Museum of Natural Sciences',
  'Biological sciences, paleontology',
  ARRAY['paleontology','biology'],
  'christian.kammerer@naturalsciences.org', '919-707-9939',
  false, false, false, false,
  'Secular paleontologist. Confirm editorial intent before outreach.',
  'Confirm editorial intent with David before outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Francis', 'Collins', 'Dr.', 'Former NIH Director / Physician-Geneticist', 'NIH (Former)',
  'Genetics, medicine',
  ARRAY['genetics','medicine','genomics'],
  'franciscollins@mail.nih.gov',
  false, false, false, false,
  'Francis Collins is a theistic evolutionist (BioLogos founder) and explicitly not a YEC scientist. His appearance(s) likely involved his faith-science integration perspective. Confirm editorial approach carefully with David before any outreach — his worldview on origins differs significantly from GSR''s.',
  'Confirm editorial approach carefully with David before outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Rebecca', 'Hunt-Foster', 'Paleontologist', 'National Park Service',
  'Paleontology',
  ARRAY['paleontology','fossils'],
  'rebecca_hunt-foster@nps.gov',
  false, false, false, false,
  'NPS-affiliated secular scientist. Confirm editorial intent before outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, email, phone, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Tim', 'Shields', 'Filmmaker',
  'Racism, film',
  ARRAY['film','media','history'],
  'cmatim@gmail.com', '540-829-8101',
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Steve', 'Taylor', 'Dr.', 'Biologist',
  'Biology, soft tissue fossils',
  ARRAY['biology','soft tissue','fossils','paleobiology'],
  's.taylor100@me.com',
  NULL, false, false, false,
  'Episodes: S02 Ep018_B (Feb 2025 — "Evidence for Endogenous Collagen in Edmontosaurus").'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Larry', 'Vardiman', 'Retired Atmospheric Scientist',
  'Atmospheric science',
  ARRAY['atmospheric science','earth science','meteorology'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source, website)
VALUES (
  'Kyle', 'Butt', 'Apologist and Author', 'Apologetics Press',
  'Apologetics, Bible, New Testament studies',
  ARRAY['apologetics','Bible','New Testament'],
  true, false, false, false,
  NULL, 'apologeticspress.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Dave', 'Miller', 'Apologist', 'Apologetics Press',
  'Apologetics, social issues',
  ARRAY['apologetics','social issues'],
  true, false, false, false,
  'apologeticspress.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Jeff', 'Miller', 'Apologist', 'Apologetics Press',
  'Apologetics, social issues',
  ARRAY['apologetics','social issues'],
  true, false, false, false,
  'apologeticspress.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Grady', 'McMurtry', 'Theologian and Creationist Researcher',
  'Theology, creationism, Russia missions',
  ARRAY['theology','creationism','apologetics'],
  true, false, false, false,
  'creationworldview.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Russ', 'Miller', 'Speaker', 'Creation Evolution & Science Ministries',
  'Creation, geology, Grand Canyon',
  ARRAY['creation','geology','Grand Canyon','flood'],
  'russ@creationministries.org',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'John', 'Demassa', NULL,
  'Chemistry',
  ARRAY['chemistry'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Louie', 'Giglio', 'Pastor and Author',
  'Astronomy (popular-level), motivational speaking',
  ARRAY['astronomy','faith','motivation','speaking'],
  true, false, false, false,
  'Listed in 2025 article assignments (astrobiology/planetary science articles). Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'David', 'Barton', 'Historian and Author', 'WallBuilders',
  'History, Bible, American history',
  ARRAY['history','American history','Bible','Christian heritage'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Dennis', 'Siler', 'Engineer', 'Living Waters Bible Camp',
  'Engineering',
  ARRAY['engineering'],
  'dennis@lwbc.org',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Jim', 'Rankin', 'School Teacher',
  'Apologetics',
  ARRAY['apologetics','education'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Kevin', 'Sorbo', 'Actor and Producer',
  'Filmmaking, acting, Christian media',
  ARRAY['film','acting','media','Christian'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes)
VALUES (
  'Andre', 'Eggen', 'Dr.', 'Geneticist/Genomicist', 'Illumina',
  'Genetics/genomics',
  ARRAY['genetics','genomics'],
  'aeggen@illumina.com',
  false, false, false, false,
  'Illumina is a secular genomics company. Confirm editorial intent before outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Jonathan', 'Sarfati', 'Dr.', 'Physical Chemist and Creation Scientist',
  'Chemistry, physics, chess, creation apologetics',
  ARRAY['chemistry','physics','apologetics','creation'],
  true, false, false, false,
  'CMI contact. Also listed in CMI outreach candidates.',
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Paul', 'Taylor', 'Author and Ministry Director', 'Strong Tower Ministries',
  'Mount St. Helens, logic, apologetics',
  ARRAY['apologetics','Mount St. Helens','geology','logic'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Scott', 'Weckerly', 'Co-Instructor', 'Creation Apologetics Teachers College',
  'Apologetics',
  ARRAY['apologetics','education'],
  true, false, false, false,
  'creationtraining.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Helmut', 'Welke', 'Dr.', 'President and Founder', 'Quad-City Creation Science Association',
  'Industrial engineering, creation science',
  ARRAY['industrial engineering','creation science'],
  true, false, false, false,
  'qccsa.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'John', 'May', 'Reptile Expert',
  'Reptiles',
  ARRAY['reptiles','zoology','wildlife'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Ben', 'Owen',
  'Hummingbirds, fireflies',
  ARRAY['wildlife','hummingbirds','fireflies','zoology'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Nathan', 'Hutcherson', 'Media Creator', 'Creeping Things Media',
  'Entomology, snakes, animal biology',
  ARRAY['entomology','snakes','animal biology','zoology'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Eric', 'Hovind', 'Apologist',
  'Apologetics',
  ARRAY['apologetics','creation'],
  true, false, false, false,
  'creationtoday.org'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Stephen', 'Ham', 'Apologist and Theologian',
  'Apologetics, theology',
  ARRAY['apologetics','theology'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Bill', 'Jack', 'Educator', 'Worldview Academy',
  'Apologetics',
  ARRAY['apologetics','worldview','education'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Thomas', 'Kindell', 'Pastor and Ministry President', 'Reasons for Faith Ministries / Calvary Chapel of Weston TX',
  'Theology',
  ARRAY['theology','apologetics','faith'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Kezele', 'Kezele', 'Dr.', 'Physician',
  'Medicine, human body',
  ARRAY['medicine','human body'],
  true, false, false, false,
  'Name listed as "Dr. Kezele Kezele" — first name and last name appear the same in contact list. Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'James', 'Denton', 'Dr.', 'Physician and Speaker', 'Canopy Ministries',
  'Medicine, human body',
  ARRAY['medicine','human body'],
  true, false, false, false,
  'M.D. Located in VA. Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Clay', 'Brinson', 'Dr.', 'Veterinarian and Speaker', 'Canopy Ministries',
  'Veterinary medicine, animals',
  ARRAY['veterinary medicine','animals','zoology'],
  true, false, false, false,
  'Listed in 2025 article assignments (bat evolution, mammal evolution). Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, website)
VALUES (
  'Greg', 'Landry', 'Homeschool Science Educator', 'Greg Landry Homeschool Science',
  'Chemistry, biology, homeschool science education',
  ARRAY['chemistry','biology','education','homeschool'],
  '828-964-1662',
  true, false, false, false,
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Dan', 'Creft', 'Apologist',
  'Apologetics',
  ARRAY['apologetics'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Guy', 'Forsythe', 'Technology Expert',
  'Technology',
  ARRAY['technology'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Thomas', 'Purifoy', 'Filmmaker', 'Compass Cinema',
  'Filmmaking',
  ARRAY['film','documentary','media'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Carl', 'Kerby', 'Apologist', 'Reasons for Hope',
  'Apologetics',
  ARRAY['apologetics','creation'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'James', 'Gardner', 'Geologist', 'Canopy Ministries',
  'Geology',
  ARRAY['geology','earth science'],
  'jim@canopyministries.org',
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Todd', 'Elder', 'Researcher',
  'Botany, plants, baraminology',
  ARRAY['botany','plants','baraminology','creation biology'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Mike', 'Snavely', 'Speaker',
  'Grand Canyon, apologetics, flood',
  ARRAY['Grand Canyon','flood','geology','apologetics'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Sal', 'Giardina', 'Engineer and Apologist',
  'Apologetics, geology, engineering, mechanical engineering, earth sciences',
  ARRAY['engineering','geology','apologetics','earth science'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'James', 'Worrell', 'Astronomer',
  'Astronomy',
  ARRAY['astronomy'],
  true, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Jobe', 'Martin', 'Dr.', 'Author and Speaker',
  'Animal biology',
  ARRAY['animal biology','zoology','creation biology'],
  true, false, false, false,
  'Listed in 2025 article assignments (giraffe necks / zoology). Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Calvin', 'Smith', 'Apologist', 'Answers in Genesis',
  'Apologetics',
  ARRAY['apologetics','creation'],
  true, false, false, false,
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Bobby', 'Williams', 'Christian Minister and Host', 'EncouragingMoments.com',
  'Christian encouragement/ministry, community events',
  ARRAY['ministry','faith','encouragement'],
  true, false, false, false,
  'Casual relationship through David Rives. Reach by text if email unanswered (Session 39 — initial email went unanswered, text worked). CTN context primarily, not GSR hard science.',
  'Host of "Encouraging Moments" show. Nashville area. Episodes: CTN/CTN podcast appearance (Wonders Center, May 27). Not a GSR science interview.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, website)
VALUES (
  'Andy', 'Andrews', 'Dr.', 'Author and Speaker',
  'Business, human behavior',
  ARRAY['business','human behavior','motivation'],
  NULL, false, false, false,
  'Not a creation scientist — motivational/business author. Confirm editorial context before outreach.',
  'Appeared prior seasons.',
  'andyandrews.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Tim', 'Mahoney', 'President and Creative Director', 'Mahoney Media',
  'Biblical archaeology, Patterns of Evidence film series, Egyptian connection to Exodus, Papyrus Anastasi I, biblical giants, biblical chronology, history, archaeology, film',
  ARRAY['biblical archaeology','Exodus','film','history','Egypt'],
  'tmahoney@thinkingmanfilms.com',
  NULL, false, false, false,
  'When re-contacted in April 2026, Tim was cordial but non-committal ("We will discuss this week"). He copied Steve Law (content collaborator) and Jane Bjork (marketing manager) on his reply, suggesting institutional review was needed.',
  'Warm but indirect. Do not pitch as a solo ask — contact goes through his team (Steve Law, Jane Bjork). Team institutional review is required before committing.',
  'Edina, MN. Appeared prior seasons; re-invited April 2026 (outcome unclear).',
  'patternsofevidence.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source, website)
VALUES (
  'Rob', 'Carter', 'Dr.', 'Researcher and Speaker', 'Creation Ministries International',
  'Marine biology, genetics, human population genetics, creation biology',
  ARRAY['marine biology','genetics','human origins','creation biology','genomics'],
  'rcarter@creation.com',
  true, false, false, false,
  'CMI contact. Strong candidate for genetics, marine biology, human origins topics. Listed in 2025 and 2026 article assignments.',
  'CMI', NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Charles', 'Harrison', 'Dr.', 'Applied Physicist',
  'Applied physics, electromagnetics',
  ARRAY['applied physics','electromagnetics','physics'],
  NULL, false, false, false,
  'Institutional affiliation not listed in Drive.',
  'Appeared prior seasons.'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SECTION 5: PROSPECTS / INVITED / NEVER APPEARED
-- (Skip duplicate back-references — Paul Nelson, Jake Hebert,
--  Russ Humphreys, Jerry Bergman, Stuart Burgess, Glenn Wilson,
--  Rob Stadler, Mark Horstemeyer, Ed Holroyd, Peter Dodson,
--  Deborah Haarsma, Michael Egnor, Tim Mahoney, Randy Guliuzza
--  already inserted above)
-- ============================================================

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, re_approach_after, re_approach_notes, communication_notes, notes)
VALUES (
  'Marcus', 'Ross', 'Dr.', 'Associate Professor of Geology', 'Liberty University',
  'Paleontology, geology, mosasaur research, flood geology, dinosaur tracks',
  ARRAY['paleontology','geology','mosasaur','flood geology','dinosaurs'],
  true, false, false, false,
  '2026-09-01',
  'Contact after September 2026. Keep tone warm — prior contact was positive.',
  'Friendly decline in May 2026: "a number of upcoming commitments...I may be more available after September." Company (Cornerstone Educational Supply) has peak season June–September.',
  'Ph.D. in Geosciences, University of Rhode Island. Also runs Cornerstone Educational Supply (Science, Faith, and Fun!).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes)
VALUES (
  'Vance', 'Nelson', 'Author and Creation Researcher',
  'Fossils, creation evidence, ancient civilizations, Tower of Babel, Grand Canyon, biblical flood evidence',
  ARRAY['fossils','creation','Babel','Grand Canyon','flood'],
  '1-403-872-9475',
  true, false, false, false,
  'Declined second invitation (Feb 2026) with pointed feedback: "last time didn''t go well with tech issues, and never got to main slides. I''ll pass. This is too short for how my mind works." His objection is about format and length, not content or relationship.',
  'Format must change — accommodate slides and longer segment time. Address the prior bad tech experience explicitly in any new outreach. The book promotion angle is a natural entry point.',
  'Direct and self-aware about format limitations. iPhone reply. "Blessings" sign-off — not hostile.',
  'Canadian. Author of "Banished from Babel" (first edition, 2025).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, source)
VALUES (
  'Nathaniel', 'Jeanson', 'Dr.', 'Researcher', 'Answers in Genesis',
  'Genetics, post-Flood population genetics, mitochondrial DNA, ancient DNA, Y-chromosome research, human origins',
  ARRAY['genetics','population genetics','ancient DNA','human origins','mitochondrial DNA'],
  'njeanson@answersingenesis.org',
  true, false, false, false,
  'Strong candidate for genetics, population genetics, ancient DNA topics. Contact through AiG. Listed in 2025 and 2026 article assignments.',
  'Ph.D. in Cell and Developmental Biology, Harvard. Targeted for April 2026 filming cycle; no confirmed response documented. Harvard ancient DNA/post-Flood genetics was the selected angle.',
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Branyon', 'May', 'Dr.', 'Astrophysicist',
  'Astrophysics, cosmology, Hubble Tension discovery',
  ARRAY['astrophysics','cosmology','Hubble Tension'],
  true, false, false, false,
  'David Rives personally requested this outreach (Session 76) — may be personally known to David. Treat as priority booking requiring relationship cultivation. Check with David for the best contact approach.',
  'Ph.D. in Astrophysics. Outreach drafted; no confirmed response documented. Session 76 notes to "find the best avenue to get a yes."'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, source)
VALUES (
  'Michael', 'Behe', 'Dr.', 'Senior Fellow / Biochemist', 'Discovery Institute / Lehigh University',
  'Molecular basis of life, irreducible complexity, intelligent design at molecular level, biochemistry',
  ARRAY['biochemistry','irreducible complexity','intelligent design','molecular biology'],
  NULL, false, false, false,
  'Declined interview on human intelligence topic: "I''m a biochemist who studies the molecular basis of life. I know very little about human intelligence, so I don''t think I''d be a good match for your show." Signed "Mike Behe" — casual, not unfriendly. Also on Age of Design wishlist for origin-of-life / molecular machines topic pending through Discovery Institute channel.',
  'Molecular biology, irreducible complexity, Darwin Devolves topics only. Do NOT re-invite on cognitive science, neurology, or intelligence topics.',
  'Completely re-approachable for topics matching his expertise. Use Discovery Institute / Tom Duke / Tom Winkler network for coordination.',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Todd', 'Wood', 'Dr.', 'Biologist and Creation Researcher',
  'Creation biology, genetics, human origins, baraminology, Neanderthal research',
  ARRAY['creation biology','genetics','baraminology','Neanderthal','human origins'],
  'toddcharleswood@gmail.com',
  true, false, false, false,
  'Invitation drafted in "repeat guest" mode for Neanderthal interview and climate science topic. Drive lists him as 1st choice for January 2026 "Neanderthals episode." Contact: toddcharleswood@gmail.com. Note: also listed as "Dr. Charles Wood" in some Drive docs — same person.',
  'Core Academy of Science. Invited — no confirmed response documented.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes)
VALUES (
  'Spike', 'Psarris', 'Former Military Engineer / Creation Science Speaker',
  'Astronomy, cosmology, planetary science from a creation perspective',
  ARRAY['astronomy','cosmology','planetary science','creation'],
  true, false, false, false,
  'Declined February 2026 because he was on a creation ministry trip in the Philippines: "I''m currently in the Philippines on a creation ministry trip, and won''t be available for interviews." Warm and apologetic. Ministry travel schedule means availability should be verified before assuming he can do a specific date.',
  'Check availability before booking. Strong fit for cosmology, planetary science, astronomy topics.',
  'Reliable, warm guest when home. Verify availability before assuming a date works.',
  '"What You Aren''t Being Told About Astronomy" video series. Former engineer with U.S. military space program. Episodes: In-studio April 2025 (S02 Ep028_A); last confirmed appearance January 2026. Listed in 2026 article assignments for dark matter/Mars topics alongside Dr. Danny Faulkner.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Danny', 'Faulkner', 'Dr.', 'Astronomer', 'Answers in Genesis',
  'Astronomy, cosmology, solar system, stellar physics, young-universe models',
  ARRAY['astronomy','cosmology','solar system','stellar physics','young-earth'],
  'dfaulkner@answersingenesis.org',
  true, false, false, false,
  'Recommended by Andrew Fabich as better fit for astronomy/Jupiter topics. AiG contact. No direct correspondence documented in sessions. Listed in 2026 article assignments (dark matter, alongside Spike Psarris). Note: Drive has typo in email — correct form assumed.',
  'AiG'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Wayne', 'Spencer', 'Creation Scientist',
  'Solar system, astronomy, planets',
  ARRAY['solar system','astronomy','planets','creation'],
  'wspencer@creationanswers.net',
  true, false, false, false,
  'Andrew Fabich specifically provided his email and described him as "especially good on the Solar System." Use Fabich referral as warm introduction. No direct correspondence documented.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes, notes)
VALUES (
  'Guy', 'Consolmagno SJ', 'Brother', 'Director, Vatican Observatory',
  'Astronomy, cosmology, science-religion intersection',
  ARRAY['astronomy','cosmology','Vatican','science-religion'],
  'director@specola.va',
  false, false, false, false,
  'Warm and witty decline — was on silent retreat, then in Australia, then New Zealand. Also: "I don''t have anything particularly wise to say about the article you mention, except to mention that most amazing breakthroughs announced in press releases turn out to be wrong." He is likely an old-earth Catholic — worldview does not align with YEC content.',
  'Only if editorial intent is confirmed with David. Avoid press-release science topics — he will decline. A substantive topic on wonder at the cosmos, limits of scientific knowledge, or Jesuit astronomy tradition might work.',
  'He is the Vatican Observatory Director and a Jesuit. Worldview on creation does not align with GSR''s YEC perspective. Contact through Vatican Observatory: director@specola.va.',
  'Jesuit brother; astronomer. Scheduling was an issue: silent retreat, then Australia, then New Zealand.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes)
VALUES (
  'Jonathan', 'Lunine', 'Dr.', 'James Arthur Professor', 'Cornell University',
  'Planetary system formation and evolution, exoplanets, astrobiology, search for life',
  ARRAY['planetary science','exoplanets','astrobiology','Cornell'],
  'jlunine@astro.cornell.edu',
  false, false, false, false,
  '"I''ll pass Dan; thank you for the invite." iPhone reply. No reason given. Secular planetary scientist. Brevity suggests this is unlikely to be a productive relationship for GSR. Drive contact list lists him as "past guest" — may indicate an earlier season appearance.',
  'Low probability. If re-approached at all, use pure science curiosity framing with no worldview reference.',
  'Terse iPhone decline warrants caution about re-outreach.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Ward', 'Howard', 'Dr.', 'Astrophysicist', 'University of Colorado, Boulder',
  'Exoplanet discovery, observational astronomy, astrophysical and planetary sciences',
  ARRAY['exoplanets','observational astronomy','astrophysics'],
  'Ward.Howard@colorado.edu',
  false, false, false, false,
  'Secular scientist. Referred by Sarah Rugheimer. Confirm editorial intent before outreach. Drive lists him as prospect in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes)
VALUES (
  'Sarah', 'Rugheimer', 'Dr.', 'Astrophysicist/Astrobiologist', 'York University',
  'Astrobiology, exoplanet atmospheres, biosignatures',
  ARRAY['astrobiology','exoplanets','biosignatures','astrophysics'],
  'sarah.rugheimer@yorku.ca',
  false, false, false, false,
  'Decline was circumstantial (major international move), not a principled refusal. However, she is a secular scientist and referred Daniel to Ward Howard instead. Drive lists her as "past guest."',
  'Low priority for GSR. Ward Howard is the better referral.',
  'Secular scientist. Low GSR fit. The Ward Howard referral is more useful.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, re_approach_notes, communication_notes)
VALUES (
  'John', 'Bimson', 'Dr.', 'Biblical Scholar and Archaeologist',
  'Biblical history, archaeology, historical intersections with scripture',
  ARRAY['biblical archaeology','history','Old Testament','scripture'],
  'sonofbim@yahoo.co.uk',
  NULL, false, false, false,
  '"I''m sorry but this topic is way beyond my expertise." — brief, polite, January 6, 2026.',
  'Find a topic squarely within his biblical history / Old Testament archaeology expertise. Avoid broad framing — be specific.',
  'UK-based. Polite single-sentence decline. The door is not closed — just topic mismatch.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Jonathan', 'Corrado', 'Dr.', 'Researcher', 'ICR',
  'Research integrity, ideological bias',
  ARRAY['research integrity','ideological bias','science'],
  true, false, false, false,
  'Contact through ICR. Candidate for "Ideological bias in research findings" article (2026 assignments). Note: listed as "Johnathan Corrado ICR" in Drive.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Günter', 'Bechly', 'Dr.', 'Paleontologist and ID Proponent',
  'Paleontology, intelligent design',
  ARRAY['paleontology','intelligent design','fossils'],
  NULL, false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Brian', 'Miller', 'Dr.', 'Physicist',
  'Physics, intelligent design',
  ARRAY['physics','intelligent design'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Winston', 'Ewert', 'Dr.', 'Computer Scientist',
  'Computer science, information theory, intelligent design',
  ARRAY['computer science','information theory','intelligent design'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Paul', 'Garner', 'Dr.', 'Researcher', 'Biblical Creation Trust',
  'Environmental sciences, geology, biology',
  ARRAY['environmental science','geology','biology','creation'],
  'paul@biblicalcreationtrust.org',
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes)
VALUES (
  'Matt', 'McLain', 'Dr.', 'Paleontologist',
  'Paleontology, dinosaurs, dinosaur soft tissue',
  ARRAY['paleontology','dinosaurs','soft tissue'],
  true, false, false, false,
  'Name spelling inconsistent in Drive — listed as both "Dr. Matt McClain" and "Dr. Matthew McLain." Verify before outreach. Candidate for 2026 dinosaur soft tissue article.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Joe', 'Francis', 'Dr.', 'Biologist',
  'Biology, ecology',
  ARRAY['biology','ecology','marine life','creation'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Marc', 'Surtees', 'Dr.', 'Paleontologist',
  'Paleontology',
  ARRAY['paleontology','fossils'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'John', 'Currid', 'Dr.', 'Old Testament Scholar', 'Reformed Theological Seminary',
  'Ancient Egypt, Old Testament archaeology, biblical apologetics',
  ARRAY['Old Testament','Egypt','biblical archaeology','apologetics'],
  NULL, false, false, false,
  'Ph.D. Expert in Egyptian archaeology and Old Testament. Listed in 2026 article assignments; used as canonical addressee example in outreach email templates (Session 29).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Douglas', 'Petrovich', 'Dr.', 'Biblical Archaeologist',
  'Biblical archaeology, epigraphy (ancient inscriptions)',
  ARRAY['biblical archaeology','epigraphy','inscriptions','ancient history'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'David', 'Snoke', 'Dr.', 'Physicist',
  'Quantum computing',
  ARRAY['quantum computing','physics'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Doug', 'Axe', 'Dr.', 'Biochemist',
  'Biochemistry, information theory, origin of life critique',
  ARRAY['biochemistry','information theory','origin of life','protein folding'],
  NULL, false, false, false,
  'Discovery Institute network / ID community.',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes)
VALUES (
  'Joshua', 'Swamidass', 'Geneticist',
  'Genetics, population biology',
  ARRAY['genetics','population biology'],
  false, false, false, false,
  'Swamidass is a theistic evolutionist associated with Peaceful Science — his worldview on origins differs significantly from GSR''s YEC stance. Confirm editorial intent with David before outreach.',
  'Editorial fit needs explicit discussion with David before contacting.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Luke', 'Barnes', 'Dr.', 'Cosmologist',
  'Cosmology, fine-tuning arguments',
  ARRAY['cosmology','fine-tuning','physics'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'John', 'Lennox', 'Mathematician and Philosopher', 'University of Oxford',
  'Mathematics, science-religion dialogue, Christian apologetics',
  ARRAY['mathematics','philosophy','apologetics','science-religion'],
  NULL, false, false, false,
  'Not coordinated through Discovery Institute — contact directly. High-profile Oxford figure. Discovery Institute confirmed they do NOT coordinate Lennox.',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'William A.', 'Dembski', 'Dr.', 'Mathematician and Philosopher',
  'Intelligent design, probability theory, biological information',
  ARRAY['intelligent design','probability','mathematics','information theory'],
  NULL, false, false, false,
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Michael', 'Denton', 'Dr.', 'Senior Fellow', 'Discovery Institute',
  'Biochemistry, fine-tuning arguments, intelligent design',
  ARRAY['biochemistry','fine-tuning','intelligent design'],
  NULL, false, false, false,
  'Contact through Discovery Institute (Tom Winkler, Rob Crowther).',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Casey', 'Luskin', 'Associate Director, Center for Science and Culture', 'Discovery Institute',
  'Intelligent design curriculum, textbook issues, education reform, scientific case for ID',
  ARRAY['intelligent design','education','curriculum','science'],
  NULL, false, false, false,
  'Discovery Institute contact.',
  'Discovery Institute'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Steve', 'Laufmann', 'Author and Systems Biologist',
  'Design in the human body, systems biology, engineering perspective on biology',
  ARRAY['human body','systems biology','engineering','intelligent design'],
  NULL, false, false, false,
  'Co-author of "Your Amazing Body" (abridged from "Your Designed Body," with Dr. Howard Glicksman). Discovery Institute wishlist.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Howard', 'Glicksman', 'Dr.', 'Medical Doctor and Author',
  'Human body design, systems medicine, intelligent design in biology',
  ARRAY['human body','medicine','intelligent design','systems biology'],
  NULL, false, false, false,
  'Co-author of "Your Designed Body" and "Your Amazing Body" (with Steve Laufmann). Discovery Institute wishlist.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'George', 'Hawke', 'Dr.', 'Scientist', 'CMI',
  'Unspecified (CMI-affiliated)',
  ARRAY['creation science'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Mark', 'Harwood', 'Dr.', 'Engineer / Satellite Specialist', 'CMI',
  'Engineering, satellite systems',
  ARRAY['engineering','satellite','technology'],
  true, false, false, false,
  'CMI contact.',
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Bob', 'Hosken', 'Dr.', 'Scientist', 'CMI',
  'Unspecified (CMI-affiliated)',
  ARRAY['creation science'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Royal', 'Truman', 'Dr.', 'Organic Chemist / Researcher', 'CMI',
  'Organic chemistry, information theory, creation research',
  ARRAY['organic chemistry','information theory','creation research'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Angela', 'Meyer', 'Dr.', 'Scientist', 'CMI',
  'Unspecified (CMI-affiliated)',
  ARRAY['creation science'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'Keith', 'Wanser', 'Dr.', 'Physicist', 'CMI',
  'Physics',
  ARRAY['physics','creation science'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, source)
VALUES (
  'John', 'Osgood', 'Dr.', 'Physician and Researcher', 'CMI',
  'Medicine, biblical chronology',
  ARRAY['medicine','biblical chronology','creation'],
  true, false, false, false,
  'CMI'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes, source)
VALUES (
  'Joel', 'Penton', 'Dr.', 'CEO', 'LifeWise Academy',
  'Education, church/state separation, Christian advocacy in public schools',
  ARRAY['education','church-state','Christian advocacy','film'],
  NULL, false, false, false,
  'Also documentary filmmaker ("Off-School Property: Solving the Separation Between Church and State," released October 23, 2025). Publicist-managed (Marianna Gibson, Jones Literary, jonesliterary.com). Film media cycle timing constraint may no longer apply. Contact through Jones Literary publicist if pursuing.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes)
VALUES (
  'Dan', 'Janzen', NULL, 'Agricultural/Climate Researcher and UFO Researcher',
  'UFOs, extraterrestrial claims, biblical theology on angels/demons, agriculture, climate myths',
  ARRAY['UFOs','aliens','biblical theology','agriculture','climate'],
  NULL, false, false, false,
  'Initial outreach email was flagged as SPAM ("Re: ***SPAM***"). Two distinct expertise areas: UFOs/aliens biblical angle AND agriculture/climate myths. NOTE: Two different people named "Dan Janzen" appear in the data — this is the UFOs/agriculture expert introduced through Isaac Washburn.',
  'Introduced through personal network (Isaac Washburn). Flexible scheduling. Email may need alternate contact route due to spam filtering.',
  'Episodes: S03 Ep15 March 3:40 PM; S03 Ep23 June 15 (scripted and scheduled).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Dan', 'Janzen', 'Executive Director', 'Fellowship of Christian Farmers International',
  'Farming, Christian agricultural stewardship',
  ARRAY['farming','agriculture','Christian stewardship'],
  '6166766684',
  true, false, false, false,
  'Isaac Washburn referral. WhatsApp: 16162042268. Different person from Dan Janzen (UFOs expert). Daniel was too busy at the Film Summit to meet in person; sent email instead.',
  'Invited during NRB week February 2026. Different from Dan Janzen (UFOs/agriculture expert).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Tim', 'Mulgrew', 'Christian Author and Speaker',
  'Christian spiritual experience, faith integration, personal testimony',
  ARRAY['faith','testimony','Christian','spirituality'],
  NULL, false, false, false,
  'CTN context only (Changing the Narrative podcast), not GSR. Third-party pitch from outside contact forwarded by Halie.',
  'Author of "The Book of Us." Evaluated — viability for CTN assessed (not GSR). Emotional/personal faith content, not creation science.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes, website)
VALUES (
  'E. Calvin', 'Beisner', 'Dr.', 'Founder and Theologian', 'Cornwall Alliance for the Stewardship of Creation',
  'Environment, climate stewardship, Christian environmental ethics, climate science, economics, theology',
  ARRAY['climate','environment','theology','Christian ethics','stewardship'],
  'calvin@cornwallalliance.org',
  NULL, false, false, false,
  'Collegial, helpful. Gracious even when referrals don''t pan out. Listed in 2026 article assignments. Strong candidate for climate stewardship, environmental ethics, climate change critique topics.',
  'Correspondence in progress; also helped connect Daniel to Dr. Steele (referral that didn''t work out).',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes, communication_notes, notes, website)
VALUES (
  'Erick', 'Stakelbeck', 'Author, Television Host', 'TBN',
  'Israel, biblical archaeology, history, Middle East, end-times geopolitics, terrorism/security',
  ARRAY['Israel','biblical archaeology','geopolitics','end-times','Middle East'],
  NULL, false, false, false,
  'Not a flat refusal — referred Daniel to "Danny ''The Digger'' Herman" for a Magdala/biblical archaeology topic: "I''ve filmed at Magdala with him." He has a lot to do and redirected rather than committing.',
  'Connector and referral source for Israeli archaeology contacts. Contact: erick@erickstakelbeck.com. Warm relationship potential. Drive contact list lists him as "past guest" but session archaeology shows no confirmed appearance.',
  'Host of "The Watchman" (TBN). Warm but not yet confirmed; referred Daniel to Danny Herman.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Danny', 'Herman', 'Israeli Tour Guide and Archaeologist',
  'Biblical archaeology, Israeli excavation sites, Magdala and other New Testament locations',
  ARRAY['biblical archaeology','Israel','Magdala','excavation'],
  NULL, false, false, false,
  'Approach as a Stakelbeck referral — lead with the connection. Israel-based — timezone and travel logistics apply. Described as "a leading Israeli tour guide and archaeologist."',
  'Referred by Erick Stakelbeck. Nicknamed "The Digger." No outreach confirmed in reviewed sessions.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Eric', 'Metaxas', 'Author, Broadcaster and Show Host',
  'Cultural commentary, Christian apologetics, history, culture/faith intersection',
  ARRAY['apologetics','cultural commentary','history','Christian media'],
  'jared@ericmetaxas.com',
  NULL, false, false, false,
  'Multi-party coordination through Tom Duke (ageofdesign@icloud.com) and Jared Fleming (jared@ericmetaxas.com). Mutual benefit angle: David appearing on Metaxas''s show while Metaxas appears on GSR. NRB conference (Feb 17–20, 2026) was primary coordination window. Contact through Jared Fleming (Chief of Staff).',
  'Author of "Is Atheism Dead?," Bonhoeffer biography. Host of "The Eric Metaxas Show"; CBN contributor. Committed for Age of Design interview — scheduling via Tom Duke / Jared Fleming.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Rice', 'Broocks', 'Dr.', 'Founder/Leader', 'Every Nation Churches and Ministries',
  'Christian apologetics, existence of God, Christian worldview',
  ARRAY['apologetics','Christian worldview','existence of God','faith'],
  NULL, false, false, false,
  'Organizational approach via Every Nation ministry channels.',
  'Ph.D. Author of "God''s Not Dead" (the book the film was based on). Invited — call scheduled for Age of Design coordination (early outreach stage as of last session data).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Patrick', 'Clarke', 'Dr.', 'Engineering and Archaeology Researcher',
  'Engineering, ancient hydraulics, pyramid technology, Egyptian engineering',
  ARRAY['engineering','ancient hydraulics','pyramids','Egypt','archaeology'],
  NULL, false, false, false,
  'Standard first-time outreach template used. Topic: Popular Mechanics / PLOS ONE article about ancient Egyptian pyramid hydraulic systems.',
  'Specific institution not confirmed. First-time outreach email sent (early 2026); no confirmed response. Engineering and ancient architecture angle — good GSR fit for creation/design-in-history content.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, email, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'James', 'Johnson', 'Dr.', 'Chief Academic Officer and Associate Professor of Apologetics', 'ICR',
  'Law, theology, biblical creation applications, forensic science, history, education',
  ARRAY['apologetics','law','theology','forensic science','history'],
  'profjjsj@aol.com',
  true, false, false, false,
  'ICR contact. Also accessible at ICR contact Renee (institutional booking). July/August 2025 filming outreach; no confirmed response documented.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, email, phone, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes, source)
VALUES (
  'Steve', 'Austin', 'Dr.', 'Geologist',
  'Flood geology, Grand Canyon, Mount St. Helens, catastrophism, stratigraphy, Mediterranean flood',
  ARRAY['flood geology','Grand Canyon','catastrophism','geology','stratigraphy'],
  'saustin@icr.edu', '800-337-0375',
  true, false, false, false,
  'Contact: saustin@icr.edu. ICR contact Renee also used for institutional booking. Listed in 2025 and 2026 article assignments (Mediterranean flood, Grand Canyon flood topics). July/August 2025 and later outreach; no confirmed response in reviewed sessions.',
  'ICR'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, communication_notes)
VALUES (
  'Brad', 'Harrub', 'Dr.', 'Neuroscientist / Founder', 'Think Apologetics (formerly Focus Press)',
  'Brain science, creation apologetics, Scopes Monkey Trial, Christianity and science, bioethics, lab-grown brains',
  ARRAY['neuroscience','brain','apologetics','bioethics','consciousness'],
  true, false, false, false,
  'Reached by text because he was already on-site for other shows. Unfamiliar contact at time of outreach. Listed in 2026 article assignments for "lab-grown brain models / ethics" article.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, title, job_title, organization, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'John', 'Baumgardner', 'Dr.', 'Geophysicist', NULL,
  'Geophysics, catastrophic plate tectonics, flood geology, mantle convection modeling',
  ARRAY['geophysics','plate tectonics','flood geology','catastrophism'],
  true, false, false, false,
  'Ph.D. in Geophysics and Space Physics, UCLA. Formerly Los Alamos National Laboratory. Researcher of catastrophic plate tectonics (CPT). Candidate from creation scientist reference list (boss-provided, Sessions 115–116).'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Gavin', 'Cox', 'Researcher',
  'Unspecified (CMI-affiliated)',
  ARRAY['creation science'],
  false, false, false,
  'CMI implied by Drive context. Listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Andy', 'Crouch', 'Christian Author and Cultural Commentator',
  'Christianity and culture, technology',
  ARRAY['culture','technology','Christianity','media'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Jason', 'Thacker', 'Author and Ethicist',
  'AI ethics, Christianity and technology',
  ARRAY['AI ethics','technology','Christianity'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_deceased, do_not_contact, sensitive_flag)
VALUES (
  'Eric', 'Anderson', 'Researcher',
  'Unspecified',
  ARRAY['creation science'],
  false, false, false
) ON CONFLICT DO NOTHING;

INSERT INTO public.guests (first_name, last_name, job_title, expertise, expertise_tags, is_yec, is_deceased, do_not_contact, sensitive_flag, notes)
VALUES (
  'Rosalind', 'Picard', 'Professor / AI Researcher',
  'AI, affective computing',
  ARRAY['AI','affective computing','technology'],
  NULL, false, false, false,
  'Real-world affiliation: MIT Media Lab. Listed in 2026 article assignments.'
) ON CONFLICT DO NOTHING;

-- Thomas Duke: organizational contact / intermediary (not a guest)
INSERT INTO public.guests (first_name, last_name, job_title, organization, expertise, expertise_tags, email, is_deceased, do_not_contact, sensitive_flag, communication_notes, notes)
VALUES (
  'Thomas', 'Duke', 'Age of Design Coordinator', 'Age of Design, Inc.',
  'Intelligent design/technology; organizational connector',
  ARRAY['intelligent design','coordination','media'],
  'ageofdesign@icloud.com',
  false, false, false,
  'Primary coordinator for Age of Design collaboration. Active email correspondence through April 2026. Key intermediary for Stephen Meyer, Rob Stadler, James Tour, and other Discovery Institute guests.',
  'Texas nonprofit. Also Thomas Duke Investments, LLC. Not a guest himself — organizational contact for Age of Design network.'
) ON CONFLICT DO NOTHING;
