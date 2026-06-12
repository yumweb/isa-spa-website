import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type CareerInput } from "@isa/shared";
import { getCareers, getCareer } from "@/lib/api";
import { pageMeta, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export const revalidate = 600;

export async function generateStaticParams() {
  const openings = await getCareers().catch(() => []);
  return openings.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getCareer(slug).catch(() => null);
  if (!job) return pageMeta({ title: "Role not found — ISA Spa", path: `/careers/${slug}` });
  return pageMeta({
    title: `${job.title} — Careers at ISA Spa`,
    description: `${job.title}${job.location ? ` in ${job.location}` : ""}. Join the ISA Spa team.`,
    path: `/careers/${job.slug}`,
  });
}

const fields: LeadField<CareerInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
  { name: "city", label: "Preferred city", placeholder: "Where you'd like to work" },
  { name: "message", label: "Tell us about yourself", type: "textarea", placeholder: "Experience, availability, etc." },
];

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getCareer(slug).catch(() => null);
  if (!job) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: job.title, path: `/careers/${job.slug}` },
  ];
  const meta = [job.location, job.type].filter(Boolean).join(" · ");

  return (
    <>
      {/* ===== HEADER BAND ===== */}
      <section style={{ background: "radial-gradient(120% 100% at 50% 0%, #FBF6EC 0%, #F1E7D2 100%)", padding: "40px 40px 56px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Breadcrumbs crumbs={crumbs} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 52, lineHeight: 1.13, color: "#3F3B30", margin: "20px 0 10px" }}>
            {job.title}
          </h1>
          {meta && <p style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A9486", margin: 0 }}>{meta}</p>}
        </div>
      </section>

      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 40px 90px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "start" }}
        className="isa-grid-split"
      >
        <article>
          <div className="richtext" dangerouslySetInnerHTML={{ __html: job.description }} />
        </article>

        <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 32, position: "sticky", top: 96 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 26, color: "#3F3B30", margin: "0 0 6px" }}>Apply for this role</h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#8A8478", margin: "0 0 22px" }}>We&rsquo;ll get back to you about next steps.</p>
          <LeadForm
            type="CAREER"
            fields={fields}
            sourcePage={`/careers/${job.slug}`}
            defaults={{ role: job.title } as Partial<CareerInput>}
            submitLabel="Submit application"
            successTitle="Application received."
            successMessage="Thank you — our people team will be in touch about this role."
          />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }} />
    </>
  );
}
