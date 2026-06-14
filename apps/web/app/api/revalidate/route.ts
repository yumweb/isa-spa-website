import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation, called by the CMS API after content changes so
 * published edits appear immediately instead of waiting for the revalidate
 * window. Internal-only: protected by a shared secret, and the API reaches it
 * directly on localhost (nginx routes public /api/* to the Express API).
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let paths: unknown;
  try {
    ({ paths } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!Array.isArray(paths) || paths.some((p) => typeof p !== "string")) {
    return NextResponse.json({ error: "paths must be string[]" }, { status: 400 });
  }
  for (const p of paths as string[]) revalidatePath(p);
  return NextResponse.json({ revalidated: true, paths });
}
