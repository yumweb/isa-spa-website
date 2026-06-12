import Link from "next/link";
import { getLocations } from "@/lib/api";
import { pageMeta, locationJsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Spa Locator — Find Your Nearest ISA Spa",
  description: "There's an ISA Spa near you. Browse our 50+ luxury day spas across India by city.",
  path: "/spa-locator",
});

export const revalidate = 600;

export default async function SpaLocatorPage() {
  const locations = await getLocations().catch(() => []);
  const cities = [...new Set(locations.map((l) => l.city))];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="font-serif text-5xl text-ink">Find your nearest ISA Spa</h1>
      <p className="mt-3 text-ink-soft">{locations.length} sanctuaries across {cities.length} cities.</p>

      {cities.map((city) => (
        <section key={city} className="mt-14">
          <h2 className="font-serif text-3xl text-gold-deep">{city}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {locations
              .filter((l) => l.city === city)
              .map((loc) => (
                <Link
                  key={loc.id}
                  href={`/spa-locator/${loc.slug}`}
                  className="rounded-2xl border border-sand/50 bg-white/40 p-6 hover:border-gold"
                >
                  <h3 className="font-serif text-xl text-ink">{loc.area ?? loc.name}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{loc.address}</p>
                  {loc.phone && <p className="mt-2 text-sm text-gold-deep">{loc.phone}</p>}
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(locationJsonLd(loc)) }}
                  />
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
