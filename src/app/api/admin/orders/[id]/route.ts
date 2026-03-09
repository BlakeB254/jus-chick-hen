import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDb();
  const { status } = await req.json();

  await sql`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;

  const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
