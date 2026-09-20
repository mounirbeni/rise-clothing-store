import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const updateSchema = z.object({ status: z.enum(["draft", "scheduled", "sent"]).optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid update" }, { status: 400 });

  const campaign = await prisma.emailCampaign.update({
    where: { id },
    data: { ...parsed.data, sentAt: parsed.data.status === "sent" ? new Date() : undefined },
  });
  return NextResponse.json({ data: campaign });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.emailCampaign.delete({ where: { id } });
  return NextResponse.json({ status: "deleted" });
}
