import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { hotelSchema, type HotelInput } from "@isa/shared";
import { pageMeta, faqJsonLd, jsonLdScript } from "@/lib/seo";
import { hotelModels, hotelBenefits } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "Hotel Spa Partnership — ISA Spa for Your Property",
  description:
    "Add a turnkey luxury spa to your hotel. Fully managed, revenue-share or licensed models — ISA handles design, staffing and operations while you earn a new revenue stream.",
  path: "/hotel-partnership",
});

const fields: LeadField<HotelInput>[] = [
  { name: "name", label: "Your name", required: true, placeholder: "Contact person" },
  { name: "hotelName", label: "Hotel / group name", required: true, placeholder: "Property or group" },
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
    <>
      <PageHero
        eyebrow="Hotel Partnership"
        title="A turnkey luxury spa for your property."
        lead="Elevate guest experience and unlock a new revenue stream — with India's most loved day spa brand running on your floor, your way."
      />

      <Section className="pt-0">
        <SectionHeading eyebrow="Partnership models" title="Three ways to bring ISA in." center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {hotelModels.map((m) => (
            <Card key={m.tag}>
              <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-deep">
                {m.tag}
              </span>
              <h3 className="mt-4 font-serif text-2xl text-ink">{m.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{m.desc}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-mute">{m.best}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0" bare>
        <div className="bg-white/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Why partner" title="Value for your property and your guests." center />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {hotelBenefits.map((b) => (
                <Card key={b.title} className="p-6">
                  <h3 className="font-serif text-xl text-ink">{b.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{b.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Enquire" title="Let's design your spa." />
            <p className="mt-4 text-ink-soft">
              Tell us about your property and our partnerships team will propose the right model and a tailored
              projection.
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
              type="HOTEL"
              fields={fields}
              sourcePage="/hotel-partnership"
              submitLabel="Request a partnership proposal"
              successTitle="Thank you."
              successMessage="Our partnerships team will reach out with a tailored proposal soon."
            />
          </Card>
        </div>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }} />
    </>
  );
}
