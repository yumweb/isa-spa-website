import type { ReactNode } from "react";
import { Container } from "./Container";

/** Vertical page section with consistent rhythm. `bare` skips the Container. */
export function Section({
  children,
  className = "",
  bare = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  bare?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}

/** Eyebrow + heading + optional lead, used at the top of most sections. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  center?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">{eyebrow}</p>}
      <Tag className={`text-ink ${eyebrow ? "mt-4" : ""} font-serif text-4xl md:text-5xl`}>{title}</Tag>
      {lead && <p className="mt-4 text-ink-soft">{lead}</p>}
    </div>
  );
}
