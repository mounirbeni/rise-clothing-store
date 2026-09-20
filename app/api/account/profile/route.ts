import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, getSession, sessionCookie } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  notes: z.string().max(500).optional(),
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

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile", issues: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.id },
    data: { name: parsed.data.name, notes: parsed.data.notes },
  });

  const token = createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  if (!contentType.includes("application/json")) {
    const response = NextResponse.redirect(new URL("/account/profile?saved=1", request.url), { status: 303 });
    response.cookies.set(sessionCookie(token));
    return response;
  }
  const response = NextResponse.json({ status: "updated" });
  response.cookies.set(sessionCookie(token));
  return response;
}
