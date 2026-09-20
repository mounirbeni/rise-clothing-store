import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const addressSchema = z.object({
  label: z.string().min(2).max(40),
  fullName: z.string().min(2).max(80),
  line1: z.string().min(3).max(140),
  line2: z.string().max(140).optional(),
  city: z.string().min(2).max(80),
  region: z.string().min(2).max(80),
  postal: z.string().min(2).max(20),
  country: z.string().min(2).max(80),
  phone: z.string().max(30).optional(),
  isDefault: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  const raw = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());

  const parsed = addressSchema.safeParse({ ...raw, isDefault: raw.isDefault === true || raw.isDefault === "on" });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid address", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.id }, data: { isDefault: false } });
  }

  await prisma.address.create({ data: { ...parsed.data, userId: session.id } });

  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(new URL("/account/addresses", request.url), { status: 303 });
  }
  return NextResponse.json({ status: "created" }, { status: 201 });
}
