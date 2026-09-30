import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Filter,
  Layers,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { Hospital, District } from '../../types';

interface DistrictRiskMapProps {
  hospitals: Hospital[];
  districts: District[];
  onSelectHospital: (hospital: Hospital) => void;
  selectedDistrictId: string;
}

export const DistrictRiskMap: React.FC<DistrictRiskMapProps> = ({
  hospitals,
  districts,
  onSelectHospital,
  selectedDistrictId
}) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL' | 'SURPLUS'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter hospitals based on district and selection
  const filteredHospitals = hospitals.filter((h) => {
    if (selectedDistrictId !== 'ALL' && h.districtId !== selectedDistrictId) return false;
    if (filterType === 'CRITICAL') return h.riskLevel === 'CRITICAL';
    if (filterType === 'SURPLUS') return h.surplusMedicinesCount > 5;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col relative">
      {/* Map Control Header */}
      <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              District Health Supply Resilience Map
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Live Geo-Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geospatial risk clustering across healthcare facilities and transport corridors
          </p>
        </div>

        {/* Filters & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({hospitals.length})
            </button>
            <button
              onClick={() => setFilterType('CRITICAL')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                filterType === 'CRITICAL' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse"></span>
              Critical Shortages ({hospitals.filter((h) => h.riskLevel === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setFilterType('SURPLUS')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === 'SURPLUS' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Surplus Hubs
            </button>
          </div>

          <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1.5 text-slate-600 hover:bg-slate-100 border-r border-slate-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
              className="p-1.5 text-slate-600 hover:bg-slate-100"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-[400px] lg:h-[480px] bg-slate-950 overflow-hidden select-none">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 text-white text-[11px] shadow-lg pointer-events-auto">
          <div className="font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-teal-400" />
            Facility Risk Status
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
              <span className="text-rose-200 font-semibold">Critical Risk (Runway &lt; 3d)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
              <span className="text-amber-200 font-semibold">Medium Warning (Runway 3-7d)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
              <span className="text-emerald-200 font-semibold">Healthy / Surplus Stock</span>
            </div>
          </div>
        </div>

        {/* Map SVG */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* District boundary approximations (curved topological contours) */}
          <path
            d="M 120 50 Q 300 30 500 70 T 900 60 L 920 320 Q 800 380 650 350 T 200 450 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="2"
            opacity="0.9"
          />
          <path
            d="M 280 120 Q 450 100 620 140 T 780 280 Q 600 320 400 290 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Active transfer route lines between surplus and shortage hubs */}
          <g className="transfer-corridors">
            {/* Transfer 1: Metro North -> Metro Apex */}
            <line
              x1="390"
              y1="150"
              x2="420"
              y2="190"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="animate-flow"
            />
            {/* Transfer 2: East Valley -> River Delta */}
            <line
              x1="860"
              y1="190"
              x2="740"
              y2="280"
              stroke="#10b981"
              strokeWidth="2"
              className="animate-flow"
            />
            {/* Transfer 3: Highland Apex -> Metro Apex */}
            <line
              x1="440"
              y1="390"
              x2="420"
              y2="190"
              stroke="#06b6d4"
              strokeWidth="2"
              className="animate-flow"
            />
          </g>

          {/* District Labels */}
          {districts.map((d, index) => {
            const positions = [
              { x: 410, y: 140 },
              { x: 610, y: 440 },
              { x: 740, y: 260 },
              { x: 840, y: 170 },
              { x: 380, y: 50 },
              { x: 210, y: 310 },
              { x: 440, y: 370 },
              { x: 260, y: 210 },
              { x: 500, y: 460 },
              { x: 460, y: 90 },
            ];
            const pos = positions[index] || { x: 300, y: 300 };
            return (
              <text
                key={d.id}
                x={pos.x}
                y={pos.y}
                fill="#475569"
                fontSize="11"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
                opacity="0.6"
              >
                {d.name.toUpperCase()}
              </text>
            );
          })}

          {/* Hospital Risk Markers */}
          {filteredHospitals.map((hospital) => {
            const isCrit = hospital.riskLevel === 'CRITICAL';
            const isWarn = hospital.riskLevel === 'MEDIUM';
            const isSelected = selectedHospital?.id === hospital.id;

            const fillColor = isCrit ? '#f43f5e' : isWarn ? '#fbbf24' : '#10b981';
            const glowColor = isCrit ? 'rgba(244, 63, 94, 0.4)' : isWarn ? 'rgba(251, 191, 36, 0.3)' : 'rgba(16, 185, 129, 0.2)';

            return (
              <g
                key={hospital.id}
                className="cursor-pointer group"
                onClick={() => setSelectedHospital(hospital)}
              >
                {/* Outer animated ping ring for critical */}
                {isCrit && (
                  <circle
                    cx={hospital.coordinates.x}
                    cy={hospital.coordinates.y}
                    r="18"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={hospital.coordinates.x}
                  cy={hospital.coordinates.y}
                  r={isSelected ? "14" : "10"}
                  fill={glowColor}
                  className="transition-all duration-200"
                />

                {/* Core hospital pin */}
                <circle
                  cx={hospital.coordinates.x}
                  cy={hospital.coordinates.y}
                  r={isSelected ? "8" : "6"}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Hospital mini-label on hover or selection */}
                <text
                  x={hospital.coordinates.x}
                  y={hospital.coordinates.y - 12}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className={`pointer-events-none drop-shadow-md ${
                    isSelected || isCrit ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity`}
                >
                  {hospital.name.split(' ')[0]} {isCrit ? '⚠️' : ''}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Hospital Popup Card */}
        {selectedHospital && (
          <div className="absolute bottom-4 right-4 z-20 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    selectedHospital.riskLevel === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : selectedHospital.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {selectedHospital.riskLevel} RISK • Score {selectedHospital.riskScore}/100
                </span>
                <h4 className="font-extrabold text-sm text-white mt-1.5 leading-snug">
                  {selectedHospital.name}
                </h4>
                <p className="text-xs text-slate-400">{selectedHospital.districtName} • {selectedHospital.beds} Beds</p>
              </div>
              <button
                onClick={() => setSelectedHospital(null)}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-2 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Critical Drugs</span>
                <span className="text-rose-400 font-bold text-sm">
                  {selectedHospital.criticalMedicinesCount} Deficits
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Surplus Medicines</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedHospital.surplusMedicinesCount} Available
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Days Until First Stock-out</span>
                  <span className="text-white font-bold text-xs">
                    {selectedHospital.riskLevel === 'CRITICAL' ? '2.0 Days (Insulin & ORS)' : '18+ Days Runway'}
                  </span>
                </div>
                {selectedHospital.riskLevel === 'CRITICAL' && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    Urgent Transfer
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{selectedHospital.code}</span>
              <button
                onClick={() => onSelectHospital(selectedHospital)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View Hospital
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
