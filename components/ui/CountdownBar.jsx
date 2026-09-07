"use client";
import { useEffect, useState } from "react";

// Countdown promo (pola Sociolla): hitung mundur ke akhir hari (23:59:59),
// reset harian — aman untuk static export tanpa backend. Dipakai sebagai baris
// countdown global di dalam header. SSR merender placeholder "--:--:--" supaya
// tidak ada hydration mismatch.
function useDayEnd() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      setLeft(Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

const pad = (n) => String(n).padStart(2, "0");

export function CountdownBar() {
  const left = useDayEnd();
  const h = left == null ? "--" : pad(Math.floor(left / 3600));
  const m = left == null ? "--" : pad(Math.floor((left % 3600) / 60));
  const s = left == null ? "--" : pad(left % 60);
  return (
    <section aria-label="Promo berakhir pada akhir hari ini" className="countdown-bar">
      <p className="countdown-copy">
        <strong>Promo official store</strong> <span>berakhir dalam · s&amp;k berlaku</span>
      </p>
      <p className="countdown-clock" aria-hidden="true">
        <span>{h}</span>:<span>{m}</span>:<span>{s}</span>
      </p>
      <a className="countdown-cta" href="/catalog?sort=price-asc">Belanja Promo</a>
    </section>
  );
}
