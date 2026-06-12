import Link from "next/link";

const COLS = [
  { title: "Explore", links: [["/about-us", "About Us"], ["/services", "Services"], ["/gallery", "Gallery"], ["/blog", "Blog"]] },
  { title: "Business", links: [["/franchise", "Franchise"], ["/hotel-partnership", "Hotel Partnership"], ["/careers", "Careers"]] },
  { title: "Visit", links: [["/spa-locator", "Spa Locator"], ["/isa-spa-membership", "Membership"], ["/isa-spa-gift-cards", "Gift Cards"], ["/contact-us", "Contact"]] },
  { title: "Legal", links: [["/privacy-policy", "Privacy Policy"], ["/refund-policy", "Refund & Returns"], ["/terms", "Terms & Conditions"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sand/40 bg-espresso text-cream/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <div className="font-serif text-2xl text-cream">
            isa <span className="text-gold">spa</span>
          </div>
          <p className="mt-3 text-sm">India&apos;s Luxury Day Spa</p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-serif text-cream">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs">
        © {new Date().getFullYear()} ISA Spa. All rights reserved.
      </div>
    </footer>
  );
}
