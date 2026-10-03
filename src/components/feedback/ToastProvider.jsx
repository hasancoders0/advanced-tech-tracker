"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  XCircle,
} from "lucide-react";

const ToastContext = createContext(null);

const TOAST_DURATION = 3500;

function getToastIcon(type) {
  switch (type) {
    case "success":
      return CheckCircle2;

    case "error":
      return XCircle;

    case "warning":
      return AlertTriangle;

    case "info":
    default:
      return Info;
  }
}

function getToastStyles(type) {
  switch (type) {
    case "success":
      return {
        wrapper:
          "border-emerald-200 bg-emerald-50",
        icon:
          "text-emerald-600",
        title:
          "text-emerald-900",
        message:
          "text-emerald-700",
      };

    case "error":
      return {
        wrapper:
          "border-red-200 bg-red-50",
        icon:
          "text-red-600",
        title:
          "text-red-900",
        message:
          "text-red-700",
      };

    case "warning":
      return {
        wrapper:
          "border-amber-200 bg-amber-50",
        icon:
          "text-amber-600",
        title:
          "text-amber-900",
        message:
          "text-amber-700",
      };

    case "info":
    default:
      return {
        wrapper:
          "border-sky-200 bg-sky-50",
        icon:
          "text-sky-600",
        title:
          "text-sky-900",
        message:
          "text-sky-700",
      };
  }
}

function ToastItem({
  toast,
  onDismiss,
}) {
  const Icon = getToastIcon(
    toast.type
  );

  const styles = getToastStyles(
    toast.type
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "pointer-events-auto flex w-full",
        "max-w-sm items-start gap-3",
        "rounded-xl border p-3.5",
        "shadow-lg shadow-slate-900/10",
        "backdrop-blur-sm",
        "animate-in fade-in slide-in-from-right-4",
        "duration-200",
        styles.wrapper,
      ].join(" ")}
    >
      {/* ICON */}

      <div
        className={[
          "mt-0.5 shrink-0",
          styles.icon,
        ].join(" ")}
      >
        <Icon size={18} />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        {toast.title && (
          <p
            className={[
              "text-sm font-semibold",
              styles.title,
            ].join(" ")}
          >
            {toast.title}
          </p>
        )}

        <p
          className={[
            "text-xs leading-5",
            toast.title
              ? "mt-0.5"
              : "",
            styles.message,
          ].join(" ")}
        >
          {toast.message}
        </p>
      </div>

      {/* CLOSE */}

      <button
        type="button"
        onClick={() =>
          onDismiss(toast.id)
        }
        aria-label="Dismiss notification"
        className={[
          "shrink-0 rounded-md p-1",
          "transition",
          styles.icon,
          "hover:bg-black/5",
        ].join(" ")}
      >
        <X size={15} />
      </button>
    </div>
  );
}

export function ToastProvider({
  children,
}) {
  const [toasts, setToasts] =
    useState([]);

  /*
   * ========================================================
   * SHOW TOAST
   * ========================================================
   */

  const showToast = useCallback(
    ({
      type = "info",
      title,
      message,
      duration = TOAST_DURATION,
    }) => {
      const id =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      setToasts((current) => [
        ...current,
        {
          id,
          type,
          title,
          message,
        },
      ]);

      /*
       * Automatically remove toast.
       */

      if (duration > 0) {
        window.setTimeout(() => {
          setToasts((current) =>
            current.filter(
              (toast) =>
                toast.id !== id
            )
          );
        }, duration);
      }

      return id;
    },
    []
  );

  /*
   * ========================================================
   * DISMISS ONE TOAST
   * ========================================================
   */

  const dismissToast = useCallback(
    (id) => {
      setToasts((current) =>
        current.filter(
          (toast) =>
            toast.id !== id
        )
      );
    },
    []
  );

  /*
   * ========================================================
   * DISMISS ALL
   * ========================================================
   */

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  /*
   * ========================================================
   * CONVENIENCE METHODS
   *
   * These are optional, but useful later.
   * ========================================================
   */

  const success = useCallback(
    (message, options = {}) => {
      return showToast({
        ...options,
        type: "success",
        message,
      });
    },
    [showToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return showToast({
        ...options,
        type: "error",
        message,
      });
    },
    [showToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return showToast({
        ...options,
        type: "warning",
        message,
      });
    },
    [showToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return showToast({
        ...options,
        type: "info",
        message,
      });
    },
    [showToast]
  );

  /*
   * ========================================================
   * CONTEXT VALUE
   * ========================================================
   */

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
      dismissAll,

      success,
      error,
      warning,
      info,
    }),
    [
      showToast,
      dismissToast,
      dismissAll,
      success,
      error,
      warning,
      info,
    ]
  );

  return (
    <ToastContext.Provider
      value={value}
    >
      {children}

      {/* ====================================================
          TOAST CONTAINER
      ==================================================== */}

      <div
        className={[
          "pointer-events-none fixed",
          "right-4 top-4 z-[200]",
          "flex w-[calc(100%-2rem)]",
          "max-w-sm flex-col gap-2",
          "sm:right-5 sm:top-5",
        ].join(" ")}
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/*
 * ==========================================================
 * USE TOAST
 * ==========================================================
 */

export function useToast() {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
}

export default ToastProvider;