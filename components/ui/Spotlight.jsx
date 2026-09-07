"use client";

import { cn } from "../../lib/cn";
import { createContext, useContext, useEffect, useState } from "react";

// Port dari ui-layouts `spotlight-cards` (MIT) ke JSX + tema terang Glow Brighty:
// - Gradien putih (invisible di background krem) → glow raspberry lembut
// - Semua overlay pointer-events-none agar link/konten di dalam tetap bisa diklik
// - Listener mousemove global hanya dipasang bila efek proximity/hover aktif
//   dan pointer presisi (hemat di touch)

const SpotLightContext = createContext(undefined);

export const useSpotlight = () => {
  const context = useContext(SpotLightContext);
  if (!context) {
    throw new Error("useSpotlight must be used within a SpotlightProvider");
  }
  return context;
};

export const Spotlight = ({
  children,
  className,
  ProximitySpotlight = true,
  HoverFocusSpotlight = false,
  CursorFlowGradient = true,
}) => {
  return (
    <SpotLightContext.Provider
      value={{ ProximitySpotlight, HoverFocusSpotlight, CursorFlowGradient }}
    >
      <div className={cn("group relative z-10 rounded-md", className)}>{children}</div>
    </SpotLightContext.Provider>
  );
};

export function SpotLightItem({ children, className }) {
  const { HoverFocusSpotlight, ProximitySpotlight, CursorFlowGradient } = useSpotlight();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 });
  const [overlayColor, setOverlayColor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ProximitySpotlight && !HoverFocusSpotlight) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [ProximitySpotlight, HoverFocusSpotlight]);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    setOverlayColor({ x: clientX - left, y: clientY - top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => CursorFlowGradient && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-card border border-line bg-surface",
        className
      )}
    >
      {CursorFlowGradient && isHovered && (
        <div
          className="pointer-events-none absolute z-10 h-full w-full rounded-card opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(250px circle at ${overlayColor.x}px ${overlayColor.y}px, rgba(230, 0, 126, 0.16), transparent 80%)`,
          }}
        />
      )}
      {HoverFocusSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-card bg-fixed opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(230, 0, 126, 0.2) 0%, transparent 22%, transparent) fixed`,
          }}
        />
      )}
      {ProximitySpotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-card bg-fixed"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(230, 0, 126, 0.12) 0%, transparent 22%, transparent) fixed`,
          }}
        />
      )}
      {children}
    </div>
  );
}
