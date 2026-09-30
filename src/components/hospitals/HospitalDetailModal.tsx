import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Phone,
  Bed,
  AlertTriangle,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Hospital, InventoryItem } from '../../types';
import { INVENTORY_ITEMS, MEDICINES, REDISTRIBUTION_PLANS } from '../../data/mockData';
import { computeStockRisks } from '../../services/riskEngine';

interface HospitalDetailModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onNavigateToRedistribution: () => void;
}

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({
  hospital,
  onClose,
  onNavigateToRedistribution
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'transfers' | 'overview'>('inventory');

  if (!hospital) return null;

  const facilityStock = computeStockRisks(INVENTORY_ITEMS).filter(
    (i) => i.hospitalId === hospital.id
  );

  const incomingTransfers = REDISTRIBUTION_PLANS.filter((p) => p.toHospitalId === hospital.id);
  const outgoingTransfers = REDISTRIBUTION_PLANS.filter((p) => p.fromHospitalId === hospital.id);

  const isCrit = hospital.riskLevel === 'CRITICAL';
  const isWarn = hospital.riskLevel === 'MEDIUM';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl text-white font-bold ${
                isCrit ? 'bg-rose-600' : isWarn ? 'bg-amber-500' : 'bg-teal-600'
              }`}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{hospital.name}</h2>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isCrit ? 'bg-rose-100 text-rose-800' : isWarn ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {hospital.riskLevel} Risk • Score {hospital.riskScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {hospital.address} • {hospital.districtName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facility Quick Stat Strip */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-white border-b border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold block">Facility Type</span>
            <span className="font-bold text-slate-800">{hospital.type.replace('_', ' ')}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold block">Inpatient Capacity</span>
            <span className="font-bold text-slate-800">{hospital.beds} Beds</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold block">Critical Deficits</span>
            <span className="font-black text-rose-600">{hospital.criticalMedicinesCount} Drugs</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold block">Surplus Medicines</span>
            <span className="font-black text-teal-700">{hospital.surplusMedicinesCount} Available</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="px-5 pt-3 border-b border-slate-200 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-2.5 transition-all border-b-2 ${
              activeTab === 'inventory' ? 'border-teal-600 text-teal-800 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Inventory Telemetry ({facilityStock.length})
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`pb-2.5 transition-all border-b-2 ${
              activeTab === 'transfers' ? 'border-teal-600 text-teal-800 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Transfers ({incomingTransfers.length + outgoingTransfers.length})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 transition-all border-b-2 ${
              activeTab === 'overview' ? 'border-teal-600 text-teal-800 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Facility Contacts & Logistics
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[380px] overflow-y-auto">
          {activeTab === 'inventory' && (
            <div className="space-y-3">
              {facilityStock.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No stock alerts reported for this facility. Buffer levels are nominal.
                </div>
              ) : (
                facilityStock.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.medicineName}</div>
                      <div className="text-[11px] text-slate-500">
                        Stock: {item.currentStock.toLocaleString()} • Daily Burn: {item.predictedDailyConsumption}/day
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold">
                        <span className={item.daysUntilStockout < 3 ? 'text-rose-600' : 'text-slate-800'}>
                          {item.urgencyLabel}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.stockStatus === 'CRITICAL' || item.stockStatus === 'STOCK_OUT_TODAY'
                            ? 'bg-rose-100 text-rose-800'
                            : item.stockStatus === 'SURPLUS'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.stockStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'transfers' && (
            <div className="space-y-3">
              {incomingTransfers.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs text-rose-700 uppercase tracking-wider mb-2">
                    Incoming Emergency Shipments
                  </h4>
                  {incomingTransfers.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 text-xs flex justify-between items-center mb-2">
                      <div>
                        <div className="font-bold text-slate-900">{p.medicineName} ({p.transferQuantity} units)</div>
                        <div className="text-[11px] text-slate-500">From: {p.fromHospitalName} • ETA: {p.etaMinutes}m</div>
                      </div>
                      <span className="px-2 py-1 bg-white font-bold text-[10px] rounded text-teal-800 border border-teal-200">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {outgoingTransfers.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-bold text-xs text-teal-700 uppercase tracking-wider mb-2">
                    Outgoing Surplus Allocations
                  </h4>
                  {outgoingTransfers.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg border border-teal-200 bg-teal-50/50 text-xs flex justify-between items-center mb-2">
                      <div>
                        <div className="font-bold text-slate-900">{p.medicineName} ({p.transferQuantity} units)</div>
                        <div className="text-[11px] text-slate-500">To: {p.toHospitalName} • Distance: {p.distanceKm}km</div>
                      </div>
                      <span className="px-2 py-1 bg-white font-bold text-[10px] rounded text-teal-800 border border-teal-200">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-700 block">Facility Superintendent</span>
                <span className="text-slate-900">{hospital.contactPerson}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-700 block">Emergency Dispatch Direct Line</span>
                <span className="font-mono text-teal-800">{hospital.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-700 block">Facility Code</span>
                <span className="font-mono text-slate-800">{hospital.code}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Coordinates: {hospital.coordinates.lat}, {hospital.coordinates.lng}
          </span>
          <button
            onClick={() => {
              onClose();
              onNavigateToRedistribution();
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            Launch Facility Redistribution <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
