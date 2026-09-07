"use client";
import { useState } from "react";
import { allCategories, categoryLabel } from "../../lib/products";
import {
  MenuIcon, CloseIcon, SearchIcon, GridIcon, TagIcon,
  StarIcon, ClockIcon, GiftIcon, HeartIcon, ShieldIcon, ChevronRightIcon,
} from "../ui/Icons";

// Drawer navigasi mobile ala menu ikon Sociolla (tanpa pilihan negara/login,
// disesuaikan katalog Brighty): search ringkas + grup Kategori, Promo &
// Kupon, Best Seller & Terbaru, Wishlist & Bantuan.
const QUICK = [
  { href: "/catalog?sale=1", icon: TagIcon, title: "Promo", desc: "Diskon & harga spesial" },
  { href: "/catalog?sort=sold", icon: StarIcon, title: "Best Seller", desc: "Paling laris diburu" },
  { href: "/catalog?sort=new", icon: ClockIcon, title: "Terbaru", desc: "Produk baru datang" },
  { href: "/#kupon", icon: GiftIcon, title: "Kupon", desc: "Voucher buat kamu" },
];

const HELP = [
  { href: "/wishlist", icon: HeartIcon, title: "Wishlist", desc: "Produk yang kamu simpan" },
  { href: "/faq", icon: ShieldIcon, title: "FAQ & Bantuan", desc: "Jawaban cepat" },
  { href: "/about", icon: GridIcon, title: "Tentang Brighty", desc: "Kenalan dengan brand" },
];

function MenuRow({ href, icon: Ic, title, desc, onClose }) {
  return (
    <a href={href} className="mnav-item" onClick={onClose}>
      <span className="mnav-ic" aria-hidden="true"><Ic size={20} /></span>
      <span className="mnav-tx">
        <strong>{title}</strong>
        <small>{desc}</small>
      </span>
      <ChevronRightIcon size={18} aria-hidden="true" />
    </a>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
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

          <form className="mnav-search" action="/catalog" method="get" role="search" onSubmit={close}>
            <SearchIcon size={18} aria-hidden="true" />
            <input type="search" name="q" placeholder="Cari: serum, scrub, toner…" aria-label="Cari produk" autoComplete="off" />
          </form>

          <p className="mnav-label">Belanja</p>
          <MenuRow href="/catalog" icon={GridIcon} title="Semua Produk" desc="Jelajahi seluruh katalog" onClose={close} />
          {QUICK.map((m) => <MenuRow key={m.title} {...m} onClose={close} />)}

          <p className="mnav-label">Kategori</p>
          {allCategories.map((c) => (
            <a key={c} href={`/catalog?cat=${c}`} className="mnav-cat" onClick={close}>
              {categoryLabel(c)}
              <ChevronRightIcon size={16} aria-hidden="true" />
            </a>
          ))}

          <p className="mnav-label">Akun &amp; Bantuan</p>
          {HELP.map((m) => <MenuRow key={m.title} {...m} onClose={close} />)}

          <div className="mobile-panel-footer">
            <p className="mnav-stores">
              Official store:{" "}
              <a href="https://www.tokopedia.com/brightyindonesia" target="_blank" rel="noreferrer" onClick={close}>Tokopedia</a>
              {" · "}
              <a href="https://shopee.co.id/brighty_id" target="_blank" rel="noreferrer" onClick={close}>Shopee</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
