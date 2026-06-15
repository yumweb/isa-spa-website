import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
import { SITE_CONTACT } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy — ISA Spa",
  description:
    "How ISA Spa (Isa Spa Pvt. Ltd.) collects, uses, discloses, stores and protects your personal information, and how to raise a privacy complaint.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Your privacy is respected by us.</p>

      <h2>Information collected by ISA Spa</h2>

      <h3>Personal information from spa owners</h3>
      <p>
        From spa owners, information such as name, address of spa, telephone number, facsimile number, account details,
        contract information and confidential business information. The personal information collected from spa owners
        is used for the following:
      </p>
      <ol>
        <li>day to day business communications with spas;</li>
        <li>providing spa assistance arranging meetings and conferences;</li>
        <li>maintaining account records;</li>
        <li>providing spa contact details to members of the public.</li>
      </ol>

      <h3>Personal information from the community</h3>
      <p>
        From the community, information such as names, contact details and email addresses of members of the public who
        contact Isa Spa Pvt. Ltd. with a request for information or feedback. The personal information collected from
        the community is used for the following:
      </p>
      <ol>
        <li>to respond to those requests;</li>
        <li>to fulfill orders placed with Isa Spa Pvt. Ltd. / Isa Spa by any means;</li>
        <li>
          to provide promotional offers, loyalty programs, newsletters and marketing information to members of the
          public.
        </li>
      </ol>
      <p>
        Personal information from other third parties such as agents, suppliers and contractors who provide services to
        Isa Spa. The personal information collected from other third parties is used to communicate and correspond with
        such persons or organizations.
      </p>

      <h2>How does ISA Spa handle personal information</h2>

      <h3>Use and disclosure of information</h3>
      <ol>
        <li>
          Use and disclose personal information about you that is required in the provision of information about or the
          promotion or delivery of our products or services, administration of Isa Spa business, business analysis, or
          to meet any legal obligation imposed on Isa Spa (Primary Purpose).
        </li>
        <li>
          Use de-identified information for any statistical or other analysis or similar research purposes. We may
          publish or provide this statistical data to other parties.
        </li>
        <li>
          We may use personal information collected from you for the purpose of providing you with direct marketing
          material and information upon your registering your details with us. However, if you wish to cease receiving
          any such information you may let us know either by email or by mail and your request will be looked into within
          5 working days.
        </li>
        <li>
          Personal information may be disclosed to agents, suppliers or external contractors, but only to enable us to
          provide services to you. Such contractors will be required to adopt and adhere to our Privacy Policy.
        </li>
        <li>
          Consistent with National Privacy Principles, Isa Spa will only use or disclose personal information about an
          individual for a Primary Purpose or a purpose other than the Primary Purpose of collection (a Secondary
          Purpose) if:
          <ol>
            <li>
              the Secondary Purpose is related to the Primary Purpose of collection and you would reasonably expect us to
              use or disclose the personal information for the Secondary Purpose;
            </li>
            <li>you have consented to the use or disclosure;</li>
            <li>the use or disclosure is permitted or required under the law;</li>
            <li>
              we reasonably believe on health or public safety grounds that the information should be used for another
              purpose; or
            </li>
            <li>it is otherwise permitted under the National Privacy Principles.</li>
          </ol>
        </li>
      </ol>

      <h3>Manner of collection</h3>
      <p>
        Isa Spa receives personal information from spas and other third parties through direct communications with such
        persons in the normal course of business. Isa Spa may collect personal information about individuals from third
        parties but will only do so in accordance with the National Privacy Principles. Information is collected on
        visiting our website: when you look at this website, a record is made of your visit and, for the purpose of
        analyzing and evaluating the performance and operation of our website, the following information is logged:
      </p>
      <ol>
        <li>your IP address;</li>
        <li>the date and time of your visit to the site;</li>
        <li>the pages you accessed and documents downloaded;</li>
        <li>the previous site you have visited;</li>
        <li>the type of browser you are using.</li>
      </ol>

      <h3>Storage and data protection</h3>
      <ol>
        <li>
          Personal information is contained both in hard copy and electronic format within the offices of Isa Spa.
          Personal information stored electronically is maintained in a secure environment.
        </li>
        <li>
          The above records are only accessible to personnel of Isa Spa who require access to enable them to perform
          their duties. All personnel have signed Privacy and Confidentiality Agreements binding them to comply with the
          Privacy Principles.
        </li>
        <li>
          We take all reasonable steps to ensure that the personal information we collect through our website is
          protected from unauthorized access, loss, misuse, disclosure or alteration. Our website has electronic
          security systems in place, including the use of firewalls. On all pages that require you to enter your personal
          information or payment details on our site, you should look for the padlock icon in your browser.
        </li>
      </ol>

      <h3>Links to other websites</h3>
      <p>
        Although we offer you access to external websites through the links we have provided, those websites are not
        subject to our privacy standards, policies and procedures. We recommend that you make your own enquiries as to
        the Privacy Policies of these third parties. Isa Spa is in no way responsible for the privacy practices of these
        third parties.
      </p>

      <h3>Destruction of records</h3>
      <p>
        Isa Spa will destroy records relating to personal information when such information is no longer necessary to be
        retained within Isa Spa&rsquo;s records. Personal information will be destroyed by shredding or other secure
        process.
      </p>

      <h2>Complaints procedure</h2>
      <ol>
        <li>
          Isa Spa is committed to providing those persons whose personal information it holds a fair and responsible
          system for the handling of complaints concerning the collection, accuracy or disclosure of personal
          information.
        </li>
        <li>
          Should you have any issues concerning your personal information, those complaints should be addressed to the
          Privacy Compliance Officer of Isa Spa, by email at{" "}
          <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a> or by mail at {SITE_CONTACT.address.oneLine}.
        </li>
        <li>
          The Privacy Compliance Officer is empowered to deal with all such complaints as expeditiously as possible
          through Isa Spa&rsquo;s complaints handling process.
        </li>
      </ol>

      <h2>Change in privacy policy</h2>
      <p>
        As we plan to ensure our Privacy Policy remains current, this policy is subject to change. Please return
        periodically to review our Privacy Policy.
      </p>
    </LegalPage>
  );
}
