"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTilt } from "../motion/TiltCard";
import { CloseIcon } from "../ui/Icons";

export function Gallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const mainRef = useRef(null);
  // Tilt 3D halus pada frame utama (kompatibel dengan zoom img di dalamnya).
  useTilt(mainRef, { max: 3 });
  const list = images?.length ? images.slice(0, 5) : [];

  const open = useCallback((i) => { setActive(i); setLightbox(true); }, []);
  const close = useCallback(() => setLightbox(false), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setActive((i) => Math.min(list.length - 1, i + 1));
      if (e.key === "ArrowLeft") setActive((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox, close, list.length]);

  if (!list.length) return <div className="zoom-wrap" aria-label={`Foto ${name} segera hadir`} />;

  const zoom = (e) => {
    const el = mainRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.querySelector("img").style.transformOrigin =
      `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  };
  const reset = () => {
    mainRef.current?.querySelector("img")?.style.removeProperty("transform-origin");
  };

  return (
    <>
      <div className="gallery">
        <div className="thumbs" role="tablist" aria-label="Thumbnail produk">
          {list.map((src, i) => (
            <button key={i} className="thumb" role="tab" aria-selected={i === active}
              aria-current={i === active} aria-label={`Lihat foto ${i + 1}`} onClick={() => setActive(i)}>
              <Image src={src} alt="" width={76} height={100} loading="lazy" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="zoom-wrap"
          ref={mainRef}
          onMouseMove={zoom}
          onMouseLeave={reset}
          onClick={() => open(active)}
          aria-label={`Perbesar foto ${name}`}
          style={{ border: 0, padding: 0, cursor: "zoom-in" }}
        >
          <Image key={list[active]} src={list[active]} alt={name} fill
            sizes="(max-width: 768px) 100vw, 50vw" priority={active === 0} />
        </button>
      </div>
      {lightbox && (
        <div className="lightbox" role="dialog" aria-label={`Galeri foto ${name}`} aria-modal="true" onClick={close}>
          <button className="icon-btn lightbox-close" aria-label="Tutup galeri" onClick={close}>
            <CloseIcon size={24} />
          </button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <Image key={list[active]} src={list[active]} alt={name} width={800} height={1066} sizes="(max-width: 1024px) 90vw, 800px" />
            <p className="lightbox-count">{active + 1} / {list.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
