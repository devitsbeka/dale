"use client";

import { memo, useCallback, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import type { MetricKey } from "../_data/types";
import { countriesByNumericCode } from "../_data/countries";
import { metrics, getColorForValue, getMetricRange, NO_DATA_COLOR } from "../_data/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  selectedMetric: MetricKey;
  selectedCountry: string | null;
  comparisonList: string[];
  mapCenter: [number, number];
  mapZoom: number;
  onHover: (numericCode: string | null, event?: React.MouseEvent) => void;
  onClick: (numericCode: string) => void;
  onMoveEnd: (position: { coordinates: [number, number]; zoom: number }) => void;
}

export const WorldMap = memo(function WorldMap({
  selectedMetric, selectedCountry, comparisonList,
  mapCenter, mapZoom, onHover, onClick, onMoveEnd,
}: WorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const config = metrics[selectedMetric];
  const { min, max } = getMetricRange(selectedMetric);

  const handleMouseEnter = useCallback((geoId: string, event: React.MouseEvent) => {
    setHoveredId(geoId);
    onHover(geoId, event);
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    onHover(null);
  }, [onHover]);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 140, center: [0, 20] }}
      className="h-full w-full"
      style={{ width: "100%", height: "100%" }}
    >
      <ZoomableGroup center={mapCenter} zoom={mapZoom} onMoveEnd={onMoveEnd} maxZoom={12} minZoom={1}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoId = geo.id;
              const country = countriesByNumericCode[geoId];
              const isHovered = hoveredId === geoId;
              const isSelected = selectedCountry === geoId;
              const isCompared = comparisonList.includes(geoId);

              let fill = NO_DATA_COLOR;
              if (country) {
                fill = getColorForValue(country[selectedMetric] as number, min, max, config.invertScale);
              }

              let strokeColor = "#fff";
              let strokeWidth = 0.5;
              if (isSelected) { strokeColor = "#7C3AED"; strokeWidth = 2; }
              else if (isCompared) { strokeColor = "#7C3AED"; strokeWidth = 1.5; }
              else if (isHovered) { strokeColor = "#7C3AED"; strokeWidth = 1.5; }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e: React.MouseEvent) => handleMouseEnter(geoId, e)}
                  onMouseMove={(e: React.MouseEvent) => onHover(geoId, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onClick(geoId)}
                  fill={fill}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth / mapZoom}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
});
