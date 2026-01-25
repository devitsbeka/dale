"use client";

import type { SVGProps } from "react";
import { useTheme } from "next-themes";
import { cx } from "@/utils/cx";

// Use a stable ID to avoid hydration mismatches
const GRADIENT_ID = "dale-logo-gradient";

export const UntitledLogoMinimal = (props: SVGProps<SVGSVGElement>) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <svg viewBox="0 0 32 32" fill="none" {...props} className={cx("size-8", props.className)}>
            {isDark ? (
                <>
                    <defs>
                        <linearGradient id={GRADIENT_ID} x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#9E523A" />
                            <stop offset="1" stopColor="#CC785C" />
                        </linearGradient>
                    </defs>
                    <rect width="32" height="32" rx="8" fill={`url(#${GRADIENT_ID})`} />
                    <text
                        x="16"
                        y="23"
                        textAnchor="middle"
                        fill="#FAFAF7"
                        fontSize="20"
                        fontWeight="700"
                        fontFamily="'Styrene A', system-ui, -apple-system, sans-serif"
                    >
                        D
                    </text>
                </>
            ) : (
                <>
                    <rect width="32" height="32" rx="8" fill="#1F1F1F" />
                    <text
                        x="16"
                        y="23"
                        textAnchor="middle"
                        fill="#FAFAF7"
                        fontSize="20"
                        fontWeight="700"
                        fontFamily="'Styrene A', system-ui, -apple-system, sans-serif"
                    >
                        D
                    </text>
                </>
            )}
        </svg>
    );
};
