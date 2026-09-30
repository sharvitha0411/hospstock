import React, { useState } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Bed,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter
} from 'lucide-react';
import { Hospital, District } from '../../types';
import { HOSPITALS, DISTRICTS } from '../../data/mockData';

interface HospitalsListProps {
  onSelectHospital: (hospital: Hospital) => void;
}

export const HospitalsList: React.FC<HospitalsListProps> = ({ onSelectHospital }) => {
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = HOSPITALS.filter((h) => {
    if (districtFilter !== 'ALL' && h.districtId !== districtFilter) return false;
    if (riskFilter !== 'ALL' && h.riskLevel !== riskFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.name.toLowerCase().includes(q) || h.districtName.toLowerCase().includes(q) || h.code.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Healthcare Facilities Registry & Telemetry
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              22 Monitored Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Directory of tertiary care hospitals, district centers, and primary health clinics connected to the MedResilience telemetry network.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* District Dropdown */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
          >
            <option value="ALL">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Risk Level */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="MEDIUM">Medium Warning</option>
            <option value="LOW">Low / Stable</option>
          </select>
        </div>
      </div>

      {/* Grid of Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((hospital) => {
          const isCrit = hospital.riskLevel === 'CRITICAL';
          const isWarn = hospital.riskLevel === 'MEDIUM';

          return (
            <div
              key={hospital.id}
              onClick={() => onSelectHospital(hospital)}
              className={`p-5 bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                isCrit
                  ? 'border-rose-200 shadow-2xs hover:border-rose-300'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isCrit
                        ? 'bg-rose-600 text-white'
                        : isWarn
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {hospital.riskLevel} Risk • {hospital.riskScore}/100
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-2 leading-snug">
                    {hospital.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {hospital.districtName}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {hospital.code}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-center font-mono">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[9px] block font-sans">Beds</span>
                  <span className="font-bold text-slate-800">{hospital.beds}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[9px] block font-sans">Deficits</span>
                  <span className="font-bold text-rose-600">{hospital.criticalMedicinesCount}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[9px] block font-sans">Surplus</span>
                  <span className="font-bold text-teal-700">{hospital.surplusMedicinesCount}</span>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                  {hospital.contactPerson}
                </span>
                <span className="text-teal-600 font-bold flex items-center gap-1 hover:underline">
                  <Eye className="w-3 h-3" />
                  View Details
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
