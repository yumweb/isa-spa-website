import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { giftCardSchema, type GiftCardInput } from "@isa/shared";
import { pageMeta } from "@/lib/seo";

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
      <PageHero
        eyebrow="Gift Cards"
        title="Give the gift of calm."
        lead="There's no kinder gesture than a moment of rest. ISA gift cards let someone you love choose their own ritual."
      />

      <Section className="pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {perks.map((p) => (
            <Card key={p.title}>
              <h3 className="font-serif text-2xl text-gold-deep">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0" bare>
        <div className="bg-white/30 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">Request a gift card</p>
              <h2 className="mt-4 font-serif text-4xl text-ink">Tell us who it's for.</h2>
              <p className="mt-4 text-ink-soft">
                Share the details and our team will help you purchase and personalise your gift card.
              </p>
            </div>
            <div className="mt-10">
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
        </div>
      </Section>
    </>
  );
}
