import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deleteSession,
  clearSessionCookie,
  CUSTOMER_COOKIE,
  ADMIN_COOKIE,
} from "@/lib/session";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete admin session if present
    const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
    if (adminToken) {
      await deleteSession(adminToken);
      await clearSessionCookie(true);
    }

    // Delete customer session if present
    const customerToken = cookieStore.get(CUSTOMER_COOKIE)?.value;
    if (customerToken) {
      await deleteSession(customerToken);
      await clearSessionCookie(false);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Logout failed." },
      { status: 500 }
    );
  }
}
