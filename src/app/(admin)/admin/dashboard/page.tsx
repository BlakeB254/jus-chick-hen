"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/admin/StatsCards";
import { OrderCard } from "@/components/admin/OrderCard";
import type { Order, OrderStatus } from "@/lib/shared/types";

export default function DashboardPage() {
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0, pendingOrders: 0, avgOrderValue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [statsRes, ordersRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/orders?status=pending"),
    ]);
    setStats(await statsRes.json());
    setRecentOrders(await ordersRes.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 p-4 animate-pulse">
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-8 text-center text-gray-500">
            No pending orders right now
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
