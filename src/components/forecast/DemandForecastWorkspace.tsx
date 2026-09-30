import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Info,
  CheckCircle2,
  Cpu,
  BrainCircuit,
  Sliders,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Medicine, Hospital, District } from '../../types';
import { MEDICINES, HOSPITALS, DISTRICTS, ML_BENCHMARKS } from '../../data/mockData';
import { generateDemandForecast } from '../../services/forecastingService';

interface DemandForecastWorkspaceProps {
  onNavigateToRisk: () => void;
}

export const DemandForecastWorkspace: React.FC<DemandForecastWorkspaceProps> = ({ onNavigateToRisk }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist-1');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-1');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('med-1');
  const [horizon, setHorizon] = useState<7 | 30 | 90>(30);
  const [selectedModel, setSelectedModel] = useState<'XGBoost' | 'Random Forest' | 'Prophet'>('XGBoost');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter hospitals by district
  const availableHospitals = HOSPITALS.filter(
    (h) => selectedDistrictId === 'ALL' || h.districtId === selectedDistrictId
  );

  const forecast = generateDemandForecast({
    medicineId: selectedMedicineId,
    hospitalId: selectedHospitalId,
    horizonDays: horizon
  });

  const selectedMed = MEDICINES.find((m) => m.id === selectedMedicineId) || MEDICINES[0];
  const selectedHosp = HOSPITALS.find((h) => h.id === selectedHospitalId) || HOSPITALS[0];

  const points = forecast.points;
  const maxDemand = Math.max(...points.map((p) => Math.max(p.actualDemand || 0, p.confidenceUpper || 0)), 120);

  // SVG Chart Dimensions
  const svgWidth = 840;
  const svgHeight = 260;
  const padX = 45;
  const padY = 30;
  const usableW = svgWidth - padX * 2;
  const usableH = svgHeight - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * usableW;
    const yPred = svgHeight - padY - (p.predictedDemand / maxDemand) * usableH;
    const yAct = p.actualDemand !== undefined ? svgHeight - padY - (p.actualDemand / maxDemand) * usableH : null;
    const yUp = svgHeight - padY - (p.confidenceUpper / maxDemand) * usableH;
    const yLow = svgHeight - padY - (p.confidenceLower / maxDemand) * usableH;
    return { x, yPred, yAct, yUp, yLow, data: p };
  });

  const predPath = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.yPred.toFixed(1)}`, '');
  const actCoords = coords.filter((c) => c.yAct !== null);
  const actPath = actCoords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.yAct!.toFixed(1)}`, '');

  const todayIndex = coords.findIndex((c) => c.data.actualDemand === undefined) - 1;
  const todayX = todayIndex >= 0 ? coords[todayIndex].x : coords[14].x;

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : coords[coords.length - 1];

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AI Demand Forecasting & Epidemiological Workspace
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Module 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multi-variate regression correlating historical dispense rates, disease outbreaks, and rainfall anomalies.
          </p>
        </div>

        {/* Global Action CTA */}
        <button
          onClick={onNavigateToRisk}
          className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Activity className="w-3.5 h-3.5" />
          Evaluate Stock Risk Matrix
        </button>
      </div>

      {/* Control Bar: Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* District Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">Health District</label>
          <select
            value={selectedDistrictId}
            onChange={(e) => {
              setSelectedDistrictId(e.target.value);
              const firstH = HOSPITALS.find((h) => e.target.value === 'ALL' || h.districtId === e.target.value);
              if (firstH) setSelectedHospitalId(firstH.id);
            }}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="ALL">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hospital Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">Target Healthcare Facility</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500/20"
          >
            {availableHospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.beds} Beds)
              </option>
            ))}
          </select>
        </div>

        {/* Medicine Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">Formulary Item</label>
          <select
            value={selectedMedicineId}
            onChange={(e) => setSelectedMedicineId(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-teal-500/20"
          >
            {MEDICINES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.dosage})
              </option>
            ))}
          </select>
        </div>

        {/* Horizon Filter */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">Forecast Horizon</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold text-slate-700">
            <button
              onClick={() => setHorizon(7)}
              className={`py-1 rounded text-center transition-all ${horizon === 7 ? 'bg-white shadow-2xs text-teal-800' : 'hover:text-slate-900'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setHorizon(30)}
              className={`py-1 rounded text-center transition-all ${horizon === 30 ? 'bg-white shadow-2xs text-teal-800' : 'hover:text-slate-900'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setHorizon(90)}
              className={`py-1 rounded text-center transition-all ${horizon === 90 ? 'bg-white shadow-2xs text-teal-800' : 'hover:text-slate-900'}`}
            >
              90 Days
            </button>
          </div>
        </div>
      </div>

      {/* Main Time Series Chart Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900">
                {selectedMed.name} Demand Projection Curve
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {selectedHosp.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical consumption trajectory spliced with forward {horizon}-day multi-variate machine learning model
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-2 bg-slate-50 rounded-lg text-center">
              <span className="text-slate-400 text-[10px] block font-sans">Predicted Run-Rate</span>
              <span className="font-bold text-slate-900 text-sm">
                {forecast.dailyAverageRunRate} {selectedMed.unit}/day
              </span>
            </div>
            <div className="p-2 bg-teal-50 rounded-lg text-center">
              <span className="text-teal-600 text-[10px] block font-sans">Total {horizon}D Demand</span>
              <span className="font-bold text-teal-800 text-sm">
                {forecast.projectedTotalDemand.toLocaleString()} {selectedMed.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs py-1 text-slate-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-slate-900 rounded-full"></span>
              <span className="font-semibold text-slate-800">Historical Actuals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-teal-600 rounded-full"></span>
              <span className="font-semibold text-teal-700">AI ML Projection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-teal-100 rounded-xs border border-teal-200"></span>
              <span className="text-slate-500 text-[11px]">Confidence Interval (±12%)</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            Correlated with 12 months consumption + active monsoon outbreak
          </span>
        </div>

        {/* Chart SVG */}
        <div className="relative w-full h-[260px] bg-slate-50/50 rounded-xl p-2 border border-slate-100">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padY + ratio * usableH;
              const val = Math.round(maxDemand * (1 - ratio));
              return (
                <g key={ratio}>
                  <line x1={padX} y1={y} x2={svgWidth - padX} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x={padX - 8} y={y + 3} fontSize="9" fill="#94a3b8" textAnchor="end">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Today Dividing Line */}
            <line x1={todayX} y1={padY} x2={todayX} y2={svgHeight - padY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x={todayX - 5} y={padY + 12} fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">
              Historical Past
            </text>
            <text x={todayX + 5} y={padY + 12} fontSize="9" fontWeight="bold" fill="#0f766e" textAnchor="start">
              Future AI Projection →
            </text>

            {/* Confidence Band Polygon */}
            <polygon
              points={coords.map((c) => `${c.x},${c.yUp}`).join(' ') + ' ' + [...coords].reverse().map((c) => `${c.x},${c.yLow}`).join(' ')}
              fill="#ccfbf1"
              opacity="0.6"
            />

            {/* AI Predicted Line */}
            <path d={predPath} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Actual Past Line */}
            <path d={actPath} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Scrubber Handles */}
            {coords.map((c, i) => (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)}>
                <circle
                  cx={c.x}
                  cy={c.yPred}
                  r={hoveredIdx === i ? 6 : 2}
                  fill={hoveredIdx === i ? '#0d9488' : 'transparent'}
                  stroke="#0d9488"
                  strokeWidth={hoveredIdx === i ? 2 : 0}
                />
                <rect x={c.x - usableW / points.length / 2} y={padY} width={usableW / points.length} height={usableH} fill="transparent" />
              </g>
            ))}

            {hoveredIdx !== null && activePoint && (
              <g>
                <line x1={activePoint.x} y1={padY} x2={activePoint.x} y2={svgHeight - padY} stroke="#0d9488" strokeWidth="1" />
                <circle cx={activePoint.x} cy={activePoint.yPred} r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
              </g>
            )}
          </svg>

          {/* Floating Scrub Badge */}
          {activePoint && (
            <div className="absolute top-3 right-6 bg-slate-900/90 text-white p-3 rounded-xl shadow-lg border border-slate-700 pointer-events-none text-xs">
              <span className="text-[10px] text-slate-400 block font-bold">{activePoint.data.date}</span>
              <div className="mt-1 flex items-center gap-3">
                {activePoint.data.actualDemand !== undefined && (
                  <div>
                    <span className="text-[10px] text-slate-400 block">Actual</span>
                    <span className="font-bold text-white text-sm">{activePoint.data.actualDemand}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-teal-400 block">AI Forecast</span>
                  <span className="font-bold text-teal-300 text-sm">{activePoint.data.predictedDemand}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">95% Range</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {activePoint.data.confidenceLower} - {activePoint.data.confidenceUpper}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explainable AI Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Explainable Reasoning Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Explainable AI (XAI) Demand Attribution
              </h3>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Confidence Score: {forecast.confidenceScore}%
            </span>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
            <p className="font-bold text-indigo-950 text-sm">
              "{forecast.explainableInsight.headline}"
            </p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Multi-variate regression isolated 3 dominant external features shifting the consumption baseline above seasonal averages.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {forecast.explainableInsight.factors.map((f, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{f.label}</span>
                <span className="font-bold text-teal-700 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
                  {f.impact}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-900 block">Recommended Supply Response:</span>
              <span className="text-teal-800 mt-0.5 block">{forecast.explainableInsight.suggestedAction}</span>
            </div>
          </div>
        </div>

        {/* ML Model Benchmark Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-slate-700" />
                <h3 className="font-extrabold text-sm text-slate-900">Model Performance</h3>
              </div>
              <span className="text-[10px] text-slate-400">Tested on 12M rows</span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Cross-validated benchmark across 3 ML architectures under identical test folds:
            </p>

            <div className="mt-3 space-y-2.5">
              {ML_BENCHMARKS.map((m) => (
                <div
                  key={m.modelType}
                  onClick={() => setSelectedModel(m.modelType)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedModel === m.modelType
                      ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-500/20 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{m.modelName}</span>
                    {m.isBestPerformer && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-600 text-white">
                        Best Fit
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-1 mt-2 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-400 block">MAE</span>
                      <span className="font-bold text-slate-800">{m.mae}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">RMSE</span>
                      <span className="font-bold text-slate-800">{m.rmse}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">MAPE</span>
                      <span className="font-bold text-slate-800">{m.mape}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">R² Score</span>
                      <span className="font-bold text-teal-700">{m.r2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-tight">
            * Benchmark metrics calculated on historical dataset cross-validation folds. Production pipeline defaults to XGBoost Regressor.
          </div>
        </div>
      </div>
    </div>
  );
};
