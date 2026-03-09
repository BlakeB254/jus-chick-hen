import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { nanoid } from "nanoid";
import { TAX_RATE } from "@/lib/shared/constants";
import type { CreateOrderPayload } from "@/lib/shared/types";

export async function POST(req: NextRequest) {
  const sql = getDb();
  const body: CreateOrderPayload = await req.json();

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Order must have items" }, { status: 400 });
  }
  if (!body.customer_name || !body.customer_phone) {
    return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
  }

  const subtotalCents = body.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

  // Look up delivery fee from settings
  let deliveryFeeCents = 0;
  if (body.type === "delivery") {
    const [feeRow] = await sql`SELECT value FROM settings WHERE key = 'delivery_fee_cents'`;
    deliveryFeeCents = feeRow ? parseInt(feeRow.value, 10) : 399;
  }

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents + deliveryFeeCents;

  const orderId = nanoid();

  await sql`
    INSERT INTO orders (id, status, type, subtotal_cents, delivery_fee_cents, tax_cents, total_cents, address, notes, customer_name, customer_phone, customer_email)
    VALUES (${orderId}, 'pending', ${body.type}, ${subtotalCents}, ${deliveryFeeCents}, ${taxCents}, ${totalCents}, ${body.address || null}, ${body.notes || null}, ${body.customer_name}, ${body.customer_phone}, ${body.customer_email || null})
  `;

  for (const item of body.items) {
    await sql`
      INSERT INTO order_items (id, order_id, menu_item_id, name, price_cents, quantity, variant, notes)
      VALUES (${nanoid()}, ${orderId}, ${item.menu_item_id}, ${item.name}, ${item.price_cents}, ${item.quantity}, ${item.variant || null}, ${item.notes || null})
    `;
  }

  return NextResponse.json({
    id: orderId,
    status: "pending",
    total_cents: totalCents,
  });
}

export async function GET() {
  const sql = getDb();
  const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`;
  return NextResponse.json(orders);
}
