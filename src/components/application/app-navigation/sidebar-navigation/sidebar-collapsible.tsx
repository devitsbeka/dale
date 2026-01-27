"use client";

import type { FC, ReactNode } from "react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { ChevronLeft, ChevronRight, LifeBuoy01, LogOut01, Settings01 } from "@untitledui/icons";
import { motion } from "motion/react";
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
    /** Whether to show the theme toggle. */
    showThemeToggle?: boolean;
}

export const SidebarCollapsible = ({
    activeUrl = "/",
    expandedItems,
    collapsedItems,
    footerItems = [],
    featureCard,
    showThemeToggle = true,
}: SidebarCollapsibleProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const { user, isLoading: authLoading } = useAuth();

    const EXPANDED_WIDTH = 240;
    const COLLAPSED_WIDTH = 56;
    const COLLAPSE_BREAKPOINT = 1240;

    const isDarkMode = resolvedTheme === "dark";

    // Get user display info - only if loaded
    const userDisplayName = user?.name || user?.email?.split('@')[0] || '';
    const userEmail = user?.email || '';

    // Auto-collapse sidebar when screen width is below breakpoint
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                const shouldCollapse = window.innerWidth < COLLAPSE_BREAKPOINT;
                setIsCollapsed(shouldCollapse);
            }
        };

        // Check on mount
        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleThemeToggle = (isSelected: boolean) => {
        setTheme(isSelected ? "dark" : "light");
    };

    // Shared scrollbar-hidden class
    const scrollbarHiddenClass = "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

    // Mobile expanded content
    const mobileContent = (
        <aside className={cx("group flex h-full max-h-full w-full max-w-full flex-col justify-between overflow-y-auto bg-white pt-3", scrollbarHiddenClass)}>
            <div className="px-3">
                <img src="/logo.svg" alt="Dale" className="h-7 w-auto" />
            </div>

            <ul className="mt-4">
                {expandedItems.map((group) => (
                    <li key={group.label}>
                        <div className="px-3 pb-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{group.label}</p>
                        </div>
                        <ul className="px-2 pb-3">
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

            <div className="mt-auto flex flex-col gap-4 px-2 py-3">
                {/* Theme Toggle */}
                {showThemeToggle && (
                    <div className="mx-1 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                            {isDarkMode ? (
                                <MoonIcon className="size-4 text-gray-500" />
                            ) : (
                                <SunIcon className="size-4 text-gray-500" />
                            )}
                            <span className="text-sm font-medium text-gray-700">
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
                )}

                <div className="flex flex-col gap-1 px-1">
                    <NavItemBase current={activeUrl === "/support"} type="link" href="/support" icon={LifeBuoy01}>
                        Support
                    </NavItemBase>
                    <NavItemBase current={activeUrl === "/settings"} type="link" href="/settings" icon={Settings01}>
                        Settings
                    </NavItemBase>
                </div>

                <div className="relative flex items-center gap-3 border-t border-gray-200 pt-4 pr-8 pl-1">
                    {authLoading ? (
                        <div className="flex items-center gap-3 w-full">
                            <div className="size-10 rounded-full bg-secondary animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-secondary rounded animate-pulse w-24" />
                                <div className="h-3 bg-secondary rounded animate-pulse w-32" />
                            </div>
                        </div>
                    ) : user ? (
                        <>
                            <AvatarLabelGroup
                                status="online"
                                size="md"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=E9684B&color=fff`}
                                title={userDisplayName}
                                subtitle={userEmail}
                            />
                            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                                <Button
                                    size="sm"
                                    color="tertiary"
                                    iconLeading={<LogOut01 className="size-5 text-fg-quaternary transition-inherit-all group-hover:text-fg-quaternary_hover" />}
                                    className="p-1.5!"
                                />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{mobileContent}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex">
                <motion.aside
                    initial={false}
                    animate={{ width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className={cx(
                        "flex h-full flex-col justify-between overflow-hidden bg-white border-r border-gray-300",
                        scrollbarHiddenClass
                    )}
                >
                    {/* Header with logo and toggle */}
                    <div className={cx(
                        "flex shrink-0 items-center pt-3",
                        isCollapsed ? "flex-col gap-3 px-1 justify-center" : "justify-between px-3"
                    )}>
                        {isCollapsed ? (
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="text-gray-400 hover:text-gray-900 transition-colors"
                                aria-label="Expand sidebar"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        ) : (
                            <>
                                <motion.div
                                    key={activeUrl}
                                    className="flex items-center overflow-hidden"
                                    style={{ width: "70px" }}
                                >
                                    <motion.img
                                        src="/logo.svg"
                                        alt="Dale"
                                        className="h-7 w-auto"
                                        style={{
                                            width: "70px",
                                            clipPath: "inset(0 100% 0 0)"
                                        }}
                                        animate={{
                                            clipPath: "inset(0 0% 0 0)"
                                        }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                </motion.div>
                                <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="text-gray-400 hover:text-gray-900 transition-colors"
                                    aria-label="Collapse sidebar"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Navigation content */}
                    <div className={cx("flex-1 overflow-y-auto overflow-x-hidden", scrollbarHiddenClass)}>
                        {isCollapsed ? (
                            // Collapsed navigation - icon only
                            <ul className="flex flex-col items-center gap-0.5 px-1 py-3">
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
                        ) : (
                            // Expanded navigation - grouped sections
                            <ul className="mt-4">
                                {expandedItems.map((group) => (
                                    <li key={group.label}>
                                        <div className="px-3 pb-1">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{group.label}</p>
                                        </div>
                                        <ul className="px-2 pb-3">
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
                        )}
                    </div>

                    {/* Footer */}
                    <div className={cx(
                        "mt-auto shrink-0 py-3",
                        isCollapsed ? "flex flex-col items-center gap-1 px-1" : "flex flex-col gap-3 px-3"
                    )}>
                        {/* Theme Toggle */}
                        {showThemeToggle && (
                            isCollapsed ? (
                                <button
                                    onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                                    className="flex size-10 items-center justify-center text-gray-500 transition hover:text-gray-700"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDarkMode ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                                </button>
                            ) : (
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        {isDarkMode ? (
                                            <MoonIcon className="size-4 text-gray-500" />
                                        ) : (
                                            <SunIcon className="size-4 text-gray-500" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
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
                            )
                        )}

                        {/* Feature card - only in expanded */}
                        {!isCollapsed && featureCard}

                        {/* Footer nav items - only in collapsed */}
                        {isCollapsed && footerItems.length > 0 && (
                            <ul className="flex flex-col gap-0.5">
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

                        {/* Account */}
                        {authLoading ? (
                            <div className={cx(isCollapsed ? "flex justify-center" : "")}>
                                <div className={cx(
                                    "rounded-full bg-secondary animate-pulse",
                                    isCollapsed ? "size-10" : "h-14 w-full"
                                )} />
                            </div>
                        ) : user ? (
                            isCollapsed ? (
                                <AriaDialogTrigger>
                                    <div suppressHydrationWarning>
                                        <AriaButton
                                            className={({ isPressed, isFocused }) =>
                                                cx("group relative inline-flex rounded-full", (isPressed || isFocused) && "outline-2 outline-offset-2 outline-focus-ring")
                                            }
                                        >
                                            <Avatar
                                                status="online"
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=E9684B&color=fff`}
                                                size="md"
                                                alt={userDisplayName}
                                            />
                                        </AriaButton>
                                    </div>
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
                            ) : (
                                <NavAccountCard />
                            )
                        ) : null}
                    </div>
                </motion.aside>
            </div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <motion.div
                initial={false}
                animate={{ paddingLeft: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
