/**
 * Static marketing copy decoded from the ISA Spa prototype
 * (`packages/db/prisma/seed-data.json`). Kept inline so marketing sections
 * render without an API round-trip and stay stable across CMS edits.
 */

export const aboutValues = [
  { title: "Reverence", desc: "Every guest is treated with the grace their unique energy deserves." },
  { title: "Mastery", desc: "Highly trained therapists and bespoke therapies, never one-size-fits-all." },
  {
    title: "Accessibility",
    desc: "World-class spa experiences made an affordable luxury, in your neighbourhood.",
  },
] as const;

export const aboutPresence = [
  "Hyderabad",
  "Bengaluru",
  "Varanasi",
  "Tirupati",
  "Dharamshala",
  "Bhubaneswar",
  "Gulbarga",
] as const;

export const franchiseWhy = [
  {
    num: "01",
    title: "A trusted, loved brand",
    desc: "Step into a name synonymous with luxury, quality and exceptional service — already enjoying customer loyalty and credibility.",
  },
  {
    num: "02",
    title: "End-to-end training",
    desc: "Extensive training across treatments, customer service, business management and marketing for you and your team.",
  },
  {
    num: "03",
    title: "Proven, profitable model",
    desc: "Unit economics refined across 50+ spas. A booming wellness market and strong, repeatable returns.",
  },
  {
    num: "04",
    title: "Site selection & design",
    desc: "We help you choose a high-footfall location and deliver a turnkey boutique spa fit-out.",
  },
  {
    num: "05",
    title: "Marketing that fills chairs",
    desc: "National brand campaigns plus local activation, digital and reputation management on your behalf.",
  },
  {
    num: "06",
    title: "Ongoing operational support",
    desc: "Dedicated guidance on staffing, supply chain, SOPs and quality — so your spa runs to ISA standards from day one.",
  },
] as const;

export const franchiseSteps = [
  { step: "1", title: "Enquire", desc: "Share your city and investment capacity. We send the franchise kit within 24 hours." },
  { step: "2", title: "Evaluate", desc: "Review unit economics with our team and finalise your location together." },
  { step: "3", title: "Build", desc: "We design, fit out and staff your spa while training your team to Isa standards." },
  { step: "4", title: "Open", desc: "Launch with a marketing blitz and ongoing operational support from day one." },
] as const;

export const hotelModels = [
  {
    tag: "Fully Managed",
    title: "We run it for you",
    desc: "Isa designs, staffs and operates the spa entirely. You provide the space; we deliver the experience and a share of revenue.",
    best: "Best for: hotels wanting zero operational involvement.",
  },
  {
    tag: "Revenue Share",
    title: "Partner & profit",
    desc: "A collaborative model where investment and returns are shared, aligning both teams around guest satisfaction and growth.",
    best: "Best for: properties seeking aligned, long-term upside.",
  },
  {
    tag: "Licensed",
    title: "Your team, our brand",
    desc: "Operate under the Isa Spa name with our SOPs, training, product line and brand standards backing your in-house team.",
    best: "Best for: groups with existing wellness operations.",
  },
] as const;

export const hotelBenefits = [
  {
    title: "Elevated guest experience",
    desc: "A signature wellness amenity that lifts reviews, loyalty and average length of stay.",
  },
  {
    title: "A new revenue stream",
    desc: "Monetise underused space with treatments, memberships and retail — with minimal capex from you.",
  },
  {
    title: "Trusted brand on your floor",
    desc: "Borrow the equity of India's most luxurious day spa chain to differentiate your property.",
  },
  {
    title: "Zero operational burden",
    desc: "We handle hiring, training, supplies, compliance and day-to-day management.",
  },
] as const;

type MembershipPlan = {
  name: string;
  price: string;
  tagline: string;
  perks: string[];
  featured?: boolean;
};

export const membershipPlans: MembershipPlan[] = [
  {
    name: "Glow",
    price: "₹9,999 / year",
    tagline: "For the regular self-carer.",
    perks: ["10% off all treatments", "Priority weekday booking", "Birthday ritual on us", "Member-only seasonal offers"],
  },
  {
    name: "Serene",
    price: "₹19,999 / year",
    tagline: "Our most-loved tier.",
    perks: [
      "15% off all treatments",
      "One complimentary signature therapy / quarter",
      "Priority booking, all days",
      "Complimentary upgrades when available",
      "Member-only seasonal offers",
    ],
    featured: true,
  },
  {
    name: "Divine",
    price: "₹34,999 / year",
    tagline: "The full ISA indulgence.",
    perks: [
      "20% off all treatments",
      "One complimentary signature therapy / month",
      "Guaranteed priority booking",
      "Complimentary upgrades & add-ons",
      "Dedicated wellness concierge",
    ],
  },
] as const;
