import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { BlogCard } from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/api";
import { pageMeta } from "@/lib/seo";

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
      <PageHero
        eyebrow="Journal"
        title="Notes on living well."
        lead="Rituals, wellness wisdom and stories from the world of ISA Spa."
      />

      <Section className="pt-0">
        {posts.length === 0 ? (
          <Card>
            <p className="text-ink-soft">
              Our journal is just getting started. New stories on wellness and self-care are coming soon.
            </p>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
