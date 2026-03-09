import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sql = getDb();
  const status = req.nextUrl.searchParams.get("status");

  const orders = (status
    ? await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC LIMIT 100`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`
  ) as Record<string, unknown>[];

  const orderIds = orders.map((o) => o.id as string);
  const items = orderIds.length > 0
    ? (await sql`SELECT * FROM order_items WHERE order_id = ANY(${orderIds})`) as Record<string, unknown>[]
    : [];

  const ordersWithItems = orders.map((o) => ({
    ...o,
    items: items.filter((i) => i.order_id === o.id),
  }));

  return NextResponse.json(ordersWithItems);
}
