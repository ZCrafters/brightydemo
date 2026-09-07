// Data kupon/voucher demo — dipakai bersama CouponStrip (home) & VoucherPopup.
// Kode & nominal adalah ilustrasi; voucher asli hanya di official store.
export const COUPONS = [
  { code: "GLOW15", title: "Voucher 15%", desc: "Min. belanja Rp150rb di official store", tone: "pink" },
  { code: "ONGKIRGLOW", title: "Gratis Ongkir", desc: "Klaim di official store Brighty", tone: "blue" },
  { code: "RITUAL10", title: "Bundle Hemat 10%", desc: "Untuk paket rutinitas lengkap", tone: "sand" },
  { code: "HALOGLOW", title: "Potongan 20K", desc: "Khusus pengguna baru", tone: "pink" },
];

export const COUPON_TONES = {
  pink: "bg-glow-1/70 text-primary",
  blue: "bg-glow-2/70 text-primary",
  sand: "bg-glow-3/70 text-primary",
};
