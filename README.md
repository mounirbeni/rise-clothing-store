# RISE

RISE is a premium, black-and-white performance clothing storefront and SaaS admin dashboard built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Stripe.

## What's included

**Customer storefront**
- Full-screen campaign homepage ("More Than Yesterday"), catalog with category filters, search, and sorting, product detail pages with image galleries, size/variant selection, live stock, quantity, reviews, and related products.
- Persistent shopping bag (cart drawer), multi-step checkout, order confirmation, and a customer account area with order history, wishlist, saved addresses, and profile settings.
- Customer accounts with email/password sign up and sign in, independent from the admin login.
- Static brand pages: Collection, Story, Journal, FAQ, Shipping & Returns, and a working Contact form.
- Mobile-first responsive layout with a bottom mobile nav, loading/empty/error/success states throughout.

**SaaS admin dashboard** (`/admin`, protected by role-based auth: `owner`, `admin`, `staff`)
- Dashboard with revenue, orders, customers, conversion rate, top products, and recent activity.
- Product management: create/edit/archive, variants & sizes, inventory, multi-image upload (local disk storage), collections, pricing, and discounts.
- Order management: status updates, tracking numbers/carrier, refunds (admin/owner only), and customer/internal notes.
- Customer management: profiles, order history, lifetime value, tags, and notes.
- Marketing: discount codes, promotional banners, email campaign drafts, and abandoned-cart insights.
- Analytics with 7/30/90-day filters and a CSV export.
- Store settings: brand details (owner only), shipping zones, tax rates, payment status, and staff account management.

**Technical**
- Next.js 15 App Router + TypeScript + Tailwind CSS v4.
- PostgreSQL via Prisma ORM (`prisma/schema.prisma`).
- Custom signed-cookie session auth (HMAC + scrypt password hashing) with role-based access control shared by customers and staff.
- Stripe Checkout integration with a webhook that creates orders on payment completion; falls back to an instant "demo mode" order when Stripe keys are not configured, so the whole app works out of the box.
- Local image upload endpoint (`/api/uploads`) storing files under `public/uploads`.
- Zod-validated API routes for auth, products, orders, customers, discounts, banners, campaigns, settings, wishlist, reviews, and checkout.
- Seed script with realistic RISE products, customers, orders, reviews, discount codes, banners, campaigns, shipping zones, and tax rates.

## Local setup

```bash
npm install
cp .env.example .env       # then edit DATABASE_URL / AUTH_SECRET as needed
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Requires a running PostgreSQL instance matching `DATABASE_URL` (e.g. `createdb rise` locally, or use Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`).

## Environment variables

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rise"
AUTH_SECRET="replace-with-a-long-random-string"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- `AUTH_SECRET` signs session cookies — set a long random value in production.
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` are optional. Without them, `/api/checkout` creates the order directly and confirms it instantly ("demo mode"). With them set, checkout creates a real Stripe Checkout Session and the order is created by `/api/webhooks/stripe` on `checkout.session.completed`.

## Demo accounts

Seeded by `npm run db:seed`, all with password `password`:

| Role | Email |
| --- | --- |
| Owner | `owner@rise.test` |
| Admin | `admin@rise.test` |
| Staff | `staff@rise.test` |
| Customer | `maya@example.com` (also `jordan@`, `sam@`, `priya@`, `alex@`, `devon@example.com`) |

Admin login: `/admin/login`. Customer login: `/account/login`.

## Role permissions

- **Staff**: can edit products and orders (create/edit/archive products, update order status/tracking/notes).
- **Admin**: everything staff can do, plus issuing refunds.
- **Owner**: everything admin can do, plus editing store settings (brand details, shipping zones, tax rates, staff accounts).

## Project structure

```
app/                    Next.js App Router routes (storefront + /admin + /api)
components/
  storefront/           Header, footer, cart drawer, product cards, checkout UI
  admin/                Admin shell, forms, and management panels
  providers/            Cart and wishlist React context (client-side)
  ui/                   Small shared primitives (empty states, etc.)
lib/
  data/                 Server-side Prisma query helpers per domain
  auth.ts               Session cookies, password hashing, role checks
  prisma.ts             Prisma client singleton
prisma/
  schema.prisma         Full data model
  seed.ts               Seed script
```

## Notes

- Uploaded product images are written to `public/uploads` (gitignored) — swap `/api/uploads/route.ts` for S3/Vercel Blob/Cloudinary in production.
- CSV export is available from Admin → Analytics → Export CSV.
- Discount codes, shipping zones, and tax rates are applied in `lib/data/checkout.ts` when pricing a cart.
