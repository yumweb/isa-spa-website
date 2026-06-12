import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getLocations, getLocation } from "@/lib/api";
import { pageMeta, locationJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export const revalidate = 600;

export async function generateStaticParams() {
  const locations = await getLocations().catch(() => []);
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loc = await getLocation(slug).catch(() => null);
  if (!loc) return pageMeta({ title: "Spa not found — ISA Spa", path: `/spa-locator/${slug}` });
  return pageMeta({
    title: loc.metaTitle ?? `${loc.name} — ISA Spa ${loc.city}`,
    description:
      loc.metaDescription ??
      `Visit ISA Spa ${loc.area ?? loc.name} in ${loc.city}. ${loc.address}. Book your luxury spa ritual today.`,
    path: `/spa-locator/${loc.slug}`,
    image: loc.ogImage ?? undefined,
  });
}

/** Normalise the JSON `hours` field (object or array) into label/value rows. */
function hoursRows(hours: unknown): { label: string; value: string }[] {
  if (!hours) return [];
  if (Array.isArray(hours)) return hours.map((v, i) => ({ label: `Row ${i + 1}`, value: String(v) }));
  if (typeof hours === "object") {
    return Object.entries(hours as Record<string, unknown>).map(([label, value]) => ({
      label,
      value: String(value),
    }));
  }
  return [];
}

export default async function SpaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocation(slug).catch(() => null);
  if (!loc) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Spa Locator", path: "/spa-locator" },
    { name: loc.area ?? loc.name, path: `/spa-locator/${loc.slug}` },
  ];
  const rows = hoursRows(loc.hours);
  const mapQuery = encodeURIComponent(`${loc.name}, ${loc.address}`);
  const telHref = loc.phone ? `tel:${loc.phone.replace(/\s+/g, "")}` : null;

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumbs crumbs={crumbs} />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">{loc.city}</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">{loc.name}</h1>

          <address className="mt-6 not-italic text-ink-soft">{loc.address}</address>

          <dl className="mt-6 space-y-3 text-sm">
            {loc.phone && (
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-mute">Phone</dt>
                <dd>
                  <a href={telHref!} className="text-gold-deep hover:underline">
                    {loc.phone}
                  </a>
                </dd>
              </div>
            )}
            {loc.whatsapp && (
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-mute">WhatsApp</dt>
                <dd className="text-ink">{loc.whatsapp}</dd>
              </div>
            )}
            {rows.length > 0 && (
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-mute">Hours</dt>
                <dd>
                  <ul className="space-y-1">
                    {rows.map((r) => (
                      <li key={r.label} className="text-ink">
                        <span className="text-mute">{r.label}:</span> {r.value}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/appointment">Book an appointment</ButtonLink>
            <ButtonLink
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              variant="outline"
            >
              Get directions
            </ButtonLink>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-sand/40">
          <iframe
            title={`Map to ISA Spa ${loc.area ?? loc.name}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-[360px] w-full md:h-[460px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(locationJsonLd(loc)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }} />
    </Container>
  );
}
