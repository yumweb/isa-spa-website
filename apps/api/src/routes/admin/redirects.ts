import { prisma } from "@isa/db";
import { redirectSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";

export const redirectsAdminRouter = createCrudRouter({
  model: asDelegate(prisma.redirect),
  entity: "Redirect",
  name: "redirect",
  schema: redirectSchema,
  listArgs: { orderBy: { from: "asc" } },
});
