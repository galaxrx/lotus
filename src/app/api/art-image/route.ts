import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Same-origin image proxy for the AR snapshot.
 *
 * The museum CDNs don't send CORS headers, so drawing those images straight
 * onto a <canvas> taints it and canvas.toBlob() throws — the user ends up with
 * a snapshot missing the painting. Serving the bytes from our own origin keeps
 * the canvas clean and exportable.
 *
 * Only the two hosts already allow-listed in the image CSP may be fetched, so
 * this can't be used as an open redirect / SSRF hop.
 */
const ALLOWED_HOSTS = new Set(["images.metmuseum.org", "upload.wikimedia.org"]);

export async function GET(req: Request) {
  const src = new URL(req.url).searchParams.get("src");
  if (!src) {
    return NextResponse.json({ error: "Missing src" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid src" }, { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  const upstream = await fetch(target.toString(), {
    headers: { accept: "image/*" },
    cache: "force-cache",
  }).catch(() => null);

  if (!upstream?.ok) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Not an image" }, { status: 415 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}
