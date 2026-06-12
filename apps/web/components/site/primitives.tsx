import type { CSSProperties, ReactNode } from "react";

/**
 * Warm striped photo placeholder from the approved prototype. Real photography
 * drops in later by swapping these for <Image>. `label` is the monospace caption.
 */
export function Photo({
  label,
  style,
  align = "flex-end",
}: {
  label: string;
  style?: CSSProperties;
  align?: CSSProperties["alignItems"];
}) {
  return (
    <div
      className="isa-photo"
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: "center",
        padding: 18,
        overflow: "hidden",
        ...style,
      }}
    >
      <span className="isa-photo-label">{label}</span>
    </div>
  );
}

/** Uppercase gold kicker above section headings. */
export function Eyebrow({ children, color = "#A8823A" }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color, marginBottom: 12 }}>
      {children}
    </div>
  );
}

/** Serif section heading in heritage ink. */
export function Heading({
  children,
  size = 46,
  color = "#3F3B30",
  style,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.12,
        color,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}
