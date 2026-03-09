"use client";

import { useState, useEffect } from "react";
import { OrderCard } from "@/components/admin/OrderCard";
import { ORDER_STATUS_LABELS, ORDER_STATUS_FLOW } from "@/lib/shared/constants";
import { updateOrderStatus } from "@/lib/admin-helpers";
import type { Order, OrderStatus } from "@/lib/shared/types";
import { cn } from "@/lib/utils";

const statusFilters = ["all", ...ORDER_STATUS_FLOW];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const url = filter === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${filter}`;
    const res = await fetch(url);
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors capitalize",
              filter === s
                ? "bg-brand-red text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {s === "all" ? "All" : ORDER_STATUS_LABELS[s] ?? s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 p-4 animate-pulse h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 p-8 text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
