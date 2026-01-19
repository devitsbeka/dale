import { Avatar } from "@/components/base/avatar/avatar";
import { cx } from "@/utils/cx";

export type FeedItemType = {
    id: string;
    user: {
        name: string;
        avatarUrl: string;
    };
    action: string;
    timestamp: string;
    href?: string;
};

type FeedItemProps = FeedItemType & {
    size?: "sm" | "md" | "lg";
    connector?: boolean;
};

export const FeedItem = ({ user, action, timestamp, href, size = "md", connector = true }: FeedItemProps) => {
    const avatarSize = size === "sm" ? "xs" : size === "md" ? "sm" : "md";

    return (
        <div className={cx("flex gap-3", connector && "relative pb-8")}>
            {connector && <div className="absolute top-10 left-5 -ml-px h-full w-0.5 bg-border-secondary" aria-hidden="true" />}

            <Avatar
                size={avatarSize}
                src={user.avatarUrl}
                alt={user.name}
                initials={user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                className="relative"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-start justify-between gap-x-3">
                    <p className={cx("font-medium text-secondary", size === "sm" ? "text-sm" : "text-md")}>{user.name}</p>
                    <p className={cx("shrink-0 text-tertiary", size === "sm" ? "text-xs" : "text-sm")}>{timestamp}</p>
                </div>
                <p className={cx("text-tertiary", size === "sm" ? "text-sm" : "text-md")}>{action}</p>
            </div>
        </div>
    );
};
