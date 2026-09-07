"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, CloseIcon, ClockIcon } from "../ui/Icons";
import { products } from "../../lib/products";

const KEY = "brighty-search-v1";
const HINTS = ["body serum", "glowing underarm", "scrub", "toner", "bar soap", "kojic", "slime mask"];

export function ExpandableSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();
  const suggestions = q.trim().length >= 1 ? products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    try { setRecent(JSON.parse(localStorage.getItem(KEY) || "[]").slice(0, 6)); } catch { /* abaikan */ }
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const submit = (term) => {
    const t = (term ?? q).trim();
    if (!t) return;
    try {
      const cur = JSON.parse(localStorage.getItem(KEY) || "[]");
      const next = [t, ...cur.filter((x) => x !== t)].slice(0, 6);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch { /* abaikan */ }
    setOpen(false);
    setQ("");
    router.push(`/catalog?q=${encodeURIComponent(t)}`);
  };

  return (
    <>
      <button className="icon-btn" aria-label="Cari produk" aria-expanded={open} onClick={() => setOpen(true)}>
        <SearchIcon />
      </button>
      <div className={`search-overlay${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="search-scrim" onClick={() => setOpen(false)} />
        <div className="search-panel" role="dialog" aria-label="Pencarian produk">
          <div className="search-panel-inner">
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); submit(); }} role="search">
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari: serum, scrub, toner…"
                aria-label="Cari produk"
                autoComplete="off"
                tabIndex={open ? 0 : -1}
              />
              <button className="icon-btn" type="button" aria-label="Tutup pencarian" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </form>
            {q.trim().length >= 1 && suggestions.length > 0 && (
              <div className="search-suggest" role="listbox" aria-label="Saran produk">
                {suggestions.map((s) => (
                  <button key={s.slug} type="button" className="suggest-row" onClick={() => submit(s.name)}>
                    <SearchIcon size={16} />
                    <span>{s.name}</span>
                    <small>{s.category}</small>
                  </button>
                ))}
              </div>
            )}
            {q.trim().length === 0 && (
              <>
                {recent.length > 0 && (
                  <div className="search-recent" aria-label="Pencarian terakhir">
                    <p className="search-panel-label">Pencarian terakhir</p>
                    <div className="pills">
                      {recent.map((t) => (
                        <button key={t} className="pill" type="button" onClick={() => submit(t)}>
                          <ClockIcon size={14} /> {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pills" aria-label="Pencarian populer">
                  <p className="search-panel-label" style={{ width: "100%" }}>Pencarian populer</p>
                  {HINTS.map((t) => (
                    <button key={t} className="pill" type="button" onClick={() => submit(t)}>{t}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
