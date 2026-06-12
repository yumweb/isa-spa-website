import { BlogCard } from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";

export const metadata = pageMeta({
  title: "Journal — Wellness & Self-care | ISA Spa",
  description:
    "Stories, rituals and wellness wisdom from ISA Spa. Tips on massage, skincare, self-care and living well, from India's luxury day spa.",
  path: "/blog",
});

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getBlogPosts().catch(() => []);

  return (
    <>
      <Hero
        eyebrow="Journal"
        title="Notes on living well."
        lead="Rituals, wellness wisdom and stories from the world of ISA Spa."
      />

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px 90px" }}>
        {posts.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: "40px 36px" }}>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", margin: 0 }}>
              Our journal is just getting started. New stories on wellness and self-care are coming soon.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="isa-grid-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
