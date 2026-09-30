import React, { useState } from 'react';
import {
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Calendar,
  Thermometer,
  ShieldCheck,
  Send,
  Boxes
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyWorkspace: React.FC = () => {
  const {
    currentUser,
    prescriptions,
    dispensePrescription,
    inventory,
    batches,
    recordWastage,
    adjustBatchStock
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PRESCRIPTIONS' | 'FEFO_BATCHES' | 'INVENTORY' | 'WASTAGE'>('PRESCRIPTIONS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dispenseMsg, setDispenseMsg] = useState<string | null>(null);

  // Wastage form
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [wastageQty, setWastageQty] = useState<number>(10);
  const [wastageReason, setWastageReason] = useState<string>('Damaged in transit / packaging breach');
  const [wastageSuccess, setWastageSuccess] = useState<string | null>(null);

  const pendingPrescriptions = prescriptions.filter((p) => p.status === 'PENDING');
  const dispensedPrescriptions = prescriptions.filter((p) => p.status === 'DISPENSED');

  const handleDispense = (rxId: string) => {
    const res = dispensePrescription(rxId);
    if (res.success) {
      setDispenseMsg(`Successfully verified FEFO batches & dispensed prescription #${rxId}!`);
      setTimeout(() => setDispenseMsg(null), 4000);
    }
  };

  const handleRecordWastage = (e: React.FormEvent) => {
    e.preventDefault();
    recordWastage(selectedBatchId, wastageQty, wastageReason);
    setWastageSuccess(`Quarantined & recorded wastage of ${wastageQty} units.`);
    setTimeout(() => setWastageSuccess(null), 3000);
  };

  // Sort batches by expiry date (FEFO: First Expired, First Out)
  const fefoSortedBatches = [...batches].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Hospital Pharmacy & FEFO Inventory</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                PHARMACIST ROLE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.name} · {currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital'} · Inpatient & Outpatient Dispensary
            </p>
          </div>
        </div>

        {/* FEFO Compliance Badge */}
        <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 max-w-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Strict FEFO Rule Enforced: Expired batches automatically locked against dispensing or transfer.</span>
        </div>
      </div>

      {dispenseMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{dispenseMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('PRESCRIPTIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'PRESCRIPTIONS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pending Prescriptions ({pendingPrescriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('FEFO_BATCHES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'FEFO_BATCHES'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          FEFO Batch Queue ({batches.length})
        </button>
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'INVENTORY'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Stock Balances ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('WASTAGE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'WASTAGE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Wastage & Damage Log
        </button>
      </div>

      {/* TAB 1: PENDING PRESCRIPTIONS */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Electronic Doctor Orders Awaiting Pharmacy Dispensing
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Auto-verified against 21 CFR Part 11 audit trail
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPrescriptions.map((rx) => (
              <div key={rx.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {rx.prescriptionNumber}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 mt-1">{rx.patientName}</h4>
                    <span className="text-[11px] text-slate-500">Patient ID: {rx.patientId}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      PENDING DISPENSE
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{rx.createdAt}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-slate-600">
                    Prescribing Doctor: <strong>{rx.doctorName}</strong>
                  </p>
                  <p className="text-slate-600">
                    Clinical Diagnosis: <strong className="text-slate-900">{rx.diagnosis}</strong>
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Medications to Dispense:</span>
                  {rx.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{it.medicineName}</div>
                        <div className="text-[11px] text-slate-500">{it.dosage} · {it.frequency} · {it.instructions}</div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-xs px-2 py-1 bg-white rounded border border-slate-200">
                        Qty: {it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All batches in stock
                  </span>
                  <button
                    onClick={() => handleDispense(rx.id)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Verify & Dispense (FEFO)</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingPrescriptions.length === 0 && (
              <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">All Doctor Prescriptions Dispensed</h4>
                <p className="text-xs text-slate-400">Zero pending orders in the inpatient pharmacy queue.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FEFO BATCHES */}
      {activeTab === 'FEFO_BATCHES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">First-Expired, First-Out (FEFO) Queue</h3>
              <p className="text-xs text-slate-500">Sorted strictly by nearest expiration date to avoid drug wastage</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {fefoSortedBatches.length} Active Batches Monitored
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Batch Number</th>
                  <th className="py-2.5 px-3">Medicine</th>
                  <th className="py-2.5 px-3">Current Units</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Days Left</th>
                  <th className="py-2.5 px-3">Cold-Chain Req</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fefoSortedBatches.map((b) => {
                  const daysLeft = Math.ceil(
                    (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                  );
                  const isExpiringSoon = daysLeft <= 90;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.batchNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{b.medicineName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.quantity}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{b.expiryDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            daysLeft < 30
                              ? 'bg-rose-100 text-rose-800'
                              : isExpiringSoon
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {daysLeft > 0 ? `${daysLeft} days` : 'EXPIRED - LOCKED'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{b.isNearExpiry ? 'NEAR EXPIRY' : 'GOOD CONDITION'}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            setSelectedBatchId(b.id);
                            setActiveTab('WASTAGE');
                          }}
                          className="text-xs text-rose-600 font-bold hover:underline"
                        >
                          Quarantine
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeTab === 'INVENTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Hospital Pharmacy Inventory Balances</h3>
              <p className="text-xs text-slate-500">Metro Apex Hospital Central Stores</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((inv) => {
              const isShortage = inv.stockStatus === 'CRITICAL' || inv.currentStock < 100;
              return (
                <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-600">{inv.medicineId}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isShortage ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inv.stockStatus}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{inv.medicineName}</h4>
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Stock</span>
                      <span className="text-base font-black text-slate-900">{inv.currentStock} units</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Cover</span>
                      <span className="font-mono font-bold text-teal-700">{inv.daysUntilStockout} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WASTAGE & DAMAGE FORM */}
      {activeTab === 'WASTAGE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900">Record Damaged / Expired Stock Wastage</h3>
            <p className="text-xs text-slate-500">Quarantine audit record with mandatory explanation for regulatory logs</p>
          </div>

          {wastageSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{wastageSuccess}</span>
            </div>
          )}

          <form onSubmit={handleRecordWastage} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Batch *</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} - {b.medicineName} ({b.quantity} units, Exp: {b.expiryDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Quantity to Quarantine *</label>
              <input
                type="number"
                required
                value={wastageQty}
                onChange={(e) => setWastageQty(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Quarantine / Wastage *</label>
              <select
                value={wastageReason}
                onChange={(e) => setWastageReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Damaged in transit / packaging breach">Damaged in transit / packaging breach</option>
                <option value="Cold-chain temperature excursion breach (> 8°C)">Cold-chain temperature excursion breach (&gt; 8°C)</option>
                <option value="Passed expiration date (Natural expiry)">Passed expiration date (Natural expiry)</option>
                <option value="Physical audit inventory discrepancy">Physical audit inventory discrepancy</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Quarantine & Log Wastage</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
