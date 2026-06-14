import { prisma } from "@isa/db";
import { locationSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";
import { flattenSeo } from "./_map.js";

export const locationsAdminRouter = createCrudRouter({
  model: asDelegate(prisma.location),
  entity: "Location",
  name: "location",
  schema: locationSchema,
  mapInput: flattenSeo,
  listArgs: { orderBy: [{ city: "asc" }, { order: "asc" }] },
  revalidatePaths: (item) => ["/spa-locator", `/spa-locator/${item.slug}`],
});
