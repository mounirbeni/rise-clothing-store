import { notFound } from "next/navigation";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { ProductDetail } from "@/components/storefront/product-detail";
import { getProductBySlug, relatedProducts, toCardData } from "@/lib/data/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? product.name : "Product",
    description: product?.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await relatedProducts(product);

  return (
    <StorefrontShell hideMobileHeader hideMobileNav>
      <ProductDetail
        product={toCardData(product)}
        description={product.description}
        features={[
          `${product.color} colorway`,
          `${product.collection} collection`,
          "Designed for training and everyday motion",
          "Machine washable / imported",
        ]}
        reviews={product.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          body: review.body,
          author: review.author,
          createdAt: review.createdAt.toISOString(),
        }))}
        related={related.map(toCardData)}
      />
    </StorefrontShell>
  );
}
