import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { can, getSession, hashPassword } from "@/lib/auth";
import { listStaff } from "@/lib/data/customers";

const staffSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "staff"]),
});

export async function GET() {
  const staff = await listStaff();
  return NextResponse.json({ data: staff });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "settings")) {
    return NextResponse.json({ error: "Only owners can add staff accounts" }, { status: 403 });
  }
  const parsed = staffSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid staff account", issues: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const tempPassword = Math.random().toString(36).slice(2, 10);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      role: parsed.data.role,
      passwordHash: hashPassword(tempPassword),
    },
  });

  return NextResponse.json({ data: user, tempPassword }, { status: 201 });
}
