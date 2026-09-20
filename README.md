# RISE

RISE is a premium black-and-white performance clothing commerce platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Stripe.

## What Is Included

- Mobile-first storefront with campaign homepage, catalog filtering/sorting, product cards, detail pages, cart drawer, checkout, confirmation, account, wishlist, order history, addresses, and support pages.
- SaaS admin dashboard with role language for owner/admin/staff, revenue/order/customer metrics, product management, order management, customer profiles, marketing tools, analytics, exports, and settings.
- API routes with Zod validation for auth, products, order updates, checkout, Stripe webhooks, and upload URL generation.
- Prisma schema covering users, roles, products, variants, inventory, images, orders, reviews, discounts, staff invites, and addresses.
- Seed data for realistic RISE products, customers, orders, reviews, discounts, and staff/admin concepts.

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rise"
AUTH_SECRET="replace-with-a-long-random-string"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Stripe keys are optional for demo mode. Without `STRIPE_SECRET_KEY`, `/api/checkout` returns a demo checkout URL that points to the order confirmation page.

## Demo Admin Login

Visit `/admin/login`.

- Owner: `owner@rise.test`
- Admin: `admin@rise.test`
- Staff: `staff@rise.test`
- Password for all demo roles: `password`

## Notes

The UI uses local editorial imagery in `public/images`. The upload route returns a local-demo URL shape; connect it to S3, Vercel Blob, or another object store for production.
