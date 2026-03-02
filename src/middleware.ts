import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require auth
  const publicRoutes = ["/login", "/register", "/api/auth"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Marketing routes (landing page etc.) — always accessible
  if (pathname === "/" && !isLoggedIn) {
    // For now, don't redirect — dashboard is the home page
    // When marketing landing page is built (Phase 34), redirect unauthed users there
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  // Protect dashboard routes
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return Response.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.nextUrl.origin)
    );
  }
});

export const config = {
  matcher: [
    // Match all routes except static files, _next, and api routes (except auth)
    "/((?!_next/static|_next/image|favicon.ico|icon.png|fonts|images|api(?!/auth)).*)",
  ],
};
