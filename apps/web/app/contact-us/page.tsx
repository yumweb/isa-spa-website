import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { contactSchema, type ContactInput } from "@isa/shared";
import { getLocations } from "@/lib/api";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact ISA Spa",
  description:
    "Get in touch with ISA Spa. Questions about treatments, memberships or partnerships — send us a message or reach your nearest outlet directly.",
  path: "/contact-us",
});

export const revalidate = 600;

const fields: LeadField<ContactInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Mobile number" },
  { name: "subject", label: "Subject", placeholder: "How can we help?" },
  { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Your message" },
];

export default async function ContactPage() {
  const locations = await getLocations().catch(() => []);
  const featured = locations.slice(0, 6);

  return (
    <Container className="py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">Contact</p>
          <h1 className="mt-4 font-serif text-5xl text-ink">We'd love to hear from you.</h1>
          <p className="mt-4 text-ink-soft">
            Questions about a treatment, membership or partnership? Send us a message and we'll respond soon — or reach
            your nearest sanctuary directly.
          </p>

          {featured.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif text-2xl text-ink">Our spas</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {featured.map((l) => (
                  <li key={l.id} className="rounded-xl border border-sand/50 bg-white/40 p-4">
                    <p className="font-medium text-ink">{l.name}</p>
                    <p className="mt-1 text-sm text-ink-soft">{l.address}</p>
                    {l.phone && (
                      <a href={`tel:${l.phone.replace(/\s+/g, "")}`} className="mt-1 block text-sm text-gold-deep">
                        {l.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Card>
          <LeadForm
            type="CONTACT"
            fields={fields}
            sourcePage="/contact-us"
            submitLabel="Send message"
            successTitle="Message sent."
            successMessage="Thank you for reaching out — we'll get back to you soon."
          />
        </Card>
      </div>
    </Container>
  );
}
