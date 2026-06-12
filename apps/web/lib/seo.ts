import type { Metadata } from "next";

export const SITE = {
  name: "ISA Spa",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://isaspa.in",
  description: "India's luxury day spa — signature therapies, facials, body rituals across 50+ outlets.",
} as const;

/** Build per-page metadata with sane defaults + canonical. */
export function pageMeta(opts: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${SITE.url}${opts.path ?? ""}`;
  return {
    title: opts.title,
    description: opts.description ?? SITE.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description ?? SITE.description,
      url,
      siteName: SITE.name,
      images: opts.image ? [{ url: opts.image }] : undefined,
      locale: "en_IN",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: opts.title },
  };
}

/** JSON-LD for the organization (include once, e.g. in root layout). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

/** JSON-LD for a single spa location (HealthAndBeautyBusiness). */
export function locationJsonLd(loc: {
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  lat?: number | null;
  lng?: number | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: loc.name,
    url: `${SITE.url}/spa-locator/${loc.slug}`,
    telephone: loc.phone ?? undefined,
    address: { "@type": "PostalAddress", streetAddress: loc.address, addressLocality: loc.city, addressCountry: "IN" },
    geo: loc.lat && loc.lng ? { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng } : undefined,
  };
}

/** JSON-LD for a blog article (`BlogPosting`). */
export function blogPostingJsonLd(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    url: `${SITE.url}/blog/${post.slug}`,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: { "@type": post.author ? "Person" : "Organization", name: post.author ?? SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
  };
}

/** JSON-LD for a single spa service. */
export function serviceJsonLd(svc: {
  name: string;
  description?: string | null;
  price?: string | null;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    description: svc.description ?? undefined,
    serviceType: svc.category ?? "Spa treatment",
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: "IN",
    offers: svc.price ? { "@type": "Offer", price: svc.price, priceCurrency: "INR" } : undefined,
  };
}

/** JSON-LD `OfferCatalog` listing a category's services. */
export function offerCatalogJsonLd(category: {
  name: string;
  slug: string;
  tagline?: string | null;
  services: { name: string; description?: string | null; price?: string | null }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: category.name,
    description: category.tagline ?? undefined,
    url: `${SITE.url}/services/${category.slug}`,
    itemListElement: category.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.description ?? undefined },
      price: s.price ?? undefined,
      priceCurrency: s.price ? "INR" : undefined,
    })),
  };
}

/** JSON-LD breadcrumb trail. Pass ordered `{ name, path }` crumbs. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path}`,
    })),
  };
}

/** JSON-LD `FAQPage` from question/answer pairs. */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Render a JSON-LD object as a `<script>` payload string. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data);
}
