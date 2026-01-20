"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ChevronLeft, ChevronRight, SearchLg } from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { cx } from "@/utils/cx";
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard } from "../base-components/nav-account-card";
import { NavItemBase } from "../base-components/nav-item";
import { NavItemButton } from "../base-components/nav-item-button";
import { NavList } from "../base-components/nav-list";
import type { NavItemType } from "../config";

interface SidebarNavigationProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: NavItemType[];
    /** List of footer items to display. */
    footerItems?: NavItemType[];
    /** Feature card to display. */
    featureCard?: ReactNode;
    /** Whether to show the account card. */
    showAccountCard?: boolean;
    /** Whether to hide the right side border. */
    hideBorder?: boolean;
    /** Additional CSS classes to apply to the sidebar. */
    className?: string;
}

export const SidebarNavigationSimple = ({
    activeUrl,
    items,
    footerItems = [],
    featureCard,
    showAccountCard = true,
    hideBorder = false,
    className,
}: SidebarNavigationProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    
    const EXPANDED_WIDTH = 296;
    const COLLAPSED_WIDTH = 72;
    const currentWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

    const isDarkMode = resolvedTheme === "dark";

    const handleThemeToggle = (isSelected: boolean) => {
        setTheme(isSelected ? "dark" : "light");
    };

    const expandedContent = (
        <aside
            style={{ width: EXPANDED_WIDTH }}
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-auto bg-primary pt-4 lg:pt-6",
                !hideBorder && "border-secondary md:border-r",
                className,
            )}
        >
            <div className="flex flex-col gap-5 px-4 lg:px-5">
                <div className="flex items-center justify-between">
                    <UntitledLogo className="h-8" />
                    <Button
                        size="sm"
                        color="tertiary"
                        iconLeading={ChevronLeft}
                        onClick={() => setIsCollapsed(true)}
                        className="hidden lg:flex"
                    />
                </div>
                <Input shortcut size="sm" aria-label="Search" placeholder="Search" icon={SearchLg} />
            </div>

            <NavList activeUrl={activeUrl} items={items} />

            <div className="mt-auto flex flex-col gap-4 px-2 py-4 lg:px-4 lg:py-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                    <div className="flex items-center gap-2">
                        {isDarkMode ? (
                            <svg className="size-4 text-fg-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        ) : (
                            <svg className="size-4 text-fg-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"/>
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                            </svg>
                        )}
                        <span className="text-sm font-medium text-secondary">
                            {isDarkMode ? "Dark mode" : "Light mode"}
                        </span>
                    </div>
                    <Toggle
                        size="sm"
                        isSelected={isDarkMode}
                        onChange={handleThemeToggle}
                        aria-label="Toggle dark mode"
                    />
                </div>

                {footerItems.length > 0 && (
                    <ul className="flex flex-col">
                        {footerItems.map((item) => (
                            <li key={item.label} className="py-0.5">
                                <NavItemBase badge={item.badge} icon={item.icon} href={item.href} type="link" current={item.href === activeUrl}>
                                    {item.label}
                                </NavItemBase>
                            </li>
                        ))}
                    </ul>
                )}

                {featureCard}

                {showAccountCard && <NavAccountCard />}
            </div>
        </aside>
    );

    const collapsedContent = (
        <aside
            style={{ width: COLLAPSED_WIDTH }}
            className={cx(
                "flex h-full flex-col items-center justify-between overflow-auto bg-primary py-4 lg:py-6",
                !hideBorder && "border-secondary md:border-r",
                className,
            )}
        >
            <div className="flex flex-col items-center gap-4">
                <UntitledLogoMinimal className="size-8" />
                <Button
                    size="sm"
                    color="tertiary"
                    iconLeading={ChevronRight}
                    onClick={() => setIsCollapsed(false)}
                />
            </div>

            <ul className="flex flex-col items-center gap-1 px-2">
                {items.map((item) => (
                    <li key={item.label}>
                        <NavItemButton
                            size="md"
                            current={activeUrl === item.href}
                            href={item.href}
                            label={item.label || ""}
                            icon={item.icon!}
                        />
                    </li>
                ))}
            </ul>

            <div className="mt-auto flex flex-col items-center gap-3 px-2 py-4">
                {/* Theme Toggle - Compact */}
                <button
                    onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                    className="flex size-10 items-center justify-center rounded-lg bg-secondary text-fg-tertiary transition hover:bg-tertiary hover:text-fg-secondary"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    ) : (
                        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                        </svg>
                    )}
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{expandedContent}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isCollapsed ? "collapsed" : "expanded"}
                        initial={{ width: isCollapsed ? EXPANDED_WIDTH : COLLAPSED_WIDTH, opacity: 0.8 }}
                        animate={{ width: currentWidth, opacity: 1 }}
                        exit={{ opacity: 0.8 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {isCollapsed ? collapsedContent : expandedContent}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <motion.div
                animate={{ paddingLeft: currentWidth }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
