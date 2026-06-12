import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { appointmentSchema, type AppointmentInput } from "@isa/shared";
import { getLocations } from "@/lib/api";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Book a Spa Appointment — ISA Spa",
  description:
    "Reserve your ISA Spa ritual. Pick your nearest outlet, choose a therapy and preferred time — our team will confirm your booking shortly.",
  path: "/appointment",
});

export const revalidate = 600;

export default async function AppointmentPage() {
  const locations = await getLocations().catch(() => []);

  const fields: LeadField<AppointmentInput>[] = [
    { name: "name", label: "Full name", required: true, placeholder: "Your name" },
    { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
    {
      name: "locationId",
      label: "Preferred spa",
      type: "select",
      placeholder: "Choose an outlet",
      options: locations.map((l) => ({ value: String(l.id), label: `${l.name}${l.city ? ` — ${l.city}` : ""}` })),
    },
    { name: "service", label: "Therapy", placeholder: "e.g. Deep Tissue Massage" },
    { name: "preferredDate", label: "Preferred date", type: "date" },
    { name: "preferredTime", label: "Preferred time", type: "time" },
    { name: "notes", label: "Anything we should know?", type: "textarea", placeholder: "Optional notes" },
  ];

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold-deep">Book a ritual</p>
          <h1 className="mt-4 font-serif text-5xl text-ink">Reserve your moment of calm.</h1>
          <p className="mt-4 text-ink-soft">
            Share a few details and our team will confirm your appointment. Prefer to talk? Call your nearest outlet
            from the spa locator.
          </p>
        </div>
        <Card className="mt-10">
          <LeadForm
            type="APPOINTMENT"
            fields={fields}
            sourcePage="/appointment"
            submitLabel="Request appointment"
            successTitle="Request received."
            successMessage="Our team will call or message you shortly to confirm your booking."
          />
        </Card>
      </div>
    </Container>
  );
}
