# William Tucker
### Software Engineer · Student Data Pipelines on Oracle and PostgreSQL · 12 Years at BC Universities · Kelowna, BC

**250-619-8900** · **[william@williamtucker.ca](mailto:william@williamtucker.ca)** · **[williamtucker.ca](https://williamtucker.ca)** · **[LinkedIn](https://www.linkedin.com/in/william-tucker-06203044/)** · **[GitHub](https://github.com/billski)**

---

## Professional Summary

Software engineer with **12+ years** on the systems that hold student data at BC post-secondary institutions. Today I build and run the production pipelines that carry that data between Vancouver Island University and the bodies that depend on it: the daily exchange with StudentAid BC that releases student loan funding, the student-level submission to the provincial Central Data Warehouse, and the tuition-certificate filing to the CRA, plus the access control that keeps all of it in the right hands. My SQL is deep (Oracle PL/SQL and PostgreSQL), and my Python is the scanner, ETL, and deployment tooling around it.

I work as an AI developer who was a programmer first. AI tooling writes a large share of my code, and the design, review, tests, and production accountability stay with me. My VIU supervisor will vouch for what's in production. I document what I build, including runbooks written for whoever operates it next.

> **Core competencies:** Production data pipelines · Advanced SQL (Oracle, PostgreSQL) · Sensitive and regulated student data · Access control and privacy · Data quality and reconciliation · Documentation and runbooks · Working directly with data owners · AI-native development and review

---

## Technical Skills

| Category | Technologies |
|:--|:--|
| **Data & SQL** | Oracle (PL/SQL packages, schema design, views and grants, Data Pump, query tuning), PostgreSQL (Supabase, Row-Level Security, pgvector, PostGIS), SQL Server (T-SQL), versioned migrations with verify scripts, rollbacks, and applied-state ledgers |
| **Pipelines** | Daily file-based extract-and-load (fixed-width government feeds, file-level idempotency, automatic backfill), bulk exports, incremental embedding ingest with content-hash dedup and write-audit-publish activation, SFTP/SSH, REST |
| **Scheduling & Orchestration** | Windows Task Scheduler, GitLab scheduled pipelines, GitHub Actions cron, n8n (queue mode, retries, error handling). Not yet: Airflow, Dagster, dbt |
| **Data Quality & Observability** | Byte-exact expected-output tests, column-hash data diffs before promotion, reconciliation against source, freshness checks and dead-man alerts, row-count floors, append-only check history, static lineage mapping |
| **Privacy & Access** | Least-privilege views over base tables, Row-Level Security, segregation of duties, masked identifiers by default, audit logging without subject identifiers, PII scrubbing, retention jobs, SSO/SAML/OAuth |
| **Languages** | SQL, PL/SQL, Python (pipeline and tooling), C#, TypeScript, PowerShell |
| **Business Systems** | HubSpot, Jira, GitHub, Google Workspace APIs |
| **CI/CD & AI Tooling** | GitLab CI, GitHub Actions, Docker Compose, Claude Code, custom MCP server, RAG with pgvector, eval tests |
| **Documentation** | Runbooks, decision registers, architecture references, team handbook |

---

## Experience

### Programmer/Analyst, Vancouver Island University
*Jul 2016 – Present · Nanaimo, BC (remote from Kelowna)*

- **Built and run VIU Financial Aid's daily exchange with StudentAid BC**, the provincial system that releases student loan and grant funding. Each morning it pulls the province's 121-field disbursement file, loads it into Oracle without ever loading a file twice, backfills missed days on its own, and sends back the confirmations that release funds. The first production run cleared a seven-day backlog with no duplicate loads. It runs unattended with a health endpoint, a daily dead-man alert, and an independent watchdog pipeline, and its output is golden-file tested to the byte. When 13 confirmations went unsent this September, I traced them with production SQL, retracted my first theory, confirmed no funding was stuck, and recorded the finding in the pipeline's decision register. Sole author.
- **Built and own VIU's pipeline to the BC Ministry's Central Data Warehouse.** It exports 14 Oracle tables with Data Pump (student records, registrations, achievements, credentials, personal data), compresses them, and logs every submission with duplicate protection per reporting period. When the Ministry moved intake from SFTP to SharePoint in April 2026, I removed the SFTP leg; the upload is a manual SharePoint drop today. Hardening: removed committed secrets, closed access-control gaps from a security audit, added CSRF protection. On a feature branch now: a 21-check monitoring page with row-count floors, after a nightly refresh dropped 1.8 million rows and still reported success.
- **Own the application behind the CRA T2202 tuition filing for about 11,000 students a year.** Replaced the legacy staff screen with a .NET 8 app, in production since August 2026, and fixed the XML in the Oracle PL/SQL engine (which predates me) for the CRA's 2026 schema. Rewrote a 75-second review query to run in a third of a second and proved it with a column-hash data diff of the old and new output over 20,000 rows before promotion. Caught four data-quality defects in the extraction SQL before reviewers saw the data, including part-time months over-counted for 37 students. Also maintain the T4A filing SQL.
- **Find and close privacy gaps in student data access.** This year: replaced grants exposing dates of birth, home addresses, and free-text notes naming parents (3,430 rows) with narrow views and revoked the originals in production; fixed a review view showing 1,737 students where 571 was correct; scrubbed a real SIN and student names that had leaked into a repository's SQL and tests. Built an audit table that logs disability-data access without recording which student. Registrar and Accessibility Services roles are disjoint in production, and nobody holds both. SINs are masked by default everywhere I ship.
- **Every schema change I ship is a versioned migration** with a post-apply verification script, a rollback where the change is destructive, and a per-environment ledger of what was applied and when (46 migrations for the Registrar's applicant checklist system alone). Daily work in a large Oracle environment: packages and stored procedures, and integration with the institution's credential vault so applications fetch database passwords at runtime instead of storing them.
- **Built a static lineage map** from Oracle schema objects to every code location that reads or writes them, across roughly 90 legacy applications, with read/write classification and confidence scoring; a Python scanner feeds it. One schema alone resolved to 7,152 references. Migrations now start from evidence rather than memory.
- **Move legacy systems onto new platforms with their data and sign-on intact.** Catalogued those 90 applications with effort estimates and a conversion order, wrote the conversion guide VIU now uses as its reference, and shipped conversions to production, including the Facilities Information System.
- **Implement access control across VIU's web and .NET services**: SSO/ADFS, SAML, token validation, and privilege checks that fail closed, with fixes from security audits and a penetration test.
- **Authored a custom MCP server** that gives AI tools guarded access to VIU's Oracle databases, with read and write separated and row limits enforced. Wired into the team's shared configuration. ([github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP))
- **Write the documentation people actually use**: runbooks, decision registers, troubleshooting guides, architecture references, and the developer handbook my team of 18 onboards with. Led the team's earlier move onto feature-branch development with CI/CD and automated tests.

---

### Independent AI & Data Integration Development, William Tucker Solutions
*2026 – Present · Kelowna, BC (part-time, alongside VIU)*

- **Built AscendAI's data pipeline and schema**, an AI feasibility tool for land development in pilot with a six-user validation group. A scheduled pipeline fetches, chunks, and embeds municipal bylaw documents from eight jurisdictions into PostgreSQL with pgvector, with content-hash dedup so re-ingestion is incremental, and write-audit-publish activation so new chunks supersede live rows only after verification. A verification script checks every generated citation against the source text; it caught, before anything shipped, one jurisdiction where all 395 citations were wrong. Seventy-eight versioned migrations, Row-Level Security on every tenant table, a hash-chained audit log, a retention job with row-count floors (dry-run today), and AI extraction results cached under a schema-and-corpus hash with token counts stored per call so nothing is paid for twice.
- **Built an internal operations dashboard on n8n** that ingests from 14 sources, including HubSpot, Jira, and GitHub. Each source retries independently so one failure degrades one tile, not the page, and the global error handler was proven with a deliberate failure. A Python script builds the workflow from code and deploys it from git through n8n's REST API. Self-hosted on Docker Compose with Postgres and Redis on my own workstation; outbound alerts are gated until I trust them.
- **Built WTSAdmin**, a client and billing platform on Supabase. I designed the schema and the Row-Level Security policies that separate what admins and clients can see. Sole author.

---

### Software Analyst, Thompson Rivers University
*Jan 2013 – Jul 2016 · Kamloops, BC*

- **Built the Employee Survey system** on Groovy Grails and Oracle, including the reports and ETL jobs behind it across Finance, HR, Payroll, and Student departments.
- **Designed and built the TRU Student ID Card system** in Java. It was used by thousands of students and integrated with BC Transit buses and the City of Kamloops.
- **Trained staff on institutional reporting, code review, and SQL tuning**, and presented on Groovy Grails at the BCNET 2015 conference.

---

### Institutional Data Analyst and Report Coordinator (Co-op), Thompson Rivers University
*May 2012 – Mar 2013 · Kamloops, BC*

- Institutional reporting on Oracle data with SQL and PL/SQL, plus PHP development during the co-op term.

---

## Education

| Degree | Institution · Years |
|:--|:--|
| **Computer Science Diploma** | Thompson Rivers University · 2010 – 2013 |
| | *Computer Systems: Operations & Management, Computer Science* |
| **Journeyman Marine Technician** *(prior trade career, pre-software)* | British Columbia Institute of Technology · 2003 – 2007 |

---

*Last updated: September 2026*
