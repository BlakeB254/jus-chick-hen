"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Upload, ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { MenuItem, MenuCategory } from "@/lib/shared/types";
import { cn } from "@/lib/utils";

export default function MenuManagePage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchMenu = async () => {
    const res = await fetch("/api/admin/menu");
    const data = await res.json();
    setCategories(data.categories);
    setItems(data.items);
    setLoading(false);
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleSave = async () => {
    if (!editingItem?.name || !editingItem.category_id) return;

    if (editingItem.id) {
      await fetch(`/api/admin/menu/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    } else {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
    }

    setEditingItem(null);
    setShowForm(false);
    fetchMenu();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    fetchMenu();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      setEditingItem({ ...editingItem, image_url: url });
    }
    setUploading(false);
  };

  const handleToggle = async (item: MenuItem, field: "is_available" | "is_featured") => {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !item[field] }),
    });
    fetchMenu();
  };

  const groupedItems = categories.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.category_id === cat.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
        <button
          onClick={() => { setEditingItem({ price_cents: 0, is_available: true, is_featured: false }); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white hover:bg-brand-red-dark transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Edit/Add Form */}
      {showForm && editingItem && (
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">{editingItem.id ? "Edit Item" : "Add Item"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={editingItem.name ?? ""}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              placeholder="Item Name *"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
            <select
              value={editingItem.category_id ?? ""}
              onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            >
              <option value="">Select Category *</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              type="number"
              value={editingItem.price_cents ? editingItem.price_cents / 100 : ""}
              onChange={(e) => setEditingItem({ ...editingItem, price_cents: Math.round(parseFloat(e.target.value || "0") * 100) })}
              placeholder="Price ($)"
              step="0.01"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
            <input
              value={editingItem.description ?? ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              placeholder="Description"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>
          {/* Image upload */}
          <div className="mt-4 flex items-center gap-4">
            {editingItem.image_url ? (
              <img src={editingItem.image_url} alt="" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <ImageIcon size={20} className="text-gray-400" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors">
                <Upload size={14} />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" disabled={uploading} />
              </label>
              {editingItem.image_url && (
                <button onClick={() => setEditingItem({ ...editingItem, image_url: "" })} className="text-xs text-red-500 hover:underline text-left">
                  Remove image
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editingItem.is_featured ?? false} onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editingItem.is_available ?? true} onChange={(e) => setEditingItem({ ...editingItem, is_available: e.target.checked })} />
              Available
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white">Save</button>
            <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Menu items by category */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedItems.map(({ category, items: catItems }) => (
            <div key={category.id}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h2>
              <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-100">
                {catItems.length === 0 ? (
                  <p className="p-4 text-sm text-gray-400">No items in this category</p>
                ) : (
                  catItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt="" className="h-8 w-8 rounded object-cover shrink-0" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-gray-100 shrink-0 flex items-center justify-center">
                            <ImageIcon size={12} className="text-gray-400" />
                          </div>
                        )}
                        <span className={cn("text-sm font-medium truncate", !item.is_available && "text-gray-400 line-through")}>
                          {item.name}
                        </span>
                        {item.is_featured && <Star size={14} className="text-brand-gold shrink-0" fill="currentColor" />}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold text-gray-700">{formatPrice(item.price_cents)}</span>
                        <button onClick={() => handleToggle(item, "is_available")} className="p-1 hover:bg-gray-100 rounded" title={item.is_available ? "Hide" : "Show"}>
                          {item.is_available ? <Eye size={14} className="text-green-600" /> : <EyeOff size={14} className="text-gray-400" />}
                        </button>
                        <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="p-1 hover:bg-gray-100 rounded">
                          <Pencil size={14} className="text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-red-50 rounded">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
