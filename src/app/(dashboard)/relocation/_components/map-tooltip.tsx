import type { MetricKey, CountryData } from "../_data/types";
import { metrics, getFlagEmoji } from "../_data/utils";

interface MapTooltipProps {
  country: CountryData;
  metric: MetricKey;
  x: number;
  y: number;
}

export function MapTooltip({ country, metric, x, y }: MapTooltipProps) {
  const config = metrics[metric];
  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg bg-primary p-3 shadow-lg ring-1 ring-secondary"
      style={{ left: x + 12, top: y - 40 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{getFlagEmoji(country.code)}</span>
        <span className="text-sm font-semibold text-primary">{country.name}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs text-tertiary">{config.label}:</span>
        <span className="text-xs font-medium text-primary">{config.format(country[metric] as number)}</span>
      </div>
      {!country.hasDetailedData && (
        <span className="mt-1 block text-xs italic text-quaternary">Estimated</span>
      )}
    </div>
  );
}
