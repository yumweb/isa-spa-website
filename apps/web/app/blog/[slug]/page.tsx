import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getBlogPosts, getBlogPost } from "@/lib/api";
import { pageMeta, blogPostingJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return pageMeta({ title: "Post not found — ISA Spa", path: `/blog/${slug}` });
  return pageMeta({
    title: post.metaTitle ?? `${post.title} — ISA Spa`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    path: `/blog/${post.slug}`,
    image: post.ogImage ?? post.coverImage ?? undefined,
  });
}

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const date = fmtDate(post.publishedAt);

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumbs crumbs={crumbs} />

      <article className="mx-auto mt-8 max-w-3xl">
        <header>
          {post.tags && post.tags.length > 0 && (
            <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">{post.tags[0]}</p>
          )}
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-mute">
            {post.author ? `${post.author} · ` : ""}
            {date}
          </p>
        </header>

        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="richtext mt-10"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(blogPostingJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
    </Container>
  );
}
