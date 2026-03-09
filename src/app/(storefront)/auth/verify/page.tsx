"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("No verification token found.");
      setStatus("error");
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (cancelled) return;

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Verification failed.");
        }

        setStatus("success");

        // Redirect to homepage after a short delay
        setTimeout(() => {
          if (!cancelled) router.push("/");
        }, 2000);
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(
          err instanceof Error ? err.message : "Verification failed."
        );
        setStatus("error");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <h1 className="text-3xl font-bold text-[#CC0000]">Jus Chick-Hen</h1>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-[#F5F0E0] p-8">
          {status === "verifying" && (
            <div className="py-4">
              <div className="w-12 h-12 border-4 border-[#F5F0E0] border-t-[#CC0000] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#666666]">Verifying your sign-in link...</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-4">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                You&apos;re signed in!
              </h2>
              <p className="text-[#666666]">Redirecting you to the menu...</p>
            </div>
          )}

          {status === "error" && (
            <div className="py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Verification failed
              </h2>
              <p className="text-[#666666] mb-4">{errorMsg}</p>
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2.5 rounded-lg bg-[#CC0000] text-white font-semibold hover:bg-[#AA0000] transition-colors"
              >
                Try again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
        <div className="w-12 h-12 border-4 border-[#F5F0E0] border-t-[#CC0000] rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
