import { NextResponse } from "next/server";
import {
  getCustomerSessionFromCookies,
  getAdminSessionFromCookies,
} from "@/lib/session";

export async function GET() {
  try {
    // Check admin session first, then customer
    const adminSession = await getAdminSessionFromCookies();
    if (adminSession) {
      return NextResponse.json({
        authenticated: true,
        email: adminSession.email,
        isAdmin: true,
        expiresAt: adminSession.expires_at,
      });
    }

    const customerSession = await getCustomerSessionFromCookies();
    if (customerSession) {
      return NextResponse.json({
        authenticated: true,
        email: customerSession.email,
        isAdmin: false,
        expiresAt: customerSession.expires_at,
      });
    }

    return NextResponse.json({ authenticated: false });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ authenticated: false });
  }
}
