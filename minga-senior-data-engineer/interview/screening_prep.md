# Minga Screening Call Prep

- **Role:** Senior Data Engineer
- **With:** Madison Hawkins (madison@minga.io), People & Culture Manager. Google Meet via Calendly invite to william@williamtucker.ca.
- **Date:** Tuesday 2026-10-06, 2:30pm to 3:00pm Pacific (30 minutes)
- **What a screen like this checks:** are you real, are you a fit for the culture, do location / comp / notice line up, and can you explain your experience in plain words. Expect it to be light on technical depth. The deep Snowflake/dbt questions come in a later round with the Senior Engineering Manager, Platform & SRE.
- **Their note:** "We value your unique voice over a perfect prompt. It's okay to not answer perfectly." Talk from these notes. Don't read them out.

---

## 1. Know the company (2 minutes of reading)

- **What they make:** a K-12 campus platform. Digital student IDs, digital hall passes, tardy management, behaviour and rewards, FlexTime (intervention and enrichment scheduling), check-in, school communication. Pitch line: "the Student Behavior Platform schools can't live without."
- **Scale:** 2,000+ schools, mostly in the US. Around 115 employees.
- **Origin:** founded in Kelowna (started 2015 as Change Gamers, became Minga around 2018). CEO is **Jason Richards**.
- **Money:** $65M growth investment led by Riverwood Capital (announced March 23, 2026).
- **Recent:** acquired **RTI Scheduler** (Gammon Applications, Arkansas) to strengthen intervention and enrichment. CEO quote: "Flex periods and intervention blocks are no longer a nice-to-have."
- **Why that matters for this role:** fresh funding plus an acquisition plus a planned "ground-up rebuild of our platform" means data from several systems has to be mapped, migrated and trusted. That's the job, and it's the part of your VIU work (moving legacy systems onto new platforms with their data intact) that maps most directly.
- **Culture words they use:** community ("Minga means community"), low-ego, "we over me", shared ownership, real impact for educators and students.
- **Current data stack (from the posting):** Snowflake, Stitch (ingestion), Metabase (BI). No modelling layer, no real orchestration ("runs on good intentions today"). Customers of the data team: RevOps, Finance, CX, Product.

---

## 1b. Their full stack (researched 2026-10-06)

Source: Minga's published subprocessor list (minga.io/privacy/subprocessors) plus their support/IT docs and job postings.

**Product side (where the data comes from):**
- **App:** Angular + TypeScript web app, hybrid mobile apps built with Capacitor (iOS + Android). Backend services in Node.js + TypeScript.
- **Database:** MongoDB Atlas. The operational data is documents, not relational tables. That's what Stitch is pulling into Snowflake.
- **Hosting:** Google Cloud (Education Platform Partner) and AWS, with **Controlplane** for platform orchestration (container/workload platform across clouds). US data in Google's Detroit-area region; Canadian districts' data is kept primarily in Canada.
- **Rostering:** MingaSync, nightly. Direct OneRoster integrations (Clever, ClassLink, PowerSchool, Infinite Campus, Skyward and about 20 more), SFTP file drops for another ~24 SIS vendors, and **Ednition** for rostering/directory sync. SSO via Google, Microsoft, Clever, ClassLink.
- **Errors:** Sentry.

**Business and analytics side (your territory):**
- **Snowflake:** data warehouse.
- **Stitch:** ingestion (managed ELT, owned by Qlik/Talend). The posting wants it "hardened or replaced."
- **Metabase:** BI and reporting.
- **HubSpot:** sales and marketing CRM. You've integrated with the HubSpot API.
- **PostHog + UserPilot:** in-app product analytics. This is where the "analytics event model for the new platform" work lands.
- **Intercom** (support), **Mailchimp** (transactional email), **Google Analytics** (public site only), Google Workspace.
- **n8n:** workflow automations. **You built and operate an n8n stack** (queue mode, Postgres + Redis, git-deployed workflows). It's internal and runs on your workstation, not hosted production, so say "I run my own n8n stack," not "in production." Real overlap; mention it once, naturally.

**Missing today (per the posting):** no dbt/modelling layer, no orchestrator, no formal access/retention/PII standards across Snowflake and Metabase.

**Privacy posture:** FERPA, COPPA, NY Ed Law 2-d, Illinois SOPPA, Texas SCOPE Act, A4L Student Data Privacy Agreements. PIPEDA and BC PIPA for Canadian districts. Delete or de-identify platform data within 90 days of contract end. Your angle: you've lived the BC public-sector side (student PII to the Ministry). You have not worked under FERPA/COPPA; say so if asked.

**What this means for the job (good things to say out loud):**
- Mongo documents to Snowflake means semi-structured data (Snowflake `VARIANT`, flattening JSON). Modelling it cleanly in dbt is a big part of the work.
- 50 different SIS sources, nightly syncs, plus the RTI Scheduler acquisition plus a platform rebuild: lots of legacy-to-new mapping. That's your VIU modernization story.
- Retention rules (90-day delete/de-identify) have to be honoured in the warehouse too, not just the app. Good question to ask later rounds.

---

## 1c. Culture (researched 2026-10-06, from minga.io/careers)

- **Values (four):** Growth ("always learning, always evolving"), Respect ("every voice matters", disagree productively, best solution over being right), Integrity ("doing what's right, even when it's hard", own mistakes, follow through), Passion (energy, fun, human connection).
- **Mission:** streamline K-12 school operations, drive student engagement, free up educators' time. **Vision:** the most loved product for safer, more connected schools.
- **Self-description:** "curious, creative, low-ego humans", "we over me", "a people company". Hiring for **culture add, not culture fit**. No-ghosting promise.
- **Hybrid:** in office **Mon, Tue, Thu**; remote **Wed, Fri**; core hours 9 to 3. Office: 460 Doyle Ave, downtown Kelowna.
- **Rituals:** biweekly all-hands, monthly CEO lunch & learns with open Q&A, monthly team lunches, Thursday happy hours, hackathons, offsites twice a year (Q1 and Q3), office dogs, a Kudos recognition platform.
- **Benefits:** 15 vacation days + 3+ flex days + 5 sick/wellness days + bonus holiday days; health/dental/vision from day one incl. dependents; health spending account; EAP; **2% of salary per year for learning** (about $2,800 at $140K); optional RRSP with **no company match**. Compare against VIU later; don't negotiate in the screen.
- **Interview process:** (1) recruiter call, today; (2) hiring manager, 45 to 60 min; (3) culture interview with teammates; (4) practical exercise if applicable; (5) leadership interview. Usually 4 to 6 weeks.

**Your stories mapped to their values:**
- *Growth:* picked up PostgreSQL vector search and n8n in the last year and shipped on both; will do the same with Snowflake and dbt.
- *Respect:* working with the departments that own the data; saying "not yet" and explaining why.
- *Integrity:* you named your Snowflake/dbt gap in the cover letter. The CDWTool hardening (removing committed secrets you found).
- *Passion:* you treat this work like a hobby; twelve years in education; Minga touches the school day itself.

---

## 2. Your 60-second intro (talking points, not a script)

1. Twelve years building the systems that hold student data at BC universities. TRU first, VIU since 2016.
2. The piece I'm proudest of for this role: I built and own the pipeline that sends VIU's student-level data to the BC Ministry's Central Data Warehouse. Fourteen tables out of Oracle, packaged, delivered, archived, with duplicate protection per reporting period and a record of every submission. I also maintain the SQL behind the CRA tax-slip filings.
3. Deep SQL, Oracle and PostgreSQL. I write Python when a pipeline needs it.
4. I'm an AI developer who was a programmer first. AI writes a lot of my code. I own the design, the review, the tests, and production.
5. I live in Kelowna. Three days a week in the office works for me from day one.

---

## 3. Likely questions and what to say

**"Tell me about yourself."** Use section 2. Stop at about a minute and let them steer.

**"Why Minga?"** (Your written answer, in your own words.)
- My whole career is education, but always the back office. Minga works on what actually happens in a school day for kids and teachers.
- Being the only data engineer and deciding how AI-assisted data work gets reviewed is the kind of job I do my best work in.
- It's here in Kelowna.

**"Why are you leaving VIU?"**
- Keep it positive. I've done the work I set out to do there (the modernization reference, the CDW pipeline, the team handbook). I want to work somewhere the product itself serves students, and somewhere I can own a data platform outright.
- Don't mention money pressure.

**"What do you know about our stack? Have you used Snowflake / dbt / Airflow?"**
- Say it straight, the same way the cover letter does: "Not in production. My warehouse work is Oracle and PostgreSQL, and I haven't run dbt or a dedicated orchestrator."
- Then the bridge, briefly: dbt is SQL in version control, reviewed, tested, deployed through CI, which is already how I work. I picked up PostgreSQL with vector search and n8n recently and shipped real systems on both.
- Then the part that's harder to hire for: care with student data, owning a system alone, and writing things down so other people can run them.
- Only claim what's true. n8n and GitLab CI scheduling are **not** Airflow. Don't say they're equivalent.

**"You'd be the only data engineer. How do you feel about that?"**
- Comfortable. CDWTool is mine end to end: build, run, document, fix. I write runbooks for whoever operates it after me.
- You still want people around you. Mention working directly with the departments that own the data.

**"How do you handle a lot of requests from different teams?"** (RevOps, Finance, CX, Product intake queue.)
- A visible queue, clear priorities, and honest "not yet, here's why" answers.
- At TRU I trained staff to do their own reporting and tune their own SQL. Same instinct as teaching analysts to self-serve.

**"How do you use AI?"**
- Every day, in Claude Code. AI drafts, I design, review, test and own it.
- Concrete example: I built an MCP server that lets AI tools query VIU's Oracle databases with read and write separated and row limits enforced. Guardrails first.
- Their posting asks you to "set the standard for how data work gets reviewed when a model can write the first draft." Say you've been working on exactly that.
- Don't brag about speed, commit counts or parallel sessions.

**"Tell me about working with sensitive data."**
- CDW pipeline: student personal data. During hardening I removed committed secrets, moved it to a dedicated Ministry service account, added CSRF protection.
- Access control across VIU services: SSO/ADFS, SAML, privilege-class checks.
- Apps fetch database passwords from the institution's credential vault at runtime instead of storing them.
- If they ask about FERPA or PIPEDA by name: you haven't worked under those formally. Your experience is BC public-sector student data and CRA filings. Say that.

**"Tell me about a time something went wrong."** Pick one real story before the call. Good candidates:
- The n8n error handler: you didn't trust it until a deliberately rigged failure went through it, and that test found two ways alerts could silently get dropped.
- A Google credential that showed "connected" but was bound to the wrong account. You caught it by checking the identity through the API instead of trusting the badge.

**"What are your salary expectations?"**
- **You already put $140,000 on the application.** Madison will likely have that in front of her, so stay consistent with it.
- Posted range is $130,000 to $160,000 CAD, and their policy is to pay at or near the midpoint (about $145,000). Your $140K is just under that, so it's an easy number for them.
- Suggested answer: "I put $140,000 on my application and that still stands. It sits inside your range." Then stop talking.
- If they bring up the midpoint policy themselves, you can say "If your policy lands nearer the midpoint, I'd be happy with that too." Don't push it in a screening call.
- Don't go below $140K, and ask how benefits work before you agree to anything.

**"In office three days a week?"** Yes. You live in Kelowna.

**"When could you start?"**
- You'd give VIU proper notice. _Check your VIU notice requirement before the call so you can give a real number._
- If they ask about William Tucker Solutions: this role would be your focus. Be ready to say how the consulting fits (wound down, or small and outside work hours) and pick one answer before the call.

**"Do you have questions for us?"** See section 5. Always ask at least two.

---

## 4. Keep it accurate

- **Experience:** "12 years with student and institutional data" is honest. "5+ years as a data engineer" is not your title. If asked, say your work has been data-heavy software and pipelines, not a data-engineer job title.
- **CDW pipeline delivery:** your submitted resume says it delivers "over SFTP." That stopped 2026-04-16. Today CDWTool exports and zips the 14 tables, and the package is uploaded by hand to the Ministry's SharePoint drop. If asked, say "packaged for the Ministry's SharePoint drop." If they notice the difference: "we moved off SFTP in April."
- **Team size:** your VIU team is 18 now. The feature-branch / CI move was with the earlier six-person team.
- **Don't bring up:** RoomBooking, dogmap, the marine trade as a qualification.

---

## 5. Questions to ask Madison

Pick two or three.

1. What does the interview process look like after this call, and who would I meet?
2. Why is this role open now? Is it new, or has someone held it before?
3. The posting says the data stack "runs on good intentions today." What's the most painful part right now?
4. How does the data engineer work with the team doing the platform rebuild? Is that rebuild already under way?
5. Has the RTI Scheduler acquisition added data that has to be brought into the platform?
6. What does a good first 90 days look like for this person?
7. What do people who've been at Minga a while say they like most about working there?

---

## 6. Before the call

- [x] Fill in the date above. 
- [ ] Test the Google Meet link, camera and mic.
- [ ] Reread `Resume.md`, `cover_letter.md` and `why_minga.md` (that's what Madison has).
- [ ] Know your VIU notice period and your WTS answer.
- [ ] Pick your "something went wrong" story.
- [ ] Have a water and these notes beside you, not on the shared screen.
- [ ] Optional, for the technical round later: a small Snowflake trial and a dbt Core project, so you can talk about them from your own hands-on time.

## Sources

- https://minga.io/careers/

- https://minga.io/privacy/subprocessors
- https://minga.io/privacy/
- https://support.minga.io/en/articles/14832535-guide-to-minga-for-it-security-sso-and-rostering
- https://support.minga.io/en/articles/15001047-minga-system-architecture-hosting-security-and-redundancy

- https://minga.io/about
- https://www.riverwoodcapital.com/investment/minga/
- https://minga.io/blog/minga-acquires-rti-scheduler/
- https://www.castanet.net/news/Kelowna/626018/Kelowna-born-education-platform-adds-to-offerings-with-US-acquisition
- https://www.bctechnology.com/news/2019/1/25/Okanagan-College-Announces-Minga-CEO-Jason-Richards-as-new-Entrepreneur-in-Residence.cfm

## Study guides (for the technical round)

Local copies are in `interview/study/`. Published versions:

- Snowflake: https://claude.ai/artifact/7nrAJwp8UCbk8djSNKn2rW
- dbt: https://claude.ai/artifact/FSdz6ncB9Q3rTYCWj3ATnm
- Airflow: https://claude.ai/artifact/5q8FaEk2RbtxsDvb29wwk7
