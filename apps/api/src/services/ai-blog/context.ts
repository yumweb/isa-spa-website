/**
 * Brand context injected into every prompt so the model writes as ISA Spa,
 * plus the AI-ism blacklist the quality checker penalises.
 */
export const ISA_CONTEXT = `ISA Spa is India's most luxurious spa chain, with 50+ outlets across 12 cities (Hyderabad, Bengaluru, Varanasi, Tirupati, Dharamshala, Bhubaneswar, Gulbarga and more).

Brand essence: "Isa means God" — therapies are treated as mindful, sacred rituals that help guests reconnect with their inner divinity. The promise: a world-class spa & skincare experience as an affordable luxury, in your neighbourhood.

Service pillars: (1) Signature Therapy massages (Deep Tissue, Swedish, Balinese Aroma, Champi), (2) Foot Spa & Pedicure / reflexology, (3) Skin Treatments & Body Polishing, (4) Facials & Clean-Ups.

Audience: Indian urban professionals and wellness-seekers (25-55), plus prospective franchisees and hotel partners. Locale: India (en-IN spelling, ₹ pricing, Indian seasons/festivals where relevant).

Tone: warm, serene, reverent, sensory and elegant — never clinical, never hypey. Sophisticated but welcoming. Avoid medical claims; frame benefits as wellbeing and relaxation, not treatment of disease.`;

/** Per-audience framing the researcher/writer/quality steps adapt to. */
export type AudienceBrief = {
  reader: string;
  focus: string;
  linkHint: string;
  cta: string;
  /** How strictly the article must revolve around ISA's actual treatments. */
  grounding: string;
};

export function audienceBrief(audience: "Consumer" | "Franchise" | "Hotel"): AudienceBrief {
  switch (audience) {
    case "Franchise":
      return {
        reader: "a prospective franchisee / investor evaluating a spa business in India",
        focus:
          "the business opportunity — market growth, unit economics, ROI, risk reduction, brand support, operations. B2B and credible, not a treatment guide.",
        linkHint: "link to the franchise page (/franchise) where relevant",
        cta: "a confident CTA to explore the ISA franchise (request the franchise kit / talk to the franchise team) linking /franchise",
        grounding:
          "This is a BUSINESS article. Do NOT centre it on spa treatments. You MAY cite ISA's real scale (50+ outlets, 12 cities) and its service categories as the product, but NEVER invent treatments ISA doesn't offer. No medical claims.",
      };
    case "Hotel":
      return {
        reader: "a hotelier / hospitality decision-maker (GM, owner, group) considering a spa for their property",
        focus:
          "guest experience, additional revenue, brand differentiation and zero operational burden via a turnkey spa partner. B2B and practical, not a treatment guide.",
        linkHint: "link to the hotel partnership page (/hotel-partnership) where relevant",
        cta: "a CTA to discuss a hotel spa collaboration (request a proposal) linking /hotel-partnership",
        grounding:
          "This is a BUSINESS article for hoteliers. Do NOT centre it on individual treatments. You MAY reference ISA's turnkey hotel model and real service categories, but NEVER invent treatments ISA doesn't offer. No medical claims.",
      };
    default: // Consumer
      return {
        reader: "an Indian urban wellness-seeker (25-55) considering a spa visit",
        focus: "wellbeing, relaxation and the experience of ISA's treatments — warm, sensory and reassuring.",
        linkHint: "link to /services and /spa-locator where relevant",
        cta: "a gentle CTA to book a ritual (/appointment) or find a nearby ISA Spa (/spa-locator)",
        grounding:
          "The article MUST centre on real treatments from the ISA service menu, using their EXACT names. NEVER invent or imply treatments ISA doesn't offer (no Abhyanga, Shirodhara, hot-stone, Thai, prenatal, etc. unless on the menu). No medical claims — frame benefits as wellbeing/relaxation.",
      };
  }
}

/** AI-tell phrases the quality checker flags (−2 pts each). */
export const AI_ISM_PHRASES = [
  "in conclusion",
  "in today's fast-paced world",
  "it's important to note",
  "it is important to note",
  "let's dive in",
  "let's delve",
  "delve into",
  "embark on a journey",
  "tapestry",
  "in the realm of",
  "navigating the",
  "a testament to",
  "when it comes to",
  "look no further",
  "unlock the secrets",
  "elevate your",
  "game-changer",
  "in this article, we will",
  "whether you're",
  "the world of",
] as const;
