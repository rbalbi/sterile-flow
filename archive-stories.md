Design → Stories: SterileFlow Request Archive
Source design: Figma — node 4:300 (file GEqG68qiD3vQ5z00jOM2pJ)
Product context: one-pager.md + existing stories in user-stories.md
Scope captured in design: Full Archive screen with app shell updates (global top bar, sidebar user pill), summary strip, filter bar, data table, pagination.

Product Decomposition
Observed behaviors:

Global top app bar with search, notifications, help, user avatar
Sidebar user profile pill at bottom
Page header with breadcrumb + H1 + Export CSV
Summary strip with 3 stat cards (completed-this-week / avg turnaround / hazard receipts)
Filter bar (date range, protocol, hazard-only toggle, text search, clear)
Tabular list with 7 columns + colored protocol indicators + variant status pill
Late/early timing badges on completed column
Pagination
Sidebar "Archive" now active

Epic Map (delta against existing user-stories.md)
#	Epic	Scope	Depends on
0	Foundation (app shell extended)	Top app bar, sidebar user pill	—
8	Request Archive	Browse/filter/export completed requests	0, 3, 6

Epic 0 Delta — App Shell Extensions
Goal: Extend the existing shell to match the Archive design's global chrome.
Dependencies: existing INF-003, INF-004.
Scope: M

INF-006 Global top app bar
As a user on any authenticated screen
I want to see a persistent top bar with search, notifications, help, and my avatar
So that I can search, be notified, and get context without leaving the current screen

Acceptance Criteria:

 Top bar renders above the main column on every authenticated route; 64px tall, full-width of the main column (not over the sidebar), backdrop-blur-12 with rgba(255,255,255,0.7) background and 1px rgba(241,245,249,0.2) bottom border
 Left: Search input, 384px wide, #e0e4d6 bg, 12px radius, 18×18 magnifier icon, Manrope placeholder #94a3b8 14px. Placeholder text is route-aware: "Search archive records..." on /archive, "Search requests..." elsewhere
 Right group (24px gap): notification bell with 8×8 #ba1a1a unread dot, help "?" icon, 1px 24px-tall divider rgba(190,200,202,0.2), 32×32 user avatar rounded-12 with 2px rgba(0,98,106,0.1) ring
 Keyboard: ⌘K / Ctrl+K focuses the search input from any route
 Search on /archive feeds FE-803's text filter (shared state); on other routes it's a no-op stub
Technical Notes:

Extend src/components/Sidebar.tsx into a Shell wrapper, or add src/components/TopAppBar.tsx rendered from src/app/layout.tsx
Notification count is mocked (hardcoded unread = 1 for frontend-only scope)
Design Reference: Header TopAppBar (node 4:343–4:359)
ASSUMPTION: The bar is new in this frame and wasn't in the New Request design. It's probably meant to be global. Confirm with product whether it appears on /requests/new as well.
Size: M · Priority: P0

INF-007 Sidebar user profile pill
As a clinician
I want to see my identity and role at the bottom of the sidebar
So that I can confirm I'm signed in as the right person before submitting

Acceptance Criteria:

 Bottom of the existing sidebar: 56px tall card, #f1f5e7 background, 8px radius, 16px padding, 12px gap
 Left: 40×40 avatar rounded-12 from users.avatar_url, fallback initials on #ecf0e2
 Center stack: name Manrope Bold 14px #181d15 tight leading; role + unit Public Sans Regular 12px #64748b ("Charge Nurse, Unit 4")
 Click anywhere on the pill navigates to /settings (Coming Soon shell for now)
Technical Notes:

Update src/components/Sidebar.tsx to render a UserPill child below the "New Cleaning Task" CTA
Data source: CURRENT_USER mock in src/lib/mock-users.ts
Design Reference: Aside — SideNavBar user block (nodes 4:335–4:341)
Size: S · Priority: P0

INF-008 Sidebar "Archive" nav becomes route-active
As a user on the Archive route
I want to see the "Archive" sidebar item visually active
So that I know where I am in the app

Acceptance Criteria:

 Active nav item is determined from usePathname(), not hardcoded (drops the hardcoded active: true on "New Request")
 Active item: #e0e4d6 background, #00626a bold text, 4px right teal border (border-r-4 border-[#00626a])
 Matching for /archive is exact; /archive/:id (future detail view) also highlights "Archive"
Technical Notes:

Sidebar.tsx becomes a client component to read usePathname
Design Reference: Nav (node 4:325)
Size: S · Priority: P0

Epic 8: Request Archive
Goal: Clinicians and coordinators can browse, filter, and export completed cleaning requests, and retrieve compliance receipts for hazardous jobs.
Dependencies: Epic 0 (incl. INF-006–008), Epic 3 (submissions exist), Epic 6 (completed requests land here)
Scope: L

FE-801 Archive page shell and route
As a user who clicks "Archive" in the sidebar
I want to land on /archive with the page header and empty scaffold rendered instantly
So that the transition feels fast even before data loads

Acceptance Criteria:

 New route src/app/archive/page.tsx
 Header block (max-width 1120px, 32px horizontal padding): breadcrumb DASHBOARD › ARCHIVE in Public Sans Medium 11px #94a3b8 uppercase with 1.1px tracking (ARCHIVE segment in #00626a); H1 "Request Archive" Manrope ExtraBold 36px #181d15 tracking -1.8px; right-aligned Export CSV button (FE-812)
 Decorative gradient blur element: absolute, top-right, 800×800, blur(60px), 30% opacity, linear-gradient(135deg, rgba(0,98,106,0.1) 0%, transparent 50%)
 Page background #f7fbed already set by layout
Design Reference: Page Canvas + Header Section (nodes 4:360–4:375)
Size: S · Priority: P0

FE-802 Summary strip
As a charge nurse
I want to see at a glance how many requests completed, average turnaround, and hazard-receipt count
So that I can report weekly performance without opening every row

Acceptance Criteria:

 Three-column grid, 24px gap, below the header, above the filter bar
 Each card: white, 16px radius, 24px padding, subtle shadow 0 1px 2px rgba(0,0,0,0.04), 1px border #ffffff
 Label row: Public Sans SemiBold 12px #64748b uppercase, 0.6px tracking
 Card 1 "COMPLETED THIS WEEK" — big number "12" in #00626a Public Sans SemiBold 36px; secondary line "12 requests · 48 garments" in #94a3b8 14px
 Card 2 "AVG TURNAROUND" — big number "18h 22m" in #00626a SemiBold 36px tracking -1.8px; inline green delta pill — #ecfdf5 bg, tiny down-arrow icon, #059669 SemiBold 12px "-4%" (or up-arrow "+X%" in #dc2626 on #fef2f2 when trend is worse)
 Card 3 "HAZARD RECEIPTS" — big number "3" in #665f3d SemiBold 36px; label stack: "issued" in #665f3d SemiBold 12px + "Compliance archive up to date" in #94a3b8 10px
 Values derive from the current result set (reflect active filters)
Design Reference: Summary Strip (nodes 4:376–4:406)
ASSUMPTION: Delta pill direction is semantic — green when turnaround improves (lower), red when it gets worse (higher). Confirm with product.
Size: M · Priority: P0

FE-803 Filter bar
As a user auditing archived requests
I want to narrow the list by date range, protocol, hazard-only, or free-text search
So that I can find the records I need without scrolling 1,200+ rows

Acceptance Criteria:

 Card below summary strip: white, 16px radius, 17px padding, shadow 0 4px 20px rgba(0,0,0,0.03), 1px border rgba(241,245,249,0.5)
 4-column grid (16px gap) for the field group + trailing "Clear filters" link
 Every input field uses a floating-label pattern: label sits on the top-left border in a white chip, 10px Public Sans SemiBold #94a3b8 uppercase tracking -0.5px
 Date range (col 1) — calendar icon + text "Apr 01 - Apr 15, 2026"; click opens a date-range picker; default range = last 14 days
 Protocol (col 2) — select: "All Protocols" default; options "All / Standard / Sanitize / Sterilize"; chevron at right
 Hazard Only (col 3) — pill-shaped sage #f1f5e7 container; toggle track #b5ac84 when ON with white thumb; label "HAZARD ONLY" in #181d15 SemiBold 12px uppercase tracking -0.6px
 Search (col 4) — text input, placeholder "Search by ID or Unit..." in #cbd5e1 14px; client-side matches on request.id and pickupLocation.label, debounced 250ms
 "Clear filters" link — Public Sans SemiBold 12px #00626a; resets date to last 14 days, protocol to All, hazard toggle OFF, search cleared
 Filter state is reflected in the URL query string (?from=…&to=…&protocol=…&hazard=1&q=…) so a link is shareable
 Any filter change updates the table, summary strip, and pagination count immediately
Design Reference: Filter Bar (nodes 4:569–4:596)
Size: L · Priority: P0

FE-804 Archive table — structure
As a user scanning completed requests
I want to see a dense, readable table with the key fields and clear column headers
So that I can audit at speed without opening each row

Acceptance Criteria:

 Card: white, 16px radius, 1px border #f1f5f9, shadow 0 1px 2px rgba(0,0,0,0.04), overflow-clip with 1px padding so rows don't touch the border
 Real <table> markup with <thead> / <tbody> / <th scope="col">
 Header row: rgba(241,245,231,0.5) sage tint; columns in fixed widths matching the design (104 / 121 / 159 / 115 / 120 / 120 / 218 px)
 Column labels — Public Sans SemiBold 10px #94a3b8 uppercase tracking 1px: REQUEST ID, SUBMITTED, GARMENTS, PICKUP, COMPLETED, SURCHARGE (right), STATUS (center)
 Body rows: 74px target height, 1px top border #f8fafc from row 2 onward
 Row hover: bg #f7fbed, cursor pointer (clicks are wired in FE-810)
Design Reference: Archive Table header + body (nodes 4:407–4:547)
Size: M · Priority: P0

FE-805 Archive row — Request ID + Submitted cells
Acceptance Criteria:

 Request ID: Manrope Bold 16px #00626a, displayed as two-line UC- / 48219 as in the design
 On row hover, a small clipboard icon appears right of the ID; click copies "UC-48219" to clipboard with a toast "Copied"; stopPropagation so the row click doesn't fire
 Submitted: Public Sans Medium 12px #475569; two-line "Apr 13, 2026" then "· 8:14 AM" with "8:14 AM" in #94a3b8
Design Reference: Row data (nodes 4:427–4:430)
Size: S · Priority: P0

FE-806 Archive row — Garments cell with protocol dot + pill
As a user scanning protocols at a glance
I want to see a colored dot plus a pill label for each row's protocol
So that I can spot sterilize runs even at a peripheral glance

Acceptance Criteria:

 Dot (8×8, fully rounded): Standard = #0f172a navy; Sanitize = #10b981 green; Sterilize = #f59e0b amber with box-shadow 0 0 8px rgba(245,158,11,0.4) glow
 Count: Public Sans SemiBold 12px #181d15, "N items" (with correct singular "1 item")
 Pill (right of count): 2px radius, 6px/7px padding — Standard: bg #f1f5f9, text #475569; Sanitize: bg #ecfdf5, text #047857; Sterilize: bg #fffbeb, border #fef3c7, text #b45309
 Pill text is Public Sans Regular 10px
Design Reference: Row 1–5 garments column (nodes 4:431–4:436, 4:459–4:464, 4:481–4:486, 4:506–4:511, 4:531–4:536)
Size: S · Priority: P0

FE-807 Archive row — Pickup cell
Acceptance Criteria:

 Public Sans Medium 12px #64748b; renders location label with a soft-wrap ("ICU — West 4", "Main OR — 3", "Emergency — East 1", "Pediatrics — West 2")
 If label exceeds ~24 chars, truncate with ellipsis + tooltip showing full name
 Left-padded 48px to sit clear of the garments column
Design Reference: Pickup cell (nodes 4:437–4:438, 4:465–4:466, 4:487–4:488, 4:512–4:513, 4:537–4:538)
Size: S · Priority: P0

FE-808 Archive row — Completed cell with ETA-delta badge
As a user monitoring on-time performance
I want to see at a glance whether a request finished late, early, or on time
So that I can spot SLA breaches quickly

Acceptance Criteria:

 Primary line: Public Sans SemiBold 12px #181d15; format "Apr 13, 9:42 AM" (drops year when same year as today)
 Delta sub-line (Public Sans SemiBold 10px):
  - Late (completed > eta + 5min): #ba1a1a red, text "+{delta}m late" (minutes if <90, otherwise "+Xh Ym late")
  - Early (completed < eta - 5min): #059669 green, text "Early" when delta <15 min, otherwise "−{delta}m early"
  - On-time (|delta| ≤ 5 min): no badge
 Delta rendered only when the original ETA is known (from submission quote)
Design Reference: Completed cell (nodes 4:439–4:443, 4:489–4:493, 4:514–4:515, 4:539–4:540)
Size: M · Priority: P0

FE-809 Archive row — Surcharge cell
Acceptance Criteria:

 Right-aligned, Manrope Bold 14px, tabular-nums
 When surcharge_cents > 0: #181d15, formatted as USD (e.g., "$48.00")
 When surcharge_cents === 0: em-dash "—" in #cbd5e1
 48px left padding separates it from Completed cell
Design Reference: Surcharge cell (nodes 4:444–4:445, 4:469–4:470, 4:494–4:495, 4:516–4:517, 4:541–4:542)
Size: S · Priority: P0

FE-810 Archive row — Status pill + receipt link + row click
As a compliance officer
I want to see completion status and download the hazardous-material receipt
So that audits don't require tracking down PDFs one-by-one

Acceptance Criteria:

 Pill container: #ecfdf5 bg, 1px #d1fae5 border, 12px radius, 13px horizontal / 5px vertical padding, gap 4px, centered in the cell
 Text: Public Sans SemiBold 10px #047857
 Non-hazard completed: ✓ COMPLETED (check icon 11.667×11.667)
 Hazard completed (has receipt): ✓ COMPLETED · ⬇ RECEIPT (the "·" is plain text, ⬇ is a download-arrow icon 9.333×11.667)
 Receipt icon/text click: opens compliance PDF in a new tab (mocked link for this scope); stopPropagation() so row click doesn't fire; aria-label "Download compliance receipt for UC-48219"
 Row click (anywhere but buttons/icons): navigates to /archive/:id (detail view — see missing story); renders a "Coming soon" placeholder until built
 Entire row is keyboard-focusable with 2px #00626a focus ring + 2px offset; Enter triggers row click
Design Reference: Status cell (nodes 4:446–4:453, 4:471–4:475, 4:496–4:500, 4:518–4:525, 4:543–4:547)
Size: M · Priority: P0

FE-811 Pagination controls
Acceptance Criteria:

 Below table, 24px top gap, 32px horizontal padding matching table
 Left: "Showing {from}–{to} of {total} completed requests" — Public Sans Medium 12px #94a3b8
 Right control group (4px gap): prev arrow 32×32 rounded 4px (30% opacity + non-interactive on page 1); numbered page buttons 32×32 (active = #00626a bg, white SemiBold 12px; inactive = #181d15 Medium 12px, transparent bg); ellipsis "..." in #cbd5e1 16px; next arrow mirror of prev
 Page size: 25 rows/page
 Keyboard: ←/→ moves between pages when focus is in the control group
 URL reflects page state (?page=3)
Design Reference: Footer Pagination (nodes 4:548–4:566)
ASSUMPTION: Design shows 5 rows per page (canvas space). Production should be 25; flag with product.
Size: M · Priority: P0

FE-812 Export CSV button
As a coordinator preparing a compliance report
I want to export the filtered archive to CSV
So that I can share it with auditors or finance

Acceptance Criteria:

 Button in header right-aligned: #dbd5fd lavender bg, 8px radius, shadow 0 1px 2px rgba(0,0,0,0.05), 10px vertical / 24px horizontal padding, 8px gap
 Icon: download-arrow 13.333×13.333 in #5f5b7d
 Label: Public Sans SemiBold 14px #5f5b7d centered
 Click exports the CURRENT filtered result set as CSV (not the full 1,248 rows)
 Filename: sterileflow-archive-{hospital-slug}-{YYYYMMDD}.csv
 Columns: request_id, submitted_at, garments, protocol, pickup_location, completed_at, eta_delta_minutes, surcharge_usd, status, hazard_receipt_url
 While building >500 rows, button shows a spinner and "Exporting..." state
 Privacy boundary: notes fields are NOT included (no free text that could carry PHI)
Design Reference: Export CSV button (nodes 4:372–4:375)
Size: M · Priority: P1

FE-813 Empty state — no completed requests yet
Acceptance Criteria:

 Shows when the hospital has zero completed requests (distinct from "filters matched nothing")
 Centered in the table card area: sage shield icon, "No completed requests yet" Manrope Bold 20px #181d15, "Submitted requests land here once the courier returns them" Public Sans 14px #64748b, CTA button "Start a cleaning request" (teal gradient) linking to /requests/new
 Summary strip still renders — with zeros and "—" deltas
Size: S · Priority: P0

FE-814 Empty state — no matches for filters
Acceptance Criteria:

 Shows when filters applied but result set is empty
 Copy: "No matches for these filters" + "Clear filters" action (fires FE-803 clear)
 Summary strip reflects the filtered zero-set
Size: S · Priority: P0

FE-815 Archive loading state
Acceptance Criteria:

 Header and filter bar render immediately
 Summary strip shows muted "—" values, same card shape
 Table body renders 5 skeleton rows — pulsing #f1f5e7 rectangles matching row height
 Completes within 300ms on typical connection (client-side mock)
Size: S · Priority: P0

FE-816 Archive error state
Acceptance Criteria:

 Inline red banner at top of main column: 4px left border #dc2626, bold #dc2626 text "Couldn't load your archive. Reload" + retry button
 Banner dismisses on successful retry
Size: S · Priority: P1

FE-817 Mock archive data for frontend-only MVP
As an engineer
I want to seed realistic archive data locally
So that the Archive screen is demonstrable end-to-end

Acceptance Criteria:

 src/lib/mock-archive.ts exports ≥ 60 archived requests covering:
  - All three protocols (standard / sanitize / sterilize)
  - Hazard-enabled and non-hazard
  - Late (+18m, +42m), early (Early, −27m early), and on-time completions
  - Surcharge = $0 ("—") and surcharge > $0
  - At least one row per pickup location defined in src/lib/catalog.ts
 Helper queryArchive({ from, to, protocol, hazardOnly, q, page, pageSize }) returns { rows, total, stats } with filters applied
 Data is deterministic (seeded) so screenshots are stable
Technical Notes:

Shape mirrors what a real data source would return, so the UI wiring is the same either way
Size: M · Priority: P0

Sequencing (critical path)
INF-006 top bar → INF-007 user pill → INF-008 route-active nav (Epic 0 extension, in parallel)
FE-817 mock data
FE-801 page shell → FE-802 summary strip → FE-803 filter bar (in parallel after shell)
FE-804 table structure → then rows FE-805 / FE-806 / FE-807 / FE-808 / FE-809 / FE-810 (parallel pairs)
FE-811 pagination, FE-812 export CSV (parallel)
FE-813 / 814 / 815 / 816 empty / loading / error states, last

A coherent MVP of the Archive excludes FE-812 (export CSV) and FE-816 (error state); both P1.

Technical Review Report
Stories Reviewed: 20 (3 Epic 0 extensions + 17 Archive stories)
Issues Found:

🔴 Blockers: 2 — Must fix before sprint planning
🟡 Warnings: 3 — Should fix
🔵 Suggestions: 3 — Nice to fix
✅ Clean: 12
Missing Stories Identified: 2
Important caveat: there is still no Technical Architecture doc in the repo. All notes assume the frontend-only scope of the current user-stories.md.

🔴 FE-810: Row click navigates to a detail route that doesn't exist
Story: FE-810 — Status pill + receipt link + row click
Issue: AC says "Row click navigates to /archive/:id (detail view — out of scope for this epic, renders a 'Coming soon' placeholder)." Shipping a hover-pointer row that goes to a dead placeholder is worse UX than not making the row clickable at all.
Evidence: AC: "navigates to /archive/:id" — no corresponding page designed or scoped
Recommended Fix: Either (a) drop row click from MVP and make only the Request ID a link (to a simple inline expansion modal), or (b) add a companion story for the detail view before this ships. Decide with product.

🔴 INF-006 + existing INF-003: Top bar is a breaking change to the current shell
Story: INF-006 — Global top app bar
Issue: The existing New Cleaning Request screen has its own sticky header with breadcrumb + H1 + "Press ⌘↵ to submit" hint. If INF-006 lands as a global bar, those two headers stack and the ⌘↵ hint collides with the notifications/help icons.
Evidence: Figma node 4:343 top bar + existing /requests/new sticky header (NewRequestForm.tsx lines 132–159)
Recommended Fix: Pick one: (a) keep INF-006 global and remove the per-screen sticky header on New Request (move ⌘↵ hint into the top bar's right group), or (b) make INF-006 archive-only. Product + design need to confirm.

🟡 FE-803: Date picker library not specified
Story: FE-803 — Filter bar
Issue: AC says "click opens a date-range picker" but doesn't name a library. The project has no date-picker dependency yet, and Tailwind v4 styling means dropping in an unstyled picker will be ugly without effort.
Evidence: AC: "click opens a date-range picker (use react-day-picker or similar local-only picker)"
Recommended Fix: Pin a choice now — react-day-picker is a good default (small, themeable via CSS vars). Add a Technical Note committing to it.

🟡 FE-804: Virtualization threshold is unexplained (withdrawn)
Story: FE-804 — Archive table structure
Issue: Earlier spec hinted at virtualization; with page size 25, no page ever exceeds 25 rows, so virtualization would be dead code.
Evidence: Page size = 25 (FE-811)
Recommended Fix: Leave virtualization out of MVP. Revisit if pagination becomes infinite scroll.

🟡 FE-811: Page size mismatch between design and production
Story: FE-811 — Pagination controls
Issue: Design shows 5 rows and "Showing 5 of 1,248". Story specifies production page size = 25. That contradicts the on-screen string.
Evidence: Design text "Showing 5 of 1,248 completed requests" (node 4:550)
Recommended Fix: Confirm production page size. If 25, document that design copy is illustrative. If 5, FE-811 page size must change.

🔵 INF-006: Search scope ambiguity
Story: INF-006 — Global top app bar
Issue: AC says top-bar search "feeds FE-803's text filter." FE-803 has its own search box. Two search inputs for the same thing is confusing.
Evidence: AC: "Search on /archive feeds FE-803's text filter (shared state)"
Recommended Fix: Either (a) drop the filter-bar search on /archive, or (b) keep top-bar search for global only. Pick one.

🔵 FE-802: Trend calculation source is undefined
Story: FE-802 — Summary strip
Issue: The -4% delta on "Avg turnaround" implies a comparison to a prior window. AC doesn't say what.
Evidence: AC: "green delta pill ... -4%"
Recommended Fix: Specify: "compares current filter window to the preceding window of the same duration."

🔵 FE-812: Privacy boundary for CSV export
Story: FE-812 — Export CSV
Issue: AC mentions PHI scrub for notes fields. An engineer may not know the rule exists since NFR-703 is out of scope.
Evidence: AC: "notes fields are NOT included in the export"
Recommended Fix: Inline the rule directly (done) and add a unit test story: "CSV export test fixture verifies no field matching PHI regex slips through."

MISSING: Archive detail view /archive/:id
Why It's Needed: FE-810 navigates to it; without a detail view, the row click is a dead end. Also the natural home for chain-of-custody events, expanded garment list, and receipt download.
Suggested Story: "FE: Archive detail page showing full request metadata, garment list, chain-of-custody timeline, and compliance receipt link"
Suggested Priority: P0
Suggested Epic: Epic 8 (Request Archive)

MISSING: Toast / notification primitive
Why It's Needed: FE-805 requires a "Copied" toast for clipboard. No toast system exists in the codebase yet.
Suggested Story: "FE: App-wide toast primitive using a lightweight Radix Toast or local portal component"
Suggested Priority: P1
Suggested Epic: Epic 0 (Foundation)

Summary
20 stories across 2 epic areas (Epic 0 extensions + Epic 8 Archive), sequenced for parallel work.
P0 MVP of the Archive excludes FE-812 (CSV) and FE-816 (error state) — both P1.
Two blockers to resolve before sprint planning: the dead /archive/:id click target, and the collision between the new global top bar and the existing /requests/new header.
