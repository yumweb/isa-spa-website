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
