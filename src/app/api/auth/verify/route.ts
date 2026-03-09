import { NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/auth";
import { createSession, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token is required." },
        { status: 400 }
      );
    }

    const email = await verifyMagicLink(token);

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired link. Please request a new one." },
        { status: 401 }
      );
    }

    // Create a customer session
    const sessionToken = await createSession(email, false);
    await setSessionCookie(sessionToken, false);

    return NextResponse.json({ success: true, email });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Verification failed." },
      { status: 500 }
    );
  }
}
