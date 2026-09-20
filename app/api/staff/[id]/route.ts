import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "settings")) {
    return NextResponse.json({ error: "Only owners can remove staff accounts" }, { status: 403 });
  }
  const { id } = await params;
  if (id === session.id) {
    return NextResponse.json({ error: "You cannot remove your own account" }, { status: 400 });
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ status: "deleted" });
}
