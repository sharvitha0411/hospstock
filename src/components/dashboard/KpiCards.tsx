import React from 'react';
import {
  Building2,
  Pill,
  AlertOctagon,
  Hourglass,
  Clock,
  ShieldAlert,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface KpiCardsProps {
  totalHospitals: number;
  totalMedicines: number;
  criticalRisksCount: number;
  predictedStockoutsCount: number;
  nearExpiryCount: number;
  activeDisruptionsCount: number;
  onCardClick?: (metricKey: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalHospitals,
  totalMedicines,
  criticalRisksCount,
  predictedStockoutsCount,
  nearExpiryCount,
  activeDisruptionsCount,
  onCardClick
}) => {
  const cards = [
    {
      key: 'hospitals',
      label: 'Total Hospitals Monitored',
      value: totalHospitals,
      subtitle: 'Across 10 health districts',
      trend: '+2 onboarded',
      isUp: true,
      trendGood: true,
      icon: Building2,
      accentColor: 'border-l-blue-500',
      badgeBg: 'bg-blue-50 text-blue-700'
    },
    {
      key: 'medicines',
      label: 'Medicines Monitored',
      value: totalMedicines,
      subtitle: 'WHO Essential Formulary',
      trend: '100% telemetry synced',
      isUp: true,
      trendGood: true,
      icon: Pill,
      accentColor: 'border-l-teal-500',
      badgeBg: 'bg-teal-50 text-teal-700'
    },
    {
      key: 'criticalRisks',
      label: 'Critical Stock Risks',
      value: criticalRisksCount,
      subtitle: 'Runway < 3.0 days',
      trend: '↑ 12% from last week',
      isUp: true,
      trendGood: false,
      icon: AlertOctagon,
      accentColor: 'border-l-rose-500',
      badgeBg: 'bg-rose-50 text-rose-700'
    },
    {
      key: 'stockouts',
      label: 'Predicted Stock-outs',
      value: predictedStockoutsCount,
      subtitle: 'Critical hazard < 48 hours',
      trend: '4 urgent transfers needed',
      isUp: true,
      trendGood: false,
      icon: Hourglass,
      accentColor: 'border-l-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700'
    },
    {
      key: 'nearExpiry',
      label: 'Near-Expiry Batches',
      value: nearExpiryCount,
      subtitle: 'Expiring in < 45 days',
      trend: '₹106,270 waste at risk',
      isUp: false,
      trendGood: true,
      icon: Clock,
      accentColor: 'border-l-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700'
    },
    {
      key: 'disruptions',
      label: 'Active Disruptions',
      value: activeDisruptionsCount,
      subtitle: 'Weather & road alerts',
      trend: 'Delta Corridor restricted',
      isUp: true,
      trendGood: false,
      icon: ShieldAlert,
      accentColor: 'border-l-red-600',
      badgeBg: 'bg-rose-50 text-rose-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            onClick={() => onCardClick?.(card.key)}
            className={`p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer border-l-4 ${card.accentColor} group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 line-clamp-1">{card.label}</span>
              <div className={`p-1.5 rounded-lg ${card.badgeBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors">
                {card.value}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {card.trendGood ? (
                  <TrendingDown className="w-3 h-3 text-emerald-600" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-rose-600" />
                )}
                <span className={card.trendGood ? 'text-emerald-700' : 'text-rose-700'}>
                  {card.trend}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium truncate">{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
