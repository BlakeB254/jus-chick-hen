"use client";

import { useState } from "react";
import Link from "next/link";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-[#CC0000]">
              Jus Chick-Hen
            </h1>
          </Link>
          <p className="text-[#666666] mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#F5F0E0] p-8">
          {status === "sent" ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Check your email
              </h2>
              <p className="text-[#666666]">
                We sent a sign-in link to{" "}
                <span className="font-medium text-[#1A1A1A]">{email}</span>.
                <br />
                Click the link to sign in.
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="mt-6 text-sm text-[#CC0000] hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#1A1A1A] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[#F5F0E0] bg-[#FFFDF5] text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/30 focus:border-[#CC0000] transition-colors"
                />
              </div>

              {status === "error" && errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 px-4 rounded-lg bg-[#CC0000] text-white font-semibold hover:bg-[#AA0000] focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {status === "loading" ? "Sending..." : "Send sign-in link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[#666666] mt-6">
          <Link href="/" className="hover:text-[#CC0000] transition-colors">
            &larr; Back to Jus Chick-Hen
          </Link>
        </p>
      </div>
    </div>
  );
}
