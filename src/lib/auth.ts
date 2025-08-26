// src/lib/auth.ts
import { db } from "$lib/db";
import { sessions, users } from "$lib/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, pbkdf2Sync } from "crypto";
import type { RequestEvent } from "@sveltejs/kit";

// Password hashing helpers (PBKDF2)
const HASH_ITERATIONS = 100_000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = "sha512";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashed = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString("hex");
  return `${salt}:${hashed}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hashed] = stored.split(":");
  const verify = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString("hex");
  return verify === hashed;
}

// Session helpers
const SESSION_COOKIE = "sid";
const SESSION_TTL_DAYS = 7;

function getExpiryDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function createUserAccount(firstName: string | null, lastName: string | null, email: string, password: string) {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) throw new Error("Email already in use");

  const passwordHash = hashPassword(password);
  const inserted = await db.insert(users).values({ firstName: firstName ?? undefined, lastName: lastName ?? undefined, email, passwordHash }).returning();
  return inserted[0];
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expires = getExpiryDate(SESSION_TTL_DAYS);
  await db.insert(sessions).values({ userId, sessionToken: token, expires });
  return { token, expires };
}

export async function getSession(event: RequestEvent) {
  const token = event.cookies.get(SESSION_COOKIE);
  if (!token) return null;
  const rows = await db.select().from(sessions).where(eq(sessions.sessionToken, token));
  if (rows.length === 0) return null;
  const session = rows[0];
  if (new Date(session.expires) < new Date()) {
    await db.delete(sessions).where(eq(sessions.sessionToken, token));
    event.cookies.delete(SESSION_COOKIE, { path: "/" });
    return null;
  }
  const userRows = await db.select().from(users).where(eq(users.id, session.userId));
  if (userRows.length === 0) return null;
  return { session, user: userRows[0] };
}

export async function destroySession(event: RequestEvent) {
  const token = event.cookies.get(SESSION_COOKIE);
  if (token) {
    await db.delete(sessions).where(eq(sessions.sessionToken, token));
    event.cookies.delete(SESSION_COOKIE, { path: "/" });
  }
}

export async function signInWithEmail(event: RequestEvent, email: string, password: string) {
  const res = await db.select().from(users).where(eq(users.email, email));
  if (res.length === 0) throw new Error("Invalid email or password");
  const user = res[0];
  if (!verifyPassword(password, user.passwordHash)) throw new Error("Invalid email or password");
  const { token, expires } = await createSession(user.id);
  event.cookies.set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    expires
  });
  return user;
}

export async function registerAndSignIn(event: RequestEvent, firstName: string | null, lastName: string | null, email: string, password: string) {
  const user = await createUserAccount(firstName, lastName, email, password);
  const { token, expires } = await createSession(user.id);
  event.cookies.set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    expires
  });
  return user;
}
