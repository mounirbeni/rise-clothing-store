import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type AdminRole = "owner" | "admin" | "staff";

export type SessionUser = {
  id: string;
  email: string;
  role: AdminRole;
};

const cookieName = "rise_session";

function secret() {
  return process.env.AUTH_SECRET || "dev-rise-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const valid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(cookieName)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: cookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export function can(role: AdminRole, action: "write" | "refund" | "settings") {
  if (role === "owner") return true;
  if (role === "admin") return action !== "settings";
  return action === "write";
}
