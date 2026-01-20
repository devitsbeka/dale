"use client";

import type { SVGProps } from "react";
import { useId } from "react";
import { cx } from "@/utils/cx";

export const UntitledLogoMinimal = (props: SVGProps<SVGSVGElement>) => {
    const id = useId();

    return (
        <svg viewBox="0 0 32 32" fill="none" {...props} className={cx("size-8", props.className)}>
            <defs>
                <linearGradient id={`dale-gradient-${id}`} x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0F766E" />
                    <stop offset="1" stopColor="#2DD4BF" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill={`url(#dale-gradient-${id})`} />
            <text
                x="16"
                y="23"
                textAnchor="middle"
                fill="white"
                fontSize="20"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                D
            </text>
        </svg>
    );
};
