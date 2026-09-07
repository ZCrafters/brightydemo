export function Breadcrumb({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map((t, i) => (
        <span key={t.label}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {t.href && i < trail.length - 1 ? <a href={t.href}>{t.label}</a> : <strong>{t.label}</strong>}
        </span>
      ))}
    </nav>
  );
}
