# Hiring manager intro: how to sell it

*Prepared 2026-09-24 for William's intro call with Minga's Senior Engineering Manager, Platform & SRE, who said he'll give William a shot if he can sell himself. Everything below is verified against the repos (see `PROFILE.md` §4.8 and §5.3) and was reviewed by a recruiter, a hiring-manager stand-in, a peer data engineer, and an editor. Nothing here overclaims; section 9 matters as much as the stories.*

---

## 1. The 60-second version (spoken, in your own words)

> I've spent twelve years on systems that hold student data at BC universities. Right now at VIU I own three pipelines that move student data to the province and the feds: StudentAid BC funding, the Ministry's warehouse submission, and the CRA tuition filing. I'm the only one who touches them. They run on their own, tell me when something's wrong, and get tested to the byte.
>
> Here's why I applied: the review standard in your posting. I use AI tools every day, and the bar can't be "it ran," it has to be "it's proven." This month I took a 75-second query down to a third of a second, and before it went live I hashed every column of the old and new output. They matched.
>
> I'll be straight with you: no Snowflake, no dbt. I know Oracle and Postgres, and I pick up new platforms fast. I'd rather tell you now than have you find out later.

Three beats: **student data ownership**, **the proof standard**, **honest about the gap**. Stop after the third beat and let him ask.

---

## 2. The two questions that decide it (answer them unprompted)

Every reviewer flagged the same thing: ten years at VIU plus a consultancy with big builds reads as either "why now?" or "moonlighting risk." Get ahead of it in the first five minutes.

**Why leave VIU, why now.** *(Fill in your real reason in your own words. The reviewers can't write this for you, and the manager will hear it if it's borrowed.)* The shape that works: what you've finished at VIU (the modernization playbook, three production pipelines, a team on CI/CD), what you can't get there (a warehouse built for analysts, a product company, one platform to own), and why Minga specifically (student data, Kelowna, the review-standard line in the posting).

**What happens to William Tucker Solutions.** Say it before he asks:
- WTS has no clients. It's a registered practice with infrastructure built ahead of demand.
- AscendAI is a pro-bono pilot for a land developer, six users, billing in test mode. It's not K-12, not a competitor, and it moves to weekends or pauses.
- VIU IP is clean. Everything at WTS was built on your own time and equipment, and VIU's collective agreement doesn't restrict outside work (see `PROFILE.md` and the IP-boundaries memory).
- One sentence to land it: "If I take this, Minga is the job. The consultancy is a hobby with a business licence."

---

## 3. What they need, what you have

The posting, line by line, against evidence you can talk about for five minutes each.

| They wrote | You can say |
|---|---|
| "Own ingestion end to end ... bring proper orchestration to a stack that runs on good intentions" | The StudentAid BC import: scheduled daily, idempotent at the file level (a file log keyed on file identity), backfills missed days automatically, first production run cleared a seven-day backlog with no duplicate loads. A health endpoint, a dead-man email, and a separate scheduled watchdog that probes production off the box. Three independent ways to learn it failed. |
| "A modelling layer with versioning, tests and review" | Every schema change ships as a versioned migration with a post-apply verification script and a rollback where destructive. The applicant checklist system alone has 46. Each environment has a ledger of what was applied when. Output files are held to the byte by golden-file tests in CI. Say plainly: "This is the discipline dbt formalizes. I haven't run dbt." |
| "Access, retention and PII-handling standards ... we hold student-level data and we treat it that way" | Found and closed two production over-exposures this year (grants leaking DOB, address, and notes naming parents on 3,430 rows; a view showing 1,737 students where 571 was right). Scrubbed a real SIN from a repo. Audit table that records access to disability data without recording the student. Registrar and Accessibility roles disjoint by design. SINs masked by default. Retention job with row-count floors on AscendAI (dry-run today). |
| "Intake queue ... teach analysts to self-serve rather than wait on you" | Trained TRU staff to run their own institutional reporting and tune their own SQL. Team of 18 onboards from a handbook you wrote. Every system ships with a runbook for the next operator. Be honest that your consumers so far were the CRA, the Ministry, and staff screens, not an analyst team. |
| "Maps legacy data into [the new platform] as customers migrate" | Static lineage map from Oracle schema objects to every code location that reads or writes them, across about 90 apps, fed by a Python scanner (one schema resolved to 7,152 references). Led the SFAS-to-SIMS cutover on the StudentAid feed while keeping the legacy PL/SQL engine alive on purpose. |
| "Know exactly why when [costs] aren't [proportional]" | On AscendAI the expensive step is AI extraction and embedding: results cached under a schema-hash plus corpus-hash key, token counts stored per extraction, ingest skips chunks already embedded, backoff on rate limits, per-user credit metering. Say: "I've attributed LLM spend per call. Snowflake credits I'll learn from ACCOUNT_USAGE and warehouse metering history." Don't stretch further. |
| "Set the standard for how data work gets reviewed when a model can write the first draft" | Section 5 below. You already do this; turn it into a process. |
| "Strong written communication ... say no kindly" | Docs vaults in every repo, `sql/APPLIED.md` ledgers, decision registers, runbooks. Years of telling departments "not yet" and explaining why. |

---

## 4. Seven stories to have ready

Under 90 seconds each. Situation, what you did, what it proved.

**a. The stranded confirmations (StudentAid BC, September 2026).**
Thirteen loan confirmations in one batch never went out. Money for students. You reconciled the confirmation queue against the outbound ledger with targeted production SQL, formed a theory (a collation bug on a MAX()), disproved your own theory, and cross-checked over several days until you could say no funding was stuck. Then you recorded it in the decision register. *What it proves:* you work an incident on financial data calmly, you'd rather retract than be right, and you write the record before the fix. *Close with:* "That reconciliation should have been a daily job. It's the first check I'd build at Minga."

**b. The hash-verified rewrite (T2202, September 2026).**
A review screen took 75 seconds because six correlated EXISTS subqueries forced a nested loop per row over unindexed tables. You rewrote them as one IN over a UNION so Oracle could hash-join. A third of a second. Before it touched production you hashed every column of the old and new output across 20,499 rows. Identical. *What it proves:* "The diff is the gate, not the timing." This is what a review standard for model-drafted SQL looks like when a baseline exists.

**c. The four defects nobody had seen yet (T2202, September 2026).**
A new extraction query for Accessibility Services reviewers. No old version to diff against. You reconciled aggregates, sampled rows back to source, and checked the join keys. Found part-time months inflated for 37 students (summing across program rows instead of counting distinct months), a MAX() on a status column misclassifying approved students, 118 malformed identifiers slipping through, and the wrong row key. Fixed before a reviewer saw a row. *What it proves:* this is how you review SQL when there's nothing to hash against, which is the harder and more common case.

**d. The grants that showed too much (T2202, September 2026).**
A downstream team needed a review list. The grants that made it work exposed dates of birth, home addresses, and free-text notes naming parents for 3,430 students. You replaced them with narrow projected views and revoked the raw grants in production. A week later you found the view lacked a predicate and showed 1,737 students instead of 571, and fixed that too. *What it proves:* you audit your own access design, twice.

**e. The silent failure (CDW, September 2026).**
A nightly refresh job lost 1.8 million rows and reported SUCCEEDED. Every failure that department ever had was silent. The job had no post-load assertion; a row-count floor against the previous run would have caught it in one line. You built a 21-check monitoring page over Oracle space, invalid objects, scheduler jobs, and SSH, with append-only history and acknowledgements. *What it proves:* you don't trust green checkmarks. This is the Stitch failure mode exactly: the vendor says success, the row count says otherwise. Say plainly that the page is still on a feature branch.

**f. The Ministry changed the rules (CDW, April 2026).**
The Ministry moved intake from SFTP to SharePoint with no engineering input from you. You removed the SFTP leg, redesigned delivery, and kept the submission history and duplicate protection intact. The upload is a manual drop today. *What it proves:* upstream vendors change things; you adapt without breaking the audit trail.

**g. The 395 wrong citations (AscendAI, 2026).**
Your feasibility tool cites bylaw text for every number it reports. You wrote a script that checks every citation in the generated rules against the ingested source text. On one jurisdiction it found that all 395 citations were wrong, because a table-of-contents parsing error had shifted every section. Nothing shipped until it was fixed. *What it proves:* you build the check that catches the model's confident nonsense.

**Backup, on ownership boundaries (the closest thing you have to a modelling standard):** the StudentAid integration owns four tables and reads the student system strictly by reference; the applicant checklist system made the same decision and wrote it down (decision D8). Never copy source data you don't own.

**Backup, on teams:** the move from editing on a network drive to feature branches, CI/CD, and automated tests, done with the earlier six-person team, and the handbook the current team of 18 onboards with.

---

## 5. The review standard, as a process

He wants a standard, not an anecdote. Say it as four steps and one boundary.

1. **Baseline before change.** Capture the current output (row counts, aggregates, a column hash) before anything is rewritten.
2. **Reconcile, don't eyeball.** Hash or row-count diff against the baseline. With no baseline: reconcile aggregates to source, check join fan-out, sample rows back to the system of record, hunt the MAX()-on-status class of bug.
3. **Read the plan.** Explain plan on anything that touches a large table; know why it's fast or slow.
4. **PR with tests, reviewed by a person.** CI runs the tests; a platform engineer reviews SQL PRs even when you're the only data engineer. The ledger records what was applied where.

**What a model doesn't touch unreviewed:** grants, PII views, retention and delete jobs, anything that leaves the warehouse.

---

## 6. Questions you will be asked (and what a strong answer sounds like)

1. **"The import dies halfway through a file at 06:00. What happens?"** Per-file status log; re-run resumes from the file log and skips what landed; the 08:03 watchdog catches a missed run; runbook says who does what. Add: "I'd want the same for every Stitch stream: last-success time and row count per stream, alert on both."
2. **"Week one in our Snowflake account. First three things you look at?"** Query and warehouse history in ACCOUNT_USAGE, auto-suspend and warehouse sizing, who holds ACCOUNTADMIN, whether student PII columns have masking policies. *(Read the Snowflake docs on these before the call. Know the names.)*
3. **"How do you structure a first dbt project over raw Stitch tables without blocking RevOps?"** Sources with freshness thresholds, staging views one-to-one with raw, marts under test, an analyst sandbox schema, PR review with CI. *(Read dbt's project-structure guide before the call. Know sources, ref(), tests, incremental models, and snapshots by name. "dbt formalizes what I do" is not an answer on its own.)*
4. **"Stitch says success and HubSpot deals is 30% short. Find it, fix it."** Row-count reconciliation against the source API, freshness alert on the stream, reset replication and backfill the window. Tell story e.
5. **"You're the only data engineer. Who reviews you?"** Section 5. Cite auditing your own view twice (story d).
6. **"PII standard for Snowflake in three sentences."** Classify columns. Mask by default with role-based unmask. Student-level rows reach Metabase only through approved marts, with retention enforced by a job that has row-count floors.
7. **"A model wrote 200 lines of SQL and there's no prior version to hash against. Review it."** Story c, then the no-baseline half of step 2.
8. **"An upstream changes shape without telling you."** Story f and the CRA 2026 schema change. Staging isolates raw from marts; snapshots preserve history.
9. **"Why leave a ten-year job, and what happens to your consultancy?"** Section 2.
10. **"Show me a postmortem you wrote."** The StudentAid decision register and the September prod-check scripts. "I write the record before the fix."

---

## 7. SRE vocabulary he'll listen for

Say these in his language, from your evidence:

- **On-call and postmortems:** decision register, prod-check scripts, the AscendAI incident where one Postgres statement timeout took down a shared serverless instance and you root-caused it with an isolated repro.
- **Freshness:** dead-man at 06:00, watchdog at 08:03, a cron flagged at 30 hours because the free scheduler drifts. "I set thresholds from observed behaviour, not guesses."
- **Backfills:** oldest-first, no duplicates, seven-day backlog on the first prod run.
- **Schema evolution:** 46 migrations with verify and rollback, the applied-state ledger, the CRA schema fix, the v1.3 confirmation format cutover.
- **Idempotency:** file-level skip on the import, content-hash dedup on embeddings, write-audit-publish activation on chunks. Name all three.
- **Secrets:** credential vault at runtime, encryption-key backup and restore, two commits scrubbing leaked secrets.
- **Cost:** hash-keyed cache and token telemetry on LLM spend. Snowflake credits: "I'll learn it from the metering history in week one."
- **Vendor pipelines:** "Vendors report green. I reconcile counts." Story e, plus the time a Google OAuth credential silently bound to the wrong account and you caught it by calling the profile API instead of trusting the badge.

---

## 8. The gap plan (do this, then say it)

The cover letter now promises a Snowflake trial running a dbt Core project before the second conversation. Build it, one weekend, so the promise is a link. What changes a skeptical manager's mind is the runbook and the reconciliation test, not the model count.

Contents:
- Sample data plus one Stitch-style raw load (a public dataset is fine).
- dbt sources with freshness thresholds; staging views; two or three marts under schema tests plus one singular reconciliation test (row count against source).
- One incremental model with a documented backfill run.
- One snapshot.
- A masking policy on a PII column with role-based unmask.
- A resource monitor and one query over warehouse metering history.
- Slim CI on pull requests.
- A one-page runbook: backfill, rotate a secret, what to do when a freshness test fails.

Then in the call: "I don't want to pretend a weekend project is production experience. It's so you can see how I move on new tooling, and what I reach for first."

---

## 9. Do not say

Overclaims that a reference check or a follow-up question would sink:

- Do not call the room booking system "in production." Do not mention it unless asked.
- Do not call the applicant checklist system, Atlas, or LaunchPad "in production." They are on the dev server.
- Do not claim COATS as built. It is a roadmap.
- Do not say "sole author" of the Facilities Information System modernization. A colleague contributed.
- Do not say the CDW pipeline "delivers over SFTP." The Ministry moved to SharePoint in April 2026; the upload is a manual drop today.
- Do not claim the monitoring page is live. It is on a feature branch.
- Do not say "I own the T2202 engine." You own the app and fixed the engine's XML. The 2,700-line PL/SQL package predates you.
- Do not say "twelve years of pipelines." Twelve years on student-data systems; the production pipelines you own are 2025 onward. Older data work is real (T4A SQL, TRU ETL jobs, institutional reporting) and you can name it.
- Do not say the n8n stack is hosted production. It runs on your workstation and outbound alerts are gated.
- Do not call AscendAI "launched," "a data platform," or say it has paying customers. It is a six-user pro-bono pilot with billing in test mode.
- Do not claim Snowflake, dbt, Airflow, Stitch, Metabase, or FERPA experience.
- Do not describe any of this as "generated." You planned it, reviewed it, debugged it, and you own what runs.
- Avoid internal acronyms out loud (SFAS, SIMS, IER12, CONR). Say "the province's old system," "the disbursement file," "the confirmation file."

---

## 10. Questions to ask him

Pick three or four.

1. "What breaks most often today, and how do you find out?"
2. "Who are the loudest consumers of the warehouse right now, and what do they wait on?"
3. "Is there a written definition of what student-level data can leave Snowflake, and to whom?"
4. "For the platform rebuild, has anyone mapped which legacy tables feed which reports yet?"
5. "What does the Snowflake bill look like month to month, and does anyone know why it moves?"
6. "When a model writes SQL for an analyst today, what happens before it runs?"

---

## 11. Close

> "I'm in Kelowna, I can be in the office three days a week from the start, and I'm ready to give VIU proper notice. Before we talk again I'll have that Snowflake and dbt project up so you can judge the ramp yourself."
