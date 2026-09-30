import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Alert, AlertSeverity, UserRole } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onNavigateToModule: (moduleKey: string) => void;
  currentUserRole?: UserRole;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onResolveAlert,
  onNavigateToModule,
  currentUserRole
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [roleScopeOnly, setRoleScopeOnly] = useState<boolean>(true);

  if (!isOpen) return null;

  // Role-specific alert filtering (Section 17)
  const isAlertRelevantToRole = (alert: Alert, role?: UserRole): boolean => {
    if (!role) return true;
    switch (role) {
      case 'DOCTOR':
        return alert.category === 'CRITICAL_STOCKOUT' || alert.title.toLowerCase().includes('insulin') || alert.title.toLowerCase().includes('clinical');
      case 'PHARMACIST':
        return alert.category === 'CRITICAL_STOCKOUT' || alert.category === 'NEAR_EXPIRY';
      case 'RECEPTIONIST':
        return alert.title.toLowerCase().includes('triage') || alert.title.toLowerCase().includes('patient') || alert.title.toLowerCase().includes('surge') || alert.category === 'DEMAND_SPIKE';
      case 'NURSE':
        return alert.category === 'CRITICAL_STOCKOUT' || alert.title.toLowerCase().includes('ward') || alert.title.toLowerCase().includes('urgent');
      case 'DISTRICT_ADMIN':
      case 'HOSPITAL_ADMIN':
        return true; // Sees district risks and operational alerts
      case 'SUPPLY_CHAIN_OFFICER':
      case 'DISTRIBUTOR':
        return alert.category === 'SUPPLY_DISRUPTION' || alert.category === 'REDISTRIBUTION_REQUIRED' || alert.title.toLowerCase().includes('transfer');
      case 'WAREHOUSE_MANAGER':
        return alert.category === 'NEAR_EXPIRY' || alert.category === 'SUPPLY_DISRUPTION' || alert.title.toLowerCase().includes('shipment');
      case 'ML_ANALYST':
        return alert.category === 'DEMAND_SPIKE' || alert.title.toLowerCase().includes('model') || alert.category === 'WEATHER_RISK';
      case 'SUPER_ADMIN':
        return true;
      case 'AUDITOR':
        return alert.severity === 'CRITICAL';
      default:
        return true;
    }
  };

  const roleFilteredAlerts = roleScopeOnly && currentUserRole
    ? alerts.filter((a) => isAlertRelevantToRole(a, currentUserRole))
    : alerts;

  const criticalCount = roleFilteredAlerts.filter((a) => a.severity === 'CRITICAL' && !a.resolved).length;
  const warningCount = roleFilteredAlerts.filter((a) => a.severity === 'WARNING' && !a.resolved).length;
  const infoCount = roleFilteredAlerts.filter((a) => a.severity === 'INFO' && !a.resolved).length;

  const filteredAlerts = roleFilteredAlerts.filter((a) => {
    if (activeFilter === 'ALL') return true;
    return a.severity === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">Real-Time Alert Center</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                {alerts.filter((a) => !a.resolved).length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Automated algorithmic threshold monitoring</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Metrics Row */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white border-b border-slate-100 text-center">
          <button
            onClick={() => setActiveFilter('CRITICAL')}
            className={`p-2 rounded-lg border transition-all text-left ${
              activeFilter === 'CRITICAL'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              Critical
            </div>
            <div className="text-lg font-black text-rose-900 mt-0.5">{criticalCount}</div>
          </button>

          <button
            onClick={() => setActiveFilter('WARNING')}
            className={`p-2 rounded-lg border transition-all text-left ${
              activeFilter === 'WARNING'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Warnings
            </div>
            <div className="text-lg font-black text-amber-900 mt-0.5">{warningCount}</div>
          </button>

          <button
            onClick={() => setActiveFilter('INFO')}
            className={`p-2 rounded-lg border transition-all text-left ${
              activeFilter === 'INFO'
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Info
            </div>
            <div className="text-lg font-black text-blue-900 mt-0.5">{infoCount}</div>
          </button>
        </div>

        {/* Filter Pill Header */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Filter className="w-3 h-3" />
            Showing:
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`font-bold ml-1 ${activeFilter === 'ALL' ? 'text-teal-700 underline' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({alerts.length})
            </button>
          </div>
          <span className="text-[11px] text-slate-400">Rule Engine v3.2 active</span>
        </div>

        {/* Alert Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-700">No active alerts</p>
              <p className="text-xs text-slate-400">All medical supply buffers conform to safety parameters.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const isWarn = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.resolved
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : isCrit
                      ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                      : isWarn
                      ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                      : 'bg-blue-50/50 border-blue-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-rose-600 text-white'
                            : isWarn
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {alert.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{alert.timestamp}</span>
                    </div>

                    {alert.resolved && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mt-2">{alert.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{alert.message}</p>

                  {alert.suggestedAction && (
                    <div className="mt-2.5 p-2 rounded-lg bg-white/80 border border-slate-200/80 text-[11px] text-slate-700">
                      <span className="font-bold text-teal-700">Action: </span>
                      {alert.suggestedAction}
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onClose();
                        if (alert.category === 'REDISTRIBUTION_REQUIRED') onNavigateToModule('redistribution');
                        else if (alert.category === 'SUPPLY_DISRUPTION' || alert.category === 'WEATHER_RISK') onNavigateToModule('digital-twin');
                        else onNavigateToModule('risk');
                      }}
                      className="text-[11px] font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 hover:underline"
                    >
                      Investigate <ArrowRight className="w-3 h-3" />
                    </button>

                    {!alert.resolved && (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              alerts.forEach((a) => onResolveAlert(a.id));
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
          >
            Acknowledge All
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToModule('alerts');
            }}
            className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-xs"
          >
            Open Alerts Board
          </button>
        </div>
      </div>
    </div>
  );
};
