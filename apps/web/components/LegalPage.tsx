import type { ReactNode } from "react";

/**
 * Shared shell for legal pages: approved radial hero with the page title, a
 * clearly-flagged placeholder notice, and the copy rendered via `.richtext`.
 * Body copy is placeholder pending the client's finalised legal text.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: ReactNode;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section style={{ background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)", padding: "64px 40px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 56, lineHeight: 1.13, color: "#3F3B30", margin: 0 }}>{title}</h1>
          {updated && <p style={{ fontSize: 13, color: "#9A9486", marginTop: 12 }}>Last updated: {updated}</p>}
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "48px 40px 90px" }}>
        <div
          style={{
            background: "#FBF7EF",
            border: "1px solid #EFE6D3",
            borderRadius: 14,
            padding: "16px 20px",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#6E6F62",
            marginBottom: 36,
          }}
        >
          <strong style={{ color: "#3F3B30" }}>Placeholder — final copy TBD by client.</strong> The wording below is a
          working draft; ISA Spa will provide the finalised legal text before launch.
        </div>

        <div className="richtext">{children}</div>
      </section>
    </>
  );
}
