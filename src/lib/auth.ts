import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";
import { AUTH_CONFIG } from "@/lib/shared/constants";
import type { AuthToken } from "@/lib/shared/types";

// ── Magic-link auth ──

/**
 * Create a magic link token for email-based customer auth.
 * Stores the token in auth_tokens table and returns it.
 */
export async function createMagicLink(email: string): Promise<string> {
  const sql = getDb();
  const token = nanoid(32);
  const expiresAt = new Date(
    Date.now() + AUTH_CONFIG.MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000
  );

  await sql`
    INSERT INTO auth_tokens (email, token, expires_at)
    VALUES (${email.toLowerCase().trim()}, ${token}, ${expiresAt.toISOString()})
  `;

  return token;
}

/**
 * Verify a magic link token. Returns the email if valid, null otherwise.
 * Marks the token as used so it cannot be reused.
 */
export async function verifyMagicLink(token: string): Promise<string | null> {
  const sql = getDb();

  const rows = await sql`
    SELECT email, token, expires_at, used_at
    FROM auth_tokens
    WHERE token = ${token}
  `;

  if (rows.length === 0) return null;

  const row = rows[0] as unknown as AuthToken;

  // Already used
  if (row.used_at) return null;

  // Expired
  if (new Date(row.expires_at) < new Date()) return null;

  // Mark as used
  await sql`
    UPDATE auth_tokens
    SET used_at = NOW()
    WHERE token = ${token}
  `;

  return row.email;
}

// ── Admin password auth ──

/**
 * Verify the admin password against the ADMIN_PASSWORD env variable.
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env[AUTH_CONFIG.ADMIN_PASSWORD_ENV];
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD env variable is not set");
    return false;
  }
  // Constant-time-ish comparison to avoid timing attacks
  if (password.length !== adminPassword.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  return mismatch === 0;
}
