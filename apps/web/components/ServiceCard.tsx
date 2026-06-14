import type { Service } from "@/lib/api";

/** A single treatment row/card with duration and description. Pricing is not
 *  shown — it varies by location. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-2xl border border-sand/50 bg-white/40 p-6">
      <h3 className="font-serif text-xl text-ink">{service.name}</h3>
      {service.duration && <p className="mt-1 text-xs uppercase tracking-wide text-mute">{service.duration}</p>}
      {service.description && <p className="mt-3 text-sm text-ink-soft">{service.description}</p>}
    </article>
  );
}
