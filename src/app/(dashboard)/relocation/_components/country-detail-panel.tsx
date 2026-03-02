import { useState } from "react";
import type { CountryData } from "../_data/types";
import { metrics, metricKeys, getFlagEmoji } from "../_data/utils";

interface CountryDetailPanelProps {
  country: CountryData;
  comparisonList: string[];
  onAddToCompare: () => void;
  onBack: () => void;
}

export function CountryDetailPanel({ country, comparisonList, onAddToCompare, onBack }: CountryDetailPanelProps) {
  const [salary, setSalary] = useState(80000);
  const isCompared = comparisonList.includes(country.numericCode);
  const canCompare = comparisonList.length < 3 && !isCompared;
  const netSalary = salary * (1 - country.taxRate / 100);
  const purchasingPower = (netSalary / country.costOfLivingIndex) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{getFlagEmoji(country.code)}</span>
        <div>
          <h2 className="text-lg font-semibold text-primary">{country.name}</h2>
          <p className="text-xs text-tertiary">{country.continent}</p>
        </div>
      </div>

      {!country.hasDetailedData && (
        <div className="rounded-md bg-utility-warning-50 px-3 py-2 text-xs text-utility-warning-700">
          Data is estimated for this country
        </div>
      )}

      <div className="rounded-lg bg-secondary p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-secondary">Life Score</span>
          <span className="text-xl font-bold text-primary">{country.lifeScore.toFixed(1)}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-tertiary">
          <div className="h-full rounded-full bg-brand-solid transition-all" style={{ width: `${country.lifeScore}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {metricKeys.filter((k) => k !== "lifeScore").map((key) => {
          const config = metrics[key];
          return (
            <div key={key} className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs text-tertiary">{config.label}</span>
              <span className="text-sm font-medium text-primary">{config.format(country[key] as number)}</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-secondary p-3">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary">Net Salary Calculator</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-tertiary">$</span>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-primary bg-primary px-2 py-1.5 text-sm text-primary outline-none focus:ring-2 focus:ring-brand-solid"
          />
          <span className="text-xs text-tertiary">/yr</span>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-xs text-tertiary">Tax ({country.taxRate}%)</span>
            <span className="text-xs text-utility-error-600">-${((salary * country.taxRate) / 100).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-tertiary">Net Salary</span>
            <span className="text-sm font-semibold text-utility-success-600">${Math.round(netSalary).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-primary pt-1.5">
            <span className="text-xs text-tertiary">Purchasing Power</span>
            <span className="text-sm font-semibold text-primary">${Math.round(purchasingPower).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {canCompare && (
          <button onClick={onAddToCompare} className="rounded-lg bg-utility-brand-50 px-4 py-2 text-sm font-medium text-utility-brand-700 hover:bg-utility-brand-100">
            + Add to Compare
          </button>
        )}
        {isCompared && (
          <span className="rounded-lg bg-utility-brand-50 px-4 py-2 text-center text-sm font-medium text-utility-brand-700">In Comparison</span>
        )}
        <button onClick={onBack} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary hover:bg-tertiary">
          Back to World Map
        </button>
      </div>
    </div>
  );
}
