/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.logo.dev",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "www.untitledui.com",
            },
        ],
    },
};

export default nextConfig;
