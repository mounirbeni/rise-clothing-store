import Link from "next/link";
import { Activity, BarChart3, PackageCheck } from "lucide-react";
import { Panel, MetricCard, AdminEmptyState, StatusBadge } from "@/components/admin/panel";
import { getDashboardMetrics } from "@/lib/data/dashboard";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Admin dashboard" };

export default async function Page() {
  const metrics = await getDashboardMetrics(30);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">
            Secure admin / roles: owner, admin, staff
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-none sm:text-5xl">Commerce operations</h1>
        </div>
        <Link
          href="/admin/analytics"
          className="inline-flex h-11 items-center gap-2 bg-black px-4 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          <BarChart3 size={16} /> View analytics
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Revenue (30d)"
          value={formatCurrency(metrics.revenue)}
          delta={`${metrics.revenueDelta >= 0 ? "+" : ""}${metrics.revenueDelta.toFixed(1)}%`}
        />
        <MetricCard
          label="Orders (30d)"
          value={String(metrics.orders)}
          delta={`${metrics.ordersDelta >= 0 ? "+" : ""}${metrics.ordersDelta.toFixed(1)}%`}
        />
        <MetricCard label="Customers" value={metrics.customerCount.toLocaleString()} />
        <MetricCard label="Conversion" value={`${metrics.conversion.toFixed(1)}%`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Panel title="Top products" icon={<PackageCheck size={18} />}>
          {metrics.topProducts.length === 0 ? (
            <AdminEmptyState title="No sales yet" text="Top sellers will appear once orders come in." />
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
        <Panel title="Recent activity" icon={<Activity size={18} />}>
          <div className="grid gap-3">
            {metrics.recentOrders.length === 0 ? (
              <AdminEmptyState title="No activity yet" text="Order events will show up here." />
            ) : (
              metrics.recentOrders.map((order) => (
                <div key={order.id} className="border-l-2 border-black bg-black/[0.03] px-4 py-3 text-sm font-medium">
                  <p>
                    {order.orderNumber} / {order.email} / {formatCurrency(order.total)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-black/45">
                    {formatDate(order.createdAt)} / {order.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Recent orders" icon={<PackageCheck size={18} />} actions={<Link href="/admin/orders" className="text-xs font-black uppercase tracking-[0.14em] text-black/45 hover:text-black">View all</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-black/45">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-black/8">
                    <td className="py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-black hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.email}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
