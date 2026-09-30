import React, { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Clock,
  Coins,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  Send,
  Edit3,
  Sliders,
  Check,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RedistributionPlan, TransferStatus } from '../../types';
import { REDISTRIBUTION_PLANS, HOSPITALS, MEDICINES } from '../../data/mockData';
import { generateSmartRedistributionRecommendations, matchDonorForShortage } from '../../services/optimizationEngine';

interface RedistributionWorkspaceProps {
  onPlanUpdated?: () => void;
}

export const RedistributionWorkspace: React.FC<RedistributionWorkspaceProps> = () => {
  const [plans, setPlans] = useState<RedistributionPlan[]>(REDISTRIBUTION_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<RedistributionPlan | null>(plans[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState<number>(plans[0]?.transferQuantity || 1000);
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  const handleApprove = (planId: string) => {
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore in tests
    }

    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'APPROVED' as TransferStatus } : p))
    );

    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan({ ...selectedPlan, status: 'APPROVED' });
    }
  };

  const handleReject = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'REJECTED' as TransferStatus } : p))
    );
    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan({ ...selectedPlan, status: 'REJECTED' });
    }
  };

  const handleSaveEdit = () => {
    if (!selectedPlan) return;
    const updated = { ...selectedPlan, transferQuantity: editQuantity };
    setPlans((prev) => prev.map((p) => (p.id === selectedPlan.id ? updated : p)));
    setSelectedPlan(updated);
    setIsEditing(false);
  };

  const filteredPlans = plans.filter((p) => {
    if (filterPriority === 'CRITICAL') return p.priority === 'CRITICAL';
    if (filterPriority === 'HIGH') return p.priority === 'HIGH' || p.priority === 'CRITICAL';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Smart Inter-Hospital Medicine Redistribution
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Module 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic donor-recipient matching minimizing transit distance, cost, and stockout vulnerability.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            All Plans ({plans.length})
          </button>
          <button
            onClick={() => setFilterPriority('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg transition-all text-rose-600 ${
              filterPriority === 'CRITICAL' ? 'bg-rose-600 text-white shadow-2xs' : 'hover:text-rose-700'
            }`}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Main Visual Flow of the Active Recommendation */}
      {selectedPlan && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md relative overflow-hidden">
          {/* Header of selected card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <ArrowLeftRight className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-slate-900">
                    Recommended Transfer: {selectedPlan.medicineName}
                  </h2>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      selectedPlan.priority === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {selectedPlan.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Match Score: {selectedPlan.optimizationScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPlan.urgencyReason}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <span
                className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border ${
                  selectedPlan.status === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : selectedPlan.status === 'IN_TRANSIT'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : selectedPlan.status === 'REJECTED'
                    ? 'bg-slate-100 text-slate-600 border-slate-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {selectedPlan.status === 'APPROVED' ? '✓ APPROVED FOR DISPATCH' : selectedPlan.status}
              </span>
            </div>
          </div>

          {/* VISUAL 3-STAGE FLOW: SURPLUS -> TRANSFER -> SHORTAGE */}
          <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* STAGE 1: DONOR (SURPLUS) */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl relative">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-700 text-white tracking-wider">
                1. DONOR (SURPLUS HUB)
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 mt-2">
                {selectedPlan.fromHospitalName}
              </h3>
              <p className="text-xs text-slate-500">{selectedPlan.fromHospitalDistrict}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-white rounded-lg border border-teal-100">
                  <span className="text-slate-400 text-[10px] block font-sans">Current Stock</span>
                  <span className="font-bold text-slate-900">
                    {selectedPlan.fromCurrentStock.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-teal-100">
                  <span className="text-slate-400 text-[10px] block font-sans">Surplus Buffer</span>
                  <span className="font-bold text-teal-700">
                    +{selectedPlan.fromSurplusQuantity.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* STAGE 2: RECOMMENDED TRANSFER (CENTER) */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md mb-2">
                <Truck className="w-5 h-5" />
              </div>

              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Recommended Allocation
              </span>

              {isEditing ? (
                <div className="flex items-center gap-1.5 my-1">
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    className="w-24 text-center font-black text-lg bg-white border border-teal-400 rounded-lg p-1 text-slate-900"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 rounded bg-teal-600 text-white hover:bg-teal-700"
                    title="Save quantity"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-2xl font-black text-slate-900 my-1">
                  {selectedPlan.transferQuantity.toLocaleString()}{' '}
                  <span className="text-xs font-medium text-slate-500">units</span>
                </div>
              )}

              {/* Transit Logistics Specs */}
              <div className="grid grid-cols-3 gap-2 mt-2 w-full text-center text-xs font-mono border-t border-slate-200 pt-2">
                <div>
                  <span className="text-slate-400 text-[9px] block font-sans">Distance</span>
                  <span className="font-bold text-slate-800">{selectedPlan.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block font-sans">Transit ETA</span>
                  <span className="font-bold text-teal-700">{selectedPlan.etaMinutes} min</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block font-sans">Est. Cost</span>
                  <span className="font-bold text-slate-800">₹{selectedPlan.estimatedCostINR}</span>
                </div>
              </div>
            </div>

            {/* STAGE 3: RECIPIENT (SHORTAGE) */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl relative">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white tracking-wider">
                3. RECIPIENT (DEFICIT)
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 mt-2">
                {selectedPlan.toHospitalName}
              </h3>
              <p className="text-xs text-slate-500">{selectedPlan.toHospitalDistrict}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-white rounded-lg border border-rose-100">
                  <span className="text-slate-400 text-[10px] block font-sans">Current Stock</span>
                  <span className="font-bold text-rose-600">
                    {selectedPlan.toCurrentStock.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-rose-100">
                  <span className="text-slate-400 text-[10px] block font-sans">Projected Shortage</span>
                  <span className="font-bold text-rose-700">
                    -{selectedPlan.toDeficitQuantity.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Preserves 14-day mandatory emergency stock at donor hospital.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel Edit' : 'Modify Allocation'}
              </button>

              <button
                onClick={() => handleReject(selectedPlan.id)}
                disabled={selectedPlan.status === 'REJECTED'}
                className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>

              <button
                onClick={() => handleApprove(selectedPlan.id)}
                disabled={selectedPlan.status === 'APPROVED' || selectedPlan.status === 'IN_TRANSIT'}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedPlan.status === 'APPROVED' ? 'Transfer Authorized' : 'Approve Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Recommended Transfers */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">
          All Active Redistribution Recommendations ({filteredPlans.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isApproved = plan.status === 'APPROVED' || plan.status === 'IN_TRANSIT';

            return (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);
                  setEditQuantity(plan.transferQuantity);
                }}
                className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        plan.priority === 'CRITICAL'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {plan.priority}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1.5">
                      {plan.medicineName}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    Score: {plan.optimizationScore}
                  </span>
                </div>

                <div className="mt-3 text-xs space-y-1">
                  <div className="text-slate-600 truncate">
                    <span className="text-slate-400 font-medium">From:</span> {plan.fromHospitalName}
                  </div>
                  <div className="text-slate-600 truncate">
                    <span className="text-slate-400 font-medium">To:</span> {plan.toHospitalName}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">
                    {plan.transferQuantity.toLocaleString()} units
                  </span>
                  <span className="text-slate-500">{plan.distanceKm} km • {plan.etaMinutes}m</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : plan.status === 'REJECTED'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {plan.status}
                  </span>

                  {!isApproved && plan.status !== 'REJECTED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(plan.id);
                      }}
                      className="text-xs font-bold text-teal-600 hover:text-teal-800"
                    >
                      Quick Approve →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
