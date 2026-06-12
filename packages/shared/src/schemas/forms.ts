import { z } from "zod";
import { FORM_TYPES } from "../constants.js";

/**
 * Public form schemas. Each is validated on the client (RHF resolver) AND on
 * the API boundary. `honeypot` must be empty (bots fill it); the API rejects
 * non-empty values. All forms are stored in the unified `form_submissions` table.
 */

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20)
  .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number");

const name = z.string().trim().min(2, "Please enter your name").max(120);
const city = z.string().trim().min(2).max(120);
const honeypot = z.string().max(0).optional(); // must stay empty

export const appointmentSchema = z.object({
  name,
  phone,
  locationId: z.coerce.number().int().positive().optional(),
  locationLabel: z.string().trim().max(160).optional(),
  service: z.string().trim().max(160).optional(),
  preferredDate: z.string().trim().max(40).optional(),
  preferredTime: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
  honeypot,
});

export const franchiseSchema = z.object({
  name,
  phone, // "Phone / WhatsApp" in the design
  city,
  investmentCapacity: z.string().trim().max(120).optional(), // e.g. "₹25–40L"
  honeypot,
});

export const hotelSchema = z.object({
  name,
  hotelName: z.string().trim().min(2, "Hotel / group name").max(200),
  city,
  rooms: z.coerce.number().int().positive().max(100000).optional(),
  email: z.string().trim().email("Enter a valid work email"),
  honeypot,
});

export const contactSchema = z.object({
  name,
  email: z.string().trim().email().optional(),
  phone: phone.optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Please add a message").max(4000),
  honeypot,
});

export const careerSchema = z.object({
  name,
  email: z.string().trim().email(),
  phone,
  role: z.string().trim().max(160).optional(),
  city: city.optional(),
  message: z.string().trim().max(4000).optional(),
  // resumeUrl set server-side after upload
  resumeUrl: z.string().url().optional(),
  honeypot,
});

export const membershipSchema = z.object({
  name,
  phone,
  email: z.string().trim().email().optional(),
  city: city.optional(),
  plan: z.string().trim().max(120).optional(),
  honeypot,
});

export const giftCardSchema = z.object({
  name,
  email: z.string().trim().email(),
  phone: phone.optional(),
  amount: z.coerce.number().positive().optional(),
  recipientName: z.string().trim().max(120).optional(),
  message: z.string().trim().max(1000).optional(),
  honeypot,
});

/** Map of form type -> schema, used by the generic submission endpoint. */
export const formSchemas = {
  APPOINTMENT: appointmentSchema,
  FRANCHISE: franchiseSchema,
  HOTEL: hotelSchema,
  CONTACT: contactSchema,
  CAREER: careerSchema,
  MEMBERSHIP: membershipSchema,
  GIFT_CARD: giftCardSchema,
} as const;

export const submissionEnvelope = z.object({
  type: z.enum(FORM_TYPES),
  sourcePage: z.string().trim().max(255).optional(),
  // Turnstile token (verified server-side when configured)
  captchaToken: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type FranchiseInput = z.infer<typeof franchiseSchema>;
export type HotelInput = z.infer<typeof hotelSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CareerInput = z.infer<typeof careerSchema>;
export type MembershipInput = z.infer<typeof membershipSchema>;
export type GiftCardInput = z.infer<typeof giftCardSchema>;
