import Link from "next/link";

/** Accessible breadcrumb nav. Pair with `breadcrumbJsonLd` for SEO. */
export function Breadcrumbs({ crumbs }: { crumbs: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-mute">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-gold">
                  {c.name}
                </Link>
              )}
              {!last && <span className="text-sand">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
