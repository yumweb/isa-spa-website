import Link from "next/link";
import Image from "next/image";
import { getServices, getTestimonials } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Photo, Eyebrow } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "ISA Spa — India's Luxury Day Spa",
  description:
    "Isa means God. India's luxury day spa with 50+ locations — signature therapies, facials, foot spa and body rituals. Inspired by the Divine. Created for You.",
  path: "/",
});

export const revalidate = 300;

const PILL_DARK: React.CSSProperties = {
  fontSize: 15,
  color: "#fff",
  background: "#2A211A",
  padding: "16px 30px",
  borderRadius: 999,
};
const PILL_OUTLINE: React.CSSProperties = {
  fontSize: 15,
  color: "#56564A",
  background: "transparent",
  border: "1px solid #C8B58C",
  padding: "16px 30px",
  borderRadius: 999,
};
const eyebrowWrap: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, marginBottom: 26 };

const PATHS = [
  { href: "/spa-locator", glyph: "❋", title: "Visit a Spa", body: "Book a rejuvenating therapy, facial or foot ritual at one of 50+ Isa Spas across India.", cta: "Find your spa →" },
  { href: "/franchise", glyph: "▲", title: "Own a Franchise", body: "Partner with a trusted, profitable brand. Full training, site selection and marketing support.", cta: "Explore the opportunity →" },
  { href: "/hotel-partnership", glyph: "◇", title: "Partner Your Hotel", body: "Add a turnkey luxury spa to your property. We design, staff and operate it end-to-end.", cta: "Collaborate with us →" },
];

const STATS = [
  ["50+", "Spas Across India"],
  ["12", "Cities & Growing"],
  ["1M+", "Therapies Delivered"],
  ["4.8★", "Average Guest Rating"],
];

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([
    getServices().catch(() => []),
    getTestimonials().catch(() => []),
  ]);
  // Flatten one representative service per category for the "Signature Rituals" row.
  const featured = services.slice(0, 4).map((c) => ({
    title: c.name.replace(/ (Treatments|Treatment)$/i, ""),
    desc: c.tagline ?? c.services[0]?.description ?? "",
    from: c.services[0]?.price ? `From ${c.services[0].price}` : "",
    photo: c.slug.replace(/-/g, " "),
    slug: c.slug,
  }));

  return (
    <>
      {/* ===== HERO A · Editorial (approved) ===== */}
      <section
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "72px 40px 64px",
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 56,
          alignItems: "center",
        }}
        className="isa-hero"
      >
        <div>
          <div style={eyebrowWrap}>
            <span style={{ height: 1, width: 38, background: "#C19A4B" }} />
            <span style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A" }}>
              India&rsquo;s Luxury Day Spa &middot; 50+ Locations
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: 60,
              lineHeight: 1.12,
              color: "#3F3B30",
              margin: "0 0 26px",
              letterSpacing: "-0.01em",
            }}
          >
            Inspired by the Divine.
            <br />
            <em style={{ fontStyle: "italic", color: "#B0863A" }}>Created for You.</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#6E6F62", maxWidth: 480, margin: "0 0 36px" }}>
            Isa means God &mdash; and that essence flows through every therapy. Mindful rituals to help you reconnect with
            your inner divinity, in a sanctuary close to home.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/appointment" style={PILL_DARK}>Book Your Ritual</Link>
            <Link href="/spa-locator" style={PILL_OUTLINE}>Find a Spa Near You</Link>
          </div>
          <div style={{ display: "flex", gap: 36, marginTop: 48 }}>
            {[["50+", "Spas Nationwide"], ["12", "Cities"], ["4.8★", "Guest Rating"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: "#B0863A", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9A9486", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <Photo
            label="hero photo · serene treatment ritual"
            style={{ borderRadius: "200px 200px 18px 18px", aspectRatio: "4/5", boxShadow: "0 30px 70px rgba(80,60,30,0.16)" }}
          />
          <div
            style={{
              position: "absolute",
              top: -22,
              left: -22,
              width: 88,
              height: 88,
              background: "rgba(255,255,255,0.85)",
              border: "1px solid #E7DCC8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "isaFloat 5s ease-in-out infinite",
            }}
          >
            <Image src="/isa-logo.png" alt="" width={58} height={58} style={{ width: 58, height: "auto", opacity: 0.9 }} />
          </div>
        </div>
      </section>

      {/* ===== THREE AUDIENCE PATHS ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "86px 40px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>Three Ways to Experience Isa</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 46, color: "#3F3B30", margin: 0 }}>
            However you arrive, you belong here
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="isa-grid-3">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: "36px 30px", display: "block" }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#F3EAD7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 22,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  color: "#B0863A",
                }}
              >
                {p.glyph}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 27, color: "#3F3B30", margin: "0 0 10px" }}>{p.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: "0 0 18px" }}>{p.body}</p>
              <span style={{ fontSize: 14, color: "#B0863A", fontWeight: 600 }}>{p.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section
        style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 64, alignItems: "center" }}
        className="isa-grid-split"
      >
        <Photo label="photo · therapist hands, oil & flowers" style={{ height: 460, borderRadius: 18, boxShadow: "0 24px 56px rgba(80,60,30,0.14)" }} />
        <div>
          <Eyebrow>Our Philosophy</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 48, lineHeight: 1.12, color: "#3F3B30", margin: "0 0 22px" }}>
            Self-love is the most sacred act
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, margin: "0 0 18px" }}>
            Each session is a celebration of your unique energy &mdash; treated with reverence and grace. We believe that
            when you are nurtured in body and spirit, you awaken your highest self.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, margin: "0 0 30px" }}>
            From rejuvenating facials to deeply healing therapies, every touch is a gesture of love toward yourself. Let
            Isa Spa be your sacred space.
          </p>
          <Link href="/about-us" style={{ fontSize: 15, color: "#56564A", borderBottom: "1px solid #C19A4B", paddingBottom: 4 }}>
            Read our story &rarr;
          </Link>
        </div>
      </section>

      {/* ===== SIGNATURE SERVICES ===== */}
      <section style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3", borderBottom: "1px solid #EFE6D3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "84px 40px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Eyebrow>Signature Rituals</Eyebrow>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 46, color: "#3F3B30", margin: 0 }}>Therapies for body &amp; soul</h2>
            </div>
            <Link href="/services" style={{ fontSize: 14, color: "#fff", background: "#C19A4B", padding: "13px 24px", borderRadius: 999 }}>View all services</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="isa-grid-4">
            {featured.map((svc) => (
              <Link key={svc.slug} href={`/services/${svc.slug}`} style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, overflow: "hidden", display: "block" }}>
                <Photo label={svc.photo} style={{ height: 168 }} />
                <div style={{ padding: "22px 20px 24px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 22, color: "#3F3B30", margin: "0 0 8px" }}>{svc.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "0 0 14px" }}>{svc.desc}</p>
                  {svc.from && <span style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0863A" }}>{svc.from}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAND (espresso) ===== */}
      <section style={{ background: "linear-gradient(180deg, #2C2219 0%, #221A12 100%)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "70px 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30, textAlign: "center" }} className="isa-grid-4">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, color: "#D9B25E", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C7B89D", marginTop: 10 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== MEMBERSHIP TEASER ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "84px 40px" }}>
        <div
          style={{ background: "linear-gradient(120deg, #F3EAD7 0%, #EADBBE 100%)", borderRadius: 22, padding: 56, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40, alignItems: "center" }}
          className="isa-grid-split"
        >
          <div>
            <Eyebrow>Isa Spa Membership</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 44, lineHeight: 1.1, color: "#3F3B30", margin: "0 0 16px" }}>
              Make wellness a ritual, not a treat
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", maxWidth: 460, margin: "0 0 28px" }}>
              Members enjoy priority booking, preferential pricing across all 50+ spas, and exclusive seasonal rituals.
              The most loving thing you can gift yourself this year.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/isa-spa-membership" style={{ fontSize: 15, color: "#fff", background: "#2A211A", padding: "15px 28px", borderRadius: 999 }}>View membership</Link>
              <Link href="/isa-spa-gift-cards" style={{ fontSize: 15, color: "#56564A", border: "1px solid #C8A765", padding: "15px 28px", borderRadius: 999 }}>Gift a card</Link>
            </div>
          </div>
          <div style={{ height: 220, borderRadius: 16, background: "#fff", border: "1px solid #E7D6B4", boxShadow: "0 20px 44px rgba(120,90,30,0.16)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Image src="/isa-logo.png" alt="" width={80} height={36} style={{ height: 36, width: "auto" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B0863A" }}>Gold</span>
            </div>
            <div>
              <div style={{ fontFamily: "ui-monospace, monospace", letterSpacing: "0.2em", color: "#8A8478", fontSize: 15 }}>•••• •••• ••••</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#3F3B30", marginTop: 8 }}>Member Since 2018</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "84px 40px", textAlign: "center" }}>
            <Eyebrow>Voices of Calm</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 46, color: "#3F3B30", margin: "0 0 50px" }}>
              Real stories. Real transformation.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, textAlign: "left" }} className="isa-grid-3">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, padding: "32px 28px" }}>
                  <div style={{ color: "#D9B25E", fontSize: 18, letterSpacing: "2px", marginBottom: 14 }}>★★★★★</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.45, color: "#4A4738", fontStyle: "italic", margin: "0 0 22px" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9486" }}>
                    {t.authorName}
                    {t.city ? ` · ${t.city}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LOCATOR CTA ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "90px 40px" }}>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 48, color: "#3F3B30", margin: "0 0 14px" }}>
            There&rsquo;s an Isa Spa near you
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, margin: "0 0 28px" }}>
            From Hyderabad and Bengaluru to Varanasi and Dharamshala &mdash; find your nearest sanctuary and book in
            minutes.
          </p>
          <Link href="/spa-locator" style={{ display: "inline-block", fontSize: 15, color: "#fff", background: "#C19A4B", padding: "16px 34px", borderRadius: 999 }}>
            Open the Spa Locator
          </Link>
        </div>
      </section>
    </>
  );
}
