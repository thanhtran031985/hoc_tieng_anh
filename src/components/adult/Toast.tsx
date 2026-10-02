"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import styles from "./adult.module.css";

const SHOW_MS = 2800;

const ToastContext = createContext<(text: string) => void>(() => {});

/** Hiện thông báo nhỏ ở đáy màn (role="status"). Dùng trong `ToastProvider`. */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setText(message);
    setVisible(true);
    timer.current = window.setTimeout(() => setVisible(false), SHOW_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(() => show, [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={cn(styles.toast, visible && styles.toastOn)} role="status" aria-live="polite">
        {text && (
          <>
            <Icon name="okcircle" size={18} />
            <span>{text}</span>
          </>
        )}
      </div>
    </ToastContext.Provider>
  );
}
