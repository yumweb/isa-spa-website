import type { CSSProperties, ReactNode } from "react";
import { Eyebrow } from "@/components/site/primitives";

/**
 * Approved page hero: warm radial wash, centred gold kicker, Cormorant H1 and
 * an optional lead paragraph. Matches the Home page's inline style vocabulary
 * (see app/page.tsx) so every extended page shares one visual language.
 */
export function Hero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Optional CTAs / extras rendered under the lead. */
  children?: ReactNode;
}) {
  return (
    <section style={heroSection}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 style={heroTitle}>{title}</h1>
        {lead && <p style={heroLead}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

const heroSection: CSSProperties = {
  background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)",
  padding: "76px 40px 60px",
  textAlign: "center",
};
const heroTitle: CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  fontSize: 60,
  lineHeight: 1.13,
  color: "#3F3B30",
  margin: "0 0 18px",
  letterSpacing: "-0.01em",
};
const heroLead: CSSProperties = {
  fontSize: 18,
  lineHeight: 1.7,
  color: "#6E6F62",
  maxWidth: 560,
  margin: "0 auto",
};
