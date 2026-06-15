import Link from "next/link";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { type AppointmentInput } from "@isa/shared";
import { getLocations } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/Hero";

export const metadata = pageMeta({
  title: "Book a Spa Appointment — ISA Spa",
  description:
    "Reserve your ISA Spa ritual. Pick your nearest outlet, choose a therapy and preferred time — our team will confirm your booking shortly.",
  path: "/appointment",
});

export const revalidate = 600;

// Bookable slots: 10:00 AM to 8:00 PM, every 30 minutes, in AM/PM format.
const TIME_SLOTS: { value: string; label: string }[] = [];
for (let mins = 10 * 60; mins <= 20 * 60; mins += 30) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const label = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  TIME_SLOTS.push({ value: label, label });
}

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
    { name: "preferredTime", label: "Preferred time", type: "select", placeholder: "Choose a slot (10 AM–8 PM)", options: TIME_SLOTS },
    { name: "notes", label: "Anything we should know?", type: "textarea", placeholder: "Optional notes" },
  ];

  return (
    <>
      <Hero
        eyebrow="Book a ritual"
        title="Reserve your moment of calm."
        lead="Share a few details and our team will confirm your appointment."
      >
        <p style={{ fontSize: 15, color: "#8A8478", marginTop: 14 }}>
          Prefer to talk?{" "}
          <Link href="/spa-locator" style={{ color: "#B0863A", borderBottom: "1px solid #C8B58C", paddingBottom: 2 }}>
            Call your nearest outlet
          </Link>
        </p>
      </Hero>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "56px 40px 90px" }}>
        <div style={{ background: "#fff", border: "1px solid #ECE2CF", borderRadius: 18, padding: 40, boxShadow: "0 24px 56px rgba(80,60,30,0.08)" }}>
          <LeadForm
            type="APPOINTMENT"
            fields={fields}
            sourcePage="/appointment"
            submitLabel="Request appointment"
            successTitle="Request received."
            successMessage="Our team will call or message you shortly to confirm your booking."
          />
        </div>
      </section>
    </>
  );
}
