import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { careerSchema, type CareerInput } from "@isa/shared";
import { getCareers } from "@/lib/api";
import { pageMeta } from "@/lib/seo";

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
      <PageHero
        eyebrow="Careers"
        title="Do work that restores people."
        lead="Join a team that treats wellness as a calling. We're always looking for warm, skilled people to grow with ISA Spa."
      />

      <Section className="pt-0">
        <SectionHeading eyebrow="Open roles" title="Current openings" />
        <div className="mt-8">
          {openings.length === 0 ? (
            <Card>
              <p className="text-ink-soft">
                We don't have any specific openings listed right now — but we're always glad to meet great people. Send
                a general application below and we'll reach out when a fitting role opens.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {openings.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="block rounded-2xl border border-sand/50 bg-white/40 p-6 transition hover:border-gold"
                  >
                    <h3 className="font-serif text-2xl text-ink">{job.title}</h3>
                    <p className="mt-2 text-sm text-mute">
                      {[job.location, job.type].filter(Boolean).join(" · ")}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-gold-deep">View role →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section className="pt-0" bare>
        <div className="bg-white/30 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading
              eyebrow="Apply"
              title="Send us your application."
              lead="Share your details and our people team will be in touch about suitable roles."
              center
            />
            <div className="mt-10">
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
        </div>
      </Section>
    </>
  );
}
