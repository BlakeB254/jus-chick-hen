"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/stores/toast";

export function Toast() {
  const toasts = useToast((s) => s.toasts);

  return (
    <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[60] flex flex-col items-center sm:items-end gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.type === "error" ? "bg-red-600" : "bg-brand-brown"
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
