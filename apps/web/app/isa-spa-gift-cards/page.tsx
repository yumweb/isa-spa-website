import Image from "next/image";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type GiftCardInput } from "@isa/shared";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Eyebrow } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "ISA Spa Gift Cards — The Gift of Calm",
  description:
    "Give the gift of self-care. ISA Spa gift cards are redeemable across our treatments and outlets — the perfect present for the people you love.",
  path: "/isa-spa-gift-cards",
});

const fields: LeadField<GiftCardInput>[] = [
  { name: "name", label: "Your name", required: true, placeholder: "Purchaser name" },
  { name: "email", label: "Your email", type: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Mobile number" },
  { name: "amount", label: "Gift amount (₹)", type: "number", placeholder: "e.g. 2500" },
  { name: "recipientName", label: "Recipient's name", placeholder: "Who is it for?" },
  { name: "message", label: "Personal message", type: "textarea", placeholder: "A note for the recipient (optional)" },
];

const perks = [
  { title: "Redeemable everywhere", desc: "Use across all ISA Spa outlets and any treatment on our menu." },
  { title: "Beautifully presented", desc: "Delivered ready to gift, with your personal message." },
  { title: "Any occasion", desc: "Birthdays, anniversaries, thank-yous — calm is always welcome." },
];

export default function GiftCardsPage() {
  return (
    <>
      <Hero
        eyebrow="Gift Cards"
        title="Give the gift of calm."
        lead="There's no kinder gesture than a moment of rest. ISA gift cards let someone you love choose their own ritual."
      />

      {/* ===== GIFT CARD VISUAL + PERKS ===== */}
      <section
        style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 40px", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "center" }}
        className="isa-grid-split"
      >
        <div style={{ background: "linear-gradient(120deg, #F3EAD7 0%, #EADBBE 100%)", borderRadius: 22, padding: 40, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              height: 220,
              borderRadius: 16,
              background: "#fff",
              border: "1px solid #E7D6B4",
              boxShadow: "0 20px 44px rgba(120,90,30,0.16)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 26,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Image src="/isa-logo.png" alt="" width={80} height={36} style={{ height: 36, width: "auto" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B0863A" }}>Gift</span>
            </div>
            <div>
              <div style={{ fontFamily: "ui-monospace, monospace", letterSpacing: "0.2em", color: "#8A8478", fontSize: 15 }}>•••• •••• ••••</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#3F3B30", marginTop: 8 }}>The Gift of Calm</div>
            </div>
          </div>
        </div>
        <div>
          <Eyebrow>Why an ISA gift card</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 42, lineHeight: 1.12, color: "#3F3B30", margin: "0 0 26px" }}>
            A moment of rest, beautifully given
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {perks.map((p) => (
              <div key={p.title} style={{ display: "flex", gap: 16 }}>
                <span aria-hidden style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#B0863A", lineHeight: 1.2 }}>&#10022;</span>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 22, color: "#3F3B30", margin: "0 0 4px" }}>{p.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6E6F62", margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REQUEST FORM ===== */}
      <section style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "84px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Eyebrow>Request a gift card</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 42, color: "#3F3B30", margin: "0 0 14px" }}>
              Tell us who it&rsquo;s for
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", maxWidth: 480, margin: "0 auto" }}>
              Share the details and our team will help you purchase and personalise your gift card.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 36 }}>
            <LeadForm
              type="GIFT_CARD"
              fields={fields}
              sourcePage="/isa-spa-gift-cards"
              submitLabel="Request gift card"
              successTitle="Lovely choice."
              successMessage="Our team will be in touch to complete your gift card purchase."
            />
          </div>
        </div>
      </section>
    </>
  );
}
