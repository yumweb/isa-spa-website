import { prisma } from "@isa/db";
import { galleryItemSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";

export const galleryAdminRouter = createCrudRouter({
  model: asDelegate(prisma.galleryItem),
  entity: "GalleryItem",
  name: "gallery",
  schema: galleryItemSchema,
  listArgs: { orderBy: [{ album: "asc" }, { order: "asc" }] },
});
