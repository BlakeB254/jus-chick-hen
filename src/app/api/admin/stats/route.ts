import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();

  const today = new Date().toISOString().split("T")[0];

  const [todayResult, pendingResult, avgResult] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS order_count,
        COALESCE(SUM(total_cents), 0)::int AS revenue
      FROM orders
      WHERE created_at::date = ${today}::date
        AND status != 'cancelled'
    `,
    sql`
      SELECT COUNT(*)::int AS count
      FROM orders
      WHERE status IN ('pending', 'confirmed', 'preparing')
    `,
    sql`
      SELECT COALESCE(AVG(total_cents), 0)::int AS avg_value
      FROM orders
      WHERE status != 'cancelled'
        AND created_at >= NOW() - INTERVAL '30 days'
    `,
  ]);

  const todayStats = (todayResult as Record<string, number>[])[0];
  const pendingStats = (pendingResult as Record<string, number>[])[0];
  const avgStats = (avgResult as Record<string, number>[])[0];

  return NextResponse.json({
    todayOrders: todayStats?.order_count ?? 0,
    todayRevenue: todayStats?.revenue ?? 0,
    pendingOrders: pendingStats?.count ?? 0,
    avgOrderValue: avgStats?.avg_value ?? 0,
  });
}
