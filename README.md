# Photogallery

Photographer client-gallery SaaS MVP built with Next.js App Router, JavaScript, Tailwind CSS, PostgreSQL, Prisma, Better Auth, and local private image storage with an adapter boundary for S3-compatible storage later.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in `.env`.

4. Generate Prisma client and run migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

5. Start the dev server:

```bash
pnpm dev
```

## Validation

Run these after meaningful changes:

```bash
pnpm install
pnpm prisma:generate
pnpm lint
pnpm build
```

## Scope

Included: photographer auth, admin dashboard, galleries, image upload, responsive client galleries, lightbox, favorites, individual downloads, and server-side access checks.

Excluded: store, payments, invoices, contracts, CRM, print fulfillment, team accounts, mobile app, website builder, and advanced billing.
