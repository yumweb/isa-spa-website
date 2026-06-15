import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Explore",
    links: [
      ["/about-us", "About Us"],
      ["/services", "Services"],
      ["/spa-locator", "Spa Locator"],
      ["/isa-spa-membership", "Membership"],
      ["/isa-spa-gift-cards", "Gift Cards"],
    ],
  },
  {
    title: "Partner",
    links: [
      ["/franchise", "Franchise"],
      ["/hotel-partnership", "Hotel Partnership"],
      ["/careers", "Careers"],
      ["/blog", "Blog"],
      ["/contact-us", "Contact Us"],
    ],
  },
];

const SOCIAL: { label: string; href: string; path: string }[] = [
  {
    label: "Facebook",
    href: SITE_CONTACT.social.facebook,
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.849-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    label: "Instagram",
    href: SITE_CONTACT.social.instagram,
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  {
    label: "LinkedIn",
    href: SITE_CONTACT.social.linkedin,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z",
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#221A12", color: "#C7B89D" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "70px 40px 36px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 40,
        }}
        className="isa-footer-grid"
      >
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: "#E8D9B8", letterSpacing: "0.04em" }}>
            isa <span style={{ color: "#D9B25E" }}>spa</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: "16px 0 22px", maxWidth: 280, color: "#B6A88E" }}>
            India&rsquo;s most luxurious spa chain. World-class spa &amp; skincare, delivered as an affordable luxury in
            your neighbourhood.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #4A3F2E",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C7B89D",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#D9B25E", marginBottom: 18 }}>
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              {col.links.map(([href, label]) => (
                <Link key={href} href={href} style={{ color: "#C7B89D" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#D9B25E", marginBottom: 18 }}>
            Get in Touch
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "#B6A88E" }}>
            <a href={SITE_CONTACT.phoneHref} style={{ color: "#B6A88E" }}>{SITE_CONTACT.phone}</a>
            <a href={`mailto:${SITE_CONTACT.email}`} style={{ color: "#B6A88E" }}>{SITE_CONTACT.email}</a>
            <span>
              {SITE_CONTACT.address.lines.map((l, i) => (
                <span key={i}>
                  {l}
                  {i < SITE_CONTACT.address.lines.length - 1 && <br />}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #3A3022",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "22px 40px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 12.5,
          color: "#8E8169",
        }}
      >
        <span>&copy; 2026 Isa Spa Pvt. Ltd. All rights reserved.</span>
        <span style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy-policy" style={{ color: "#8E8169" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "#8E8169" }}>Terms &amp; Conditions</Link>
          <Link href="/refund-policy" style={{ color: "#8E8169" }}>Refund Policy</Link>
        </span>
      </div>
    </footer>
  );
}
