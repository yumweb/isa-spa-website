/**
 * Server-side data fetching from the Express CMS API.
 * Used in Server Components with ISR (`next.revalidate`). Never import this
 * into client components — it talks to the internal API URL.
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
  lat?: number | null;
  lng?: number | null;
};

export type ServiceCategory = {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  services: { id: number; name: string; slug: string; duration?: string | null; price?: string | null; description?: string | null }[];
};

export type Testimonial = { id: number; quote: string; authorName: string; city?: string | null };

export const getLocations = () => get<{ locations: Location[] }>("/locations").then((d) => d.locations);
export const getLocation = (slug: string) => get<{ location: Location }>(`/locations/${slug}`).then((d) => d.location);
export const getServices = () => get<{ categories: ServiceCategory[] }>("/services").then((d) => d.categories);
export const getTestimonials = () => get<{ testimonials: Testimonial[] }>("/testimonials").then((d) => d.testimonials);

/** Submit any public form to the API (called from client components). */
export async function submitForm(body: Record<string, unknown>): Promise<{ ok: boolean; id?: number }> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ? API : API;
  const res = await fetch(`${base}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
  return res.json();
}
