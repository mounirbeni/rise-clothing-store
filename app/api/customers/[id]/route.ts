import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const updateSchema = z.object({
  tags: z.array(z.string().min(1).max(30)).optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid customer update", issues: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await prisma.user.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ data: customer, status: "updated" });
}
