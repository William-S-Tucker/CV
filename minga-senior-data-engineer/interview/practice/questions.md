# Minga Mock Exam: Question Bank

Practice questions for the in-person interview on 2026-10-15 with Paolo (Engineering Manager) and Ted (Director, RevOps). Answers, scoring guides and study pointers are in a separate file (`answers.md`). Try each question out loud or on paper before you look.

**How they'll probably test a "human is driving":** they let you use AI, so expect questions where AI gives you a draft and they watch what you catch, questions with no right answer that test judgement, and "explain it to someone else" questions. Those are marked **[Human driving]**.

---

## Practice schema

Use this made-up schema for the SQL and modelling questions. It's illustrative, not Minga's real schema. All timestamps are stored in UTC.

| Table | Columns |
|:--|:--|
| `districts` | district_id, name, country (`US` / `CA`), state_province |
| `schools` | school_id, district_id, name, timezone (e.g. `America/Chicago`), is_active |
| `students` | student_id, school_id, sis_id, first_name, last_name, email, grade, is_active |
| `hall_passes` | pass_id, student_id, school_id, staff_id, pass_type, status, created_at, ended_at, updated_at |
| `tardies` | tardy_id, student_id, school_id, tardy_date (DATE), minutes_late |
| `contracts` | contract_id, district_id, start_date, end_date, annual_value, currency (`USD` / `CAD`), status |
| `events` | event_id, user_id, school_id, event_name, occurred_at, properties (VARIANT / JSON) |

---

## A. Background and walkthrough (spoken)

**A1.** Walk us through a data pipeline you built and own, from source to destination. What could go wrong, and how would you know?

**A2.** You'd be the only data engineer. What does your first 30 days look like?

**A3.** Tell us about a time you found a problem nobody else had noticed in a system you owned.

**A4.** What would you want to learn first here, and how do you learn a new platform?

---

## B. SQL you write

**B1.** Each student can have many rows in `hall_passes`. Return only the most recent pass per student (by `created_at`). Write it two ways if you can.

**B2.** Count hall passes per school per **local school day** for the last 7 days. (Remember timestamps are UTC and schools are in different time zones.)

**B3.** Find students who had **3 or more tardies within any 7-day window**.

**B4.** List active schools that have had **no hall passes at all in the last 14 days** (a possible churn or setup problem).

**B5.** For each district, show the number of active students, the number of schools, and the hall passes per student over the last 30 days. Watch out for double counting.

**B6.** Weekly active users: for each week, count distinct `user_id`s in `events`. Then add the percentage change from the previous week.

**B7.** `events.properties` is JSON like `{"pass_type": "bathroom", "device": {"os": "ios", "app_version": "5.2.1"}, "tags": ["late", "flagged"]}`. Write a Snowflake query that returns one row per tag with the event_id, the device OS and the tag.

---

## C. SQL you debug

**C1.** This should list students who have **not** withdrawn, but it returns zero rows. Why?
```sql
SELECT student_id FROM students
WHERE student_id NOT IN (SELECT student_id FROM withdrawals);
```

**C2.** This is meant to show every school, including those with zero passes, but schools with no passes are missing. Why, and how do you fix it?
```sql
SELECT s.name, COUNT(h.pass_id) AS passes
FROM schools s
LEFT JOIN hall_passes h ON h.school_id = s.school_id
WHERE h.created_at >= DATEADD(day, -7, CURRENT_DATE)
GROUP BY s.name;
```

**C3.** October's report is missing passes from October 31. Why?
```sql
SELECT COUNT(*) FROM hall_passes
WHERE created_at BETWEEN '2026-10-01' AND '2026-10-31';
```

**C4.** `COUNT(*)` and `COUNT(ended_at)` on the same table give different numbers. What does that tell you, and which one answers "how many passes were created"?

**C5.** Two Metabase dashboards show different "total active students" for the same district. List the likely causes you'd check, in order.

---

## D. "AI wrote this" review tests [Human driving]

**D1.** An AI assistant wrote this "monthly ARR by district" query. Find every problem you can.
```sql
SELECT d.name AS district,
       DATE_TRUNC('month', c.start_date) AS month,
       SUM(c.annual_value) AS arr
FROM contracts c
JOIN districts d ON d.district_id = c.district_id
LEFT JOIN schools s ON s.district_id = d.district_id
WHERE c.status = 'active'
  AND s.is_active = TRUE
GROUP BY 1, 2
ORDER BY 1, 2;
```

**D2.** An AI assistant wrote this dbt incremental model for hall passes from MongoDB. What's wrong with it, and what would you ask for before approving the pull request?
```sql
{{ config(materialized='incremental', unique_key='pass_id') }}

select *
from {{ source('mongo', 'hall_passes') }}
{% if is_incremental() %}
where created_at > (select max(created_at) from {{ this }})
{% endif %}
```

**D3.** An AI assistant wrote this Python loader. Find the problems.
```python
import requests, snowflake.connector
from datetime import datetime

TOKEN = "pat-na1-3f9c..."
conn = snowflake.connector.connect(user="admin", password="Minga2026!", account="xy12345")

def load(since):
    page = requests.get(f"https://api.example.com/passes?since={since}").json()
    cur = conn.cursor()
    for p in page["results"]:
        cur.execute(f"INSERT INTO raw.passes VALUES ('{p['id']}', '{p['student_name']}', '{p['created_at']}')")
    print("done", datetime.utcnow())

while True:
    try:
        load("2026-01-01")
    except Exception:
        pass
```

**D4.** You ask an AI assistant why the Snowflake bill doubled last month. It answers confidently: "Your tables are missing indexes, which causes full table scans. Add indexes on the join columns." How do you respond, and what do you actually do?

---

## E. Data modelling

**E1.** Design the tables (facts and dimensions) for reporting on hall passes. What's the grain of the fact table? Where does student PII live?

**E2.** A district upgrades from the "Core" plan to "Pro" mid-year. RevOps wants revenue reports to show which plan the district was on *at the time*. How do you model that?

**E3.** A MongoDB student document has nested arrays: `guardians: [...]`, `classes: [...]`. How do you turn that into tables analysts can use? What decisions do you have to make?

**E4.** The product team is designing the analytics event model for the new platform. What would you ask for in every event, and what would you push back on?

**E5.** Customers are migrating from the legacy platform to the new one over 18 months. Reports need to show combined numbers across both. How do you approach it?

---

## F. Pipelines and ingestion

**F1.** Stitch shows "success," but yesterday's numbers in Metabase look low. Walk us through how you investigate.

**F2.** You load hall passes incrementally using `updated_at`. What happens to records that get **hard-deleted** in MongoDB? Why does that matter at Minga specifically?

**F3.** Explain idempotency to us, and how you'd make a daily load idempotent.

**F4.** A new field appears in the MongoDB documents and another one changes type from number to string. What happens to your pipeline, and how should it behave?

**F5.** We ask you to backfill two years of history for a table that's only been loading for three months. How do you do it safely?

---

## G. Snowflake

**G1.** The Snowflake bill jumped 60% this month. How do you find out why?

**G2.** Design roles for Minga's Snowflake: the loader (Stitch), dbt, Metabase, RevOps analysts, and you. Who can see student names?

**G3.** Write the Snowflake SQL to mask student last names for everyone except a `PII_READER` role.

**G4.** A district's contract ends and they ask for all their data to be deleted. You delete the rows. Is the data gone? What else do you need to think about in Snowflake?

**G5.** Stitch loads every 30 minutes and Metabase dashboards auto-refresh. Why might the warehouse never suspend, and what would you do?

---

## H. dbt

**H1.** What tests would you put on `fct_hall_passes` and `dim_students` on day one?

**H2.** Explain the staging / intermediate / marts layering, and what's allowed in each.

**H3.** A RevOps analyst wants to add a model. Walk us through how that change gets from their laptop to production safely.

**H4.** When would you make a model incremental, and what's the risk?

---

## I. Privacy and governance

**I1.** A CX analyst asks for a list of student names at schools at risk of churning. What do you do?

**I2.** Minga's privacy policy says Canadian districts' data is kept in Canada. The warehouse is in the US. What questions would you raise, and what options exist?

**I3.** Someone shares a Metabase dashboard with a public link, and it includes student-level data. What do you do now, and what do you change so it can't happen again?

**I4.** Write a one-paragraph PII standard for the warehouse that an analyst could actually follow.

**I5.** What would you never let an AI tool do with Minga's data? [Human driving]

---

## J. RevOps and stakeholders (Ted's questions)

**J1.** Define ARR, churn and net revenue retention. What's included and excluded in ARR?

**J2.** HubSpot says one ARR number, Finance's spreadsheet says another. How do you resolve it, and who decides?

**J3.** Monday morning: RevOps wants a pipeline report by Wednesday, Finance needs a board number by Friday, CX says a dashboard is broken, and Product wants event data for a feature launch. You're one person. What do you do?

**J4.** An analyst asks for something you think is a bad idea (for example, a custom table only they will use, rebuilt every 5 minutes). Say no kindly. Role-play your answer.

**J5.** Explain what a dbt test is to someone who isn't technical, in 30 seconds. [Human driving]

**J6.** How would you measure whether the data platform is actually helping RevOps after six months?

---

## K. System design (whiteboard)

**K1.** Draw Minga's data platform as you'd want it in 12 months: sources, ingestion, warehouse layers, orchestration, BI, access control, monitoring.

**K2.** About 50 different SIS systems send roster data (OneRoster APIs, SFTP files). Design how roster data lands in the warehouse and how you'd know if one district's feed breaks.

**K3.** Design the tool that maps a customer's legacy data into the new platform during migration, and proves nothing was lost.

---

## L. Python

**L1.** Write a function that pulls all records from a paginated API (cursor in `paging.next.after`), with retries on rate limits.

**L2.** Write a function that flattens a nested dict into `parent_child` keys.

**L3.** Given two lists of student IDs (from the SIS and from Minga), find who's missing from each side.

---

## M. Estimation and curveballs

**M1.** Roughly how many hall-pass rows does Minga generate per year? Is that "big data"? What does that mean for your design?

**M2.** What would you do in your first week if you found that the Stitch account password is shared by three people in a Slack message?

**M3.** You've been here three months and the dbt project is growing messy. How do you know, and what do you do?

---

## N. AI in practice [Human driving]

**N1.** Write the review checklist you'd use for a pull request where AI wrote the SQL.

**N2.** "Use Claude to write a model that counts tardies per student per week. Talk us through what you check." Narrate what you'd do.

**N3.** How do you tell when an AI answer is confidently wrong, in data work specifically?

**N4.** Close your laptop. Explain, without AI, what this does and whether it's right:
```sql
SELECT school_id,
       COUNT(DISTINCT student_id) AS students,
       COUNT(*) / COUNT(DISTINCT student_id) AS passes_per_student
FROM hall_passes
GROUP BY school_id;
```
