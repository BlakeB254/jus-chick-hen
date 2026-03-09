"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Phone, MapPin, Clock } from "lucide-react";
import { brand } from "@/config/brand";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="animate-scale-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-1">
            Your order has been received and is being prepared.
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
            </p>
          )}

          <div className="rounded-xl border border-border bg-white p-5 mb-6 text-left space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-red mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{brand.address.street}</p>
                <p className="text-sm text-muted-foreground">{brand.address.city}, {brand.address.state} {brand.address.zip}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-brand-red mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Questions?</p>
                <a href={`tel:${brand.phone}`} className="text-sm text-brand-red hover:underline">{brand.phone}</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-brand-red mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Estimated Time</p>
                <p className="text-sm text-muted-foreground">15-25 minutes</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/menu" className="btn-cta rounded-full py-3 text-white font-medium">
              Order More
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-muted border-t-brand-red rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
