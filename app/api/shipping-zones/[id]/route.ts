import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "settings")) {
    return NextResponse.json({ error: "Only owners can edit shipping zones" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.shippingZone.delete({ where: { id } });
  return NextResponse.json({ status: "deleted" });
}
