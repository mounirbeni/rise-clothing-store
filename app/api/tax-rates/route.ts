import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const taxSchema = z.object({
  region: z.string().min(2).max(80),
  rate: z.number().min(0).max(30),
});

export async function GET() {
  const rates = await prisma.taxRate.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ data: rates });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "settings")) {
    return NextResponse.json({ error: "Only owners can edit tax rates" }, { status: 403 });
  }
  const parsed = taxSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tax rate", issues: parsed.error.flatten() }, { status: 400 });
  }
  const rate = await prisma.taxRate.create({ data: parsed.data });
  return NextResponse.json({ data: rate }, { status: 201 });
}
