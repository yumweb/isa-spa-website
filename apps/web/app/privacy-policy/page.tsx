import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy — ISA Spa",
  description: "How ISA Spa collects, uses and protects your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        ISA Spa (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what personal
        information we collect, how we use it, and the choices you have.
      </p>
      <h2>Information we collect</h2>
      <p>
        We collect details you provide through our forms — such as your name, phone number, email and message — when
        you book an appointment, enquire about membership, franchise or partnership, or contact us. We may also collect
        limited technical data (such as IP address) for security and analytics.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your information to respond to enquiries, schedule appointments, process requests, improve our services
        and, where you have consented, send you relevant offers. We do not sell your personal data.
      </p>
      <h2>Data retention &amp; security</h2>
      <p>
        We retain submissions only as long as necessary for the purposes above and apply reasonable safeguards to
        protect them. Despite our efforts, no method of transmission over the internet is completely secure.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information by contacting us via the
        Contact page.
      </p>
      <h2>Contact</h2>
      <p>For any privacy questions, please reach us through our Contact page.</p>
    </LegalPage>
  );
}
