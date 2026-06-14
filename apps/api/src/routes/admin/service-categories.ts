import { prisma } from "@isa/db";
import { serviceCategorySchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";
import { mapCategoryInput } from "./_map.js";

export const serviceCategoriesAdminRouter = createCrudRouter({
  model: asDelegate(prisma.serviceCategory),
  entity: "ServiceCategory",
  name: "service-category",
  schema: serviceCategorySchema,
  mapInput: mapCategoryInput,
  // include child services so the admin can manage them under a category
  listArgs: {
    orderBy: { order: "asc" },
    include: { services: { orderBy: { order: "asc" } } },
  },
  getArgs: { include: { services: { orderBy: { order: "asc" } } } },
  revalidatePaths: (item) => ["/services", `/services/${item.slug}`],
});
