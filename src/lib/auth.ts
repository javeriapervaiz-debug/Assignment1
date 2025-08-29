// src/lib/auth.ts
import { db } from "$lib/db";
import { sessions, users, verificationTokens } from "$lib/db/schema";
import { eq, and, gt, ne } from "drizzle-orm";
import { randomBytes, pbkdf2Sync } from "crypto";
import type { RequestEvent } from "@sveltejs/kit";
import * as nodemailer from 'nodemailer';

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
  const inserted = await db.insert(users).values({ 
    firstName: firstName ?? undefined, 
    lastName: lastName ?? undefined, 
    email, 
    passwordHash,
    role: 'user', // Default role
    status: 'pending' // Pending until email verification
  }).returning();
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
  
  // Mark email as verified and activate user
  await db.update(users).set({ 
    emailVerifiedAt: new Date(),
    status: 'active' // Activate user after email verification
  }).where(eq(users.id, verification.userId));
  
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
  
  const user = userRows[0];
  
  // Check if user is disabled
  if (user.status === 'disabled') {
    await db.delete(sessions).where(eq(sessions.sessionToken, token));
    event.cookies.delete(SESSION_COOKIE, { path: "/" });
    return null;
  }

  // Update last login time
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

  return { session, user };
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
        .where(and(eq(users.email, updates.email), ne(users.id, userId)));
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
    profileImageUrl: profileImageUrl ?? undefined,
    role: 'user', // Default role for OAuth users
    status: 'active' // OAuth users are active immediately
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

// Admin-specific functions
export async function getAllUsers() {
  return await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
    role: users.role,
    status: users.status,
    emailVerifiedAt: users.emailVerifiedAt,
    lastLoginAt: users.lastLoginAt,
    createdAt: users.createdAt,
    profileImageUrl: users.profileImageUrl
  }).from(users).orderBy(users.createdAt);
}

export async function getUserStats() {
  const totalUsers = await db.select().from(users);
  const activeUsers = totalUsers.filter(u => u.status === 'active');
  const pendingUsers = totalUsers.filter(u => u.status === 'pending');
  const disabledUsers = totalUsers.filter(u => u.status === 'disabled');
  const adminUsers = totalUsers.filter(u => u.role === 'admin');
  const verifiedUsers = totalUsers.filter(u => u.emailVerifiedAt !== null);
  
  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = totalUsers.filter(u => u.createdAt && new Date(u.createdAt) > thirtyDaysAgo);
  
  // Recent logins (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLogins = totalUsers.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > sevenDaysAgo);

  return {
    total: totalUsers.length,
    active: activeUsers.length,
    pending: pendingUsers.length,
    disabled: disabledUsers.length,
    admins: adminUsers.length,
    verified: verifiedUsers.length,
    recentRegistrations: recentUsers.length,
    recentLogins: recentLogins.length
  };
}

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
  await db.update(users).set({ 
    role,
    updatedAt: new Date()
  }).where(eq(users.id, userId));
}

export async function updateUserStatus(userId: number, status: 'active' | 'disabled' | 'pending') {
  await db.update(users).set({ 
    status,
    updatedAt: new Date()
  }).where(eq(users.id, userId));
  
  // If disabling user, also delete their sessions
  if (status === 'disabled') {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }
}

export function isAdmin(user: any): boolean {
  return user && user.role === 'admin';
}

export function requireAdmin(user: any) {
  if (!isAdmin(user)) {
    throw new Error('Admin access required');
  }
}

// Password reset functions
export async function createPasswordResetToken(email: string) {
  try {
    // Check if user exists
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return { success: false, error: 'User not found' };
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 10 minutes from now
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);

    // Delete any existing password reset tokens for this user
    await db.delete(verificationTokens)
      .where(and(
        eq(verificationTokens.userId, user[0].id),
        eq(verificationTokens.type, 'password_reset')
      ));

    // Create new password reset token
    await db.insert(verificationTokens).values({
      userId: user[0].id,
      token: code,
      expires,
      type: 'password_reset'
    });

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, code, user[0].firstName || undefined);
    
    if (!emailResult.success) {
      return { success: false, error: 'Failed to send reset email' };
    }

    console.log(`Password reset code for ${email}: ${code}`);
    
    return { 
      success: true, 
      message: 'Password reset code sent to your email',
      code // For development/testing - remove in production
    };
  } catch (error) {
    console.error('Password reset token creation error:', error);
    return { success: false, error: 'Failed to create password reset token' };
  }
}

export async function verifyPasswordResetCode(email: string, code: string) {
  try {
    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return { success: false, error: 'User not found' };
    }

    // Find valid reset token
    const resetToken = await db.select()
      .from(verificationTokens)
      .where(and(
        eq(verificationTokens.userId, user[0].id),
        eq(verificationTokens.token, code),
        eq(verificationTokens.type, 'password_reset'),
        gt(verificationTokens.expires, new Date())
      ))
      .limit(1);

    if (resetToken.length === 0) {
      return { success: false, error: 'Invalid or expired reset code' };
    }

    return { success: true, userId: user[0].id! };
  } catch (error) {
    console.error('Password reset verification error:', error);
    return { success: false, error: 'Verification failed' };
  }
}

export async function resetPasswordByCode(email: string, code: string, newPassword: string) {
  try {
    // Verify the code first
    const verification = await verifyPasswordResetCode(email, code);
    if (!verification.success) {
      return verification;
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password
    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, verification.userId!));

    // Delete the used reset token
    await db.delete(verificationTokens)
      .where(and(
        eq(verificationTokens.userId, verification.userId!),
        eq(verificationTokens.token, code),
        eq(verificationTokens.type, 'password_reset')
      ));

    // Delete all sessions for this user (force re-login)
    await db.delete(sessions).where(eq(sessions.userId, verification.userId!));

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}

async function sendPasswordResetEmail(email: string, code: string, firstName?: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #7c3aed; margin: 0; font-size: 28px;">Password Reset</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Secure Authentication System</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">
                Hello ${firstName || 'User'}!
              </h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password. Use the verification code below to proceed with resetting your password.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f8f9fa; border: 2px dashed #7c3aed; border-radius: 8px; padding: 20px; display: inline-block;">
                <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                  Verification Code
                </p>
                <div style="font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 6px; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                ⚠️ This code will expire in 10 minutes for your security.
              </p>
            </div>
            
            <div style="margin: 30px 0;">
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
                <strong>What to do next:</strong>
              </p>
              <ol style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                <li>Return to the password reset page</li>
                <li>Enter this verification code</li>
                <li>Create your new password</li>
                <li>Log in with your new credentials</li>
              </ol>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 0;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                <br><br>
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
