import type { TooltipProps } from "recharts";
import { cx } from "@/utils/cx";

export const ChartTooltipContent = ({ active, payload, label, formatter, labelFormatter }: TooltipProps<any, any>) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const displayLabel = labelFormatter ? labelFormatter(label, payload) : label;

    return (
        <div className="rounded-lg bg-primary p-3 shadow-lg ring-1 ring-secondary">
            {displayLabel && <p className="mb-2 text-sm font-semibold text-primary">{displayLabel}</p>}
            <div className="flex flex-col gap-1">
                {payload.map((entry, index) => {
                    const value = formatter ? formatter(entry.value, entry.name, entry, index, payload) : entry.value;
                    return (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                            <div className={cx("size-2 rounded-full")} style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-tertiary">{value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
