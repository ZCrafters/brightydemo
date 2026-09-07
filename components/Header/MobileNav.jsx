"use client";
import { useState } from "react";
import { allCategories, categoryLabel } from "../../lib/products";
import { MenuIcon, CloseIcon, SearchIcon } from "../ui/Icons";

const TABS = [
  { id: "all", label: "Semua Produk" },
  { id: "category", label: "Kategori" },
  { id: "bestseller", label: "Best Seller" },
  { id: "search", label: "Cari" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const close = () => setOpen(false);

  return (
    <>
      <button className="icon-btn hamburger" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <MenuIcon />
      </button>
      <div className={`mobile-nav${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="search-scrim" onClick={close} />
        <div className="mobile-panel" role="dialog" aria-label="Menu navigasi">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>brighty.</strong>
            <button className="icon-btn" aria-label="Tutup menu" onClick={close}>
              <CloseIcon />
            </button>
          </div>

          <div className="mobile-tabs" role="tablist" aria-label="Navigasi produk">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                className="mobile-tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "all" && (
            <div className="mobile-tab-panel" role="tabpanel">
              <p>Jelajahi seluruh katalog Brighty dalam satu halaman.</p>
              <a className="btn" href="/catalog" onClick={close}>Lihat Semua Produk →</a>
            </div>
          )}

          {tab === "category" && (
            <div className="mobile-tab-panel" role="tabpanel">
              <p>Pilih kategori untuk memfilter katalog.</p>
              <form className="mobile-tab-form" action="/catalog" method="get" onSubmit={close}>
                <select className="mobile-select" name="cat" aria-label="Pilih kategori" defaultValue="">
                  <option value="">Semua kategori</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>{categoryLabel(c)}</option>
                  ))}
                </select>
                <button className="btn" type="submit">Terapkan Filter</button>
              </form>
            </div>
          )}

          {tab === "bestseller" && (
            <div className="mobile-tab-panel" role="tabpanel">
              <p>Produk paling laris dan paling dicari.</p>
              <a className="btn" href="/catalog?sort=sold" onClick={close}>Lihat Best Seller →</a>
            </div>
          )}

          {tab === "search" && (
            <div className="mobile-tab-panel" role="tabpanel">
              <p>Cari produk berdasarkan nama atau kategori.</p>
              <form className="mobile-tab-form" action="/catalog" method="get" onSubmit={close}>
                <div className="mobile-search-row">
                  <input type="search" name="q" placeholder="Cari: serum, scrub, toner…" aria-label="Cari produk" autoComplete="off" />
                  <button className="icon-btn" type="submit" aria-label="Cari">
                    <SearchIcon size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mobile-panel-footer">
            <a href="/about" onClick={close}>Tentang Brighty</a>
          </div>
        </div>
      </div>
    </>
  );
}
