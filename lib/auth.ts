import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type AdminRole = "owner" | "admin" | "staff";
export type AppRole = AdminRole | "customer";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
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
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  const valid =
    expectedBuf.length === signatureBuf.length && timingSafeEqual(expectedBuf, signatureBuf);

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

export const SESSION_COOKIE_NAME = cookieName;

export function sessionCookie(token: string) {
  return {
    name: cookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}

export function clearedSessionCookie() {
  return {
    name: cookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored?: string | null) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const hashBuf = Buffer.from(hash, "hex");
  const attempt = scryptSync(password, salt, 64);
  return hashBuf.length === attempt.length && timingSafeEqual(hashBuf, attempt);
}

export function can(role: AppRole, action: "write" | "refund" | "settings") {
  if (role === "owner") return true;
  if (role === "admin") return action !== "settings";
  if (role === "staff") return action === "write";
  return false;
}

export function isStaffRole(role: AppRole): role is AdminRole {
  return role === "owner" || role === "admin" || role === "staff";
}
