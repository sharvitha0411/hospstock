import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Supplier } from '../../types';
import { SUPPLIERS } from '../../data/mockData';

export const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const disruptedSuppliers = suppliers.filter((s) => s.status === 'DISRUPTED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Pharmaceutical Supplier & Logistics Network
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Module 10 & 19
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Vendor reliability benchmarking, cold-chain compliance, and automated alternate route failovers.
          </p>
        </div>
      </div>

      {/* Disrupted Supplier Failover Alert Box */}
      {disruptedSuppliers.length > 0 && (
        <div className="p-5 bg-rose-50 border border-rose-300 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-sm text-rose-900">
              Active Vendor Disruption Alert: {disruptedSuppliers[0].name}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
              DISRUPTED
            </span>
          </div>

          <p className="text-xs text-rose-800 leading-relaxed">
            Flash flooding has submerged arterial transport corridors to River Port Warehouse Hub 4, halting dispatch of IV fluids and emergency antibiotic lots.
          </p>

          <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 block">
                Recommended Alternate Vendor Failover:
              </span>
              <span className="text-slate-600">
                National Emergency MedReserve (Standby Lead Time: 1.0 Day • Reliability: 99%)
              </span>
            </div>
            <button
              onClick={() => alert('Failover contracts executed. Routing switched to National Emergency MedReserve.')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
            >
              Authorize Alternate Vendor Switch
            </button>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((sup) => {
          const isDisrupted = sup.status === 'DISRUPTED';
          const isStandby = sup.status === 'STANDBY';

          return (
            <div
              key={sup.id}
              className={`p-5 bg-white rounded-2xl border transition-all ${
                isDisrupted
                  ? 'border-rose-300 shadow-2xs bg-rose-50/20'
                  : isStandby
                  ? 'border-cyan-300 shadow-2xs bg-cyan-50/20'
                  : 'border-slate-200 shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isDisrupted
                        ? 'bg-rose-600 text-white'
                        : isStandby
                        ? 'bg-cyan-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {sup.status}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-2">{sup.name}</h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {sup.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-bold">Reliability</span>
                  <span className="text-base font-black text-teal-700 font-mono">
                    {sup.reliabilityScore}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Avg Delivery Lead Time</span>
                  <span className="font-bold text-slate-800">{sup.avgLeadTimeDays} Days</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Cost Benchmark Index</span>
                  <span className="font-bold text-slate-800">{sup.avgCostPerUnitIndex}x baseline</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-3 text-xs">
                <span className="text-slate-400 text-[10px] font-bold block mb-1">
                  Covered Formulary Lines:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sup.medicineCategories.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{sup.contactPerson} • {sup.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{sup.email}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
