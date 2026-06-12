import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { getGallery, type GalleryItem } from "@/lib/api";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Gallery — Inside ISA Spa",
  description:
    "Step inside ISA Spa. A look at our serene interiors, treatment rooms and signature rituals across India's most loved luxury day spas.",
  path: "/gallery",
});

export const revalidate = 600;

export default async function GalleryPage() {
  const items = await getGallery().catch(() => []);

  // Group by album so related photos sit together; untitled fall under "Spaces".
  const albums = new Map<string, GalleryItem[]>();
  for (const it of items) {
    const key = it.album ?? "Spaces";
    if (!albums.has(key)) albums.set(key, []);
    albums.get(key)!.push(it);
  }

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A glimpse of the calm."
        lead="Serene interiors, considered details and rituals designed to slow you down. Step inside ISA Spa."
      />

      <Section className="pt-0">
        {items.length === 0 ? (
          <Card>
            <p className="text-ink-soft">
              Our gallery is being curated. In the meantime, visit a spa near you to experience the space in person.
            </p>
          </Card>
        ) : (
          <div className="space-y-16">
            {[...albums.entries()].map(([album, photos]) => (
              <div key={album}>
                <h2 className="font-serif text-3xl text-gold-deep">{album}</h2>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {photos.map((photo) => (
                    <figure key={photo.id} className="overflow-hidden rounded-2xl border border-sand/40 bg-white/30">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={photo.image}
                          alt={photo.caption ?? `${album} — ISA Spa`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      {photo.caption && (
                        <figcaption className="px-4 py-3 text-sm text-ink-soft">{photo.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
