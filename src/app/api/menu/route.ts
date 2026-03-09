import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { MenuGrouped } from "@/lib/shared/types";

export async function GET() {
  const sql = getDb();

  const categories = await sql`
    SELECT * FROM menu_categories
    WHERE is_active = true
    ORDER BY sort_order
  ` as Record<string, unknown>[];

  const items = await sql`
    SELECT * FROM menu_items
    WHERE is_available = true
    ORDER BY sort_order
  ` as Record<string, unknown>[];

  const grouped: MenuGrouped[] = categories.map((cat) => ({
    category: cat as unknown as MenuGrouped["category"],
    items: items.filter((item) => item.category_id === cat.id) as unknown as MenuGrouped["items"],
  }));

  return NextResponse.json(grouped, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
