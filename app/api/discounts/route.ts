import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const discountSchema = z.object({
  code: z.string().min(3).max(24),
  description: z.string().min(3).max(200),
  percentOff: z.number().int().min(1).max(90),
  active: z.boolean().optional(),
  endsAt: z.string().datetime().optional().nullable(),
});

export async function GET() {
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: codes });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = discountSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid discount code", issues: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.discountCode.findUnique({ where: { code: parsed.data.code.toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: "That code already exists" }, { status: 409 });
  }

  const discount = await prisma.discountCode.create({
    data: {
      code: parsed.data.code.toUpperCase(),
      description: parsed.data.description,
      percentOff: parsed.data.percentOff,
      active: parsed.data.active ?? true,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    },
  });

  return NextResponse.json({ data: discount }, { status: 201 });
}
