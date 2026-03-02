import type { Metadata, Viewport } from "next";
import { RouteProvider } from "@/providers/router-provider";
import { SessionProvider } from "@/providers/session-provider";
import { Theme } from "@/providers/theme";
import { TRPCProvider } from "@/providers/trpc-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Planeta.id — Career Operating System for Earth",
    description: "The unified intelligence platform that replaces 30+ fragmented career services",
};

export const viewport: Viewport = {
    themeColor: "#7C3AED",
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
                <SessionProvider>
                    <TRPCProvider>
                        <RouteProvider>
                            <Theme>{children}</Theme>
                        </RouteProvider>
                    </TRPCProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
