import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Panel, AdminEmptyState, StatusBadge } from "@/components/admin/panel";
import { ArchiveButton } from "@/components/admin/archive-button";
import { listProducts, totalStock } from "@/lib/data/products";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Products" };

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const products = await listProducts({ status: (status as never) || "all", q });

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Catalog</p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-none">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 w-fit items-center gap-2 bg-black px-4 text-sm font-black uppercase tracking-[0.12em] text-white"
        >
          <Plus size={16} /> New product
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products"
          className="h-10 w-64 border border-black/15 bg-white px-3 text-sm outline-none"
        />
        {["all", "active", "draft", "archived"].map((option) => (
          <Link
            key={option}
            href={`/admin/products?status=${option}${q ? `&q=${q}` : ""}`}
            className={`inline-flex h-10 items-center border px-4 text-xs font-black uppercase tracking-[0.12em] ${
              (status || "all") === option ? "border-black bg-black text-white" : "border-black/15 text-black/60"
            }`}
          >
            {option}
          </Link>
        ))}
        <button className="h-10 border border-black/15 px-4 text-xs font-black uppercase tracking-[0.12em]">Search</button>
      </form>

      <div className="mt-6">
        <Panel title={`${products.length} products`}>
          {products.length === 0 ? (
            <AdminEmptyState title="No products found" text="Create a product or adjust your filters." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-black/45">
                  <tr>
                    <th className="py-3">Product</th>
                    <th>Collection</th>
                    <th>Price</th>
                    <th>Inventory</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-black/8">
                      <td className="flex items-center gap-3 py-3 font-bold">
                        <div className="relative size-12 overflow-hidden bg-zinc-200">
                          {product.images[0] ? (
                            <Image src={product.images[0].url} alt={product.name} fill sizes="48px" className="object-cover" />
                          ) : null}
                        </div>
                        <Link href={`/admin/products/${product.id}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </td>
                      <td>{product.collection}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{totalStock(product)} units</td>
                      <td><StatusBadge status={product.status} /></td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex h-9 items-center border border-black/15 px-3 text-xs font-black uppercase text-black/60 hover:text-black"
                          >
                            Edit
                          </Link>
                          {product.status !== "archived" ? <ArchiveButton productId={product.id} /> : null}
                        </div>
                      </td>
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
