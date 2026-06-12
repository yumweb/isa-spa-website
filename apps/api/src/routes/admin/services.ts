import { prisma } from "@isa/db";
import { serviceSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";

export const servicesAdminRouter = createCrudRouter({
  model: asDelegate(prisma.service),
  entity: "Service",
  name: "service",
  schema: serviceSchema,
  listArgs: {
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
    include: { category: { select: { id: true, name: true, slug: true } } },
  },
  getArgs: { include: { category: { select: { id: true, name: true, slug: true } } } },
});
