import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const zoneSchema = z.object({
  name: z.string().min(2).max(80),
  countries: z.array(z.string().min(2)).min(1),
  rate: z.number().int().nonnegative(),
  freeOver: z.number().int().positive().nullable().optional(),
});

export async function GET() {
  const zones = await prisma.shippingZone.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ data: zones });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "settings")) {
    return NextResponse.json({ error: "Only owners can edit shipping zones" }, { status: 403 });
  }
  const parsed = zoneSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid shipping zone", issues: parsed.error.flatten() }, { status: 400 });
  }
  const zone = await prisma.shippingZone.create({ data: parsed.data });
  return NextResponse.json({ data: zone }, { status: 201 });
}
