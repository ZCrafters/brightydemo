"use client";
import { useState } from "react";
import { ShareIcon, CheckIcon } from "../ui/Icons";

export function ShareButtons({ slug, name }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/produk/${slug}/` : `/produk/${slug}/`;
  const text = `${name} — Brighty`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* abaikan */ }
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: name, text, url }); } catch { /* abaikan */ }
    } else {
      copy();
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  return (
    <div className="share-row" aria-label="Bagikan produk">
      <button type="button" className="share-btn" onClick={copy} aria-label="Salin tautan produk">
        {copied ? <CheckIcon size={14} /> : <ShareIcon size={14} />}
        {copied ? "Tersalin" : "Salin tautan"}
      </button>
      <a className="share-btn" href={wa} target="_blank" rel="noreferrer" aria-label="Bagikan via WhatsApp">WhatsApp</a>
      <button type="button" className="share-btn" onClick={shareNative} aria-label="Bagikan produk">Bagikan</button>
    </div>
  );
}
