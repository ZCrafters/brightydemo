import clsx from "clsx";
import { Spotlight, SpotLightItem } from "../ui/Spotlight";

// Kartu promo horizontal (pola "Special Promo" Sociolla, tema Glow Brighty).
// Server component — hanya link + salinan generik yang sesuai disclaimer demo
// (tidak mengarang angka diskon; harga promo nyata ada di katalog/PDP).

const PROMOS = [
  { t: "Harga promo official store", d: "Listing resmi marketplace, s&k berlaku", href: "/catalog?sort=price-asc", tone: "pink" },
  { t: "Bundle rutinitas hemat", d: "Paket lengkap sekali belanja", href: "/catalog?cat=bundle", tone: "blue" },
  { t: "Terlaris minggu ini", d: "Paling banyak diborong glowing squad", href: "/catalog?sort=sold", tone: "sand" },
  { t: "New launch glow", d: "Rutinitas body care terbaru Brighty", href: "/catalog?sort=new", tone: "pink" },
  { t: "Underarm care andalan", d: "Ketiak cerah, halus & wangi", href: "/catalog?cat=underarm-care", tone: "blue" },
  { t: "Info & promo rutin", d: "Daftar newsletter di halaman bawah", href: "/about", tone: "sand" },
];

const TONE = {
  pink: "bg-glow-1/70 text-primary",
  blue: "bg-glow-2/70 text-primary",
  sand: "bg-glow-3/70 text-primary",
};

const TICKET = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
    <path d="M13 6v2M13 11v2M13 16v2" />
  </svg>
);

export function PromoCards() {
  return (
    <section aria-label="Promo singkat" className="mt-2">
      <div className="section-head">
        <h2>Special Promo</h2>
        <a href="/catalog">Lihat semua →</a>
      </div>
      <Spotlight className="flex gap-3 overflow-x-auto pb-1 scroll-center [scrollbar-width:none]" ProximitySpotlight CursorFlowGradient>
        {PROMOS.map((p) => (
          <SpotLightItem key={p.t} className="min-w-[170px] max-w-[210px] shrink-0 border-0">
            <a
              href={p.href}
              className={clsx(
                "flex h-20 w-full flex-col justify-between rounded-card p-3",
                "text-xs font-semibold leading-snug transition-transform duration-200 hover:-translate-y-0.5",
                TONE[p.tone]
              )}
            >
              <span className="opacity-80">{TICKET}</span>
              <span>
                <span className="block line-clamp-1 font-display">{p.t}</span>
                <span className="block line-clamp-2 font-normal opacity-80">{p.d}</span>
              </span>
            </a>
          </SpotLightItem>
        ))}
      </Spotlight>
    </section>
  );
}
