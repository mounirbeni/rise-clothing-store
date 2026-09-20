# Design QA — Rise app-first storefront

## Source visual truth

- Source: Image Gen Option 1 displayed in this conversation (mobile app-first RISE home).
- Target viewport: 390 x 844 mobile app content.
- Key target state: cinematic hero, focused `Shop drop` action, horizontal featured-products rail, and persistent bottom navigation.

## Implementation evidence

- Verified preview: `https://rise-clothing-store-eieszqv1h-mounirs-projects-975013a5.vercel.app/`.
- Browser-rendered capture state: the Vercel preview loads the home hero and catalog correctly using its configured environment. Desktop capture used the cloud-browser viewport (approximately 1348 x 923).
- Comparison at the captured viewport: the dark cinematic hero, chrome floating header, oversized `MORE THAN YESTERDAY` display type, restrained primary CTA, and elevated product controls are present. The intentional desktop layout expands the app-first composition rather than duplicating the 390px reference verbatim.
- Primary interactions tested: opened `/shop`, verified 24 add-to-bag controls, added the RISE Performance Cap, opened the shopping bag, followed its `Checkout` link, and confirmed the checkout delivery step, bag summary, subtotal, and remove action. No payment was submitted.
- Console evidence: no application runtime error was observed in the Vercel preview. Browser-extension metadata messages were excluded as unrelated to the app.

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

- [P2] Exact mobile visual comparison remains pending.
  Location: 390 x 844 target viewport.
  Evidence: the available cloud browser supplied a desktop viewport only; it could not emulate the selected 390px target for a like-for-like capture.
  Impact: the implementation is verified functionally in the live preview and its responsive mobile styles are present in code, but final pixel-level comparison against the selected mobile reference needs a physical phone or a browser with viewport emulation.
  Fix: open the verified preview on a 390px-wide device, capture the home, product, and checkout states, and resolve any visible P0/P1/P2 findings before marking this QA report as passed.

## Final result

blocked
