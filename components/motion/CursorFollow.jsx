"use client";
import { useEffect, useRef, useState } from "react";

// Kursor kustom (reimplementasi manual efek ala Cursify MCP): dot raspberry +
// halo lembut mengikuti pointer dengan lerp (requestAnimationFrame).
// Halo membesar di elemen interaktif (a/button/input), mode "drag" untuk
// area carousel ([data-cursor="drag"]). Otomatis nonaktif di perangkat touch
// (pointer: coarse) dan prefers-reduced-motion.
export function CursorFollow() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = -100, my = -100, rx = -100, ry = -100;
    let seen = false, raf = 0, mode = "";

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        rx = mx;
        ry = my;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-cursor="drag"]')) mode = "drag";
      else if (t.closest("a, button, input, select, textarea, summary, label, [data-cursor]")) mode = "link";
      else mode = "";
    };
    const onOut = () => {
      seen = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      if (ring.dataset.mode !== mode) ring.dataset.mode = mode;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onOut);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true">
      <span ref={dotRef} className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring" data-mode="" />
    </div>
  );
}
