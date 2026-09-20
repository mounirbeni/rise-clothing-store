import { NextResponse } from "next/server";
import { clearedSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";
  const response = NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
  response.cookies.set(clearedSessionCookie());
  return response;
}
