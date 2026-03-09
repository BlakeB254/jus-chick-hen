import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sql = getDb();
  const status = req.nextUrl.searchParams.get("status");

  let orders;
  if (status) {
    orders = await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC LIMIT 100`;
  } else {
    orders = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`;
  }

  // Fetch order items for each order
  const orderIds = orders.map((o: Record<string, unknown>) => o.id as string);
  const items = orderIds.length > 0
    ? await sql`SELECT * FROM order_items WHERE order_id = ANY(${orderIds})`
    : [];

  const ordersWithItems = orders.map((o: Record<string, unknown>) => ({
    ...o,
    items: (items as Record<string, unknown>[]).filter((i) => i.order_id === o.id),
  }));

  return NextResponse.json(ordersWithItems);
}
