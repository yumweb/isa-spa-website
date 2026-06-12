import Link from "next/link";
import { getServices } from "@/lib/api";
import { pageMeta, offerCatalogJsonLd, serviceJsonLd, jsonLdScript } from "@/lib/seo";
import { ServiceCategoryCard } from "@/components/site/ServiceCategoryCard";

export const metadata = pageMeta({
  title: "Spa Services & Therapies — ISA Spa",
  description:
    "Explore ISA Spa's signature therapies, foot spa & pedicure, skin & body polishing and facials. Bespoke luxury treatments by trained therapists across India.",
  path: "/services",
});

export const revalidate = 600;

export default async function ServicesPage() {
  const categories = await getServices().catch(() => []);

  return (
    <main>
      {/* ===== PAGE HERO (radial) ===== */}
      <section
        style={{
          background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)",
          padding: "74px 40px 64px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#A8823A", marginBottom: 16 }}>
          Our Treatments
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
          Therapies crafted for body &amp; soul
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "#6E6F62", maxWidth: 560, margin: "0 auto" }}>
          Every ritual is personalised to your needs by trained therapists &mdash; world-class spa &amp; skincare, made an
          affordable luxury.
        </p>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "28px 40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "#8A8478" }}>
            Our treatment menu is being updated. Please check back shortly.
          </p>
        ) : (
          categories.map((cat) => <ServiceCategoryCard key={cat.id} cat={cat} />)
        )}
      </section>

      {/* ===== CTA BAND (espresso) ===== */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 90px", textAlign: "center" }}>
        <div
          style={{
            background: "linear-gradient(120deg, #2C2219 0%, #221A12 100%)",
            borderRadius: 22,
            padding: "56px 40px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: 40,
              color: "#F4ECDB",
              margin: "0 0 12px",
            }}
          >
            Ready to treat yourself?
          </h2>
          <p style={{ fontSize: 16, color: "#C7B89D", maxWidth: 480, margin: "0 auto 28px" }}>
            Pricing may vary by location. Book your ritual at your nearest Isa Spa.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/appointment"
              style={{ fontSize: 15, color: "#2A211A", background: "#D9B25E", padding: "15px 30px", borderRadius: 999 }}
            >
              Book Appointment
            </Link>
            <Link
              href="/spa-locator"
              style={{
                fontSize: 15,
                color: "#F4ECDB",
                border: "1px solid rgba(217,194,144,0.5)",
                padding: "15px 30px",
                borderRadius: 999,
              }}
            >
              Find a spa near you
            </Link>
          </div>
        </div>
      </section>

      {/* ===== JSON-LD ===== */}
      {categories.map((cat) => (
        <script
          key={cat.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(offerCatalogJsonLd(cat)) }}
        />
      ))}
      {categories.flatMap((cat) =>
        cat.services.map((s) => (
          <script
            key={`${cat.id}-${s.id}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(serviceJsonLd({ ...s, category: cat.name })) }}
          />
        )),
      )}
    </main>
  );
}
