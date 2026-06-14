import type { ServiceCategory } from "@/lib/api";
import { Photo } from "@/components/site/primitives";

/**
 * Category card from the approved Services prototype (lines ~263-284):
 * striped photo left (0.78fr) + category name/tagline and item rows right (1.22fr).
 * Reused by /services (all categories) and /services/[category] (single).
 */
export function ServiceCategoryCard({ cat }: { cat: ServiceCategory }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ECE2CF",
        borderRadius: 22,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "0.78fr 1.22fr",
      }}
      className="isa-grid-split"
    >
      <Photo
        label={cat.slug.replace(/-/g, " ")}
        style={{ minHeight: 340 }}
      />
      <div style={{ padding: "36px 40px" }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 32,
            color: "#3F3B30",
            margin: "0 0 6px",
          }}
        >
          {cat.name}
        </h2>
        {cat.tagline && (
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 24px", color: "#8A8478" }}>{cat.tagline}</p>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {cat.services.map((it) => (
            <div
              key={it.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                padding: "16px 0",
                borderTop: "1px solid #F0E8D7",
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 21,
                    fontWeight: 600,
                    color: "#3F3B30",
                    lineHeight: 1.25,
                  }}
                >
                  {it.name}
                  {it.duration && (
                    <span
                      style={{
                        fontFamily: "'Mulish', sans-serif",
                        fontSize: 11.5,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#B0A893",
                        marginLeft: 10,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {it.duration}
                    </span>
                  )}
                </div>
                {it.description && (
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: "6px 0 0", color: "#8A8478" }}>
                    {it.description}
                  </p>
                )}
              </div>
              {/* Pricing intentionally not shown — it varies by location. */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
