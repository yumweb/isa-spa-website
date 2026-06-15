import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Eyebrow } from "@/components/site/primitives";
import { SITE_CONTACT as C } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact ISA Spa",
  description:
    "Get in touch with ISA Spa — general enquiries, our corporate office in Hyderabad, franchise enquiries and brand partnerships. We're here to help.",
  path: "/contact-us",
});

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ECE2CF",
  borderRadius: 18,
  padding: "32px 30px",
};
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#A8823A",
  marginBottom: 12,
};
const linkStyle: React.CSSProperties = { color: "#3F3B30", borderBottom: "1px solid #C8B58C", paddingBottom: 1 };

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow="Contact Us"
        title="We're here to help."
        lead="Whether you're planning a visit, exploring a franchise, or partnering your hotel — reach the right ISA Spa team directly."
      />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 40px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }} className="isa-grid-3">
          {/* General */}
          <div style={cardStyle}>
            <div style={labelStyle}>General Enquiries</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 24, color: "#3F3B30", margin: "0 0 14px" }}>Talk to us</h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 6px" }}>
              <a href={C.phoneHref} style={linkStyle}>{C.phone}</a>
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              <a href={`mailto:${C.email}`} style={linkStyle}>{C.email}</a>
            </p>
          </div>

          {/* Franchise */}
          <div style={cardStyle}>
            <div style={labelStyle}>Franchise Enquiries</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 24, color: "#3F3B30", margin: "0 0 14px" }}>{C.franchise.name}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 6px" }}>
              <a href={C.franchise.phoneHref} style={linkStyle}>{C.franchise.phone}</a>
            </p>
            <Link href="/franchise" style={{ fontSize: 14, color: "#B0863A", fontWeight: 600 }}>Franchise opportunity &rarr;</Link>
          </div>

          {/* Partnerships */}
          <div style={cardStyle}>
            <div style={labelStyle}>Brand Partnerships</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 24, color: "#3F3B30", margin: "0 0 14px" }}>{C.partnerships.name}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 6px" }}>
              <a href={C.partnerships.phoneHref} style={linkStyle}>{C.partnerships.phone}</a>
            </p>
            <Link href="/hotel-partnership" style={{ fontSize: 14, color: "#B0863A", fontWeight: 600 }}>Hotel partnership &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Corporate office */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px 40px" }}>
        <div style={{ ...cardStyle, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }} className="isa-grid-split">
          <div>
            <div style={labelStyle}>Corporate Office</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, lineHeight: 1.5, color: "#4A4738", margin: 0 }}>
              {C.address.lines.map((l, i) => (
                <span key={i}>
                  {l}
                  {i < C.address.lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
          <a
            href={C.address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: "#fff", background: "#C19A4B", padding: "13px 24px", borderRadius: 999, whiteSpace: "nowrap" }}
          >
            View on map
          </a>
        </div>
      </section>

      {/* Book a visit CTA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px 84px" }}>
        <div style={{ background: "linear-gradient(120deg, #2C2219 0%, #221A12 100%)", borderRadius: 22, padding: "52px 40px", textAlign: "center" }}>
          <Eyebrow color="#C7B89D">Looking to book a treatment?</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 38, color: "#F4ECDB", margin: "0 0 16px" }}>
            Find your nearest ISA Spa
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#C7B89D", maxWidth: 520, margin: "0 auto 26px" }}>
            Each outlet has its own team and direct line. Locate the spa closest to you, or request an appointment online.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/spa-locator" style={{ fontSize: 15, color: "#2A211A", background: "#D9B25E", padding: "14px 28px", borderRadius: 999 }}>Open Spa Locator</Link>
            <Link href="/appointment" style={{ fontSize: 15, color: "#F4ECDB", border: "1px solid rgba(217,194,144,0.5)", padding: "14px 28px", borderRadius: 999 }}>Book an Appointment</Link>
          </div>
        </div>
      </section>
    </>
  );
}
