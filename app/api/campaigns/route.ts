import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const campaignSchema = z.object({
  name: z.string().min(2).max(120),
  subject: z.string().min(2).max(160),
  body: z.string().min(5).max(4000),
  audience: z.string().max(80).optional(),
});

export async function GET() {
  const campaigns = await prisma.emailCampaign.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: campaigns });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = campaignSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid campaign", issues: parsed.error.flatten() }, { status: 400 });
  }
  const campaign = await prisma.emailCampaign.create({ data: parsed.data });
  return NextResponse.json({ data: campaign }, { status: 201 });
}
