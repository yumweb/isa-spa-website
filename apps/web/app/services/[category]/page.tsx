import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getServices, getServiceCategory } from "@/lib/api";
import { pageMeta, offerCatalogJsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 600;

export async function generateStaticParams() {
  const categories = await getServices().catch(() => []);
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getServiceCategory(category).catch(() => null);
  if (!cat) return pageMeta({ title: "Service not found — ISA Spa", path: `/services/${category}` });
  return pageMeta({
    title: cat.metaTitle ?? `${cat.name} — ISA Spa`,
    description: cat.metaDescription ?? cat.tagline ?? undefined,
    path: `/services/${cat.slug}`,
    image: cat.heroImage ?? undefined,
  });
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = await getServiceCategory(category).catch(() => null);
  if (!cat) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: cat.name, path: `/services/${cat.slug}` },
  ];

  return (
    <>
      <Container className="pt-10">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <Container className="py-12">
        <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">Therapies</p>
        <h1 className="mt-4 font-serif text-5xl text-ink">{cat.name}</h1>
        {cat.tagline && <p className="mt-4 max-w-2xl text-ink-soft">{cat.tagline}</p>}
        <div className="mt-8">
          <ButtonLink href="/appointment">Book this therapy</ButtonLink>
        </div>
      </Container>

      <Section className="pt-0">
        {cat.services.length === 0 ? (
          <p className="text-ink-soft">Treatments for this category are being finalised.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {cat.services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd(cat)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />
      {cat.services.map((s) => (
        <script
          key={s.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd({ ...s, category: cat.name })),
          }}
        />
      ))}
    </>
  );
}
