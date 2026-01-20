"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ChevronLeft, ChevronRight, LifeBuoy01, LogOut01, Settings01 } from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";
import { Button as AriaButton, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { cx } from "@/utils/cx";
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard, NavAccountMenu } from "../base-components/nav-account-card";
import { NavItemBase } from "../base-components/nav-item";
import { NavItemButton } from "../base-components/nav-item-button";
import { NavList } from "../base-components/nav-list";
import type { NavItemType } from "../config";

// Sun icon component
const SunIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
);

// Moon icon component
const MoonIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);

interface SidebarCollapsibleProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of grouped items for expanded view. */
    expandedItems: Array<{ label: string; items: NavItemType[] }>;
    /** List of items for collapsed view with icons. */
    collapsedItems: (NavItemType & { icon: FC<{ className?: string }> })[];
    /** Footer items for collapsed view. */
    footerItems?: (NavItemType & { icon: FC<{ className?: string }> })[];
    /** Feature card to display in expanded view. */
    featureCard?: ReactNode;
}

export const SidebarCollapsible = ({
    activeUrl = "/",
    expandedItems,
    collapsedItems,
    footerItems = [],
    featureCard,
}: SidebarCollapsibleProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    
    const EXPANDED_WIDTH = 292;
    const COLLAPSED_WIDTH = 68;
    const currentWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

    const isDarkMode = resolvedTheme === "dark";

    const handleThemeToggle = (isSelected: boolean) => {
        setTheme(isSelected ? "dark" : "light");
    };

    // Expanded sidebar content
    const expandedContent = (
        <aside
            style={{ width: EXPANDED_WIDTH }}
            className="flex h-full w-full max-w-full flex-col justify-between overflow-auto border-secondary bg-primary pt-4 shadow-xs md:border-r lg:rounded-xl lg:border lg:pt-5"
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
            </div>

            <ul className="mt-6">
                {expandedItems.map((group) => (
                    <li key={group.label}>
                        <div className="px-5 pb-1">
                            <p className="text-xs font-bold text-quaternary uppercase">{group.label}</p>
                        </div>
                        <ul className="px-4 pb-4">
                            {group.items.map((item) => (
                                <li key={item.label} className="py-0.5">
                                    <NavItemBase icon={item.icon} href={item.href} badge={item.badge} type="link" current={item.href === activeUrl}>
                                        {item.label}
                                    </NavItemBase>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="mt-auto flex flex-col gap-4 px-4 py-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                    <div className="flex items-center gap-2">
                        {isDarkMode ? (
                            <MoonIcon className="size-4 text-fg-tertiary" />
                        ) : (
                            <SunIcon className="size-4 text-fg-tertiary" />
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

                {featureCard}

                <NavAccountCard />
            </div>
        </aside>
    );

    // Collapsed sidebar content
    const collapsedContent = (
        <aside
            style={{ width: COLLAPSED_WIDTH }}
            className="flex h-full flex-col items-center justify-between overflow-auto border-secondary bg-primary py-4 shadow-xs md:border-r lg:rounded-xl lg:border lg:py-5"
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
                {collapsedItems.map((item) => (
                    <li key={item.label}>
                        <NavItemButton
                            size="md"
                            current={activeUrl === item.href}
                            href={item.href}
                            label={item.label || ""}
                            icon={item.icon}
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
                    {isDarkMode ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                </button>

                {footerItems.length > 0 && (
                    <ul className="flex flex-col gap-1">
                        {footerItems.map((item) => (
                            <li key={item.label}>
                                <NavItemButton
                                    size="md"
                                    current={activeUrl === item.href}
                                    href={item.href}
                                    label={item.label || ""}
                                    icon={item.icon}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <AriaDialogTrigger>
                    <AriaButton
                        className={({ isPressed, isFocused }) =>
                            cx("group relative inline-flex rounded-full", (isPressed || isFocused) && "outline-2 outline-offset-2 outline-focus-ring")
                        }
                    >
                        <Avatar status="online" src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" size="md" alt="Olivia Rhye" />
                    </AriaButton>
                    <AriaPopover
                        placement="right bottom"
                        offset={8}
                        crossOffset={6}
                        className={({ isEntering, isExiting }) =>
                            cx(
                                "will-change-transform",
                                isEntering &&
                                    "duration-300 ease-out animate-in fade-in placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 placement-bottom:slide-in-from-top-2",
                                isExiting &&
                                    "duration-150 ease-in animate-out fade-out placement-right:slide-out-to-left-2 placement-top:slide-out-to-bottom-2 placement-bottom:slide-out-to-top-2",
                            )
                        }
                    >
                        <NavAccountMenu />
                    </AriaPopover>
                </AriaDialogTrigger>
            </div>
        </aside>
    );

    // Mobile expanded content
    const mobileContent = (
        <aside className="group flex h-full max-h-full w-full max-w-full flex-col justify-between overflow-y-auto bg-primary pt-4">
            <div className="px-4">
                <UntitledLogo className="h-8" />
            </div>

            <ul className="mt-6">
                {expandedItems.map((group) => (
                    <li key={group.label}>
                        <div className="px-5 pb-1">
                            <p className="text-xs font-bold text-quaternary uppercase">{group.label}</p>
                        </div>
                        <ul className="px-4 pb-4">
                            {group.items.map((item) => (
                                <li key={item.label} className="py-0.5">
                                    <NavItemBase icon={item.icon} href={item.href} badge={item.badge} type="link" current={item.href === activeUrl}>
                                        {item.label}
                                    </NavItemBase>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="mt-auto flex flex-col gap-5 px-2 py-4">
                {/* Theme Toggle */}
                <div className="mx-2 flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                    <div className="flex items-center gap-2">
                        {isDarkMode ? (
                            <MoonIcon className="size-4 text-fg-tertiary" />
                        ) : (
                            <SunIcon className="size-4 text-fg-tertiary" />
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

                <div className="flex flex-col gap-2 px-2">
                    <NavItemBase current={activeUrl === "/support"} type="link" href="/support" icon={LifeBuoy01}>
                        Support
                    </NavItemBase>
                    <NavItemBase current={activeUrl === "/settings"} type="link" href="/settings" icon={Settings01}>
                        Settings
                    </NavItemBase>
                </div>

                <div className="relative flex items-center gap-3 border-t border-secondary pt-6 pr-8 pl-2">
                    <AvatarLabelGroup
                        status="online"
                        size="md"
                        src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                        title="Olivia Rhye"
                        subtitle="olivia@untitledui.com"
                    />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2">
                        <Button
                            size="sm"
                            color="tertiary"
                            iconLeading={<LogOut01 className="size-5 text-fg-quaternary transition-inherit-all group-hover:text-fg-quaternary_hover" />}
                            className="p-1.5!"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{mobileContent}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:py-1 lg:pl-1">
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
                animate={{ paddingLeft: currentWidth + 8 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
