"use client";

import { useState } from "react";
import Link from "next/link";
import type { Location } from "@/lib/api";

/**
 * Interactive Spa Locator body from the approved prototype (lines ~300-348).
 * Receives the already-fetched locations as a prop (plain objects — never a
 * schema/class across the RSC boundary) and filters them by city client-side.
 * Rendered on the server for initial HTML (H1 indexable), hydrated for the filter.
 */
export function LocatorClient({ locations }: { locations: Location[] }) {
  const cities = ["All Cities", ...Array.from(new Set(locations.map((l) => l.city)))];
  const [city, setCity] = useState("All Cities");

  const filtered = city === "All Cities" ? locations : locations.filter((l) => l.city === city);

  return (
    <>
      {/* ===== PAGE HERO (radial) + city chips ===== */}
      <section
        style={{
          background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)",
          padding: "74px 40px 56px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#A8823A", marginBottom: 16 }}>
          50+ Sanctuaries Nationwide
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontSize: 60,
            lineHeight: 1.13,
            color: "#3F3B30",
            margin: "0 auto 18px",
            maxWidth: 720,
          }}
        >
          Find your nearest Isa Spa
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "#6E6F62", maxWidth: 540, margin: "0 auto 30px" }}>
          From Hyderabad and Bengaluru to Varanasi and Dharamshala &mdash; serenity is closer than you think.
        </p>
        <div
          style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 760, margin: "0 auto" }}
        >
          {cities.map((c) => {
            const active = c === city;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                style={{
                  border: `1px solid ${active ? "#C19A4B" : "#E0D2B6"}`,
                  background: active ? "#C19A4B" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#6E6F62",
                  fontSize: 13.5,
                  fontWeight: 600,
                  padding: "9px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== LIST + MAP ===== */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 40px 90px",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 36,
          alignItems: "start",
        }}
        className="isa-grid-split"
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 26, color: "#3F3B30", margin: 0 }}>
              {city}
            </h2>
            <span style={{ fontSize: 13, color: "#9A9486" }}>{filtered.length} locations</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.length === 0 ? (
              <p style={{ color: "#8A8478" }}>No spas listed yet for this city. Please check back soon.</p>
            ) : (
              filtered.map((loc) => (
                <div
                  key={loc.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #ECE2CF",
                    borderRadius: 16,
                    padding: "22px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 10.5,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#fff",
                        background: "#C19A4B",
                        padding: "3px 10px",
                        borderRadius: 999,
                        marginBottom: 9,
                      }}
                    >
                      {loc.city}
                    </span>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 23,
                        fontWeight: 600,
                        color: "#3F3B30",
                        lineHeight: 1.2,
                        marginBottom: 6,
                      }}
                    >
                      Isa Spa &middot; {loc.area ?? loc.name}
                    </div>
                    <div style={{ fontSize: 14, color: "#8A8478", lineHeight: 1.5 }}>{loc.address}</div>
                    {loc.phone && (
                      <div style={{ fontSize: 13, color: "#B0863A", marginTop: 8, letterSpacing: "0.04em" }}>
                        &#9742; {loc.phone}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                    <Link
                      href="/appointment"
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        background: "#2A211A",
                        padding: "9px 18px",
                        borderRadius: 999,
                        textAlign: "center",
                      }}
                    >
                      Book
                    </Link>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 13,
                        color: "#56564A",
                        border: "1px solid #D8C8A6",
                        padding: "9px 18px",
                        borderRadius: 999,
                        textAlign: "center",
                      }}
                    >
                      Directions
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ position: "sticky", top: 100 }}>
          <div
            style={{
              position: "relative",
              height: 520,
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid #E0D2B6",
              background: "repeating-linear-gradient(135deg, #E7Dcc4, #E7Dcc4 16px, #E0D6BC 16px, #E0D6BC 32px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 38% 42%, rgba(193,154,75,0.25), transparent 36%), radial-gradient(circle at 62% 60%, rgba(193,154,75,0.22), transparent 32%)",
              }}
            />
            <span
              style={{
                position: "relative",
                fontFamily: "monospace",
                fontSize: 12,
                color: "#8A7E62",
                background: "rgba(255,255,255,0.8)",
                padding: "8px 14px",
                borderRadius: 8,
              }}
            >
              interactive map &middot; pins for each spa
            </span>
          </div>
          <div
            style={{
              background: "#FBF7EF",
              border: "1px solid #ECE2CF",
              borderRadius: 16,
              padding: "22px 24px",
              marginTop: 16,
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: "#3F3B30", marginBottom: 6 }}>
              Can&rsquo;t find your city?
            </div>
            <p style={{ fontSize: 14, color: "#8A8478", margin: "0 0 14px", lineHeight: 1.6 }}>
              We&rsquo;re opening new spas across India every month. Tell us where you&rsquo;d love an Isa Spa.
            </p>
            <Link href="/contact" style={{ fontSize: 14, color: "#B0863A", fontWeight: 600 }}>
              Request a location &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
