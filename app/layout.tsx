import type { Metadata, Viewport } from "next";
import { getSession } from "@/lib/auth";
import { CartProvider } from "@/components/providers/cart-provider";
import { WishlistProvider } from "@/components/providers/wishlist-provider";
import { PwaRegister } from "@/components/providers/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RISE Worldwide",
    template: "%s / RISE",
  },
  description: "Premium performance clothing for discipline, training, and everyday motion.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RISE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
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
        <PwaRegister />
        <CartProvider>
          <WishlistProvider isAuthenticated={Boolean(session && session.role === "customer")}>
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
