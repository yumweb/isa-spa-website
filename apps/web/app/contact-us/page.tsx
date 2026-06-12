import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type ContactInput } from "@isa/shared";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Eyebrow } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "Contact ISA Spa",
  description:
    "Get in touch with ISA Spa. Questions about treatments, memberships or partnerships — send us a message or reach our team directly.",
  path: "/contact-us",
});

const fields: LeadField<ContactInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Mobile number" },
  { name: "subject", label: "Subject", placeholder: "How can we help?" },
  { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Your message" },
];

const contactRows = [
  { label: "Call / WhatsApp", value: "99599 95370", href: "tel:+919959995370" },
  { label: "Email", value: "care@isaspa.in", href: "mailto:care@isaspa.in" },
  { label: "Head office", value: "Begumpet, Hyderabad, India", href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow="Contact"
        title="We'd love to hear from you."
        lead="Questions about a treatment, membership or partnership? Send us a message and we'll respond soon — or reach us directly."
      />

      <section
        style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 40px 90px", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "start" }}
        className="isa-grid-split"
      >
        {/* Contact info */}
        <div>
          <Eyebrow>Reach us</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 38, lineHeight: 1.12, color: "#3F3B30", margin: "0 0 28px" }}>
            A sanctuary, a message away
          </h2>
          <div style={{ display: "grid", gap: 18 }}>
            {contactRows.map((row) => (
              <div key={row.label} style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8823A", marginBottom: 6 }}>{row.label}</div>
                {row.href ? (
                  <a href={row.href} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#3F3B30" }}>
                    {row.value}
                  </a>
                ) : (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#3F3B30" }}>{row.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 36 }}>
          <LeadForm
            type="CONTACT"
            fields={fields}
            sourcePage="/contact-us"
            submitLabel="Send message"
            successTitle="Message sent."
            successMessage="Thank you for reaching out — we'll get back to you soon."
          />
        </div>
      </section>
    </>
  );
}
