"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

// Toast ringan (pola demo referensi): fixed bottom-center, auto-hide 2.4 detik,
// satu pesan terakhir menang. Region aria-live selalu ter-mount agar screen
// reader mengumumkan pesan saat muncul.
export function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const timer = useRef(null);

  const toast = useCallback((text) => {
    if (typeof text !== "string" || !text) return;
    clearTimeout(timer.current);
    setMsg(text);
    timer.current = setTimeout(() => setMsg(""), 2400);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-open={msg ? "true" : "false"}>
        <span className="toast-text">{msg}</span>
      </div>
    </ToastCtx.Provider>
  );
}
