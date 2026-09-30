import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Medicine } from '../../types';
import { MEDICINES } from '../../data/mockData';
import { generateDemandForecast } from '../../services/forecastingService';

interface DemandForecastChartProps {
  onNavigateToForecast: () => void;
}

export const DemandForecastChart: React.FC<DemandForecastChartProps> = ({ onNavigateToForecast }) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(MEDICINES[0].id);
  const [horizon, setHorizon] = useState<7 | 30 | 90>(30);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const forecastData = generateDemandForecast({
    medicineId: selectedMedId,
    hospitalId: 'hosp-1',
    horizonDays: horizon
  });

  const points = forecastData.points;
  const maxDemand = Math.max(...points.map((p) => Math.max(p.actualDemand || 0, p.confidenceUpper || 0)), 150);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  // Convert points to SVG coordinates
  const coords = points.map((p, i) => {
    const x = paddingX + (i / (points.length - 1)) * usableWidth;
    const yPredicted = svgHeight - paddingY - (p.predictedDemand / maxDemand) * usableHeight;
    const yActual = p.actualDemand !== undefined ? svgHeight - paddingY - (p.actualDemand / maxDemand) * usableHeight : null;
    const yUpper = svgHeight - paddingY - (p.confidenceUpper / maxDemand) * usableHeight;
    const yLower = svgHeight - paddingY - (p.confidenceLower / maxDemand) * usableHeight;
    return { x, yPredicted, yActual, yUpper, yLower, data: p };
  });

  // Predicted Path
  const predictedPath = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.yPredicted.toFixed(1)}`, '');

  // Actual Path (only for past points)
  const actualCoords = coords.filter((c) => c.yActual !== null);
  const actualPath = actualCoords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.yActual!.toFixed(1)}`, '');

  // Confidence Band Area Path
  const upperPath = coords.map((c) => `${c.x.toFixed(1)},${c.yUpper.toFixed(1)}`).join(' ');
  const lowerPath = [...coords].reverse().map((c) => `${c.x.toFixed(1)},${c.yLower.toFixed(1)}`).join(' ');
  const confidenceBandArea = `M ${upperPath} L ${lowerPath} Z`;

  // Find index of Today (where actual demand stops)
  const todayIndex = coords.findIndex((c) => c.data.actualDemand === undefined) - 1;
  const todayX = todayIndex >= 0 ? coords[todayIndex].x : coords[14].x;

  const activePoint = hoveredPointIndex !== null ? coords[hoveredPointIndex] : coords[coords.length - 1];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      {/* Header with selector & horizon pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Medicine Demand Forecast
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
              XGBoost ML (R² 0.94)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Actual consumption vs predictive model trajectory with 95% confidence band
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Medicine Selector */}
          <select
            value={selectedMedId}
            onChange={(e) => setSelectedMedId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {MEDICINES.slice(0, 8).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.dosage})
              </option>
            ))}
          </select>

          {/* Horizon Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold text-slate-600">
            <button
              onClick={() => setHorizon(7)}
              className={`px-2 py-1 rounded-md transition-all ${horizon === 7 ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              7D
            </button>
            <button
              onClick={() => setHorizon(30)}
              className={`px-2 py-1 rounded-md transition-all ${horizon === 30 ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              30D
            </button>
            <button
              onClick={() => setHorizon(90)}
              className={`px-2 py-1 rounded-md transition-all ${horizon === 90 ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              90D
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Summary Info */}
      <div className="flex flex-wrap items-center justify-between text-xs py-2 px-1 text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-900 rounded-full"></span>
            <span className="font-semibold text-slate-800">Actual Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-teal-500 rounded-full border-b border-dashed"></span>
            <span className="font-semibold text-teal-700">Predicted Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-teal-100 rounded-xs border border-teal-200"></span>
            <span className="text-slate-500 text-[11px]">95% Confidence Band</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="font-medium text-slate-500">
            Daily Burn Rate: <strong className="text-slate-900">{forecastData.dailyAverageRunRate} units/day</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-slate-500">
            Total Horizon Demand: <strong className="text-teal-700">{forecastData.projectedTotalDemand} units</strong>
          </span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full h-[220px] bg-slate-50/50 rounded-lg p-1 border border-slate-100">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + ratio * usableHeight;
            const val = Math.round(maxDemand * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  fontSize="9"
                  fill="#94a3b8"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Today Separator Line */}
          <line
            x1={todayX}
            y1={paddingY}
            x2={todayX}
            y2={svgHeight - paddingY}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={todayX - 4}
            y={paddingY + 12}
            fontSize="9"
            fontWeight="bold"
            fill="#64748b"
            textAnchor="end"
          >
            Today (T-0)
          </text>
          <text
            x={todayX + 4}
            y={paddingY + 12}
            fontSize="9"
            fontWeight="bold"
            fill="#0f766e"
            textAnchor="start"
          >
            AI Forecast →
          </text>

          {/* Confidence Band Polygon */}
          <polygon
            points={coords.map((c) => `${c.x},${c.yUpper}`).join(' ') + ' ' + [...coords].reverse().map((c) => `${c.x},${c.yLower}`).join(' ')}
            fill="#ccfbf1"
            opacity="0.6"
          />

          {/* Predicted Demand Line (Teal) */}
          <path
            d={predictedPath}
            fill="none"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Actual Demand Line (Dark Slate) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Scrub Dots */}
          {coords.map((c, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPointIndex(i)}
            >
              <circle
                cx={c.x}
                cy={c.yPredicted}
                r={hoveredPointIndex === i ? 6 : 2}
                fill={hoveredPointIndex === i ? '#0d9488' : 'transparent'}
                stroke="#0d9488"
                strokeWidth={hoveredPointIndex === i ? 2 : 0}
              />
              {/* Invisible wider target for touch/mouse */}
              <rect
                x={c.x - usableWidth / points.length / 2}
                y={paddingY}
                width={usableWidth / points.length}
                height={usableHeight}
                fill="transparent"
              />
            </g>
          ))}

          {/* Scrubber Guideline & Tooltip */}
          {hoveredPointIndex !== null && activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingY}
                x2={activePoint.x}
                y2={svgHeight - paddingY}
                stroke="#0d9488"
                strokeWidth="1"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.yPredicted}
                r="5"
                fill="#0d9488"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && (
          <div
            className="absolute top-2 right-4 bg-slate-900/90 backdrop-blur-xs text-white p-2.5 rounded-lg text-xs shadow-lg pointer-events-none border border-slate-700"
          >
            <div className="font-bold text-slate-300 text-[10px]">
              {activePoint.data.date}
            </div>
            <div className="mt-1 flex items-center gap-3">
              {activePoint.data.actualDemand !== undefined ? (
                <div>
                  <span className="text-[10px] text-slate-400 block">Actual</span>
                  <span className="text-white font-bold text-sm">
                    {activePoint.data.actualDemand} units
                  </span>
                </div>
              ) : null}
              <div>
                <span className="text-[10px] text-teal-400 block">Forecast</span>
                <span className="text-teal-300 font-bold text-sm">
                  {activePoint.data.predictedDemand} units
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">95% Range</span>
                <span className="text-slate-300 font-medium text-[11px]">
                  {activePoint.data.confidenceLower} - {activePoint.data.confidenceUpper}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Explainer Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px]">
            Explainability: <strong>+18% Dengue vector surge</strong> + <strong>28% rainfall anomaly</strong> accelerating consumption rate.
          </span>
        </div>
        <button
          onClick={onNavigateToForecast}
          className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 hover:underline"
        >
          Detailed ML Workspace <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
