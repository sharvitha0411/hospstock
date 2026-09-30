import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  Filter,
  Check,
  Search,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Alert, AlertCategory, AlertSeverity } from '../../types';
import { ALERTS } from '../../data/mockData';

interface AlertsCenterProps {
  onNavigateToModule: (moduleKey: string) => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({ onNavigateToModule }) => {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AlertCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRuleEngine, setShowRuleEngine] = useState(false);

  // Configurable Rule Engine State
  const [criticalDaysThreshold, setCriticalDaysThreshold] = useState<number>(3);
  const [warningDaysThreshold, setWarningDaysThreshold] = useState<number>(7);
  const [expiryDaysThreshold, setExpiryDaysThreshold] = useState<number>(30);
  const [demandSpikeThreshold, setDemandSpikeThreshold] = useState<number>(20);

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const handleAssign = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, assignedTo: 'Chief Supply Officer' } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
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
              Incident Response & Real-Time Alerts Center
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              Module 6
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous threshold detection triggering clinical escalation, supplier failover, and district notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRuleEngine(!showRuleEngine)}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            {showRuleEngine ? 'Hide Rule Configurator' : 'Configure Rule Engine'}
          </button>
        </div>
      </div>

      {/* Configurable Rule Engine Drawer / Box */}
      {showRuleEngine && (
        <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-md animate-in fade-in space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Configurable Algorithmic Rule Engine
              </h3>
              <p className="text-xs text-slate-500">
                Adjust sensitivity parameters governing automatic threshold escalation
              </p>
            </div>
            <button
              onClick={() => {
                setCriticalDaysThreshold(3);
                setWarningDaysThreshold(7);
                setExpiryDaysThreshold(30);
                setDemandSpikeThreshold(20);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold mb-1">
                <span>Critical Stock-Out:</span>
                <span className="text-rose-600 font-mono">&lt; {criticalDaysThreshold} Days</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={criticalDaysThreshold}
                onChange={(e) => setCriticalDaysThreshold(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">IF days &lt; {criticalDaysThreshold} THEN CRITICAL</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold mb-1">
                <span>Warning Stock-Out:</span>
                <span className="text-amber-600 font-mono">&lt; {warningDaysThreshold} Days</span>
              </div>
              <input
                type="range"
                min={4}
                max={14}
                value={warningDaysThreshold}
                onChange={(e) => setWarningDaysThreshold(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">IF days &lt; {warningDaysThreshold} THEN WARNING</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold mb-1">
                <span>Near-Expiry Window:</span>
                <span className="text-indigo-600 font-mono">&lt; {expiryDaysThreshold} Days</span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                step={5}
                value={expiryDaysThreshold}
                onChange={(e) => setExpiryDaysThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">IF expiry &lt; {expiryDaysThreshold}d THEN EXPIRY WARNING</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold mb-1">
                <span>Demand Surge Trigger:</span>
                <span className="text-teal-600 font-mono">&gt; +{demandSpikeThreshold}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={demandSpikeThreshold}
                onChange={(e) => setDemandSpikeThreshold(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">IF demand surge &gt; {demandSpikeThreshold}% THEN DEMAND SPIKE</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Severity Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold text-slate-600">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-3 py-1 rounded-md transition-all ${
                severityFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              className={`px-3 py-1 rounded-md transition-all text-rose-600 ${
                severityFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-2xs' : 'hover:text-rose-700'
              }`}
            >
              Critical ({alerts.filter((a) => a.severity === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setSeverityFilter('WARNING')}
              className={`px-3 py-1 rounded-md transition-all text-amber-600 ${
                severityFilter === 'WARNING' ? 'bg-amber-500 text-white shadow-2xs' : 'hover:text-amber-700'
              }`}
            >
              Warnings ({alerts.filter((a) => a.severity === 'WARNING').length})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
          >
            <option value="ALL">All Categories</option>
            <option value="CRITICAL_STOCKOUT">Critical Stock-out</option>
            <option value="NEAR_EXPIRY">Near Expiry</option>
            <option value="SUPPLY_DISRUPTION">Supply Disruption</option>
            <option value="DEMAND_SPIKE">Demand Spike</option>
            <option value="WEATHER_RISK">Weather Risk</option>
            <option value="REDISTRIBUTION_REQUIRED">Redistribution Required</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident title or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'CRITICAL';
          const isWarn = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.resolved
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : isCrit
                  ? 'bg-rose-50/70 border-rose-200 shadow-2xs'
                  : isWarn
                  ? 'bg-amber-50/70 border-amber-200 shadow-2xs'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      isCrit
                        ? 'bg-rose-600 text-white'
                        : isWarn
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {alert.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{alert.timestamp}</span>
                  {alert.hospitalName && (
                    <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      {alert.hospitalName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {alert.assignedTo ? (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-teal-600" />
                      Assigned: {alert.assignedTo}
                    </span>
                  ) : null}

                  {alert.resolved && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mt-2">{alert.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>

              {alert.suggestedAction && (
                <div className="mt-2.5 p-2 rounded-lg bg-white/90 border border-slate-200 text-xs">
                  <strong className="text-teal-700">Prescribed Intervention: </strong>
                  <span className="text-slate-700">{alert.suggestedAction}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (alert.category === 'REDISTRIBUTION_REQUIRED') onNavigateToModule('redistribution');
                    else if (alert.category === 'SUPPLY_DISRUPTION' || alert.category === 'WEATHER_RISK') onNavigateToModule('digital-twin');
                    else onNavigateToModule('risk');
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 hover:underline"
                >
                  Direct Intervention Action <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {!alert.assignedTo && !alert.resolved && (
                    <button
                      onClick={() => handleAssign(alert.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Assign Task
                    </button>
                  )}

                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1 text-xs font-bold rounded bg-teal-600 hover:bg-teal-700 text-white shadow-2xs"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
