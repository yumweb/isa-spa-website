/**
 * Seed the database from the decoded prototype data (`seed-data.json`).
 * Idempotent: uses upserts keyed on slug/email so re-running is safe.
 * Run: `pnpm db:seed`
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

type Seed = {
  testimonials: { quote: string; name: string }[];
  serviceCats: {
    name: string;
    tagline: string;
    photo: string;
    items: { n: string; t: string; p: string; d: string }[];
  }[];
  locations: { city: string; area: string; area2?: string; addr: string; phone: string }[];
};

const data = JSON.parse(
  readFileSync(join(__dirname, "seed-data.json"), "utf-8"),
) as Seed;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

async function main() {
  // 1) Admin user
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@isaspa.in";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!123";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "ISA Admin",
      role: "ADMIN",
      passwordHash: await argon2.hash(password),
    },
  });
  console.log(`✓ admin user: ${email}`);

  // 2) Service categories + services
  for (const [ci, cat] of data.serviceCats.entries()) {
    const catSlug = slugify(cat.name);
    const category = await prisma.serviceCategory.upsert({
      where: { slug: catSlug },
      update: { name: cat.name, tagline: cat.tagline, order: ci },
      create: { name: cat.name, slug: catSlug, tagline: cat.tagline, order: ci },
    });
    for (const [si, item] of (cat.items ?? []).entries()) {
      const svcSlug = slugify(item.n);
      await prisma.service.upsert({
        where: { slug: svcSlug },
        update: {
          categoryId: category.id,
          name: item.n,
          duration: item.t,
          price: item.p,
          description: item.d,
          order: si,
        },
        create: {
          categoryId: category.id,
          name: item.n,
          slug: svcSlug,
          duration: item.t,
          price: item.p,
          description: item.d,
          order: si,
        },
      });
    }
  }
  console.log(`✓ ${data.serviceCats.length} service categories seeded`);

  // 3) Locations
  for (const [i, loc] of data.locations.entries()) {
    const area = [loc.area, loc.area2].filter(Boolean).join(" ");
    const name = `ISA Spa ${area || loc.city}`.trim();
    const slug = slugify(`${loc.city}-${loc.area || i}`);
    await prisma.location.upsert({
      where: { slug },
      update: {
        name,
        city: loc.city,
        area: loc.area,
        address: loc.addr,
        phone: loc.phone,
        order: i,
      },
      create: {
        name,
        slug,
        city: loc.city,
        area: loc.area,
        address: loc.addr,
        phone: loc.phone,
        order: i,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`✓ ${data.locations.length} locations seeded`);

  // 4) Testimonials ("Name · City")
  for (const [i, t] of data.testimonials.entries()) {
    const [author, city] = t.name.split("·").map((s) => s.trim());
    // No natural unique key — clear + recreate to stay idempotent.
    await prisma.testimonial.deleteMany({ where: { authorName: author } });
    await prisma.testimonial.create({
      data: {
        quote: t.quote,
        authorName: author ?? t.name,
        city: city ?? null,
        order: i,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`✓ ${data.testimonials.length} testimonials seeded`);

  // 5) Baseline settings
  await prisma.setting.upsert({
    where: { key: "site" },
    update: {},
    create: {
      key: "site",
      value: {
        name: "ISA Spa",
        tagline: "India's Luxury Spa",
        social: {
          facebook: "https://facebook.com/",
          instagram: "https://instagram.com/",
          linkedin: "https://linkedin.com/",
          youtube: "https://youtube.com/",
        },
      },
    },
  });
  console.log("✓ settings seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
