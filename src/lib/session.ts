import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { AUTH_CONFIG } from "@/lib/shared/constants";
import type { Session } from "@/lib/shared/types";

const CUSTOMER_COOKIE = "jch_session";
const ADMIN_COOKIE = "jch_admin_session";

// ── Session CRUD ──

/**
 * Create a new session in the DB and return the session token.
 */
export async function createSession(
  email: string,
  isAdmin: boolean
): Promise<string> {
  const sql = getDb();
  const sessionToken = nanoid(48);

  const expiresAt = isAdmin
    ? new Date(
        Date.now() + AUTH_CONFIG.ADMIN_SESSION_EXPIRY_HOURS * 60 * 60 * 1000
      )
    : new Date(
        Date.now() + AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      );

  await sql`
    INSERT INTO sessions (session_token, email, is_admin, expires_at)
    VALUES (${sessionToken}, ${email.toLowerCase().trim()}, ${isAdmin}, ${expiresAt.toISOString()})
  `;

  return sessionToken;
}

/**
 * Retrieve and validate a session by token. Returns null if expired or not found.
 */
export async function getSession(token: string): Promise<Session | null> {
  const sql = getDb();

  const rows = await sql`
    SELECT session_token, email, is_admin, expires_at
    FROM sessions
    WHERE session_token = ${token}
  `;

  if (rows.length === 0) return null;

  const row = rows[0] as unknown as Session;

  // Check expiry
  if (new Date(row.expires_at) < new Date()) {
    // Clean up expired session
    await sql`DELETE FROM sessions WHERE session_token = ${token}`;
    return null;
  }

  return row;
}

/**
 * Delete a session from the DB.
 */
export async function deleteSession(token: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE session_token = ${token}`;
}

// ── Cookie helpers ──

/**
 * Set the appropriate session cookie (customer or admin).
 */
export async function setSessionCookie(
  sessionToken: string,
  isAdmin: boolean
): Promise<void> {
  const cookieStore = await cookies();
  const name = isAdmin ? ADMIN_COOKIE : CUSTOMER_COOKIE;
  const maxAge = isAdmin
    ? AUTH_CONFIG.ADMIN_SESSION_EXPIRY_HOURS * 60 * 60
    : AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60;

  cookieStore.set(name, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

/**
 * Clear a session cookie.
 */
export async function clearSessionCookie(isAdmin: boolean): Promise<void> {
  const cookieStore = await cookies();
  const name = isAdmin ? ADMIN_COOKIE : CUSTOMER_COOKIE;
  cookieStore.set(name, "", { path: "/", maxAge: 0 });
}

/**
 * Get the current customer session from cookies (for use in server components / route handlers).
 */
export async function getCustomerSessionFromCookies(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  return getSession(token);
}

/**
 * Get the current admin session from cookies.
 */
export async function getAdminSessionFromCookies(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return getSession(token);
}

export { CUSTOMER_COOKIE, ADMIN_COOKIE };
