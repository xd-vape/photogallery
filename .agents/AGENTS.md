# AGENTS.md

## Project

This is a photographer client-gallery SaaS MVP.

The product is inspired by Pixieset-style client galleries, but the scope is intentionally smaller.

Build only:

- Photographer admin dashboard
- Client galleries
- Image upload
- Photo grid
- Lightbox
- Favorites / client selections
- Individual downloads
- Basic access control

Do NOT build:

- Store
- Stripe/payment system
- Invoices
- Contracts
- CRM
- Print fulfillment
- Mobile app
- Website builder
- Team accounts
- Advanced subscription billing

## Tech Stack

Use:

- Next.js App Router
- JavaScript, not TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Server Components where appropriate
- Route Handlers for API endpoints
- S3-compatible object storage architecture
- Sharp for image processing where needed

Prefer clean, simple MVP architecture over over-engineered abstractions.

## Product Rules

A photographer can:

- Sign up / log in
- Create galleries
- Edit galleries
- Archive galleries
- Delete galleries
- Upload images to galleries
- Reorder images
- Delete images
- Enable or disable downloads
- See submitted client favorites

A gallery has:

- title
- slug
- description
- status: draft, published, archived
- optional password protection
- optional expiry date
- optional cover image
- downloadEnabled flag

A client can:

- Open a public gallery link
- Enter password if required
- View images in a responsive grid
- Open images in a lightbox
- Favorite/unfavorite images
- Submit favorites with name and email
- Download individual images only if downloads are enabled

## Security Rules

- Enforce gallery ownership server-side in all admin routes.
- Never allow one photographer to access another photographer’s galleries.
- Password-protected galleries must be validated server-side.
- Do not rely only on frontend hiding for protected content.
- Do not expose original private image URLs directly.
- Use secure download routes or signed URLs.
- Validate all user input.
- Prevent arbitrary file access and path traversal.
- Use safe slug generation.

## Code Style

- Use readable JavaScript.
- Keep components small.
- Use server actions or route handlers consistently.
- Put shared server utilities in `lib/`.
- Put reusable UI components in `components/`.
- Keep Prisma access centralized where it makes sense.
- Add loading, empty, and error states for important user flows.
- Prefer explicit names over clever abstractions.

## Expected Validation

After meaningful changes, run the available checks:

- install check if needed
- lint
- build
- Prisma generate/migrate commands where relevant

If a command fails, inspect the error and fix it before finishing.
