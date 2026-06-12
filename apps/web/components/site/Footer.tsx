import Link from "next/link";

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
    ],
  },
];

const SOCIAL = ["f", "ig", "in", "yt"];

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
            India&rsquo;s most luxurious day spa chain. World-class spa &amp; skincare, delivered as an affordable luxury in
            your neighbourhood.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {SOCIAL.map((s) => (
              <span
                key={s}
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #4A3F2E",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                }}
              >
                {s}
              </span>
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
            <a href="tel:+919959995370" style={{ color: "#B6A88E" }}>99599 95370</a>
            <a href="mailto:care@isaspa.in" style={{ color: "#B6A88E" }}>care@isaspa.in</a>
            <span>
              Corporate Office, Begumpet,
              <br />
              Hyderabad, Telangana
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
        <span>&copy; 2026 Isa Spa Pvt. Ltd. &middot; An Impel Ventures brand. All rights reserved.</span>
        <span style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy-policy" style={{ color: "#8E8169" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "#8E8169" }}>Terms &amp; Conditions</Link>
          <Link href="/refund-policy" style={{ color: "#8E8169" }}>Refund Policy</Link>
        </span>
      </div>
    </footer>
  );
}
