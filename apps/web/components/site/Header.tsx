"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/spa-locator", label: "Spa Locator" },
  { href: "/about-us", label: "About" },
  { href: "/franchise", label: "Franchise" },
  { href: "/hotel-partnership", label: "Hotels" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

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
          <Image src="/isa-logo.png" alt="Isa Spa" width={120} height={52} priority style={{ height: 52, width: "auto" }} />
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
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
      </div>
    </header>
  );
}
