import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { franchiseSchema, type FranchiseInput } from "@isa/shared";
import { pageMeta, faqJsonLd, jsonLdScript } from "@/lib/seo";
import { franchiseWhy, franchiseSteps } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "Own an ISA Spa Franchise — A Proven Wellness Business",
  description:
    "Partner with India's most loved luxury day spa. Proven unit economics across 50+ spas, end-to-end training, turnkey fit-out and marketing — backed by Impel Ventures.",
  path: "/franchise",
});

const fields: LeadField<FranchiseInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
  { name: "city", label: "Preferred city", required: true, placeholder: "Where you'd open" },
  {
    name: "investmentCapacity",
    label: "Investment capacity",
    type: "select",
    placeholder: "Select a range",
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

export default function FranchisePage() {
  return (
    <>
      <PageHero
        eyebrow="Franchise"
        title="Own India's most loved spa brand."
        lead="A proven, profitable model refined across 50+ spas — in a booming wellness market, backed by the team behind Studio11 and Impel Ventures."
      />

      <Section className="pt-0">
        <SectionHeading eyebrow="Why ISA" title="Built to be profitable from day one." center />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {franchiseWhy.map((w) => (
            <Card key={w.num}>
              <span className="font-serif text-3xl text-gold/60">{w.num}</span>
              <h3 className="mt-3 font-serif text-2xl text-ink">{w.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{w.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0" bare>
        <div className="bg-white/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="The journey" title="From enquiry to opening, in four steps." center />
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {franchiseSteps.map((s) => (
                <div key={s.step} className="rounded-2xl border border-sand/50 bg-white/50 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-serif text-lg text-white">
                    {s.step}
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Enquire" title="Request your franchise kit." />
            <p className="mt-4 text-ink-soft">
              Tell us your city and investment capacity. We'll send detailed unit economics and a franchise kit within
              24 hours.
            </p>
            <dl className="mt-8 space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-serif text-lg text-ink">{f.q}</dt>
                  <dd className="mt-1 text-sm text-ink-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Card>
            <LeadForm
              type="FRANCHISE"
              fields={fields}
              sourcePage="/franchise"
              submitLabel="Send me the franchise kit"
              successTitle="Kit on its way."
              successMessage="Our franchise team will share unit economics and next steps within 24 hours."
            />
          </Card>
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }} />
    </>
  );
}
