# Photogallery Roadmap

This roadmap intentionally prioritizes a reliable self-hosted gallery core before optional SaaS features.

## Status values

- `NEXT`: one of the next tasks to start
- `IN_PROGRESS`: currently being implemented
- `TEST`: implementation completed, acceptance testing pending
- `BACKLOG`: planned but not currently active
- `DONE`: acceptance criterion met
- `LATER`: intentionally deferred optional work

## Working rule

Keep at most **one development task in `IN_PROGRESS`** and no more than **three tasks in `NEXT`**.

## P0 – Orientation and repository baseline

Goal: establish a controlled working state.

- Adopt the improved README and roadmap.
- Import the AppFlowy task database.
- Run Prisma validation, lint, and build.
- Remove dead buttons, commented legacy sections, and unused imports.
- Keep build output, storage data, generated clients, and secrets out of Git.

Exit criterion: the repository has a documented baseline and all existing failures are represented by task IDs.

## P1 – Security and correctness

Goal: fix architecture and security issues before expanding features.

1. Repair sign-up and visible validation errors.
2. Simplify global roles to `user` and `admin`.
3. Integrate Better Auth Admin.
4. Add `requireUser` and `requireAdmin`.
5. Introduce safe Client DTOs.
6. Make public gallery slugs globally unique.
7. Keep slugs stable when the title changes.
8. Fix dashboard statistics and expiry filters.
9. Require real production secrets.
10. Remove placeholder photographer data.

Exit criterion: a normal user can access only their own data, admin routes are protected, and client payloads contain no password hashes or storage keys.

## P2 – Complete the gallery core

Goal: finish the actual Pixieset-style collection workflow.

- Connect archive, restore, and delete actions.
- Remove or implement the duplicate action.
- Clean up upload artifacts after partial failures.
- Improve upload progress and per-file errors.
- Handle deleting the current cover.
- Optimize sets and dashboard for mobile.
- Re-enable favorite submission.
- Add selection export.
- Improve keyboard-accessible lightbox behavior.
- Add controlled empty, loading, expired, and error states.

Exit criterion:

```text
Login
→ create gallery
→ upload images
→ create sets
→ select cover
→ publish
→ enter gallery password
→ select favorites
→ submit selection
→ review selection in dashboard
→ download original
→ archive or delete gallery
```

## P3 – Production-ready authentication

Goal: make accounts recoverable and safe.

- Email provider abstraction
- Email verification
- Verify-email and resend flow
- Forgot/reset password
- Profile and security settings
- Session management
- Account deletion
- Rate limiting
- Optional captcha
- Better Auth admin actions

Exit criterion: a user can verify, recover, secure, and delete their account without manual database changes.

## P4 – Runtime platform settings

Goal: configure product behavior from the admin dashboard without storing secrets there.

- Add `PlatformSettings`.
- Store registration mode in the database:
  - `OPEN`
  - `INVITE_ONLY`
  - `DISABLED`
- Add registration settings UI.
- Add hashed registration invite codes.
- Add optional maintenance mode.
- Separate feature enablement from provider capabilities.
- Add a secure first-admin bootstrap flow.
- Add a read-only system status page.

Exit criterion: registration and product behavior can be changed at runtime, while provider secrets remain outside the database and browser.

## P5 – Minimal administration

Goal: operate a multi-user installation without building a large SaaS control plane.

- Separate `/admin` from `/dashboard`.
- Overview metrics
- User search and filtering
- Verification, role, and ban status
- Session revocation
- Storage overview
- Registration/invite management
- Audit log
- No secret display

Exit criterion: the installation can be operated safely by a global administrator.

## P6 – Storage and operations

Goal: avoid data loss and memory-heavy downloads.

- Harden local path validation.
- Stream local and S3 downloads.
- Calculate storage usage.
- Add hard and soft limits.
- Find and clean orphaned assets.
- Document and test backup/restore.
- Add health checks and structured logs.

Exit criterion: backup and restore have been tested, large downloads do not require full buffering, and storage drift can be detected.

## P7 – Tests and CI

Goal: prevent authorization and gallery regressions.

- Unit tests
- Ownership and public-access integration tests
- End-to-end core flow
- GitHub Actions
- Manual release checklist

Exit criterion: every push runs required checks and the critical user flow is tested.

## P8 – Self-hosted release

Goal: make the project installable and maintainable.

- Dockerfile
- Docker Compose
- Reverse proxy and HTTPS documentation
- Email and S3 documentation
- Upgrade and migration documentation
- License
- Changelog
- First stable release

Exit criterion: a fresh installation and an upgrade from the previous version have both been tested successfully.

## P9 – Optional SaaS features

Do not start this phase before the self-hosted core is stable.

- Entitlements
- Optional billing provider adapter
- Stripe implementation
- Custom-domain model
- DNS verification
- Host-based tenant routing
