import { create } from "zustand";

type ToastVariant = "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  dismissToast: (id: string) => void;
}

const TOAST_DURATION_MS = 4000;

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }));
    }, TOAST_DURATION_MS);

    return id;
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore
      .getState()
      .addToast({ title, description, variant: "success" }),
  error: (title: string, error?: unknown, fallbackDescription?: string) =>
    useToastStore.getState().addToast({
      title,
      description: getErrorMessage(
        error,
        fallbackDescription || "Something went wrong.",
      ),
      variant: "error",
    }),
  dismiss: (id: string) => useToastStore.getState().dismissToast(id),
};

export { useToastStore };
