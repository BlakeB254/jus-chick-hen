import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET() {
  const sql = getDb();
  const categories = await sql`SELECT * FROM menu_categories ORDER BY sort_order`;
  const items = await sql`SELECT * FROM menu_items ORDER BY sort_order`;
  return NextResponse.json({ categories, items });
}

export async function POST(req: NextRequest) {
  const sql = getDb();
  const body = await req.json();

  const id = nanoid();
  await sql`
    INSERT INTO menu_items (id, category_id, name, description, price_cents, is_available, is_featured, sort_order)
    VALUES (${id}, ${body.category_id}, ${body.name}, ${body.description || null}, ${body.price_cents}, ${body.is_available ?? true}, ${body.is_featured ?? false}, ${body.sort_order ?? 0})
  `;

  const [item] = await sql`SELECT * FROM menu_items WHERE id = ${id}`;
  return NextResponse.json(item, { status: 201 });
}
