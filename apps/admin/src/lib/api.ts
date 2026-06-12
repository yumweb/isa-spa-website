/** Thin fetch wrapper for the CMS API with JWT access token handling. */
const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

let accessToken: string | null = localStorage.getItem("isa_access") ?? null;

/** Typed error so a global handler can react to 401s (redirect to /login). */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Registered by the auth context. When the API answers 401 (expired/invalid
 * token) we clear the session and bounce to /login from one central place
 * instead of sprinkling redirect logic across every screen.
 */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

export function getToken() {
  return accessToken;
}

export function setToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem("isa_access", token);
  else localStorage.removeItem("isa_access");
}

async function parseError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as { error?: unknown };
  if (typeof body?.error === "string") return body.error;
  return `HTTP ${res.status}`;
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  return {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...extra,
  };
}

/** JSON request. Throws ApiError; triggers the global 401 handler on auth loss. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    ...init,
    headers: authHeaders({ "Content-Type": "application/json", ...init.headers }),
  });
  if (!res.ok) {
    const message = await parseError(res);
    if (res.status === 401) onUnauthorized?.();
    throw new ApiError(res.status, message);
  }
  // DELETE etc. may return empty body
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/** Multipart upload (no JSON Content-Type so the browser sets the boundary). */
export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) {
    const message = await parseError(res);
    if (res.status === 401) onUnauthorized?.();
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

/** Fetch a CSV/binary endpoint with auth and trigger a browser download. */
export async function downloadFile(path: string, filename: string): Promise<void> {
  const res = await fetch(`${API}/api${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const message = await parseError(res);
    if (res.status === 401) onUnauthorized?.();
    throw new ApiError(res.status, message);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export type AuthUser = { id: number; email: string; name?: string | null; role: "ADMIN" | "EDITOR" };

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api<{ accessToken: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.accessToken);
  localStorage.setItem("isa_user", JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  setToken(null);
  localStorage.removeItem("isa_user");
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("isa_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Absolute URL for an API-relative media path (`/uploads/x.jpg`). */
export function mediaUrl(url: string): string {
  if (!url) return url;
  return url.startsWith("http") ? url : `${API}${url}`;
}
