export const metadata = { title: "Tentang Brighty", robots: { index: false } };

export default function About() {
  return (
    <>
      <p className="kicker" style={{ marginTop: 20 }}>TENTANG KAMI</p>
      <h1>Kulit cerah merata adalah perawatan, bukan kamuflase.</h1>
      <p style={{ maxWidth: "65ch" }}>
        Brighty adalah brand body care asal Indonesia yang fokus pada perawatan pencerah kulit:
        underarm care, body serum, body wash, scrub &amp; masker. Katalog demo ini mengambil data
        produk real dari official store Brighty di Tokopedia, Shopee, Lazada &amp; TikTok.
      </p>
      <h2>Cara belanja</h2>
      <p style={{ maxWidth: "65ch" }}>Pilih produk di halaman detail → tambah ke keranjang → checkout 3 langkah (simulasi QRIS). Order final dilakukan di official store masing-masing marketplace.</p>
      <h2>Retur &amp; penukaran</h2>
      <p style={{ maxWidth: "65ch" }}>Ikuti kebijakan retur official store tempat kamu membeli. Untuk bantuan, hubungi via Instagram @brighty.id.</p>
      <p><a className="btn" href="/catalog">Mulai Belanja →</a></p>
    </>
  );
}
