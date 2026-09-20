import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { CartProvider } from "@/components/providers/cart-provider";
import { WishlistProvider } from "@/components/providers/wishlist-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RISE Worldwide",
    template: "%s / RISE",
  },
  description: "Premium performance clothing for discipline, training, and everyday motion.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider isAuthenticated={Boolean(session && session.role === "customer")}>
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
