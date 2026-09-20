"use client";

import Image from "next/image";
import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  Boxes,
  Download,
  ImagePlus,
  Megaphone,
  PackageCheck,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { activity, adminMetrics, customers, orders, products } from "@/lib/rise-data";
import { formatCurrency } from "@/lib/format";

export function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black">
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="border-b border-black/10 bg-black p-5 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center border border-white/20 font-black">R</div>
            <div>
              <p className="font-black tracking-[0.22em]">RISE</p>
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">Owner console</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-white/62">
            {[
              ["Dashboard", BarChart3],
              ["Products", Boxes],
              ["Orders", PackageCheck],
              ["Customers", Users],
              ["Marketing", Megaphone],
              ["Settings", ShieldCheck],
            ].map(([label, Icon]) => (
              <a key={label as string} href={`#${String(label).toLowerCase()}`} className="flex h-11 items-center gap-3 px-3 hover:bg-white/10 hover:text-white">
                <Icon size={17} /> {label as string}
              </a>
            ))}
          </nav>
        </aside>
        <section className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">
                Secure admin / roles: owner, admin, staff
              </p>
              <h1 className="mt-2 text-4xl font-black uppercase leading-none sm:text-5xl">
                Commerce operations
              </h1>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex h-11 items-center gap-2 border border-black px-4 text-sm font-black uppercase tracking-[0.12em]">
                <Download size={16} /> Export
              </button>
              <button className="inline-flex h-11 items-center gap-2 bg-black px-4 text-sm font-black uppercase tracking-[0.12em] text-white">
                <ImagePlus size={16} /> Upload
              </button>
            </div>
          </div>

          <div id="dashboard" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {adminMetrics.map((metric) => (
              <div key={metric.label} className="border border-black/10 bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-black/45">{metric.label}</p>
                <div className="mt-5 flex items-end justify-between">
                  <p className="text-3xl font-black">{metric.value}</p>
                  <span className="bg-black px-2 py-1 text-xs font-black text-white">{metric.delta}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <Panel id="products" title="Product Management" icon={<Boxes size={18} />}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-black/45">
                    <tr>
                      <th className="py-3">Product</th>
                      <th>Collection</th>
                      <th>Price</th>
                      <th>Inventory</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-black/8">
                        <td className="flex items-center gap-3 py-3 font-bold">
                          <div className="relative size-12 overflow-hidden bg-zinc-200">
                            <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" />
                          </div>
                          {product.name}
                        </td>
                        <td>{product.collection}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock} units</td>
                        <td>
                          <span className="border border-black/15 px-2 py-1 text-xs font-black uppercase">
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel title="Recent Activity" icon={<Activity size={18} />}>
              <div className="grid gap-3">
                {activity.map((item) => (
                  <div key={item} className="border-l-2 border-black bg-black/[0.03] px-4 py-3 text-sm font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Panel id="orders" title="Order Management" icon={<Truck size={18} />}>
              <div className="grid gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="grid gap-3 border border-black/10 bg-white p-4 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black">{order.id}</p>
                        <span className="border border-black/15 px-2 py-1 text-xs font-black uppercase">{order.status}</span>
                        <span className="border border-black/15 px-2 py-1 text-xs font-black uppercase">{order.payment}</span>
                      </div>
                      <p className="mt-2 text-sm text-black/60">{order.customer} / {order.items}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-black/45">Tracking: {order.tracking}</p>
                    </div>
                    <p className="font-black">{formatCurrency(order.total)}</p>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel id="customers" title="Customer Management" icon={<Users size={18} />}>
              <div className="grid gap-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="border border-black/10 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black">{customer.name}</p>
                        <p className="text-sm text-black/55">{customer.email}</p>
                      </div>
                      <p className="font-black">{formatCurrency(customer.lifetimeValue)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {customer.tags.map((tag) => (
                        <span key={tag} className="bg-black px-2 py-1 text-xs font-black uppercase text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Panel id="marketing" title="Marketing Tools" icon={<Megaphone size={18} />}>
              <AdminList
                items={[
                  "Discount RISE15 active through Sep 30",
                  "Promotional banner: More Than Yesterday",
                  "Email campaign draft: Winter base layers",
                  "Abandoned-cart segment: 214 shoppers",
                ]}
              />
            </Panel>
            <Panel title="Analytics" icon={<BadgeDollarSign size={18} />}>
              <AdminList items={["Date filters: 7 / 30 / 90 days", "Top product: Discipline Hoodie", "Exportable CSV report ready", "Conversion lift from mobile nav: 1.2%"]} />
            </Panel>
            <Panel id="settings" title="Store Settings" icon={<ShieldCheck size={18} />}>
              <AdminList items={["Brand details locked by owner", "Shipping zones: US, Canada, EU", "Taxes: automated nexus rules", "Payments: Stripe live mode pending"]} />
            </Panel>
          </div>
        </section>
      </div>
    </main>
  );
}

function Panel({
  title,
  icon,
  children,
  id,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="border border-black/10 bg-[#fbfbf8] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em]">
          {icon} {title}
        </h2>
        <button className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Manage</button>
      </div>
      {children}
    </section>
  );
}

function AdminList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item} className="border border-black/10 bg-white p-3 text-sm font-medium">
          {item}
        </div>
      ))}
    </div>
  );
}
