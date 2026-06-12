import { LeadForm, type LeadField } from "@/components/LeadForm";
import type { HotelInput } from "@isa/shared";
import { pageMeta, faqJsonLd, jsonLdScript } from "@/lib/seo";
import { hotelModels, hotelBenefits } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "Hotel Spa Partnership — ISA Spa for Your Property",
  description:
    "Add a turnkey luxury spa to your hotel. Fully managed, revenue-share or licensed models — ISA handles design, staffing and operations while you earn a new revenue stream.",
  path: "/hotel-partnership",
});

const fields: LeadField<HotelInput>[] = [
  { name: "name", label: "Your name", required: true, placeholder: "Contact person", full: true },
  { name: "hotelName", label: "Hotel / group name", required: true, placeholder: "Property or group", full: true },
  { name: "city", label: "City", required: true, placeholder: "Property location" },
  { name: "rooms", label: "Number of rooms", type: "number", placeholder: "e.g. 120" },
  { name: "email", label: "Work email", type: "email", required: true, placeholder: "you@hotel.com", full: true },
];

const faqs = [
  {
    q: "Who operates the spa — us or ISA?",
    a: "Your choice. In our Fully Managed model ISA designs, staffs and operates the spa end-to-end. We also offer revenue-share and licensed models depending on how involved you want to be.",
  },
  {
    q: "How much space do we need?",
    a: "We work with a range of footprints, from compact treatment suites to full wellness floors. Share your property details and we'll propose a fit.",
  },
];

export default function HotelPartnershipPage() {
  return (
    <main>
      {/* ===== HERO (striped + ivory overlay) ===== */}
      <section
        style={{
          position: "relative",
          padding: "78px 40px",
          background: "repeating-linear-gradient(135deg, #EBE0CB, #EBE0CB 16px, #E4D7BD 16px, #E4D7BD 32px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(247,241,230,0.96) 0%, rgba(247,241,230,0.86) 50%, rgba(247,241,230,0.6) 100%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#A8823A", marginBottom: 20 }}>
              Hotel Partnerships
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                fontSize: 58,
                lineHeight: 1.13,
                color: "#3F3B30",
                margin: "0 0 22px",
              }}
            >
              A turnkey luxury spa for your property
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "#6E6F62", maxWidth: 500, margin: "0 0 32px" }}>
              Elevate your guest experience and unlock a new revenue stream. Isa Spa designs, staffs and operates a
              world-class spa inside your hotel &mdash; end to end.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="#start"
                style={{ fontSize: 15, color: "#fff", background: "#2A211A", padding: "15px 30px", borderRadius: 999 }}
              >
                Discuss a collaboration
              </a>
              <a
                href="#models"
                style={{ fontSize: 15, color: "#56564A", border: "1px solid #C8B58C", padding: "15px 30px", borderRadius: 999 }}
              >
                See partnership models
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MODELS ===== */}
      <section id="models" style={{ maxWidth: 1240, margin: "0 auto", padding: "84px 40px 50px" }}>
        <div style={{ textAlign: "center", marginBottom: 46 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 12 }}>
            Flexible Models
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 44, color: "#3F3B30", margin: 0 }}>
            Three ways we can work together
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="isa-grid-3">
          {hotelModels.map((m) => (
            <div key={m.tag} style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: "34px 30px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0863A", marginBottom: 14 }}>
                {m.tag}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 26, color: "#3F3B30", margin: "0 0 12px" }}>
                {m.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, margin: "0 0 18px", color: "#8A8478" }}>{m.desc}</p>
              <div style={{ fontSize: 13, color: "#6E6F62", borderTop: "1px solid #F0E8D7", paddingTop: 14 }}>{m.best}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHAT YOU GAIN + form ===== */}
      <section style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3" }}>
        <div
          id="start"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "80px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
          className="isa-grid-split"
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 14 }}>
              What You Gain
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                fontSize: 42,
                lineHeight: 1.12,
                color: "#3F3B30",
                margin: "0 0 26px",
              }}
            >
              A signature amenity, none of the operational burden
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {hotelBenefits.map((b) => (
                <div key={b.title} style={{ display: "flex", gap: 16, alignItems: "start" }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#C19A4B",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                    }}
                  >
                    &#10003;
                  </span>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 600, color: "#3F3B30", marginBottom: 2 }}>
                      {b.title}
                    </div>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: "#8A8478" }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid #ECE2CF",
              borderRadius: 20,
              padding: "34px 32px",
              boxShadow: "0 24px 56px rgba(80,60,30,0.1)",
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#3F3B30", marginBottom: 4 }}>
              Start the conversation
            </div>
            <p style={{ fontSize: 13.5, color: "#8A8478", margin: "0 0 20px" }}>
              Our partnerships team will reach out within two business days.
            </p>
            <LeadForm
              type="HOTEL"
              fields={fields}
              sourcePage="/hotel-partnership"
              submitLabel="Request a proposal"
              successTitle="Thank you."
              successMessage="Our partnerships team will reach out with a tailored proposal soon."
            />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }} />
    </main>
  );
}
