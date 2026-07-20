# Photogallery

Photogallery is a self-hosted, open-source client gallery application for photographers. It focuses on the collection/gallery workflow of products such as Pixieset without trying to become a store, website builder, CRM, invoicing suite, or contract platform.

> Project status: active MVP development. The gallery foundation is implemented, but authentication hardening, complete favorite submission UX, administration, tests, and deployment documentation are still in progress.

## Scope

### Included

- Email/password authentication with Better Auth
- Per-user private dashboard
- Gallery creation and editing
- Draft, published, and archived gallery states
- Event and expiry dates
- Optional gallery password protection
- Private local or S3-compatible image storage
- JPEG, PNG, and WebP upload validation
- Original, display, and thumbnail variants generated with Sharp
- Gallery sets
- Cover image selection
- Configurable cover style, typography, color palette, grid columns, and spacing
- Public client galleries
- Lightbox
- Individual original downloads when enabled
- Client favorite selections and dashboard review

### Explicitly out of scope

- Store and print fulfillment
- Website builder
- CRM and appointment scheduling
- Invoices, contracts, and accounting
- Mobile applications
- Team workspaces and organization memberships
- Mandatory subscription billing

Optional billing and custom-domain support may be added later behind provider adapters and feature switches. They must not be required for a personal self-hosted installation.

## Architecture

```text
User
└── Gallery
    ├── GallerySet
    ├── Image
    │   ├── original
    │   ├── display
    │   └── thumbnail
    └── FavoriteSubmission
        └── FavoriteItem
```

A user is an authenticated account. A gallery is owned directly through `Gallery.ownerId`. The simplified global role model is:

- `user`: normal photographer account
- `admin`: platform or installation administrator

Clients who view a shared gallery are guests and do not need dashboard accounts.

## Tech stack

- Next.js 16 App Router
- React 19
- JavaScript
- Tailwind CSS 4
- shadcn/Base UI components
- PostgreSQL
- Prisma 7
- Better Auth
- Sharp
- Local filesystem or S3-compatible storage
- pnpm

## Repository structure

```text
prisma/
  schema.prisma
  migrations/

src/
  app/
    (admin)/dashboard/
    (auth)/
    api/
    g/[slug]/
    preview/
  components/
  features/
    admin/
    auth/
    public-gallery/
  lib/
    auth/
    dashboard/
    db/
    galleries/
    images/
    storage/
```

## Requirements

- Node.js compatible with Next.js 16
- pnpm
- PostgreSQL
- Write access to the local storage directory, or an S3-compatible bucket

## Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Configure at least:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/photogallery?schema=public"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

STORAGE_DRIVER="local"
LOCAL_STORAGE_DIR="./storage"
MAX_UPLOAD_MB="15"
```

4. Generate Prisma Client and run development migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

5. Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Available commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:studio
```

## Storage

### Local storage

```env
STORAGE_DRIVER="local"
LOCAL_STORAGE_DIR="./storage"
```

The storage directory must be persisted in production and included in backups.

### S3-compatible storage

```env
STORAGE_DRIVER="s3"
S3_ENDPOINT=""
S3_REGION="auto"
S3_BUCKET=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_FORCE_PATH_STYLE="true"
```

The application stores object keys in PostgreSQL and serves protected assets through authenticated or gallery-access-controlled routes.

## Configuration model

Not every setting belongs in `.env`.

### Keep in environment variables

These values are secrets, deployment capabilities, or values required before the database can be read:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- Storage provider and credentials
- Email provider credentials
- Billing provider credentials
- Domain provider credentials
- Hard infrastructure limits
- Public application base URL

### Store in the database and edit in the admin dashboard

These are runtime product settings that should change without a redeploy:

- Registration mode: open, invite-only, or disabled
- Default plan
- Maintenance mode
- Feature switches
- Soft upload and storage limits
- Whether configured billing or custom-domain capabilities are enabled

A dashboard switch may only enable a feature when its provider is configured through environment variables. See `CONFIGURATION_GUIDE.md`.

## Security principles

- Every dashboard query and mutation must enforce `ownerId` server-side.
- Hiding a button is never an authorization check.
- Password hashes and storage keys must not be passed to Client Components.
- Public original assets must only be served through protected download routes.
- Gallery password validation happens server-side.
- File type is verified from file content.
- Storage keys must reject path traversal.
- Production must not use fallback development secrets.
- Registration, login, password gates, and public submissions need rate limiting.

## Current known work

The highest-priority work is tracked in `ROADMAP.md`:

1. Repair sign-up validation and field errors.
2. Replace global OWNER/PHOTOGRAPHER/VIEWER roles with `user` and `admin`.
3. Add Better Auth Admin and server-side `requireAdmin`.
4. Introduce Client DTOs that exclude password hashes and storage keys.
5. Make public slugs globally unique and stable.
6. Correct dashboard statistics and expiry filtering.
7. Re-enable the favorite submission form.
8. Harden upload cleanup and cover deletion.
9. Add email verification and password reset.
10. Add database-backed platform settings and a minimal admin area.

## Validation before committing

```bash
pnpm prisma:generate
pnpm lint
pnpm build
```

For schema changes, also run:

```bash
pnpm exec prisma validate
pnpm prisma:migrate
```

## Development workflow

- Keep only one task in progress.
- Use the roadmap task ID in branches and commits when practical.
- Move a task to `TEST` after implementation.
- Run the relevant checks.
- Move it to `DONE` only after the acceptance criterion is met.
- Do not start optional billing or custom-domain work before the self-hosted gallery core is stable.

## Roadmap

See [ROADMAP.md](./ROADMAP.md).

## License

No license has been selected yet. Add a `LICENSE` file before presenting the repository as reusable open-source software.
