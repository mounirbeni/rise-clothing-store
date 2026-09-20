import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession } from "@/lib/auth";

const bannerSchema = z.object({
  title: z.string().min(2).max(120),
  subtitle: z.string().max(200).optional(),
  imageUrl: z.string().max(300).optional(),
  ctaLabel: z.string().max(40).optional(),
  ctaHref: z.string().max(200).optional(),
  active: z.boolean().optional(),
  position: z.number().int().optional(),
});

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ data: banners });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bannerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid banner", issues: parsed.error.flatten() }, { status: 400 });
  }
  const banner = await prisma.banner.create({ data: parsed.data });
  return NextResponse.json({ data: banner }, { status: 201 });
}
