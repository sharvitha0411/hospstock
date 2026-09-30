import React from 'react';
import {
  Database,
  TrendingUp,
  AlertTriangle,
  ArrowLeftRight,
  Cpu,
  Bell,
  FileText,
  Building2,
  Truck,
  Sparkles,
  ChevronRight,
  Pill,
  Layers,
  Clock,
  User,
  HeartPulse,
  Stethoscope,
  Brain,
  Activity,
  UserCheck,
  ShieldCheck,
  FileCheck,
  BarChart3,
  Sliders,
  Plus
} from 'lucide-react';
import { User as UserType } from '../../types';

export type NavItemKey = string;

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  currentUser: UserType;
  onOpenRoleSwitcher: () => void;
  onGoToLanding: () => void;
  criticalAlertCount: number;
}

interface NavItemConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    type: 'clean' | 'ml' | 'count' | 'smart' | 'sim' | 'critical' | 'csv' | 'train' | 'fefo';
  };
  isActive: (tab: string) => boolean;
}

interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenRoleSwitcher,
  criticalAlertCount
}) => {
  // Build role-tailored navigation sections
  const getNavSections = (): NavSection[] => {
    // 1. ML ANALYST WORKSPACE (Requirement 26)
    if (currentUser.role === 'ML_ANALYST') {
      return [
        {
          title: 'ML INTELLIGENCE',
          items: [
            {
              key: 'hospstock',
              label: 'HospStock ML Engine',
              icon: Sparkles,
              badge: { text: 'Core', type: 'train' },
              isActive: (t) => t === 'hospstock' || t === 'overview'
            },
            {
              key: 'ml-overview',
              label: 'Overview',
              icon: Brain,
              isActive: (t) => t === 'ml-overview'
            },
            {
              key: 'ml-datasets',
              label: 'Datasets',
              icon: Database,
              badge: { text: 'Clean', type: 'clean' },
              isActive: (t) => t === 'ml-datasets' || t === 'ml-quality'
            },
            {
              key: 'ml-training',
              label: 'ML Training',
              icon: Cpu,
              badge: { text: 'Train', type: 'train' },
              isActive: (t) => t === 'ml-training' || t === 'ml-studio'
            },
            {
              key: 'ml-predictions',
              label: 'Predictions',
              icon: FileSpreadsheetIcon,
              badge: { text: 'CSV', type: 'csv' },
              isActive: (t) => t === 'ml-predictions' || t === 'predictions'
            },
            {
              key: 'ml-registry',
              label: 'Model Registry',
              icon: Layers,
              isActive: (t) => t === 'ml-registry'
            },
            {
              key: 'ml-performance',
              label: 'Model Performance',
              icon: BarChart3,
              isActive: (t) => t === 'ml-performance'
            },
            {
              key: 'ml-explainability',
              label: 'Explainability',
              icon: Sparkles,
              isActive: (t) => t === 'ml-explainability'
            },
            {
              key: 'ml-monitoring',
              label: 'Monitoring',
              icon: Activity,
              isActive: (t) => t === 'ml-monitoring'
            }
          ]
        },
        {
          title: 'SUPPLY CHAIN',
          items: [
            {
              key: 'forecast',
              label: 'Demand Forecast',
              icon: TrendingUp,
              badge: { text: 'ML', type: 'ml' },
              isActive: (t) => t === 'forecast' || t === 'district-forecast'
            },
            {
              key: 'risk',
              label: 'Stock Risk',
              icon: AlertTriangle,
              badge: { text: '5', type: 'count' },
              isActive: (t) => t === 'risk' || t === 'district-risk'
            },
            {
              key: 'redistribution',
              label: 'Redistribution',
              icon: ArrowLeftRight,
              badge: { text: 'Smart', type: 'smart' },
              isActive: (t) => t === 'redistribution' || t === 'district-redistribution'
            },
            {
              key: 'digital-twin',
              label: 'Digital Twin',
              icon: Cpu,
              badge: { text: 'Sim', type: 'sim' },
              isActive: (t) => t === 'digital-twin' || t === 'district-disruptions'
            },
            {
              key: 'alerts',
              label: 'Alerts',
              icon: Bell,
              badge: { text: criticalAlertCount > 0 ? String(criticalAlertCount) : '3', type: 'critical' },
              isActive: (t) => t === 'alerts'
            },
            {
              key: 'reports',
              label: 'Reports',
              icon: FileText,
              isActive: (t) => t === 'reports' || t.endsWith('-reports')
            }
          ]
        }
      ];
    }

    // 2. PHARMACIST WORKSPACE (Requirement 27)
    if (currentUser.role === 'PHARMACIST') {
      return [
        {
          title: 'PHARMACY',
          items: [
            {
              key: 'hospstock',
              label: 'HospStock AI Engine',
              icon: Sparkles,
              badge: { text: 'Core', type: 'clean' },
              isActive: (t) => t === 'hospstock' || t === 'overview' || t === 'pharmacy-overview'
            },
            {
              key: 'health-data',
              label: 'Health Data',
              icon: Database,
              badge: { text: 'Clean', type: 'clean' },
              isActive: (t) => t === 'health-data'
            },
            {
              key: 'pharmacy-inventory',
              label: 'Inventory',
              icon: Pill,
              isActive: (t) => t === 'pharmacy-inventory' || t === 'pharmacy-overview'
            },
            {
              key: 'pharmacy-batches',
              label: 'Medicine Batches',
              icon: Layers,
              isActive: (t) => t === 'pharmacy-batches'
            },
            {
              key: 'pharmacy-fefo',
              label: 'Expiry / FEFO',
              icon: Clock,
              badge: { text: 'FEFO', type: 'fefo' },
              isActive: (t) => t === 'pharmacy-fefo' || t === 'pharmacy-expiring'
            },
            {
              key: 'forecast',
              label: 'Demand Forecast',
              icon: TrendingUp,
              badge: { text: 'ML', type: 'ml' },
              isActive: (t) => t === 'forecast'
            },
            {
              key: 'pharmacy-predictions',
              label: 'Predictions',
              icon: FileSpreadsheetIcon,
              badge: { text: 'CSV', type: 'csv' },
              isActive: (t) => t === 'pharmacy-predictions' || t === 'predictions'
            },
            {
              key: 'risk',
              label: 'Stock Risk',
              icon: AlertTriangle,
              badge: { text: '5', type: 'count' },
              isActive: (t) => t === 'risk'
            },
            {
              key: 'pharmacy-requests',
              label: 'Medicine Requests',
              icon: ArrowLeftRight,
              badge: { text: '3', type: 'count' },
              isActive: (t) => t === 'pharmacy-requests'
            }
          ]
        },
        {
          title: 'OPERATIONS',
          items: [
            {
              key: 'redistribution',
              label: 'Redistribution',
              icon: ArrowLeftRight,
              badge: { text: 'Smart', type: 'smart' },
              isActive: (t) => t === 'redistribution' || t === 'pharmacy-transfers'
            },
            {
              key: 'alerts',
              label: 'Alerts',
              icon: Bell,
              badge: { text: criticalAlertCount > 0 ? String(criticalAlertCount) : '3', type: 'critical' },
              isActive: (t) => t === 'alerts'
            },
            {
              key: 'reports',
              label: 'Reports',
              icon: FileText,
              isActive: (t) => t === 'reports' || t === 'pharmacy-reports'
            }
          ]
        }
      ];
    }

    // 3. DEFAULT EXECUTIVE / SUPER ADMIN / DISTRICT ADMIN / WAREHOUSE / CLINICAL
    return [
      {
        title: 'COMMAND WORKSPACE',
        items: [
          {
            key: 'hospstock',
            label: 'HospStock AI Engine',
            icon: Sparkles,
            badge: { text: 'Core', type: 'ml' },
            isActive: (t) => t === 'hospstock' || t === 'overview'
          },
          {
            key: 'health-data',
            label: 'Health Data',
            icon: Database,
            badge: { text: 'Clean', type: 'clean' },
            isActive: (t) => t === 'health-data' || t === 'ml-datasets' || t === 'ml-quality'
          },
          {
            key: 'forecast',
            label: 'Demand Forecast',
            icon: TrendingUp,
            badge: { text: 'ML', type: 'ml' },
            isActive: (t) => t === 'forecast' || t === 'district-forecast'
          },
          {
            key: 'predictions',
            label: 'Predictions',
            icon: FileSpreadsheetIcon,
            badge: { text: 'CSV', type: 'csv' },
            isActive: (t) => t === 'predictions' || t === 'ml-predictions' || t === 'pharmacy-predictions'
          },
          {
            key: 'risk',
            label: 'Stock Risk',
            icon: AlertTriangle,
            badge: { text: '5', type: 'count' },
            isActive: (t) => t === 'risk' || t === 'district-risk'
          },
          {
            key: 'redistribution',
            label: 'Redistribution',
            icon: ArrowLeftRight,
            badge: { text: 'Smart', type: 'smart' },
            isActive: (t) =>
              t === 'redistribution' ||
              t === 'district-redistribution' ||
              t === 'supply-surplus-deficit'
          },
          {
            key: 'digital-twin',
            label: 'Digital Twin',
            icon: Cpu,
            badge: { text: 'Sim', type: 'sim' },
            isActive: (t) => t === 'digital-twin' || t === 'district-disruptions'
          },
          {
            key: 'alerts',
            label: 'Alerts',
            icon: Bell,
            badge: { text: criticalAlertCount > 0 ? String(criticalAlertCount) : '3', type: 'critical' },
            isActive: (t) => t === 'alerts' || t.endsWith('-alerts')
          },
          {
            key: 'reports',
            label: 'Reports',
            icon: FileText,
            isActive: (t) => t === 'reports' || t.endsWith('-reports')
          },
          {
            key: 'hospitals',
            label: 'Hospitals',
            icon: Building2,
            isActive: (t) => t === 'hospitals' || t === 'district-network' || t === 'admin-facilities'
          },
          {
            key: 'suppliers',
            label: 'Suppliers',
            icon: Truck,
            isActive: (t) => t === 'suppliers' || t.endsWith('-suppliers')
          }
        ]
      }
    ];
  };

  const sections = getNavSections();

  return (
    <aside className="w-[215px] sm:w-[220px] bg-[#0A1026] text-slate-200 flex flex-col h-screen border-r border-slate-800/80 select-none flex-shrink-0 z-30">
      {/* 1. BRAND HEADER: Always visible at top of authenticated sidebar (Requirement 1 & 2) */}
      <div className="p-3.5 border-b border-slate-800/80 bg-gradient-to-b from-[#0e1738] to-[#0A1026] shrink-0">
        <div className="flex items-center gap-2.5">
          {/* MediChain AI Logo */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-md shadow-teal-500/25 text-white font-black text-sm ring-1 ring-cyan-400/40 shrink-0">
            <svg
              className="w-4.5 h-4.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="font-black text-sm tracking-tight text-white">HospStock</span>
              <span className="text-[10px] font-extrabold px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[9px] text-cyan-200/70 font-medium leading-tight truncate">
              Hospital Inventory & Demand Prediction
            </p>
          </div>
        </div>

        {/* Active Role Mini Strip */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-white block truncate leading-tight">
              {currentUser?.name || 'Pooja Nair'}
            </span>
            <span className="text-[9px] text-slate-400 block truncate leading-tight mt-0.5">
              {currentUser?.roleTitle || 'Chief Pharmacy Inventory Officer'}
            </span>
          </div>
          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 shrink-0">
            {currentUser?.role ? currentUser.role.replace(/_/g, ' ') : 'PHARMACIST'}
          </span>
        </div>
      </div>

      {/* 2. SCROLLABLE NAVIGATION LIST */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 min-h-0">
        {sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-1">
            <div className="px-2.5 pb-1">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-cyan-400/80">
                {sec.title}
              </span>
            </div>

            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = item.isActive(currentTab);

                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectTab(item.key)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all group cursor-pointer ${
                      active
                        ? 'bg-[#092233] border border-cyan-500/40 text-cyan-300 font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-105 ${
                          active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>

                    {/* Badges on right side */}
                    {item.badge && (
                      <div className="shrink-0 ml-1">
                        {item.badge.type === 'clean' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0a232e] text-[#2dd4bf] border border-[#14535a]">
                            Clean
                          </span>
                        )}

                        {item.badge.type === 'ml' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#1e1b4b] text-[#c084fc] border border-[#581c87] flex items-center gap-0.5">
                            <Sparkles className="w-2 h-2 text-[#c084fc]" />
                            <span>ML</span>
                          </span>
                        )}

                        {item.badge.type === 'csv' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-700">
                            CSV
                          </span>
                        )}

                        {item.badge.type === 'train' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-700">
                            Train
                          </span>
                        )}

                        {item.badge.type === 'fefo' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                            FEFO
                          </span>
                        )}

                        {item.badge.type === 'count' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#1e293b] text-[#94a3b8] border border-slate-700/60">
                            {item.badge.text}
                          </span>
                        )}

                        {item.badge.type === 'smart' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0a232e] text-[#2dd4bf] border border-[#14535a]">
                            Smart
                          </span>
                        )}

                        {item.badge.type === 'sim' && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              active
                                ? 'bg-[#093544] text-cyan-300 border border-cyan-500/40'
                                : 'bg-[#082b3d] text-[#38bdf8] border border-[#0e4e68]'
                            }`}
                          >
                            Sim
                          </span>
                        )}

                        {item.badge.type === 'critical' && (
                          <span className="text-[9px] font-extrabold px-1.5 min-w-3.5 text-center rounded-full bg-[#e11d48] text-white">
                            {item.badge.text}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. BOTTOM PROFILE CARD (Never overlapping) */}
      <div className="p-2 border-t border-slate-800/80 bg-[#0A1026] shrink-0">
        <div className="p-2 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={
                currentUser?.avatarUrl ||
                'https://images.unsplash.com/photo-1594824813583-0598f828a2a0?w=150&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name || 'Pooja Nair'}
              className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {currentUser?.name || 'Pooja Nair'}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                {currentUser?.roleTitle || 'Chief Pharmacy Officer'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 tracking-wider">
              {currentUser?.role ? currentUser.role.replace(/_/g, ' ') : 'PHARMACIST'}
            </span>

            <button
              onClick={onOpenRoleSwitcher}
              className="text-[10px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-0.5 transition-colors cursor-pointer hover:underline"
              title="Switch user role"
            >
              <span>Switch Role</span>
              <ChevronRight className="w-3 h-3 text-teal-400" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Reusable SVG Icon for CSV Predictions
function FileSpreadsheetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>
  );
}
