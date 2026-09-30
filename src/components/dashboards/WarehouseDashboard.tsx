import React, { useState } from 'react';
import {
  Warehouse,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Thermometer,
  ShieldCheck,
  Truck,
  Search,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WarehouseDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const WarehouseDashboard: React.FC<WarehouseDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    inventory,
    batches
  } = useApp();

  const [warehouseSuccess, setWarehouseSuccess] = useState<string | null>(null);

  // Inbound Shipments
  const [inboundShipments, setInboundShipments] = useState([
    {
      id: 'INB-401',
      supplier: 'Bharat Biotech & Serum Labs',
      medicine: 'Paracetamol 500mg Tablets',
      quantity: '50,000 Vials',
      eta: 'Today, 11:30 AM',
      sealStatus: 'SEAL_INTACT',
      inspectionStatus: 'PENDING_INSPECTION',
      dock: 'Bay 1'
    },
    {
      id: 'INB-402',
      supplier: 'National Biologics Ltd',
      medicine: 'Human Insulin 100IU/ml Vial',
      quantity: '4,000 Vials',
      eta: 'Today, 02:00 PM',
      sealStatus: 'COLD_CHAIN_MONITORED',
      inspectionStatus: 'IN_TRANSIT',
      dock: 'Cold Vault Bay 4'
    },
    {
      id: 'INB-403',
      supplier: 'Apex Lifesciences Corp',
      medicine: 'Amoxicillin 500mg Capsules',
      quantity: '20,000 Packs',
      eta: 'Tomorrow, 09:00 AM',
      sealStatus: 'SCHEDULED',
      inspectionStatus: 'PRE_MANIFEST',
      dock: 'Bay 2'
    }
  ]);

  // Outbound Dispatches
  const outboundDispatches = [
    {
      id: 'OUT-881',
      destination: 'Metro Apex Multi-Specialty Hospital',
      medicine: 'Human Insulin 100IU (400 Vials)',
      vehicle: 'Refrigerated Van #TRK-204',
      dock: 'Loading Dock C',
      status: 'LOADING',
      urgency: 'HIGH_PRIORITY'
    },
    {
      id: 'OUT-882',
      destination: 'North Hill Community Health Center',
      medicine: 'Paracetamol 500mg (1,200 Strips) + ORS',
      vehicle: 'Pharma Fleet #TRK-108',
      dock: 'Dock A',
      status: 'CLEARED_FOR_DEPARTURE',
      urgency: 'ROUTINE'
    },
    {
      id: 'OUT-883',
      destination: 'East Valley Regional Hospital',
      medicine: 'Normal Saline IV (500 Bags)',
      vehicle: 'Regional Carrier #TRK-312',
      dock: 'Dock B',
      status: 'SCHEDULED_15:00',
      urgency: 'ROUTINE'
    }
  ];

  // Storage Zones
  const storageZones = [
    {
      zone: 'Zone A — High-Bay Pallets',
      category: 'Oral Solids & Tablets',
      capacityPercent: 88,
      palletsStored: '420 Pallets',
      status: 'Operational',
      temp: '21.2°C',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      zone: 'Zone B — Fast-Moving Dispensary',
      category: 'Analgesics, ORS & First-Line',
      capacityPercent: 64,
      palletsStored: '210 Pallets',
      status: 'High Turnover',
      temp: '20.8°C',
      color: 'border-teal-200 bg-teal-50/50'
    },
    {
      zone: 'Cold Storage Vault (Cryo 2°C - 8°C)',
      category: 'Insulin, Vaccines & Biologics',
      capacityPercent: 92,
      palletsStored: '85 Vault Pallets',
      status: 'Temp Ideal (3.6°C)',
      temp: '3.6°C',
      color: 'border-cyan-200 bg-cyan-50/50'
    },
    {
      zone: 'Quarantine & QA Testing Bay',
      category: 'Pending Lab Assay Clearance',
      capacityPercent: 30,
      palletsStored: '12 Pallets',
      status: 'Lab Testing In-Progress',
      temp: '22.0°C',
      color: 'border-amber-200 bg-amber-50/50'
    }
  ];

  const handleInspectShipment = (id: string, supplier: string) => {
    setInboundShipments(
      inboundShipments.map((s) =>
        s.id === id ? { ...s, inspectionStatus: 'VERIFIED_INGESTED' } : s
      )
    );
    setWarehouseSuccess(`Inbound shipment ${id} from ${supplier} verified: Barcode GS1 match, temperature log clear, stock ingested.`);
    setTimeout(() => setWarehouseSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
              <Warehouse className="w-5 h-5 text-orange-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Warehouse Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {currentUser.facilityName || 'State Central Medical Supply Depot #4'} • Storage, Staging & Inbound Ingestion
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion */}
        <div className="flex items-center gap-2 bg-orange-50/80 border border-orange-200 px-3 py-2 rounded-xl text-xs text-orange-900">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
          <div className="text-left">
            <span className="font-bold text-[11px] block text-orange-800">Warehouse Copilot:</span>
            <span className="text-[11px] text-orange-700">"Which shipments should be dispatched first based on hospital stock-out priority?"</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {warehouseSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{warehouseSuccess}</span>
        </div>
      )}

      {/* 5 WAREHOUSE KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Inventory</span>
          <div className="text-2xl font-black text-slate-900 mt-1">84,200</div>
          <span className="text-[10px] text-slate-500">Units in Central Depot</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Inbound Shipments</span>
          <div className="text-2xl font-black text-blue-700 mt-1">4</div>
          <span className="text-[10px] text-blue-600 font-medium">Expected Today</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">Outbound Dispatches</span>
          <div className="text-2xl font-black text-teal-700 mt-1">6</div>
          <span className="text-[10px] text-teal-600 font-medium">Scheduled Across 4 Districts</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Low Stock SKUs</span>
          <div className="text-2xl font-black text-amber-700 mt-1">2</div>
          <span className="text-[10px] text-amber-600 font-medium">Buffer reorders triggered</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Expiring Batches</span>
          <div className="text-2xl font-black text-rose-700 mt-1">3</div>
          <span className="text-[10px] text-rose-600 font-bold">&lt; 60 Days FIFO Queue</span>
        </div>
      </div>

      {/* MAIN: WAREHOUSE STORAGE ZONES VISUALIZATION */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">
              Warehouse Storage Zones & Utilization
            </h2>
            <p className="text-xs text-slate-500">Live capacity status across high-bay storage, cold-vaults and quarantine staging</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Depot #4 Central Facility</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storageZones.map((z, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${z.color} flex flex-col justify-between`}>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">{z.zone}</span>
                <span className="text-[11px] text-slate-600 block mt-0.5">{z.category}</span>
                <div className="text-lg font-black text-slate-900 mt-2">{z.palletsStored}</div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Capacity: {z.capacityPercent}%</span>
                  <span className="text-teal-700">{z.temp}</span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${z.capacityPercent}%` }}
                    className={`h-full rounded-full ${
                      z.capacityPercent > 85 ? 'bg-amber-600' : 'bg-teal-600'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{z.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TWO PANEL SECTION:
          LEFT: INBOUND SHIPMENTS TABLE (Span 7)
          RIGHT: OUTBOUND DISPATCH SCHEDULE (Span 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INBOUND SHIPMENTS */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Inbound Shipments</h3>
              <p className="text-xs text-slate-500">Dock receiving, barcode scan verification & cold-chain compliance</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Receiving Bay
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Shipment & Supplier</th>
                  <th className="py-2.5 px-3">Medicine & Qty</th>
                  <th className="py-2.5 px-3">ETA & Dock</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inboundShipments.map((ship) => (
                  <tr key={ship.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{ship.id}</div>
                      <span className="text-[10px] text-slate-500">{ship.supplier}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{ship.medicine}</div>
                      <span className="text-teal-700 font-bold">{ship.quantity}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{ship.eta}</div>
                      <span className="text-[10px] text-slate-500">{ship.dock}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded font-bold text-[9px] border ${
                          ship.inspectionStatus === 'VERIFIED_INGESTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ship.inspectionStatus === 'PENDING_INSPECTION'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {ship.inspectionStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ship.inspectionStatus === 'VERIFIED_INGESTED' ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ingested
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInspectShipment(ship.id, ship.supplier)}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Inspect & Ingest
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OUTBOUND DISPATCH */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-teal-600" />
              Outbound Dispatch Schedule
            </h3>
            <span className="text-[11px] font-bold text-slate-400">3 In-Progress</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {outboundDispatches.map((out) => (
              <div key={out.id} className="pt-2 flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{out.destination}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      out.status === 'CLEARED_FOR_DEPARTURE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-teal-50 text-teal-700 border-teal-200'
                    }`}
                  >
                    {out.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-teal-800 font-bold">{out.medicine}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{out.vehicle}</span>
                  <span className="font-mono">{out.dock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
