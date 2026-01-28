import type { Metadata, Viewport } from "next";
import { AriaSSRProvider } from "@/providers/ssr-provider";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import { AuthProvider } from "@/contexts/auth-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "planeta.id — Your AI Career Companion",
    description: "Find your dream job with planeta.id",
};

export const viewport: Viewport = {
    themeColor: "#CC785C",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-primary antialiased">
                <AriaSSRProvider>
                    <AuthProvider>
                        <RouteProvider>
                            <Theme>{children}</Theme>
                        </RouteProvider>
                    </AuthProvider>
                </AriaSSRProvider>
            </body>
        </html>
    );
}
