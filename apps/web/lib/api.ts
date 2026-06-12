/**
 * Server-side data fetching from the Express CMS API.
 * Used in Server Components with ISR (`next.revalidate`). Never import the
 * `get*` helpers into client components — they talk to the internal API URL.
 *
 * `submitForm` is the one client-safe helper: it POSTs to a same-origin Next.js
 * route handler (`/api/submissions`) which proxies to the API, so the internal
 * URL is never exposed to the browser.
 */
const API = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

async function get<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API}/api${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export type Location = {
  id: number;
  name: string;
  slug: string;
  city: string;
  area?: string | null;
  address: string;
  phone?: string | null;
  whatsapp?: string | null;
  lat?: number | null;
  lng?: number | null;
  mapUrl?: string | null;
  hours?: Record<string, string> | string[] | null;
  images?: string[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  duration?: string | null;
  price?: string | null;
  description?: string | null;
  image?: string | null;
};

export type ServiceCategory = {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  heroImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  services: Service[];
};

export type Testimonial = { id: number; quote: string; authorName: string; city?: string | null };

export type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  author?: string | null;
  tags?: string[] | null;
  publishedAt?: string | null;
};

export type BlogPost = BlogPostSummary & {
  body: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  updatedAt?: string | null;
};

export type GalleryItem = {
  id: number;
  image: string;
  caption?: string | null;
  album?: string | null;
};

export type JobOpening = {
  id: number;
  title: string;
  slug: string;
  location?: string | null;
  type?: string | null;
  description: string;
};

export type Page = {
  id: number;
  slug: string;
  title?: string | null;
  blocks?: unknown;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export const getLocations = () => get<{ locations: Location[] }>("/locations").then((d) => d.locations);
export const getLocation = (slug: string) => get<{ location: Location }>(`/locations/${slug}`).then((d) => d.location);
export const getCities = () => get<{ cities: string[] }>("/locations/cities").then((d) => d.cities);

export const getServices = () => get<{ categories: ServiceCategory[] }>("/services").then((d) => d.categories);
export const getServiceCategory = (slug: string) =>
  get<{ category: ServiceCategory }>(`/services/${slug}`).then((d) => d.category);

export const getTestimonials = () => get<{ testimonials: Testimonial[] }>("/testimonials").then((d) => d.testimonials);

export const getBlogPosts = () => get<{ posts: BlogPostSummary[] }>("/blog").then((d) => d.posts);
export const getBlogPost = (slug: string) => get<{ post: BlogPost }>(`/blog/${slug}`).then((d) => d.post);

export const getGallery = () => get<{ items: GalleryItem[] }>("/gallery").then((d) => d.items);

export const getCareers = () => get<{ items: JobOpening[] }>("/careers").then((d) => d.items);
export const getCareer = (slug: string) => get<{ item: JobOpening }>(`/careers/${slug}`).then((d) => d.item);

export const getPage = (slug: string) => get<{ page: Page }>(`/pages/${slug}`).then((d) => d.page);

/**
 * Submit any public form. Called from client components, so it posts to a
 * same-origin Next route handler that proxies to the API (keeps the internal
 * URL server-side and avoids CORS).
 */
export async function submitForm(body: Record<string, unknown>): Promise<{ ok: boolean; id?: number }> {
  const res = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.message ?? `Submit failed: ${res.status}`);
  }
  return res.json();
}
