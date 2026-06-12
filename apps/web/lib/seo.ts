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
