// SVG icon only — tanpa emoji. Stroke konsisten 1.8.
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const Icon = ({ d, size = 22, label, children, circle }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} role="img" aria-label={label}>
    {circle}
    {d && <path d={d} />}
    {children}
  </svg>
);

export const SearchIcon = (p) => <Icon label="Cari" {...p} d="M11 4a7 7 0 1 0 4.9 12L21 21l-1.4 1.4-5.1-5.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />;
export const UserIcon = (p) => <Icon label="Akun" {...p} d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" />;
export const CartIcon = (p) => <Icon label="Keranjang" {...p} d="M4 5h2l2.4 11h10.4l2-8H7.2" />;
export const MenuIcon = (p) => <Icon label="Menu" {...p} d="M4 7h16M4 12h16M4 17h16" />;
export const CloseIcon = (p) => <Icon label="Tutup" {...p} d="M6 6l12 12M18 6L6 18" />;
export const TrashIcon = (p) => <Icon label="Hapus" {...p} d="M5 7h14M10 5h4M8 7l1 13h6l1-13M10 11v6M14 11v6" />;
export const CheckIcon = (p) => <Icon label="Dipilih" {...p} d="M5 12.5l4.5 4.5L19 7.5" />;
export const ChevronDownIcon = (p) => <Icon label="Buka" {...p} d="M6 9l6 6 6-6" />;
export const ChevronLeftIcon = (p) => <Icon label="Sebelumnya" {...p} d="M14 6l-6 6 6 6" />;
export const ChevronRightIcon = (p) => <Icon label="Berikutnya" {...p} d="M10 6l6 6-6 6" />;
export const FilterIcon = (p) => <Icon label="Filter" {...p} d="M4 6h16M7 12h10M10 18h4" />;
export const TruckIcon = (p) => <Icon label="Pengiriman" {...p} d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a1.6 1.6 0 1 0 0 .01M17 18a1.6 1.6 0 1 0 0 .01" />;
export const ShieldIcon = (p) => <Icon label="Aman" {...p} d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />;
export const ClockIcon = (p) => <Icon label="Waktu" {...p}><circle cx={12} cy={12} r={8} /><path d="M12 7v5l3 2" /></Icon>;
export const GridIcon = (p) => <Icon label="Grid" {...p} d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />;
export const ListIcon = (p) => <Icon label="Daftar" {...p} d="M4 6h16M4 12h16M4 18h16" />;
export const ShareIcon = (p) => <Icon label="Bagikan" {...p} d="M16 6l-4-4-4 4M12 2v14M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />;
export const HeartIcon = (p) => <Icon label="Wishlist" {...p} d="M12 20.5S4 15.5 4 9.8A4.3 4.3 0 0 1 8.3 5.5c1.6 0 2.9.9 3.7 2.2a4.6 4.6 0 0 1 3.7-2.2A4.3 4.3 0 0 1 20 9.8c0 5.7-8 10.7-8 10.7z" />;

export const StarIcon = ({ size = 14, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z" />
  </svg>
);

export const QrisMark = () => (
  <svg width={34} height={22} viewBox="0 0 34 22" role="img" aria-label="QRIS">
    <rect x={1} y={1} width={32} height={20} rx={3} fill="none" stroke="currentColor" strokeWidth={1.6} />
    <text x={17} y={15} textAnchor="middle" fontSize={9} fontWeight={800} fill="currentColor" stroke="none" fontFamily="inherit">QRIS</text>
  </svg>
);
