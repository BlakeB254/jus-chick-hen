import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { MenuGrouped } from "@/lib/shared/types";

export async function GET() {
  const sql = getDb();

  const categories = await sql`
    SELECT * FROM menu_categories
    WHERE is_active = true
    ORDER BY sort_order
  `;

  const items = await sql`
    SELECT * FROM menu_items
    WHERE is_available = true
    ORDER BY sort_order
  `;

  const grouped: MenuGrouped[] = categories.map((cat) => ({
    category: {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    },
    items: items
      .filter((item) => item.category_id === cat.id)
      .map((item) => ({
        id: item.id,
        category_id: item.category_id,
        name: item.name,
        description: item.description,
        price_cents: item.price_cents,
        image_url: item.image_url,
        is_available: item.is_available,
        is_featured: item.is_featured,
        variants: item.variants,
        sort_order: item.sort_order,
      })),
  }));

  return NextResponse.json(grouped, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
