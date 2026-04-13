Backend Stories: SterileFlow
Paired with user-stories.md (New Cleaning Request) and archive-stories.md (Request Archive)
Source: Figma designs 1:2 and 4:300 + one-pager.md

Ground rules for this story set:
- Authentication/SSO is explicitly out of scope (handled elsewhere). Every endpoint below assumes a valid session and a current user with hospital_id.
- Multi-tenant isolation is MANDATORY on every mutable table.
- All free-text fields pass a PHI scrubbing gate before persistence and before leaving the system (logs, analytics, CSV exports).
- Money uses integer cents; never floats.
- All endpoints return JSON and use standard HTTP status codes (200 / 201 / 400 / 403 / 404 / 409 / 422 / 429 / 500).

Epic Map (backend)
#	Epic	Scope	Depends on
0B	Platform Foundation	DB + schema, RLS, API scaffold, rate limit, analytics	—
1B	Identity context	Profile + clinician directory	0B
2B	Catalog	Garment types, protocols, pickup locations	0B
3B	Requests — create	POST endpoint, idempotency, PHI scan	1B, 2B
4B	Pricing	ETA + surcharge quote engine	2B
5B	Hazard & compliance	Chain of custody, receipts, routing	3B
6B	Drafts & dispatch	Drafts CRUD, courier enqueue	3B
8B	Archive	List + stats + export + detail	3B, 6B

================================================================
Part 1 — New Cleaning Request (pairs with user-stories.md)
================================================================

Epic 0B: Platform Foundation
Goal: Establish the shared data, validation, and ops primitives every other backend story depends on.
Scope: L

BE-001 Database schema bootstrap
As the platform
I want a Postgres schema that models hospitals, clinicians, catalogs, requests, and events
So that every feature has a shared source of truth

Acceptance Criteria:

 Tables exist with these columns at minimum (Drizzle schema):
  - hospitals (id uuid PK, name text, slug text unique, created_at)
  - users (id uuid PK, hospital_id uuid FK, name text, email text unique, department text, role enum[doctor,coordinator,admin], default_pickup_location_id uuid null, avatar_url text null, created_at)
  - garment_types (id text PK, label text, protocols_supported text[], hazardous_eligible bool)
  - protocols (code text PK, label text, turnaround_hours int, helper_text text, surcharge_pct_per_garment numeric)
  - pickup_locations (id uuid PK, hospital_id uuid FK, label text, building text, floor text, is_hazard_eligible bool)
  - cleaning_requests (id text PK — UC-{seq}, hospital_id uuid FK, requester_user_id uuid FK, submitted_by_user_id uuid FK, protocol text FK, expedite bool, pickup_location_id uuid FK, notes text null, hazard_enabled bool, hazard_categories text[], hazard_notes text null, surcharge_cents int, estimated_return_at timestamptz, completed_at timestamptz null, status enum[draft,submitted,dispatched,picked_up,processing,returned,completed,cancelled], created_at)
  - garment_rows (id uuid PK, request_id text FK, type_id text FK, quantity int, tag_number text null)
  - drafts (id uuid PK, hospital_id uuid FK, user_id uuid FK, payload jsonb, updated_at)
  - chain_of_custody_events (id uuid PK, request_id text FK, event_type text, actor_user_id uuid FK null, actor_role text null, location text null, device_fingerprint text null, metadata_jsonb jsonb, occurred_at timestamptz)
 Every mutable table has hospital_id (directly or via join-safe parent)
 Migrations are reversible and live in a single drizzle migrations folder
 Seed script populates the built-in garment_types, protocols, and 5 default pickup locations per seeded hospital

Technical Notes:

- Postgres 15+ (Supabase/Neon); Drizzle ORM
- hazard_notes and notes are encrypted at rest (column-level) or rely on Postgres TDE — pick one and document
Size: L · Priority: P0

BE-002 Multi-tenant data isolation
As the platform
I want every query scoped to the caller's hospital_id
So that one hospital's data is never visible to another

Acceptance Criteria:

 Postgres RLS policies enabled on every table carrying hospital_id; policy = (hospital_id = current_setting('app.hospital_id')::uuid)
 API middleware sets the session variable per-request from the authenticated context
 Cross-tenant reads return 404 (not 403 — avoid existence disclosure)
 Cross-tenant writes raise 22023 (invalid parameter) at the DB; API translates to 404
 Integration test: a user authenticated to hospital A cannot read or mutate any row belonging to hospital B via any listed endpoint
 Admin/support access path exists but is logged to admin_access_log (append-only; no UPDATE/DELETE grants)

Unblocks: every FE story that reads or writes data
Size: L · Priority: P0

BE-003 API framework scaffold + Zod validation
As an engineer
I want a consistent API route template with input validation and error shape
So that every endpoint behaves identically on the wire

Acceptance Criteria:

 All routes live in src/app/api/**/route.ts using Next.js App Router handlers
 Every request body/query is validated with Zod; failures return 422 with { code, field, message[] } shape
 Every route handler is wrapped by a single authWrapper() that loads the session, resolves hospital_id, and sets the RLS session var
 Errors at any layer funnel through one error handler; 5xx is logged with a correlation id returned in the response header x-correlation-id
 OpenAPI spec is generated from Zod schemas (via ts-rest or similar) and published at /api/openapi.json

Unblocks: every BE story below
Size: M · Priority: P0

BE-004 Rate limiting
As the platform
I want per-user and per-IP rate limits on write endpoints
So that abusive or runaway clients don't take the system down

Acceptance Criteria:

 Token-bucket rate limit via Upstash Redis (or equivalent) keyed by user_id for authenticated calls, IP for anonymous
 Default budget: 60 writes/min and 300 reads/min per user; configurable per route
 429 response includes Retry-After header
 Limits apply to POST /requests, POST /requests/quote, POST/PATCH/DELETE /drafts, POST /requests/{id}/cancel
 Exempt endpoints: GET /me, GET /catalog/* (cacheable reads that already have other caching)

Unblocks: BE-301, BE-401, BE-601
Size: S · Priority: P0

BE-005 Analytics event ingestion with PHI scrub
As the product team
I want a structured event pipeline that never carries PHI
So that we can measure without compliance risk

Acceptance Criteria:

 POST /api/v1/events accepts { event_name, properties } from the frontend
 Middleware scrubs any property whose key is in a deny-list (notes, hazard_notes, free_text, patient_*, mrn, ssn, dob) AND any value matching a PHI regex (MRN, SSN, DOB patterns); dropped properties are logged to an internal alerts stream
 Events are published to the configured analytics backend (Segment/Amplitude/warehouse)
 Hospital_id, user_id_hash (SHA-256), role, and session_id are automatically appended server-side
 Event catalog file (src/lib/analytics/catalog.ts) lists every known event name + required properties; unknown events are accepted but flagged in logs

Unblocks: NFR-like analytics instrumentation across FE stories (FE-602 request_submitted event and others)
Size: M · Priority: P0

Epic 1B: Identity context
Goal: Provide the identity data the frontend renders, without owning auth.

BE-101 GET /api/v1/me
Pairs with FE-102 (Requester card)

Acceptance Criteria:

 Returns { id, display_name, role, department, hospital: { id, name, slug }, avatar_url, default_pickup_location_id }
 display_name is formatted server-side so every surface matches (e.g., "Dr. Priya Mehta")
 Response cached per-session for 5 minutes; supports If-None-Match / ETag
 401 if no session; never returns another user's data
 Latency p95 < 120ms

Size: S · Priority: P0

BE-102 GET /api/v1/users?role=clinician&q=...
Pairs with FE-103 (Change requester modal)

Acceptance Criteria:

 Query params: role (enum), q (free text), limit (default 20, max 50)
 Filters by caller's hospital_id; matches name and department case-insensitively
 Returns [{ id, display_name, department, role, avatar_url, initials }]
 Requires role in { coordinator, admin }; 403 otherwise (enforces the UI gate server-side too)
 Rate-limited per BE-004

Size: S · Priority: P0

Epic 2B: Catalog
Goal: Serve the reference data the New Request form depends on.

BE-201 GET /api/v1/catalog/garment-types
Pairs with FE-303

Acceptance Criteria:

 Returns [{ id, label, protocols_supported, hazardous_eligible }]
 Seeded with: Scrubs top, Scrubs bottom, Lab coat, Surgical gown, Scrub cap, Patient gown, Linens, Other
 Cache-Control: public, max-age=86400
 ETag support

Size: S · Priority: P0

BE-202 GET /api/v1/catalog/protocols
Pairs with FE-304

Acceptance Criteria:

 Returns [{ code, label, turnaround_hours, helper_text, surcharge_pct_per_garment, indicator_color_token }]
 Seed data matches Figma:
  - standard 24h / "Returned in 24 hours. Everyday laundering using eco-friendly clinical detergents." / 0% / "neutral"
  - sanitize 12h / "Returned in 12 hours. High-heat, recommended after clinical use." / 0% / "primary"
  - sterilize 36h / "Returned in 36 hours. Autoclave-compatible items only." / 40% / "hazard"
 indicator_color_token drives the summary dot color in FE-304 (per its 🔵 review suggestion)
 Cache-Control: public, max-age=86400

Size: S · Priority: P0

BE-203 GET /api/v1/hospitals/{id}/locations
Pairs with FE-306

Acceptance Criteria:

 Returns [{ id, label, building, floor, is_hazard_eligible }] scoped to the path hospital (must match caller's hospital_id)
 Hazard-ineligible locations are still returned but clearly flagged; FE disables selection when hazard toggle is ON
 Seeded per hospital during onboarding (BE-missing-1 below)

Size: S · Priority: P0

Epic 3B: Create request

BE-301 POST /api/v1/requests
Pairs with FE-307 submit orchestration (note: FE-307 was removed from user-stories.md; the backend endpoint stands regardless because other FE stories call it)

Acceptance Criteria:

 Accepts: { requester_user_id, garments: [{ type_id, quantity, tag_number? }], protocol, expedite, pickup_location_id, notes?, hazard: { enabled, categories[], contamination_notes? } }
 Server validation (422 on fail, per BE-003 error shape):
  - 1–10 garment rows; each quantity 1–20
  - protocol must be in catalog; "sterilize" requires every garment_type to list "sterilize" in protocols_supported
  - hazard.enabled requires categories.length ≥ 1 AND contamination_notes.trim().length ≥ 15
  - when hazard.enabled: pickup_location.is_hazard_eligible must be true
  - requester_user_id must be same hospital_id as caller; submitted_by_user_id = caller
  - notes and hazard.contamination_notes pass the PHI regex scan (reject with code phi_detected and field path)
 Idempotency: Idempotency-Key header dedupes retries for 24 hours; returns the original 201 on replay
 Persists to cleaning_requests + garment_rows in a single transaction; also writes a request_submitted row to chain_of_custody_events
 Returns 201 with { id, status: "submitted", estimated_return_at, surcharge_cents }
 Latency p95 < 800ms including dispatch enqueue (see BE-603)

Technical Notes:

- id format: "UC-{seq}" where seq is a per-hospital monotonic counter in a materialized counter table; lock is acquired SELECT ... FOR UPDATE on the counter row (alternative: ULID internally + short UC-{prefix} for display — pick one and document the trade)
- Writes the dispatch_courier job via a transactional outbox

Size: L · Priority: P0

Epic 4B: Pricing

BE-401 POST /api/v1/requests/quote
Pairs with FE-402 + FE-403

Acceptance Criteria:

 Accepts the same request body shape as BE-301 (not persisted) and returns { estimated_return_at, surcharge_cents, breakdown: [{ kind, description, cents }] }
 Pricing rules live in protocols table + a small pricing_rules table (so edits don't require a deploy):
  - base_per_garment_cents
  - expedite_per_garment_cents
  - hazard_pct_per_garment
  - protocol-specific surcharge_pct_per_garment
 ETA = now + (expedite ? 4h : protocol.turnaround_hours); minimum 4h expedite, minimum protocol.turnaround_hours otherwise
 Idempotent; cacheable for 60s keyed by body hash
 Latency p95 < 300ms

Technical Notes:

- 🟡 Flagged in user-stories.md review: actual pricing figures must come from product before this ships. Seed with the design's visible values ($24 expedite/garment, $48 total for 2 expedited garments) and mark as "provisional" in the admin UI until confirmed.

Size: M · Priority: P0

Epic 5B: Hazard & compliance

BE-501 Hazard disclosure persistence + dispatcher routing
Pairs with FE-502 + FE-503

Acceptance Criteria:

 When hazard_enabled on a created request, the dispatcher routes the job to hospitals.biohazard_facility_id (configurable per hospital; falls back to default facility)
 hazard_categories is constrained to enum [bodily_fluids, human_tissue, chemical_contaminant, sharps_risk, infectious_disease]
 hazard_notes has min length 15 enforced server-side in addition to client
 Every hazardous request triggers compliance receipt generation (BE-502) via the transactional outbox; the request row stores compliance_receipt_id when ready
 Emits chain_of_custody_events row with event_type = "hazard_disclosure_confirmed"

Size: M · Priority: P0

BE-502 Compliance receipt PDF generator (AAMI ST79 + Joint Commission)

Acceptance Criteria:

 Inngest (or equivalent) job generate_compliance_receipt(request_id) runs within 60s of creation
 PDF template conforms to AAMI ST79 §10 required fields + Joint Commission IC.02.02.01 checklist: request_id, hospital name + address, submitter name + role, hazard categories, contamination notes, garment list, protocol, pickup location, submitted_at, chain-of-custody excerpt, sign-off placeholder for facility receipt
 Stored in encrypted object storage (S3 with SSE-KMS or Supabase Storage with at-rest encryption)
 GET /api/v1/requests/{id}/receipt returns a signed URL with 15-minute TTL; only caller within the owning hospital can fetch
 Receipt URL is embedded in FE-602 confirmation panel when hazard_enabled

Technical Notes:

- Use puppeteer-core + chromium-aws-lambda, or react-pdf — pick one and document
- Receipt rendering MUST NOT include any notes field that hasn't passed PHI scrub

Size: L · Priority: P0

BE-503 Chain-of-custody event log
Pairs with compliance audit needs

Acceptance Criteria:

 Append-only chain_of_custody_events table (no UPDATE or DELETE grants; attempted modifications log to security_alerts stream)
 Event types covered by this epic: request_submitted, hazard_disclosure_confirmed, courier_assigned, picked_up, received_at_facility, processed, returned, delivered, completed
 GET /api/v1/requests/{id}/custody returns full event log scoped by RLS
 Every event carries actor_user_id, actor_role, device_fingerprint, occurred_at, metadata_jsonb

Size: M · Priority: P0

Epic 6B: Drafts & dispatch

BE-601 Drafts CRUD
Pairs with FE-302 "SAVE AS DRAFT" affordance

Acceptance Criteria:

 POST /api/v1/requests/drafts — create
 PATCH /api/v1/requests/drafts/{id} — update
 GET /api/v1/requests/drafts — list caller's drafts
 DELETE /api/v1/requests/drafts/{id} — remove
 Drafts are per-user; auto-deleted after 30 days
 Schema validation only (drafts do not require complete form — partial state OK)
 On successful submit (BE-301), the backing draft is deleted in the same transaction
 PHI scrub applies to draft saves too (you can't smuggle PHI through drafts)

Size: M · Priority: P1

BE-602 POST /api/v1/requests/{id}/cancel

Acceptance Criteria:

 Cancels a submitted request only if status in { submitted, dispatched } (not picked_up or later)
 Writes chain_of_custody_events row with event_type = "cancelled"
 Notifies courier dispatch to abort (if not yet picked up)
 Returns 409 if status is not cancellable; body includes current_status for the UI
 Only the original submitter or role admin can cancel

Size: S · Priority: P1

BE-603 Courier dispatch background job

Acceptance Criteria:

 Transactional outbox enqueues dispatch_courier(request_id) in the same DB transaction as BE-301
 Job selects courier by pickup_location, hazard_enabled, and expedite SLA
 On assignment: writes courier_assigned to chain-of-custody and pushes a web push notification to the requester
 Retries with exponential backoff up to 1h; failures page the on-call dispatcher via an alert channel
 Concurrency cap 20 per hospital to avoid over-dispatching during a batch

Size: L · Priority: P0

================================================================
Part 2 — Request Archive (pairs with archive-stories.md)
================================================================

Epic 8B: Archive
Goal: Provide the query, stats, export, and detail endpoints the Archive UI needs.
Dependencies: Epic 3B (requests exist), Epic 6B (completion signal)

BE-801 GET /api/v1/archive
Pairs with FE-803 filter bar + FE-804 table + FE-811 pagination + FE-817 mock shape

Acceptance Criteria:

 Query params: from (ISO), to (ISO), protocol (all|standard|sanitize|sterilize), hazard (0|1), q (free text), page (default 1), page_size (default 25, max 100)
 Filters apply only to cleaning_requests with status = "completed"; scoped to caller's hospital_id
 q matches request.id and pickup_location.label case-insensitively
 Response: { rows: [...], total, page, page_size, filters_applied }
 Each row: { id, submitted_at, completed_at, eta_at, garments_count, protocol, pickup_label, surcharge_cents, hazard_enabled, has_receipt }
 Default sort: completed_at DESC; stable (tie-break on id)
 Latency p95 < 250ms for 10k-row hospital dataset (via index on (hospital_id, status, completed_at DESC))
 ETag per filter combo; invalidated when a new request flips to completed

Size: L · Priority: P0

BE-802 GET /api/v1/archive/stats
Pairs with FE-802 summary strip

Acceptance Criteria:

 Accepts the same filter set as BE-801
 Returns { completed_count, completed_garments, avg_turnaround_minutes, turnaround_delta_pct, hazard_receipt_count, window_from, window_to, prior_window_from, prior_window_to }
 turnaround_delta_pct compares the filter window's avg_turnaround_minutes to the immediately preceding window of the same duration (resolves the 🔵 review suggestion in archive-stories.md)
 Returns null for turnaround_delta_pct when the prior window has no data
 Computed via a single indexed SQL aggregation query (< 150ms p95)

Size: M · Priority: P0

BE-803 GET /api/v1/archive/export
Pairs with FE-812 Export CSV

Acceptance Criteria:

 Accepts the same filter set as BE-801 plus format (csv default; future: xlsx)
 Streams CSV to the client (Transfer-Encoding: chunked) so large exports don't buffer in memory
 Content-Disposition: attachment; filename="sterileflow-archive-{hospital-slug}-{YYYYMMDD}.csv"
 Columns: request_id, submitted_at, garments, protocol, pickup_location, completed_at, eta_delta_minutes, surcharge_usd, status, hazard_receipt_url
 PHI boundary: notes and hazard_notes are NEVER included; a test fixture verifies no PHI-regex match slips through (closes the 🔵 review suggestion)
 Audit log entry written (export_requested in a new admin_audit_log table) with user, hospital, filters, row count
 Rate-limited stricter than BE-801: 10 exports/hour/user

Size: M · Priority: P1

BE-804 GET /api/v1/archive/{id}
Pairs with the MISSING: Archive detail view story in archive-stories.md

Acceptance Criteria:

 Returns full request payload: all columns + garment_rows + chain_of_custody_events (reverse chronological) + pickup_location + hazard_receipt_url (signed, 15-min TTL) when applicable
 Scoped by RLS; 404 on cross-tenant or non-existent
 Latency p95 < 200ms
 Does NOT include raw notes in the response for users whose role is not admin or compliance_officer — role-based redaction applied

Size: M · Priority: P0

BE-805 Request completion transition
Writes the state that BE-801 filters on

Acceptance Criteria:

 POST /api/v1/requests/{id}/complete called by the courier integration (or internal admin tool) when items are delivered back to the hospital
 Validates status is "returned"; sets status = "completed", completed_at = now()
 Writes chain_of_custody_events row (event_type = "completed")
 Emits a domain event completed.request.v1 so cache/ETag invalidation can fan out to BE-801/BE-802 consumers
 Idempotent: replaying a completion on an already-completed request returns 200 with the existing timestamp

Size: M · Priority: P0

BE-806 Notification unread count
Pairs with INF-006 (top bar notification dot)

Acceptance Criteria:

 GET /api/v1/notifications/unread-count returns { unread: int } for the caller
 Notifications are seeded by system events: completion, dispatch issues, compliance receipt ready, draft expiring
 POST /api/v1/notifications/{id}/read marks a single notification read; POST /api/v1/notifications/read-all marks all
 WebSocket or SSE channel optional (not required for MVP); polling every 60s from the client is acceptable

Size: M · Priority: P1

================================================================
Missing / Prerequisite Backend Stories
================================================================

These surfaced in the user-stories.md review as "MISSING" items. They belong in Epic 0B before any feature work ships.

BE-missing-1 Hospital onboarding & seed data
Why It's Needed: BE-203 (pickup locations) and BE-501 (biohazard facility routing) have nothing to read without a hospital onboarding path.
Suggested Scope: Admin CLI or internal endpoint that accepts a hospital config bundle (name, slug, pickup locations, biohazard facility id, pricing overrides) and seeds all dependent tables in one transaction.
Suggested Priority: P0 · Epic 0B
Size: M

BE-missing-2 Compliance receipt template (merged into BE-502)
See BE-502 — this was split as its own story in the earlier review and is now rolled into the receipt generator.

BE-missing-3 Courier & facility domain model
Why It's Needed: BE-603 assumes a dispatcher service exists with couriers, facilities, and routing policy. Without the domain model, the job can't be built.
Suggested Scope: Tables for couriers (id, hospital_id, status, sla_tier, hazard_certified), facilities (id, kind [standard|biohazard], capacity), routing_policies (hospital_id, policy_jsonb); dispatcher service that consumes them.
Suggested Priority: P0 · Epic 6B
Size: L

================================================================
Sequencing (backend critical path to shippable MVP)
================================================================

Wave 1 — Foundation: BE-001 → BE-002 → BE-003 → BE-004 → BE-005 → BE-missing-1 (hospital onboarding)
Wave 2 — Identity + Catalog: BE-101, BE-102, BE-201, BE-202, BE-203 (all parallel)
Wave 3 — Create + Quote: BE-301 → BE-401 (parallel)
Wave 4 — Hazard + Dispatch: BE-501, BE-502, BE-503, BE-missing-3, BE-603 (interleaved)
Wave 5 — Drafts + Cancel: BE-601, BE-602 (P1; parallel to Wave 4)
Wave 6 — Archive: BE-805 (completion transition) → BE-801 + BE-802 + BE-804 (parallel) → BE-803 (export, P1)
Wave 7 — Notifications: BE-806 (P1)

A coherent MVP backend covers Wave 1–4 + BE-805 + BE-801–BE-802 + BE-804.
Excluded from MVP: BE-601 drafts, BE-602 cancel, BE-803 export, BE-806 notifications — all P1.

================================================================
Technical Review Report (backend)
================================================================

Stories Reviewed: 22 backend stories + 3 prerequisite callouts
Same caveat as the frontend reviews: there is no Technical Architecture doc in this repo. Every assumption below should be re-validated against whatever stack the team actually chooses.

🔴 BE-301: Per-hospital monotonic sequence for UC-{seq} IDs
Issue: The design shows ids like "UC-48219". Implementing a per-hospital monotonic counter requires a locked counter table (contended on bursty submits) or a single global sequence that leaks volume across tenants.
Evidence: Design nodes 1:206 + 4:428 show "UC-48219" format
Recommended Fix: Pick one before implementing: (a) global sequence + display short ULID prefix ("UC-1K7B3"), or (b) per-hospital counter table with row-level lock and documented throughput cap. Decision lives in BE-001.

🔴 BE-401: Pricing rules missing authoritative source
Issue: Surcharge formula is inferred from two data points in the design. Sterilize and hazard multipliers are invented.
Evidence: user-stories.md review flagged this as a P0 blocker pre-sprint; it still stands.
Recommended Fix: Product delivers a pricing matrix (base rate × protocol × expedite × hazard) before BE-401 starts. Until then, seed with provisional values flagged in the admin UI.

🟡 BE-502: Compliance receipt engine choice affects serverless fit
Issue: puppeteer/chromium-aws-lambda is heavy; react-pdf is lightweight but less flexible. The choice affects cold-start times and binary size in a serverless deployment.
Recommended Fix: Pick now, before the story enters sprint. If Vercel Functions is the target, prefer react-pdf; if Inngest runs workers, puppeteer is fine.

🟡 BE-801: Pagination page-size mismatch with design
Issue: archive-stories.md shows "Showing 5 of 1,248" in the design. FE-811 specifies production page size = 25. BE-801 default is 25. Confirm product intent to keep these consistent.
Recommended Fix: Lock page_size default at 25 in API + UI unless product asks otherwise.

🟡 BE-803: Export at scale
Issue: For a hospital with 50k+ archived requests, buffering into memory would OOM. Streaming is specified; make sure the ORM supports cursor-based iteration (Drizzle: db.execute + raw cursor, or page through with LIMIT/OFFSET).
Recommended Fix: Explicit AC: "Export MUST stream from a DB cursor; no materialized array of >10k rows in memory."

🔵 BE-002: RLS is load-bearing but hard to debug
Issue: Once RLS is on, silent empty results are the norm when session vars aren't set. New engineers will lose time debugging.
Recommended Fix: Add dev-mode logging: when an authenticated query returns 0 rows and no WHERE filter excluded them, log a warning with the hospital_id that was set.

🔵 BE-005: Event catalog governance
Issue: Without a lint rule or schema check, event names will drift over time.
Recommended Fix: Ship a CI check that diffs actual track() calls against src/lib/analytics/catalog.ts; unknown events fail the PR.

================================================================
Summary
================================================================

22 backend stories across 7 epic areas + 3 prerequisite callouts.
P0 MVP = Waves 1–4 + BE-805 + BE-801/802/804.
Two blockers before sprint planning: ID-sequence strategy (BE-301) and pricing-matrix source-of-truth (BE-401).

These stories pair 1:1 with the frontend work already shipped in this repo (commits up to 69673d5). Nothing in Part 2 conflicts with the UI currently live on /archive — the mock data in src/lib/mock-archive.ts mirrors the BE-801 response shape intentionally, so the swap is a data-source change, not a UI rewrite.
