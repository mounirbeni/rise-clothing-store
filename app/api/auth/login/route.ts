import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, sessionCookie } from "@/lib/auth";

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
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const allowed = [
    { id: "usr_owner", email: "owner@rise.test", role: "owner" as const },
    { id: "usr_admin", email: "admin@rise.test", role: "admin" as const },
    { id: "usr_staff", email: "staff@rise.test", role: "staff" as const },
  ];
  const user = allowed.find((item) => item.email === parsed.data.email);

  if (!user || parsed.data.password !== "password") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(sessionCookie(createSessionToken(user)));
  return response;
}
