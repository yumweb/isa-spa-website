import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { careerSchema, type CareerInput } from "@isa/shared";
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

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumbs crumbs={crumbs} />
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <article>
          <h1 className="font-serif text-4xl text-ink md:text-5xl">{job.title}</h1>
          <p className="mt-3 text-mute">{[job.location, job.type].filter(Boolean).join(" · ")}</p>
          <div
            className="richtext mt-8"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </article>

        <Card className="lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl text-ink">Apply for this role</h2>
          <p className="mt-2 text-sm text-ink-soft">We'll get back to you about next steps.</p>
          <div className="mt-6">
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
        </Card>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }} />
    </Container>
  );
}
