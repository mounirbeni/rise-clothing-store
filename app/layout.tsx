import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RISE Worldwide",
  description: "Premium performance clothing for discipline, training, and everyday motion.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
