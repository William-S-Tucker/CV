# Minga Mock Exam: Answer Key

Model answers for `questions.md`. Each answer has:
- **Strong answer:** what a good answer covers. In the live exam, scoring is out of 10 against this list.
- **Red flags:** things that would cost you points in the room.
- **Study:** where to read up. "Guide" means your study guides (Snowflake, dbt, Airflow, Python Brush-Up, all in the Minga Interview Binder). "Docs" means the official documentation for that tool; search the topic name.

You don't need to say everything here. Interviewers listen for the two or three points that show judgement. Lead with those.

The schema is the made-up practice schema from the question bank. Timestamps are UTC.

---

## A. Background and walkthrough

### A1. A pipeline you built and own

**Strong answer:** use CDWTool, in order: source → transport → destination → controls → failure modes → how you'd know.
- **Source:** 14 student-level tables in Oracle, including student personal data.
- **Transport:** Oracle Data Pump export, compressed, delivered to the Ministry (describe current delivery accurately; it was moving from SFTP to SharePoint in 2026), archived.
- **Controls:** duplicate protection per reporting period, job history, SSO and privilege checks, a dedicated Ministry service account, secrets out of code.
- **What can go wrong:** an export fails partway, the wrong period gets sent twice, credentials expire, the file is incomplete, someone without the right privilege runs it.
- **How you'd know:** job history and status, duplicate check, row counts, and the Ministry's acceptance.
- End with what you'd improve: an automated count check against the source, or an alert on failure.

**Red flags:** describing it only as "a .NET app." Not mentioning failure modes. Overstating scale.

**Study:** your own CDWTool docs. Practice saying it in 90 seconds.

### A2. First 30 days

**Strong answer:** listen, map, protect, and deliver one visible thing.
- Get set up, and ask the rules for AI tools and student data before using either.
- Meet RevOps, Finance, CX and Product. Ask what they rely on and what they don't trust.
- Inventory: every Stitch connector, every Metabase dashboard that's actually used, Snowflake spend by warehouse, who can see student data.
- Write it down in a shared docs repo (Minga's, not personal; no secrets).
- Quick, safe wins: resource monitors and auto-suspend, and tighten obviously over-broad access.
- Start the visible request queue.
- Deliverable at day 30: a readable map of the platform, a ranked risk list, and the queue running.

**Red flags:** a plan that's all tooling and no people. Rebuilding things in week one. A personal repo holding credentials.

**Study:** onsite prep section 4 (90-day plan).

### A3. A problem nobody else noticed

**Strong answer:** STAR format (situation, task, action, result) with a real example.
- **Best fit:** the n8n error handler. It looked wired up, but your forced-failure test showed alerts were silently dropped in two cases (error workflows don't fire on manual runs; an inactive error workflow drops alerts). You documented both in the runbook.
- **Alternative:** the Google credential bound to the wrong account, caught by checking identity through the API instead of trusting the "connected" badge.
- Or CDWTool hardening: finding committed secrets and fixing them.
- Close with the lesson: "I don't trust an alert until I've watched it fire."

**Red flags:** blaming someone else. No concrete result.

### A4. What to learn first, and how you learn

**Strong answer:**
- Ask them what matters most. Then offer your guess: how data flows from MongoDB through Stitch into Snowflake, and which models and dashboards RevOps depends on.
- **How you learn:** read the docs, build something small, document as you go, and ask the person who built it (Ted).
- **Evidence:** PostgreSQL vector search and n8n in the past year, both shipped.

**Red flags:** a vague "I'm a fast learner" without evidence.

---

## B. SQL you write

### B1. Latest pass per student

**Strong answer:**
```sql
-- Way 1: window function + QUALIFY (Snowflake)
SELECT *
FROM hall_passes
QUALIFY ROW_NUMBER() OVER (PARTITION BY student_id
                           ORDER BY created_at DESC, pass_id DESC) = 1;

-- Way 2: works everywhere
SELECT h.*
FROM hall_passes h
JOIN (SELECT student_id, MAX(created_at) AS max_created
      FROM hall_passes GROUP BY student_id) m
  ON m.student_id = h.student_id AND m.max_created = h.created_at;
```
- **Why the tiebreaker:** two passes with the same timestamp make `ROW_NUMBER` arbitrary. Adding `pass_id` makes it deterministic.
- Way 2 returns **both rows on a tie**. Mention it.
- `QUALIFY` filters on window functions without a subquery. Oracle doesn't have it (you'd wrap in a subquery), but Snowflake does.

**Red flags:** using `GROUP BY student_id` and selecting other columns. Forgetting ties.

**Study:** Docs: Snowflake `QUALIFY`, `ROW_NUMBER`. Guide: dbt (dedupe in staging).

### B2. Passes per school per local day

**Strong answer:**
```sql
WITH local_passes AS (
  SELECT h.school_id,
         CONVERT_TIMEZONE('UTC', s.timezone, h.created_at)::DATE AS local_day
  FROM hall_passes h
  JOIN schools s ON s.school_id = h.school_id
  WHERE h.created_at >= DATEADD(day, -9, CURRENT_TIMESTAMP())   -- pad for time zones
)
SELECT school_id, local_day, COUNT(*) AS passes
FROM local_passes
WHERE local_day >= DATEADD(day, -7, CURRENT_DATE)
GROUP BY school_id, local_day
ORDER BY school_id, local_day;
```
- Convert to the **school's** time zone *before* taking the date. A pass at 7:30pm Pacific is already the next day in UTC.
- **Pad the UTC filter**, then filter on the local date.
- **Bonus points:**
  - Days with zero passes won't appear. Use a date spine if the dashboard needs zeros.
  - "Last 7 days" relative to whose today? Say it.

**Red flags:** `created_at::DATE` with no time-zone conversion.

**Study:** Docs: Snowflake `CONVERT_TIMEZONE`, `TIMESTAMP_NTZ` vs `TIMESTAMP_TZ`. Guide: Python (dates and time zones).

### B3. 3+ tardies in any 7-day window

**Strong answer:**
```sql
SELECT a.student_id, a.tardy_date AS window_end, COUNT(*) AS tardies_in_window
FROM tardies a
JOIN tardies b
  ON b.student_id = a.student_id
 AND b.tardy_date BETWEEN DATEADD(day, -6, a.tardy_date) AND a.tardy_date
GROUP BY a.student_id, a.tardy_date
HAVING COUNT(*) >= 3;
```
- A self-join counts each student's tardies in the 7 days ending on each tardy date.
- Return `DISTINCT student_id` if they only want the list of students.
- **Alternative:** a window function with a date-range frame. Snowflake supports interval-based `RANGE` frames, but check the docs before relying on it.
- **Questions to ask:** "7-day window" means calendar days or school days? Do two tardies on the same day count twice?

**Red flags:** `DATE_TRUNC('week')` buckets. That misses a run of tardies that crosses a week boundary. Say why if you mention it.

**Study:** Docs: Snowflake window frames. Practice self-joins.

### B4. Active schools with no passes in 14 days

**Strong answer:**
```sql
SELECT s.school_id, s.name
FROM schools s
WHERE s.is_active
  AND NOT EXISTS (
    SELECT 1 FROM hall_passes h
    WHERE h.school_id = s.school_id
      AND h.created_at >= DATEADD(day, -14, CURRENT_TIMESTAMP())
  );
```
- `NOT EXISTS` is safe with nulls (compare C1).
- **Context points:**
  - Summer break and holidays make "no passes" normal. Check the school calendar before flagging churn.
  - A school might use other features, not passes.
  - Ask Ted what "inactive" should mean.

**Red flags:** `NOT IN` against a column that could be null.

### B5. Per-district rollup without double counting

**Strong answer:** aggregate each table to the district level **separately**, then join.
```sql
WITH st AS (
  SELECT sc.district_id, COUNT(*) AS active_students
  FROM students s JOIN schools sc ON sc.school_id = s.school_id
  WHERE s.is_active
  GROUP BY sc.district_id
),
sch AS (
  SELECT district_id, COUNT(*) AS schools
  FROM schools GROUP BY district_id
),
hp AS (
  SELECT sc.district_id, COUNT(*) AS passes_30d
  FROM hall_passes h JOIN schools sc ON sc.school_id = h.school_id
  WHERE h.created_at >= DATEADD(day, -30, CURRENT_TIMESTAMP())
  GROUP BY sc.district_id
)
SELECT d.district_id, d.name,
       COALESCE(st.active_students, 0) AS active_students,
       COALESCE(sch.schools, 0)        AS schools,
       COALESCE(hp.passes_30d, 0)      AS passes_30d,
       hp.passes_30d / NULLIF(st.active_students, 0) AS passes_per_student
FROM districts d
LEFT JOIN st  ON st.district_id  = d.district_id
LEFT JOIN sch ON sch.district_id = d.district_id
LEFT JOIN hp  ON hp.district_id  = d.district_id;
```
- **The trap:** joining students and hall_passes in one query and counting multiplies the rows ("fan-out"). You'd get passes × students.
- `NULLIF` avoids divide-by-zero.

**Red flags:** one big join with `COUNT(*)`. `COUNT(DISTINCT ...)` everywhere as a band-aid. It can work for counts but hides the problem and breaks sums.

**Study:** Search "SQL join fan-out" / "chasm trap." This is the most common real-world reporting bug, and Ted will know it.

### B6. Weekly active users with week-over-week change

**Strong answer:**
```sql
WITH wau AS (
  SELECT DATE_TRUNC('week', occurred_at) AS week_start,
         COUNT(DISTINCT user_id) AS wau
  FROM events
  GROUP BY 1
)
SELECT week_start, wau,
       LAG(wau) OVER (ORDER BY week_start) AS prev_wau,
       ROUND(100 * (wau - LAG(wau) OVER (ORDER BY week_start))
             / NULLIF(LAG(wau) OVER (ORDER BY week_start), 0), 1) AS pct_change
FROM wau
ORDER BY week_start;
```
- **Bonus points:**
  - Week start depends on Snowflake's `WEEK_START` parameter. Say "I'd confirm which day weeks start on."
  - The current week is partial, so it looks like a drop. Exclude it or label it.
  - School holidays cause big swings. Compare to the same week last year.

**Red flags:** summing daily distinct users to get weekly (double counts people active on several days).

### B7. Flatten JSON tags

**Strong answer:**
```sql
SELECT e.event_id,
       e.properties:device.os::STRING AS device_os,
       t.value::STRING                AS tag
FROM events e,
     LATERAL FLATTEN(input => e.properties:tags) t;
```
- `:` walks into the VARIANT, `.` goes deeper, and `::STRING` casts. Without the cast you get JSON-quoted values.
- `FLATTEN` makes one row per array element.
- Events with no tags disappear. Add `OUTER => TRUE` to keep them with a null tag.

**Red flags:** treating the JSON as a string and using `LIKE`.

**Study:** Guide: Snowflake "Loading and JSON." Docs: `FLATTEN`, semi-structured data.

---

## C. SQL you debug

### C1. NOT IN returns nothing

**Strong answer:** `withdrawals.student_id` contains at least one **NULL**. `x NOT IN (..., NULL)` evaluates to unknown for every row, so nothing comes back. Fix:
```sql
SELECT s.student_id FROM students s
WHERE NOT EXISTS (SELECT 1 FROM withdrawals w WHERE w.student_id = s.student_id);
```
Then ask why `withdrawals` has null student IDs. That's a data-quality problem worth a `not_null` test.

**Study:** "NOT IN NULL trap." Same behaviour in Oracle.

### C2. LEFT JOIN that acts like an INNER JOIN

**Strong answer:** the `WHERE h.created_at >= ...` filter throws away the rows where `h` is null (schools with no passes), turning the LEFT JOIN into an inner join. Move the condition into the `ON`:
```sql
SELECT s.name, COUNT(h.pass_id) AS passes
FROM schools s
LEFT JOIN hall_passes h
  ON h.school_id = s.school_id
 AND h.created_at >= DATEADD(day, -7, CURRENT_DATE)
GROUP BY s.name;
```
- Also: `COUNT(h.pass_id)` is right (it counts 0 for no match). `COUNT(*)` would count 1.
- Grouping by `name` merges two schools with the same name. Group by `school_id`.

### C3. Missing October 31

**Strong answer:** `'2026-10-31'` means `2026-10-31 00:00:00`, so everything after midnight on the 31st is excluded. Use a half-open range:
```sql
WHERE created_at >= '2026-10-01' AND created_at < '2026-11-01'
```
- **Second issue:** those are UTC boundaries. A school's October in local time is shifted by several hours. Say whose month it is.

### C4. COUNT(*) vs COUNT(ended_at)

**Strong answer:**
- `COUNT(column)` skips nulls. The difference is the number of passes with no `ended_at`: still open, or never closed properly (a real product question, since passes that never end distort duration reports).
- "How many passes were created" is `COUNT(*)` (or `COUNT(pass_id)`, since the key is never null).

### C5. Two dashboards disagree on active students

**Strong answer:** check in this order.
1. **Definition:** `is_active` flag vs "had activity in 30 days" vs "rostered this year." Different filters are the usual cause.
2. **Source:** raw table vs a mart, or different models.
3. **Timing:** one is cached or stale. Check freshness and Metabase caching.
4. **Joins:** fan-out in one of them.
5. **Duplicates:** the same student at two schools after a transfer, or duplicate SIS records.
6. **Time zone and date boundaries.**

Fix: one agreed definition, one tested model, both dashboards point at it, and the definition is documented.

**Red flags:** "I'd just pick the one that looks right."

---

## D. "AI wrote this" review tests

### D1. The ARR query

**Problems:**
1. **Fan-out:** the join to `schools` repeats each contract once per school, so ARR is multiplied by the number of schools. This is the biggest bug.
2. **LEFT JOIN made inner:** `s.is_active = TRUE` in WHERE drops districts with no active school.
3. **Wrong logic for ARR over time:** grouping by the month the contract *started* gives new bookings by month, not ARR. ARR in a month = contracts active *in* that month (start ≤ month end, and end ≥ month end or open).
4. **Current status used for history:** `status = 'active'` is today's status, so churned contracts vanish from past months and history rewrites itself.
5. **Currency:** USD and CAD summed together.
6. **Grouping by name:** two districts with the same name merge. Group by `district_id`.
7. **No time range:** months with no new contracts vanish (no month spine).

**Better version (sketch):**
```sql
WITH months AS (
  SELECT DATEADD(month, ROW_NUMBER() OVER (ORDER BY SEQ4()) - 1, '2024-01-01'::DATE) AS month_start
  FROM TABLE(GENERATOR(ROWCOUNT => 36))
)
SELECT c.district_id, m.month_start, c.currency,
       SUM(c.annual_value) AS arr
FROM months m
JOIN contracts c
  ON c.start_date <= LAST_DAY(m.month_start)
 AND (c.end_date IS NULL OR c.end_date >= LAST_DAY(m.month_start))
WHERE c.status <> 'void'                -- exclude contracts that never happened
GROUP BY 1, 2, 3;
```
- Then convert currency with a rate table, or report per currency.
- **Most important:** before trusting any of it, **agree the ARR definition with Ted and Finance**.

**What they're scoring:** you found the fan-out and the "bookings, not ARR" logic error, and you didn't just tidy the syntax.

**Study:** B5 (fan-out), J1 (ARR definition). Docs: Snowflake `GENERATOR`.

### D2. The dbt incremental model

**Problems:**
1. **`created_at` instead of `updated_at`:** a pass that ends, or changes status, after it's loaded is never updated. Durations and statuses go stale.
2. **No lookback window:** late-arriving rows with a timestamp slightly older than the max are skipped forever. Use something like `updated_at > (select max(updated_at) - interval '3 days' ...)`. The `unique_key` merge handles the overlap.
3. **`select *` from the source:**
   - **Schema drift:** a new column can break the model or silently add PII.
   - **No renaming or casting:** this should be a staging model.
   - **PII flows straight through.**
4. **Hard deletes are never handled** (see F2).
5. **No tests and no docs.**
6. **No plan for logic changes:** changing an incremental model needs a `--full-refresh`. Consider `on_schema_change`.

**Before approving, ask for:**
- Explicit columns and staging conventions.
- Tests: `unique` and `not_null` on `pass_id`, `relationships`, `accepted_values` on status.
- Source freshness.
- A CI run.
- A note on how deletes are handled.
- Proof it matches a full rebuild on a sample (counts compared).

**Study:** Guide: dbt (materializations, tests, review workflow). Docs: dbt incremental models, `is_incremental`, `on_schema_change`.

### D3. The Python loader

**Problems (roughly by severity):**
1. **Secrets in code:** an API token and a Snowflake password hard-coded. If this was ever committed, rotate both now.
2. **`admin` user:** the loader should be its own service user, with a role that can only write RAW, and key-pair auth.
3. **SQL built with f-strings:** injection risk, and it breaks on `O'Brien`. Use bound parameters, or bulk load.
4. **Student names landing in raw:** ask whether it's needed at all (data minimization), and if so, mask it.
5. **No pagination:** only the first page is ever loaded.
6. **No timeout, no status check:** `requests.get` can hang, and a 500 error page gets parsed as JSON.
7. **`except Exception: pass` in `while True`:** failures are swallowed silently, and the loop hammers the API with no sleep.
8. **Not incremental and not idempotent:** it always pulls since 2026-01-01 and inserts again, duplicating rows every loop.
9. **`datetime.utcnow()`:** deprecated in 3.12, and naive. Use `datetime.now(timezone.utc)`.
10. **`print` instead of logging:** no counts in or out.
11. **Row-by-row inserts:** slow. Stage and bulk load, then `MERGE`.

**What they're scoring:** you see the security problems first (secrets, admin, injection, PII), then reliability.

**Study:** Guide: Python (calling APIs, talking to databases, pipeline habits).

### D4. "Add indexes"

**Strong answer:**
- **That's wrong for Snowflake.** Standard tables have no indexes. Snowflake prunes micro-partitions using min/max metadata. (Niche features like search optimization and hybrid tables exist, but they aren't the answer to a cost spike.)
- **Then investigate properly:**
  - `SNOWFLAKE.ACCOUNT_USAGE.METERING_DAILY_HISTORY`: is the increase in warehouses or serverless features?
  - `WAREHOUSE_METERING_HISTORY` by warehouse and day: which one, and when did it start?
  - `QUERY_HISTORY`: the most expensive queries, by user and warehouse.
  - Recent changes: warehouse size, auto-suspend setting, sync frequency, new dashboards.
- **The point:** AI is useful for drafting the queries, but a confident, unverified diagnosis gets checked against the platform's own usage data.

**Study:** Guide: Snowflake (no indexes / pruning; warehouses and cost).

---

## E. Data modelling

### E1. Hall-pass reporting model

**Strong answer:**
- **`fct_hall_passes`, grain: one row per pass.**
  - Keys: pass_id, student_key, school_key, staff_key, date_key.
  - Times: created_at (UTC), local date, ended_at.
  - Measures and attributes: duration in minutes, pass_type, status.
- **Dimensions:**
  - `dim_school`: district, state or province, time zone, plan.
  - `dim_student`: grade, school, active flag, **no names**.
  - `dim_staff`, `dim_date` (with school-year and term).
  - Pass type, if it has attributes.
- **PII:** names, emails and SIS IDs live in a restricted table or schema (or are masked), and join only for roles that need them.
- **For dashboards:** a pre-aggregated `fct_hall_passes_daily` (school × local day × pass type) keeps Metabase fast and cheap.
- **Say the grain out loud first.** That's what interviewers listen for.

**Study:** Kimball star schema basics: grain, facts, dimensions. Guide: dbt (marts).

### E2. Plan changes mid-year

**Strong answer:**
- This is a **type 2 slowly changing dimension**: keep a row per version, with `valid_from` and `valid_to`.
- In dbt, a **snapshot** on the subscriptions table builds this automatically (`dbt_valid_from`, `dbt_valid_to`).
- Revenue facts join on `fact_date BETWEEN valid_from AND COALESCE(valid_to, '9999-12-31')`.
- Better still, if billing has a **subscription-change history** at the source, model that directly instead of snapshotting.

**Red flags:** overwriting the plan column (history lost), or copying the plan onto every fact row by hand.

**Study:** Guide: dbt (snapshots). "Kimball SCD type 2."

### E3. Nested arrays in MongoDB documents

**Strong answer:**
- **Tables:**
  - **Parent:** `stg_students`, one row per student, scalar fields only.
  - **Children:** `stg_student_guardians` and `stg_student_classes`, one row per array element. They carry `student_id` plus either the element's own ID or its array index.
  - Built with `LATERAL FLATTEN` in staging. Keep the raw VARIANT in RAW.
- **Decisions to make:**
  - **Keys:** what identifies an array element? If it has no ID, the index changes when the order changes.
  - **History:** do we need to know when a guardian was removed?
  - **Empty or missing arrays:** use `OUTER => TRUE`.
  - **PII:** guardian names, phones and emails are restricted data.
  - **Deeper nesting.**
- Say that you'd look at real documents first, because Mongo collections often hold several shapes over time.

**Study:** Guide: Snowflake (loading and JSON).

### E4. Event model for the new platform

**Ask for in every event:**
- `event_id` (unique, for de-duplication).
- `event_name` from an agreed list, with a naming convention (`hall_pass_created`, `object_action`).
- `occurred_at` in UTC, plus `received_at` (server time).
- Who and where: `user_id` (pseudonymous), `user_role` (student, teacher, admin), `school_id`, `district_id`.
- `platform`, `app_version`, `schema_version`.
- Typed, documented properties.

**Push back on:**
- **PII in properties:** names, free-text notes, emails. Use IDs.
- **Vague events:** "button_clicked".
- **Events no one will use:** every event needs a question it answers and an owner.
- **Changing meanings without a version bump.**

**Process:** a tracking plan in git, reviewed like code, with tests in the pipeline that reject unknown events. The tenancy keys (`district_id`) also make the 90-day per-district deletion possible.

**Connection:** Paolo built Segment/Mixpanel event pipelines at Metalab. Ask him how they'd like to approach it.

### E5. Reporting across legacy and new platforms during migration

**Strong answer:**
- Separate staging models per platform, feeding **one conformed model** with a `source_platform` column.
- An **ID crosswalk** table (legacy ID → new ID) per entity.
- A **migration status** table per customer, with a cutover date. For each customer and date, decide which platform is the source of truth, so the overlap period isn't double counted.
- **Reconciliation tests:** counts and totals per school before and after cutover.
- Dashboards that show the platform split while the migration is underway.

**Your evidence:** the VIU legacy modernization (about 90 apps, conversion guide, data and sign-on kept intact).

---

## F. Pipelines and ingestion

### F1. Stitch says success, numbers look low

**Strong answer, in order:**
1. **Freshness:** `MAX(_sdc_batched_at)` and row counts per day in RAW, compared with a normal day.
2. **Stitch:** rows replicated per table, any skipped tables, replication key or bookmark problems.
3. **The source itself:** was there an app outage or a holiday? Check with Product or SRE.
4. **dbt:** did the run finish, and did tests fail?
5. **Definitions and time:** is "yesterday" UTC or local? Metabase cache? Dashboard filters?
6. **Tell people early:** "Yesterday's numbers look low; I'm investigating; next update at 11."
7. **Afterwards:** add a freshness test and a volume alert so the pipeline tells you next time, not a stakeholder.

**Red flags:** jumping to "rerun everything." Not telling stakeholders.

### F2. Hard deletes with incremental loads

**Strong answer:**
- **The gap:** an incremental load based on `updated_at` only sees rows that still exist. A deleted document never shows up again, so it **stays in the warehouse forever**.
- **Why it matters at Minga:**
  - **Wrong numbers:** deleted students or passes still counted.
  - **Privacy commitments:** Minga promises to delete or de-identify a district's data within 90 days of contract end, and students removed through SIS syncs should go too. Leftover copies in the warehouse break that promise.
- **Fixes:**
  - **Log-based or change-stream replication** (the MongoDB oplog or change streams) that captures delete events, if the loader supports it.
  - **Soft deletes in the app** (`deleted_at`).
  - **Periodic key reconciliation:** compare the full list of IDs in the source with the warehouse, and mark missing ones as deleted.
  - Plus a documented **deletion process** that reaches every copy (see G4).

**Study:** Docs: Stitch replication methods (key-based incremental vs log-based). Search "hard deletes incremental ELT."

### F3. Idempotency

**Strong answer:**
- **Definition:** running a job twice gives the same result as running it once.
- **How:**
  - `MERGE` on a unique key.
  - Delete-and-insert by partition (replace a whole day).
  - Load to staging and swap.
  - Use the run's logical date, not `now()`, so a rerun of Tuesday processes Tuesday.
- **Why:** retries, backfills and overlapping incremental windows are routine, so every job must be safe to repeat.
- **Your example:** CDWTool's per-period duplicate protection.

**Study:** Guide: Airflow (reliability), Python (pipeline habits).

### F4. Schema drift

**Strong answer:**
- **New field:** loaders like Stitch usually add a column automatically. Fine in RAW. It shouldn't silently appear in marts (explicit columns in staging prevent that).
- **Type change (number → string):** Stitch typically splits it into an extra column with a type suffix rather than failing. Check the Stitch docs for the exact naming. Staging models that cast explicitly will then show nulls or fail.
- **Desired behaviour:**
  - RAW accepts anything (VARIANT is fine).
  - Staging casts explicitly and fails loudly through tests or dbt model contracts.
  - An alert tells you.
  - You talk to the product team, ideally *before* the change, through the event and data contract process (E4).

### F5. Backfilling two years

**Strong answer:**
- Confirm the source still *has* two years of history (app database, exports, backups) and that the shape hasn't changed over time.
- Load into a **separate table**, in chunks (by month), with each chunk idempotent.
- Size the warehouse up temporarily, with a **resource monitor** on it.
- Reconcile counts and totals per month against the source.
- Then swap it in, using a zero-copy clone of the current table as a rollback point.
- Don't disturb the daily loads.
- **Tell people that historical numbers will change**, and when.

---

## G. Snowflake

### G1. Bill up 60%

**Strong answer:**
- `ACCOUNT_USAGE.METERING_DAILY_HISTORY`: which service (warehouses, or serverless like automatic clustering and Snowpipe)?
- `WAREHOUSE_METERING_HISTORY`: which warehouse, and from what date?
- `QUERY_HISTORY` (with query tags if they're set): which users, tools and queries?
- **Common causes:** a warehouse resized and never sized back, auto-suspend raised, a new or more frequent sync, a dashboard auto-refreshing, a full rebuild that used to be incremental, a runaway query.
- **Storage** is billed separately: check for Time Travel growth.
- Account usage views can lag by up to a few hours.
- **Then fix the cause, and prevent it:** resource monitors and budgets, a warehouse per workload, and query tags on dbt and Metabase.

**Study:** Guide: Snowflake (warehouses and cost). Docs: resource monitors, `ACCOUNT_USAGE` views.

### G2. Role design

**Strong answer:**

| Role | Can do | Warehouse |
|:--|:--|:--|
| `LOADER` (Stitch / custom loaders) | Write RAW only | `LOAD_WH` |
| `TRANSFORMER` (dbt) | Read RAW, write STAGING / MARTS | `TRANSFORM_WH` |
| `REPORTER` (Metabase service user) | Read MARTS, PII masked | `BI_WH` |
| `ANALYST` (RevOps etc.) | Read MARTS, write own sandbox schema, PII masked | `ANALYST_WH` |
| `PII_READER` | Unmasked student fields, granted narrowly and reviewed | (added on top) |
| Data engineer (you) | Builds everything; ACCOUNTADMIN only as break-glass with MFA | |

- Service users use **key-pair auth**, not passwords.
- Grant **future grants** so new tables follow the rules.
- Nothing granted to `PUBLIC`.
- Review grants each quarter.
- **Who sees names:** only `PII_READER`, through masking policies.

**Study:** Guide: Snowflake (access and PII). Docs: Snowflake access control, functional vs access roles.

### G3. Masking policy SQL

**Strong answer:**
```sql
CREATE MASKING POLICY governance.policies.mask_student_name
  AS (val STRING) RETURNS STRING ->
  CASE
    WHEN IS_ROLE_IN_SESSION('PII_READER') THEN val
    ELSE '***'
  END;

ALTER TABLE analytics.marts.dim_students
  MODIFY COLUMN last_name SET MASKING POLICY governance.policies.mask_student_name;
```
- **Needs Enterprise edition or higher.** Ask which edition they're on.
- `IS_ROLE_IN_SESSION` respects role hierarchy. `CURRENT_ROLE() = 'PII_READER'` only matches that exact role.
- **At scale:** attach the policy to a **tag** (`pii = 'student_name'`) and tag the columns, so new columns get masked by tagging.

**Study:** Docs: Snowflake masking policies, tag-based masking.

### G4. "Deleted" isn't gone yet

**Strong answer:**
- **Time Travel:** dropped or deleted data can be recovered for the retention period (1 day by default, up to 90 on Enterprise).
- **Fail-safe:** 7 more days for permanent tables, recoverable only by Snowflake support. You can't purge it early.
- **Other copies:**
  - **Clones** made earlier still hold the data.
  - Copies in other schemas, dev and CI schemas, analyst sandboxes.
  - **Metabase caches and CSV downloads.**
  - Exports, Stitch staging, and any backups.
- **What to do:**
  - Keep an inventory of where student data lives.
  - Use shorter `DATA_RETENTION_TIME_IN_DAYS` on PII tables (or transient tables, which skip Fail-safe, where it's safe).
  - De-identify where the policy allows.
  - Log each deletion with dates, so you can show the 90-day commitment was met, counting Time Travel and Fail-safe.

**Study:** Guide: Snowflake (Time Travel and clones).

### G5. Warehouse that never sleeps

**Strong answer:**
- **Why:** every query resets the auto-suspend timer. Loads every 30 minutes, plus dashboards refreshing every few minutes, can keep a warehouse running all day and night. Each resume also bills at least 60 seconds.
- **Fixes:**
  - **Separate warehouses** for loading and BI, so you can see who's spending.
  - **Short auto-suspend** (about 60 seconds).
  - **Sync only as often as the business needs:** hourly or nightly is usually fine for revenue data.
  - **Metabase caching** and less frequent refresh.
  - Build marts as **tables**, so dashboard queries are cheap.

---

## H. dbt

### H1. Day-one tests

**Strong answer:**
- **`fct_hall_passes`:**
  - `unique` and `not_null` on `pass_id`.
  - `not_null` on `school_id`, `student_id`, `created_at`.
  - `relationships` to `dim_school` and `dim_student`.
  - `accepted_values` on `status` and `pass_type`.
  - A custom test: `ended_at >= created_at` when `ended_at` is not null.
- **Source freshness** on the raw table.
- **`dim_students`:**
  - `unique` and `not_null` on `student_id`.
  - `relationships` to `dim_school`.
  - `accepted_values` or a range check on `grade`.
  - Maybe uniqueness of `(school_id, sis_id)`.
- **Approach:** start with the tests that would have caught real past incidents (ask Ted what went wrong before), and don't drown in low-value tests.

**Study:** Guide: dbt (tests and freshness).

### H2. Layers

**Strong answer:**
- **Staging (`stg_`):** one model per source table. Rename, cast, light cleaning. No joins. The only models that read `source()`.
- **Intermediate (`int_`):** joins and business logic building blocks. Not exposed to BI.
- **Marts (`fct_` / `dim_`):** business-facing, documented, tested, what Metabase and analysts use.
- **Why:** each rule lives in one place, and analysts know where to build.

### H3. An analyst's change reaching production

**Strong answer:**
1. Branch.
2. Build in their own dev schema (`dbt build` against the dev target).
3. Open a PR using a template: what changed, why, how it was tested.
4. **CI (slim CI):** build only modified models and what depends on them (`state:modified+`, with `--defer` to production for the rest), plus tests.
5. Review: you check the logic, CI checks the mechanics.
6. Merge.
7. The production job deploys.
8. Docs are updated.

Make the path fast so analysts don't route around it.

**Study:** Guide: dbt (the review workflow).

### H4. Incremental models

**Strong answer:**
- **When:** large, append-heavy tables (events, passes) where a full rebuild is slow or expensive.
- **Risks:**
  - Late-arriving data is missed without a lookback window.
  - Deletes aren't handled.
  - A logic change needs a `--full-refresh`.
  - The incremental table can drift from what a full rebuild would produce, so schedule a periodic full refresh or a comparison.
- Don't make small tables incremental. The complexity isn't worth it.

---

## I. Privacy and governance

### I1. CX wants student names

**Strong answer:**
- First ask **what they're trying to do.** For churn risk, CX contacts *schools and staff*, not students.
- Offer school- and teacher-level usage instead (active staff, passes per week, features used).
- **Data minimization:** student names aren't needed for this.
- If there's a genuine need, it goes through an approval process, with least privilege and no exports.
- Say no kindly: "Let's get you what you need to talk to the school. Student names won't help with that, and keeping them out protects us both."

### I2. Canadian data in a US warehouse

**Strong answer (careful phrasing; you're raising a question, not accusing):**
- **The observation:** the privacy policy says Canadian districts' data is primarily stored in Canada and not transferred out without consent. The published subprocessor list shows Snowflake in the USA.
- **Questions:**
  - Does Canadian district data reach Snowflake today?
  - Is it identified or aggregated?
  - What do the Canadian contracts and data agreements allow?
  - Who owns privacy decisions at Minga?
- **Options:**
  - Exclude Canadian student-level data from the warehouse.
  - De-identify or aggregate it before it leaves Canada.
  - A second Snowflake account in a Canadian region (Snowflake offers Canadian regions on AWS and Azure).
  - Consent where the contracts allow it.
- **How:** raise it privately with Paolo or the privacy owner, as "I'd want to verify this," not in a meeting as a gotcha.

**Why it scores well:** it shows you read their privacy policy and think about data residency. It's a real senior-level question. Only ask it if it comes up naturally, or save it for later rounds.

### I3. Public Metabase link with student data

**Strong answer:**
- **Now:**
  - Disable the public link immediately.
  - Find out what was exposed and for how long. Check access logs if available.
  - Tell your manager and the privacy or security owner right away, following the incident process. Whether it's a reportable breach (FERPA, state laws, PIPEDA) is their call with legal, not yours.
  - Write down the timeline.
- **Prevent it:**
  - Turn off public sharing in Metabase admin settings.
  - Set group-based permissions and keep student-level data in restricted collections.
  - Make sure the Metabase service role sees **masked** data in Snowflake, so even a mistake can't show names.

### I4. One-paragraph PII standard

**Example:** "Student and staff personal data (names, emails, SIS IDs, guardian details, free-text notes) lives only in the restricted PII schema and is masked everywhere else. Analysts work with IDs, not names. If a task seems to need names, ask the data team first, and we'll find another way or get approval. Never export student-level data to spreadsheets, email or AI tools. Dashboards show aggregates, at least school-level, unless approved. If you see personal data somewhere it shouldn't be, report it to the data team the same day. No blame for reporting."

**Scoring:** short, concrete, says what to *do*, and has a no-blame reporting path.

### I5. What AI should never do [Human driving]

**Strong answer:**
- **No write access to production,** and no access to unmasked student data. If AI connects to data, it's read-only, row-limited, through a masked role. Your Oracle MCP server is the example: read and write separated, row limits enforced.
- **No student records pasted into prompts** unless the tool is approved for that data under Minga's policy.
- **No unreviewed merges:** a human reads every line.
- **No deciding metric definitions** or answering stakeholders with unverified numbers.
- **No holding credentials.**

---

## J. RevOps and stakeholders

### J1. ARR, churn, NRR

**Strong answer:**
- **ARR (annual recurring revenue):** the annualized value of active recurring subscriptions at a point in time.
  - **Include:** recurring subscription fees, net of recurring discounts.
  - **Exclude:** one-time fees (implementation, training, hardware), and usage that isn't contracted.
- **Churn:**
  - **Logo churn:** customers lost ÷ customers at the start.
  - **Revenue churn:** ARR lost ÷ starting ARR.
- **NRR (net revenue retention):** for customers who existed at the start of the period, (starting ARR + expansion − contraction − churn) ÷ starting ARR. Usually measured over 12 months. New customers are excluded.
- **GRR (gross revenue retention):** the same, without expansion. It can't exceed 100%.
- **K-12 point:** renewals cluster around the school fiscal year (often July 1), so monthly churn is lumpy. Annual views matter more.

**Study:** search "SaaS metrics ARR NRR GRR definitions." Ted lives in these. Get the formulas right.

### J2. HubSpot vs Finance ARR

**Strong answer:**
- Trace both numbers down to records and list the differences:
  - **Timing:** HubSpot deal close date vs contract start.
  - **One-time fees** included in one.
  - **Currency.**
  - **Multi-year deals:** total contract value vs annual.
  - **Churned customers** still marked active in the CRM.
- **The business decides the definition:** Finance owns reported revenue, RevOps owns pipeline. Agree it with Ted and Finance in writing.
- **You implement it once,** in a tested model, and both dashboards use it.
- Build a reconciliation report so differences show up early.

### J3. Four requests on Monday

**Strong answer:**
- **Triage by impact and deadline,** and make it visible.
- **CX broken dashboard:** look first, for about 30 minutes. If the data is wrong, it may affect everyone.
- **Finance board number by Friday:** a fixed, high-stakes deadline. Protect time for it.
- **RevOps by Wednesday:** confirm what's actually needed. Maybe a first version Wednesday, finished later.
- **Product event data:** ask when the launch is and whether there's a spec. Often it needs their input first.
- **Put all four in the queue with dates.** Tell each requester what to expect.
- **If two can't both happen,** take the trade-off to Ted or Paolo rather than deciding silently.

**Red flags:** "I'd just work late and do all four." It sounds keen but means no system.

### J4. Saying no kindly (role-play)

**Example:** "I see why you want it fresh. Can you tell me what decision it's for? A table rebuilt every five minutes keeps the warehouse running all day, and that's real money. If the decision is daily, I can give you an hourly or daily version today, and if it turns out you need it faster, we'll look at it together."

**Scoring:**
- Ask about the goal.
- Explain the cost plainly.
- Offer an alternative right away.
- Leave the door open.

### J5. A dbt test in 30 seconds [Human driving]

**Example:** "A dbt test is an automatic check that runs every time the data refreshes, like spell-check for numbers. For example: every hall pass must belong to a school, and no student appears twice. If a check fails, we find out before the dashboard shows a wrong number, not when you're presenting it to the board."

**Scoring:** no jargon, a concrete example, and why Ted should care.

### J6. Is the platform helping RevOps?

**Strong answer:**
- **Ask Ted first** what decisions he needs to make faster.
- **Then measure:**
  - Time from request to answer.
  - Share of questions analysts answer themselves.
  - Data issues caught by tests vs reported by people.
  - Dashboard usage.
  - Freshness targets met.
  - A short trust survey each quarter.
  - Snowflake cost relative to usage.

---

## K. System design

### K1. The 12-month platform

**Strong answer (draw left to right):**
- **Sources:** app (MongoDB), HubSpot, billing, Intercom, PostHog/UserPilot events, SIS roster data.
- **Ingestion:** a managed tool (Stitch, or a replacement if it's flaky) plus small custom Python loaders for gaps. Everything lands in RAW with load metadata.
- **Snowflake layers:**
  - **RAW:** per source, VARIANT where nested.
  - **STAGING.**
  - **INTERMEDIATE.**
  - **MARTS:** revenue, product usage, customer health.
  - **PII:** a restricted schema.
  - **Analyst sandboxes.**
- **Transformation:** dbt in git, with slim CI.
- **Orchestration:** something that runs dbt after loads finish and alerts on failure. The choice depends on Minga (dbt Cloud jobs for simplicity; Dagster or Airflow, possibly Cloud Composer on GCP, if workflows grow).
- **BI:** Metabase reads marts only, through a masked reporter role.
- **Governance:** roles, tag-based masking, retention and deletion jobs, access reviews.
- **Monitoring:** freshness, tests, volume alerts, cost monitors, alerts to Slack, runbooks.
- **Say what you'd do first and what can wait.** Sequencing is what Paolo is listening for.

### K2. 50 SIS roster feeds

**Strong answer:**
- **First ask:** does the warehouse need to own this, or does MingaSync (the product's rostering sync, with Ednition) already normalize it? Ideally the warehouse copies the *normalized* output, not 50 raw formats.
- **If ingesting:**
  - Land each feed raw with metadata: district, feed type, file name, received_at, row count.
  - Normalize into a OneRoster-shaped staging model.
- **Per-district monitoring:**
  - **Expected cadence:** nightly, so alert if a district's feed is more than about 30 hours late.
  - **Volume change:** rows down more than 20%.
  - **Schema validation.**
  - Send alerts to the integrations team.
- A dashboard of feed health by district.

### K3. Migration mapping tool

**Strong answer:**
- **Mapping spec:** per entity (legacy field → new field, with rules), versioned in git.
- **Deterministic transform,** with dry-run mode and reruns that are safe to repeat.
- **ID crosswalk** table.
- **Reconciliation:**
  - Counts per entity per school.
  - Sums (points, passes).
  - Record-level comparison using hashes of normalized fields.
  - A list of every record that didn't map, with the reason.
- **A sign-off report per customer,** plus an audit log.
- PII stays in controlled environments.

**Your evidence:** the VIU conversion guide and legacy catalogue.

---

## L. Python

### L1. Paginated API with retries

**Strong answer:** see the HubSpot loader in the Python guide ("Calling APIs").
- Cursor loop on `paging.next.after`.
- `requests.Session`.
- A timeout on every call.
- Retry only 429 and 5xx, with exponential backoff.
- `raise_for_status` for other errors.
- `yield` results.
- Token from an environment variable.

### L2. Flatten a nested dict

**Strong answer:** a recursive function. See the Python guide ("JSON and nested documents"). Mention that lists are the hard part (they become child tables) and that you'd usually flatten in Snowflake instead.

### L3. Missing IDs both ways

**Strong answer:** sets.
```python
sis, minga = set(sis_ids), set(minga_ids)
missing_in_minga = sis - minga
extra_in_minga = minga - sis
```
Mention normalizing IDs first: strip spaces, consistent type and case.

---

## M. Estimation and curveballs

### M1. Hall-pass volume

**Strong answer (state your assumptions):**
- 2,000 schools × about 700 students ≈ 1.4 million students.
- About 0.5 to 1 pass per student per school day × 180 school days ≈ **125 to 250 million rows per year**.
- Other events (behaviour, check-ins, app events) might add up to around a billion rows a year.
- **Is it big data?** No, not for Snowflake, which handles billions of rows routinely.
- **So design for correctness, privacy and cost, not raw scale:**
  - Incremental models for event tables.
  - Date-based pruning.
  - Small warehouses.
  - Pre-aggregated marts for dashboards.

**Scoring:** clear assumptions and sensible conclusions matter more than the exact number.

### M2. Shared Stitch password in Slack

**Strong answer:**
- No drama, no blame.
- Tell your manager privately.
- Rotate the password.
- Move to individual or service accounts with least privilege, and key-pair auth where possible.
- Store credentials in a password manager or secrets manager.
- Delete the Slack message (and remember Slack may retain it).
- Check access logs for anything odd.
- Document the fix.
- Frame it as "here's what I fixed," not "look what I found."

### M3. A messy dbt project at three months

**Signs:**
- Build times creeping up.
- Failing tests being ignored.
- Duplicate models computing the same thing.
- `source()` used outside staging.
- Missing docs.
- Analysts asking where to put things.
- Slow CI.

**Actions:**
- A short style guide.
- Run the `dbt_project_evaluator` package to find structural problems.
- Remove unused models (check Metabase usage and exposures).
- Name owners per area.
- A small refactor plan, done in pieces.

---

## N. AI in practice [Human driving]

### N1. Review checklist for AI-written SQL

**Strong answer:**
1. **Grain:** what is one row? Is that what was asked?
2. **Joins:** any fan-out? Are LEFT JOINs still left (no WHERE on the right table)?
3. **Filters and dates:** half-open ranges, time zones, current vs historical status.
4. **Nulls:** `NOT IN`, `COUNT(col)`, division by zero.
5. **Definitions:** does it match the agreed metric definition?
6. **Security:** no PII in marts, no secrets, parameters not string-building.
7. **Tests:** unique and not-null on the grain key, plus a test for the specific logic.
8. **Reconciliation:** compare the totals with a known number or the source.
9. **Cost:** full scans of big tables, incremental where it matters.
10. **Explainability:** can the reviewer explain every line? If not, it doesn't merge.

### N2. Narrating "tardies per student per week" with Claude

**Strong answer (talk while you do it):**
1. **Write the spec first:**
   - Grain is student × week.
   - Which day does a week start (check Snowflake's `WEEK_START`)?
   - School time zone? (`tardy_date` is already a date, so mostly fine.)
   - Do we need weeks with zero tardies?
   - What happens when a student transfers mid-week?
2. **Give Claude the schema and the spec,** not just the sentence.
3. **Read the SQL line by line** and say what each part does.
4. **Run it on a small sample with a known answer:** pick one student and count by hand.
5. **Check edge cases:** week boundaries, duplicates, transfers.
6. **Add tests,** and compare the total with `COUNT(*)` from `tardies`.

**What they're scoring:** you drive with a spec and verification, and you say "I don't trust this until..." out loud.

### N3. Spotting confidently wrong AI answers

**Strong answer:**
- **Warning signs:**
  - Functions or columns that don't exist.
  - Syntax from the wrong database (PostgreSQL or Oracle syntax in Snowflake).
  - Advice from another platform (indexes in Snowflake, as in D4).
  - Numbers with no source.
  - Too-neat explanations.
- **How to verify:**
  - Run it.
  - Check the official docs.
  - Reconcile against the source.
  - Test small cases with known answers.
  - Ask it for the doc reference, then actually read it.

### N4. Explain the query without AI

**Strong answer:**
- **What it does:** per school, it counts distinct students who have *any* pass, all time, and divides all passes by that number.
- **Issues:**
  1. **The denominator** only includes students who used a pass at least once. Students with zero passes are missing, so it's "passes per student who used passes," not per enrolled student. Use active enrolment from `students` if that's the question.
  2. **No date range:** it's all time, so it mixes school years.
  3. **Division behaviour depends on the database.** In PostgreSQL or SQL Server, integer ÷ integer truncates (7/2 = 3). Snowflake returns a decimal. Mention this; it shows you know platforms differ.
  4. **Transfers:** `school_id` is the pass's school, so a student who transferred counts at both schools. Probably fine, but say it.

**Scoring:** a plain explanation first, then the denominator issue. That's the one they're looking for.

---

## Study plan by weakness

| If you struggled with | Read |
|:--|:--|
| Window functions, QUALIFY, joins | Snowflake docs: window functions, `QUALIFY`; practice B1, B3, B5 |
| Time zones | Snowflake docs: `CONVERT_TIMEZONE`; Python guide: dates and time zones |
| JSON | Snowflake guide: loading and JSON; docs: `FLATTEN` |
| Cost | Snowflake guide: warehouses and cost; docs: resource monitors, `ACCOUNT_USAGE` |
| Access and PII | Snowflake guide: access and PII; docs: masking policies, tag-based masking, access control |
| dbt | dbt guide: all sections; docs: tests, incremental models, snapshots, state selection |
| Pipelines | Airflow guide: reliability; Python guide: pipeline habits |
| RevOps metrics | Search "SaaS metrics ARR NRR GRR"; practice J1 out loud |
| Modelling | Kimball star schema basics; dbt guide: layers |
