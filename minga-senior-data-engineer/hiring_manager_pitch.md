# Hiring manager intro: how to sell it

*Prepared 2026-09-24 for William's intro with Minga's Senior Engineering Manager, Platform & SRE. Everything below is verified against the repos (see `PROFILE.md` §4.8). Nothing here overclaims; the "do not say" list at the bottom matters as much as the stories.*

---

## 1. The 60-second version (say this out loud, in your own words)

> I've spent twelve years on the systems that hold student data at BC universities. Right now I own three pipelines at VIU that carry student data to and from provincial and federal bodies: the daily exchange with StudentAid BC that releases loan funding, the student-level submission to the Ministry's data warehouse, and the CRA tuition certificate filing. I'm the only engineer on all three. They run unattended, they tell me when they break, and their output is tested to the byte.
>
> The part of your posting that made me apply is the review standard. I use AI tooling every day, and the thing I've learned is that the bar isn't "it ran," it's "it's proven." Last week I rewrote a 75-second query down to a third of a second, and it went to production only after I hashed every column of the old and new output and got the same answer.
>
> I don't have Snowflake or dbt on my resume. I have Oracle, Postgres, and a habit of learning platforms fast. I'll close that gap on my own time before day one, and I'd rather tell you that than pretend.

Hit the three beats: **student data ownership**, **the proof standard**, **honest about the gap**. Stop talking after the third beat and let them ask.

---

## 2. What they need, what you have

The posting, line by line, against evidence you can talk about for five minutes each.

| They wrote | You can say |
|---|---|
| "Own ingestion end to end ... bring proper orchestration to a stack that runs on good intentions" | The StudentAid BC import: scheduled daily, idempotent (never loads a file twice, backfills automatically), health endpoint, dead-man email, and a separate watchdog pipeline that probes production every morning. Three independent ways to learn it failed. |
| "A modelling layer with versioning, tests and review" | Every schema change ships as a versioned migration with a verify script and a rollback. The applicant checklist system alone has 46. Each database has a ledger of what was applied where and when. Output files are held to the byte by golden-file tests in CI. |
| "Access, retention and PII-handling standards ... we hold student-level data and we treat it that way" | Found and closed two production over-exposures this year (grants leaking DOB, address, and notes naming parents on 3,430 rows; a view showing 1,737 students where 571 was right). Scrubbed a real SIN from a repo. Built an audit table that records access to disability data without recording the student. SINs masked by default. |
| "Intake queue ... teach analysts to self-serve rather than wait on you" | Trained TRU staff to run their own institutional reporting and tune their own SQL. Team of 18 onboards from a handbook I wrote. Every system ships with a runbook for the next operator. |
| "Maps legacy data into [the new platform] as customers migrate" | Catalogued about 90 legacy apps for migration. Built a schema dependency map, fed by a Python scanner, that finds every reference to a schema object across the codebase down to file and line. Led the SFAS-to-SIMS cutover on the StudentAid feed while keeping the legacy engine alive on purpose. |
| "Know exactly why when [costs] aren't [proportional]" | On AscendAI the expensive step is AI extraction and embedding, so results are cached under a key built from the schema hash and corpus hash, token counts are stored per extraction, and ingest skips chunks already embedded. Be honest that Snowflake credit work is new to you and say how you'd start (query history, per-warehouse credit attribution, kill the top offenders). |
| "Set the standard for how data work gets reviewed when a model can write the first draft" | The hash-verification story. The 13 stranded confirmations story (retracted the first hypothesis). The MCP server with read/write separation and row limits. You already do this. |
| "Strong written communication ... say no kindly" | Docs vaults in every repo, `sql/APPLIED.md` ledgers, runbooks. Years of telling departments "not yet" and explaining why. |

---

## 3. Five stories to have ready

Tell each in under 90 seconds. Situation, what you did, what it proved.

**a. The stranded confirmations (StudentAid BC, September 2026).**
Thirteen loan confirmations in one batch never went out. Money for students. You wrote targeted production SQL, formed a theory (a collation bug on a MAX()), then disproved your own theory, and cross-checked over several days until you could say no funding was stuck. *What it proves:* you work an incident on financial data calmly, and you'd rather retract than be right.

**b. The hash-verified rewrite (T2202, September 2026).**
A review screen took 75 seconds. You rewrote six correlated EXISTS over unindexed tables into one IN over a UNION. Down to a third of a second. Before it touched production you hashed every column of the old and new output across 6,350 and 14,149 rows. Identical. *What it proves:* this is what "review standard for model-drafted SQL" looks like in practice.

**c. The grants that showed too much (T2202, September 2026).**
A downstream team needed a review list. The grants that made it work exposed dates of birth, home addresses, and free-text notes naming parents for 3,430 students. You replaced them with narrow projected views and revoked the raw grants in production. A week later you found the view lacked a predicate and showed 1,737 students instead of 571, and fixed that too. *What it proves:* you audit your own access design, twice.

**d. The silent failure (CDW, September 2026).**
A nightly refresh job lost 1.8 million rows and reported SUCCEEDED. Every failure that department ever had was silent. You built a 21-check monitoring page over Oracle space, invalid objects, scheduler jobs, and SSH, with append-only history and acknowledgements. *What it proves:* you don't trust green checkmarks. Say plainly that this is still on a feature branch.

**e. The Ministry changed the rules (CDW, April 2026).**
The Ministry moved intake from SFTP to SharePoint with no engineering input from you. You ripped out the SFTP service, redesigned delivery, and kept the submission history and duplicate protection intact. *What it proves:* upstream vendors change things; you adapt without breaking the audit trail. Maps directly to "harden or replace our current Stitch pipelines."

**f. The 395 wrong citations (AscendAI, 2026).**
Your feasibility tool cites bylaw text for every number it reports. You wrote a script that checks every citation in the generated rules against the ingested source text. On one jurisdiction it found that all 395 citations were wrong, because a table-of-contents parsing error had shifted every section. Nothing shipped until it was fixed. *What it proves:* you build the check that catches the model's confident nonsense, which is the exact job the posting describes.

**Backup story, if they ask about teams:** the move from editing on a network drive to feature branches, CI/CD, and automated tests, done with the earlier six-person team, and the handbook the current team of 18 onboards with.

---

## 4. The gap conversation

They will ask about Snowflake, dbt, and orchestration. Do not dodge, do not oversell.

**What to say:**
- "My warehouse experience is Oracle and PostgreSQL, not Snowflake. I haven't run dbt or Airflow in production."
- "What I do have is the discipline dbt formalizes: SQL in version control, verify and rollback scripts, tests that gate CI, and a written ledger of what's applied where. dbt would make that less manual, and I want that."
- "Since late 2025 I've picked up Postgres with vector search and the n8n platform and shipped working systems on both. I learn platforms by building on them."

**What to offer:**
- "Before a second conversation I'll have a Snowflake trial account with a dbt Core project against a public dataset, with tests and a CI run, so you can see how fast I move on new tooling." Then actually do it (see STATUS.md TODO). This turns the gap from a claim into a demo.

**Python:** "My Python is pipeline and tooling work: an ETL of map data into PostGIS, a static scanner over a legacy codebase, a generator that builds n8n workflows from code. It isn't years of Python-first data engineering. It's enough to be productive on day one and I'll get deeper fast."

**Stitch / Metabase:** "I haven't run either. Stitch I understand as managed EL; Metabase I'd treat like any BI tool with an admin surface: permissions, data source scoping, query cost."

---

## 5. Questions that make you sound like the person who'd own it

Pick three or four.

1. "What breaks most often today, and how do you find out?" (You'll hear whether they have the silent-failure problem. You have that story.)
2. "Who are the loudest consumers of the warehouse right now, and what do they wait on?" (Intake queue framing.)
3. "Is there a written definition of what student-level data can leave Snowflake, and to whom?" (Shows you'll write one if there isn't.)
4. "For the platform rebuild, has anyone mapped which legacy tables feed which reports yet?" (Your dependency-map story.)
5. "What does the Snowflake bill look like month to month, and does anyone know why it moves?"
6. "When a model writes SQL for an analyst today, what happens before it runs?" (Their answer tells you where the review bar is.)

---

## 6. Do not say

Overclaims that a reference check or a follow-up question would sink:

- Do not call the room booking system "in production." Do not mention it at all unless asked.
- Do not call the applicant checklist system, Atlas, or LaunchPad "in production." They are on the dev server.
- Do not claim COATS as built. It is a roadmap.
- Do not say "sole author" of the Facilities Information System modernization. A colleague contributed.
- Do not say the CDW pipeline "delivers over SFTP." The Ministry moved to SharePoint in April 2026 and the upload step is now a manual drop.
- Do not claim the monitoring page is live. It is on a feature branch.
- Do not claim Snowflake, dbt, Airflow, Stitch, Metabase, or FERPA experience.
- Do not call AscendAI "launched" or say it has paying customers. It is a six-user pro-bono pilot with billing in test mode.
- Do not describe any of this as "generated." You planned it, reviewed it, debugged it, and you own what runs.

---

## 7. Close

> "I'm in Kelowna, I can be in the office three days a week from the start, and I'm ready to give VIU proper notice. If it helps, I'll put together that Snowflake and dbt demo before we talk again."
