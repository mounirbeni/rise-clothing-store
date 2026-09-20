import Link from "next/link";
import { Download } from "lucide-react";
import { Panel, MetricCard, AdminEmptyState } from "@/components/admin/panel";
import { getDashboardMetrics } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Analytics" };

const ranges = [7, 30, 90];

export default async function Page({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = ranges.includes(Number(daysParam)) ? Number(daysParam) : 30;
  const metrics = await getDashboardMetrics(days);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Reporting</p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-none">Analytics</h1>
        </div>
        <a
          href={`/api/admin/export?days=${days}`}
          className="inline-flex h-11 w-fit items-center gap-2 bg-black px-4 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <div className="mt-6 flex gap-2">
        {ranges.map((range) => (
          <Link
            key={range}
            href={`/admin/analytics?days=${range}`}
            className={`inline-flex h-10 items-center border px-4 text-xs font-black uppercase tracking-[0.12em] ${
              days === range ? "border-black bg-black text-white" : "border-black/15 text-black/60"
            }`}
          >
            {range} days
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={`Revenue (${days}d)`}
          value={formatCurrency(metrics.revenue)}
          delta={`${metrics.revenueDelta >= 0 ? "+" : ""}${metrics.revenueDelta.toFixed(1)}%`}
        />
        <MetricCard
          label={`Orders (${days}d)`}
          value={String(metrics.orders)}
          delta={`${metrics.ordersDelta >= 0 ? "+" : ""}${metrics.ordersDelta.toFixed(1)}%`}
        />
        <MetricCard label="Customers" value={metrics.customerCount.toLocaleString()} />
        <MetricCard label="Conversion" value={`${metrics.conversion.toFixed(1)}%`} />
      </div>

      <div className="mt-6">
        <Panel title="Top products">
          {metrics.topProducts.length === 0 ? (
            <AdminEmptyState title="No sales in this window" text="Try a wider date range." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-black/45">
                  <tr>
                    <th className="py-3">Product</th>
                    <th>Units sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.topProducts.map((product) => (
                    <tr key={product.productId} className="border-b border-black/8">
                      <td className="py-3 font-bold">{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
