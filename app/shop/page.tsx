import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { ProductGrid } from "@/components/storefront/product-card";
import { ShopControls } from "@/components/storefront/shop-controls";
import { EmptyState } from "@/components/ui/empty-state";
import { CATEGORIES, listProducts, toCardData } from "@/lib/data/products";

export const metadata = {
  title: "Shop",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "All";
  const query = params.q ?? "";
  const sort = params.sort ?? "featured";

  const products = await listProducts({ category, q: query, sort });
  const cards = products.map(toCardData);

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        <ShopControls
          categories={[...CATEGORIES]}
          activeCategory={category}
          activeSort={sort}
          activeQuery={query}
          resultCount={cards.length}
        />
        {cards.length ? (
          <ProductGrid products={cards} />
        ) : (
          <EmptyState title="No product found" text="Try another category or search term." />
        )}
      </section>
    </StorefrontShell>
  );
}
