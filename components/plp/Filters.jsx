import { allCategories, allColors, allSizes, categoryLabel, maxPrice, minPrice, rupiah } from "../../lib/products";

export function FilterFields({ current }) {
  const { cat = "", size = "", color = "", max = "", q = "", sale = "", sort = "featured" } = current;
  return (
    <>
      <fieldset>
        <legend>Tipe produk</legend>
        {allCategories.map((c) => (
          <label className="check" key={c}>
            <input type="radio" name="cat" value={c} defaultChecked={cat === c} /> {categoryLabel(c)}
          </label>
        ))}
        <label className="check"><input type="radio" name="cat" value="" defaultChecked={!cat} /> Semua</label>
      </fieldset>
      {allSizes.length > 0 && (
        <fieldset>
          <legend>Size</legend>
          {allSizes.map((s) => (
            <label className="check" key={s}>
              <input type="checkbox" name="size" value={s} defaultChecked={size.split(",").includes(s)} /> {s}
            </label>
          ))}
        </fieldset>
      )}
      {allColors.length > 0 && (
        <fieldset>
          <legend>Warna</legend>
          {allColors.slice(0, 10).map((c) => (
            <label className="check" key={c}>
              <input type="checkbox" name="color" value={c} defaultChecked={color.split(",").includes(c)} /> {c}
            </label>
          ))}
        </fieldset>
      )}
      <fieldset>
        <legend>Promo</legend>
        <label className="check">
          <input type="checkbox" name="sale" value="1" defaultChecked={sale === "1"} /> Harga promo saja
        </label>
      </fieldset>
      <fieldset>
        <legend>Harga maksimal</legend>
        <input type="range" className="price-range" name="max" min={minPrice} max={maxPrice} step={10000}
          defaultValue={max || maxPrice} aria-label="Harga maksimal" />
        <span style={{ fontSize: 13, color: "var(--color-muted)" }}>s.d. {rupiah(Number(max) || maxPrice)}</span>
      </fieldset>
      {q && <input type="hidden" name="q" value={q} />}
      <input type="hidden" name="sort" value={sort} />
    </>
  );
}

export function FilterSidebar({ current }) {
  return (
    <aside className="filter-box desktop-only" aria-label="Filter produk">
      <form action="/catalog" method="get">
        <div className="filter-head">
          <h3>Filter</h3>
          <button className="btn filter-apply" type="submit">Terapkan</button>
        </div>
        <FilterFields current={current} />
      </form>
    </aside>
  );
}

export function SortDropdown({ current, base = "/catalog" }) {
  const opts = [["featured", "Pilihan"], ["sold", "Terlaris"], ["price-asc", "Termurah"], ["price-desc", "Termahal"], ["name-asc", "A–Z"], ["name-desc", "Z–A"], ["new", "Terbaru"]];
  const qs = new URLSearchParams();
  ["q", "cat", "size", "color", "max", "sale"].forEach((k) => current[k] && qs.set(k, current[k]));
  const otherQs = [...qs.entries()].map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  const href = (sort) => `${base}?${otherQs ? otherQs + "&" : ""}sort=${sort}`;
  const label = opts.find(([v]) => v === (current.sort || "featured"))?.[1] || "Pilihan";
  return (
    <details className="sort-dd">
      <summary aria-label="Urutkan produk">Urut: {label} ▾</summary>
      <div className="sort-menu" role="menu">
        {opts.map(([v, l]) => <a key={v} href={href(v)}>{l}</a>)}
      </div>
    </details>
  );
}
