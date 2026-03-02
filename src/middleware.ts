import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: [
    // Match all routes except static files, _next, and api routes (except auth)
    "/((?!_next/static|_next/image|favicon.ico|icon.png|fonts|images|api(?!/auth)).*)",
  ],
};
