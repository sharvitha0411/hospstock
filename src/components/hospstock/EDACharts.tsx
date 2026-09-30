import React, { useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Layers,
  Building2,
  Truck,
  Activity,
  Calendar
} from 'lucide-react';

interface EDAChartsProps {
  rows: Record<string, any>[];
  headers: string[];
}

export const EDACharts: React.FC<EDAChartsProps> = ({ rows, headers }) => {
  // Find relevant columns
  const dateCol = headers.find((h) => h.toLowerCase().includes('date')) || '';
  const demandCol = headers.find((h) => h.toLowerCase() === 'demand' || h.toLowerCase().includes('demand')) || '';
  const consumeCol = headers.find((h) => h.toLowerCase().includes('consum')) || demandCol;
  const stockCol = headers.find((h) => h.toLowerCase().includes('closing') || h.toLowerCase().includes('stock')) || '';
  const categoryCol = headers.find((h) => h.toLowerCase().includes('category')) || '';
  const deptCol = headers.find((h) => h.toLowerCase().includes('dept') || h.toLowerCase().includes('department')) || '';
  const medCol = headers.find((h) => h.toLowerCase().includes('medicine') || h.toLowerCase().includes('name')) || '';
  const supplierCol = headers.find((h) => h.toLowerCase().includes('supplier')) || '';

  // 1. Demand & Consumption Trend
  const trendData = useMemo(() => {
    if (!consumeCol) return [];
    // Sample 15 aggregated points chronologically
    const step = Math.max(1, Math.floor(rows.length / 14));
    const points: { label: string; value: number }[] = [];
    for (let i = 0; i < rows.length; i += step) {
      const r = rows[i];
      const val = Number(r[consumeCol] || r[demandCol] || 0);
      const label = dateCol ? String(r[dateCol]).slice(5, 10) : `P${points.length + 1}`;
      points.push({ label, value: Math.max(0, val) });
    }
    return points.slice(0, 14);
  }, [rows, consumeCol, demandCol, dateCol]);

  // 2. Category Breakdown
  const categoryData = useMemo(() => {
    if (!categoryCol) return [];
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const cat = String(r[categoryCol] || 'Other');
      const val = Number(r[consumeCol] || r[demandCol] || 1);
      counts[cat] = (counts[cat] || 0) + (isNaN(val) ? 1 : val);
    });
    return Object.entries(counts)
      .map(([name, total]) => ({ name, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [rows, categoryCol, consumeCol, demandCol]);

  // 3. Department-wise Consumption
  const departmentData = useMemo(() => {
    if (!deptCol) return [];
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const dept = String(r[deptCol] || 'General');
      const val = Number(r[consumeCol] || r[demandCol] || 1);
      counts[dept] = (counts[dept] || 0) + (isNaN(val) ? 1 : val);
    });
    return Object.entries(counts)
      .map(([name, total]) => ({ name, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [rows, deptCol, consumeCol, demandCol]);

  // 4. Top 10 Most Consumed Medicines
  const topMedicines = useMemo(() => {
    if (!medCol) return [];
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const med = String(r[medCol] || 'Unknown');
      const val = Number(r[consumeCol] || r[demandCol] || 1);
      counts[med] = (counts[med] || 0) + (isNaN(val) ? 1 : val);
    });
    return Object.entries(counts)
      .map(([name, total]) => ({ name, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [rows, medCol, consumeCol, demandCol]);

  // 5. Supplier Breakdown
  const supplierData = useMemo(() => {
    if (!supplierCol) return [];
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const supp = String(r[supplierCol] || 'Direct');
      const val = Number(r[stockCol] || 1);
      counts[supp] = (counts[supp] || 0) + (isNaN(val) ? 1 : val);
    });
    return Object.entries(counts)
      .map(([name, total]) => ({ name, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [rows, supplierCol, stockCol]);

  // Max for trend scaling
  const maxTrend = Math.max(...trendData.map((d) => d.value), 100);
  const maxMed = Math.max(...topMedicines.map((m) => m.total), 100);
  const maxDept = Math.max(...departmentData.map((d) => d.total), 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Exploratory Data Analysis (EDA)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical distribution and operational trends computed from the actual uploaded dataset ({rows.length.toLocaleString()} rows).
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
          Dynamic Visualizer
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CHART 1: Demand / Consumption Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Demand / Consumption Trend Over Time
            </span>
          </div>

          <div className="h-44 w-full flex items-end gap-1.5 pt-4 pb-2">
            {trendData.map((d, i) => {
              const heightPct = Math.max(10, Math.round((d.value / maxTrend) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-teal-500/80 hover:bg-teal-600 rounded-t transition-all cursor-pointer relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {d.value.toLocaleString()} units
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono truncate w-full text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex justify-between">
            <span>Peak: {maxTrend.toLocaleString()} units</span>
            <span>Chronological timeline</span>
          </div>
        </div>

        {/* CHART 2: Top Consumed Medicines */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-600" />
              Top Consumed Medicines
            </span>
          </div>

          <div className="space-y-2 py-2">
            {topMedicines.slice(0, 5).map((med, i) => {
              const widthPct = Math.max(8, Math.round((med.total / maxMed) * 100));
              return (
                <div key={i} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[180px]">{med.name}</span>
                    <span className="font-mono text-teal-700 font-extrabold">{med.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-600 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex justify-between">
            <span>Ranked by cumulative burn</span>
            <span>Top 5 shown</span>
          </div>
        </div>

        {/* CHART 3: Department-wise Consumption */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-600" />
              Department-Wise Consumption
            </span>
          </div>

          <div className="space-y-2 py-2">
            {departmentData.slice(0, 5).map((dept, i) => {
              const widthPct = Math.max(8, Math.round((dept.total / maxDept) * 100));
              return (
                <div key={i} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">{dept.name}</span>
                    <span className="font-mono text-purple-700 font-extrabold">{dept.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex justify-between">
            <span>Ward & clinic breakdown</span>
            <span>Volume share</span>
          </div>
        </div>

        {/* CHART 4: Category Distribution */}
        {categoryData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Demand by Therapeutic Category
              </span>
            </div>

            <div className="space-y-2 py-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50">
                  <span className="font-bold text-slate-700">{cat.name}</span>
                  <span className="font-mono font-bold text-indigo-700">{cat.total.toLocaleString()} units</span>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
              Categorical inventory grouping
            </div>
          </div>
        )}

        {/* CHART 5: Supplier Distribution */}
        {supplierData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between md:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Supplier Stock Contribution
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
              {supplierData.map((supp, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block truncate">{supp.name}</span>
                  <span className="text-sm font-black text-slate-900 block mt-1">{supp.total.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Allocated units</span>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
              Vendor procurement distribution
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
