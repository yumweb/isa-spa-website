import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { aboutValues, aboutPresence } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "About ISA Spa — Self-care as a Sacred Ritual",
  description:
    "Isa means God. At ISA Spa, we treat self-care as a sacred ritual — bespoke therapies and trained therapists making luxury wellness an everyday, affordable indulgence across India.",
  path: "/about-us",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Self-care, treated as a sacred ritual."
        lead="Isa means God. We built ISA Spa as a sanctuary where healing feels divine — a pause in the everyday that honours the body, calms the mind and restores the spirit."
      />

      <Section className="pt-0">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-ink">Inspired by the Divine. Created for you.</h2>
            <div className="mt-5 space-y-4 text-ink-soft">
              <p>
                The name <strong className="text-ink">Isa</strong> means God — and that reverence shapes everything we
                do. We believe rest is not indulgence but devotion: a way to return to yourself.
              </p>
              <p>
                What began as a single sanctuary has grown into 50+ outlets across India, each one a calm, beautiful
                space where world-class therapies are delivered by deeply trained therapists — and made an affordable
                luxury, close to home.
              </p>
              <p>
                Every ritual is bespoke. We never believe in one-size-fits-all wellness; we listen to your body and
                tailor the experience to the energy you carry that day.
              </p>
            </div>
          </div>
          <Card className="bg-espresso/95 text-cream">
            <p className="font-serif text-2xl leading-relaxed">
              &ldquo;Pause. Breathe. Reconnect. A sacred space for the everyday — where healing feels divine.&rdquo;
            </p>
          </Card>
        </div>
      </Section>

      <Section className="pt-0" bare>
        <div className="bg-white/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="What we stand for" title="The values that guide every ritual." center />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {aboutValues.map((v) => (
                <Card key={v.title}>
                  <h3 className="font-serif text-2xl text-gold-deep">{v.title}</h3>
                  <p className="mt-3 text-ink-soft">{v.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="Our presence" title="A sanctuary near you, across India." />
        <div className="mt-8 flex flex-wrap gap-3">
          {aboutPresence.map((city) => (
            <span key={city} className="rounded-full border border-sand/60 bg-white/40 px-5 py-2 text-sm text-ink">
              {city}
            </span>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/spa-locator">Find your nearest spa</ButtonLink>
          <ButtonLink href="/appointment" variant="outline">
            Book an appointment
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
