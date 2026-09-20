import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { CheckoutClient } from "@/components/storefront/checkout-client";

export const metadata = { title: "Checkout" };

export default function Page() {
  return (
    <StorefrontShell>
      <CheckoutClient />
    </StorefrontShell>
  );
}
