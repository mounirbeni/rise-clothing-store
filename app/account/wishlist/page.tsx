import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { ProductGrid } from "@/components/storefront/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "@/lib/data/customers";
import { prisma } from "@/lib/prisma";
import { avgRating } from "@/lib/data/products";

export const metadata = { title: "Wishlist" };

export default async function Page() {
  const session = await getSession();
  if (!session || session.role !== "customer") redirect("/account/login");
  const customer = await getCustomerById(session.id);
  if (!customer) redirect("/account/login");

  const productsFull = await prisma.product.findMany({
    where: { id: { in: customer.wishlist.map((item) => item.productId) } },
    include: { images: { orderBy: { position: "asc" } }, variants: true, reviews: true },
  });

  const cards = productsFull.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    collection: product.collection,
    color: product.color,
    price: product.price,
    compareAt: product.compareAt,
    images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
    variants: product.variants.map((variant) => ({ size: variant.size, stock: variant.stock })),
    avgRating: avgRating(product),
    reviewCount: product.reviews.length,
  }));

  return (
    <StorefrontShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Account</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-none sm:text-6xl">Wishlist</h1>
        <div className="mt-10">
          {cards.length === 0 ? (
            <EmptyState
              icon={<Heart size={34} className="text-white/35" />}
              title="Your wishlist is empty"
              text="Tap the heart icon on any product to save it here."
            />
          ) : (
            <ProductGrid products={cards} />
          )}
        </div>
      </section>
    </StorefrontShell>
  );
}
