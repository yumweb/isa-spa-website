import Link from "next/link";
import type { Location } from "@/lib/api";

/** Compact spa location card used on the locator + city sections. */
export function LocationCard({ location }: { location: Location }) {
  return (
    <Link
      href={`/spa-locator/${location.slug}`}
      className="block rounded-2xl border border-sand/50 bg-white/40 p-6 transition hover:border-gold"
    >
      <h3 className="font-serif text-xl text-ink">{location.area ?? location.name}</h3>
      <p className="mt-2 text-sm text-ink-soft">{location.address}</p>
      {location.phone && <p className="mt-2 text-sm text-gold-deep">{location.phone}</p>}
    </Link>
  );
}
