import Link from "next/link";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type CareerInput } from "@isa/shared";
import { getCareers } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { Eyebrow } from "@/components/site/primitives";

export const metadata = pageMeta({
  title: "Careers at ISA Spa — Join Our Team",
  description:
    "Build a career in wellness with ISA Spa. Explore open roles for therapists, managers and support staff across our 50+ outlets, or send a general application.",
  path: "/careers",
});

export const revalidate = 600;

export default async function CareersPage() {
  const openings = await getCareers().catch(() => []);

  const fields: LeadField<CareerInput>[] = [
    { name: "name", label: "Full name", required: true, placeholder: "Your name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
    { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
    {
      name: "role",
      label: "Role you're applying for",
      type: openings.length ? "select" : "text",
      placeholder: openings.length ? "Select a role" : "e.g. Spa Therapist",
      options: openings.length
        ? [...openings.map((o) => ({ value: o.title, label: o.title })), { value: "General application", label: "General application" }]
        : undefined,
    },
    { name: "city", label: "Preferred city", placeholder: "Where you'd like to work" },
    { name: "message", label: "Tell us about yourself", type: "textarea", placeholder: "Experience, availability, etc." },
  ];

  return (
    <>
      <Hero
        eyebrow="Careers"
        title="Do work that restores people."
        lead="Join a team that treats wellness as a calling. We're always looking for warm, skilled people to grow with ISA Spa."
      />

      {/* ===== OPEN ROLES ===== */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 40px 40px" }}>
        <div style={{ marginBottom: 36 }}>
          <Eyebrow>Open roles</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 42, color: "#3F3B30", margin: 0 }}>Current openings</h2>
        </div>

        {openings.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: "40px 36px" }}>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", margin: 0 }}>
              We don&rsquo;t have any specific openings listed right now &mdash; but we&rsquo;re always glad to meet great people.
              Send a general application below and we&rsquo;ll reach out when a fitting role opens.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="isa-grid-3">
            {openings.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: "30px 28px", display: "block" }}
              >
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 26, color: "#3F3B30", margin: "0 0 8px" }}>{job.title}</h3>
                {[job.location, job.type].filter(Boolean).length > 0 && (
                  <p style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9486", margin: "0 0 16px" }}>
                    {[job.location, job.type].filter(Boolean).join(" · ")}
                  </p>
                )}
                <span style={{ fontSize: 14, color: "#B0863A", fontWeight: 600 }}>View role &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== APPLICATION FORM ===== */}
      <section style={{ background: "#FBF7EF", borderTop: "1px solid #EFE6D3", marginTop: 40 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "84px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Eyebrow>Apply</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 42, color: "#3F3B30", margin: "0 0 14px" }}>
              Send us your application
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#6E6F62", maxWidth: 480, margin: "0 auto" }}>
              Share your details and our people team will be in touch about suitable roles.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 36 }}>
            <LeadForm
              type="CAREER"
              fields={fields}
              sourcePage="/careers"
              submitLabel="Submit application"
              successTitle="Application received."
              successMessage="Thank you for your interest in ISA Spa — our people team will be in touch."
            />
          </div>
        </div>
      </section>
    </>
  );
}
