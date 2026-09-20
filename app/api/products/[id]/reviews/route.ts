import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const reviewSchema = z.object({
  author: z.string().min(2).max(80),
  title: z.string().min(2).max(120),
  body: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review", issues: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const session = await getSession();

  const review = await prisma.review.create({
    data: {
      productId: id,
      userId: session?.role === "customer" ? session.id : undefined,
      author: parsed.data.author,
      title: parsed.data.title,
      body: parsed.data.body,
      rating: parsed.data.rating,
    },
  });

  return NextResponse.json({ data: { ...review, createdAt: review.createdAt.toISOString() } }, { status: 201 });
}
