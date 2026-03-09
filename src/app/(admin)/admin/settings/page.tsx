"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => { setSettings(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white border border-gray-200 p-4 animate-pulse h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white hover:bg-brand-red-dark disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Delivery settings */}
      <div className="rounded-xl bg-white border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Delivery Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Delivery Radius (miles)</label>
            <input
              type="number"
              value={settings.delivery_radius_miles ?? "3"}
              onChange={(e) => updateSetting("delivery_radius_miles", e.target.value)}
              step="0.5"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Delivery Fee ($)</label>
            <input
              type="number"
              value={settings.delivery_fee_cents ? (parseInt(settings.delivery_fee_cents) / 100).toFixed(2) : "3.99"}
              onChange={(e) => updateSetting("delivery_fee_cents", String(Math.round(parseFloat(e.target.value || "0") * 100)))}
              step="0.01"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Minimum Order ($)</label>
            <input
              type="number"
              value={settings.min_order_cents ? (parseInt(settings.min_order_cents) / 100).toFixed(2) : "15.00"}
              onChange={(e) => updateSetting("min_order_cents", String(Math.round(parseFloat(e.target.value || "0") * 100)))}
              step="0.01"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
            <input
              type="number"
              value={settings.tax_rate ? (parseFloat(settings.tax_rate) * 100).toFixed(2) : "10.75"}
              onChange={(e) => updateSetting("tax_rate", String(parseFloat(e.target.value || "0") / 100))}
              step="0.01"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Store status */}
      <div className="rounded-xl bg-white border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Store Status</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative w-12 h-6 rounded-full transition-colors ${settings.store_open === "true" ? "bg-green-500" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.store_open === "true" ? "translate-x-6" : "translate-x-0.5"}`} />
          </div>
          <input
            type="checkbox"
            checked={settings.store_open === "true"}
            onChange={(e) => updateSetting("store_open", e.target.checked ? "true" : "false")}
            className="sr-only"
          />
          <span className="text-sm font-medium text-gray-700">
            Store is {settings.store_open === "true" ? "Open" : "Closed"}
          </span>
        </label>
      </div>
    </div>
  );
}
