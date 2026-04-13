Design → Stories: SterileFlow New Cleaning Request
Source design: Figma — node 1:2
Product context: one-pager.md — B2B hospital cleaning logistics; compliance-sensitive (Joint Commission, AAMI ST79, OSHA, CDC)
Scope captured in design: New Cleaning Request screen + side nav shell (Dashboard, New Request, My Requests, Archive, Settings). Only the New Request screen is fully designed; others appear in navigation only.

Product Decomposition
Observed behaviors on the shared screen:

Doctor identity rendered with change affordance
Garment line-item composition (type, quantity, tag) with add/remove
Cleaning protocol selection (Standard / Sanitize / Sterilize) with contextual helper
Expedite toggle with pricing implication
Hazardous material disclosure (separate elevated treatment)
Pickup location + free-text handling notes
Live summary computation (items, protocol, service, ETA, surcharge)
Biosecurity compliance reassurance
Submit / Save draft / Cancel actions with keyboard shortcut
Implied by nav but not designed: Dashboard, My Requests, Archive, Settings. Stories for these are out of scope until designs exist — I'll only write foundational routing stories for them.

Epic Map
#	Epic	Scope	Depends on
0	Foundation & Infrastructure	Design system, shell	—
1	Identity & Requester Context	Doctor profile, hospital/department, requester change	0
3	Create Cleaning Request (Core)	Form composition, validation, submit	1
4	Live Request Summary & Pricing	Sticky summary panel	3
5	Hazardous Material & Compliance	Biohazard disclosure UI	3
6	Drafts, Confirmation & Dispatch	Save draft, submit success	3

Epic 0: Foundation & Infrastructure
Goal: Provide the frontend platform on which every feature depends.
Dependencies: none
Scope: M

Stories
INF-003 App shell with persistent left navigation
As a user
I want to see a consistent left sidebar with brand, primary nav, and "New Cleaning Task" CTA
So that I can navigate between sections without losing context

Acceptance Criteria:

 Sidebar renders at 256px width, background #f1f5e7, full height
 Brand lockup: "SterileFlow" (Manrope ExtraBold 24px, #00626a) + subtitle "CLINICAL LOGISTICS" (Public Sans 14px uppercase, #64748b)
 Nav items: Dashboard, New Request, My Requests, Archive, Settings — each with icon + uppercase label
 Active nav item has background #e0e4d6, bold teal text, right-rounded 4px corner
 Bottom CTA "New Cleaning Task" uses teal gradient linear-gradient(135deg, #00626a, #2c7b83), white bold text, 8px radius, triggers same destination as the "New Request" nav item
 Nav routes resolve; destinations without designs return a placeholder with title + "Coming soon" (not a 404)
Technical Notes:

Named routes: /dashboard, /requests/new, /requests, /archive, /settings
Sidebar is a shared layout, rendered once per session
Design Reference: Sidebar (node 1:162) through nav items (1:169–1:198)
Size: M · Priority: P0

INF-004 Design token library (BRIEF/Prism + SterileFlow palette)
As an engineer
I want to consume brand colors, fonts, radii, and shadows as tokens
So that visual consistency is enforced and redesigns are painless

Acceptance Criteria:

 Tokens exported as CSS variables AND a JS/TS object: --sterile-background: #f7fbed, --sterile-primary: #00626a, --sterile-primary-gradient-end: #2c7b83, --sterile-surface: #ffffff, --sterile-surface-muted: #f1f5e7, --sterile-summary-bg: #f0f4e6, --sterile-text-primary: #181d15, --sterile-text-secondary: #64748b, --sterile-text-tertiary: #94a3b8, --sterile-hazard-amber: #b5ac84, --sterile-hazard-text: #665f3d, --sterile-divider: #e0e4d6
 Font families wired: Manrope (headings), Public Sans (body), loaded from self-hosted woff2 with font-display: swap
 Radius scale: 4, 8, 12, 16; shadow scale documented for card and CTA
 Storybook (or equivalent) page renders every token visually
Technical Notes:

These diverge from the BRIEF (Prism) palette in the UX agent doc (teal #2c7b83 vs. #00626a); this design uses #00626a as primary teal. Document the divergence.
Design Reference: Entire design — extracted via get_design_context
Size: M · Priority: P0

Epic 1: Identity & Requester Context
Goal: Every cleaning request is attributed to a clinician with department and hospital.
Dependencies: Epic 0
Scope: M

FE-102 Requester card renders the doctor
As a doctor on the New Request screen
I want to see my name, department, and hospital pre-filled in the Requester card
So that I never mis-attribute a request

Acceptance Criteria:

 Renders avatar (56px, 12px radius, #ecf0e2 fallback bg), display_name (Manrope Bold 18px, #181d15), and "{department} · {hospital}" (Public Sans 14px, #64748b) exactly per design (nodes 1:29–1:35)
 Avatar falls back to initials on a #ecf0e2 background when avatar_url is null
 Loading skeleton matches the card footprint (72px tall, 56px square on left, two line placeholders)
 On fetch error, card renders "Couldn't load your profile — reload" with a retry action; the Submit button is disabled until the profile is present
 "CHANGE" link opens the requester-change flow (see FE-103); link has aria-label="Change requester"
Design Reference: Nodes 1:27, 1:29–1:37
Size: S · Priority: P0

FE-103 Change requester flow (delegate submission)
As a clinical coordinator submitting on behalf of a doctor
I want to change the requester to another clinician at my hospital
So that accountability for the cleaning request is correct

Acceptance Criteria:

 "CHANGE" opens a modal with a search-as-you-type list of active clinicians at the same hospital_id
 Type-ahead debounces at 200ms and requires min 2 characters
 Selecting a clinician updates the Requester card locally; form state retains selection through submit
 Only users with role coordinator or admin can change requester; doctors see no CHANGE link
Design Reference: "CHANGE" link (node 1:36–1:37)
ASSUMPTION: Design shows CHANGE universally; product likely wants it gated to non-doctor roles. Confirm with product.
Size: M · Priority: P1

Epic 3: Create Cleaning Request (Core)
Goal: A clinician composes and submits a cleaning request end-to-end.
Dependencies: Epic 1
Scope: XL → split below

FE-302 Render New Cleaning Request screen shell
As a clinician
I want to open the New Cleaning Request screen and see the header, two-column layout, and form scaffold
So that I can start composing a request

Acceptance Criteria:

 Layout matches design: body bg #f7fbed, left sidebar 256px (see INF-003), main column max-width 880px with 48px gap between 1fr form column and 240px summary column (nodes 1:25–1:26, 1:125)
 Sticky top header with breadcrumb DASHBOARD / NEW REQUEST, H1 "New Cleaning Request" (Manrope ExtraBold 36px, #181d15, -0.9px tracking), and right-aligned keyboard hint "Press ⌘ ↵ to submit" with keycap icons (nodes 1:4–1:24)
 Sticky bottom action bar: "SAVE AS DRAFT" link left; "CANCEL" secondary + "Submit Request" gradient CTA right (nodes 1:199–1:209)
 Responsive breakpoint: below 1100px content width, summary column moves below the form as a non-sticky card
 ⌘↵ / Ctrl+↵ submits from any focused field; Esc triggers Cancel (with dirty-form confirm); ⌘S saves draft
Design Reference: Full screen frame (node 1:2)
Size: M · Priority: P0

FE-303 Garment specifications repeater
As a clinician
I want to add one or more garments to the request, each with type, quantity, and optional tag
So that a single request can cover a batch

Acceptance Criteria:

 Section header "GARMENT SPECIFICATIONS" (Manrope Bold 14px uppercase, #94a3b8, 1.4px tracking) on a white card with 24px padding, 8px radius (nodes 1:38–1:40)
 Row grid: 1fr (type dropdown) / 100px (quantity stepper) / 1fr (tag input), 16px gap, 40px tall (node 1:42)
 Type dropdown: #f1f5e7 bg, 8px radius, chevron icon right, default unselected with placeholder
 Quantity stepper: − and + 24px buttons with integer 1–20, keyboard ↑/↓ supported, initial value 1
 Tag input: #f1f5e7 bg, placeholder "Tag #", scanner icon on right opens paired-scanner modal that listens for USB/Bluetooth HID barcode input and populates the field
 "+ Add garment" button (Public Sans Bold 14px teal #00626a) appends a new row; max 10 rows, button disables at cap with tooltip "Split large batches into multiple requests"
 Each non-first row shows a × remove affordance on row hover
 Inline validation: missing type shows red border + message; quantity out of bounds shows message
 Summary panel updates Items count live as rows change (see FE-402)
Design Reference: Garment Specifications (nodes 1:38–1:71)
Size: L · Priority: P0

FE-304 Cleaning protocol segmented control
As a clinician
I want to pick Standard, Sanitize, or Sterilize with clear turnaround context
So that I choose the right service for the garments

Acceptance Criteria:

 Segmented control: 3 equal columns, track #f1f5e7 with 4px padding, 4px gap, 40px tall, 8px outer radius, 4px inner radius (nodes 1:75–1:81)
 Selected pill: white bg, subtle shadow 0px 1px 2px rgba(0,0,0,0.05), text #00626a Public Sans Bold 14px
 Unselected pills: text #64748b Public Sans Medium 14px
 Keyboard: ←/→ arrows switch when focused; Space/Enter selects
 Helper banner below swaps text based on selection (node 1:82–1:85)
 Sterilize disabled with amber inline warning if any garment type lacks sterilize support; message: "Sterilize is unavailable for the selected garment types — choose Sanitize instead"
 Summary panel Protocol value updates live with a colored dot: Standard (gray #64748b), Sanitize (teal #2c7b83), Sterilize (amber #b5ac84)
Design Reference: Cleaning Protocol (nodes 1:72–1:85); summary dot (node 1:139)
Size: M · Priority: P0

FE-305 Expedite toggle row
As a clinician
I want to flip an Expedite toggle and see the surcharge implication
So that I can request a 4-hour turnaround when surgery volume demands it

Acceptance Criteria:

 Row on white card, 24px padding, 8px radius: toggle (24×48, #00626a active, #cbd5e1 inactive), label "Expedite this request" (Public Sans Bold 14px), subtext "4-hour turnaround · $24 surcharge per garment" (12px #64748b), trailing bolt icon 16×20 (nodes 1:86–1:95)
 Toggle has role="switch", aria-checked, ↑/↓ and Space toggle when focused
 When ON, summary panel shows Service: Expedited in teal bold; when OFF, row shows Service: Standard (or omits line — confirm with product)
 Surcharge in summary recomputes live (see FE-403)
Design Reference: Expedite row (nodes 1:86–1:95)
Size: S · Priority: P0

FE-306 Pickup location + additional notes row
As a clinician
I want to pick a ward and optionally add handling notes
So that the courier collects from the right place with the right care

Acceptance Criteria:

 Two-column grid, 24px gap, fields 48px tall white inputs with 8px radius (nodes 1:106–1:124)
 Left: label "PICKUP LOCATION" (Public Sans Black 10px uppercase, #64748b, 1px tracking); dropdown defaults to user's default pickup location, tag icon on right
 Right: label "ADDITIONAL NOTES"; textarea with placeholder "Specific stains or handling instructions…"; soft max 280 chars with live counter
 Notes field has inline helper "Do not include patient identifiers" in #94a3b8 12px below field
 When hazard toggle is ON and current pickup location is not hazard-eligible, show inline error and block submit
Design Reference: Pickup & Notes (nodes 1:106–1:124)
Size: S · Priority: P0

Epic 4: Live Request Summary & Pricing
Goal: The sticky right-column summary panel stays accurate as the form changes.
Dependencies: Epic 3
Scope: M

FE-402 Sticky summary panel — core fields
As a clinician
I want to see a live summary of my request as I build it
So that I can confirm the important values before submitting

Acceptance Criteria:

 Panel: #f0f4e6 bg, 16px radius, 24px padding, 240px wide, sticks to viewport top (nodes 1:125–1:156)
 Heading "REQUEST SUMMARY" (Public Sans Black 11px, rgba(0,98,106,0.6), 1.65px tracking)
 Rows: Items, Protocol (with colored dot), Service, with divider before Estimated Return
 Values update within 150ms of any form change; loading quote shows a muted pulse on affected rows
 Empty / pre-input state shows placeholders (e.g., "—") not "0 garments" to avoid suggesting a valid minimal request
 Panel is aria-live="polite" with a single announcement per 500ms debounce so screen reader isn't flooded
Design Reference: Summary panel (nodes 1:126–1:145)
Size: M · Priority: P0

FE-403 Summary panel — ETA & surcharge + biosecurity note
As a clinician
I want to see my estimated return time and total surcharge
So that I know when to expect items back and what it will cost

Acceptance Criteria:

 ESTIMATED RETURN label (Public Sans Black 10px uppercase #94a3b8) + value (Public Sans Bold 14px #181d15) — formatted "Today 6:40 PM" when same-day, "Tomorrow 9:15 AM" next day, "Apr 15, 2026 · 2:30 PM" otherwise (nodes 1:147–1:151)
 SURCHARGE label + value Manrope ExtraBold 20px #00626a, formatted "$48.00" with USD formatting (nodes 1:152–1:156)
 Below panel: sage rgba(230,234,220,0.5) reassurance card with shield icon + "Biosecurity compliant protocol guaranteed for all clinical garments." (nodes 1:157–1:161)
 Stale state (e.g., network error) shows last known value with a small amber dot
Design Reference: Nodes 1:147–1:161
Size: S · Priority: P0

Epic 5: Hazardous Material & Compliance
Goal: Clinicians disclose biohazards with visually distinct, compliance-ready UI.
Dependencies: Epic 3
Scope: M

FE-502 Hazardous material disclosure — collapsed (OFF) state
As a clinician
I want to see a visually distinct hazard section with an OFF toggle by default
So that I know hazardous disclosure is an explicit, deliberate action

Acceptance Criteria:

 Card with left border 4px #b5ac84, overlay bg rgba(181,172,132,0.2), inside a white 8px radius container (nodes 1:97–1:98)
 Header row: warning triangle icon + "HAZARDOUS MATERIAL DISCLOSURE" (Public Sans Bold 14px uppercase, #665f3d, 0.7px tracking)
 Toggle right-aligned, default OFF (#cbd5e1 track), tap target ≥44×44 inclusive of padding
 No other fields visible when OFF — collapsed cleanly
Design Reference: Hazard section OFF state (nodes 1:97–1:105)
Size: S · Priority: P0

FE-503 Hazardous material disclosure — expanded (ON) state
As a clinician handling contaminated garments
I want to specify the hazard categories and describe the contamination
So that handlers prepare proper PPE and the record is audit-ready

Acceptance Criteria:

 Turning the toggle ON animates expansion over 200ms and moves focus to the first checkbox
 Checkboxes (multi-select) in a 2-column grid: Blood / bodily fluids; Human tissue or remains; Chemical contaminant (reveals dependent text input when checked); Sharps risk; Infectious disease exposure (requires isolation handling)
 Required textarea "Contamination notes" minimum 15 chars with placeholder "e.g., Surgical gown exposed to arterial blood during trauma procedure. No known infectious pathogens." and visible counter
 Inline helper: "Do not include patient identifiers. Chain of custody is logged."
 Amber info banner at bottom of section: "Hazardous items route to our biohazard-certified facility. Chain of custody is logged and a compliance receipt is attached to your confirmation."
 Summary panel adds a Hazard row with amber dot when ON
 Form blocks submit with precise errors if: toggle ON + no category, or toggle ON + notes under 15 chars, or toggle ON + non-hazard-eligible pickup location
Design Reference: Hazard section ON state (implied; only OFF is rendered in the design)
ASSUMPTION: Expanded state is not in this Figma frame. Request the expanded-state design from product/design before build.
Size: M · Priority: P0

Epic 6: Drafts, Confirmation & Dispatch
Goal: Support save-draft and successful submission UX.
Dependencies: Epic 3
Scope: S

FE-602 Submission confirmation panel
As a clinician who just submitted
I want to see confirmation with request ID, ETA, courier info, and clear next actions
So that I trust the submission succeeded and know what happens next

Acceptance Criteria:

 On 201, main column replaces form with a confirmation card: "Request #UC-48219 submitted. Courier arriving in 28 minutes."
 Actions: "Submit another" (primary teal gradient, resets the form preserving only requester + pickup location), "View request" (secondary, navigates to request detail)
 Compliance receipt PDF link when hazard_enabled
 Analytics event request_submitted fires with properties: request_id, garment_count, protocol, expedite, hazard_enabled, surcharge_cents
Design Reference: Not rendered; spec follows product intent
Size: M · Priority: P0

Sequencing (critical path to shippable MVP)
Epic 0 (INF-003, INF-004 in parallel)
Epic 1 (FE-102 → FE-103)
Epic 3 (FE-302 → FE-303 → FE-304 → FE-305 → FE-306 in parallel pairs)
Epic 4 (FE-402 → FE-403)
Epic 5 (FE-502 → FE-503)
Epic 6 (FE-602)
A coherent MVP excludes: FE-103 (delegate submission) — marked P1.

Technical Review Report
Stories Reviewed: frontend-only subset
Issues Found:

🔴 FE-503: Expanded hazard state is not in the design
Story: FE-503 — Hazardous material disclosure (expanded)
Issue: Only the OFF/collapsed state is rendered in the shared Figma node. The expanded state (checkboxes, dependent chemical input, contamination notes textarea, amber info banner) is specified from product intent but not visually designed. Engineers will build it blind and likely mis-style it.
Evidence: get_design_context response shows only the overlay+vertical-border header with an inactive toggle; no expanded children
Recommended Fix: Request the expanded-state design from the designer before implementation. Block FE-503 until received.

🟡 FE-103: "CHANGE" visibility contradicts doctor-only flow
Story: FE-103 — Change requester flow
Issue: Design renders CHANGE unconditionally on the Requester card, but the AC says it's gated to coordinator/admin roles. Without the gate, every doctor sees a link to impersonate colleagues, which is a compliance concern.
Evidence: AC: "doctors see no CHANGE link" vs. design node 1:36 shows CHANGE always
Recommended Fix: Confirm intent with product. Either show CHANGE to all and add audit trail, or hide for doctor role.

🔵 INF-004: Confirm divergence from BRIEF/Prism palette
Story: INF-004 — Design token library
Issue: The UX agent doc references Prism palette (primary teal #2c7b83), but this Figma design uses #00626a as primary teal (darker). Either the design is evolving away from Prism or the UX doc is stale.
Evidence: Design node 1:13 uses #00626a; Prism CTA is #2c7b83
Recommended Fix: Add a Design Decision Record noting SterileFlow uses #00626a as primary; keep #2c7b83 as a gradient companion (seen in nodes 1:196, 1:206).

🔵 FE-303: Paired barcode scanner behavior is underspecified
Story: FE-303 — Garment specifications repeater
Issue: "Opens paired-scanner modal that listens for USB/Bluetooth HID barcode input" — no mention of hardware compatibility list or fallback when no scanner is paired.
Evidence: AC references scanner icon but no scanner pairing UX
Recommended Fix: Add AC: if no HID device is active, the modal offers manual entry with a clear "No scanner detected" state. List supported scanner models (Zebra DS2208 etc.) in tech notes.

MISSING: My Requests / Archive list views
Why It's Needed: Doctors will need to look up their submissions post-MVP; the nav entries are dead links otherwise
Suggested Story: Stub stories for placeholder list UIs, gated on design delivery
Suggested Priority: P1
Suggested Epic: New Epic 8 (Request Lifecycle)

Summary
Frontend-only story set across 6 epics, sequenced for parallel work.
P0 MVP = Epic 0 + 1 (minus FE-103) + 3 + 4 + 5 + Epic 6.
Key blocker before sprint planning: get the expanded hazard-state design.
