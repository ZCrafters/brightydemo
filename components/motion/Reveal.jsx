"use client";
import { useEffect, useRef, useState } from "react";

// SSR-safe reveal: content is ALWAYS visible in HTML (no opacity 0 on initial render).
// Enhancement animation only plays if JS loads and motion is allowed.
// If JS fails, hydration delays, or reduced-motion → content stays fully visible.
export function Reveal({ children, className = "", staggerChildren = false, delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setEnhanced(true);
  }, []);

  useEffect(() => {
    if (!enhanced || !ref.current) return;
    let cancelled = false;
    import("animejs").then(({ animate, stagger }) => {
      if (cancelled || !ref.current) return;
      const targets = staggerChildren ? Array.from(ref.current.children) : [ref.current];
      animate(targets, {
        opacity: [0.6, 1],
        translateY: [16, 0],
        duration: 450,
        ease: "out(3)",
        delay: staggerChildren ? stagger(50) : delay,
      });
    }).catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, [enhanced, staggerChildren, delay ]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
