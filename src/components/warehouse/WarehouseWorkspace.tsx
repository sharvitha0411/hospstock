import React, { useState } from 'react';
import {
  Warehouse,
  Truck,
  Box,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Thermometer,
  ArrowRight,
  ShieldCheck,
  Send,
  Boxes,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WarehouseWorkspace: React.FC = () => {
  const { currentUser, batches, logAuditAction } = useApp();

  const [activeTab, setActiveTab] = useState<'INCOMING' | 'STORAGE' | 'DISPATCH'>('INCOMING');
  const [verifiedShipments, setVerifiedShipments] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Realistic mock incoming supplier deliveries
  const [incomingShipments, setIncomingShipments] = useState([
    {
      id: 'ship-101',
      supplier: 'Bharat Pharma Labs, Unit 4',
      manifestNo: 'MNF-2026-8812',
      medicine: 'Paracetamol 500mg Tablets',
      quantity: 50000,
      batches: 'PAR-2026-B81, PAR-2026-B82',
      expectedTemp: 'ROOM_TEMP (15-25°C)',
      actualTemp: '20.8°C',
      eta: 'Arrived Today, 08:30 AM',
      status: 'PENDING_VERIFICATION'
    },
    {
      id: 'ship-102',
      supplier: 'National Serum & Biologics Ltd',
      manifestNo: 'MNF-2026-8813',
      medicine: 'Human Insulin 100IU/ml Vial',
      quantity: 4000,
      batches: 'INS-2026-K12',
      expectedTemp: 'COLD_CHAIN (2°C - 8°C)',
      actualTemp: '3.6°C',
      eta: 'Arrived Today, 09:15 AM',
      status: 'PENDING_VERIFICATION'
    },
    {
      id: 'ship-103',
      supplier: 'Apex Lifesciences Corp',
      manifestNo: 'MNF-2026-8814',
      medicine: 'Amoxicillin 500mg Capsules',
      quantity: 25000,
      batches: 'AMX-2026-X99',
      expectedTemp: 'ROOM_TEMP (< 25°C)',
      actualTemp: '21.1°C',
      eta: 'In-Transit (ETA 1 hour)',
      status: 'IN_TRANSIT'
    }
  ]);

  const handleVerifyShipment = (id: string, supplier: string, med: string, qty: number) => {
    setIncomingShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'VERIFIED_INGESTED' } : s))
    );
    setVerifiedShipments((prev) => [...prev, id]);
    logAuditAction(
      'Verified & Ingested Supplier Shipment',
      'INVENTORY',
      `Warehouse Manager ${currentUser.name} verified barcode & cold-chain for ${qty} units of ${med} from ${supplier}. Stored in Cryo-Vault A.`
    );
    setActionMsg(`Shipment #${id} inspected and admitted to Central Depot inventory.`);
    setTimeout(() => setActionMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Central Medical Supply Depot #4</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                WAREHOUSE MANAGER ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.name} · State Central Storage Hub · Regional Palletization & Cold-Chain Vaults
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Cryo-Vault 2-8°C</span>
            <span className="text-emerald-700 font-bold">3.8°C (Optimal)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pallet Capacity</span>
            <span className="text-slate-800 font-bold">85,400 / 100,000</span>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('INCOMING')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'INCOMING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Incoming Supplier Deliveries ({incomingShipments.length})
        </button>
        <button
          onClick={() => setActiveTab('STORAGE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'STORAGE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Depot Storage Vaults & Batches
        </button>
        <button
          onClick={() => setActiveTab('DISPATCH')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'DISPATCH' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Outgoing Dispatches
        </button>
      </div>

      {/* TAB 1: INCOMING SHIPMENTS */}
      {activeTab === 'INCOMING' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Dock Inspection & Ingestion Gate</h3>
              <p className="text-xs text-slate-500">Scan packaging GS1 serial, verify cold-chain logger data, and admit to inventory</p>
            </div>
          </div>

          <div className="space-y-3">
            {incomingShipments.map((ship) => (
              <div
                key={ship.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {ship.manifestNo}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{ship.supplier}</span>
                  </div>
                  <p className="text-slate-700 font-semibold text-xs">
                    {ship.medicine} · {ship.quantity.toLocaleString()} units ({ship.batches})
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> {ship.eta}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] font-mono">
                    <span className="text-slate-400 block text-[9px] uppercase">Telemetry Temp</span>
                    <strong className="text-emerald-700">{ship.actualTemp}</strong> (Target: {ship.expectedTemp})
                  </div>

                  {ship.status === 'VERIFIED_INGESTED' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ingested to Vault
                    </span>
                  ) : ship.status === 'PENDING_VERIFICATION' ? (
                    <button
                      onClick={() => handleVerifyShipment(ship.id, ship.supplier, ship.medicine, ship.quantity)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Barcode & Ingest</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs">
                      En Route
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STORAGE VAULTS */}
      {activeTab === 'STORAGE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Depot Palletized Storage Zones</h3>
              <p className="text-xs text-slate-500">Automated High-Bay Storage & Cryogenic Vaults</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cryo-Vault Alpha (2°C–8°C)</span>
              <div className="text-xl font-black text-cyan-700">14,200 Vials</div>
              <p className="text-xs text-slate-600">Human Insulin, Tetanus Toxoid, Rabies Vaccine</p>
              <span className="text-[10px] text-emerald-600 font-bold">100% Sensor Compliance</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">High-Bay Zone Beta (15°C–25°C)</span>
              <div className="text-xl font-black text-slate-900">450,000 Units</div>
              <p className="text-xs text-slate-600">Paracetamol, Amoxicillin, Azithromycin, ORS</p>
              <span className="text-[10px] text-teal-600 font-bold">Automated FIFO Retrieval</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">IV Fluid Reserve Bay Gamma</span>
              <div className="text-xl font-black text-slate-900">62,000 Bottles</div>
              <p className="text-xs text-slate-600">Normal Saline 0.9%, Ringer Lactate, Dextrose</p>
              <span className="text-[10px] text-slate-500 font-bold">Monsoon Emergency Buffer</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCH */}
      {activeTab === 'DISPATCH' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Outgoing Hospital Dispatches</h3>
              <p className="text-xs text-slate-500">Scheduled replenishment and emergency inter-district transfers</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Transfer #redist-1 to Metro Apex Hospital</div>
              <div className="text-slate-500">400 Vials Human Insulin · Refrigerated Fleet TRK-204</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              IN_TRANSIT (ETA 25m)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
