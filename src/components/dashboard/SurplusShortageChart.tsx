import React from 'react';
import {
  ArrowLeftRight,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface SurplusShortageChartProps {
  onNavigateToRedistribution: () => void;
}

export const SurplusShortageChart: React.FC<SurplusShortageChartProps> = ({
  onNavigateToRedistribution
}) => {
  const categories = [
    { name: 'Analgesics (Paracetamol)', shortage: 2400, surplus: 8900, criticalShortageCount: 3, unit: 'tabs' },
    { name: 'Rehydration Salts (ORS)', shortage: 3100, surplus: 6200, criticalShortageCount: 4, unit: 'sachets' },
    { name: 'Chronic / Insulin Regular', shortage: 450, surplus: 1400, criticalShortageCount: 2, unit: 'vials' },
    { name: 'IV Fluids (0.9% NaCl, RL)', shortage: 1900, surplus: 7800, criticalShortageCount: 3, unit: 'bottles' },
    { name: 'Broad-Spectrum Antibiotics', shortage: 820, surplus: 4300, criticalShortageCount: 2, unit: 'units' },
    { name: 'Emergency Resuscitation', shortage: 160, surplus: 950, criticalShortageCount: 1, unit: 'ampoules' },
  ];

  const maxVal = 10000;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Surplus vs Shortage Balance
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Inter-Facility Transfer Potential
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Regional comparison of accumulated reserves vs imminent hospital deficits
          </p>
        </div>

        <button
          onClick={onNavigateToRedistribution}
          className="px-2.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold hover:bg-teal-100 flex items-center gap-1 transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600" />
          Optimize Flow
        </button>
      </div>

      {/* Category Bars */}
      <div className="py-3 space-y-3.5">
        {categories.map((cat) => {
          const shortagePercent = Math.min(100, (cat.shortage / maxVal) * 100);
          const surplusPercent = Math.min(100, (cat.surplus / maxVal) * 100);

          return (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  {cat.criticalShortageCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  )}
                  {cat.name}
                </span>

                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-rose-600 font-bold">
                    Deficit: -{cat.shortage.toLocaleString()}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-teal-700 font-bold">
                    Surplus: +{cat.surplus.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Dual Progress Bar */}
              <div className="grid grid-cols-2 gap-1 h-3 rounded-full overflow-hidden bg-slate-100 p-0.5">
                {/* Shortage side (aligned right) */}
                <div className="flex justify-end bg-rose-50/50 rounded-l-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-l-full transition-all duration-500"
                    style={{ width: `${shortagePercent}%` }}
                    title={`Deficit: ${cat.shortage} ${cat.unit}`}
                  />
                </div>

                {/* Surplus side (aligned left) */}
                <div className="flex justify-start bg-teal-50/50 rounded-r-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-r-full transition-all duration-500"
                    style={{ width: `${surplusPercent}%` }}
                    title={`Surplus: ${cat.surplus} ${cat.unit}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Net regional inventory covers <strong>100%</strong> of projected 14-day shortages via intra-district transfer.
        </span>
        <button
          onClick={onNavigateToRedistribution}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
        >
          View Recommendations <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
