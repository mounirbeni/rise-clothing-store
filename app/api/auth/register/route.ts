import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, hashPassword, sessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const isForm = !contentType.includes("application/json");

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    if (isForm) return NextResponse.redirect(new URL("/account/register?error=1", request.url), { status: 303 });
    return NextResponse.json({ error: "Invalid registration payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (isForm) return NextResponse.redirect(new URL("/account/register?error=exists", request.url), { status: 303 });
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      role: "customer",
      passwordHash: hashPassword(parsed.data.password),
    },
  });

  const token = createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  if (isForm) {
    const response = NextResponse.redirect(new URL("/account", request.url), { status: 303 });
    response.cookies.set(sessionCookie(token));
    return response;
  }

  const response = NextResponse.json({ data: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  response.cookies.set(sessionCookie(token));
  return response;
}
