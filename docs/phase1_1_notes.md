# NOSIK Hub Phase 1.1 Notes

## What changed from Phase 1

Phase 1 had many features visible at once. Phase 1.1 starts cleaner and adds:

- Feature states: `on`, `suggested`, `hidden`, `paused`, `off`
- Household/user/device design direction
- Explicit Household / Community and Private User calendar layers
- Calendar visibility values for Hub, parent, kid, grandparent, carer and private views
- NOSIK Assist cards
- NOSIK Tidy behaviour
- Optional Pulse
- Hidden optional Partner Help and Secret Wingman placeholders
- Stronger security direction for Vault and backups

## Feature philosophy

NOSIK should feel:

```text
Small enough to start today.
Smart enough to grow with your life.
Secure enough to trust with your household.
```

## Suggested build order after this prototype

1. Wire Supabase auth and household tables.
2. Make Hub and parent phone app sync in real time.
3. Add access logs for PIN/PASS use.
4. Add push notifications for Nudge/Knock/Blast.
5. Add real feature settings per household, user and device.
6. Add backup/export system.
7. Only then expand Vault and advanced features.
