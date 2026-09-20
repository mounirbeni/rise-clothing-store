import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/rise-storefront";
import { getProduct, products } from "@/lib/rise-data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  return {
    title: product ? `${product.name} / RISE` : "Product / RISE",
    description: product?.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
