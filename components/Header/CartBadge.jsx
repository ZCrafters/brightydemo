"use client";
import { useCart } from "../cart/CartProvider";
import { CartIcon } from "../ui/Icons";

export function CartBadge() {
  const { count, setOpen } = useCart();
  return (
    <button className="icon-btn" aria-label={`Keranjang, ${count} item`} onClick={() => setOpen(true)}>
      <CartIcon />
      {count > 0 && <span className="cart-badge">{count > 99 ? "99+" : count}</span>}
    </button>
  );
}
