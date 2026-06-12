import { Router } from "express";
import { prisma } from "@isa/db";
import { HttpError } from "../middleware/error.js";

/**
 * Read-only content endpoints consumed by the Next.js site (SSR/ISR).
 * Only PUBLISHED records are exposed.
 */
export const publicRouter = Router();

publicRouter.get("/locations", async (_req, res) => {
  const locations = await prisma.location.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ city: "asc" }, { order: "asc" }],
  });
  res.json({ locations });
});

// Distinct published cities (helper for the locator's city filter).
// Registered BEFORE "/locations/:slug" so "cities" isn't treated as a slug.
publicRouter.get("/locations/cities", async (_req, res) => {
  const rows = await prisma.location.findMany({
    where: { status: "PUBLISHED" },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  res.json({ cities: rows.map((r) => r.city) });
});

publicRouter.get("/locations/:slug", async (req, res, next) => {
  const location = await prisma.location.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
  });
  if (!location) return next(new HttpError(404, "Location not found"));
  res.json({ location });
});

publicRouter.get("/services", async (_req, res) => {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
    include: { services: { orderBy: { order: "asc" } } },
  });
  res.json({ categories });
});

// Single service category (with its services) by slug.
publicRouter.get("/services/:slug", async (req, res, next) => {
  const category = await prisma.serviceCategory.findUnique({
    where: { slug: req.params.slug },
    include: { services: { orderBy: { order: "asc" } } },
  });
  if (!category) return next(new HttpError(404, "Service category not found"));
  res.json({ category });
});

publicRouter.get("/testimonials", async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });
  res.json({ testimonials });
});

publicRouter.get("/blog", async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      author: true,
      tags: true,
      publishedAt: true,
    },
  });
  res.json({ posts });
});

publicRouter.get("/blog/:slug", async (req, res, next) => {
  const post = await prisma.blogPost.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
  });
  if (!post) return next(new HttpError(404, "Post not found"));
  res.json({ post });
});

publicRouter.get("/gallery", async (_req, res) => {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ album: "asc" }, { order: "asc" }],
  });
  res.json({ items });
});

publicRouter.get("/careers", async (_req, res) => {
  const items = await prisma.jobOpening.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

publicRouter.get("/careers/:slug", async (req, res, next) => {
  const item = await prisma.jobOpening.findFirst({
    where: { slug: req.params.slug, status: "PUBLISHED" },
  });
  if (!item) return next(new HttpError(404, "Job opening not found"));
  res.json({ item });
});

publicRouter.get("/pages/:slug", async (req, res, next) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) return next(new HttpError(404, "Page not found"));
  res.json({ page });
});
