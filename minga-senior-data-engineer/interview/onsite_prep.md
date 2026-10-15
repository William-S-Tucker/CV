# Minga Round 2 Prep: In-Person Interview

- **When:** Thursday 2026-10-15, 1:00pm to 2:00pm Pacific (60 minutes). **Confirmed** by the Minga Talent Team.
- **Where:** Minga HQ, **460 Doyle Ave #604**, Kelowna, BC V1Y 0C2 (6th floor). **Ring the doorbell**; Madison or the hiring manager will come get you. Meeting room on the invite: "Suite 604-6-Engineering-Hemp".
- **With:** Paolo Aquino (Eng Manager; he's on the invite and is very likely the hiring manager who comes to the door) and Ted Wannop (Director, RevOps).
- **Point of contact:** Madison@minga.io. Note: the calendar invite went to **will@ascendai-tech.com**, not william@williamtucker.ca. Accept it from that inbox.
- **Dress:** "casual but professional." Something comfortable you feel confident in: a collared shirt or a good sweater, clean jeans or chinos.
- **Dogs:** dog-friendly office. Expect to be greeted by one.
- **Where this sits:** stage 2 of 5 on their careers page (hiring manager). Next would be a culture interview with teammates, maybe a practical exercise, then leadership.

---

## 0. What they said the hour covers

From the Minga Talent Team's confirmation email:
1. **Your background and experience.** Have the 60-second intro and the CDWTool story ready.
2. **Walking through the job description.** They'll go through the posting together, so know your answer to each line. See section 3b.
3. **Team culture** and **what life at Minga is like.** This is partly them selling to you. Listen, react, ask follow-ups.
4. **Your questions:** "Please come prepared to ask any questions you have. We love curiosity and conversation!" Bring a written list (section 7) and ask at least three or four. With their "grow with us" message, curiosity is part of what they're scoring.

**Superseded 2026-10-13 by Paolo's Technical Interview Brief** (`interview/prep/Senior Data Engineer – Technical Interview Brief.pdf`, dated 2026-10-09). The hour is a working session, not a conversation and not a quiz. See section 0b. The deep-dive answers in sections 4 and 5 are still useful backup, but the brief's five themes (section 0c) are what to rehearse.

---

## 0b. The Technical Interview Brief (read 2026-10-13)

What Paolo's brief says the session is:
1. **Architecture walkthrough.** They show a diagram of the current platform (Snowflake, Stitch, Metabase) and talk it through. "Ask as many questions as you like here." See section 0d for the list.
2. **Collaborative problem solving.** A handful of scenarios built on that architecture. "Each one is a conversation. We'll add detail as you ask for it."
3. **Your questions.** Time at the end. Section 7 still applies.

Rules of the room:
- No trick questions, no live coding test, no tool trivia, no need to study the product. "We'll give you the context in the room."
- Whiteboard or shared screen available. Sketch when it helps.
- AI tools are allowed "the way you would at work." The condition: "talk us through how you check what they give you."
- "It's fine to say 'I don't know, here's how I'd find out.' It's also fine to change your mind halfway through."
- What they score: how you ask questions, weigh tradeoffs and explain reasoning. "We care more about how you think than about a perfect answer."

**The one habit that wins this format:** ask before you answer. Every scenario is written so they reveal detail as you probe. On each one, ask three or four questions first, then propose, then name the tradeoff. The four questions that fit almost every scenario:
- Who uses this, and what decision do they make from it?
- How often does it run, and how much data?
- What happens when it fails, and who finds out first?
- What has broken before?

**What to drop from the study plan:** the SQL writing, SQL debugging and Python sections of the practice bank (B, C, L) and the Snowflake flashcards. Keep enough Snowflake to follow the diagram: warehouses, roles, masking and row access policies, resource monitors, Time Travel.

**Update 2026-10-14 (from the hiring manager):** Paolo and Ted join **remotely**. You sit in Minga's meeting room on a video call. You may bring your laptop.

**Laptop rules:**
- AI is for artifacts, not answers. When a scenario reaches a concrete thing (a test, a masking policy, a reconciliation query), say "let me draft that," type one line, read the result aloud, and say what you'd check before trusting it. Thirty seconds, once or twice in the hour. The brief's condition is "talk us through how you check what they give you," so the check is the point.
- Never type the scenario in and read an answer back. Eyes drop, voice changes, Ted notices.
- Use a fresh Claude Code session in this folder, not the coaching one. Pin a short instruction at the top: "I'm in a live interview. When I paste a thing, draft it, then list three ways I should check it. Keep answers under ten lines."
- If you share your screen: clean desktop, one terminal, one browser tab with their diagram. Close Slack, close the CV repo window with other companies' folders, close the coaching chat.
- Camera and mic: test in the room before 1:00. Ask Madison where the meeting room's webcam and mic are, or bring your own headset.

**The lineage cheat sheet (write it in the notebook margin):** source, entry, transport, destination, reader, failure, scale. When they say "a table," "a feed," "a new platform," "a dashboard," pick two or three of those and ask. Then every answer becomes one line: *what breaks, how I'd know, what I'd do*. Three to five lines, one sentence for the stakeholder's number, one tradeoff. If you hear yourself say "convert," "retire" or "migrate everything," you've collapsed the premise. If you've asked four questions and not said a risk out loud, they're looking at the clock.

---

## 0c. The five themes, with your evidence and the shape of a good answer

The example questions below are from the brief. They said the real ones are "in the same spirit, not the exact ones."

### Theme 1. Bringing engineering practice to analyst work
*Example: "You want to introduce a standard nobody asked for. How would you get people on board?"* Maps to: dbt or equivalent with versioning, tests and review that RevOps analysts build against "without slowing down."

**Your evidence:** you led the six-person move from editing on a network drive to local dev, feature branches and CI at VIU. Nobody asked for that either. The handbook your team of 18 onboards with. Training TRU staff to run their own reporting and tune their own SQL.

**Shape of the answer:**
1. Start with a pain they already feel (two dashboards that disagree, a change that broke a report, nobody knows which query is the real one). Tie the standard to that pain, not to best practice.
2. Pilot with one volunteer analyst on one dashboard people rely on. Make it work for them first.
3. Make the right way the easy way: a template model, a one-page how-to, CI that gives a clear pass or fail. Nobody is blocked on day one; the old way keeps working until the new way is faster.
4. Show the win in their words (the number did not change when the source did; the review caught a bad join).
5. Only then make it the default. The tradeoff to name: a standard adds friction up front, so you earn it with a win before you enforce it.

Ask first: Who writes SQL today, and where does it live? What broke last time a definition changed? (Ted will have a story. Let him tell it.)

### Theme 2. Data incidents and data quality
*Example: "Something you own breaks in production. How would you let people know, and what would you change afterwards?"* Maps to: own ingestion end to end, data quality, "what has broken before."

**Your evidence:** the n8n error handler you forced to fail on purpose and found two ways alerts could silently disappear. CDWTool's duplicate protection per reporting period and job history. The Google credential bound to the wrong account that showed "connected."

**Shape of the answer:**
1. *While it is still broken:* tell the people who make decisions from the data before they find out themselves. Short message: what is affected, since when, what not to trust, when the next update is. Mark the affected dashboards if the tool allows it.
2. *Fix:* stop the bad data spreading first (pause the load, or flag the rows), then repair. Keep notes as you go.
3. *Afterwards:* a short blameless write-up (what happened, why, what we changed), a test or alert that would have caught it earlier, and a check that the alert actually fires. "I don't trust an alert until I've watched it fire."
4. The tradeoff: over-alerting trains people to ignore alerts. Alert on what someone will act on.

Ask first: Who finds out today when a Stitch load fails? Has a wrong number ever reached a customer or the board? How long between a break and someone noticing?

### Theme 3. Migrating to a new data model
*Example: "You need to run two versions of a system side by side for a long time. What would you watch out for?"* Maps to: data lead for the ground-up rebuild, the tooling that maps legacy data as customers migrate, warehouse migration between schemas.

**Your evidence:** VIU modernization: about 90 legacy apps catalogued, a conversion guide, systems moved onto new platforms with their data and sign-on intact. The feature-branch migration (earlier, six-person team).

**Shape of the answer (side by side for a long time):**
1. One identity mapping that both systems honour (school, student, user, district IDs), owned in one place, and never reused.
2. Reporting that combines both: a shared conformed layer where old and new both land, so "active students" means the same thing on either side.
3. Daily reconciliation that compares counts and totals across old and new, with the differences explained or fixed, not tolerated.
4. Metric definitions that do not drift: the new platform's event model is defined before customers move, not after.
5. An explicit sunset criterion (what has to be true to turn the old one off) and an honest cost line for running both.
6. Things people forget: timezones, deleted records, backfills, and that the 90-day delete has to work on both.

Ask first: Is the rebuild under way and what is the new store? Do customers migrate all at once or school by school? Does anything have to be reported across both for a board or a customer?

### Theme 4. Access control and sensitive data
*Example: "AI assistants can query your company's data. What guardrails would you put in place?"* Maps to: access, retention and PII standards across Snowflake and Metabase; "set the standard for how data work gets reviewed when a model can write the first draft."

**Your evidence (bullseye):** your Oracle MCP server with reads and writes separated and row limits enforced. CDWTool: student personal data to the Ministry with secrets removed, a service account, privilege checks. SSO and privilege classes across VIU services; passwords pulled from a vault at runtime.

**Shape of the answer, in layers:**
1. The assistant gets its own least-privilege role, same as any other client. It sees de-identified marts, never raw student tables.
2. Masking and row access policies live in the warehouse, so they hold no matter which tool asks.
3. Read-only by default. Anything that writes goes through a reviewed pull request, not a chat.
4. Row and cost limits per query, and every query logged with who asked.
5. No student PII leaves the warehouse into a prompt. If a model needs an example, it gets synthetic or de-identified data (Paolo built anonymized test data at QHR; ask how).
6. Humans review what the model writes before it ships: tests pass, reconcile against the source, read every line.

Ask first: Which tools can hit Snowflake today, and with which roles? Who can see a student's name right now? How is the 90-day delete carried out in the warehouse?

### Theme 5. Cost and value
*Example: "How would you decide whether a tool or service is worth what it costs?"* Maps to: keep Snowflake and pipeline costs proportional to usage, "know exactly why when they aren't"; harden or replace Stitch.

**Your evidence:** choosing n8n over Zapier on purpose and running it yourself; wiring HubSpot and seven other services read-only with least-privilege tokens; the "inventory every connector before replacing Stitch" approach.

**A framework you can say out loud:**
1. What does it replace, and what does that cost today in hours, in risk, or in things that do not get done?
2. Who saves the time, and what do they do with it? An hour of an analyst's week is worth more than an hour of a cron job's.
3. What risk does it remove (a load nobody would notice failing, a password shared in Slack)?
4. What is the exit cost? Prefer tools you can leave: open formats, data in your own warehouse, no lock-in on the modelling layer.
5. Trial with a pass criterion written down before you start, and a review date. If it does not clear the bar, it goes.
6. For Snowflake specifically: cost by warehouse and by tool, auto-suspend, resource monitors, and the question "which query or dashboard is this spend buying?"

Ask first: What does the stack cost per month today, roughly, and who sees that number? Which Stitch connectors would nobody miss?

---

## 0d. Questions for the architecture walkthrough

Bring this list written down. They said to ask as many as you like, and asking is scored.

**Ingestion (Stitch):**
- Which sources flow through Stitch today (MongoDB Atlas, HubSpot, PostHog, Intercom, rostering)? Anything loaded another way?
- How often does each connector run? Full refresh or incremental?
- How do you find out when a load fails or runs late? Who gets told?
- What does Stitch do with hard deletes from Mongo and schema changes in the documents?

**Warehouse (Snowflake):**
- How many warehouses, and what runs on each? Who looks at the spend?
- What roles exist, and which tools connect with which role?
- Where does student-level data land, and who can see it unmasked?
- Which region is the account in? How is the "Canadian data stays in Canada" promise kept?
- How is the 90-day delete after a contract ends carried out in the warehouse and in Time Travel or backups?

**Reporting (Metabase):**
- Which role does Metabase connect with? Can it see raw tables?
- Roughly how many dashboards exist, and which five actually get used?
- Who writes the SQL behind them today, and where does it live?
- Have public links or sharing ever been an issue?

**Overall:**
- What has broken most often, and what did it cost when it did?
- If you could change one thing about this diagram tomorrow, what would it be?

Remember: Ted most likely built this. Ask how it grew; do not say what is wrong with it. "You got a warehouse and reporting in place fast. My job is to make it hold up."

---

## 0e. Two-day plan (Tue 2026-10-13 to Thu 2026-10-15)

- **Tuesday evening:** read sections 0b to 0d. Write one real story for theme 1 (the local-dev migration) and one for theme 2 (the forced-failure test) in your own words, two minutes each.
- **Wednesday:** say the five example questions out loud, questions first, then the answer. Say the theme 5 framework once without notes. Read the diagram question list twice. Skip SQL and Python drills.
- **Thursday morning:** reread the job description once (the brief says each theme maps to something you'd own). Rehearse "I don't know, here's how I'd find out" on one scenario so it comes out naturally. Pick which one question you will change your mind on if they push back; that is allowed and they said so.

---

## 1. Who you're meeting (from their LinkedIn, 2026-10-07)

### Paolo Aquino, Senior Engineering Manager (likely your boss)
- **At Minga since Oct 2025.** Title matches the posting's "Senior Engineering Manager, Platform & SRE," so he's almost certainly who you'd report to. You can confirm gently: "Would I be reporting to you?"
- **Background:** about 20 years. Started in data at Texas Instruments and UTAC (yield monitoring, automated data reporting in Java/Perl). Then an email-security analytics company (query-optimized databases, statistical reporting). Then public sector: Manitoba Liquor & Lotteries, Workers Compensation Board of Manitoba. Then **7.5 years at QHR Technologies in Kelowna** (health software): architect, then manager of the architecture, SRE and developer platform teams. Contract at Metalab in 2025 (Retool, Auth0, Stripe, **Segment + Mixpanel event pipelines**, a 15x speed-up on a job processing millions of records).
- **What he values (his own words):** "Spreading Shared Understanding and Shaping Strategy." Architecture, balancing business needs against technical constraints, platform and SRE thinking, continuous delivery.
- **Connections to you:**
  - *Public sector.* He did WCB Manitoba and Manitoba Liquor & Lotteries; you did TRU and VIU. You'll both know slow approvals, legacy systems and compliance.
  - *Anonymized test data.* At QHR he built production-like test data from anonymized production data. That's the PII mindset the role needs. Good thing to discuss: "How do you give analysts and developers realistic data without exposing student records?"
  - *Event pipelines.* His Segment/Mixpanel work maps to "analytics event model for the new platform." Expect him to care about event design.
  - *Shared understanding.* Your runbooks, handbook, and conversion guide are exactly that. Lead with documentation.
- **Earlier hire, worth asking about:** in May 2026 he posted a **Lead Platform & Data Infrastructure Engineer** (Terraform, runtime platform, *and* Stitch/Snowflake pipelines). Ask: "Earlier this year you were hiring a Lead Platform & Data Infrastructure Engineer. Is that role filled, and how would data work split between that person and me?" Shows you did your homework and clarifies who owns what.
- **Why he says he stays:** trust between teammates, "genuine runway when you perform," a team that celebrates its people (offsite in Mexico this year), a **profitable** business.
- He'll probe: architecture judgement, reliability (what happens when a pipeline fails at 2am), how you'd sequence the work, how you explain trade-offs.

### Ted Wannop, Director, Revenue Operations & Data
- **His title includes "& Data."** His role: "making revenue more predictable... + **building the data platform** that brings intelligence to our teams and customers." Data is in his remit, so he may be the business owner of your work, with Paolo as your engineering manager.
- **He probably built the current stack.** He was Minga's Senior Data Analyst from Sep 2025 to Jun 2026 and "helped drive the build-out of our analytics stack." Snowflake + Stitch + Metabase is very likely his work.
  - **So never trash the current stack.** The posting says it "runs on good intentions"; let *them* say that. You say: "You got a working warehouse and reporting in place fast. My job is to make it hold up as you scale: tests, orchestration, access control."
- **Background:** economics/stats at SFU (TA in econometrics and statistics). Interior Health (Emergency Department decision support for executives), Disney (Sr. Analyst, operations reporting), **Microsoft for 5.5 years** (Gaming Safety: dashboards, pipelines, "always with a focus on usability and decision-making").
- **What that means:**
  - He's analytical and knows SQL and stats. Don't oversimplify, and don't bluff. He'll notice.
  - He has handled sensitive data before (hospital ED data, safety data at Microsoft). Your student-data care will land.
  - He cares about **usability and decisions**, not tech for its own sake. Tie everything back to "your team gets numbers they trust faster."
  - Kelowna-based his whole career, and he reposted the Senior Data Engineer job. He wants this hire.
- **Connections to you:** public-sector data (Interior Health / VIU); you both build for people who make decisions from the numbers.
- He'll probe: how you'd work with his analysts, intake and priorities, metric consistency, self-serve, HubSpot data, how fast he'll see value.

### What their posts tell you about the role
- Ted's repost says "**our first dedicated Data Engineer**," "love solving messy data problems," and lists **Python** alongside SQL. Expect a Python question. Be honest: pipeline and tooling scripts (like the n8n workflow generator), not years of Python-first data engineering.
- "**Profitable business**" (Paolo). Combined with the $65M raise, they're investing, not surviving.
- The room is your **boss + your main customer**. Show both that you'll work well across that line: Paolo sets engineering standards, Ted sets business priorities, and you keep both informed.

### Light touch
Mentioning one thing from their background is fine ("I saw you were at QHR; how did you handle test data there?"). Reciting their career back to them is not.

---

## 2. Before Thursday: light reading, no install needed

**What Madison said in the screening call (2026-10-06):** you were upfront about not knowing Snowflake, and she said they're fine with it. They had trouble in the past when they hired for an exact tool match, those hires didn't work out, and they want someone who will **grow with them**.

What that means for Thursday:
- **The tool gap isn't the main risk anymore.** They've already accepted it. Don't spend the interview apologizing for it. Name it once if asked, then move on.
- **What they're really testing is: will this person learn, stay, and fit?** Show curiosity, a clear learning plan, and that you want to be there for the long run (rebuild, growth, Kelowna).
- **Still learn enough to have a real conversation.** You should understand their stack well enough to ask good questions and follow Paolo and Ted. Reading is enough for that.

**Reading plan (about 1.5 hours total, spread over a few days):**
1. **Snowflake Field Guide** (study guide 1): https://claude.ai/artifact/7nrAJwp8UCbk8djSNKn2rW. Read in this order: "Where it sits at Minga", "Oracle to Snowflake", "Warehouses and cost", "Loading and JSON", "Access and PII", then the interview answers and flashcards. Skip "Try it yourself".
2. **dbt Field Guide** (study guide 2): https://claude.ai/artifact/FSdz6ncB9Q3rTYCWj3ATnm. Read "What a model is", "Staging, intermediate, marts", "Tests and freshness", "The review workflow". This is what Ted's analysts would build on.
3. **Python Brush-Up** (study guide 4): https://claude.ai/artifact/1vwgcsgHuSLpB9pXTXYvwQ. Skim; do two or three of the practice exercises.
4. Airflow (study guide 3) is optional. Know what a DAG is and what "idempotent" means.

Use the tutor chat on each guide to quiz yourself. That's the best rehearsal before Thursday.

**Optional, if you want video:** Snowflake's free "Hands-On Essentials" workshops at learn.snowflake.com (short videos plus labs; the first is the Data Warehousing Workshop). Watching the first few videos is plenty. The labs need a trial account, so skip them for now.

**How to answer "Have you used Snowflake?" now:** "No, and I told Madison that upfront. My warehouse work is Oracle and PostgreSQL. I've been reading up on how Snowflake handles compute, cost and access, and the concepts map well. The parts that take longer to learn, care with student data and owning a system alone, I already have." Then turn it to them: "What would you want me to learn first?"

---

## 3. What you know about their stack (say it like you did your homework)

- **App:** Angular/TypeScript, Capacitor mobile apps, Node/TypeScript services. **MongoDB Atlas** is the main database.
- **Data:** Stitch (ingestion) → Snowflake (warehouse) → Metabase (reporting). No modelling layer, no orchestration.
- **Other data sources:** HubSpot (CRM), PostHog and UserPilot (product analytics), Intercom (support), plus rostering from about 50 different school systems through OneRoster, SFTP and Ednition.
- **Automation:** n8n. You run your own n8n stack (internal, on your workstation; not hosted production).
- **Rules:** FERPA, COPPA, US state student-privacy laws; PIPEDA and BC PIPA for Canadian districts, with Canadian data kept in Canada. Delete or de-identify within 90 days of a contract ending.

**One good observation to offer:** "Most of your product data is MongoDB documents, so a lot of the modelling work is flattening nested JSON into tables analysts can trust. And the 90-day delete rule has to reach the warehouse and any backups, not just the app."

---

## 3b. Walking through the job description

They said they'll walk through the posting with you. One honest line per item:

| The posting says | What you say |
|:--|:--|
| Own ingestion end to end; harden or replace Stitch; bring proper orchestration | "First I'd inventory every Stitch connector: what it pulls, how it fails, what it costs, who uses it. Keep what works, fix or replace what doesn't. I haven't run an orchestrator in production; I've done the same concerns (scheduling, retries, tested alerts) in my own n8n stack." |
| Introduce a modelling layer (dbt) with versioning, tests and review for RevOps analysts | "This is how I already work: SQL in git, reviewed, tested, deployed through CI. I'd start with the five dashboards people rely on most." (Look at Ted.) |
| Access, retention and PII standards across Snowflake and Metabase | Your strongest line. CDWTool: student personal data to the Ministry, secrets removed, Ministry service account, privilege checks. Plus SSO/SAML and the credential vault at VIU. |
| A visible intake queue for RevOps, Finance, CX, Product; teach analysts to self-serve | "One visible queue, priorities agreed with the leads, honest 'not yet, here's why.' At TRU I trained staff to run their own reporting and tune their own SQL." |
| Partner with product squads on the event model and on mapping legacy data as customers migrate | VIU modernization: about 90 legacy apps catalogued, the conversion guide, systems moved with data and sign-on intact. Paolo did event pipelines (Segment/Mixpanel); ask how they're thinking about events. |
| Keep Snowflake costs proportional to usage | "Separate warehouses per workload, short auto-suspend, resource monitors, and a regular look at metering history. I'm still learning Snowflake, but the cost model is clear." |
| Use AI daily; set the standard for reviewing model-written data work | Your home turf. Model drafts, you review every line, tests have to pass, reconcile against the source. Your Oracle MCP server with read/write separation and row limits. |
| 5+ years of production data pipelines | "Twelve years of data-heavy work at TRU and VIU: institutional reporting, ETL, the Ministry submission pipeline, CRA filings. Not a data-engineer title, but that's the work." |
| Cloud warehouse (Snowflake) + dbt | Already discussed with Madison. Name it once, then: "What would you want me to learn first?" |
| SaaS or high-growth; first or only data engineer | Not SaaS; higher ed. But sole owner of CDWTool and other production systems, and you run your own consulting practice. |
| Strong SQL and Python; one orchestration tool | SQL: deep (Oracle, PostgreSQL). Python: pipelines and tooling (the n8n workflow generator). Orchestration: no, see above. |
| Sensitive or regulated data | Yes: BC student data and CRA filings. Not FERPA/PIPEDA formally; say so if asked. |
| Written communication: docs, runbooks, saying no kindly | Developer handbook your team of 18 onboards with, CDWTool runbooks, the n8n RUNBOOK written "for someone who is not the person who built it." |
| Nice to have: HubSpot, Metabase admin, warehouse migration | HubSpot: yes, through the API (read-only, in your n8n dashboard). Metabase: no. Migration: platform migrations at VIU, not a warehouse migration. |
| Okanagan, in office 3x/week | You live in Kelowna. Mon/Tue/Thu works. |

---

## 4. Likely questions from Paolo (with answer outlines)

**"Walk me through a pipeline you own."** CDWTool:
- What it does: 14 student-level tables from Oracle, exported with Data Pump, compressed, delivered to the Ministry, archived.
- Safety: duplicate protection per reporting period, job history, and SSO with privilege checks.
- Hardening: removed committed secrets, moved to a Ministry service account, added CSRF protection.
- Delivery: describe it as it works *today*. PROFILE notes a move from SFTP to SharePoint in April 2026.

**"You haven't used Snowflake/dbt/Airflow. Why should we bet on you?"** (They've said they're OK with this. If it comes up, keep it short.)
1. Name the gap plainly, once.
2. Learning track record: PostgreSQL vector search and n8n in the past year, working systems on both.
3. The bridge: dbt is SQL in git, reviewed, tested and deployed through CI, which is already how you work.
4. The hard-to-hire parts: twelve years with student data, owning systems alone, writing runbooks.
5. The "grow with us" part: you live here, you want to stay, and you'd like to grow the data function as Minga grows.

**"How would you approach Stitch?"** Don't rip it out on day one.
- Inventory every connector first: what it pulls, how often it fails, what it costs, who uses the result.
- Keep what works, and replace what's flaky or expensive.
- Options you've read about are Fivetran, Airbyte, or custom loads for MongoDB.
- Say clearly that you'd decide after looking at their actual failures.

**"Orchestration: what would you pick?"**
- Honest: "I haven't run one in production."
- Options: Airflow is the standard, Dagster is newer and built around data assets, dbt Cloud's scheduler is the simplest. For a team with one data engineer, simpler is better.
- What you've done that's related: scheduling, retries, error alerts and a forced-failure test in n8n. It's the same set of concerns, but it's not an orchestrator.

**"How do you keep Snowflake costs under control?"** (Learn these before Thursday.)
- Auto-suspend on warehouses, right-size them, and set resource monitors with alerts.
- Look at query history to find the expensive queries.
- Use incremental models instead of full rebuilds.
- "Know exactly why" costs rise means a cost dashboard broken down by warehouse and by user or tool.

**"How would you handle PII and access?"**
- Roles by job: analysts see de-identified marts, and only a few roles see raw student data.
- Use masking policies and row access policies.
- Lock down Metabase to match the warehouse.
- Write retention rules that honour the 90-day delete.
- From your own work: least privilege, service accounts, passwords pulled from a vault at runtime, privilege-class checks.

**"How should AI-written data work be reviewed?"** (The posting asks you to set this standard.)
- Every model goes in git through a pull request, with tests that have to pass.
- A person reads every SQL change. The model drafts; it doesn't approve.
- Check results against the source: row counts and totals before and after.
- AI tools don't get open access to raw student data. Your Oracle MCP server is the example: reads and writes separated, row limits enforced.

**"What would your first 90 days look like?"** Have this ready. It's very likely.
- **Days 1 to 30, listen and take inventory:**
  - Meet RevOps, Finance, CX and Product.
  - List every Stitch pipeline, every Metabase dashboard that's actually used, Snowflake spend by warehouse, and who can see student data.
  - Start a visible request queue.
  - Quick wins: resource monitors and auto-suspend, and tighten PII access.
- **Days 31 to 60, build the base:**
  - A dbt project in git with CI.
  - Move the five most-used RevOps metrics into tested, documented models.
  - Choose orchestration.
- **Days 61 to 90:**
  - A written access and retention standard, enforced.
  - Train analysts to build on dbt themselves.
  - Start the event model for the new platform with the product squads.
- Close with: "I'd adjust all of this after the first month of listening."

---

## 5. Likely questions from Ted

**"How will you handle requests from four teams at once?"**
- One visible queue that everyone can see.
- Clear priorities agreed with the team leads, not decided by whoever asks loudest.
- An honest timeline on every request.
- "Not yet, and here's why" beats silence.

**"Our analysts need to move fast. How do you stop being a bottleneck?"**
- Give them tested, documented building blocks in dbt so they can build their own reports.
- Teach them, the way you trained TRU staff on reporting and SQL tuning.
- Write things down so they don't have to ask you.

**"Two dashboards show different revenue numbers. What do you do?"**
- Trace both back to the source.
- Agree one definition with Ted and Finance.
- Put that definition in a single tested model, and point both dashboards at it.
- Document it so the argument doesn't come back.

**"Have you worked with HubSpot data?"**
- Yes, through the API: read-only contacts in your n8n ops dashboard, including fixing a missing-permissions error.
- Not as a full warehouse source. Say that part too.

**"Tell me about working with non-technical people."**
- Years with the departments that own VIU's data.
- Training at TRU.
- Runbooks written for someone who isn't you.

Learn a few RevOps words so you can follow along: ARR (annual recurring revenue), churn, net revenue retention, pipeline, renewals, bookings vs. revenue.

---

## 6. Stories to have ready

1. **CDWTool:** sensitive data handled carefully from start to finish.
2. **n8n error handler forced-failure test:** "I don't trust an alert until I've watched it fire." Found two ways alerts could silently disappear.
3. **Google credential bound to the wrong account:** check identity with a real API call instead of trusting the green "connected" badge.
4. **Legacy modernization at VIU:** about 90 apps catalogued, a conversion guide, systems moved with their data and sign-on intact. This maps to their rebuild and legacy-data migration.
5. **Named the gap in your cover letter:** their Integrity value.

---

## 7. Questions to ask

**Paolo:**
- Is the platform rebuild under way? What will the new data store be, and is the event model already designed?
- Where does Stitch break today, and how do you find out when it does?
- Who reviews data changes when there's only one data engineer?
- Would I be reporting to you, or to the Senior Engineering Manager for Platform & SRE?

**Ted:**
- What number do you and Finance argue about most?
- Where do your analysts lose the most time today?
- What would make you trust a dashboard without double-checking it?
- What would a great first three months from this hire look like for your team?

---

## 8. Logistics checklist

- [x] Reply to Madison and confirm (Minga sent the confirmation and invite)
- [ ] Accept the calendar invite (sent to will@ascendai-tech.com)
- [ ] Clear Thursday afternoon with VIU
- [x] LinkedIn lookups: Paolo, Ted (section 1)
- [ ] Reading plan in section 2 (no install needed; the brief lowers this to "enough to follow the diagram")
- [ ] Two-day plan in section 0e; diagram question list (section 0d) written in the notebook
- [ ] Reread Resume, cover letter, why_minga (they'll have them)
- [ ] Bring 3 printed copies of your resume, a notebook, and a pen
- [ ] Laptop charged, fresh Claude Code session open in this folder, screen clean (section 0b laptop rules); headset in the bag
- [ ] Lineage cheat sheet written in the notebook margin
- [ ] Arrive 10 minutes early: 460 Doyle Ave #604, ring the doorbell. Check parking downtown
- [ ] Casual-but-professional outfit picked
- [ ] Questions list printed or in your notebook (section 7)
- [x] Rename the branch `apply/` → `interview/` (repo convention; done 2026-10-13)
