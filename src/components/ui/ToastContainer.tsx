"use client";

import { useToasts } from "@/store/selectors";
import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";

const TOAST_COLORS = {
  info: "bg-blue-600",
  success: "bg-green-600",
  warning: "bg-yellow-600",
  error: "bg-red-600",
};

export default function ToastContainer() {
  const toasts = useToasts();
  const removeToast = useGameStore((s) => s.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), toast.timer),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${TOAST_COLORS[toast.type]} text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-fade-in`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
