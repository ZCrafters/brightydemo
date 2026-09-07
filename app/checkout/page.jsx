import { CheckoutFlow } from "../../components/checkout/CheckoutFlow";

export const metadata = { title: "Checkout — Brighty", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <p style={{ fontSize: 12, color: "var(--color-muted)" }}>Keranjang / <strong>Checkout</strong></p>
      <h1 style={{ margin: "4px 0 0" }}>Checkout</h1>
      <CheckoutFlow />
    </>
  );
}
