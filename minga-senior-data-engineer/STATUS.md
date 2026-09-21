# Status: Minga, Senior Data Engineer

- **Status:** drafting
- **Created:** 2026-09-21
- **Branch:** `apply/minga-senior-data-engineer`
- **Role:** Senior Data Engineer (only data engineer, senior IC) · Kelowna HQ, strong preference for in-office 3x/week, open to remote · $130,000 to $160,000 CAD base · Minga (K-12 Student Behavior Platform, 2,000+ schools)
- **Source:** https://minga.bamboohr.com/careers/117, posted 2026-09-16, captured 2026-09-21.
- **Application asks for:** resume + a "Why Minga" answer (read by a human; they want the person behind the profile).

## Fit summary

**Stretch on the named tools, strong on the hard-to-hire parts.** William's decision (2026-09-21): apply, and pitch fast adaptation on the tool gap.

**Strong / bullseyes:**
- **Sensitive student data** (required, and stated twice in the posting): CDWTool is William's sole-authored pipeline sending VIU's student-level data (14 DDEF2000 tables incl. `STUDENT_PERSONAL_DATA`) to the BC Ministry's Central Data Warehouse via Oracle Data Pump + SFTP, with production security hardening. Plus CRA T4A/T2202A student and vendor filings, and SSO/SAML/privilege-class access control across VIU services. Verified 2026-09-21 against `src/CDWTool` (PROFILE.md corrected on master, `a54c5f9`).
- **Strong SQL:** deep Oracle SQL/PL/SQL and PostgreSQL (RLS, pgvector, PostGIS).
- **Only data engineer / sole ownership:** sole author and owner of CDWTool and several production systems.
- **Docs, runbooks, saying no kindly:** developer handbook, CDWTool runbooks and troubleshooting guides, EA `RUNBOOK.md`; trained TRU staff on institutional reporting and SQL tuning (maps to "teach analysts to self-serve").
- **AI tooling every day + set the review standard for model-written data work:** his core positioning; custom Oracle MCP server with read/write separation and row limits.
- **HubSpot data (nice to have):** read-only HubSpot API integration in the n8n ops dashboard.
- **Location:** lives in Kelowna. Matches the stated strong preference.

**Gaps (named honestly in the letter, one short paragraph):**
1. **Snowflake:** none. Warehouse experience is Oracle and PostgreSQL.
2. **dbt or equivalent modelling layer:** none. Bridge: dbt is SQL in version control with tests and CI review, which is how William already works.
3. **Orchestration tool** (Airflow/Dagster/Prefect): none. n8n and GitLab CI scheduling are adjacent; not claimed as equivalent.
4. **5+ years operating production data pipelines as a data engineer:** 12+ years of data-heavy application work and institutional reporting/ETL, not a data-engineer title.
5. **Python depth:** pipeline and tooling scripting (n8n workflow generator), not Python-first data engineering.
6. **SaaS / high-growth:** career is higher-ed, not SaaS.
7. **Metabase admin, FERPA/PIPEDA formally:** none claimed.

## Strategy
1. Header and summary lead on data: 12+ years with student and institutional data, deep SQL, regulated submissions.
2. Lead VIU experience with CDWTool (student-level ministry pipeline), then CRA filings, then access control. Modernization reframed as migrating systems onto new platforms with data and sign-on intact (maps to "ground-up rebuild" and "maps legacy data as customers migrate").
3. Letter follows William's directive: confident that the tool gap closes fast, backed by recent evidence (PostgreSQL vector search, n8n), with the gap named plainly in one paragraph so the screener sees he read the posting.
4. AI-native honesty: "AI developer who was a programmer first," ownership clause, supervisor vouches.
5. Availability: lives in Kelowna, in office 3x/week from day one, ready to give VIU notice.
6. "Why Minga" answer drafted separately (`why_minga.md`), personal and short, per their AI-at-Minga note.
7. Global preferences: no dogmap, no room booking, no Key Projects table, team of 18 (current, since a 2026 re-org; the feature-branch migration was led with the earlier six-person team, so the two claims are kept separate), plain human voice, no em dashes, no speed/commit bragging, HTML only.

## Open questions for William
- ~~Team size~~ Resolved 2026-09-21: William's VIU team is **18** since a re-org. Resume says "my team of 18" for the handbook and keeps the migration as the team's *earlier* move (it was done with six). PROFILE.md updated on master.
- DogMap's Python ETL (OSM + Overture into PostGIS) is the strongest Python evidence in the inventory but was excluded by the "no dogmap" preference. Left out; say the word to add one line.

## TODO
- [x] Fit analysis
- [x] job_description.md
- [x] Resume.md + Resume.html
- [x] cover_letter.md + cover_letter.html
- [x] why_minga.md
- [x] Audit (em dashes, stray tildes, stale dates) + commit
- [ ] Expert hiring-agent review (offered)
- [ ] William reviews + exports PDFs
- [ ] Optional before interview: small Snowflake trial + dbt Core project so the fast-ramp claim is demonstrable
