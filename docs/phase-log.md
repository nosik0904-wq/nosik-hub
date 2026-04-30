# Phase Log

## Phase 1.2 — Role views, settings, tidy, vault

Built on top of Phase 1.1.

**New role views (all PIN-routed):**
- Kid Home (PIN 1111–4444) — personal job list, tonight's dinner, alerts
- Grandparent Mode (PIN 2468 — Nan) — family calendar filtered to grandparents_visible, tonight's dinner, public tasks
- Carer Mode (PIN 8642 — Sarah) — Easton's full care profile: routine, food notes, calm notes, emergency contacts, appointments, handover note
- Visitor Mode (PIN 9090) — tonight's schedule, house rules, emergency contacts and home address

**Settings panel (Menu dock):**
- Animation toggle: Off / Low / Normal — applies `anim-off`/`anim-low`/`anim-normal` to body
- Optional features with state cycling (on/off/paused/hidden)
- Privacy defaults display
- Access log (demo entries)
- Backups placeholder

**NOSIK Tidy:**
- Two demo suggestions: NOSIK Pulse and Screen Balance
- Try / Hide / Pause / Keep actions update feature state immediately

**Vault Lite:**
- Five demo vault items with expiry, reminder, storage, and notes
- Phase 2 note for full secure upload

**Data:**
- Expanded calendarItems with grandparents_visible and carer_visible entries
- eastonCare profile (routine, food notes, calm notes, emergency contacts, handover)
- visitorInfo (house rules, tonight's schedule, emergency contacts)
- vaultItems and tidySuggestions arrays
- features extended with state/label/note for all modules
- settings object with animation default

**Run:** `python -m http.server 8080` → `http://localhost:8080/hub/`

---

## Phase 1.1 — static scaffold

- Added required `shared/` layer.
- Added `/hub/` tablet entry with Daily List, Groceries, Meals, Night Before, Alerts and PIN routing.
- Added `/app/` phone companion entry using the same state and DB helpers.
- Replaced schema with v3 Phase 1 table names used by the shared DB layer.
- Kept the app runnable with `python -m http.server 8080`.
