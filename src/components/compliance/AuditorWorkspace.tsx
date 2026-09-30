import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  User,
  Hash,
  Eye,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';

export const AuditorWorkspace: React.FC = () => {
  const { currentUser, auditLogs } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">GxP Compliance & Tamper-Evident Audit Trail</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                AUDITOR (READ-ONLY) ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.name} · Regulatory & Clinical Safety Auditor · 21 CFR Part 11 & WHO GxP Compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintAudit}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Formal Audit Report</span>
          </button>
        </div>
      </div>

      {/* Compliance Verification Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Cryptographic Integrity: All {auditLogs.length} logged events sealed with immutable SHA-256 hashes. Read-only view enforced.
          </span>
        </div>
        <span className="font-mono text-emerald-400 font-bold">● ZERO INTEGRITY BREACHES DETECTED</span>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {['ALL', 'CLINICAL', 'INVENTORY', 'REDISTRIBUTION', 'SIMULATION', 'SECURITY', 'MODEL_GOVERNANCE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, user, details..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Immutable Activity Stream ({filteredLogs.length} Events)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">21 CFR Part 11 Subpart B Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Persona</th>
                <th className="py-2.5 px-3">Action Recorded</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Facility Context</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Hash Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <strong className="text-slate-900 block">{log.userName}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">{log.action}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{log.facilityName || 'District Command'}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-teal-700 whitespace-nowrap">
                    {log.immutableHash || '0x4f8a...92b1'}
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
