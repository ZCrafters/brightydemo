import { GridIcon, TagIcon, StarIcon, ClockIcon, GiftIcon } from "../ui/Icons";

// Baris shortcut ikon ala homepage mobile Sociolla — tampil HANYA di mobile
// (class .mshort disembunyikan ≥768px; desktop sudah punya pill kategori).
const SHORTCUTS = [
  { href: "/catalog", icon: GridIcon, label: "Kategori" },
  { href: "/catalog?sale=1", icon: TagIcon, label: "Promo" },
  { href: "/catalog?sort=sold", icon: StarIcon, label: "Best Seller" },
  { href: "/catalog?sort=new", icon: ClockIcon, label: "Terbaru" },
  { href: "/#kupon", icon: GiftIcon, label: "Kupon" },
];

export function MobileShortcuts() {
  return (
    <nav className="mshort" aria-label="Akses cepat">
      {SHORTCUTS.map((s) => (
        <a key={s.label} href={s.href} className="mshort-item">
          <span className="mshort-ic" aria-hidden="true"><s.icon size={22} /></span>
          <span>{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
