# CodeReverb – Implementation & Development Plan

## Purpose

This document describes **how CodeReverb is actually built**, not a pitch deck fantasy. It serves three audiences:

* Contributors who want to understand the system boundaries
* Maintainers who need a realistic roadmap
* Future-you, six months from now, wondering why decisions were made

CodeReverb is open source, but it is not casual. The plan optimizes for correctness, debuggability, and incremental scale.

---

## System Architecture

CodeReverb follows an **event-driven, async-first architecture** designed to survive GitHub latency, AI slowness, and user impatience.

```
GitHub Webhooks
      ↓
Next.js API Routes
      ↓
Inngest Event Bus
      ↓
AI Orchestrator ──► Pinecone
      ↓                 ↑
GitHub API ◄────────────┘
      ↓
Email + Dashboard Updates
```

Key principle: **nothing user-facing blocks on AI**.

---

## Architectural Principles

* Async by default (Inngest is mandatory, not optional)
* Stateless API routes
* Deterministic jobs with retry safety
* OSS-first observability (logs over magic)
* Replaceable AI vendors

---

## Technology Stack

### Frontend

* Next.js 16 (App Router)
* React 19 + TypeScript
* Tailwind CSS + Shadcn UI
* TanStack Query for server state
* Zustand for UI state
* React Hook Form + Zod

### Backend

* Next.js API Routes (edge where possible)
* PostgreSQL + Prisma
* Better Auth (GitHub OAuth)
* Inngest for background work
* Nodemailer (SMTP)
* nvii.dev for secrets

### AI Layer

* Primary: Google Gemini 1.5 Pro
* Fallback: OpenAI GPT-4
* Embeddings: OpenAI text-embedding-ada-002
* Vector Store: Pinecone

AI is treated as **unreliable infrastructure**, not a feature.

---

## Folder Structure (Reality-Based)

```
app/            UI + API boundaries
components/     Presentational components
lib/            Core system logic (auth, ai, github, email)
ingest/         Background jobs only
prisma/         Schema and migrations
types/          Shared contracts
utils/          Pure helpers
```

Rule: **anything with side effects lives outside React**.

---

## Development Phases

### Phase 1 – Foundation

Goal: authentication, database, and UI shell. No AI yet.

* Auth via GitHub OAuth
* RBAC enforced at API boundary
* Database schema finalized early
* Dashboard skeleton only

Failure condition: manual testing is unclear or painful.

---

### Phase 2 – GitHub Integration

Goal: reliable webhook ingestion.

* Signature verification
* Idempotent webhook handlers
* PR lifecycle stored in DB
* Reprocessing-safe events

Nothing posts comments yet.

---

### Phase 3 – Background Processing

Goal: remove all blocking work.

* Inngest client configured
* Job retries and dead-letter handling
* Repository cloning + diff parsing
* Status surfaced in UI

If a job fails, the user must know.

---

### Phase 4 – AI Orchestration

Goal: generate useful reviews without hallucination chaos.

* Persona-based prompts
* Strict input shaping
* Model fallback logic
* Token and cost awareness

AI output is validated before posting.

---

### Phase 5 – Review Delivery

Goal: comments appear where developers already work.

* Inline PR comments
* Summary comment per PR
* Rate-limit aware GitHub API usage
* Retry-safe posting

Never spam. Never duplicate.

---

### Phase 6 – Notifications & Admin

Goal: transparency.

* Email notifications for:

  * review ready
  * failures
  * security events
* Admin dashboard
* Org-level settings

Silence is considered a bug.

---

### Phase 7 – Hardening

Goal: production survival.

* Audit logs
* Error budgets
* Performance tracing
* Real analytics

No feature work during this phase.

---

## CI/CD

Principles:

* Every PR is tested
* No skipped checks on main
* Build artifacts are reproducible

GitHub Actions runs:

* lint
* typecheck
* tests
* build

Deploys only from `main`.

---

## Environment Strategy

### Local

* Docker Postgres
* Inngest dev server
* Real GitHub OAuth
* Fake email sink

### Staging

* Preview deployments
* Real external services
* Separate Pinecone index

### Production

* Locked secrets
* Backups enabled
* Monitoring mandatory

---

## Scaling Strategy

### Database

* Read replicas for analytics
* Strict indexing discipline
* Connection pooling

### Jobs

* Horizontal Inngest scaling
* Job-level rate limits
* Backpressure over queue growth

### AI

* Batch embeddings
* Prompt caching
* Cost ceilings per org

---

## Security Model

* OAuth scopes minimized
* Secrets never exposed to client
* Webhook verification enforced
* Audit logs immutable

Security issues are reported privately.

---

## OSS Reality Check

Open source does not mean:

* free hosted inference
* unlimited support
* unstable APIs

Self-hosting is first-class.
Hosted SaaS funds maintenance.

---

## Success Criteria

This project is successful if:

* Contributors can run it in under 30 minutes
* Reviews are useful more often than ignored
* Failures are visible and recoverable
* Maintainers don’t burn out

---

## Closing Notes

This plan is intentionally conservative.

Shipping slowly but correctly beats rewriting fast systems later.

CodeReverb is built to last, not to demo.
