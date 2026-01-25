import type { Metadata, Viewport } from "next";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import { AuthProvider } from "@/contexts/auth-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Dale — Your AI Career Companion",
    description: "Find your dream job with Dale",
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
                <AuthProvider>
                    <RouteProvider>
                        <Theme>{children}</Theme>
                    </RouteProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
