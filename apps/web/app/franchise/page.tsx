import Link from "next/link";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import type { FranchiseInput } from "@isa/shared";
import { pageMeta, faqJsonLd, jsonLdScript } from "@/lib/seo";
import { franchiseWhy, franchiseSteps } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "Own an ISA Spa Franchise — A Proven Wellness Business",
  description:
    "Partner with India's most loved luxury day spa. Proven unit economics across 50+ spas, end-to-end training, turnkey fit-out and marketing support.",
  path: "/franchise",
});

const fields: LeadField<FranchiseInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name", full: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
  { name: "city", label: "Preferred city", required: true, placeholder: "Where you'd open" },
  {
    name: "investmentCapacity",
    label: "Investment capacity",
    type: "select",
    placeholder: "Select a range",
    full: true,
    options: [
      { value: "₹25–40L", label: "₹25–40 Lakh" },
      { value: "₹40–60L", label: "₹40–60 Lakh" },
      { value: "₹60L+", label: "₹60 Lakh+" },
    ],
  },
];

const faqs = [
  {
    q: "How much does an ISA Spa franchise cost?",
    a: "Investment typically ranges from ₹25–60 Lakh depending on city, location and format. Share your details and we'll send a detailed franchise kit with unit economics within 24 hours.",
  },
  {
    q: "Do I need prior spa or wellness experience?",
    a: "No. We provide end-to-end training across treatments, customer service, business management and marketing for you and your team.",
  },
  {
    q: "What support does ISA provide after opening?",
    a: "Ongoing operational support, national brand campaigns, local marketing, reputation management and supply chain — so you can focus on growth.",
  },
];

const stats: [string, string][] = [
  ["50+", "Spas & Growing"],
  ["12-18", "Month ROI Window"],
  ["20+", "Yrs Franchising DNA"],
];

export default function FranchisePage() {
  return (
    <main>
      {/* ===== HERO (dark) + form card ===== */}
      <section style={{ background: "linear-gradient(90deg, #2C2219 0%, #36291C 100%)", padding: "78px 40px" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 56,
            alignItems: "center",
          }}
          className="isa-grid-split"
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D9B25E", marginBottom: 20 }}>
              Franchise Opportunity
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                fontSize: 58,
                lineHeight: 1.13,
                color: "#F4ECDB",
                margin: "0 0 22px",
              }}
            >
              Own a piece of India&rsquo;s most loved spa brand
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "#D8CCB6", maxWidth: 480, margin: "0 0 32px" }}>
              Partner with a trusted, profitable brand. We hand you a proven model, end-to-end training and full
              marketing support.
            </p>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {stats.map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "#D9B25E", lineHeight: 1 }}>
                    {n}
                  </div>
                  <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B6A88E", marginTop: 6 }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#FBF7EF", borderRadius: 20, padding: "32px 30px", boxShadow: "0 30px 70px rgba(0,0,0,0.3)" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#3F3B30", marginBottom: 4 }}>
              Request the franchise kit
            </div>
            <p style={{ fontSize: 13.5, color: "#8A8478", margin: "0 0 20px" }}>
              Get the investment deck &amp; unit economics in 24 hours.
            </p>
            <LeadForm
              type="FRANCHISE"
              fields={fields}
              sourcePage="/franchise"
              submitLabel="Send me the deck"
              successTitle="Kit on its way."
              successMessage="Our franchise team will share unit economics and next steps within 24 hours."
            />
            <p style={{ fontSize: 11.5, color: "#A39C8C", textAlign: "center", margin: "12px 0 0" }}>
              Or WhatsApp us directly: 99599 95370
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHY PARTNER ===== */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "84px 40px 50px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 12 }}>
            Why Partner With Isa
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 44, color: "#3F3B30", margin: 0 }}>
            A business model designed for profitability
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="isa-grid-3">
          {franchiseWhy.map((w) => (
            <div key={w.num} style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, padding: "32px 28px" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "#F3EAD7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  color: "#B0863A",
                  marginBottom: 18,
                }}
              >
                {w.num}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 23, color: "#3F3B30", margin: "0 0 10px" }}>
                {w.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, margin: 0, color: "#8A8478" }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== JOURNEY ===== */}
      <section style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3", borderBottom: "1px solid #EFE6D3" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "78px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 46 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "#A8823A", marginBottom: 12 }}>
              Your Journey
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 44, color: "#3F3B30", margin: 0 }}>
              From enquiry to grand opening
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="isa-grid-4">
            {franchiseSteps.map((s) => (
              <div key={s.step} style={{ position: "relative", paddingTop: 18 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 50, color: "#E2CB97", lineHeight: 1, marginBottom: 10 }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 21, color: "#3F3B30", margin: "0 0 8px" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: "#8A8478" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA (cream) ===== */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "84px 40px" }}>
        <div
          style={{
            background: "linear-gradient(120deg, #F3EAD7 0%, #EADBBE 100%)",
            borderRadius: 22,
            padding: "54px 50px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 40, color: "#3F3B30", margin: "0 0 12px" }}>
            Ready to join the Isa family?
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", maxWidth: 520, margin: "0 auto 26px" }}>
            Be part of one of India&rsquo;s most luxurious spa chains and our exciting growth story. Talk to our franchise
            team today.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="tel:+919959995370"
              style={{ fontSize: 15, color: "#fff", background: "#2A211A", padding: "15px 30px", borderRadius: 999 }}
            >
              Call 99599 95370
            </a>
            <a
              href="mailto:franchise@isaspa.in"
              style={{ fontSize: 15, color: "#56564A", border: "1px solid #C8A765", padding: "15px 30px", borderRadius: 999 }}
            >
              Email franchise team
            </a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }} />
    </main>
  );
}
