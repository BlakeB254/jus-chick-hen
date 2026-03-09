import { NextResponse } from "next/server";
import { createMagicLink } from "@/lib/auth";
import { brand } from "@/config/brand";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const token = await createMagicLink(email);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.url;
    const verifyUrl = `${siteUrl}/auth/verify?token=${token}`;

    // Attempt to send via Resend; fall back to console.log for demo
    let sent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `Jus Chick-Hen <noreply@${process.env.RESEND_DOMAIN || "juschickhen.com"}>`,
          to: email,
          subject: "Sign in to Jus Chick-Hen",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #CC0000;">Sign in to Jus Chick-Hen</h2>
              <p>Click the button below to sign in. This link expires in 15 minutes.</p>
              <a href="${verifyUrl}"
                 style="display: inline-block; padding: 12px 24px; background: #CC0000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Sign In
              </a>
              <p style="color: #666; font-size: 14px; margin-top: 24px;">
                If you didn&apos;t request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
        sent = true;
      } catch (err) {
        console.error("Resend send failed, falling back to console:", err);
      }
    }

    if (!sent) {
      console.log(`\n[MAGIC LINK] ${email} → ${verifyUrl}\n`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Magic link error:", err);
    return NextResponse.json(
      { error: "Failed to send magic link." },
      { status: 500 }
    );
  }
}
