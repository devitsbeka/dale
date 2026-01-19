import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

type SectionHeaderRootProps = {
    children: ReactNode;
    className?: string;
};

const SectionHeaderRoot = ({ children, className }: SectionHeaderRootProps) => {
    return <div className={cx("flex flex-col gap-4", className)}>{children}</div>;
};

type SectionHeaderGroupProps = {
    children: ReactNode;
    className?: string;
};

const SectionHeaderGroup = ({ children, className }: SectionHeaderGroupProps) => {
    return <div className={cx("relative flex items-center justify-between gap-4", className)}>{children}</div>;
};

type SectionHeaderHeadingProps = {
    children: ReactNode;
    className?: string;
};

const SectionHeaderHeading = ({ children, className }: SectionHeaderHeadingProps) => {
    return <h2 className={cx("text-lg font-semibold text-primary", className)}>{children}</h2>;
};

type SectionHeaderSubheadingProps = {
    children: ReactNode;
    className?: string;
};

const SectionHeaderSubheading = ({ children, className }: SectionHeaderSubheadingProps) => {
    return <p className={cx("text-sm text-tertiary", className)}>{children}</p>;
};

export const SectionHeader = {
    Root: SectionHeaderRoot,
    Group: SectionHeaderGroup,
    Heading: SectionHeaderHeading,
    Subheading: SectionHeaderSubheading,
};
