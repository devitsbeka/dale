import type { Metadata, Viewport } from "next";
import { RouteProvider } from "@/providers/router-provider";
import { SessionProvider } from "@/providers/session-provider";
import { Theme } from "@/providers/theme";
import { TRPCProvider } from "@/providers/trpc-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: {
        default: "Planeta.id — Career Operating System for Earth",
        template: "%s | Planeta.id",
    },
    description: "The unified intelligence platform that replaces 30+ fragmented career services. AI-powered job matching, salary intelligence, skill mapping, negotiation coaching, and career simulation.",
    keywords: ["career", "salary", "jobs", "skills", "AI", "negotiation", "career intelligence"],
    openGraph: {
        title: "Planeta.id — Career Operating System for Earth",
        description: "Replace 30+ career tools with one intelligent platform",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Planeta.id — Career Operating System for Earth",
        description: "Replace 30+ career tools with one intelligent platform",
    },
    robots: {
        index: true,
        follow: true,
    },
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
