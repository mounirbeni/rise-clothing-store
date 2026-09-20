import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const variantSchema = z.object({ id: z.string().optional(), size: z.string().min(1), stock: z.number().int().nonnegative() });

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  category: z.enum(["Hoodies", "Training", "Outerwear", "Accessories"]).optional(),
  collection: z.string().min(2).optional(),
  color: z.string().min(2).optional(),
  price: z.number().int().positive().optional(),
  compareAt: z.number().int().positive().nullable().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().optional() })).optional(),
  variants: z.array(variantSchema).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true, reviews: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: product });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product update", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { images, variants, ...rest } = parsed.data;

  const product = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: images.map((image, position) => ({ productId: id, url: image.url, alt: image.alt || "", position })),
      });
    }
    if (variants) {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.productVariant.createMany({
        data: variants.map((variant) => ({
          productId: id,
          size: variant.size,
          stock: variant.stock,
          sku: `${id.slice(0, 6).toUpperCase()}-${variant.size}-${Math.random().toString(36).slice(2, 6)}`,
        })),
      });
    }
    return tx.product.update({ where: { id }, data: rest });
  });

  return NextResponse.json({ data: product, status: "updated" });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { status: "archived" } });
  return NextResponse.json({ status: "archived" });
}
