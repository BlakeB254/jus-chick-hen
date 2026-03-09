import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress, distanceFromRestaurant } from "@/lib/geo";
import { getDb } from "@/lib/db";
import { SETTINGS_KEYS } from "@/lib/shared/constants";
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
  const settingsRows = await sql`
    SELECT key, value FROM settings
    WHERE key IN (${SETTINGS_KEYS.DELIVERY_RADIUS_MILES}, ${SETTINGS_KEYS.DELIVERY_FEE_CENTS})
  ` as Record<string, string>[];
  const settingsMap = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));

  const radiusMiles = settingsMap[SETTINGS_KEYS.DELIVERY_RADIUS_MILES] ? parseFloat(settingsMap[SETTINGS_KEYS.DELIVERY_RADIUS_MILES]) : 3;
  const feeCents = settingsMap[SETTINGS_KEYS.DELIVERY_FEE_CENTS] ? parseInt(settingsMap[SETTINGS_KEYS.DELIVERY_FEE_CENTS], 10) : 399;

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
