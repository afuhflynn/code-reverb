import { createMiddleware } from "@arcjet/next";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";

const publicPaths = [
  "/about",
  "/contact",
  "/cookies",
  "/faq",
  "/privacy",
  "/terms",
  "/api/auth",
  "/api/webhooks/github",
  "/pricing",
  "/api/inngest",
];
const authPaths = ["/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  const session = getSessionCookie(request);

  // Redirect to login if not authenticated and trying to access protected route
  if (
    !session &&
    !authPaths.some((path) => pathname.startsWith(path)) &&
    pathname !== "/"
  ) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect if authenticated and on root
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (session && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// @ts-ignore
export default createMiddleware(aj, proxy);
