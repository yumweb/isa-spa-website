import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/**
 * Shared shell for legal pages. The body copy is placeholder pending the
 * client's finalised legal text (see the notice each page renders).
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl text-ink md:text-5xl">{title}</h1>
        {updated && <p className="mt-2 text-sm text-mute">Last updated: {updated}</p>}

        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-ink-soft">
          <strong className="text-ink">Note:</strong> This is placeholder copy. Final legal wording is to be provided
          by ISA Spa before launch.
        </div>

        <div className="richtext mt-10">{children}</div>
      </div>
    </Container>
  );
}
