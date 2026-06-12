/** Thin fetch wrapper for the CMS API with JWT access token handling. */
const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

let accessToken: string | null = localStorage.getItem("isa_access") ?? null;

export function setToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem("isa_access", token);
  else localStorage.removeItem("isa_access");
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const data = await api<{ accessToken: string; user: unknown }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.accessToken);
  return data.user;
}
