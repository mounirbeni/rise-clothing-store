import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const bodySchema = z.object({ productId: z.string().min(1) });

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ data: [] });
  }
  const items = await prisma.wishlistItem.findMany({ where: { userId: session.id } });
  return NextResponse.json({ data: items });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Sign in to save items" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.id, productId: parsed.data.productId } },
    update: {},
    create: { userId: session.id, productId: parsed.data.productId },
  });

  return NextResponse.json({ status: "saved" }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.wishlistItem
    .delete({ where: { userId_productId: { userId: session.id, productId: parsed.data.productId } } })
    .catch(() => undefined);

  return NextResponse.json({ status: "removed" });
}
