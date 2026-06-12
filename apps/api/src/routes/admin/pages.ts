import { prisma } from "@isa/db";
import { pageSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";

export const pagesAdminRouter = createCrudRouter({
  model: asDelegate(prisma.page),
  entity: "Page",
  name: "page",
  schema: pageSchema, // metaTitle/metaDescription are already flat columns
  listArgs: { orderBy: { slug: "asc" } },
});
