import Link from "next/link";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type MembershipInput } from "@isa/shared";
import { pageMeta } from "@/lib/seo";
import { membershipPlans } from "@/lib/marketing";
import { Hero } from "@/components/Hero";
import { Eyebrow } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "ISA Spa Membership — Wellness, Rewarded",
  description:
    "Join ISA Spa membership for year-round savings, priority booking and complimentary signature therapies. Glow, Serene and Divine tiers for every self-care ritual.",
  path: "/isa-spa-membership",
});

const fields: LeadField<MembershipInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "city", label: "City", placeholder: "Your city" },
  {
    name: "plan",
    label: "Preferred plan",
    type: "select",
    placeholder: "Choose a tier",
    options: membershipPlans.map((p) => ({ value: p.name, label: `${p.name} — ${p.price}` })),
  },
];

export default function MembershipPage() {
  return (
    <>
      <Hero
        eyebrow="Membership"
        title="Wellness, rewarded all year."
        lead="Make self-care a habit, not a treat. ISA membership unlocks year-round savings, priority booking and complimentary signature rituals."
      />

      {/* ===== MEMBERSHIP TIERS ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 40px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>Choose your ritual</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 46, color: "#3F3B30", margin: 0 }}>
            Three tiers, one promise of calm
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }} className="isa-grid-3">
          {membershipPlans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: "#fff",
                border: plan.featured ? "1.5px solid #C19A4B" : "1px solid #ECE2CF",
                borderRadius: 18,
                padding: "36px 30px",
                boxShadow: plan.featured ? "0 24px 56px rgba(120,90,30,0.14)" : "none",
                position: "relative",
              }}
            >
              {plan.featured && (
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#fff",
                    background: "#C19A4B",
                    padding: "6px 14px",
                    borderRadius: 999,
                    marginBottom: 16,
                  }}
                >
                  Most loved
                </span>
              )}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 32, color: "#3F3B30", margin: "0 0 6px" }}>{plan.name}</h3>
              <div style={{ fontSize: 16, color: "#B0863A", marginBottom: 6 }}>{plan.price}</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#8A8478", margin: "0 0 22px" }}>{plan.tagline}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
                {plan.perks.map((perk) => (
                  <li key={perk} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.55, color: "#6E6F62" }}>
                    <span aria-hidden style={{ color: "#C19A4B" }}>&#10022;</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href="#enquire"
                style={{
                  display: "inline-block",
                  marginTop: 28,
                  fontSize: 14,
                  color: plan.featured ? "#fff" : "#56564A",
                  background: plan.featured ? "#2A211A" : "transparent",
                  border: plan.featured ? "none" : "1px solid #C8B58C",
                  padding: "13px 26px",
                  borderRadius: 999,
                }}
              >
                Enquire about {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ESPRESSO CTA ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 40px 84px" }}>
        <div style={{ background: "linear-gradient(120deg, #2C2219 0%, #221A12 100%)", borderRadius: 22, padding: "56px 40px", textAlign: "center" }}>
          <Eyebrow color="#C7B89D">Gift the feeling forward</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 40, color: "#F4ECDB", margin: "0 0 14px" }}>
            The most loving thing you can give
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#C7B89D", maxWidth: 520, margin: "0 auto 26px" }}>
            Not sure which tier suits you? An ISA gift card lets someone you love choose their own ritual, at any of our 50+ spas.
          </p>
          <Link href="/isa-spa-gift-cards" style={{ display: "inline-block", fontSize: 15, color: "#2A211A", background: "#D9B25E", padding: "15px 30px", borderRadius: 999 }}>
            Explore gift cards
          </Link>
        </div>
      </section>

      {/* ===== ENQUIRY FORM ===== */}
      <section id="enquire" style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "84px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Eyebrow>Enquire</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 42, color: "#3F3B30", margin: "0 0 14px" }}>
              Tell us which tier suits you
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", maxWidth: 480, margin: "0 auto" }}>
              Share your details and a wellness advisor will help you pick the perfect membership.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 36 }}>
            <LeadForm
              type="MEMBERSHIP"
              fields={fields}
              sourcePage="/isa-spa-membership"
              submitLabel="Request membership details"
              successTitle="You're one step closer."
              successMessage="A wellness advisor will reach out with membership details shortly."
            />
          </div>
        </div>
      </section>
    </>
  );
}
