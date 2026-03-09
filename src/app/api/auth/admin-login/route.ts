import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/auth";
import { createSession, setSessionCookie } from "@/lib/session";

const ADMIN_EMAIL = "admin@juschickhen.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    const sessionToken = await createSession(ADMIN_EMAIL, true);
    await setSessionCookie(sessionToken, true);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
