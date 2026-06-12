import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { getServices } from "@/lib/api";
import { pageMeta, offerCatalogJsonLd } from "@/lib/seo";

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
    <>
      <PageHero
        eyebrow="Therapies & Rituals"
        title="Treatments crafted around you."
        lead="From deep-tissue therapy to luminous facials, every ISA ritual is bespoke — designed to melt away tension and restore your glow."
      >
        <ButtonLink href="/appointment">Book an appointment</ButtonLink>
      </PageHero>

      <Section className="pt-0">
        {categories.length === 0 ? (
          <p className="text-ink-soft">Our treatment menu is being updated. Please check back shortly.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services/${cat.slug}`}
                className="group flex flex-col rounded-2xl border border-sand/50 bg-white/40 p-8 transition hover:border-gold"
              >
                <h2 className="font-serif text-3xl text-ink">{cat.name}</h2>
                {cat.tagline && <p className="mt-3 text-ink-soft">{cat.tagline}</p>}
                {cat.services.length > 0 && (
                  <ul className="mt-5 space-y-1 text-sm text-mute">
                    {cat.services.slice(0, 4).map((s) => (
                      <li key={s.id} className="flex justify-between gap-4">
                        <span>{s.name}</span>
                        {s.price && <span className="text-gold-deep">{s.price}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="mt-6 text-sm font-medium text-gold-deep group-hover:text-gold">
                  View {cat.name} →
                </span>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd(cat)) }}
                />
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
