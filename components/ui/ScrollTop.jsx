"use client";
import { useEffect, useState } from "react";

// Tombol floating kembali ke atas (pola Sociolla/demo): muncul setelah scroll
// 400px. scroll-behavior smooth menghormati prefers-reduced-motion via CSS.
export function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Kembali ke atas"
      className={`scroll-top${show ? " show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 14l6-6 6 6" />
      </svg>
    </button>
  );
}
