import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { listProducts } from "@/lib/data/products";

const variantSchema = z.object({ size: z.string().min(1), stock: z.number().int().nonnegative() });

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.enum(["Hoodies", "Training", "Outerwear", "Accessories"]),
  collection: z.string().min(2),
  color: z.string().min(2),
  price: z.number().int().positive(),
  compareAt: z.number().int().positive().nullable().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().optional() })).min(1),
  variants: z.array(variantSchema).min(1),
});

const statusParam = z.enum(["active", "draft", "archived", "all"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await getSession();
  const isAdmin = Boolean(session && can(session.role, "write"));
  const statusRaw = url.searchParams.get("status");
  const status = isAdmin ? statusParam.safeParse(statusRaw).data ?? "all" : "active";

  const data = await listProducts({
    category: url.searchParams.get("category"),
    q: url.searchParams.get("q"),
    sort: url.searchParams.get("sort"),
    status,
  });

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product", issues: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category,
      collection: parsed.data.collection,
      color: parsed.data.color,
      price: parsed.data.price,
      compareAt: parsed.data.compareAt ?? null,
      featured: parsed.data.featured ?? false,
      status: parsed.data.status ?? "active",
      images: { create: parsed.data.images.map((image, position) => ({ url: image.url, alt: image.alt || parsed.data.name, position })) },
      variants: {
        create: parsed.data.variants.map((variant) => ({
          size: variant.size,
          stock: variant.stock,
          sku: `${slug.toUpperCase()}-${variant.size}`,
        })),
      },
    },
  });

  return NextResponse.json({ data: product, status: "created" }, { status: 201 });
}
