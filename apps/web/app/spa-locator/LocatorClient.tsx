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
              filtered.map((loc) => {
                const waDigits = (loc.whatsapp ?? loc.phone ?? "").replace(/\D/g, "").slice(-10);
                const waHref = waDigits ? `https://wa.me/91${waDigits}` : null;
                const dirHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${loc.name} ${loc.city}`,
                )}`;
                return (
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
                    </div>
                    <Link
                      href={`/spa-locator/${loc.slug}`}
                      style={{
                        display: "block",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 23,
                        fontWeight: 600,
                        color: "#3F3B30",
                        lineHeight: 1.2,
                        marginBottom: 6,
                      }}
                    >
                      Isa Spa &middot; {loc.area ?? loc.name}
                    </Link>
                    <div style={{ fontSize: 14, color: "#8A8478", lineHeight: 1.5 }}>{loc.address}</div>
                    {loc.phone && (
                      <div style={{ fontSize: 13, color: "#B0863A", marginTop: 8, letterSpacing: "0.04em" }}>
                        &#9742; {loc.phone}
                      </div>
                    )}
                    <Link
                      href={`/spa-locator/${loc.slug}`}
                      style={{ display: "inline-block", marginTop: 10, fontSize: 13, color: "#B0863A", fontWeight: 600 }}
                    >
                      View details &rarr;
                    </Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, minWidth: 124 }}>
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
                    {waHref && (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          fontSize: 13,
                          color: "#fff",
                          background: "#25D366",
                          padding: "9px 18px",
                          borderRadius: 999,
                          textAlign: "center",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    <a
                      href={dirHref}
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
                );
              })
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
            <Link href="/contact-us" style={{ fontSize: 14, color: "#B0863A", fontWeight: 600 }}>
              Request a location &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
