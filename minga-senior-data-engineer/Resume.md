# William Tucker
### Data-Focused Software Engineer · 12+ Years with Student and Institutional Data · Kelowna, BC

**250-619-8900** · **[william@williamtucker.ca](mailto:william@williamtucker.ca)** · **[williamtucker.ca](https://williamtucker.ca)** · **[LinkedIn](https://www.linkedin.com/in/william-tucker-06203044/)** · **[GitHub](https://github.com/billski)**

---

## Professional Summary

Software engineer with **12+ years** building the systems and data pipelines that BC post-secondary institutions run on, at Vancouver Island University and Thompson Rivers University. Most of that work sits close to student data: the daily exchange with StudentAid BC that releases student loan funding, regulated submissions to the provincial Central Data Warehouse, tuition-certificate filings to the CRA, and the access control that keeps all of it in the right hands. My SQL is deep (Oracle PL/SQL and PostgreSQL), and I write Python when a pipeline calls for it.

I work as an AI developer who was a programmer first. AI tooling writes a large share of my code, and the design, review, tests, and production accountability stay with me. My VIU supervisor will vouch for what's in production. I document what I build, including runbooks written for whoever operates it next.

> **Core competencies:** Data pipelines and ingestion · Advanced SQL (Oracle, PostgreSQL) · Sensitive and regulated student data · Access control and privacy · Documentation and runbooks · Working directly with data owners · AI-native development and review

---

## Technical Skills

| Category | Technologies |
|:--|:--|
| **Data & SQL** | Oracle (SQL, PL/SQL packages and stored procedures, schema design, views and grants, Data Pump), PostgreSQL (Supabase, Row-Level Security, pgvector, PostGIS), SQL Server (T-SQL), versioned migrations with verify and rollback scripts, query tuning |
| **Pipelines & Integration** | Daily file-based ETL (fixed-width government feeds, idempotent imports, scheduled jobs), Oracle Data Pump exports, SFTP/SSH delivery, CRA XML e-filing, REST and SOAP integrations, document ingestion and embedding pipelines, n8n workflows (queue mode, retries, error handling) |
| **Data Quality & Operations** | Golden-file output tests, hash-verified query rewrites, reconciliation against source systems, health endpoints and dead-man alerts, audit tables, submission history and duplicate prevention |
| **Languages** | SQL, PL/SQL, Python, C#, TypeScript, PowerShell |
| **Data Security & Privacy** | Privilege-based access control, Row-Level Security, SSO/SAML/ADFS, OAuth, least-privilege API tokens, secrets management, handling of student personal data |
| **Business Systems (API)** | HubSpot, Jira, GitHub, Google Workspace APIs, cloud ERP integration |
| **DevOps** | GitLab CI/CD, GitHub Actions, Docker Compose, health-check gating, rollback automation, Git (30+ repos) |
| **AI & LLMs** | Claude Code, Anthropic Claude API, custom MCP server authoring, RAG with pgvector, golden-file and eval tests |
| **Documentation** | Runbooks, troubleshooting guides, architecture references, developer handbook, mermaid diagrams |

---

## Experience

### Independent AI & Data Integration Development, William Tucker Solutions
*2026 – Present · Kelowna, BC (Remote)*

- **Built an internal operations dashboard on n8n** that pulls from 14 sources, including HubSpot, Jira, GitHub Actions, Vercel, Gmail, Google Calendar, and site health checks. Each source retries independently, so one failure degrades a single tile instead of the whole page, and the global error handler was proven with a deliberate failure. A Python script builds the workflow and deploys it from git through n8n's REST API. It runs on a Docker Compose stack with Postgres and Redis.
- **Built AscendAI**, an AI feasibility tool for land development, in pilot with a six-user validation group. I own its data platform: a scheduled pipeline that fetches, chunks, and embeds municipal bylaw documents from eight jurisdictions into PostgreSQL with pgvector, with content-hash deduplication and a blue-green activation model so re-ingestion never drops live data. A verification script checks every generated citation against the source text; it caught one jurisdiction where all 395 citations were wrong. Seventy-eight versioned migrations, Row-Level Security on every tenant table, a hash-chained audit log, and a cache that keys AI extraction results to schema and corpus hashes so nothing is paid for twice.
- **Built WTSAdmin**, a client and billing platform on Supabase. I designed the schema and the Row-Level Security policies that separate what admins and clients can see. Sole author.
- **Use AI tooling every day** in Claude Code. The design, review, and correctness of what ships stay with me.

---

### Programmer/Analyst, Vancouver Island University
*Jul 2016 – Present · Nanaimo, BC*

- **Built and run the daily data exchange between VIU Financial Aid and StudentAid BC**, the provincial system that releases student loan and grant funding. Each morning it pulls the province's 121-field disbursement file, imports it into Oracle without ever loading a file twice, and sends back the enrolment confirmations that release funds. It runs unattended in production with a health endpoint, a daily dead-man alert, and an independent watchdog pipeline, and its output format is held to the byte by golden-file tests. When 13 confirmations went unsent this September, I traced them with production SQL, retracted my first theory, and confirmed no funding was stuck. Sole author.
- **Built and own the pipeline that packages VIU's student-level data for the BC Ministry's Central Data Warehouse.** It exports 14 tables from Oracle with Data Pump (student records, registrations, achievements, credentials, and personal data), compresses them, and records every submission with duplicate protection per reporting period. When the Ministry moved intake from SFTP to SharePoint in April 2026, I migrated the delivery step. Production hardening included removing committed secrets, closing access-control gaps found in a security audit, and adding CSRF protection. I'm now adding a 21-check monitoring page after a nightly refresh job dropped 1.8 million rows and still reported success.
- **Own the CRA T2202 tuition certificate filing for about 11,000 students a year.** Replaced the legacy staff screen with a .NET 8 app, in production since August 2026, and fixed the Oracle PL/SQL engine's XML to meet the CRA 2026 schema. Rewrote a 75-second review query to run in a third of a second and proved it equivalent by hashing every column of the old and new output before it went live. Caught four data-quality defects in the extraction SQL before reviewers saw the data, including part-time months over-counted for 37 students. Also maintain the SQL behind T4A filings.
- **Find and close privacy gaps in student data access.** This year: replaced base-table grants that exposed dates of birth, home addresses, and free-text notes naming parents (3,430 rows) with narrow views and revoked the originals in production; narrowed a review view that showed 1,737 students where 571 was correct; scrubbed a real SIN and student names that had leaked into a repository's SQL and tests. Built an audit table that logs every access to disability-related data without ever recording which student. SINs are masked by default in every screen I ship.
- **Implement access control across VIU's web and .NET services**: SSO/ADFS, SAML, token validation, and privilege checks that fail closed, plus fixes from security audits and a penetration test, including a privilege-escalation bug where identity came from a client-writable cookie instead of the validated token.
- **Work daily in a large Oracle environment**: schema design, packages and stored procedures, and integration with the institution's credential vault so applications fetch database passwords at runtime instead of storing them. Every schema change I ship is a versioned migration with a verify script and a rollback (46 of them for the Registrar's applicant checklist system alone), and each database keeps a ledger of what was applied and when.
- **Move legacy systems onto new platforms with their data and sign-on intact.** Catalogued approx. 90 legacy applications with effort estimates and a conversion order, wrote the conversion guide VIU now uses as its reference, and shipped conversions to production, including the Facilities Information System. Built a schema dependency map, fed by a Python scanner, that traces every reference to an Oracle schema's objects across the whole codebase to file and line, so migrations start from evidence rather than memory. Built REST and SOAP integrations that feed a modern cloud ERP from legacy systems.
- **Authored a custom MCP server** that gives AI tools guarded access to VIU's Oracle databases, with read and write access separated and row limits enforced. Wired into the team's shared configuration. ([github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP))
- **Write the documentation people actually use**: runbooks, deployment and troubleshooting guides, architecture references, and the developer handbook my team of 18 onboards with. Every system I ship carries its own docs vault with runbooks written for whoever operates it next. Led the team's earlier move onto feature-branch development with CI/CD and automated tests.

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
