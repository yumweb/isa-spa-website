import { prisma } from "@isa/db";
import { testimonialSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";

export const testimonialsAdminRouter = createCrudRouter({
  model: asDelegate(prisma.testimonial),
  entity: "Testimonial",
  name: "testimonial",
  schema: testimonialSchema,
  listArgs: { orderBy: { order: "asc" } },
});
