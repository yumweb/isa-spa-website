"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/spa-locator", label: "Spa Locator" },
  { href: "/isa-spa-membership", label: "Membership" },
  { href: "/franchise", label: "Franchise" },
  { href: "/hotel-partnership", label: "Hotel Partnership" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(247,241,230,0.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E7DCC8",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="Isa Spa — home">
          <Image src="/isa-logo.png" alt="Isa Spa" width={144} height={62} priority style={{ height: 62, width: "auto" }} />
        </Link>

        {/* Desktop nav */}
        <nav className="isa-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#56564A",
                padding: "8px 14px",
                borderBottom: `2px solid ${isActive(n.href) ? "#C19A4B" : "transparent"}`,
              }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/appointment"
            style={{
              marginLeft: 12,
              fontSize: 13,
              letterSpacing: "0.04em",
              color: "#fff",
              background: "#C19A4B",
              padding: "11px 22px",
              borderRadius: 999,
              boxShadow: "0 6px 18px rgba(193,154,75,0.28)",
            }}
          >
            Book Appointment
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="isa-mobile-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="isa-mobile-drawer"
          onClick={() => setOpen((v) => !v)}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            border: "1px solid #E0D2B6",
            borderRadius: 12,
            background: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            color: "#3F3B30",
          }}
        >
          <span style={{ position: "relative", display: "block", width: 20, height: 14 }}>
            <span style={barStyle(open ? "rotate(45deg) translateY(6px)" : "none", 0)} />
            <span style={{ ...barStyle("none", 6), opacity: open ? 0 : 1 }} />
            <span style={barStyle(open ? "rotate(-45deg) translateY(-6px)" : "none", 12)} />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="isa-mobile-drawer"
          className="isa-mobile-drawer"
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #E7DCC8",
            background: "rgba(247,241,230,0.98)",
            padding: "10px 22px 22px",
            gap: 2,
          }}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 15,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: isActive(n.href) ? "#A8823A" : "#56564A",
                padding: "14px 4px",
                borderBottom: "1px solid #EFE6D3",
                fontWeight: isActive(n.href) ? 700 : 500,
              }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/appointment"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 16,
              textAlign: "center",
              fontSize: 15,
              color: "#fff",
              background: "#C19A4B",
              padding: "14px 22px",
              borderRadius: 999,
              boxShadow: "0 6px 18px rgba(193,154,75,0.28)",
            }}
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}

function barStyle(transform: string, top: number): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    top,
    width: 20,
    height: 2,
    background: "#3F3B30",
    borderRadius: 2,
    transition: "transform .2s ease, opacity .2s ease",
    transform,
  };
}
