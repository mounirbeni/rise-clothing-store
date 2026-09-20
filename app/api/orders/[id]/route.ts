import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/data/orders";

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "paid", "in_fulfillment", "fulfilled", "refunded", "cancelled"]).optional(),
  trackingNumber: z.string().min(3).max(64).optional(),
  carrier: z.string().max(40).optional(),
  internalNote: z.string().max(1000).optional(),
  refund: z.boolean().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: order });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = orderUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order update", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.refund && !can(session.role, "refund")) {
    return NextResponse.json({ error: "Refunds require admin or owner role" }, { status: 403 });
  }

  const { id } = await params;
  const { refund, ...rest } = parsed.data;

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...rest,
      status: refund ? "refunded" : rest.status,
    },
    include: { items: true },
  });

  return NextResponse.json({ data: order, status: "updated" });
}
