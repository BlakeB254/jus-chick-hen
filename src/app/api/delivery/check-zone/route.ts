import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress, distanceFromRestaurant } from "@/lib/geo";
import { getDb } from "@/lib/db";
import type { DeliveryCheckResult } from "@/lib/shared/types";

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const coords = await geocodeAddress(address);
  if (!coords) {
    return NextResponse.json({
      available: false,
      distance_miles: 0,
      delivery_fee_cents: 0,
      message: "Could not find that address. Please try a more specific address.",
    } satisfies DeliveryCheckResult);
  }

  const distance = distanceFromRestaurant(coords.lat, coords.lng);

  const sql = getDb();
  const [radiusRow] = await sql`SELECT value FROM settings WHERE key = 'delivery_radius_miles'`;
  const [feeRow] = await sql`SELECT value FROM settings WHERE key = 'delivery_fee_cents'`;

  const radiusMiles = radiusRow ? parseFloat(radiusRow.value) : 3;
  const feeCents = feeRow ? parseInt(feeRow.value, 10) : 399;

  if (distance <= radiusMiles) {
    return NextResponse.json({
      available: true,
      distance_miles: Math.round(distance * 10) / 10,
      delivery_fee_cents: feeCents,
      message: `Delivery available! (${distance.toFixed(1)} miles)`,
    } satisfies DeliveryCheckResult);
  }

  return NextResponse.json({
    available: false,
    distance_miles: Math.round(distance * 10) / 10,
    delivery_fee_cents: 0,
    message: `Outside our ${radiusMiles}-mile delivery area. Order through DoorDash or Grubhub instead!`,
  } satisfies DeliveryCheckResult);
}
