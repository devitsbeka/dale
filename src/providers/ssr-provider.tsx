"use client";

import { SSRProvider } from "react-aria";
import type { ReactNode } from "react";

export function AriaSSRProvider({ children }: { children: ReactNode }) {
    return <SSRProvider>{children}</SSRProvider>;
}
