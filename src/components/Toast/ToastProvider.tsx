'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Toast.module.scss';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  isExiting: boolean;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, durationMs?: number) => void;
}

// Matches the exit animation in Toast.module.scss
const EXIT_ANIMATION_MS = 220;

const ICONS: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export interface ToastProviderProps {
  /** The accessible name of each toast's close button. */
  dismissLabel: string;
  children: React.ReactNode;
}

export function ToastProvider({ dismissLabel, children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextToastIdRef = useRef(0);
  const autoDismissTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  // Clear pending auto-dismiss timers if the provider unmounts
  useEffect(() => {
    const autoDismissTimers = autoDismissTimersRef.current;
    return () => autoDismissTimers.forEach((timer) => clearTimeout(timer));
  }, []);

  const dismiss = useCallback((id: string) => {
    clearTimeout(autoDismissTimersRef.current.get(id));
    autoDismissTimersRef.current.delete(id);

    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)),
    );
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'success', durationMs = 4000) => {
      const id = String(nextToastIdRef.current++);
      setToasts((current) => [
        ...current,
        { id, message, variant, duration: durationMs, isExiting: false },
      ]);
      autoDismissTimersRef.current.set(
        id,
        setTimeout(() => dismiss(id), durationMs),
      );
    },
    [dismiss],
  );

  const contextValue = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} dismissLabel={dismissLabel} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
  dismissLabel,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  dismissLabel: string;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.variant]} ${toast.isExiting ? styles.exiting : ''}`}
        >
          <button
            type="button"
            className={styles.close}
            onClick={() => onDismiss(toast.id)}
            aria-label={dismissLabel}
          >
            ×
          </button>
          <div className={styles.toastInner}>
            <div className={styles.toastBody}>
              <span className={styles.icon}>{ICONS[toast.variant]}</span>
              <span className={styles.message}>{toast.message}</span>
            </div>
            <div className={styles.progress} style={{ animationDuration: `${toast.duration}ms` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
