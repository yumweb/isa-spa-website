import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
import { SITE_CONTACT } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms & Conditions — ISA Spa",
  description:
    "The terms and conditions governing your use of the ISA Spa (Isa Spa Pvt. Ltd.) website, including copyright, trademarks, disclaimers and liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions">
      <p>
        Welcome to our website. Isa Spa (Isa Spa Pvt. Ltd.) provides various services on this site subject to the
        following terms and conditions. By accessing and using this website you acknowledge that you have read these
        conditions and agree, without limitation, to be bound by them.
      </p>

      <h2>Privacy</h2>
      <p>
        At Isa Spa we are committed to the protection of personal information provided to us. We believe that respect for
        your privacy forms part of the ongoing trust we wish to develop with you. Isa Spa follows various principles
        concerning the collection, storage and use of personal information as outlined in the Privacy Principles.
      </p>
      <p>
        To deliver on this commitment, Isa Spa has developed its policy concerning the management of personal information
        (the &ldquo;Privacy Policy&rdquo;). The elements of that policy deal with:
      </p>
      <ol>
        <li>the way we collect, use and disclose personal information;</li>
        <li>the way we protect the quality and security of such personal information;</li>
        <li>the way that access can be granted to personal information held by us;</li>
        <li>
          the manner of dealing with any complaints concerning the correctness of or access to personal information held
          by us.
        </li>
      </ol>
      <p>Our Privacy Policy is available:</p>
      <ol>
        <li>
          on the website: <a href="/privacy-policy">www.isaspa.in/privacy-policy</a>;
        </li>
        <li>
          by mail, inquiries to be addressed to the Privacy Compliance Officer, Isa Spa Pvt. Ltd.,{" "}
          {SITE_CONTACT.address.oneLine}.
        </li>
      </ol>

      <h2>Copyright</h2>
      <p>
        The material contained in this site is the copyright of Isa Spa Pvt. Ltd. &amp; Wellness Limited (&ldquo;Isa
        Spa&rdquo;) and is protected by Indian and international copyright laws. The site and the data in it are supplied
        solely for informational use. Apart from permitted uses under the Copyright Act, and except for the temporary
        copy held in your computer&rsquo;s cache and downloading for private use, no part of the material or data
        contained in this site may be reproduced, altered, transmitted or re-used for any purpose whatsoever without the
        written permission of Isa Spa Pvt. Ltd. &amp; Wellness Limited.
      </p>

      <h2>Trade Marks</h2>
      <p>
        &ldquo;Isa Spa&rdquo; is the registered trade mark of Isa Spa Pvt. Ltd., registered in India and licensed to Isa
        Spa Pvt. Ltd. &amp; Wellness Limited. Other marks, symbols or featured words used to describe goods and services
        that appear in this site are either registered trademarks or the property of Isa Spa Pvt. Ltd. &amp; Wellness
        Limited or of their respective owners. Nothing displayed on this website shall be construed as granting any
        license or right of use of any logo, or trade mark displayed on the website without the express permission of the
        relevant owner.
      </p>

      <h2>Website Content and Materials</h2>
      <p>
        The information and materials contained in this site (including these terms and conditions) are subject to change
        without notice. We may discontinue or make changes to the content of this site and the network at any time. Any
        dated information included in this site is current at the date of publication only, and we will not have any
        obligation or responsibility to update or amend such information.
      </p>

      <h2>No Warranties</h2>
      <p>
        This website is provided without any express warranties or guarantees, unless specifically stated and, to the
        extent permitted by law, without any implied warranties or guarantees.
      </p>

      <h2>Links to Third Party Websites</h2>
      <p>
        Links to other websites may be provided from this site. In those circumstances we have no control over the
        content of those third party websites. We make no express warranties concerning the content of those other
        sites. In particular we do not warrant the accuracy, completeness or reliability of those sites for a particular
        purpose, nor do we warrant that such sites or their content are accurate, complete, current or free of defects
        including but not limited to viruses or other harmful elements. The user of this site will assume all risks and
        costs arising from the use of any website linked to this site.
      </p>

      <h2>Disclaimer</h2>
      <p>
        This website is presented &ldquo;as is&rdquo;. We make no representations or warranties of any kind whether
        express or implied in connection with material on this website including but not limited to warranties as to
        merchantability, non-infringement of intellectual property or fitness for a particular purpose, to the extent to
        which such representations and warranties may lawfully be excluded.
      </p>
      <p>
        You agree that we will not be liable for any loss or damage which you incur as a result of use of this website
        including without limitation, damage caused by access delays, computer viruses, system failure or malfunction
        which may occur in your use of the website including hyperlink to or from third party websites.
      </p>
      <p>
        To the maximum extent permitted by law we disclaim liability for any direct, indirect, incidental or
        consequential damage of any kind related to your use of this site.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Isa Spa and any affiliated organizations, and its directors, officers
        and employees from any claim or demand including reasonable legal fees, made by any third party due to or arising
        out of your use of this site or any violation of these terms and conditions.
      </p>

      <h2>No Offer of Products or Services</h2>
      <p>
        Nothing contained in this site will constitute an offer by Isa Spa for any products or services which may be
        advertised through the site including its micro site pages. Nor does Isa Spa make any specific warranty or
        representation of any kind with respect to any such information. Isa Spa will not be liable to you or any person
        who incurs any loss or damage as a result of relying upon any such information.
      </p>

      <h2>Your Feedback</h2>
      <p>
        We welcome inquiries or feedback on Isa Spa Pvt. Ltd. &amp; Wellness Limited products or any ideas you may have.
        Unless specifically stated by you, we shall treat any information you provide us with as non-proprietary and
        non-confidential. You can reach us at <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>.
      </p>
    </LegalPage>
  );
}
