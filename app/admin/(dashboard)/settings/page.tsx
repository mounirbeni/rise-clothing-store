import { redirect } from "next/navigation";
import { Panel } from "@/components/admin/panel";
import { BrandSettingsForm, ShippingZoneManager, TaxRateManager, StaffManager } from "@/components/admin/settings-panels";
import { getSession, can } from "@/lib/auth";
import { getSettings, listShippingZones, listTaxRates } from "@/lib/data/settings";
import { listStaff } from "@/lib/data/customers";

export const metadata = { title: "Settings" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [settings, zones, rates, staff] = await Promise.all([
    getSettings(),
    listShippingZones(),
    listTaxRates(),
    listStaff(),
  ]);
  const canEdit = can(session.role, "settings");

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Store configuration</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none">Settings</h1>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Brand details">
          <BrandSettingsForm settings={settings} canEdit={canEdit} />
        </Panel>
        <Panel title="Payments">
          <div className="grid gap-2 text-sm text-black/70">
            <p>Stripe secret key: {process.env.STRIPE_SECRET_KEY ? "Configured" : "Not set (demo checkout mode)"}</p>
            <p>Webhook secret: {process.env.STRIPE_WEBHOOK_SECRET ? "Configured" : "Not set"}</p>
            <p className="text-black/45">
              Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to your environment to enable live Stripe Checkout.
            </p>
          </div>
        </Panel>
        <Panel title="Shipping zones">
          <ShippingZoneManager zones={zones} canEdit={canEdit} />
        </Panel>
        <Panel title="Tax rates">
          <TaxRateManager rates={rates} canEdit={canEdit} />
        </Panel>
        <Panel title="Staff accounts">
          <StaffManager staff={staff} currentUserId={session.id} />
        </Panel>
      </div>
    </div>
  );
}
