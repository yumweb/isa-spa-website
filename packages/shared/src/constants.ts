/**
 * Shared constants — design tokens (decoded from the prototype) and enums.
 * Keep these the single source of truth across web, admin, and api.
 */

/** Brand design tokens extracted from `ISA Spa - Standalone.html`. */
export const tokens = {
  color: {
    cream: "#F7F1E6", // page background
    gold: "#C19A4B", // primary accent
    goldDeep: "#A8823A",
    ink: "#3F3B30", // primary text
    inkSoft: "#56564A",
    sand: "#C7B89D",
    espresso: "#342A1F",
    mute: "#8E8169",
  },
  font: {
    serif: "'Cormorant Garamond', Georgia, serif", // headings
    sans: "'Mulish', -apple-system, BlinkMacSystemFont, sans-serif", // body
  },
} as const;

/** Lead/form types — mirrors `FormType` enum in prisma schema. */
export const FORM_TYPES = [
  "APPOINTMENT",
  "FRANCHISE",
  "HOTEL",
  "CONTACT",
  "CAREER",
  "MEMBERSHIP",
  "GIFT_CARD",
] as const;
export type FormType = (typeof FORM_TYPES)[number];

export const SUBMISSION_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export const ROLES = ["ADMIN", "EDITOR"] as const;
export type Role = (typeof ROLES)[number];

// ─── AI blog generator ───
export const GENERATION_STATUSES = ["PENDING", "RUNNING", "COMPLETED", "FAILED"] as const;
export type GenerationStatus = (typeof GENERATION_STATUSES)[number];

export const GENERATION_TRIGGERS = ["MANUAL", "SCHEDULED"] as const;
export type GenerationTrigger = (typeof GENERATION_TRIGGERS)[number];

/**
 * Default wellness content pillars the generator rotates through on scheduled
 * runs (editable in the CMS Settings `aiBlog.pillars` key). Each is a broad
 * theme; the researcher derives a specific, seasonal topic within it.
 */
export const CONTENT_PILLARS = [
  "Signature massage therapies & their benefits",
  "Facials, skincare & glowing complexion",
  "Foot spa, reflexology & pedicure care",
  "Body polishing, scrubs & detox rituals",
  "Self-care rituals & mindful wellness",
  "Ayurveda & traditional Indian wellness",
  "Stress relief, sleep & mental calm",
  "Spa etiquette & first-visit guides",
  "Seasonal & festive wellness in India",
  "Couples, gifting & special-occasion spa experiences",
] as const;
