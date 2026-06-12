import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Photo } from "@/components/site/primitives";
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
    <>
      {/* ===== ARTICLE HEADER ===== */}
      <section style={{ background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)", padding: "40px 40px 56px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Breadcrumbs crumbs={crumbs} />
          {post.tags && post.tags.length > 0 && (
            <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A8823A", margin: "20px 0 12px" }}>{post.tags[0]}</div>
          )}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 56, lineHeight: 1.13, color: "#3F3B30", margin: "0 0 14px" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9A9486", margin: 0 }}>
            {post.author ? `${post.author} · ` : ""}
            {date}
          </p>
        </div>
      </section>

      <article style={{ maxWidth: 820, margin: "0 auto", padding: "48px 40px 90px" }}>
        {post.coverImage ? (
          <div style={{ position: "relative", aspectRatio: "16/9", width: "100%", overflow: "hidden", borderRadius: 18, marginBottom: 40, boxShadow: "0 24px 56px rgba(80,60,30,0.12)" }}>
            <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 820px) 100vw, 820px" style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <Photo label={post.title} style={{ aspectRatio: "16/9", borderRadius: 18, marginBottom: 40 }} />
        )}

        <div className="richtext" dangerouslySetInnerHTML={{ __html: post.body }} />
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(blogPostingJsonLd(post)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }} />
    </>
  );
}
