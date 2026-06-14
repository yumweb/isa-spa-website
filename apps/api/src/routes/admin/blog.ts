import { prisma } from "@isa/db";
import { blogPostSchema } from "@isa/shared";
import { asDelegate, createCrudRouter } from "./_crud.js";
import { mapBlogInput } from "./_map.js";

export const blogAdminRouter = createCrudRouter({
  model: asDelegate(prisma.blogPost),
  entity: "BlogPost",
  name: "blog",
  schema: blogPostSchema,
  mapInput: mapBlogInput,
  // newest first; drafts visible to admin (no status filter)
  listArgs: { orderBy: { createdAt: "desc" } },
  revalidatePaths: (item) => ["/blog", `/blog/${item.slug}`],
});
