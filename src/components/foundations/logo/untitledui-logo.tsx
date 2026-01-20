"use client";

import type { HTMLAttributes } from "react";
import { cx } from "@/utils/cx";

export const UntitledLogo = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (
        <div {...props} className={cx("flex h-8 w-max items-center justify-start gap-2", props.className)}>
            {/* Dale Icon - Simple geometric D */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-600">
                <span className="font-display text-xl font-bold text-white">D</span>
            </div>

            {/* Dale Text */}
            <span className="font-display text-xl font-semibold text-primary">Dale</span>
        </div>
    );
};
