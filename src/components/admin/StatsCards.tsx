"use client";

import { DollarSign, ShoppingBag, Clock, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface StatsData {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  avgOrderValue: number;
}

export function StatsCards({ stats }: { stats: StatsData }) {
  const cards = [
    { label: "Today's Orders", value: String(stats.todayOrders), icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Revenue", value: formatPrice(stats.todayRevenue), icon: DollarSign, color: "text-green-600 bg-green-50" },
    { label: "Pending Orders", value: String(stats.pendingOrders), icon: Clock, color: "text-orange-600 bg-orange-50" },
    { label: "Avg Order Value", value: formatPrice(stats.avgOrderValue), icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
