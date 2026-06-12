import Link from "next/link";

const NAV = [
  { href: "/about-us", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/isa-spa-membership", label: "Membership" },
  { href: "/spa-locator", label: "Spa Locator" },
  { href: "/franchise", label: "Franchise" },
  { href: "/hotel-partnership", label: "Hotel Partnership" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand/40 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide text-ink">
          isa <span className="text-gold">spa</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-ink-soft hover:text-gold">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/appointment"
          className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-white hover:bg-gold-deep"
        >
          Book an Appointment
        </Link>
      </div>
    </header>
  );
}
