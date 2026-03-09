"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed.");
      }

      router.push(redirect);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Login failed.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            Jus Chick-Hen
          </h1>
          <p className="text-[#999] mt-1 text-sm">Admin Dashboard</p>
        </div>

        <div className="bg-[#222] rounded-xl border border-[#333] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#CCC] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-lg border border-[#444] bg-[#1A1A1A] text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 focus:border-[#CC0000] transition-colors"
              />
            </div>

            {status === "error" && errorMsg && (
              <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-4 rounded-lg bg-[#CC0000] text-white font-semibold hover:bg-[#AA0000] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <p className="text-[#999]">Loading...</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
