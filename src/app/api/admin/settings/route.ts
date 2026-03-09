import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const settings = await sql`SELECT * FROM settings` as Record<string, string>[];
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const sql = getDb();
  const body = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      sql`INSERT INTO settings (key, value) VALUES (${key}, ${String(value)}) ON CONFLICT (key) DO UPDATE SET value = ${String(value)}`
    )
  );

  return NextResponse.json({ success: true });
}
