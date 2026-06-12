import { NextResponse } from "next/server";

/**
 * Same-origin proxy for public form submissions. The browser posts here; we
 * forward to the internal CMS API. This keeps `API_INTERNAL_URL` server-side
 * and avoids exposing it / CORS configuration to the client.
 */
const API = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
}
