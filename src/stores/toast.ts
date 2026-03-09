import { create } from "zustand";
import { nanoid } from "nanoid";

const TOAST_DURATION_MS = 2500;

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error") => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastState>()((set, get) => ({
  toasts: [],

  addToast: (message, type = "success") => {
    const id = nanoid();
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().removeToast(id), TOAST_DURATION_MS);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
