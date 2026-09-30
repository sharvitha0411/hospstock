import React from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Bell,
  Cpu,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  Menu,
  Home
} from 'lucide-react';
import { District } from '../../types';

interface HeaderProps {
  districts: District[];
  selectedDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDateRange: string;
  onSelectDateRange: (range: string) => void;
  onToggleNotificationDrawer: () => void;
  criticalAlertCount: number;
  totalAlertCount: number;
  onSimulateClick: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  searchQuery,
  onSearchChange,
  selectedDateRange,
  onSelectDateRange,
  onToggleNotificationDrawer,
  criticalAlertCount,
  totalAlertCount,
  onSimulateClick,
  onRefreshData,
  isRefreshing = false,
  onToggleMobileMenu,
  onGoToLanding
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Side: Mobile toggle + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hospitals, medicines (e.g. Paracetamol, Insulin), batches..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5">
          {/* District selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedDistrictId}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Districts (10 Regions)</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.criticalShortages > 0 ? `⚠️ ${d.criticalShortages} at-risk` : 'Stable'})
                </option>
              ))}
            </select>
          </div>

          {/* Forecast date range selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedDateRange}
              onChange={(e) => onSelectDateRange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="7D">Next 7 Days (Tactical)</option>
              <option value="30D">Next 30 Days (Operational)</option>
              <option value="90D">Next 90 Days (Monsoon Surge)</option>
            </select>
          </div>

          {/* Quick Disruption Simulation Trigger */}
          <button
            onClick={onSimulateClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold hover:bg-cyan-100 transition-colors shadow-xs"
            title="Launch Digital Twin Disruption Simulation"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span className="hidden sm:inline">Simulate Disruption</span>
            <span className="sm:hidden">Sim</span>
          </button>

          {/* Portal Home Button */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all shadow-2xs"
              title="Return to MediChain AI Portal Home"
            >
              <Home className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Portal Home</span>
            </button>
          )}

          {/* Telemetry Refresh */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all disabled:opacity-50"
            title="Refresh real-time data feeds"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          {/* Real-time Alert Bell */}
          <button
            onClick={onToggleNotificationDrawer}
            className="relative p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="View alerts"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {criticalAlertCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white animate-pulse">
                {criticalAlertCount}
              </span>
            ) : totalAlertCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 px-1 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white">
                {totalAlertCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Micro-bar: Live status telemetry ticker */}
      <div className="px-6 py-1 bg-slate-900 text-slate-300 text-[11px] font-medium flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">System Status:</span>
          <span className="text-slate-300">22 Hospital Feeds Online</span>
          <span className="text-slate-600">•</span>
          <span className="text-teal-300">ML Forecast Engine (XGBoost) Running</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Last Telemetry Sync: 2m ago</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-rose-300 font-bold">⚠️ Critical Shortages: 4 facilities</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-300 font-bold">📦 Surplus Units Ready: 18,400</span>
        </div>
      </div>
    </header>
  );
};
