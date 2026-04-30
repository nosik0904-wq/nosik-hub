# NOSIK Hub Next Steps

## Phase 1B — Backend wiring

1. Create Supabase project.
2. Run `supabase/schema.sql`.
3. Replace localStorage with Supabase queries.
4. Add parent authentication.
5. Add real household IDs.
6. Add row-level security policies.

## Phase 1C — Mobile companion

Build the parent phone app with:

- Send Nudge / Knock / Blast
- Push notifications when Hub alerts are accepted
- Grocery updates
- Task completion alerts
- NOSIK Pass creation
- Carer handover note alerts

Recommended stack:

- Expo React Native
- Supabase JS client
- Expo Notifications first
- Firebase Cloud Messaging later if needed

## Phase 1D — Home Hub polish

- Large tablet layout refinements
- Sound on Blast
- Alert escalation if ignored
- Better calendar day/week switching
- Photo/avatar profiles
- Offline queue
- Installable PWA service worker

## Phase 2 modules

Standalone/add-on modules:

- NOSIK Mortgage
- NOSIK Debt
- NOSIK Pets

These should plug into the same household, calendar, task, alert and money-pressure system.

## Production security upgrades

- hash access PINs
- one-time and time-limited NOSIK Passes
- pass access logs
- parent-only audit screen
- emergency access controls
- encrypted vault storage
- per-section permissions
