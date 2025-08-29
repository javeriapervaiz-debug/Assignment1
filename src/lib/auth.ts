// src/lib/auth.ts
import { db } from "$lib/db";
import { sessions, users, verificationTokens } from "$lib/db/schema";
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

// NEW: Simple verification code system
export async function createVerificationCode(userId: number) {
  // Generate a simple 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = getExpiryDate(1); // 1 day expiry
  
  await db.insert(verificationTokens).values({ 
    userId, 
    token: code, 
    expires, 
    type: 'email' 
  });
  
  return code;
}

export async function verifyEmailCode(code: string) {
  const rows = await db.select().from(verificationTokens).where(eq(verificationTokens.token, code));
  if (rows.length === 0) throw new Error("Invalid verification code");
  
  const verification = rows[0];
  if (verification.type !== 'email') throw new Error("Invalid code type");
  if (new Date(verification.expires) < new Date()) throw new Error("Verification code expired");
  
  // Mark email as verified
  await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, verification.userId));
  
  // Delete the used code
  await db.delete(verificationTokens).where(eq(verificationTokens.token, code));
  
  return verification.userId;
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
  
  // Only require email verification for new accounts that haven't been verified yet
  if (!user.emailVerifiedAt) throw new Error("Please verify your email before signing in. Use the verification code from your registration.");
  
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

export async function updateUserProfile(
  userId: number,
  updates: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
    profileImageUrl?: string | null;
  }
) {
  const values: any = {};
  if (typeof updates.firstName !== "undefined") values.firstName = updates.firstName ?? null;
  if (typeof updates.lastName !== "undefined") values.lastName = updates.lastName ?? null;
  if (typeof updates.email !== "undefined") {
    if (updates.email) {
      const exists = await db
        .select()
        .from(users)
        .where(eq(users.email, updates.email), eq(users.id, userId));
      if (exists.length > 0) throw new Error("Email already in use");
    }
    values.email = updates.email ?? null;
  }
  if (typeof updates.password !== "undefined" && updates.password) {
    values.passwordHash = hashPassword(updates.password);
  }
  if (typeof updates.profileImageUrl !== "undefined") {
    values.profileImageUrl = updates.profileImageUrl ?? null;
  }
  if (Object.keys(values).length === 0) return;
  await db.update(users).set(values).where(eq(users.id, userId));
}

export async function deleteUserAccount(event: RequestEvent, userId: number) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
  event.cookies.delete(SESSION_COOKIE, { path: "/" });
}

// OAuth helpers
export async function findOrCreateOAuthUser(email: string, firstName: string | null, lastName: string | null, profileImageUrl: string | null = null) {
  // First, try to find existing user by email
  const existing = await db.select().from(users).where(eq(users.email, email));
  
  if (existing.length > 0) {
    // User exists, return them
    return existing[0];
  }
  
  // User doesn't exist, create a new one
  // For OAuth users, we'll mark email as verified since OAuth providers verify emails
  const inserted = await db.insert(users).values({
    firstName: firstName ?? undefined,
    lastName: lastName ?? undefined,
    email,
    passwordHash: '', // OAuth users don't have passwords
    emailVerifiedAt: new Date(), // Auto-verify OAuth emails
    profileImageUrl: profileImageUrl ?? undefined
  }).returning();
  
  return inserted[0];
}

export async function signInOAuthUser(event: RequestEvent, user: any) {
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
