import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Edit product" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, variants: { orderBy: { size: "asc" } } },
  });

  if (!product) notFound();

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Catalog</p>
      <h1 className="mt-2 text-4xl font-black uppercase leading-none">{product.name}</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm
          initial={{
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            collection: product.collection,
            color: product.color,
            price: product.price,
            compareAt: product.compareAt,
            featured: product.featured,
            status: product.status,
            images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
            variants: product.variants.map((variant) => ({ size: variant.size, stock: variant.stock })),
          }}
        />
      </div>
    </div>
  );
}
