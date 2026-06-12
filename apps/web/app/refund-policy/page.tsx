import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Refund & Returns Policy — ISA Spa",
  description: "ISA Spa's policy on cancellations, refunds and returns for treatments, memberships and gift cards.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund &amp; Returns Policy">
      <p>
        This policy outlines how cancellations, refunds and returns are handled across ISA Spa treatments, memberships
        and gift cards.
      </p>
      <h2>Appointments &amp; cancellations</h2>
      <p>
        We ask that you provide advance notice to reschedule or cancel an appointment. Late cancellations or no-shows
        may be subject to a fee as communicated at the time of booking.
      </p>
      <h2>Treatments</h2>
      <p>
        As services are rendered in person, completed treatments are generally non-refundable. If you are unsatisfied,
        please speak with the outlet manager so we can make it right.
      </p>
      <h2>Memberships</h2>
      <p>
        Membership fees and terms are described at the point of purchase. Eligibility for cancellation or refund
        depends on the plan and usage; please refer to your membership agreement.
      </p>
      <h2>Gift cards</h2>
      <p>Gift cards are non-refundable and non-transferable for cash, except where required by law.</p>
      <h2>Contact</h2>
      <p>For any refund or return request, please reach us through our Contact page.</p>
    </LegalPage>
  );
}
