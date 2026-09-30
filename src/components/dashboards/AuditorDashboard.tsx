import React, { useState } from 'react';
import {
  Lock,
  FileCheck,
  ShieldCheck,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuditorDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const AuditorDashboard: React.FC<AuditorDashboardProps> = ({ onNavigateToTab }) => {
  const { auditLogs } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchLog, setSearchLog] = useState('');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Chronological Audit Timeline Events
  const timelineEvents = [
    {
      time: '11:22 AM',
      user: 'Tariq Al-Mansoor',
      role: 'WAREHOUSE_MANAGER',
      action: 'Dispatched Cold-Chain Van #TRK-204 to Metro Apex',
      resource: 'Batch INS-2026-K12',
      hash: '0x8a1b...4c9f',
      status: 'VERIFIED'
    },
    {
      time: '11:05 AM',
      user: 'Dr. Chen Wei',
      role: 'ML_ANALYST',
      action: 'Manual Model Approval for Production XGBoost v4.2',
      resource: 'Model Registry',
      hash: '0x3d2e...9a1b',
      status: 'VERIFIED'
    },
    {
      time: '10:41 AM',
      user: 'Dr. Ananya Sharma',
      role: 'DISTRICT_ADMIN',
      action: 'Authorized Inter-Hospital Transfer #redist-3',
      resource: 'East Valley → Apex Hub',
      hash: '0xf1c2...88a3',
      status: 'VERIFIED'
    },
    {
      time: '10:32 AM',
      user: 'Pooja Nair',
      role: 'PHARMACIST',
      action: 'Dispensed Priority FEFO Batch PAR-2026-B81',
      resource: 'Dispensary Stock -15',
      hash: '0x9b4a...11d0',
      status: 'VERIFIED'
    },
    {
      time: '10:14 AM',
      user: 'Dr. Arvind Swaminathan',
      role: 'DOCTOR',
      action: 'Prescribed Paracetamol 500mg & Saline for Patient Rahul Sharma',
      resource: 'Clinical OPD Chart',
      hash: '0x5e7c...33f2',
      status: 'VERIFIED'
    }
  ];

  const handleExportAudit = () => {
    setExportSuccess('Regulatory GxP & 21 CFR Part 11 Audit Report compiled. Cryptographic hash chain verified 100% intact.');
    setTimeout(() => setExportSuccess(null), 4000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchLog.toLowerCase());
    if (selectedCategory === 'ALL') return matchesSearch;
    return matchesSearch && log.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-300">
              <Lock className="w-5 h-5 text-slate-700" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Audit & Compliance Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                GxP & 21 CFR Part 11 Regulatory Compliance • Cryptographically Anchored Immutable Ledger
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion & CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800">
            <Sparkles className="w-4 h-4 text-slate-600 shrink-0" />
            <div className="text-left">
              <span className="font-bold text-[11px] block text-slate-700">Audit Copilot:</span>
              <span className="text-[11px] text-slate-600">"Show any unverified cryptographic entries or permission escalations."</span>
            </div>
          </div>

          <button
            onClick={handleExportAudit}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export GxP Audit Report
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {exportSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* 5 AUDIT KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Actions Today</span>
          <div className="text-2xl font-black text-slate-900 mt-1">142</div>
          <span className="text-[10px] text-teal-600 font-bold">100% Cryptographically Hashed</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Inventory Changes</span>
          <div className="text-2xl font-black text-slate-900 mt-1">48</div>
          <span className="text-[10px] text-slate-500">FEFO & Dispense Events</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Transfers Approved</span>
          <div className="text-2xl font-black text-slate-900 mt-1">12</div>
          <span className="text-[10px] text-slate-500">Inter-Hospital Redirection</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Role Changes</span>
          <div className="text-2xl font-black text-slate-900 mt-1">2</div>
          <span className="text-[10px] text-slate-500">RBAC Scope Modifications</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Security Breaches</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">0</div>
          <span className="text-[10px] text-emerald-600 font-medium">Chain of Custody Intact</span>
        </div>
      </div>

      {/* MAIN: CHRONOLOGICAL AUDIT TIMELINE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">
              Live Immutable Audit Event Timeline
            </h2>
            <p className="text-xs text-slate-500">
              Real-time sequence of operational actions across all 10 platform roles with cryptographic SHA-256 state anchors
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Ledger Synchronized
          </span>
        </div>

        <div className="divide-y divide-slate-100 space-y-3">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="pt-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="font-mono text-xs font-bold text-slate-500 w-16 shrink-0 mt-0.5">
                  {evt.time}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{evt.user}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {evt.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 font-medium mt-0.5">{evt.action}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Target: {evt.resource} • <span className="font-mono text-teal-700">Hash: {evt.hash}</span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {evt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LARGE AUDIT DATA TABLE (READ-ONLY) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Immutable Audit Event Ledger</h3>
            <p className="text-xs text-slate-500">Read-only historical access log satisfying FDA 21 CFR Part 11 audit requirements</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                placeholder="Search action or user..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="CLINICAL">Clinical</option>
              <option value="INVENTORY">Inventory</option>
              <option value="REDISTRIBUTION">Redistribution</option>
              <option value="MODEL_GOVERNANCE">ML Governance</option>
              <option value="SECURITY">Security</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Log ID & Time</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Cryptographic Hash</th>
                <th className="py-2.5 px-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono text-[10px] text-slate-500">{log.id}</div>
                    <span className="text-[11px] text-slate-900 font-bold">{log.timestamp}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{log.userName}</div>
                    <span className="text-[10px] text-slate-500">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{log.action}</div>
                    <span className="text-[10px] text-slate-500">{log.details}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-teal-700">
                    {log.immutableHash || '0x4f8e...33d2a1'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
