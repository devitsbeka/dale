import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { cx } from "@/utils/cx";

type MetricChangeIndicatorProps = {
    type: "trend" | "change";
    trend: "positive" | "negative" | "neutral";
    value: string;
    className?: string;
};

export const MetricChangeIndicator = ({ type, trend, value, className }: MetricChangeIndicatorProps) => {
    const isPositive = trend === "positive";
    const isNegative = trend === "negative";
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
        <div
            className={cx(
                "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-sm font-medium",
                isPositive && "bg-utility-success-50 text-utility-success-700",
                isNegative && "bg-utility-error-50 text-utility-error-700",
                trend === "neutral" && "bg-utility-gray-50 text-utility-gray-700",
                className,
            )}
        >
            {trend !== "neutral" && <Icon className="size-4" />}
            <span>{value}</span>
        </div>
    );
};
