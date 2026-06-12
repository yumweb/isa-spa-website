import { z } from "zod";
import { PUBLISH_STATUSES, ROLES } from "../constants.js";

/** Admin-side content schemas for CMS CRUD (validated in the API). */

const seo = z.object({
  metaTitle: z.string().trim().max(200).optional(),
  metaDescription: z.string().trim().max(400).optional(),
  ogImage: z.string().trim().max(500).optional(),
  canonical: z.string().trim().max(500).optional(),
});

const slug = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase, hyphen-separated slug");

const status = z.enum(PUBLISH_STATUSES);

export const locationSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug,
  city: z.string().trim().min(2).max(120),
  area: z.string().trim().max(120).optional(),
  address: z.string().trim().min(4).max(400),
  phone: z.string().trim().max(40).optional(),
  whatsapp: z.string().trim().max(40).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  mapUrl: z.string().url().optional(),
  hours: z.record(z.string()).optional(),
  images: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  status,
  seo: seo.optional(),
});

export const serviceCategorySchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug,
  tagline: z.string().trim().max(400).optional(),
  heroImage: z.string().trim().max(500).optional(),
  order: z.number().int().default(0),
  seo: seo.optional(),
});

export const serviceSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(2).max(200),
  slug,
  duration: z.string().trim().max(80).optional(), // "60 / 90 min"
  price: z.string().trim().max(80).optional(), // "₹1,999"
  description: z.string().trim().max(1000).optional(),
  image: z.string().trim().max(500).optional(),
  order: z.number().int().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(250),
  slug,
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().min(1), // rich-text HTML/JSON
  coverImage: z.string().trim().max(500).optional(),
  author: z.string().trim().max(160).optional(),
  tags: z.array(z.string()).default([]),
  status,
  publishedAt: z.string().datetime().optional(),
  seo: seo.optional(),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(4).max(1000),
  authorName: z.string().trim().min(2).max(160),
  city: z.string().trim().max(120).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().default(0),
  status,
});

export const galleryItemSchema = z.object({
  image: z.string().trim().min(1).max(500),
  caption: z.string().trim().max(300).optional(),
  album: z.string().trim().max(120).optional(),
  order: z.number().int().default(0),
});

export const jobOpeningSchema = z.object({
  title: z.string().trim().min(2).max(250),
  slug,
  location: z.string().trim().max(160).optional(),
  type: z.string().trim().max(80).optional(), // "full-time", "part-time"
  description: z.string().min(1), // rich-text HTML/JSON
  status,
});

export const pageSchema = z.object({
  slug,
  title: z.string().trim().max(250).optional(),
  blocks: z.unknown().optional(), // structured content blocks (JSON)
  metaTitle: z.string().trim().max(200).optional(),
  metaDescription: z.string().trim().max(400).optional(),
});

export const redirectSchema = z.object({
  from: z.string().trim().min(1).max(500),
  to: z.string().trim().min(1).max(1000),
  code: z
    .number()
    .int()
    .refine((c) => [301, 302, 307, 308].includes(c), "Use 301/302/307/308")
    .default(301),
});

/** Admin user management. `password` is plaintext on the wire (TLS), hashed in the API. */
export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  name: z.string().trim().max(160).optional(),
  role: z.enum(ROLES).default("EDITOR"),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().max(160).optional(),
  password: z.string().min(8).max(200).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;
export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type JobOpeningInput = z.infer<typeof jobOpeningSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type RedirectInput = z.infer<typeof redirectSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
