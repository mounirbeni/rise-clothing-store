# Design QA — Rise app-first storefront

## Source visual truth

- Source: Image Gen Option 1 displayed in this conversation (mobile app-first RISE home).
- Target viewport: 390 x 844 mobile app content.
- Key target state: cinematic hero, focused `Shop drop` action, horizontal featured-products rail, and persistent bottom navigation.

## Implementation evidence

- Local implementation: `http://terminal.local:4173/`.
- Browser-rendered capture state: blocked by `PrismaClientInitializationError` because `DATABASE_URL` is not available in the local preview environment.
- Console evidence: `Environment variable not found: DATABASE_URL` while resolving homepage banners and products.
- Screenshot comparison: unavailable; local app rendered the project error boundary rather than the storefront.
- Primary interactions tested: local route load only; product rail, add-to-bag, sticky product CTA, and checkout cannot be exercised until the preview has its configured database environment.

## Changes implemented

- Reworked the home hero into a shorter, app-first editorial entry with a single strong shopping action.
- Replaced the mobile homepage product grid with a horizontal snap rail and quick-add controls; desktop retains a responsive grid.
- Made mobile search immediately available in the floating header and relabeled the dock search destination as `Shop`.
- Strengthened the product purchase flow with larger variant controls and a persistent mobile add-to-bag surface above the bottom dock.
- Removed the public admin destination from the storefront footer.
- Added a preview-compatible development launcher for the shared preview runner.

## Required fidelity surfaces

- Fonts and typography: implemented a native-system UI stack with stronger display hierarchy; visual comparison pending.
- Spacing and layout rhythm: hero and product rail were updated to match the selected app-first composition; visual comparison pending.
- Colors and visual tokens: retained the existing black, white, chrome, and restrained-glass system; visual comparison pending.
- Image quality and asset fidelity: existing RISE product and campaign assets are reused; visual comparison pending.
- Copy and content: home now emphasizes `Featured drop` and a single shopping action; visual comparison pending.

## Findings

- [P0] Local design QA is blocked.
  Location: local homepage runtime.
  Evidence: the browser renders the error boundary because Prisma cannot resolve `DATABASE_URL`.
  Impact: no valid implementation screenshot exists to compare against the selected design.
  Fix: open a Vercel preview deployment for this branch, where the project environment is available, then compare the mobile storefront route and test the product and checkout flows.

## Final result

blocked
