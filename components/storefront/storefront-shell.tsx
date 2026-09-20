import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";
import { MobileNav } from "@/components/storefront/mobile-nav";
import { CartDrawer } from "@/components/storefront/cart-drawer";

export async function StorefrontShell({
  children,
  hideFooter,
  hideMobileNav,
  hideMobileHeader,
  hideHeader,
}: {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideMobileNav?: boolean;
  hideMobileHeader?: boolean;
  hideHeader?: boolean;
}) {
  const session = await getSession();
  const authed = Boolean(session && session.role === "customer");

  return (
    <div className={`min-h-screen bg-[#050505] text-[#f7f7f2] ${hideMobileNav ? "" : "pb-20 lg:pb-0"}`}>
      {hideHeader ? null : (
        <div className={hideMobileHeader ? "hidden lg:block" : undefined}>
          <SiteHeader authed={authed} />
        </div>
      )}
      {children}
      {hideFooter ? null : <SiteFooter />}
      {hideMobileNav ? null : <MobileNav authed={authed} />}
      <CartDrawer />
    </div>
  );
}
