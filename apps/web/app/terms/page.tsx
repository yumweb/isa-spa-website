import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms & Conditions — ISA Spa",
  description: "The terms governing your use of the ISA Spa website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions">
      <p>
        These terms govern your use of the ISA Spa website and the services we offer. By using our site or booking with
        us, you agree to these terms.
      </p>
      <h2>Use of the website</h2>
      <p>
        You agree to use this website lawfully and not to misuse our forms or content. Information on the site is
        provided for general purposes and may change without notice.
      </p>
      <h2>Bookings &amp; enquiries</h2>
      <p>
        Form submissions are requests, not confirmed bookings. Appointments are confirmed by our team. Prices,
        treatments and availability may vary by outlet.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All trademarks, content and branding on this site belong to ISA Spa and may not be used without permission.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, ISA Spa is not liable for indirect or consequential losses arising from use of
        this website.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent through our Contact page.</p>
    </LegalPage>
  );
}
