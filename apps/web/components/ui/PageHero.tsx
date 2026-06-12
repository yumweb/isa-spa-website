import type { ReactNode } from "react";
import { Container } from "./Container";

/** Standard editorial page header (eyebrow + serif title + lead + optional CTA). */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <Container className="py-20 text-center md:py-28">
      {eyebrow && <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">{eyebrow}</p>}
      <h1 className="mt-6 font-serif text-5xl leading-tight text-ink md:text-6xl">{title}</h1>
      {lead && <p className="mx-auto mt-6 max-w-2xl text-ink-soft">{lead}</p>}
      {children && <div className="mt-10 flex flex-wrap justify-center gap-4">{children}</div>}
    </Container>
  );
}
