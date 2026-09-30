import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Hourglass,
  ArrowLeftRight,
  TrendingDown,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  Download
} from 'lucide-react';
import { InventoryItem, MedicineBatch, RiskLevel } from '../../types';
import { INVENTORY_ITEMS, MEDICINE_BATCHES, HOSPITALS, DISTRICTS } from '../../data/mockData';
import { computeStockRisks, getNearExpiryBatches } from '../../services/riskEngine';

interface RiskDashboardProps {
  onNavigateToRedistribution: () => void;
  onSelectHospitalDetail?: (hospitalId: string) => void;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({
  onNavigateToRedistribution,
  onSelectHospitalDetail
}) => {
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'SURPLUS'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expirySortKey, setExpirySortKey] = useState<'days' | 'waste' | 'quantity'>('days');

  const stockRisks = computeStockRisks(INVENTORY_ITEMS);
  const nearExpiryBatches = getNearExpiryBatches(MEDICINE_BATCHES);

  // Filter stock risks
  const filteredStock = stockRisks.filter((item) => {
    if (riskFilter === 'CRITICAL' && item.stockStatus !== 'CRITICAL' && item.stockStatus !== 'STOCK_OUT_TODAY') return false;
    if (riskFilter === 'WARNING' && item.stockStatus !== 'WARNING') return false;
    if (riskFilter === 'SURPLUS' && item.stockStatus !== 'SURPLUS') return false;
    if (selectedDistrict !== 'ALL' && item.districtId !== selectedDistrict) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.medicineName.toLowerCase().includes(q) || item.hospitalName.toLowerCase().includes(q);
    }
    return true;
  });

  // Sort near expiry batches
  const sortedBatches = [...nearExpiryBatches].sort((a, b) => {
    if (expirySortKey === 'days') return a.daysRemaining - b.daysRemaining;
    if (expirySortKey === 'waste') return b.estimatedWasteValue - a.estimatedWasteValue;
    return b.quantity - a.quantity;
  });

  const totalWasteAtRisk = nearExpiryBatches.reduce((acc, b) => acc + b.estimatedWasteValue, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Stock-out & Expiry Risk Intelligence
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              Module 3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic runway calculations powered by predictive daily consumption rates rather than static averages.
          </p>
        </div>

        {/* Global Action CTA */}
        <button
          onClick={onNavigateToRedistribution}
          className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Launch Smart Redistribution
        </button>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-rose-200 shadow-2xs border-l-4 border-l-rose-500">
          <span className="text-xs font-bold text-slate-500 block">Critical Stock-out Hazard</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">
              {stockRisks.filter((s) => s.stockStatus === 'CRITICAL' || s.stockStatus === 'STOCK_OUT_TODAY').length}
            </span>
            <span className="text-xs text-slate-500">medicines runway &lt; 3.0 days</span>
          </div>
          <p className="text-[11px] text-rose-700 mt-2 font-medium">
            Immediate intervention required to prevent clinical service stoppage.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-slate-500 block">Warning Threshold</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">
              {stockRisks.filter((s) => s.stockStatus === 'WARNING').length}
            </span>
            <span className="text-xs text-slate-500">medicines runway 3.0 - 7.0 days</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-2 font-medium">
            Pre-emptive redistribution recommended to replenish local reserve.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-2xs border-l-4 border-l-indigo-500">
          <span className="text-xs font-bold text-slate-500 block">Near-Expiry Financial Exposure</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700">
              ₹{totalWasteAtRisk.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">across {nearExpiryBatches.length} batches</span>
          </div>
          <p className="text-[11px] text-indigo-700 mt-2 font-medium">
            Deploy FIFO or transfer to high-volume tertiary hospitals before expiry.
          </p>
        </div>
      </div>

      {/* Main Stock-out Runway Countdown Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        {/* Filters Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Medicine Stock-Out Countdown & Runway Table
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Days Runway = Available Physical Stock / Predicted Daily Consumption Rate
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter drug or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="ALL">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Risk Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold text-slate-600">
              <button
                onClick={() => setRiskFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  riskFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRiskFilter('CRITICAL')}
                className={`px-2.5 py-1 rounded-md transition-all text-rose-600 ${
                  riskFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-2xs' : 'hover:text-rose-700'
                }`}
              >
                Critical (&lt;3d)
              </button>
              <button
                onClick={() => setRiskFilter('WARNING')}
                className={`px-2.5 py-1 rounded-md transition-all text-amber-600 ${
                  riskFilter === 'WARNING' ? 'bg-amber-500 text-white shadow-2xs' : 'hover:text-amber-700'
                }`}
              >
                Warning (3-7d)
              </button>
              <button
                onClick={() => setRiskFilter('SURPLUS')}
                className={`px-2.5 py-1 rounded-md transition-all text-teal-700 ${
                  riskFilter === 'SURPLUS' ? 'bg-teal-600 text-white shadow-2xs' : 'hover:text-teal-900'
                }`}
              >
                Surplus
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Medicine Formulary</th>
                <th className="py-2.5 px-3">Healthcare Facility</th>
                <th className="py-2.5 px-3 text-right">Current Stock</th>
                <th className="py-2.5 px-3 text-right">Historical Daily</th>
                <th className="py-2.5 px-3 text-right">AI Predicted Daily</th>
                <th className="py-2.5 px-3">Days Runway Countdown</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStock.map((item) => {
                const isToday = item.stockStatus === 'STOCK_OUT_TODAY';
                const isCrit = item.stockStatus === 'CRITICAL';
                const isWarn = item.stockStatus === 'WARNING';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isToday ? 'bg-rose-50/50' : isCrit ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.medicineName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.category}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div
                        onClick={() => onSelectHospitalDetail?.(item.hospitalId)}
                        className="text-slate-700 font-semibold cursor-pointer hover:text-teal-600 hover:underline"
                      >
                        {item.hospitalName}
                      </div>
                      <div className="text-[10px] text-slate-400">Updated {item.lastUpdated}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {item.currentStock.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {item.dailyAvgConsumption}/day
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-indigo-700">
                      {item.predictedDailyConsumption}/day
                    </td>

                    {/* Visual Countdown Column */}
                    <td className="py-3 px-3 min-w-[170px]">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span
                          className={
                            isToday
                              ? 'text-rose-600 animate-pulse'
                              : isCrit
                              ? 'text-rose-600'
                              : isWarn
                              ? 'text-amber-600'
                              : 'text-teal-700'
                          }
                        >
                          {item.urgencyLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.daysUntilStockout}d
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.progressBarColor}`}
                          style={{
                            width: `${Math.min(100, Math.max(5, (item.daysUntilStockout / 14) * 100))}%`
                          }}
                        />
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isToday
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isCrit
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : item.stockStatus === 'SURPLUS'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.stockStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {(isCrit || isToday) && (
                        <button
                          onClick={onNavigateToRedistribution}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
                        >
                          Redistribute
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Near Expiry Medicines Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Near-Expiry Batch Detection & Waste Mitigation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies batches approaching 30-45 day expiry to prioritize FIFO dispensing or inter-hospital transfer
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort By:</span>
            <select
              value={expirySortKey}
              onChange={(e) => setExpirySortKey(e.target.value as any)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="days">Days Remaining (Ascending)</option>
              <option value="waste">Estimated Waste Value (Descending)</option>
              <option value="quantity">Physical Quantity (Descending)</option>
            </select>
          </div>
        </div>

        {/* Near Expiry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Batch Number</th>
                <th className="py-2.5 px-3">Medicine</th>
                <th className="py-2.5 px-3">Holding Hospital</th>
                <th className="py-2.5 px-3 text-right">Physical Quantity</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3 text-right">Days Remaining</th>
                <th className="py-2.5 px-3 text-right">Estimated Waste Exposure</th>
                <th className="py-2.5 px-3 text-right">Mitigation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                    {batch.batchNumber}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{batch.medicineName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{batch.hospitalName}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                    {batch.quantity.toLocaleString()} units
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{batch.expiryDate}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    <span
                      className={
                        batch.daysRemaining <= 20
                          ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded'
                          : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'
                      }
                    >
                      {batch.daysRemaining} days left
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{batch.estimatedWasteValue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={onNavigateToRedistribution}
                      className="text-xs font-bold text-teal-600 hover:text-teal-800 hover:underline"
                    >
                      Fast-Track Transfer →
                    </button>
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
