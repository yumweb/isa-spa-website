import { getLocations } from "@/lib/api";
import { pageMeta, locationJsonLd, jsonLdScript } from "@/lib/seo";
import { LocatorClient } from "./LocatorClient";

export const metadata = pageMeta({
  title: "Spa Locator — Find Your Nearest ISA Spa",
  description: "There's an ISA Spa near you. Browse our 50+ luxury day spas across India by city.",
  path: "/spa-locator",
});

export const revalidate = 600;

export default async function SpaLocatorPage() {
  const locations = await getLocations().catch(() => []);

  return (
    <main>
      <LocatorClient locations={locations} />
      {locations.map((loc) => (
        <script
          key={loc.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(locationJsonLd(loc)) }}
        />
      ))}
    </main>
  );
}
