"use client";

import { Clock, MapPin, Phone, User } from "lucide-react";
import { formatPrice, getTimeAgo } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/shared/constants";
import type { Order, OrderStatus } from "@/lib/shared/types";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-50 text-green-600",
  picked_up: "bg-green-50 text-green-600",
  cancelled: "bg-red-100 text-red-800",
};

const nextStatus: Record<string, OrderStatus | null> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: null, // Depends on order type
  out_for_delivery: "delivered",
};

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const next = order.status === "ready"
    ? (order.type === "delivery" ? "out_for_delivery" : "picked_up")
    : nextStatus[order.status];

  const timeAgo = getTimeAgo(order.created_at);

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[order.status])}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize">
              {order.type}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Clock size={12} />
            {timeAgo}
          </div>
        </div>
        <span className="text-lg font-bold text-gray-900">{formatPrice(order.total_cents)}</span>
      </div>

      {/* Customer info */}
      <div className="space-y-1 text-sm text-gray-600 mb-3">
        {order.customer_name && (
          <div className="flex items-center gap-2"><User size={14} /> {order.customer_name}</div>
        )}
        {order.customer_phone && (
          <div className="flex items-center gap-2"><Phone size={14} /> {order.customer_phone}</div>
        )}
        {order.address && (
          <div className="flex items-center gap-2"><MapPin size={14} /> {order.address}</div>
        )}
      </div>

      {order.notes && (
        <p className="text-sm text-gray-500 italic border-l-2 border-brand-gold pl-2 mb-3">{order.notes}</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {next && (
          <button
            onClick={() => onUpdateStatus(order.id, next)}
            className="flex-1 rounded-lg bg-brand-red px-3 py-2 text-sm font-medium text-white hover:bg-brand-red-dark transition-colors"
          >
            Mark as {ORDER_STATUS_LABELS[next]}
          </button>
        )}
        {order.status !== "cancelled" && order.status !== "delivered" && order.status !== "picked_up" && (
          <button
            onClick={() => onUpdateStatus(order.id, "cancelled")}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

