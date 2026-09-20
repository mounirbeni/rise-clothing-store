import { prisma } from "@/lib/prisma";
import { Prisma, ProductStatus } from "@prisma/client";
import type { ProductCardData } from "@/lib/types";

export const CATEGORIES = ["Hoodies", "Training", "Outerwear", "Accessories"] as const;

export type ProductListFilters = {
  category?: string | null;
  q?: string | null;
  sort?: string | null;
  status?: ProductStatus | "all";
};

const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: { orderBy: { size: "asc" as const } },
  reviews: { orderBy: { createdAt: "desc" as const } },
};

export type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function orderBy(sort?: string | null): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function listProducts(filters: ProductListFilters = {}) {
  const where: Prisma.ProductWhereInput = {};
  if (filters.status !== "all") {
    where.status = filters.status ?? "active";
  }

  if (filters.category && filters.category !== "All") {
    where.category = filters.category;
  }

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { color: { contains: filters.q, mode: "insensitive" } },
      { category: { contains: filters.q, mode: "insensitive" } },
      { collection: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: orderBy(filters.sort),
  });

  if (filters.sort === "rating") {
    return [...products].sort((a, b) => avgRating(b) - avgRating(a));
  }
  if (filters.sort === "stock") {
    return [...products].sort((a, b) => totalStock(b) - totalStock(a));
  }

  return products;
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export async function relatedProducts(product: ProductWithRelations, take = 4) {
  const sameCategory = await prisma.product.findMany({
    where: { id: { not: product.id }, category: product.category, status: "active" },
    include: productInclude,
    take,
  });

  if (sameCategory.length >= take) return sameCategory;

  const filler = await prisma.product.findMany({
    where: {
      id: { notIn: [product.id, ...sameCategory.map((p) => p.id)] },
      status: "active",
    },
    include: productInclude,
    take: take - sameCategory.length,
  });

  return [...sameCategory, ...filler];
}

export async function categoryShowcase() {
  const showcase: { category: string; image: string; alt: string }[] = [];
  for (const category of CATEGORIES) {
    const product = await prisma.product.findFirst({
      where: { category, status: "active" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    });
    if (product && product.images[0]) {
      showcase.push({ category, image: product.images[0].url, alt: product.images[0].alt ?? product.name });
    }
  }
  return showcase;
}

export async function featuredProducts(take = 4) {
  const featured = await prisma.product.findMany({
    where: { status: "active", featured: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take,
  });

  if (featured.length >= take) return featured;

  const filler = await prisma.product.findMany({
    where: { status: "active", id: { notIn: featured.map((p) => p.id) } },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: take - featured.length,
  });

  return [...featured, ...filler];
}

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "OS"];

function sizeRank(size: string) {
  const index = SIZE_ORDER.indexOf(size.toUpperCase());
  return index === -1 ? SIZE_ORDER.length : index;
}

export function sortSizes<T extends { size: string }>(variants: T[]) {
  return [...variants].sort((a, b) => sizeRank(a.size) - sizeRank(b.size));
}

export function totalStock(product: ProductWithRelations) {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
}

export function avgRating(product: ProductWithRelations) {
  if (!product.reviews.length) return 0;
  return product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
}

export function toCardData(product: ProductWithRelations): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    collection: product.collection,
    color: product.color,
    price: product.price,
    compareAt: product.compareAt ?? null,
    images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
    variants: sortSizes(product.variants.map((variant) => ({ size: variant.size, stock: variant.stock }))),
    avgRating: avgRating(product),
    reviewCount: product.reviews.length,
  };
}
