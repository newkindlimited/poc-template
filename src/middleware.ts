import { NextRequest, NextResponse } from "next/server";

// Lightweight middleware — fires the one-shot seed on first request if a
// runtime flag table indicates we haven't seeded yet. Claude Code's seed.ts
// owns the actual logic; this just kicks it off lazily.
export async function middleware(req: NextRequest) {
  // Skip API routes and static assets
  if (
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Best-effort seed kick-off — non-blocking
  const seeded = req.cookies.get("forge_seeded")?.value === "1";
  if (!seeded) {
    // Fire-and-forget: hit /api/seed in the background
    fetch(new URL("/api/seed", req.url).toString()).catch(() => {});
    const res = NextResponse.next();
    res.cookies.set("forge_seeded", "1", { maxAge: 60 * 60 * 24 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
