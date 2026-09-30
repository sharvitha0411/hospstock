import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  AlertTriangle,
  ArrowLeftRight,
  TrendingUp,
  Cpu,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HOSPITALS, DISTRICTS } from '../../data/mockData';
import { DistrictRiskMap } from '../dashboard/DistrictRiskMap';

interface DistrictOfficerDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
  onSelectHospitalDetail?: (hospitalId: string) => void;
}

export const DistrictOfficerDashboard: React.FC<DistrictOfficerDashboardProps> = ({
  onNavigateToTab,
  onSelectHospitalDetail
}) => {
  const {
    currentUser,
    selectedDistrictId,
    setSelectedDistrictId,
    alerts
  } = useApp();

  const [directiveSuccess, setDirectiveSuccess] = useState<string | null>(null);

  // Facility Risk Matrix data
  const facilityRisks = [
    {
      id: 'hosp-1',
      name: 'Metro Apex Multi-Specialty Hospital',
      type: 'Tertiary Care Hub',
      stockRisk: 'HIGH',
      stockRiskDesc: 'Insulin (1.8d cover)',
      demandSurge: '+34.2%',
      expiryRisk: 'LOW',
      supplierRisk: 'MEDIUM',
      overallScore: 84,
      status: 'CRITICAL_ATTENTION'
    },
    {
      id: 'hosp-2',
      name: 'East Valley Regional Hospital',
      type: 'Sub-District Hospital',
      stockRisk: 'LOW',
      stockRiskDesc: 'Surplus available',
      demandSurge: '+4.1%',
      expiryRisk: 'MEDIUM',
      supplierRisk: 'LOW',
      overallScore: 28,
      status: 'STABLE_SURPLUS'
    },
    {
      id: 'hosp-3',
      name: 'North Hill Community Health Center',
      type: 'Primary Health Center',
      stockRisk: 'CRITICAL',
      stockRiskDesc: 'ORS & Amoxicillin shortage',
      demandSurge: '+28.0%',
      expiryRisk: 'LOW',
      supplierRisk: 'HIGH',
      overallScore: 92,
      status: 'IMMEDIATE_ACTION'
    },
    {
      id: 'hosp-4',
      name: 'St. Jude District Hospital',
      type: 'District Hospital',
      stockRisk: 'MEDIUM',
      stockRiskDesc: 'Normal buffer',
      demandSurge: '+8.5%',
      expiryRisk: 'LOW',
      supplierRisk: 'LOW',
      overallScore: 42,
      status: 'MONITORING'
    }
  ];

  const handleAuthorizeDirective = (summary: string) => {
    setDirectiveSuccess(`District Emergency Directive executed: "${summary}". Fleet dispatch authorized.`);
    setTimeout(() => setDirectiveSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                District Health Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Metro Central District Directorate • Regional Health System Resilience & Multi-Facility Allocation
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion & CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-blue-50/80 border border-blue-200 px-3 py-2 rounded-xl text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-left">
              <span className="font-bold text-[11px] block text-blue-800">Command AI Copilot:</span>
              <span className="text-[11px] text-blue-700">"Which facilities require intervention today?"</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab?.('district-redistribution')}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Review 4 Recommended Transfers
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {directiveSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{directiveSuccess}</span>
        </div>
      )}

      {/* 6 TOP COMMAND KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Facilities Monitored</span>
          <div className="text-2xl font-black text-slate-900 mt-1">22</div>
          <span className="text-[10px] text-slate-400">12 Hospitals • 10 PHCs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Critical Facilities</span>
          <div className="text-2xl font-black text-rose-700 mt-1">3</div>
          <span className="text-[10px] text-rose-600 font-bold">North Hill, Apex, PHC-102</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Stock-Out Risks</span>
          <div className="text-2xl font-black text-amber-700 mt-1">5</div>
          <span className="text-[10px] text-amber-600 font-medium">Predicted &lt; 48 hours</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Expiry Risk</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹4.2L</div>
          <span className="text-[10px] text-slate-500">6 Batches &lt; 30 Days</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">Active Transfers</span>
          <div className="text-2xl font-black text-teal-700 mt-1">4</div>
          <span className="text-[10px] text-teal-600 font-bold">Refrigerated Fleets In-Transit</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Disruptions</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">2</div>
          <span className="text-[10px] text-indigo-600">Flash Flood & Route 7</span>
        </div>
      </div>

      {/* MAIN LARGE DISTRICT MAP */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Regional Health Network & Geospatial Intelligence
            </h2>
            <p className="text-xs text-slate-500">Interactive hospital nodes, supply depots, refrigerated transit routes, and risk clusters</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Metro Central District</span>
        </div>

        <div className="p-2 sm:p-4">
          <DistrictRiskMap
            hospitals={HOSPITALS}
            districts={DISTRICTS}
            onSelectHospital={(h) => onSelectHospitalDetail?.(h.id)}
            selectedDistrictId={selectedDistrictId}
          />
        </div>
      </div>

      {/* TWO COLUMN SECTION:
          LEFT: FACILITY RISK MATRIX (Span 8)
          RIGHT: AI PRIORITIES (Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FACILITY RISK MATRIX */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Facility Health Risk Matrix</h3>
              <p className="text-xs text-slate-500">Composite vulnerability index aggregated across all district facilities</p>
            </div>
            <span className="text-xs font-bold text-slate-400">Live Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Facility Name</th>
                  <th className="py-2.5 px-3">Stock Risk</th>
                  <th className="py-2.5 px-3">Surge</th>
                  <th className="py-2.5 px-3">Expiry</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Overall</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilityRisks.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{fac.name}</div>
                      <span className="text-[10px] text-slate-400">{fac.type}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded font-bold text-[10px] border ${
                          fac.stockRisk === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : fac.stockRisk === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {fac.stockRisk}
                      </span>
                      <div className="text-[9px] text-slate-500 mt-0.5">{fac.stockRiskDesc}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{fac.demandSurge}</td>
                    <td className="py-3 px-3 text-slate-600">{fac.expiryRisk}</td>
                    <td className="py-3 px-3 text-slate-600">{fac.supplierRisk}</td>
                    <td className="py-3 px-3">
                      <div className="font-black text-slate-900">{fac.overallScore}/100</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectHospitalDetail?.(fac.id)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-teal-700 text-white font-bold text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: AI PRIORITIES */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Command AI Priorities
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              3 Directives
            </span>
          </div>

          <div className="space-y-3 mt-3 flex-1">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                1. PHC-102 Imminent Stock-Out
              </div>
              <p className="text-[11px] text-rose-800 mt-1">
                PHC-102 (North Valley) projected to exhaust Amoxicillin within 48h due to pediatric surge.
              </p>
              <button
                onClick={() => handleAuthorizeDirective('Dispatch 500 Amoxicillin units to PHC-102 from Central Depot')}
                className="mt-2 w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
              >
                Authorize Emergency Dispatch
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                2. Highway 45 Route Disruption
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                3 facilities affected by flash flood on Highway 45. AI routing suggests Corridor B bypass (+18 mins).
              </p>
              <button
                onClick={() => handleAuthorizeDirective('Enforce Corridor B dynamic reroute on all district carriers')}
                className="mt-2 w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
              >
                Apply Corridor B Reroute
              </button>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                3. Surplus Redistribution Match
              </div>
              <p className="text-[11px] text-teal-800 mt-1">
                East Valley Regional has 6,200 surplus Insulin units. Matches Metro Apex deficit with zero wastage.
              </p>
              <button
                onClick={() => handleAuthorizeDirective('Execute inter-hospital transfer East Valley -> Metro Apex')}
                className="mt-2 w-full py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px]"
              >
                Approve Inter-Hospital Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: DISTRICT RESILIENCE SCORE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              District Health Resilience Index
            </h3>
            <p className="text-xs text-slate-500">Multi-factor composite scoring of regional healthcare shock absorptive capacity</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-bold block">Current Resilience</span>
              <span className="text-2xl font-black text-slate-900">78 / 100</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-right">
              <span className="text-[11px] text-teal-600 font-bold block">Projected Post-Recovery</span>
              <span className="text-2xl font-black text-teal-700">91 / 100</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
          <div style={{ width: '78%' }} className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full transition-all" />
        </div>

        {/* Breakdown factors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">Stock Buffer</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">72%</span>
            <span className="text-[10px] text-slate-500">45-day regional safety buffer</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">Cold-Chain Reliability</span>
            <span className="text-lg font-black text-emerald-700 mt-0.5 block">94%</span>
            <span className="text-[10px] text-slate-500">0 sensor excursions this week</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">Route Redundancy</span>
            <span className="text-lg font-black text-amber-700 mt-0.5 block">68%</span>
            <span className="text-[10px] text-slate-500">Alternate corridors mapped</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">Inter-Hospital Sharing</span>
            <span className="text-lg font-black text-teal-700 mt-0.5 block">85%</span>
            <span className="text-[10px] text-slate-500">Automated surplus balancing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
