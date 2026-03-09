"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Phone, MapPin, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { brand } from "@/config/brand";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const orderType = searchParams.get("type"); // "pickup" or "delivery"

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-foreground mb-3">No Order Found</h1>
          <p className="text-muted-foreground mb-6">
            It looks like there&apos;s no order to display. Head back to the menu to place an order.
          </p>
          <Link href="/menu" className="btn-cta rounded-full px-8 py-3 text-white font-medium inline-block">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const isDelivery = orderType === "delivery";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5"
        >
          <CheckCircle2 size={44} className="text-green-600" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2 font-display">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-1">
            Thank you! Your order has been received and is being prepared.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
          </p>
        </motion.div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="rounded-xl border border-border bg-white p-5 mb-6 text-left space-y-4"
        >
          {/* Estimated Time */}
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Estimated Time</p>
              <p className="text-sm text-muted-foreground">
                {isDelivery
                  ? "Your order will be delivered in 30-45 minutes"
                  : "Your order will be ready in 15-25 minutes"}
              </p>
            </div>
          </div>

          {/* Pickup Location / Delivery Note */}
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              {isDelivery ? (
                <>
                  <p className="font-medium text-sm">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Your order is on its way to you
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-sm">Pickup Location</p>
                  <p className="text-sm text-muted-foreground">{brand.fullAddress}</p>
                </>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Questions?</p>
              <a href={brand.phoneHref} className="text-sm text-brand-red hover:underline">
                {brand.phone}
              </a>
            </div>
          </div>

          {/* Track Order Note */}
          <div className="flex items-start gap-3">
            <MessageSquare size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Order Updates</p>
              <p className="text-sm text-muted-foreground">
                We&apos;ll text you when it&apos;s ready
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="flex flex-col gap-3"
        >
          <Link href="/menu" className="btn-cta rounded-full py-3 text-white font-medium flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Return Home
          </Link>
        </motion.div>
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
