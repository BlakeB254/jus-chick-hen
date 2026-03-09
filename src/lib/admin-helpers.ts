import type { OrderStatus } from "@/lib/shared/types";

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await fetch(`/api/admin/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
