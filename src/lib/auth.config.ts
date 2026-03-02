import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Prisma, no bcrypt).
 * Used by middleware only.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [], // Providers added in full auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public routes
      const publicRoutes = ["/login", "/register", "/landing", "/api/auth", "/sitemap.xml", "/robots.txt"];
      const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

      // Marketing/public pages
      const publicPages = ["/profile"];
      const isPublicPage = publicPages.some((route) => pathname.startsWith(route));

      if (isPublicRoute || isPublicPage) {
        // Redirect logged-in users away from auth pages
        if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
          return Response.redirect(new URL("/", nextUrl.origin));
        }
        return true;
      }

      // Protect dashboard routes
      if (!isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname);
        return Response.redirect(
          new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl.origin)
        );
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
