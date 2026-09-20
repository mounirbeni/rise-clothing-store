import { NextResponse } from "next/server";
import { z } from "zod";
import { can, getSession } from "@/lib/auth";

const orderUpdateSchema = z.object({
  status: z.enum(["Pending", "In fulfillment", "Fulfilled", "Refunded", "Cancelled"]).optional(),
  tracking: z.string().min(3).optional(),
  note: z.string().max(500).optional(),
  refundAmount: z.number().positive().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = orderUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order update", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.refundAmount && !can(session.role, "refund")) {
    return NextResponse.json({ error: "Refunds require admin or owner role" }, { status: 403 });
  }

  const { id } = await params;
  return NextResponse.json({ data: { id, ...parsed.data }, status: "updated" });
}
