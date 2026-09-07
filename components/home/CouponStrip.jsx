"use client";
import clsx from "clsx";
import { useToast } from "../ui/Toast";

// Strip kupon swipeable (pola voucher Sociolla): kartu voucher dengan kode
// yang bisa disalin. Kode & nominal adalah ilustrasi demo — voucher asli
// hanya tersedia di official store (dinyatakan eksplisit di footnote).
const COUPONS = [
  { code: "GLOW15", title: "Voucher 15%", desc: "Min. belanja Rp150rb di official store", tone: "pink" },
  { code: "ONGKIRGLOW", title: "Gratis Ongkir", desc: "Klaim di official store Brighty", tone: "blue" },
  { code: "RITUAL10", title: "Bundle Hemat 10%", desc: "Untuk paket rutinitas lengkap", tone: "sand" },
  { code: "HALOGLOW", title: "Potongan 20K", desc: "Khusus pengguna baru", tone: "pink" },
];

const TONE = {
  pink: "bg-glow-1/70 text-primary",
  blue: "bg-glow-2/70 text-primary",
  sand: "bg-glow-3/70 text-primary",
};

const TICKET = (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
    <path d="M13 6v2M13 11v2M13 16v2" />
  </svg>
);

export function CouponStrip() {
  const toast = useToast();
  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast(`Kode tersalin: ${code}`);
    } catch {
      toast(`Kode: ${code}`);
    }
  };
  return (
    <section aria-label="Kupon & voucher" className="mt-2">
      <div className="section-head">
        <div>
          <h2>Kupon Buat Kamu</h2>
          <p className="meta" style={{ margin: "2px 0 0" }}>Geser untuk lihat semua · ilustrasi, voucher asli di official store.</p>
        </div>
        <a href="/catalog?sale=1">Lihat promo →</a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scroll-center [scrollbar-width:none]">
        {COUPONS.map((c) => (
          <div
            key={c.code}
            className="flex min-w-[270px] max-w-[300px] items-stretch overflow-hidden rounded-card border border-line bg-surface"
          >
            <div className={clsx("flex flex-1 flex-col justify-center gap-1 p-3", TONE[c.tone])}>
              <span className="opacity-80">{TICKET}</span>
              <strong className="font-display text-[15px] leading-tight">{c.title}</strong>
              <span className="text-xs font-normal leading-snug opacity-80">{c.desc}</span>
            </div>
            <div className="flex w-[104px] shrink-0 flex-col items-center justify-center gap-1.5 border-l-2 border-dashed border-line bg-surface p-2.5">
              <code className="rounded bg-bg px-1.5 py-0.5 text-[11px] font-extrabold tracking-wide text-primary">
                {c.code}
              </code>
              <button
                type="button"
                onClick={() => copy(c.code)}
                className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white transition hover:bg-accent-dark"
              >
                Salin
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
