import Link from "next/link";
import Image from "next/image";
import type { BlogPostSummary } from "@/lib/api";

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

/** Blog index card: cover, title, excerpt, author + date. */
export function BlogCard({ post }: { post: BlogPostSummary }) {
  const date = fmtDate(post.publishedAt);
  return (
    <article className="group overflow-hidden rounded-2xl border border-sand/50 bg-white/40 transition hover:border-gold">
      <Link href={`/blog/${post.slug}`}>
        {post.coverImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-sand/20" />
        )}
        <div className="p-6">
          <h3 className="font-serif text-2xl text-ink">{post.title}</h3>
          {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{post.excerpt}</p>}
          <p className="mt-4 text-xs uppercase tracking-wide text-mute">
            {post.author ? `${post.author} · ` : ""}
            {date}
          </p>
        </div>
      </Link>
    </article>
  );
}
