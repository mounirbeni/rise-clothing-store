import Link from "next/link";
import { Panel, AdminEmptyState } from "@/components/admin/panel";
import { listCustomers, lifetimeValue } from "@/lib/data/customers";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Customers" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const customers = await listCustomers(q);

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">CRM</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none">Customers</h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email"
          className="h-10 w-72 border border-black/15 bg-white px-3 text-sm outline-none"
        />
        <button className="h-10 border border-black/15 px-4 text-xs font-black uppercase tracking-[0.12em]">Search</button>
      </form>

      <div className="mt-6">
        <Panel title={`${customers.length} customers`}>
          {customers.length === 0 ? (
            <AdminEmptyState title="No customers found" text="Customers appear here after they create an account." />
          ) : (
            <div className="grid gap-3">
              {customers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/admin/customers/${customer.id}`}
                  className="border border-black/10 bg-white p-4 transition hover:border-black/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black">{customer.name}</p>
                      <p className="text-sm text-black/55">{customer.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/40">
                        {customer.orders.length} orders / {customer.addresses.length} addresses
                      </p>
                    </div>
                    <p className="font-black">{formatCurrency(lifetimeValue(customer.orders))}</p>
                  </div>
                  {customer.tags.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {customer.tags.map((tag) => (
                        <span key={tag} className="bg-black px-2 py-1 text-xs font-black uppercase text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
