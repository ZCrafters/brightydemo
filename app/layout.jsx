import "./globals.css";
import { CartProvider } from "../components/cart/CartProvider";
import { WishlistProvider } from "../components/wishlist/Wishlist";
import { ToastProvider } from "../components/ui/Toast";
import { CursorFollow } from "../components/motion/CursorFollow";
import { ScrollTop } from "../components/ui/ScrollTop";
import { CartDrawer } from "../components/cart/CartDrawer";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

export const metadata = {
  title: "Brighty — Cerah & Glowing, Body Care Indonesia",
  description: "Body serum, body wash, scrub & underarm care pencerah kulit. Cerah merata, glowing tiap hari. Demo — harga mengikuti official store."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@500;700;800&display=swap"
        />
        <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <a href="#main" className="skip-link">Lewati ke konten</a>
            <Header />
            <CartDrawer />
            <main className="wrap" id="main">{children}</main>
            <Footer />
            <ScrollTop />
            <CursorFollow />
          </WishlistProvider>
        </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
