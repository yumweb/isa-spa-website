import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { membershipSchema, type MembershipInput } from "@isa/shared";
import { pageMeta } from "@/lib/seo";
import { membershipPlans } from "@/lib/marketing";

export const metadata = pageMeta({
  title: "ISA Spa Membership — Wellness, Rewarded",
  description:
    "Join ISA Spa membership for year-round savings, priority booking and complimentary signature therapies. Glow, Serene and Divine tiers for every self-care ritual.",
  path: "/isa-spa-membership",
});

const fields: LeadField<MembershipInput>[] = [
  { name: "name", label: "Full name", required: true, placeholder: "Your name" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "Mobile number" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "city", label: "City", placeholder: "Your city" },
  {
    name: "plan",
    label: "Preferred plan",
    type: "select",
    placeholder: "Choose a tier",
    options: membershipPlans.map((p) => ({ value: p.name, label: `${p.name} — ${p.price}` })),
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Wellness, rewarded all year."
        lead="Make self-care a habit, not a treat. ISA membership unlocks year-round savings, priority booking and complimentary signature rituals."
      />

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {membershipPlans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "border-gold bg-white/70 ring-1 ring-gold/40" : ""}
            >
              {plan.featured && (
                <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  Most loved
                </span>
              )}
              <h2 className="mt-3 font-serif text-3xl text-ink">{plan.name}</h2>
              <p className="mt-1 text-gold-deep">{plan.price}</p>
              <p className="mt-2 text-sm text-ink-soft">{plan.tagline}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span aria-hidden className="text-gold-deep">
                      ✦
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-0" bare>
        <div className="bg-white/30 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading
              eyebrow="Enquire"
              title="Tell us which tier suits you."
              lead="Share your details and a wellness advisor will help you pick the perfect membership."
              center
            />
            <div className="mt-10">
              <LeadForm
                type="MEMBERSHIP"
                fields={fields}
                sourcePage="/isa-spa-membership"
                submitLabel="Request membership details"
                successTitle="You're one step closer."
                successMessage="A wellness advisor will reach out with membership details shortly."
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
