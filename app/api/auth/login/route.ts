import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookie, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());

  const parsed = loginSchema.safeParse(body);
  const isForm = !contentType.includes("application/json");

  if (!parsed.success) {
    if (isForm) return NextResponse.redirect(new URL("/admin/login?error=1", request.url), { status: 303 });
    return NextResponse.json({ error: "Invalid login payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });

  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    if (isForm) return NextResponse.redirect(new URL("/admin/login?error=1", request.url), { status: 303 });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  if (isForm) {
    const destination = user.role === "customer" ? "/account" : "/admin";
    const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
    response.cookies.set(sessionCookie(token));
    return response;
  }

  const response = NextResponse.json({ data: { id: user.id, email: user.email, name: user.name, role: user.role } });
  response.cookies.set(sessionCookie(token));
  return response;
}
