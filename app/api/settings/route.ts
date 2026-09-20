import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";

const settingsSchema = z.object({
  brandName: z.string().min(2).max(80).optional(),
  supportEmail: z.string().email().optional(),
  currency: z.string().min(3).max(6).optional(),
  stripeLiveMode: z.boolean().optional(),
  taxInclusive: z.boolean().optional(),
});

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ data: settings });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "settings")) {
    return NextResponse.json({ error: "Only owners and admins can change store settings" }, { status: 403 });
  }
  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings", issues: parsed.error.flatten() }, { status: 400 });
  }
  await getSettings();
  const settings = await prisma.storeSettings.update({ where: { id: "singleton" }, data: parsed.data });
  return NextResponse.json({ data: settings });
}
