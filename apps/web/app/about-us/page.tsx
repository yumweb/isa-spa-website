import { pageMeta } from "@/lib/seo";
import { Photo } from "@/components/site/primitives";
import { aboutValues, aboutPresence } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "About ISA Spa — Self-care as a Sacred Ritual",
  description:
    "Isa means God. At ISA Spa, we treat self-care as a sacred ritual — bespoke therapies and trained therapists making luxury wellness an everyday, affordable indulgence across India.",
  path: "/about-us",
});

export default function AboutPage() {
  return (
    <main>
      {/* ===== HERO (radial, centered logo) ===== */}
      <section
        style={{
          background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)",
          padding: "78px 40px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#A8823A", marginBottom: 16 }}>
          Our Story
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontSize: 60,
            lineHeight: 1.13,
            color: "#3F3B30",
            margin: "0 auto 18px",
            maxWidth: 760,
          }}
        >
          Inspired by the Divine.
          <br />
          Created for You.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.75, color: "#6E6F62", maxWidth: 620, margin: "0 auto" }}>
          Isa means God &mdash; and that essence flows through everything we do. We are India&rsquo;s most luxurious day
          spa chain, devoted to a world-class spa &amp; skincare experience that feels nothing short of heavenly.
        </p>
      </section>

      {/* ===== A SACRED SPACE (split) ===== */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "80px 40px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 60,
          alignItems: "center",
        }}
        className="isa-grid-split"
      >
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 16 }}>
            The Meaning Behind Isa
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: 44,
              lineHeight: 1.12,
              color: "#3F3B30",
              margin: "0 0 22px",
            }}
          >
            A sacred space for the everyday
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, margin: "0 0 18px" }}>
            Our therapies are mindful rituals that help you reconnect with your inner divinity, reminding you that
            self-love is the most sacred act. Each session is a celebration of your unique energy, treated with reverence
            and grace.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, margin: 0 }}>
            With highly trained professionals and bespoke therapies, every visit becomes an unforgettable journey toward
            complete well-being &mdash; calmness, serenity and soul-invigorating aromas, delivered close to home.
          </p>
        </div>
        <Photo
          label="photo · tranquil spa interior"
          style={{ height: 440, borderRadius: 18, boxShadow: "0 24px 56px rgba(80,60,30,0.14)" }}
        />
      </section>


      {/* ===== VALUES ===== */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "84px 40px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 12 }}>
            What We Stand For
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 44, color: "#3F3B30", margin: 0 }}>
            Our values
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="isa-grid-3">
          {aboutValues.map((v) => (
            <div
              key={v.title}
              style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, padding: "34px 30px", textAlign: "center" }}
            >
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: "#B0863A", marginBottom: 10 }}>&#10047;</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 25, color: "#3F3B30", margin: "0 0 10px" }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, margin: 0, color: "#8A8478" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRESENCE ===== */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 40px 40px" }}>
        <div
          style={{
            background: "#FBF7EF",
            border: "1px solid #ECE2CF",
            borderRadius: 22,
            padding: "48px 44px",
            display: "grid",
            gridTemplateColumns: "0.8fr 1.2fr",
            gap: 44,
            alignItems: "center",
          }}
          className="isa-grid-split"
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 14 }}>
              Our Presence
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                fontSize: 38,
                lineHeight: 1.12,
                color: "#3F3B30",
                margin: "0 0 14px",
              }}
            >
              50+ spas across India&rsquo;s most vibrant cities
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#8A8478", margin: 0 }}>
              And growing every month. Wherever life takes you, an Isa Spa sanctuary is never far.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignContent: "center" }}>
            {aboutPresence.map((city) => (
              <span
                key={city}
                style={{
                  fontSize: 15,
                  color: "#56564A",
                  background: "#fff",
                  border: "1px solid #E0D2B6",
                  padding: "11px 20px",
                  borderRadius: 999,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
