import Image from "next/image";
import { getGallery, type GalleryItem } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Photo } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "Gallery — Inside ISA Spa",
  description:
    "Step inside ISA Spa. A look at our serene interiors, treatment rooms and signature rituals across India's most loved luxury spas.",
  path: "/gallery",
});

export const revalidate = 600;

// Striped placeholder labels shown while real photography is being curated.
const PLACEHOLDERS = ["reception · warm welcome", "treatment room · candlelit", "couple suite", "relaxation lounge", "foot ritual bar", "product apothecary"];

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
      <Hero
        eyebrow="Gallery"
        title="A glimpse of the calm."
        lead="Serene interiors, considered details and rituals designed to slow you down. Step inside ISA Spa."
      />

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px 90px" }}>
        {items.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="isa-grid-3">
            {PLACEHOLDERS.map((label, i) => (
              <Photo key={i} label={label} style={{ aspectRatio: i % 5 === 0 ? "4/5" : "1/1", borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 56 }}>
            {[...albums.entries()].map(([album, photos]) => (
              <div key={album}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 34, color: "#3F3B30", margin: "0 0 24px" }}>{album}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="isa-grid-3">
                  {photos.map((photo) => (
                    <figure key={photo.id} style={{ margin: 0, background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ position: "relative", aspectRatio: "1/1", width: "100%" }}>
                        <Image
                          src={photo.image}
                          alt={photo.caption ?? `${album} — ISA Spa`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      {photo.caption && (
                        <figcaption style={{ padding: "14px 18px", fontSize: 13.5, color: "#6E6F62" }}>{photo.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
