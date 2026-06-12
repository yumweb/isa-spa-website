import { prisma } from "@isa/db";
import { jobOpeningSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";

export const careersAdminRouter = createCrudRouter({
  model: asDelegate(prisma.jobOpening),
  entity: "JobOpening",
  name: "career",
  schema: jobOpeningSchema,
  listArgs: { orderBy: { createdAt: "desc" } },
});
