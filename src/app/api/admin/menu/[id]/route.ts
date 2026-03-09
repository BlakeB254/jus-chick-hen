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

  // Build a single UPDATE with all fields — column names are validated against the allowlist above
  const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const result = await sql(
    `UPDATE menu_items SET ${setClauses} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  ) as Record<string, unknown>[];

  if (result.length === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  await sql`DELETE FROM menu_items WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
