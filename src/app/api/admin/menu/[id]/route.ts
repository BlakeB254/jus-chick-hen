import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, val] of Object.entries(body)) {
    if (["name", "description", "price_cents", "is_available", "is_featured", "category_id", "sort_order"].includes(key)) {
      fields.push(key);
      values.push(val);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // Build dynamic update — since Neon tagged templates don't support dynamic column names easily,
  // we update each field individually
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const val = values[i];
    // Safe: field name is validated against allowlist above
    await sql(`UPDATE menu_items SET ${field} = $1 WHERE id = $2`, [val, id]);
  }

  const [item] = await sql`SELECT * FROM menu_items WHERE id = ${id}`;
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  await sql`DELETE FROM menu_items WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
