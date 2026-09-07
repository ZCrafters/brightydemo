"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

// Port dari ui-layouts `cursor-follow-text` (MIT) ke JSX: teks raksasa dengan
// gradien mengikuti posisi kursor (via CSS vars --text-mouse-x/y, lihat
// `.animated-text` di globals.css). Nonaktif di perangkat touch.
export function AnimatedText({ text, className }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("animated-text", className)}
      style={{ "--text-mouse-x": `${pos.x}px`, "--text-mouse-y": `${pos.y}px` }}
    >
      {text}
    </div>
  );
}
