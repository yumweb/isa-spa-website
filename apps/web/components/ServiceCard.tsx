import type { Service } from "@/lib/api";

/** A single treatment row/card with duration, price and description. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-2xl border border-sand/50 bg-white/40 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl text-ink">{service.name}</h3>
        {service.price && <span className="shrink-0 font-medium text-gold-deep">{service.price}</span>}
      </div>
      {service.duration && <p className="mt-1 text-xs uppercase tracking-wide text-mute">{service.duration}</p>}
      {service.description && <p className="mt-3 text-sm text-ink-soft">{service.description}</p>}
    </article>
  );
}
