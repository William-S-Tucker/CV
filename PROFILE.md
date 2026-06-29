# William Tucker — Master Profile

**Purpose:** Comprehensive, evidence-backed reference for all job-application work. Every claim below is verified against local repositories or live sites — no resume-optimized embellishment. When tailoring a resume or cover letter, cherry-pick from here and preserve the honesty. When asked "am I qualified for X?", read this first.

**Last verified:** 2026-04-20 (against local working copies of `D:\code\webroot_dev`, `C:\code\williamtucker`, `C:\code\wtsadmin`, `C:\code\dogmap`; §4.1 VIUPortal row and §4.7 re-verified 2026-04-20 by an independent Claude Code agent against `webroot_dev`, `webroot_dev/src/portal`, and `webroot_dev/srs` git history. §5.3 (AscendAI), §6.2 (wts-ai-docs), and the §6.1 Python-pipeline / §8 Python-honesty notes added 2026-05-29, verified against `D:\code\ascendai` git history, the `billski/wts-ai-docs` repo, and `D:\code\DogMap/scripts`).

---

## 1. Identity & contact

- **Name:** William Tucker
- **Location:** Kelowna, BC, Canada
- **Email:** william@williamtucker.ca
- **Phone:** 250-619-8900
- **Website:** [williamtucker.ca](https://williamtucker.ca)
- **LinkedIn:** [linkedin.com/in/william-tucker-06203044](https://www.linkedin.com/in/william-tucker-06203044/)
- **GitHub:** [github.com/billski](https://github.com/billski)
- **Git author identities seen in commits:** `Bill Tucker <bill.tucker@viu.ca>`, `William Tucker <bill.tucker@viu.ca>`, `Billski <Bill@bill-tucker.com>`, `tuckerb` (domain account)

---

## 2. Career timeline

| Dates | Role | Employer | Location |
|---|---|---|---|
| 2026 – present | Founder & AI Consultant | **William Tucker Solutions (WTS)** | Kelowna, BC (remote) |
| Jul 2016 – present | Programmer / Analyst | **Vancouver Island University (VIU)** | Nanaimo, BC |
| Jan 2013 – Jul 2016 | Software Analyst | Thompson Rivers University (TRU) | Kamloops, BC |
| Sep 2012 – Mar 2013 | Institutional Data Analyst | TRU | Kamloops, BC |
| May 2012 – Dec 2012 | Institutional Report Coordinator (Co-op) | TRU | Kamloops, BC |

**Total professional software experience:** ~12 years (since 2013, excluding co-op).
**Pre-software (prior trade career):** Journeyman Marine Technician (BCIT, 2003–2007) — worked on **marine engines and drives**, not software. List once as a neutral factual "previous career" line only. Do **not** frame it as relevant to software, an "engineering mindset," domain insight, or transferable troubleshooting. It is biography, not a software asset. See §10 framing rule.

---

## 3. Education & certifications

| Credential | Institution | Dates |
|---|---|---|
| Computer Science Diploma (Computer Systems: Operations & Management, Computer Science) | Thompson Rivers University | 2010 – 2013 |
| Journeyman Marine Technician | British Columbia Institute of Technology | 2003 – 2007 |
| Java and Hibernate | TestDome | Aug 2021 |
| SQL (Intermediate) | HackerRank | Aug 2021 |

---

## 4. VIU work — verified project inventory

VIU's web platform lives in `C:\code\webroot_dev` (the "base repo" for shared web infrastructure) plus many application repos under `src/` and elsewhere on the server. The following are catalogued from actual git history.

### 4.1 Modernizations shipped as near-sole author (2026)

| Project | Source repo | Dates | Duration | Commits (WT/total) | Branches | Status |
|---|---|---|---|---|---|---|
| **BIS** (Facilities Information System, FIS → .NET 8 Blazor) | `src/bis_source` | 2026-02-25 → 2026-04-15 | ~7 weeks | 66/67 | 14 | In production |
| **RoomBooking** (legacy Oracle PL/SQL app → .NET 8 Blazor) | `src/roombooking_source` | 2026-02-27 → 2026-03-03 | **5 days** | 49/49 | 24 | In QA, technically ready; go-live blocked on organizational approval (boss will vouch) |
| **VIUPortal** (Classic ASP SSO landing → .NET 8 Blazor Server) | `src/portal` | 2026-04-09 → 2026-04-20 | 12 days | ~50/~50 | 18 | Active development |
| **SABC SIMS integration** | `src/sabc_source` | 2026-04-10 → 2026-04-11 | **2 days** | 6/6 | 9 | Shipped |
| **CDWTool** (Canadian Data Warehouse submission tool) | `src/CDWTool` | 2025-11-20 → ongoing | ~5 months | 60/60 | 18 | In production, pivoting to SharePoint |
| **project-template** (scaffold for future modernizations) | `src/project-template` | 2026-04-11 | 1 day | 3/3 | 6 | Reference template |

**Notable technical depth per project (all verified in source):**

**BIS (the reference implementation):**
- .NET 8 Blazor Server, Dapper, `Oracle.ManagedDataAccess.Core`
- Cookie-based SSO reusing the same `WEB_LOGIN_TOKEN` / `WEB_LOGIN_USERNAME` cookies as the Classic ASP apps — no dual-auth required
- `PersistentComponentState` solution to the Blazor Server SSR/Interactive prerendering auth problem (this is a known hard gotcha; he solved it cleanly)
- `IniFileResolver` tree-walk pattern for finding `databases_config.ini` regardless of IIS `ContentRootPath` quirks
- Oracle password vault integration via `MD.DB_CREDENTIAL_MGMT.P_GET_PWD` stored procedure
- Privilege-class checking via `authdb.authdb_pkg.F_UserHasPrivCls`
- Cascading auth state from `MainLayout` to pages (not per-page injection)
- GitLab CI with test + build + deploy-dev stages, JUnit + Cobertura coverage artifacts
- `appcmd stop apppool` synchronization before `robocopy /MIR` to release DLL file handles; app pool restart in `finally` block
- Server-side token validation + mutation authz guards added after initial release (commit `0fecb3c`)
- Full modernization playbook authored: `docs/modernization/fis-bis-modernization-guide.md` — the institutional reference for future Classic ASP → .NET 8 conversions

**RoomBooking:**
- .NET 8 Blazor Server, same stack and patterns as BIS
- ~21,410 LOC total (C# + Razor + SQL), of which `findroom.sql` alone is 14,349 lines of Oracle PL/SQL
- iPhone-crash fix: persisted Data Protection keys across deploys (commit `488d63e`)
- Circuit-crash fix: guarded SSO redirect against response-already-started (`0ee39bb`)
- Disabled antiforgery enforcement on Blazor endpoints where appropriate (`b1b037f`)
- App Pool Modify rights granted for logs + DP-key folders via deploy script (`923a692`, `0a37ed1`)

**VIUPortal:**
- .NET 8 Blazor Server (scaffolded on .NET 10, retargeted to .NET 8 on day 1 — commit `31f48ae` — for Windows Server 2012 compatibility)
- Replaces the legacy `sso/viulogin.html` Classic ASP landing
- Direct ADFS SAML flow (`0cab45c`)
- Impersonation with original-user privilege checks (`2a30f0f`) — CSP-compliant cookie helper instead of `eval` (`0cb8b87`)
- Persistent favorites, keyboard shortcuts, VIUWEB modules, session polling
- CSP hardening, tag management UX parity with legacy (`f65172e`)
- Portfolio heatmap UI, app-type filter, tag dropdown
- Per-app Obsidian vault init (`bc6ece7`) — Phase 3c pilot for the federation plan
- Deploy excludes `Config/` from robocopy mirror to preserve SAML certs

**CDWTool:**
- .NET web app with SignalR real-time progress (`JobProgressHub`)
- **SSH to Linux** file transfer via SSH.NET (`Services/SshService.cs`, ED25519 key in `App_Data/id_ed25519`)
- Originally SFTP-based; pivoting to SharePoint transition (April 2026) — commits show refactor removing `SftpService`, `EmailService`, `MailKit`
- Integrated with planning-first workflow: `docs/superpowers/plans/` and `docs/superpowers/specs/` directories in the repo
- Written with extensive deploy docs, quick-reference, local-dev setup, Oracle export troubleshooting guides
- Planning + debugging iteration visible in commit history — not one-shot AI output

### 4.2 Contributions to existing .NET services (2025 local-dev conversion)

These services pre-existed (some since 2017–2018). William's contributions were primarily enabling local development after the team migrated off the network-drive edit-in-place model.

| Repo | WT commits / total | Recent activity | Nature of contribution |
|---|---|---|---|
| `src/LandingService` | 75 / 110 | 2026-04-08 last | **Major recent work** — tag export, permissions split, mermaid diagram generation, allapps endpoint, hidden apps support |
| `src/FledgerService` | 20 / 64 | 2022-12 last | Earlier contributor; not recent |
| `src/ADFSConnection` | 13 / 68 | 2025-12-12 last | local-dev CORS + path mappings, initialization fixes |
| `src/ADFSService` | 6 / 50 | 2025-12-12 last | local-dev CORS, validate endpoint response format, preflight handling |
| `src/DbInstanceApiController` | 5 / 28 | 2025-12-13 last | local DB instance config, local.viu.ca CORS |
| `src/XMLRequest_source` | 3 / 4 | 2025-11-04 last | localhost IP bypass for token validation |

**Pattern:** Each service received targeted changes enabling developers to run the full VIU stack locally — CORS for `local.viu.ca`, localhost IP bypass for token validation, local Oracle provider switching (OraOLEDB vs MSDAORA), local DB instance configuration. This was coordinated work across ~5 repos in Nov–Dec 2025.

### 4.3 Shared infrastructure and documentation authored

- **`webroot_dev` root repo itself**: 127 commits across 7 months (Sep 2025 – Apr 2026). Primary author since the Post-Migration Dev Restore in Oct 2025. Added:
  - `.gitlab-ci.yml` with validate + deploy stages and PowerShell scripts (`deploy.ps1`, `rollback.ps1`, `test.ps1`)
  - Whitelist `.gitignore` pattern enforcing base-repo/app-repo boundary
  - Root `CLAUDE.md` (team-wide agent guidance, branching rules, architecture, documentation governance)
  - Shared `.claude/settings.json` with PostToolUse hook keeping docs fresh on code changes
  - MCP server integration via `.mcp.json` — wires in the custom Oracle MCP server (see §4.6)

- **`docs/` Obsidian vault** under `webroot_dev`:
  - Authored the full **webroot modernization assessment** (`docs/modernization/webroot-modernization-assessment.md`) catalog of ~90 apps, with effort estimates and recommended order
  - Authored the **FIS → BIS modernization guide** (`docs/modernization/fis-bis-modernization-guide.md`) — institutional reference
  - Authored the **Classic ASP → .NET conversion guide** and **VIU app template guide**
  - Designed the **per-app vault federation plan** (`docs/_meta/per-app-vault-federation-plan.md`) — "AI-first framing" for knowledge bases across the app portfolio
  - Wrote the trace-and-reference Obsidian pattern: per-object reference docs + end-to-end trace docs with mermaid diagrams and `file:line` anchors (canonical examples in `docs/oracle/` and `docs/auth-sso/`)
  - Authored MOCs (Maps of Content) for modernization, Oracle, auth-sso, and infra

- **`es-handbook/`** (`C:\code\webroot_dev\es-handbook`): VIU Enterprise Systems Handbook, MkDocs static site with its own `.gitlab-ci.yml` + `sync.ps1` deploy. Topics: SSH setup, git safe-directory fixes, local dev setup, new-dev checklist, feature branch workflow, CI/CD pipeline overview, hotfix workflow, rollback guide, branching strategy diagrams. Authored with Claude.

### 4.4 "Network-drive-to-local-dev" team migration

**Before William (pre–October 2025):** VIU developers edited directly on `\\polk-dev.it.int.viu.ca\webroot\` — every edit was a shared server-staged edit. No git branches, no local iteration, no CI/CD safety nets.

**William's migration work:**
- Coordinated the Post-Migration Dev Restore (Oct 2025)
- Established local IIS + per-machine dev environments
- Added `local.viu.ca` CORS and localhost token-validation bypass across the 5 .NET services listed in §4.2
- Designed and deployed the whitelist `.gitignore` strategy (base repo tracks only shared infra, app repos stay separate)
- Built the GitLab CI/CD pipeline with health-check gating, deploy automation, and rollback
- Authored the es-handbook onboarding docs so the rest of the team could adopt the new model
- Set up branch protection on `main` and `develop` (GitLab-side, plus repo-side Claude settings for agent safety)

This is a **culture + infrastructure migration**, not just a code change. It affected a team of six and 30+ application repositories.

### 4.5 Other VIU work (from Resume / HANDOFF context, not directly verified in webroot_dev)

- **Crystal Reports → QuestPDF** replacement in BIS — .NET-native reporting, eliminated legacy licensing dependency
- **SSO landing page tag system** — Oracle schema (3 tables, sequences, triggers, cascading deletes), 9 REST API endpoints in C#, 12 SQL migrations, JSON + Mermaid export
- **CRA compliance work** — SQL/XML review and updates for T4A/T2202A electronic filing (2026 standards), resolved XML output and parsing issues for student/vendor extracts
- **Cloud ERP integration** — legacy system → modern cloud ERP via REST/SOAP in C# .NET and Entity Framework

### 4.6 Custom Oracle MCP server (authored for VIU daily use)

- **Repo:** `C:\code\OraclePlugin` ([github.com/billski/Claude-Oracle-MCP](https://github.com/billski/Claude-Oracle-MCP))
- **Timeline:** 2026-04-10 — authored and shipped in a day, sole author (commit `267f6fb`)
- **Stack:** TypeScript (ESM) + `@modelcontextprotocol/sdk` ^1.29.0 (`McpServer` + `StdioServerTransport`) + `oracledb` ^6.10.0 + zod; Node.js 20.6+; compiled to `dist/` via `tsc`
- **Wired into:** `webroot_dev/.mcp.json` as a project-scoped stdio server; README also documents user-scope install
- **Tools exposed (5):** `query` (read-only SELECT/WITH), `execute` (DML/DDL with opt-in autoCommit), `list_schemas`, `list_tables`, `describe_table` (columns + `all_col_comments`)
- **Notable engineering choices:**
  - **Thick-mode init** via `oracledb.initOracleClient()` so LDAP TNS name resolution works — required for VIU's Oracle env; most sample Oracle MCPs skip this and break on LDAP aliases
  - **Multi-database support** in a single server: `ORACLE_DATABASES` env list → one pool per connect string (poolMin 1 / poolMax 4), selectable per call; uncommon in public MCP examples
  - **Read/write separation guardrail:** `query` validates statement starts with SELECT/WITH before hitting the DB — DML/DDL must go through `execute`
  - **Row-limit enforcement:** `maxRows` default 500, hard cap 10000, with explicit truncation messaging back to the agent
  - **Cross-schema introspection** via `ALL_*` views (not `USER_*`), scoped to the connected user's privileges
  - Optional Oracle wallet support (`ORACLE_WALLET_LOCATION`, `ORACLE_WALLET_PASSWORD`)
- **Credentials:** `ORACLE_USER` / `ORACLE_PASSWORD` env vars (deliberately does NOT use the VIU `MD.DB_CREDENTIAL_MGMT.P_GET_PWD` vault pattern — scope call for an external MCP tool)
- **Status:** Active developer-side daily driver against ODEV for VIU work (confirmed 2026-04-15); not wired to production; team adoption beyond self unverified
- **Significance:** Demonstrates *building* AI tooling, not just using it — a custom MCP server extending Claude Code with Oracle as a first-class tool, deployed into the team's shared config

### 4.7 April 2026 delivery sprint — parallel AI-session pattern (12 days)

Across a 5-week window (2026-03-16 → 2026-04-20), with output concentrated in a 12-day intensive run (2026-04-09 → 2026-04-20), William shipped three parallel tracks by running separate Claude Code sessions against separate repos and reconciling the results himself. This section is the clearest demonstration in the profile of the parallel-AI-session working pattern; the framing rules in §10 still apply — this is augmented senior engineering, not one-shot generation.

**Tracks shipped concurrently:**

1. **VIUPortal greenfield Blazor app** — see §4.1 for the full row. Within the 12-day window: scaffold, legacy parity, standalone SAML login with direct ADFS flow (`0cab45c`), impersonation with original-user privilege checks (`2a30f0f`) and CSP-compliant cookie helper (`0cb8b87`), pen-test hardening pass (`b082f3f`: headers, IP validation, auth checks), session polling, UI polish, Phase 3c per-app docs vault initialized (`bc6ece7`).

2. **SRS deploy pipeline rewrite** (`D:\code\webroot_dev\srs`) — ~17 commits concentrated on 2026-04-17. Replaced git-pull-based deploy with an artifact-based model:
   - Pester v3 test harness scaffold (`798a53b`)
   - Artifact-copy skeleton replacing the prior deploy script (`310d819`)
   - Source/destination path validation (`777c62b`, `380214b`)
   - `robocopy /MIR` with `.git` excluded (`75a5d42`)
   - Pre-deploy snapshot to `_deploy/<repo>/SRS_<shortsha>` with configurable retention (`dd0ffc5`, `6d98792`, `2253709`)
   - `.deployed` marker on success (`891844b`)
   - Dry-run regression guard (`394da08`, `ad79324`)
   - `-SnapshotRetain` range validation to prevent destructive values (`4b371d8`)
   - Prod deploy job with manual gate and failure notify (`07e33ad`)
   - Teams Adaptive Card for richer failure context (`c24d170`)

3. **`webroot_dev` shared-infra `docs/` Obsidian vault (Phases 1–3)** — team-wide vault tracked in the base repo (`1d48e7b` through `e227b14`). Covers:
   - Phase 1: vault scaffold and modernization assessment
   - Phase 2a: Oracle SSO-chain schema reference (`366e9f7`) verified against live DB
   - Phase 2b: Classic ASP shared-includes reference (`c5d4c9d`)
   - Phase 2c: end-to-end SSO traces with mermaid diagrams (`08b2949`)
   - Phase 2d: navigation wiring (`5beed6d`)
   - Phase 3a: per-app vault federation design (`c0b1a3b`)
   - Phase 3b: per-app vault bootstrap script (`2f927f2`)
   - Phase 3c: per-app pilot initialized in VIUPortal (`bc6ece7`)
   - Vault optimization pass 2026-04-19 (frontmatter simplification, guide-splits, trim pass)

**Supporting work in `webroot_dev` (same window):**
- `5645d2f` — tag export UI with JSON and Mermaid download + API security docs
- `8d06449` — hidden SSO apps via `ADDITIONAL_APPLICATIONS`
- `e3ab9b8` — "Try New Portal" beta badge on the legacy nav bar
- `0d185b3`, `44823c5`, `aec7704` — CI cleanup: auto-deploy `develop`, drop test/rollback stages
- `ff7c788` — expanded Oracle `authdb-web-logins` direct-bypass exceptions docs

**Effort estimate (order of magnitude, not measured):**

- Hands-on wall-clock, with AI assistance: roughly 40–60 hours across the 5-week window, most inside the 12-day intensive. Typical active day: 4–6 hours of review / redirect / test while AI drafted and researched in parallel.
- Equivalent solo-developer time (no AI, assuming all required skills already fluent — Classic ASP, Blazor Server, PowerShell/GitLab CI, SAML/ADFS, VIU Oracle schema): roughly 400–500 hours, i.e. ~10–14 weeks full-time. Rough internal split: VIUPortal greenfield 160–240 h; SRS pipeline rewrite 60–80 h; shared-infra docs vault Phases 1–3 80–120 h; per-app pilot + agent-ergonomics spec 30–40 h; misc feature/fix work 40–80 h.
- These numbers are not clock-measured. Git commit history proves *what* shipped and *when*, not wall-clock effort. The shipped surface area — ~100+ commits across three repos delivering a new Blazor app with SAML + impersonation + pen-test fixes, a full CI/CD deploy rewrite, and a multi-phase documentation platform — is consistent with the solo-hours range.
- The primary source of leverage is (a) parallelism across concurrent AI sessions, not prompt speed, (b) automated drafting of reference docs verified against the live Oracle schema, and (c) AI-assisted boilerplate plus security-hardening iterations on the Blazor port. William stayed in the loop on design decisions, code review, and verification throughout.

**Independent verification (2026-04-20):** Scope and dates confirmed by an independent Claude Code agent run in a separate session with no prior context. The agent walked the git history of `webroot_dev`, `webroot_dev/src/portal`, and `webroot_dev/srs`, located every named feature with matching dates, and flagged one correction — VIUPortal was scaffolded on .NET 10 and retargeted to .NET 8 on day 1, not a pure ".NET 10" project (now reflected in §4.1 and the bullets above).

**Interview framing:** The useful observation is not the multiplier number — it is the *parallel-session working pattern*. Serial prompting against one project would have looked like any AI-augmented workflow; running three tracks simultaneously, with a human doing reconciliation and review, is what let a 12-day window cover a greenfield app, a CI/CD rewrite, and a docs platform. Treat the multiplier as an order-of-magnitude observation, not a marketing claim.

---

## 5. William Tucker Solutions (WTS) — own business

Registered business with license; no clients yet. Infrastructure is built in advance and is itself a demonstration of what he can ship solo.

### 5.1 williamtucker.ca (business site)

- **Repo:** `C:\code\williamtucker`
- **Live:** [williamtucker.ca](https://williamtucker.ca)
- **Timeline:** 2026-03-31 → 2026-04-05 (6 days, 42 commits, sole author)
- **Stack:** Static HTML + Tailwind v4 + Express.js server, **live Claude API chatbot using `@anthropic-ai/sdk` directly** (not a third-party chatbot widget — actual SDK integration), deployed to Railway
- **Pages:** index, about, services, case-studies, pricing, small-business, contact, faq, checklist, privacy
- **Significance:** Proves he can ship a production app that consumes the Claude API as a first-class dependency, not just use Claude Code as a dev tool

### 5.2 WTS Admin + Client Portal

- **Repo:** `C:\code\wtsadmin`
- **Timeline:** 2026-04-03 → 2026-04-06 (4 days, 69 commits, sole author)
- **Stack:** Next.js 16 (App Router, Turbopack) + TypeScript 5 + **Supabase (PostgreSQL + Auth + Storage + Row-Level Security)** + Tailwind v4 + Stripe + Resend + React PDF, deployed to Vercel
- **Scope:**
  - 9 admin pages: dashboard, contacts, proposals, projects, time-tracking, invoices, expenses, documents, settings
  - 5 client portal pages
  - 9 database tables + RLS policies + helper functions (`is_admin()`, `get_portal_contact_id()`, `update_updated_at()`)
  - Magic-link auth for clients, email/password for admin
  - PDF invoice generation with custom WTS branding
  - Route protection via Next.js 16's new `proxy.ts` (replaces `middleware.ts`)
- **Significance:** Full-stack SaaS end-to-end — schema, migrations, RLS, auth, UI, PDF generation, Stripe billing, transactional email. Shipped in 4 days solo.

### 5.3 AscendAI — production RAG feasibility agent (pro-bono client build + WTS portfolio)

- **Repo:** `D:\code\ascendai` (deployed to Vercel)
- **Timeline:** 2026-04-25 → ongoing, **173 commits, sole author** (verified 2026-05-29)
- **Client:** Ascend Land Development (Erika Kretchmer, CEO), Kelowna — a custom AI agent that turns a BC address into an 11-section land-development feasibility memo. Pro-bono build; doubles as a WTS portfolio piece.
- **Stack:** Next.js 16 + TypeScript + **Supabase + pgvector (HNSW index)** + **Vercel AI SDK v6** (via AI Gateway) + **Claude Sonnet 4.6** + **Voyage `voyage-3-lite` embeddings** (512 dims); zod schemas; Vitest.
- **Architecture — hybrid retrieval, not naive RAG:**
  - Pipeline: BC address → **ArcGIS cadastral lookup** (lot geometry, PID, zoning) → **structured zoning-rules YAML** for hard dimensional numbers → **RAG over a 12-PDF bylaw corpus** for interpretive questions → 11-section memo with inline citations.
  - Ingestion pipeline (`scripts/ingest.ts`), agent tool layer (`lib/tools`, `lib/ai.ts`), zod-typed schemas, system-prompt module with tests.
  - **Eval discipline:** golden-file YAML validation tests, mixed-tier synthetic tests, on-demand fallback for zones missing from the rules cache.
  - **Tier-aware trust system** (`reviewed` vs `draft` zones) and **explicit escalation triggers** when the reasoning runs out and a human planner is needed.
  - Two delivery surfaces share one core: an installable **Claude skill** (`SKILL.md`) for power users, and the Next.js web app (authenticated shell, magic-link auth, sections for feasibility / memos / jurisdictions / 3d-massing).
- **Status:** Actively built; Phase 1+2 RAG shipped (HNSW retrieval, `zoning_rules_cache`). Pilot / investor-demo phase — not yet publicly launched. *(README front-matter still reads "design phase"; it is stale — git history shows the RAG pipeline implemented and tested.)*
- **Significance:** The closest analog in the inventory to "build production AI features — a coaching context system *and the evals that keep it honest*." Demonstrates **retrieval architecture (pgvector/HNSW, embeddings), AI SDK v6, agent tool design, and eval/golden-file discipline** — not a chatbot wrapper.

---

## 6. Independent projects

### 6.1 dogmap.ca

- **Repo:** `C:\code\dogmap`
- **Status:** **Retired June 2026** — was live at dogmap.ca; no longer deployed. The engineering record below still stands as real, verifiable experience.
- **Timeline:** 2025-10-09 → June 2026 (retired), **376 commits** (v2.0.0)
- **Stack:** Next.js 16 + React 19 + TypeScript + **Supabase (PostgreSQL + PostGIS + Auth + Storage)** + MapLibre GL + react-map-gl + supercluster + Zustand + @tanstack/react-query + Sharp, deployed to Vercel
- **Scope:** PWA for BC dog owners. Map-based. Geospatial (PostGIS). OAuth (Google, Apple). JWT-protected API routes. RLS on all tables. Role-based access, admin dashboard, moderation queue.
- **Significance:** Long-running side project demonstrating depth — 6 months of disciplined iteration (not a hackathon). Full verification script in `package.json` (`lint + typecheck + test + build`). Real test coverage via Vitest.
- **Python data pipeline (verified, William-authored):** `DogMap/scripts/*.py` — ~13 sole-authored Python scripts doing real **ETL / geospatial data engineering**: OSM tag discovery (`discover-osm-tags.py`), Overture Maps BC place import (`overture_bc_import.py`, `load-overture-places.py`), municipal parks / DOLA fetching (`fetch-municipal-parks.py`, `fetch-municipal-dolas.py`), OSM/parks SQL-batch building, and loading places into **PostGIS** (`load-osm-places.py`). This is the most defensible Python in the inventory: William-authored, in service of a production app (dogmap, since retired), doing ingestion-pipeline work. **It is data-pipeline scripting, not a Python web service** (see §8 Python honesty note).

### 6.2 wts-ai-docs — agent-first documentation system (reusable tooling)

- **Repo:** [github.com/billski/wts-ai-docs](https://github.com/billski/wts-ai-docs) (private)
- **Timeline:** created 2026-05-07, last pushed 2026-05-24. JavaScript + Shell.
- **What it is:** An opinionated, **AI-agent-first documentation system** for codebases — docs written for the *agent reading them cold* (Karpathy "software 3.0" framing). Generalized from real production vaults (**DogMap, WTSAdmin, WTS**).
- **Ships:**
  - **Two Claude Code skills** — `vault-aware` (consumer: routes Claude to the right domain doc, enforces conventions before doc edits) and `vault-init` (producer: bootstraps a vault into a fresh repo).
  - **Bootstrap CLI** (`npx wts-ai-docs init`) — scaffolds a vault in seconds.
  - **Change-routing script** (`match-docs.mjs`) — tells you which docs a diff affects, routing by path glob, content keyword, **and parsed DB objects** (CREATE/ALTER/DROP TABLE, CREATE FUNCTION, CREATE/ALTER/DROP POLICY in each migration).
  - **Vault linter** (`vault-doctor.mjs`) — audits frontmatter, freshness, wikilinks, and doc-to-code coverage; exits non-zero so CI can block stale vaults.
  - **Pre-commit drift gate** (`check-docs-freshness.mjs`) — blocks commits that touch vault-owned code without refreshing the owning doc's `last-reviewed`.
  - **CI templates** — drop-in GitHub Actions workflow + pre-commit hook.
- **Significance:** The single strongest artifact for the "**force multiplier / build the systems that prevent the next question**" competency — a reusable system that routes code changes to docs, self-verifies claims against ground truth, detects drift before it becomes hallucination, and gates CI. It is, almost verbatim, "turn one-off requests into repeatable patterns and build the tooling that prevents the next question."

---

## 7. Earlier career (TRU, 2012 – 2016)

- **T.R.U. Student ID Card system** — Java, Oracle backend. Used by thousands of students, integrated with BC Transit and the City of Kamloops.
- **Employee Survey system** — Groovy Grails + Oracle. Comprehensive reports and ETL jobs across Finance, HR, Payroll, Student departments.
- **BCNET Conference 2015** — presented on Groovy Grails. Trained staff on institutional reporting, code review, SQL tuning.
- **Institutional reporting (2012–2013)** — Oracle SQL, PL/SQL, PHP. PHP exposure comes from this period (2012 co-op) — **not recent and not production CakePHP or modern PHP framework experience.**

---

## 8. Tech stack — by confidence level

### Strong (production work in multiple repos, current)
- **Languages:** C#, TypeScript, JavaScript, SQL, **Oracle PL/SQL**, VBScript (Classic ASP), PowerShell
- **.NET:** .NET 8, .NET 10, Blazor Server, ASP.NET Core, Classic ASP, Dapper, `Oracle.ManagedDataAccess.Core`, SignalR
- **Node / Web:** Next.js 16 (App Router + Turbopack), React 19, Express.js, Tailwind v4
- **Databases:** Oracle (primary, ~99K LOC PL/SQL), **PostgreSQL via Supabase (Auth + RLS + Storage + PostGIS)**
- **Auth/Security:** ADFS, SAML, cookie-based SSO, JWT, OAuth (Google, Apple), magic-link auth, Row-Level Security, CORS architecture, CSP hardening, privilege-class enforcement, impersonation with safety checks
- **Infrastructure:** IIS (appcmd, web.config, URL rewrite), GitLab CI/CD, Vercel, Railway, PowerShell deploy + rollback scripts, robocopy /MIR patterns, SSH/SFTP (SSH.NET, ED25519 keys)
- **AI/LLM:** Anthropic Claude API (direct SDK integration in production), **Vercel AI SDK v6** (via AI Gateway, see §5.3), Claude Code (custom hooks, shared `CLAUDE.md`, planning + spec workflows, parallel sessions), **custom MCP server authored in TypeScript** (`@modelcontextprotocol/sdk` + `oracledb`, see §4.6) extending Claude with multi-DB Oracle tools, **RAG / retrieval architecture** (Supabase pgvector + HNSW, Voyage embeddings, hybrid structured-rules + retrieval — see §5.3), **eval discipline** (golden-file + synthetic tier tests), agent tool design, **agent-first documentation tooling** (`wts-ai-docs` — §6.2), prompt engineering, context-document design
- **Reporting:** QuestPDF, React PDF Renderer, Crystal Reports (legacy)
- **Workflow:** Git (multi-repo, 30+ repos), branch-per-feature, merge requests, spec-before-implementation, trace-and-reference documentation

### Some exposure (real but limited)
- **SQL Server** (T-SQL): read-only integration with Raiser's Edge RE7 in VIUWEB/award
- **Java + Hibernate** (2021 cert + earlier Java work at TRU)
- **Groovy Grails** (2013–2015 at TRU)
- **Python** — *honest scope:* William-authored **data-pipeline / ETL scripting** in DogMap (`scripts/*.py`: OSM + Overture ingestion into PostGIS — see §6.1) and a small personal app with tests (`D2chedit`, 12 commits). **No production Python web service, and no FastAPI / SQLAlchemy / Alembic / Pydantic experience.** Do not claim "Python services in production." The honest claim is: writes Python pipeline code when a real app needs it; the production-service muscle is C#/.NET and TypeScript.
- **SOAP** (referenced in integrations; primary work is REST)
- **Entity Framework** (used in older APIAuthorize / DBConnection services)
- **ETL** — Talend listed; not recent

### Gaps (acknowledge honestly, do not insinuate transferable)
- **PHP / CakePHP / Laravel / Symfony** — only PHP exposure is 2012 TRU co-op. Not modern, not framework-heavy.
- **MySQL** — no production work. PostgreSQL (via Supabase) is the closest equivalent.
- **AWS** — no direct experience. Cloud infra is Vercel + Railway + Supabase.
- **Salesforce / Apex / Flows** — no experience.
- **Mobile native (iOS/Android Swift/Kotlin)** — no experience. PWA exposure only.
- **Kubernetes / Docker-in-production** — supabase local uses docker but not orchestrated.

---

## 9. Cross-cutting technical patterns William owns

These are specific skills the git history proves, useful as concrete interview talking points.

1. **Classic ASP → .NET 8 Blazor Server modernization playbook** — he wrote it; it's reproducible.
2. **Blazor Server SSR/Interactive prerendering fix** via `PersistentComponentState` — non-trivial gotcha, cleanly solved.
3. **Synchronous IIS app pool recycle** via `appcmd stop apppool` + `robocopy /MIR` + restart in `finally` — avoids file-handle contention. Solved the `Copy-Item: file in use` class of problem.
4. **Oracle password vault pattern** — `MD.DB_CREDENTIAL_MGMT.P_GET_PWD` called at service construction with scoped lifetime.
5. **Shared-cookie SSO reuse** — same `WEB_LOGIN_TOKEN` validated by Classic ASP and .NET 8 apps against the same `authdb.web_logins` table.
6. **IniFileResolver tree-walk** — discovers config regardless of IIS `ContentRootPath` quirks, avoids hardcoded paths.
7. **Whitelist `.gitignore`** for a base-repo that hosts sibling app repos without tracking them.
8. **Planning-first AI workflow** — `docs/superpowers/plans/` and `specs/` directories in CDWTool show spec → implementation → iteration, not one-shot.
9. **Supabase RLS policies + helper functions** for admin/client split.
10. **Supercluster + MapLibre** rendering with React for geospatial PWA (dogmap, since retired).
11. **Custom MCP server authoring** — built an Oracle MCP server in TypeScript (stdio transport, thick-mode LDAP init, multi-DB connection pooling, read/write separation, row-limit guardrails) and wired it into the team's `webroot_dev/.mcp.json`. Demonstrates extending AI tooling, not just consuming it.
12. **Production RAG with evals** — hybrid retrieval (structured rules YAML + pgvector/HNSW over a bylaw corpus), Voyage embeddings, AI SDK v6, golden-file + synthetic-tier eval tests, tier-aware trust and explicit escalation triggers (AscendAI, §5.3). Retrieval architecture and honesty-by-design, not a chatbot wrapper.
13. **Agent-first documentation system as reusable tooling** — `wts-ai-docs` (§6.2): routes diffs to the right docs (path/keyword/DB-object), self-verifies claims, gates drift in CI. A "prevent-the-next-question" system generalized from three production vaults.

---

## 10. Framing rules (must read before writing any application copy)

### AI-accelerated, not AI-replaced
William does AI-accelerated work. Planning, debugging, judgment, and accountability stay with him. The commit histories show the pattern: `feat` → `fix` → `refactor` → `docs` cycles, not one-shot generation. When describing AI-assisted work in cover letters or resumes, describe it as **augmented senior engineering** — reference the underlying planning and debugging, not just the speed. Never say "generated by" or "automated." Always emphasize he stayed in the loop on design decisions and verified behaviour.

### RoomBooking status
Never claim RoomBooking is in production. Never describe it as incomplete. Correct framing: *"Delivered end-to-end in 5 days as sole author; currently in QA and technically ready for production. Go-live pending organizational approval, not engineering work. Reference available on request."* This doubles as an accountability signal.

### BIS timeline
Earlier drafts of the resume claimed "2 days with AI agents" for BIS. That is **wrong**. BIS was ~7 weeks. The 2-day project is SABC; the 5-day project is RoomBooking. Use the honest numbers. The 7-week number with 66 commits across 14 branches is a *stronger* claim than "2 days" because it demonstrates planned, iterated, tested work — which is what senior engineering roles actually want.

### Stack gaps
Do not infer transferable skills from adjacent tech. PostgreSQL is not MySQL. Vercel is not AWS. Next.js is not CakePHP. Acknowledge gaps upfront in cover letters — it builds credibility for the claims that are strong.

### Marine technician background (do not inflate)
William's pre-software career was a Journeyman Marine Technician trade ticket (BCIT, 2003–2007) — he worked on **marine engines and drives**, not software. List it exactly once, as a neutral factual "previous career" line (e.g. *"Journeyman Marine Technician (prior trade career, pre-software)"*). **Never** frame it as giving an "engineering mindset," "build-things-that-work discipline," maritime-domain insight, or transferable troubleshooting skill — not even when applying to maritime/industrial software companies (William's explicit directive, 2026-06-05). It is biography, not a qualification. Do not put it in a resume header, summary, cover-letter hook, or "core competencies" line.

### Date accuracy
Always audit all files for stale dates before delivering. Convert relative dates ("last week", "yesterday") to absolute dates when writing.

### Room for honest ranking
When rating skill levels (e.g. "SQL Server"), distinguish *production-seasoned* from *production-aware* from *exposure*. Don't inflate exposure into expertise.

---

## 11. References

- **VIU direct supervisor / boss** — will vouch that RoomBooking is production-ready in QA and the delay is organizational, not technical. Available on request.
- Additional VIU references available on request (colleagues from the 6-person team who used the local-dev environment William migrated them to).
- (Historical TRU references likely still reachable but are 10+ years old.)

---

## 12. Role-fit quick look (heuristics for "am I qualified?")

When asked about a role, map these capabilities against the posting:

| Asking about… | William's position |
|---|---|
| Senior / staff software engineer (8+ yrs) | ✅ 12+ years; meets seniority |
| AI-accelerated delivery / Claude / agents | ✅ Direct Claude API + Claude Code + shipped AI-augmented modernizations |
| Building AI tooling (MCP servers / agent tools) | ✅ Authored a custom TypeScript MCP server for Oracle (see §4.6) — not just using agents, extending them |
| RAG / embeddings / retrieval architecture | ✅ AscendAI (§5.3): pgvector/HNSW, Voyage embeddings, hybrid rules+retrieval, AI SDK v6 |
| LLM eval / "keeping it honest" | ✅ AscendAI golden-file + synthetic-tier evals, tier-aware trust, escalation triggers (§5.3) |
| Force-multiplier / "prevent the next question" tooling | ✅ wts-ai-docs (§6.2) + es-handbook + led 6-person team migration (§4.4) |
| Python services in production (e.g. FastAPI) | ⚠️ **Gap.** William-authored Python is ETL/pipeline scripting (DogMap §6.1), not a web service. No FastAPI/SQLAlchemy. Frame as fast-acquire, not held experience. |
| Legacy modernization | ✅ Strong; catalogued ~90-app inventory + authored playbook + shipped 6 conversions |
| .NET / C# backend | ✅ Strong; .NET 8 and .NET 10 in production |
| Full-stack (Next.js / React / TypeScript) | ✅ Strong; shipped multiple production apps (WTSAdmin, AscendAI); dogmap retired |
| PostgreSQL / Supabase | ✅ Strong; WTSAdmin + AscendAI in production (incl. pgvector); dogmap (PostGIS) retired |
| Oracle DBA-lite / PL/SQL | ✅ Deep; packages, stored procs, credential vault, 99K+ LOC |
| CI/CD / DevOps | ✅ GitLab pipelines across 30+ repos + Vercel + Railway |
| IIS / Windows infra | ✅ Strong; appcmd, app pools, robocopy patterns |
| SSO / SAML / ADFS / OAuth | ✅ Strong across Classic ASP, .NET, Supabase |
| PHP / CakePHP | ❌ 2012 co-op only. Do not claim. |
| MySQL | ❌ No production. Postgres closest. |
| AWS | ❌ No direct. Vercel/Railway. |
| Salesforce / Apex | ❌ No experience. |
| Mobile native | ❌ No experience. PWA only. |
| Java backend | ⚠️ Some (TRU-era + cert); not recent |
| Groovy / Grails | ⚠️ TRU-era only; probably stale |
| Python | ⚠️ Listed; unverified in recent repos |
| Talend / classical ETL | ⚠️ Listed; not recent |
| Technical writing / knowledge transfer | ✅ Strong; authored es-handbook, modernization playbook, 4 major reference guides |
| Team leadership / migration | ✅ Led 6-person team from network-drive to local-dev + CI/CD |

---

## 13. Verification commands (for future agents)

When a claim below needs checking, run these directly rather than re-asking:

```bash
# Commit counts across William's author names in webroot_dev
cd C:/code/webroot_dev && git shortlog -sne --all

# Commit count in a src/ modernization repo
cd C:/code/webroot_dev/src/bis_source && git log --all --oneline | wc -l

# First/last dates for a project
cd <repo> && git log --all --reverse --pretty=format:"%ad %s" --date=short | head -1
cd <repo> && git log --all --pretty=format:"%ad %s" --date=short | head -1

# Verify a specific tech claim
grep -r "PersistentComponentState" C:/code/webroot_dev/src/bis_source
grep -r "@anthropic-ai/sdk" C:/code/williamtucker

# Tech stack for a Node project
cat C:/code/wtsadmin/package.json

# Oracle MCP server scope + commit
cd C:/code/OraclePlugin && git log --all --oneline && cat package.json
```

When a memory file or resume line says something concrete, verify before recommending it. Memory captures what was true when written; code is the source of truth for what is true now.
