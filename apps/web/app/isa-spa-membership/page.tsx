import Link from "next/link";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type MembershipInput } from "@isa/shared";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Eyebrow } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "The Elite Retreat Circle — ISA Spa Membership",
  description:
    "Join The Elite Retreat Circle. ISA Spa membership tiers with prepaid spa hours, VIP treatment-room priority, exclusive discounts and priority scheduling. More pampering. More luxury. More you.",
  path: "/isa-spa-membership",
});

const CHECKOUT = "https://membership.isaspa.in/checkout?plan=";

type Plan = {
  slug: string;
  name: string;
  price: string;
  validity: string;
  hours: string;
  vip: boolean;
  featured?: boolean;
};

const PLANS: Plan[] = [
  { slug: "perfect-bliss", name: "Perfect Bliss", price: "₹10,000", validity: "3 months", hours: "7 spa hours", vip: false },
  { slug: "royal-gold", name: "Royal Gold", price: "₹25,000", validity: "9 months", hours: "20 spa hours", vip: true, featured: true },
  { slug: "majestic-platinum", name: "Majestic Platinum", price: "₹50,000", validity: "12 months", hours: "45 spa hours", vip: true },
];

// Benefits shared across every tier.
const UNIVERSAL = [
  "Exclusive discounts on select services & add-ons",
  "Personalised treatment recommendations",
  "Priority appointment scheduling",
];

const fields: LeadField<MembershipInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "city", label: "City", placeholder: "Your city" },
  {
    name: "plan",
    label: "Interested in",
    type: "select",
    placeholder: "Choose a tier",
    options: PLANS.map((p) => ({ value: p.name, label: `${p.name} — ${p.price}` })),
  },
];

export default function MembershipPage() {
  return (
    <>
      <Hero
        eyebrow="ISA Spa Membership"
        title="The Elite Retreat Circle."
        lead="More pampering. More luxury. More you. Step into a life where self-care is built in, not squeezed in — with prepaid spa hours, VIP priority and member-only privileges."
      />

      {/* ===== MEMBERSHIP TIERS ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow>Choose your circle</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 46, color: "#3F3B30", margin: 0 }}>
            Three tiers of indulgence
          </h2>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20, alignItems: "stretch" }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.slug}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                border: plan.featured ? "1.5px solid #C19A4B" : "1px solid #ECE2CF",
                borderRadius: 18,
                padding: "30px 26px",
                boxShadow: plan.featured ? "0 24px 56px rgba(120,90,30,0.14)" : "none",
              }}
            >
              {plan.featured && (
                <span style={{ alignSelf: "flex-start", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", background: "#C19A4B", padding: "5px 12px", borderRadius: 999, marginBottom: 14 }}>
                  Most loved
                </span>
              )}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 27, color: "#3F3B30", margin: "0 0 4px" }}>{plan.name}</h3>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: "#B0863A", lineHeight: 1.1 }}>{plan.price}</div>
              <div style={{ fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9486", margin: "4px 0 20px" }}>{plan.validity} validity</div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 11, flex: 1 }}>
                {[`${plan.hours} included`, ...(plan.vip ? ["VIP treatment-room priority"] : []), ...UNIVERSAL].map((perk) => (
                  <li key={perk} style={{ display: "flex", gap: 9, fontSize: 13.5, lineHeight: 1.5, color: "#6E6F62" }}>
                    <span aria-hidden style={{ color: "#C19A4B" }}>&#10022;</span>
                    {perk}
                  </li>
                ))}
              </ul>

              <a
                href={`${CHECKOUT}${plan.slug}`}
                style={{
                  display: "block",
                  marginTop: 26,
                  textAlign: "center",
                  fontSize: 14,
                  color: plan.featured ? "#fff" : "#2A211A",
                  background: plan.featured ? "#2A211A" : "#D9B25E",
                  padding: "13px 22px",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#9A9486", marginTop: 22 }}>
          All tiers include exclusive discounts, personalised recommendations and priority scheduling. Spa hours are
          prepaid and redeemable across treatments.
        </p>
      </section>

      {/* ===== GIFT CTA ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 40px 84px" }}>
        <div style={{ background: "linear-gradient(120deg, #2C2219 0%, #221A12 100%)", borderRadius: 22, padding: "56px 40px", textAlign: "center" }}>
          <Eyebrow color="#C7B89D">Gift the feeling forward</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 40, color: "#F4ECDB", margin: "0 0 14px" }}>
            The most loving thing you can give
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#C7B89D", maxWidth: 520, margin: "0 auto 26px" }}>
            Not ready to commit to a tier? An ISA gift card lets someone you love choose their own ritual, at any of our
            50+ spas.
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
            <Eyebrow>Have questions?</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 42, color: "#3F3B30", margin: "0 0 14px" }}>
              Talk to a wellness advisor
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", maxWidth: 480, margin: "0 auto" }}>
              Prefer guidance before joining? Share your details and an advisor will help you pick the perfect tier.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 36 }}>
            <LeadForm
              type="MEMBERSHIP"
              fields={fields}
              sourcePage="/isa-spa-membership"
              submitLabel="Request a callback"
              successTitle="You're one step closer."
              successMessage="A wellness advisor will reach out with membership details shortly."
            />
          </div>
        </div>
      </section>
    </>
  );
}
