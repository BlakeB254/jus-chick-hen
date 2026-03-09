import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const settings = await sql`SELECT * FROM settings`;
  const map = Object.fromEntries(settings.map((s: Record<string, unknown>) => [s.key as string, s.value as string]));
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const sql = getDb();
  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    await sql`INSERT INTO settings (key, value) VALUES (${key}, ${String(value)}) ON CONFLICT (key) DO UPDATE SET value = ${String(value)}`;
  }

  return NextResponse.json({ success: true });
}
