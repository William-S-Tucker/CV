# William Tucker
### Senior Software Engineer · AI Engineer · Kelowna, BC

**250-619-8900** · **[william@williamtucker.ca](mailto:william@williamtucker.ca)** · **[williamtucker.ca](https://williamtucker.ca)** · **[LinkedIn](https://www.linkedin.com/in/william-tucker-06203044/)** · **[GitHub](https://github.com/billski)**

---

## Professional Summary

Senior software engineer with **12+ years** designing and shipping backend systems, data pipelines, and full-stack applications, with current focus on AI-native delivery — direct **Anthropic Claude API** integrations, a custom **Oracle MCP server** authored for my team, and AI-augmented modernization shipping in days instead of months.

Strong in **C#/.NET**, **Oracle**, **REST APIs**, and **CI/CD**; experienced in legacy modernization (Classic ASP to .NET), ETL, and technical leadership. I use AI agents to accelerate delivery: the same modernization work that once took months now ships in days, with full test coverage and CI/CD. On my own time, I built [dogmap.ca](https://dogmap.ca) — a production PWA with Next.js, Supabase, PostGIS, OAuth, RLS, and JWT-protected API routes.

I care about infrastructure, security, and knowledge transfer. I document everything so teams own what gets built.

> **Core competencies:** Backend & integrations · AI-accelerated development · Legacy modernization · CI/CD & DevOps · Security (SSO, OAuth, RLS, JWT) · Oracle & SQL · Cloud (Supabase, Vercel) · Technical leadership & documentation

---

## Technical Skills

| Category | Technologies |
|:--|:--|
| **Languages** | C#, Java, JavaScript, TypeScript, Python, SQL, PL/SQL, T-SQL, Groovy, VBScript, PowerShell, XML |
| **Backend / APIs** | .NET 8, ASP.NET Core, Blazor Server, Classic ASP, REST, SOAP, Dapper, Entity Framework, SignalR, Supabase |
| **Data** | Oracle, SQL Server, PostgreSQL, PostGIS (geospatial), stored procedures, schema design, ETL (Talend) |
| **Frontend** | Next.js, React, Blazor, TypeScript, TailwindCSS, Bootstrap 4/5, HTML/CSS, jQuery, MapLibre GL |
| **AI & LLMs** | Anthropic Claude API (direct SDK integration), GPT-5, Claude Code, custom MCP server authoring (TypeScript + `oracledb`), tool use / function calling, prompt engineering, AI-agent-driven development, context document design |
| **Reporting** | QuestPDF, Crystal Reports, PL/SQL, T-SQL |
| **DevOps / Tools** | Git (multi-repo, 30+ repos), GitLab CI/CD, Vercel, PowerShell, YAML, SSH/SFTP, multi-environment release (dev/test/prod) |
| **Cloud** | Vercel, Supabase (Auth, DB, Storage), cloud ERP integrations (REST/SOAP), env-based config |
| **Testing** | Unit testing, integration testing, code review |
| **Security** | SSO/ADFS, SAML, token validation, OAuth (Google, Apple), Row Level Security (RLS), JWT, CORS architecture, role-based access, rate limiting |
| **Other** | IIS, Windows Server, Grails, Agile/Scrum |

---

## Experience

### AI Engineer & Independent Developer — William Tucker Solutions
*2026 – Present · Kelowna, BC (Remote)*

- **Built williamtucker.ca production AI chatbot** using the Anthropic Claude API (`@anthropic-ai/sdk` direct SDK integration) — custom system prompts, rate limiting, session management, Node.js/Express backend, deployed to Railway.
- **Built WTSAdmin + client portal** — Next.js 16 (App Router, Turbopack) + Supabase (PostgreSQL + Auth + Storage + Row-Level Security) + Stripe + Resend + React PDF; 9 admin pages, 5 client portal pages, magic-link auth, PDF invoicing, route protection via Next.js 16 `proxy.ts`. Sole author, 4 days end-to-end.
- **AI-augmented delivery practice** with Claude Code, Cursor, and GPT-5 — modernization work that previously took months now ships in days with CI/CD and automated tests; planning, debugging, and design decisions stay with me.

---

### Programmer/Analyst — Vancouver Island University
*Jul 2016 – Present · Nanaimo, BC*

- **Delivered a 3-project sprint in 12 days (2026-04-09 → 2026-04-20)** using parallel AI-agent sessions — greenfield .NET 8 Blazor SSO portal (~50 commits; standalone SAML login, impersonation with privilege-check hardening, pen-test pass, CSP compliance), artifact-based SRS deploy pipeline (~17 commits; Pester v3 test harness, pre-deploy snapshot retention, manual prod gate, Teams Adaptive Card notify), and a team-wide Obsidian documentation vault (~40 commits; Oracle SSO-chain schema reference, Classic ASP shared-includes reference, end-to-end SSO traces with mermaid diagrams). See [PROFILE.md](PROFILE.md) for full breakdown and independent git verification.
- **Led full modernization** of Facilities Information System from Classic ASP to .NET 8 Blazor Server — sole author, ~7 weeks (66 commits across 14 branches); preserved Oracle backend and cookie-based SSO; GitLab CI with test/build/deploy stages; architecture adopted as institutional conversion guide. Now in production.
- **Rebuilt room booking system** as a .NET 8 Blazor Server app — sole author, 5 days end-to-end (49 commits across 24 branches), replacing a legacy Oracle PL/SQL system (~21K LOC, 14K-line `findroom.sql`); mobile-responsive with real-time conflict detection. Currently in QA, technically ready for production; go-live pending organizational approval.
- **Built SSO landing page tag system** — designed Oracle schema (3 tables, sequences, triggers, cascading deletes), implemented 9 REST API endpoints in C#, and rewrote the entire landing page UI with modern patterns (slide-over panels, toast notifications, inline prompts replacing alert/confirm); includes JSON and Mermaid diagram export.
- **Authored a custom Oracle MCP server** in TypeScript (`@modelcontextprotocol/sdk` + `oracledb`) extending Claude Code with multi-database Oracle tooling — thick-mode LDAP TNS resolution, per-DB connection pools, read/write separation guardrails, row-limit enforcement; wired into the team's shared `.mcp.json`. Daily driver against ODEV. ([github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP))
- **Replaced Crystal Reports with QuestPDF** in the Building Information System; eliminated legacy licensing dependency with a modern .NET-native reporting library.
- **Built CDW submission tool** — .NET web app with SignalR real-time progress, SSH/SFTP file transfer via SSH.NET, service account management, and GitLab CI pipeline with automated tests.
- **Established local development environment** for a team of six; transitioned from server-based development to local feature-branch workflow across 30+ git repositories; designed whitelist `.gitignore` strategy, multi-repo rollback procedures, and health-check-gated GitLab CI/CD pipelines across dev, test, and prod.
- **Authored modernization assessments** with cost-benefit analysis and phased conversion plans for legacy Classic ASP applications; produced institutional conversion guide used as a reference for future projects.
- **Implemented and documented** authentication and access control across web and .NET API services (SSO/ADFS, SAML, token validation, privilege checks); designed dynamic CORS architecture enabling multi-developer local development.
- **Designed team developer handbook** with stakeholder input; single source of truth for branching strategy, pipelines, and onboarding.
- **Developed integrations** from legacy systems to a modern cloud ERP using REST/SOAP in C# .NET and Entity Framework.
- **Delivered compliance work** — reviewed and updated SQL/XML for CRA T4A/T2202A electronic filing (2026 standards); resolved XML output and parsing issues for student and vendor extracts.
- **Participate in Agile/Scrum** ceremonies; contribute to code reviews and unit/integration testing.

---

### Software Analyst — Thompson Rivers University
*Jan 2013 – Jul 2016 · Kamloops, BC*

- **Designed and built** the T.R.U. Student ID Card system in Java; used by thousands of students, integrated with BC Transit buses and City of Kamloops.
- **Created** Employee Survey system on Groovy Grails stack with Oracle; comprehensive reports and ETL jobs across Finance, HR, Payroll, and Student departments.
- **Delivered** Groovy Grails presentation at BCNET Conference 2015; trained staff on institutional reporting, code review, and SQL tuning.

---

### Institutional Data Analyst — Thompson Rivers University
*Sep 2012 – Mar 2013 · Kamloops, BC*

- Reporting on Oracle data using SQL and PL/SQL.

---

### Institutional Report Coordinator (Co-op) — Thompson Rivers University
*May 2012 – Dec 2012 · Kamloops, BC*

- SQL, PL/SQL, and PHP development for institutional reporting.

---

## Education

| Degree | Institution · Years |
|:--|:--|
| **Computer Science Diploma** | Thompson Rivers University · 2010 – 2013 |
| | *Computer Systems: Operations & Management, Computer Science* |
| **Journeyman Marine Technician** | British Columbia Institute of Technology · 2003 – 2007 |

---

## Certifications

| Certification | Issuer | Date |
|:--|:--|:--|
| Java and Hibernate | TestDome | Aug 2021 |
| SQL (Intermediate) | HackerRank | Aug 2021 |

---

## Key Projects

| Project | Outcome |
|:--|:--|
| **Facilities Information System modernization** | Classic ASP → .NET 8 Blazor Server; same Oracle schema and SSO; sole-author ~7 weeks (66 commits, 14 branches); in production; reference implementation for institutional conversion guide. |
| **Room booking system** | Legacy Oracle PL/SQL room booking system (~21K LOC, 14K-line `findroom.sql`) → .NET 8 Blazor Server; sole author, 5 days end-to-end; mobile-responsive, real-time conflict detection; in QA, blocked on org approval. |
| **SSO landing page + tag system** | Rewrote SSO landing page UI; designed and built database-backed tag/layer system (Oracle schema, 9 REST endpoints, 12 SQL migrations, JSON/Mermaid export); modern UI with slide-over panels and toast notifications. |
| **Crystal Reports → QuestPDF** | Replaced legacy licensed reporting in BIS with .NET-native QuestPDF; eliminated licensing dependency. |
| **Local dev environment & CI/CD** | Transitioned 30+ repos from server-based to local feature-branch development; GitLab pipelines with health-check gates, rollback automation, and multi-environment release. |
| **Developer handbook** | Designed with team input; central resource for workflow, branching, pipelines, and onboarding. |
| **[dogmap.ca](https://dogmap.ca)** *(side project)* | PWA for BC dog owners. Next.js, TypeScript, Supabase (PostgreSQL, PostGIS, Auth, Storage), Vercel. RLS on all tables, OAuth (Google, Apple), JWT in API routes, role-based access, admin dashboard, moderation queue. Live at [dogmap.ca](https://dogmap.ca). |
| **[williamtucker.ca](https://williamtucker.ca)** | Production website with **live AI chatbot built directly on the Anthropic Claude API** (`@anthropic-ai/sdk`) — custom system prompts, rate limiting, session management, Node.js/Express backend; Tailwind CSS, deployed to Railway. |
| **WTSAdmin + client portal** | Full-stack SaaS shipped in 4 days, sole author. Next.js 16 (App Router, Turbopack) + Supabase (PostgreSQL + Auth + Storage + RLS) + Stripe + Resend + React PDF. 9 admin pages, 5 client portal pages, magic-link auth, PDF invoicing, route protection via Next.js 16 `proxy.ts`. |
| **Oracle MCP server** | Custom MCP server in TypeScript (`@modelcontextprotocol/sdk` + `oracledb`) giving Claude Code first-class Oracle tools across multiple databases — thick-mode LDAP, multi-DB connection pools, read/write separation, row-limit guardrails. Authored in a day, daily driver against ODEV. [github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP) |

---

*Last updated: April 2026*
