import { Rating } from "../ui/ProductCard";
import { StarIcon } from "../ui/Icons";

const DUMMY_REVIEWS = [
  { name: "Ayu K.", initial: "A", color: "#9a5a64", days: 12, title: "Bahannya adem, jatuh rapi", body: "Sudah order 2 warna, cutting highwaist-nya bikin kaki lebih panjang. Packaging rapi, kirim cepat.", verified: true },
  { name: "Dinda M.", initial: "D", color: "#3f6212", days: 27, title: "Sesuai foto, size pas", body: "Saya ambil M (tinggi 160 cm), pas banget. Warna Ivory persis seperti di gambar.", verified: true },
  { name: "Rani P.", initial: "R", color: "#22304a", days: 41, title: "Favorit buat ke kantor", body: "Sudah jadi langganan. Dicuci 5x masih tidak melar. Worth it untuk harga segini.", verified: false },
];

export function ReviewSection({ product }) {
  return (
    <section aria-label="Ulasan pembeli" style={{ marginTop: 32 }}>
      <div className="section-head">
        <h2>Ulasan Pembeli</h2>
        <span className="meta">{product.reviews} ulasan</span>
      </div>
      <div className="review-summary">
        <div>
          <span className="review-big">{product.rating.toFixed(1)}</span>
          <span className="stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} size={18} filled={i <= Math.round(product.rating)} />)}
          </span>
        </div>
        <Rating value={product.rating} reviews={product.reviews} size={14} />
      </div>
      <div className="review-list">
        {DUMMY_REVIEWS.map((r, i) => (
          <article className="review-item" key={i}>
            <span className="review-avatar" style={{ background: r.color }}>{r.initial}</span>
            <div className="review-body">
              <div className="review-meta">
                <strong>{r.name}</strong>
                {r.verified && <span className="badge-verified">Pembelian terverifikasi</span>}
                <span className="meta">{r.days} hari lalu</span>
              </div>
              <div className="stars" aria-label={`Rating ${5 - (i % 2)} dari 5`}>
                {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} size={13} filled={s <= 5 - (i % 2)} />)}
              </div>
              <strong className="review-title">{r.title}</strong>
              <p>{r.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
