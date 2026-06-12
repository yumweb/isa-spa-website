import {
  PUBLISH_STATUSES,
  blogPostSchema,
  galleryItemSchema,
  jobOpeningSchema,
  locationSchema,
  pageSchema,
  redirectSchema,
  serviceCategorySchema,
  serviceSchema,
  testimonialSchema,
} from "@isa/shared";
import { Link } from "react-router-dom";
import { useList } from "../lib/entities";
import { mediaUrl } from "../lib/api";
import { ResourcePage } from "../components/ResourcePage";
import { SEO_FIELDS, type FieldDef, type Option } from "../components/Form";
import { StatusBadge, Spinner } from "../components/ui";

const statusOptions: Option[] = PUBLISH_STATUSES.map((s) => ({ label: s, value: s }));

const statusField: FieldDef = {
  name: "status",
  label: "Status",
  type: "select",
  options: statusOptions,
  required: true,
};

// ─── Locations ───
export function LocationsPage() {
  const fields: FieldDef[] = [
    { name: "name", label: "Name", type: "text", required: true, half: true },
    { name: "slug", label: "Slug", type: "text", required: true, half: true },
    { name: "city", label: "City", type: "text", required: true, half: true },
    { name: "area", label: "Area", type: "text", half: true },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "phone", label: "Phone", type: "text", half: true },
    { name: "whatsapp", label: "WhatsApp", type: "text", half: true },
    { name: "lat", label: "Latitude", type: "number", half: true },
    { name: "lng", label: "Longitude", type: "number", half: true },
    { name: "mapUrl", label: "Map URL", type: "text" },
    { name: "hours", label: "Hours (JSON: { mon: \"10–8\" })", type: "json" },
    { name: "images", label: "Images", type: "images" },
    { name: "order", label: "Order", type: "number" },
    statusField,
    ...SEO_FIELDS,
  ];
  return (
    <ResourcePage
      entity="locations"
      title="Location"
      schema={locationSchema}
      fields={fields}
      labelOf={(i: any) => i.name}
      columns={[
        { header: "Name", render: (i: any) => i.name },
        { header: "City", render: (i: any) => i.city },
        { header: "Status", render: (i: any) => <StatusBadge value={i.status} /> },
        { header: "Order", render: (i: any) => i.order },
      ]}
    />
  );
}

// ─── Service categories ───
export function ServiceCategoriesPage() {
  const fields: FieldDef[] = [
    { name: "name", label: "Name", type: "text", required: true, half: true },
    { name: "slug", label: "Slug", type: "text", required: true, half: true },
    { name: "tagline", label: "Tagline", type: "text" },
    { name: "heroImage", label: "Hero image", type: "media" },
    { name: "order", label: "Order", type: "number" },
    ...SEO_FIELDS.filter((f) => f.name === "metaTitle" || f.name === "metaDescription"),
  ];
  return (
    <ResourcePage
      entity="service-categories"
      title="Service Category"
      schema={serviceCategorySchema}
      fields={fields}
      labelOf={(i: any) => i.name}
      columns={[
        { header: "Name", render: (i: any) => i.name },
        { header: "Slug", render: (i: any) => <code>{i.slug}</code> },
        { header: "Order", render: (i: any) => i.order },
      ]}
    />
  );
}

// ─── Services (category selector is data-driven) ───
export function ServicesPage() {
  const cats = useList<{ id: number; name: string }>("service-categories");
  if (cats.isLoading) return <Spinner />;
  const options: Option[] = (cats.data ?? []).map((c) => ({ label: c.name, value: c.id }));
  const fields: FieldDef[] = [
    { name: "categoryId", label: "Category", type: "select", options, numeric: true, required: true },
    { name: "name", label: "Name", type: "text", required: true, half: true },
    { name: "slug", label: "Slug", type: "text", required: true, half: true },
    { name: "duration", label: "Duration", type: "text", half: true },
    { name: "price", label: "Price", type: "text", half: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "image", label: "Image", type: "media" },
    { name: "order", label: "Order", type: "number" },
  ];
  return (
    <ResourcePage
      entity="services"
      title="Service"
      schema={serviceSchema}
      fields={fields}
      labelOf={(i: any) => i.name}
      columns={[
        { header: "Name", render: (i: any) => i.name },
        { header: "Category", render: (i: any) => i.category?.name ?? i.categoryId },
        { header: "Price", render: (i: any) => i.price ?? "—" },
        { header: "Order", render: (i: any) => i.order },
      ]}
    />
  );
}

// ─── Blog ───
export function BlogPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, half: true },
    { name: "author", label: "Author", type: "text", half: true },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    {
      name: "body",
      label: "Body",
      type: "richtext",
      required: true,
      help: "Plain HTML/markdown for now — a WYSIWYG editor can replace this textarea later.",
    },
    { name: "coverImage", label: "Cover image", type: "media" },
    { name: "tags", label: "Tags", type: "tags" },
    { name: "status", label: "Status", type: "select", options: statusOptions, required: true, half: true },
    { name: "publishedAt", label: "Published at", type: "datetime", half: true },
    ...SEO_FIELDS,
  ];
  return (
    <ResourcePage
      entity="blog"
      title="Blog Post"
      schema={blogPostSchema}
      fields={fields}
      headerExtra={
        <Link to="/ai-blog" className="btn">
          ✨ Generate with AI
        </Link>
      }
      labelOf={(i: any) => i.title}
      columns={[
        { header: "Title", render: (i: any) => i.title },
        { header: "Status", render: (i: any) => <StatusBadge value={i.status} /> },
        {
          header: "Published",
          render: (i: any) => (i.publishedAt ? new Date(i.publishedAt).toLocaleDateString() : "—"),
        },
      ]}
    />
  );
}

// ─── Testimonials ───
export function TestimonialsPage() {
  const fields: FieldDef[] = [
    { name: "quote", label: "Quote", type: "textarea", required: true },
    { name: "authorName", label: "Author", type: "text", required: true, half: true },
    { name: "city", label: "City", type: "text", half: true },
    { name: "rating", label: "Rating (1–5)", type: "number", half: true },
    { name: "order", label: "Order", type: "number", half: true },
    statusField,
  ];
  return (
    <ResourcePage
      entity="testimonials"
      title="Testimonial"
      schema={testimonialSchema}
      fields={fields}
      labelOf={(i: any) => i.authorName}
      columns={[
        { header: "Author", render: (i: any) => i.authorName },
        { header: "City", render: (i: any) => i.city ?? "—" },
        { header: "Rating", render: (i: any) => (i.rating ? "★".repeat(i.rating) : "—") },
        { header: "Status", render: (i: any) => <StatusBadge value={i.status} /> },
      ]}
    />
  );
}

// ─── Gallery ───
export function GalleryPage() {
  const fields: FieldDef[] = [
    { name: "image", label: "Image", type: "media", required: true },
    { name: "caption", label: "Caption", type: "text" },
    { name: "album", label: "Album", type: "text", half: true },
    { name: "order", label: "Order", type: "number", half: true },
  ];
  return (
    <ResourcePage
      entity="gallery"
      title="Gallery Item"
      schema={galleryItemSchema}
      fields={fields}
      labelOf={(i: any) => i.caption || `#${i.id}`}
      columns={[
        {
          header: "Image",
          render: (i: any) =>
            i.image ? (
              <img
                src={mediaUrl(i.image)}
                alt=""
                style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 4 }}
              />
            ) : (
              "—"
            ),
        },
        { header: "Caption", render: (i: any) => i.caption ?? "—" },
        { header: "Album", render: (i: any) => i.album ?? "—" },
        { header: "Order", render: (i: any) => i.order },
      ]}
    />
  );
}

// ─── Careers ───
export function CareersPage() {
  const fields: FieldDef[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, half: true },
    { name: "location", label: "Location", type: "text", half: true },
    { name: "type", label: "Type (full-time…)", type: "text", half: true },
    { name: "description", label: "Description", type: "richtext", required: true },
    statusField,
  ];
  return (
    <ResourcePage
      entity="careers"
      title="Job Opening"
      schema={jobOpeningSchema}
      fields={fields}
      labelOf={(i: any) => i.title}
      columns={[
        { header: "Title", render: (i: any) => i.title },
        { header: "Location", render: (i: any) => i.location ?? "—" },
        { header: "Type", render: (i: any) => i.type ?? "—" },
        { header: "Status", render: (i: any) => <StatusBadge value={i.status} /> },
      ]}
    />
  );
}

// ─── Pages (static copy + meta; metaTitle/metaDescription are top-level) ───
export function PagesPage() {
  const fields: FieldDef[] = [
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "title", label: "Title", type: "text" },
    { name: "blocks", label: "Content blocks (JSON)", type: "json" },
    { name: "metaTitle", label: "Meta title", type: "text" },
    { name: "metaDescription", label: "Meta description", type: "textarea" },
  ];
  return (
    <ResourcePage
      entity="pages"
      title="Page"
      schema={pageSchema}
      fields={fields}
      labelOf={(i: any) => i.slug}
      newLabel="New page"
      columns={[
        { header: "Slug", render: (i: any) => <code>{i.slug}</code> },
        { header: "Title", render: (i: any) => i.title ?? "—" },
      ]}
    />
  );
}

// ─── Redirects ───
export function RedirectsPage() {
  const fields: FieldDef[] = [
    { name: "from", label: "From (legacy path)", type: "text", required: true },
    { name: "to", label: "To (destination)", type: "text", required: true },
    {
      name: "code",
      label: "Code",
      type: "select",
      numeric: true,
      options: [301, 302, 307, 308].map((c) => ({ label: String(c), value: c })),
    },
  ];
  return (
    <ResourcePage
      entity="redirects"
      title="Redirect"
      schema={redirectSchema}
      fields={fields}
      labelOf={(i: any) => i.from}
      columns={[
        { header: "From", render: (i: any) => <code>{i.from}</code> },
        { header: "To", render: (i: any) => <code>{i.to}</code> },
        { header: "Code", render: (i: any) => i.code },
      ]}
    />
  );
}
