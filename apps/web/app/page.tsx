import Link from "next/link";
import { getTestimonials } from "@/lib/api";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "ISA Spa — India's Luxury Day Spa",
  description: "Inspired by the Divine. Created for You. Signature therapies, facials and body rituals across 50+ outlets in India.",
  path: "/",
});

export const revalidate = 300;

const PATHS = [
  { href: "/spa-locator", title: "Visit a Spa", desc: "Find your nearest sanctuary and book a ritual." },
  { href: "/franchise", title: "Own a Franchise", desc: "Partner with India's most loved spa brand." },
  { href: "/hotel-partnership", title: "Partner Your Hotel", desc: "A turnkey luxury spa for your property." },
];

export default async function HomePage() {
  const testimonials = await getTestimonials().catch(() => []);

  return (
    <>
      {/* Hero — variant "A · Editorial" from the prototype */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">India&apos;s Luxury Day Spa</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight text-ink md:text-7xl">
          Inspired by the Divine.
          <br />
          Created for You.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-ink-soft">
          Pause. Breathe. Reconnect. A sacred space for the everyday — where healing feels divine.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/appointment" className="rounded-full bg-gold px-7 py-3 font-medium text-white hover:bg-gold-deep">
            Book an Appointment
          </Link>
          <Link href="/services" className="rounded-full border border-gold px-7 py-3 font-medium text-gold hover:bg-gold/10">
            Explore Therapies
          </Link>
        </div>
      </section>

      {/* Three paths */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        {PATHS.map((p) => (
          <Link key={p.href} href={p.href} className="rounded-2xl border border-sand/50 bg-white/40 p-8 transition hover:border-gold">
            <h3 className="font-serif text-2xl text-ink">{p.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{p.desc}</p>
          </Link>
        ))}
      </section>

      {/* Testimonials (dynamic, from CMS) */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="text-center font-serif text-4xl text-ink">Real stories. Real transformation.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-2xl border border-sand/50 bg-white/40 p-8">
                <blockquote className="text-ink-soft">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-gold-deep">
                  {t.authorName}
                  {t.city ? ` · ${t.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
