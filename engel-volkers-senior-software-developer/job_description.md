# Job Description — Engel & Völkers Canada, Senior Software Developer

- **Company:** Engel & Völkers (global luxury real estate brand; Canada division)
- **Role:** Senior Software Developer, internal platform applications (real estate ecosystem)
- **Location:** Fully remote, Canada-based
- **Compensation:** $145,000 – $170,000 CAD annually
- **Reporting:** Direct line to the VP of Engineering
- **Source:** Provided by William 2026-07-03 (prospects/engel_volkers.txt)

## What you'll work on

- Own and improve internal apps for property/listing workflows, approvals, knowledge management, AI-assisted tooling, reporting, administration.
- Build and maintain TypeScript/Node.js backends, API layers, and server-rendered apps (NestJS/Fastify, Next.js, Astro/SvelteKit, AWS Lambda).
- Contribute to a Next.js/Turborepo platform: shared React UI, auth helpers, schemas, reference data, test tooling, deploy scripts, DX.
- Work across AWS + data infra: Lambda, API Gateway, Amplify, AppSync, DynamoDB, S3, SSM, EventBridge, CloudWatch, ECS/Fargate, PostgreSQL, Drizzle, Dynamoose.
- Maintain integrations: auth services, listings APIs, knowledge base APIs, email workflows, analytics, search, Google Places, AWS Bedrock AI features.
- Reduce single-person knowledge risk: document, simplify, improve CI/CD/testing, partner with leadership on pragmatic decisions.

## What they're looking for

- 5+ years professional software engineering, senior ownership of production systems.
- **Strong TypeScript and Node.js**, frontend components through backend services and infrastructure.
- **Strong React and Next.js** (SSR/server components, API/client data boundaries, shared component systems, modern tooling).
- **AI-first development mindset with real engineering depth** (Claude Code, Cursor, Copilot) but can independently debug, design, test, review, verify.
- **AWS-backed apps** (Lambda/serverless, S3, DynamoDB, SSM/secrets, CloudWatch, CI/CD).
- Databases, API contracts, runtime validation, authentication, authorization, secure secret handling.
- **Comfort maintaining mature systems** with different patterns (server-rendered UIs, web components, older deployment models).
- Clear communication, low ego, high ownership, strong testing instincts, mentoring/leadership.

## Nice to have

- AWS Amplify Gen 2, AppSync GraphQL, EventBridge, CDK, SST, Serverless Framework.
- NestJS, Fastify, Astro, SvelteKit, HTMX, Lit / Web Components.
- Turborepo / TS monorepos, Drizzle ORM, Dynamoose, typed schema/codegen.
- **Real estate tech, listings/MLS data, brokerage ops, marketplace/platform, small-team ownership of ambiguous work.**

## Fit notes / strategy

**Strongest fit of the recent batch.** Three of their headline asks are direct bullseyes:
1. **AI-first with real engineering depth** — William's #1 differentiator, and the posting explicitly wants "AI-first, engineering-grounded."
2. **TypeScript / Next.js / React / Node.js full-stack** — his core modern stack (AscendAI, WTSAdmin, williamtucker.ca).
3. **Maintaining and improving mature production systems** (server-rendered UIs, older deployment) — his legacy-modernization wheelhouse. Most AI-first devs can't do this; E&V explicitly values it.

Also strong: databases + API contracts + runtime validation (zod) + auth/authz + secure secrets; reducing single-person knowledge risk via CI/CD + docs (he literally did the team-of-12 migration + handbook); mentoring + shared standards.

**Domain bonus:** AscendAI is real-estate-adjacent (property address to zoning/feasibility, cadastral + bylaw data). Genuine real-estate-tech relevance.

**The one real gap: AWS.** No AWS Lambda/DynamoDB/Amplify/AppSync/EventBridge. His serverless is Vercel functions; managed DB is Supabase Postgres; secrets via env + an Oracle credential vault. Framing rule: Vercel ≠ AWS, don't infer. Name it honestly in one line: strong serverless + managed-DB + secrets fundamentals on Vercel/Supabase, no AWS yet, fast ramp. It's one required item among many strengths, at a small pragmatic team that values learning unfamiliar code.

Nice-to-haves mostly absent (NestJS/Fastify/Astro/Svelte/Drizzle/Dynamoose/Turborepo-monorepo); fine.
