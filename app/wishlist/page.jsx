import WishlistClient from "./WishlistClient";
import { Breadcrumb } from "../../components/ui/Chrome";

export const metadata = { title: "Wishlist — Brighty" };

export default function WishlistPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 style={{ margin: "4px 0 0" }}>Wishlist</h1>
      <WishlistClient />
    </>
  );
}
