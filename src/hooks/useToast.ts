"use client";

import { useCallback, useEffect, useState } from "react";

export type ToastKind = "success" | "error" | "loading";

export type ToastState = {
  message: string;
  kind: ToastKind;
};

export const useToast = (timeout = 4_000) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast || toast.kind === "loading") {
      return undefined;
    }
    const timer = setTimeout(() => setToast(null), timeout);
    return () => clearTimeout(timer);
  }, [toast, timeout]);

  const showToast = useCallback((message: string, kind: ToastKind) => {
    setToast({ message, kind });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, clearToast };
};
