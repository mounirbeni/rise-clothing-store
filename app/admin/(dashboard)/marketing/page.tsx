import Link from "next/link";
import { BadgeDollarSign, Megaphone, Mail, ShoppingBag } from "lucide-react";
import { Panel, AdminEmptyState } from "@/components/admin/panel";
import { DiscountManager, BannerManager, CampaignManager } from "@/components/admin/marketing-panels";
import { listBanners, listCampaigns, listDiscountCodes } from "@/lib/data/marketing";
import { abandonedCartInsights } from "@/lib/data/orders";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Marketing" };

export default async function Page() {
  const [discounts, banners, campaigns, insights] = await Promise.all([
    listDiscountCodes(),
    listBanners(),
    listCampaigns(),
    abandonedCartInsights(),
  ]);

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Growth</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none">Marketing</h1>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Discount codes" icon={<BadgeDollarSign size={18} />}>
          <DiscountManager discounts={discounts} />
        </Panel>
        <Panel title="Promotional banners" icon={<Megaphone size={18} />}>
          <BannerManager banners={banners} />
        </Panel>
        <Panel title="Email campaigns" icon={<Mail size={18} />}>
          <CampaignManager campaigns={campaigns} />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Abandoned cart insights" icon={<ShoppingBag size={18} />}>
          <p className="mb-4 text-sm text-black/60">
            {insights.pendingCount} pending checkout{insights.pendingCount === 1 ? "" : "s"} in progress right now.
          </p>
          {insights.abandoned.length === 0 ? (
            <AdminEmptyState title="No abandoned carts" text="Pending orders older than 24 hours will show here." />
          ) : (
            <div className="grid gap-2">
              {insights.abandoned.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between border border-black/10 bg-white p-3 text-sm hover:border-black/30"
                >
                  <span>
                    {order.email} / {order.items.length} items / {formatDate(order.createdAt)}
                  </span>
                  <span className="font-black">{formatCurrency(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
