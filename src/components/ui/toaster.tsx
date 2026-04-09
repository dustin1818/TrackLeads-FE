import { X } from "lucide-react";
import { useToastStore } from "@/lib/toast";
import { cn } from "@/lib/utils";

export const Toaster = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,24rem)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-top-2",
            toast.variant === "success"
              ? "border-emerald-200 bg-white/95 dark:border-emerald-800 dark:bg-slate-800/95"
              : "border-red-200 bg-white/95 dark:border-red-800 dark:bg-slate-800/95",
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  toast.variant === "success"
                    ? "text-emerald-700"
                    : "text-red-700",
                )}
              >
                {toast.title}
              </p>
              {toast.description ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {toast.description}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
