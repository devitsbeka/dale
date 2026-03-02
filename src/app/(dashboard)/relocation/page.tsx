"use client";

import { useState, useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import type { MetricKey } from "./_data/types";
import { countries, countriesByNumericCode } from "./_data/countries";
import { metrics, metricKeys, getCentroidZoom, getFlagEmoji, getMetricRange, getColorForValue, NO_DATA_COLOR } from "./_data/utils";
import { WorldMap } from "./_components/world-map";
import { MapTooltip } from "./_components/map-tooltip";
import { CountryDetailPanel } from "./_components/country-detail-panel";
import { CountryComparison } from "./_components/country-comparison";

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1;

export default function RelocationPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("lifeScore");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [salary, setSalary] = useState(150000);

  const hoveredData = hoveredCountry ? countriesByNumericCode[hoveredCountry] : null;
  const selectedData = selectedCountry ? countriesByNumericCode[selectedCountry] : null;
  const comparisonCountries = useMemo(
    () => comparisonList.map((code) => countriesByNumericCode[code]).filter(Boolean),
    [comparisonList],
  );

  const handleHover = useCallback((numericCode: string | null, event?: React.MouseEvent) => {
    setHoveredCountry(numericCode);
    if (event) setTooltipPos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleClick = useCallback((numericCode: string) => {
    const country = countriesByNumericCode[numericCode];
    if (!country) return;
    setSelectedCountry(numericCode);
    const { center, zoom } = getCentroidZoom(numericCode, country);
    setMapCenter(center);
    setMapZoom(zoom);
  }, []);

  const handleBackToWorld = useCallback(() => {
    setSelectedCountry(null);
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  }, []);

  const handleAddToCompare = useCallback(() => {
    if (!selectedCountry) return;
    setComparisonList((prev) => {
      if (prev.includes(selectedCountry) || prev.length >= 3) return prev;
      return [...prev, selectedCountry];
    });
  }, [selectedCountry]);

  const handleRemoveFromCompare = useCallback((numericCode: string) => {
    setComparisonList((prev) => prev.filter((c) => c !== numericCode));
  }, []);

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setMapCenter(position.coordinates);
    setMapZoom(position.zoom);
  }, []);

  // Legend steps
  const metricConfig = metrics[selectedMetric];
  const { min: metricMin, max: metricMax } = getMetricRange(selectedMetric);
  const legendSteps = metricConfig.invertScale
    ? ["hsl(120,70%,45%)", "hsl(90,70%,45%)", "hsl(60,70%,45%)", "hsl(30,70%,45%)", "hsl(0,70%,45%)"]
    : ["hsl(0,70%,45%)", "hsl(30,70%,45%)", "hsl(60,70%,45%)", "hsl(90,70%,45%)", "hsl(120,70%,45%)"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Relocation Intelligence</h1>
        <p className="text-md text-tertiary">
          Explore 150+ countries. Click any country for detailed metrics and comparison tools.
        </p>
      </div>

      {/* Metric selector + salary + legend */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {metricKeys.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                key === selectedMetric
                  ? "bg-brand-solid text-white"
                  : "bg-secondary text-secondary hover:bg-tertiary"
              }`}
            >
              {metrics[key].shortLabel}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-tertiary">{metricConfig.format(metricMin)}</span>
            <div className="flex h-2.5 w-28 overflow-hidden rounded-full">
              {legendSteps.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-xs text-tertiary">{metricConfig.format(metricMax)}</span>
          </div>
        </div>
      </div>

      {/* Main layout: map + panel */}
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Map column */}
        <div className="min-w-0 flex-1">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-secondary shadow-xs ring-1 ring-secondary">
            <WorldMap
              selectedMetric={selectedMetric}
              selectedCountry={selectedCountry}
              comparisonList={comparisonList}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              onHover={handleHover}
              onClick={handleClick}
              onMoveEnd={handleMoveEnd}
            />
            {mapZoom > 1 && (
              <button
                onClick={handleBackToWorld}
                className="absolute bottom-3 left-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-secondary shadow-md ring-1 ring-secondary hover:bg-secondary"
              >
                Back to World
              </button>
            )}
          </div>

          {/* Comparison chart */}
          {comparisonCountries.length >= 2 && (
            <div className="mt-6">
              <CountryComparison countries={comparisonCountries} onRemove={handleRemoveFromCompare} />
            </div>
          )}

          {/* Mobile detail panel */}
          {selectedData && (
            <div className="mt-6 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary lg:hidden">
              <CountryDetailPanel
                country={selectedData}
                comparisonList={comparisonList}
                onAddToCompare={handleAddToCompare}
                onBack={handleBackToWorld}
              />
            </div>
          )}
        </div>

        {/* Desktop right panel */}
        <div className="hidden w-80 shrink-0 lg:block">
          {selectedData ? (
            <div className="sticky top-8 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
              <CountryDetailPanel
                country={selectedData}
                comparisonList={comparisonList}
                onAddToCompare={handleAddToCompare}
                onBack={handleBackToWorld}
              />
            </div>
          ) : (
            <div className="sticky top-8 flex flex-col items-center justify-center rounded-xl bg-secondary p-8 text-center ring-1 ring-secondary">
              <div className="text-4xl">🌍</div>
              <p className="mt-3 text-sm font-medium text-secondary">Select a Country</p>
              <p className="mt-1 text-xs text-tertiary">
                Click any country on the map to see detailed metrics, salary calculations, and comparison tools.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredData && (
        <MapTooltip country={hoveredData} metric={selectedMetric} x={tooltipPos.x} y={tooltipPos.y} />
      )}
    </div>
  );
}
