import Link from "next/link";
import Image from "next/image";
import type { BlogPostSummary } from "@/lib/api";
import { Photo } from "@/components/site/primitives";

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

/** Blog index card: cover (real image or striped placeholder), title, excerpt, author + date. */
export function BlogCard({ post }: { post: BlogPostSummary }) {
  const date = fmtDate(post.publishedAt);
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, overflow: "hidden", display: "block" }}
    >
      {post.coverImage ? (
        <div style={{ position: "relative", aspectRatio: "16/10", width: "100%", overflow: "hidden" }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <Photo label={post.title} style={{ aspectRatio: "16/10" }} />
      )}
      <div style={{ padding: "24px 24px 28px" }}>
        {post.tags && post.tags.length > 0 && (
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8823A", marginBottom: 10 }}>{post.tags[0]}</div>
        )}
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 25, lineHeight: 1.2, color: "#3F3B30", margin: "0 0 10px" }}>{post.title}</h3>
        {post.excerpt && <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#6E6F62", margin: "0 0 16px" }}>{post.excerpt}</p>}
        <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9486" }}>
          {post.author ? `${post.author} · ` : ""}
          {date}
        </div>
      </div>
    </Link>
  );
}
