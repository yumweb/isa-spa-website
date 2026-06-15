/**
 * Single source of truth for ISA Spa contact details, address and socials.
 * Used by the Contact page, Footer and JSON-LD so the address stays consistent
 * across the whole site.
 */
export const SITE_CONTACT = {
  phone: "99599 95370",
  phoneHref: "tel:+919959995370",
  email: "care@isaspa.in",
  address: {
    lines: [
      "3rd Floor, Above Vijetha Super Market",
      "Laxmi Nagar Colony, Gundlapochampalli",
      "Hyderabad, Telangana 500100",
    ],
    oneLine:
      "3rd Floor, Above Vijetha Super Market, Laxmi Nagar Colony, Gundlapochampalli, Hyderabad, Telangana 500100",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Isa Spa, Gundlapochampalli, Hyderabad, Telangana 500100"),
  },
  franchise: { name: "Mr. Sudheer Parsha", phone: "79938 66884", phoneHref: "tel:+917993866884", email: "sudheerp@isaspa.in" },
  partnerships: { name: "Mr. Ashok Kumar", phone: "73308 11887", phoneHref: "tel:+917330811887", email: "ashok@isaspa.in" },
  social: {
    facebook: "https://facebook.com/isaspa.wellness",
    instagram: "https://instagram.com/isaspawellness",
    linkedin: "https://linkedin.com/company/isaspawellness",
  },
} as const;
