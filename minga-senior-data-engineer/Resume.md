# William Tucker
### Data-Focused Software Engineer · 12+ Years with Student and Institutional Data · Kelowna, BC

**250-619-8900** · **[william@williamtucker.ca](mailto:william@williamtucker.ca)** · **[williamtucker.ca](https://williamtucker.ca)** · **[LinkedIn](https://www.linkedin.com/in/william-tucker-06203044/)** · **[GitHub](https://github.com/billski)**

---

## Professional Summary

Software engineer with **12+ years** building the systems and data pipelines that BC post-secondary institutions run on, at Vancouver Island University and Thompson Rivers University. Most of that work sits close to student data: regulated submissions to the provincial Central Data Warehouse, tax-slip filings to the CRA, institutional reporting, and the access control that keeps all of it in the right hands. My SQL is deep (Oracle PL/SQL and PostgreSQL), and I write Python when a pipeline calls for it.

I work as an AI developer who was a programmer first. AI tooling writes a large share of my code, and the design, review, tests, and production accountability stay with me. My VIU supervisor will vouch for what's in production. I document what I build, including runbooks written for whoever operates it next.

> **Core competencies:** Data pipelines and ingestion · Advanced SQL (Oracle, PostgreSQL) · Sensitive and regulated student data · Access control and privacy · Documentation and runbooks · Working directly with data owners · AI-native development and review

---

## Technical Skills

| Category | Technologies |
|:--|:--|
| **Data & SQL** | Oracle (SQL, PL/SQL packages and stored procedures, schema design, Data Pump), PostgreSQL (Supabase, Row-Level Security, pgvector, PostGIS), SQL Server (T-SQL), migrations, query tuning |
| **Pipelines & Integration** | Oracle export pipelines, SFTP/SSH delivery, REST and SOAP integrations, document ingestion and embedding pipelines, n8n workflows (queue mode, retries, error handling), scheduled jobs |
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
- **Built AscendAI**, an AI feasibility tool for land development, now in pilot. Its ingestion pipeline loads a municipal bylaw corpus into PostgreSQL with pgvector alongside structured zoning rules. Golden-file tests validate those rules, and it only reports values it can trace to a source.
- **Built WTSAdmin**, a client and billing platform on Supabase. I designed the schema and the Row-Level Security policies that separate what admins and clients can see. Sole author.
- **Use AI tooling every day** in Claude Code. The design, review, and correctness of what ships stay with me.

---

### Programmer/Analyst, Vancouver Island University
*Jul 2016 – Present · Nanaimo, BC*

- **Built and own the pipeline that submits VIU's student data to the BC Ministry's Central Data Warehouse.** It exports 14 student-level tables from Oracle with Data Pump (student records, registrations, achievements, credentials, and personal data), compresses them, delivers them to the Ministry over SFTP, and archives each submission. Duplicate protection per reporting period, a job history, and SSO with privilege checks are built in. As part of production hardening I removed committed secrets, moved it to a dedicated Ministry service account, and added CSRF protection.
- **Maintain the SQL and XML behind CRA electronic filing** (T4A and T2202A slips for students and vendors), including data-quality fixes and the update to the 2026 filing standard.
- **Implement access control across VIU's web and .NET services**: SSO/ADFS, SAML, token validation, and privilege-class checks, plus a penetration-test hardening pass.
- **Work daily in a large Oracle environment**: schema design, packages and stored procedures, and integration with the institution's credential vault so applications fetch database passwords at runtime instead of storing them. Designed the schema, 12 SQL migrations, and 9 REST endpoints behind the SSO landing page's tag system.
- **Move legacy systems onto new platforms with their data and sign-on intact.** Catalogued approx. 90 legacy applications with effort estimates and a conversion order, wrote the conversion guide VIU now uses as its reference, and shipped conversions to production, including the Facilities Information System. Built REST and SOAP integrations that feed a modern cloud ERP from legacy systems.
- **Authored a custom MCP server** that gives AI tools guarded access to VIU's Oracle databases, with read and write access separated and row limits enforced. Wired into the team's shared configuration. ([github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP))
- **Write the documentation people actually use**: runbooks, deployment and troubleshooting guides, architecture references, and the developer handbook my team of 18 onboards with. Led the team's earlier move onto feature-branch development with CI/CD and automated tests.

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
