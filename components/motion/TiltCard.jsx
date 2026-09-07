"use client";
import { useEffect, useRef } from "react";

// Tilt 3D ringan (reimplementasi manual interaksi ala 21st MCP): elemen miring
// mengikuti posisi pointer (perspective + rotateX/rotateY), reset saat keluar.
// Transform-only, batched rAF; nonaktif di touch & prefers-reduced-motion.

// Versi hook: tempel ke ref elemen yang sudah ada (mis. zoom-wrap galeri PDP)
// tanpa mengubah struktur DOM.
export function useTilt(ref, { max = 4, scale = 1.0 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(700px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)` +
          (scale !== 1 ? ` scale(${scale})` : "");
      });
    };
    const clear = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", clear);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", clear);
      clear();
    };
  }, [ref, max, scale]);
}

// Versi wrapper untuk konten dekoratif (mis. product shots hero).
export function TiltCard({ children, className = "", max = 6, scale = 1.02, ...rest }) {
  const ref = useRef(null);
  useTilt(ref, { max, scale });
  return (
    <div ref={ref} className={`tilt-card ${className}`} {...rest}>
      {children}
    </div>
  );
}
