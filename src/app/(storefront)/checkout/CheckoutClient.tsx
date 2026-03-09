"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, Store, MapPin, Loader2, ExternalLink } from "lucide-react";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/format";
import { brand } from "@/config/brand";
import type { DeliveryCheckResult, OrderType } from "@/lib/shared/types";

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const orderType = useCart((s) => s.orderType);
  const setOrderType = useCart((s) => s.setOrderType);
  const setDeliveryFee = useCart((s) => s.setDeliveryFee);
  const subtotalCents = useCart((s) => s.subtotalCents);
  const taxCents = useCart((s) => s.taxCents);
  const totalCents = useCart((s) => s.totalCents);
  const deliveryFeeCents = useCart((s) => s.deliveryFeeCents);
  const clear = useCart((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryCheck, setDeliveryCheck] = useState<DeliveryCheckResult | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTypeChange = (type: OrderType) => {
    setOrderType(type);
    setDeliveryCheck(null);
    if (type === "pickup") setDeliveryFee(0);
  };

  const checkDeliveryZone = async () => {
    if (!address.trim()) return;
    setCheckingDelivery(true);
    try {
      const res = await fetch("/api/delivery/check-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const result: DeliveryCheckResult = await res.json();
      setDeliveryCheck(result);
      if (result.available) {
        setDeliveryFee(result.delivery_fee_cents);
      } else {
        setDeliveryFee(0);
      }
    } catch {
      setDeliveryCheck({ available: false, distance_miles: 0, delivery_fee_cents: 0, message: "Error checking address" });
    }
    setCheckingDelivery(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    if (orderType === "delivery" && !deliveryCheck?.available) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: orderType,
          items: items.map((i) => ({
            menu_item_id: i.menu_item_id,
            name: i.name,
            price_cents: i.price_cents,
            quantity: i.quantity,
            variant: i.variant,
            notes: i.notes,
          })),
          customer_name: name,
          customer_phone: phone,
          customer_email: email || undefined,
          address: orderType === "delivery" ? address : undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (data.id) {
        clear();
        router.push(`/order-confirmation?id=${data.id}`);
      }
    } catch {
      alert("Error placing order. Please try again.");
    }
    setSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add items from the menu to get started.</p>
        <Link href="/menu" className="btn-cta rounded-full px-6 py-3 text-white font-medium">
          View Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Link href="/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back to Menu
        </Link>

        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Order type toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => handleTypeChange("pickup")}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 font-medium transition-all ${
              orderType === "pickup"
                ? "border-brand-red bg-brand-red/5 text-brand-red"
                : "border-border text-muted-foreground hover:border-brand-red/30"
            }`}
          >
            <Store size={20} />
            Pickup
          </button>
          <button
            onClick={() => handleTypeChange("delivery")}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 font-medium transition-all ${
              orderType === "delivery"
                ? "border-brand-red bg-brand-red/5 text-brand-red"
                : "border-border text-muted-foreground hover:border-brand-red/30"
            }`}
          >
            <Truck size={20} />
            Delivery
          </button>
        </div>

        {/* Delivery address check */}
        {orderType === "delivery" && (
          <div className="mb-6 rounded-xl border border-border bg-white p-4">
            <label className="text-sm font-medium text-foreground">Delivery Address</label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setDeliveryCheck(null); }}
                  placeholder="Enter your delivery address..."
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand-red"
                />
              </div>
              <button
                onClick={checkDeliveryZone}
                disabled={checkingDelivery || !address.trim()}
                className="shrink-0 rounded-lg bg-brand-red px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {checkingDelivery ? <Loader2 size={16} className="animate-spin" /> : "Check"}
              </button>
            </div>

            {deliveryCheck && (
              <div className={`mt-3 rounded-lg p-3 text-sm ${
                deliveryCheck.available
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <p>{deliveryCheck.message}</p>
                {!deliveryCheck.available && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {brand.thirdParty.doordash && (
                      <a href={brand.thirdParty.doordash} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium border hover:bg-gray-50">
                        DoorDash <ExternalLink size={10} />
                      </a>
                    )}
                    {brand.thirdParty.grubhub && (
                      <a href={brand.thirdParty.grubhub} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium border hover:bg-gray-50">
                        Grubhub <ExternalLink size={10} />
                      </a>
                    )}
                    <button
                      onClick={() => handleTypeChange("pickup")}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 text-brand-red px-3 py-1 text-xs font-medium"
                    >
                      <Store size={10} /> Switch to Pickup
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Customer info */}
        <div className="rounded-xl border border-border bg-white p-4 mb-6">
          <h2 className="font-semibold mb-3">Your Information</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name *"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-red"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number *"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-red"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-red"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order notes (optional)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-red resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-border bg-white p-4 mb-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">{formatPrice(item.price_cents * item.quantity)}</span>
              </div>
            ))}
            <hr className="border-border" />
            {(() => {
              const sub = subtotalCents();
              const tax = taxCents();
              const total = totalCents();
              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  {orderType === "delivery" && deliveryFeeCents > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{formatPrice(deliveryFeeCents)}</span>
                    </div>
                  )}
                  <hr className="border-border" />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-brand-red">{formatPrice(total)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Payment note (demo) */}
        <div className="rounded-xl border border-dashed border-brand-gold bg-brand-gold/5 p-4 mb-6 text-center">
          <p className="text-sm text-brand-brown font-medium">Demo Mode</p>
          <p className="text-xs text-muted-foreground mt-1">Payment is collected at pickup/delivery. No payment processing in this demo.</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !name.trim() || !phone.trim() || (orderType === "delivery" && !deliveryCheck?.available)}
          className="w-full btn-cta rounded-full py-4 text-center font-semibold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Placing Order...</span>
          ) : (
            `Place Order — ${formatPrice(totalCents())}`
          )}
        </button>
      </div>
    </div>
  );
}
