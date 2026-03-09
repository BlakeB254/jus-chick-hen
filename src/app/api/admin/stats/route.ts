import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();

  const today = new Date().toISOString().split("T")[0];

  const [todayStats] = await sql`
    SELECT
      COUNT(*)::int AS order_count,
      COALESCE(SUM(total_cents), 0)::int AS revenue
    FROM orders
    WHERE created_at::date = ${today}::date
      AND status != 'cancelled'
  `;

  const [pendingStats] = await sql`
    SELECT COUNT(*)::int AS count
    FROM orders
    WHERE status IN ('pending', 'confirmed', 'preparing')
  `;

  const [avgStats] = await sql`
    SELECT COALESCE(AVG(total_cents), 0)::int AS avg_value
    FROM orders
    WHERE status != 'cancelled'
  `;

  return NextResponse.json({
    todayOrders: todayStats?.order_count ?? 0,
    todayRevenue: todayStats?.revenue ?? 0,
    pendingOrders: pendingStats?.count ?? 0,
    avgOrderValue: avgStats?.avg_value ?? 0,
  });
}
