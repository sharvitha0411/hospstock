import React, { useState } from 'react';
import {
  Truck,
  ArrowRight,
  ArrowLeftRight,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  RefreshCw,
  Navigation,
  Radio,
  Snowflake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SupplyChainDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const SupplyChainDashboard: React.FC<SupplyChainDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    transfers,
    approveTransfer,
    dispatchTransfer
  } = useApp();

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Active Fleet Deliveries
  const activeDeliveries = [
    {
      truckId: 'TRK-204',
      vehicleType: 'Refrigerated Cold-Chain Van (2°C - 8°C)',
      driver: 'K. Selvaraj (+91 94431 88219)',
      source: 'East Valley Regional Hospital',
      destination: 'Metro Apex Multi-Specialty Hospital',
      cargo: 'Human Insulin 100IU (400 Vials)',
      currentTemp: '3.8°C',
      tempStatus: 'OPTIMAL',
      route: 'State Highway 14 → Bypass Corridor B',
      status: 'IN_TRANSIT',
      eta: '38 mins',
      progress: 68
    },
    {
      truckId: 'TRK-108',
      vehicleType: 'Secure Pharma Fleet 4T',
      driver: 'M. Anand (+91 98402 11920)',
      source: 'State Central Medical Supply Depot #4',
      destination: 'North Hill Community Health Center',
      cargo: 'Paracetamol 500mg (1,200 Strips) + ORS',
      currentTemp: '21.4°C (Ambient)',
      tempStatus: 'OPTIMAL',
      route: 'Expressway Route 9',
      status: 'IN_TRANSIT',
      eta: '1h 12m',
      progress: 42
    },
    {
      truckId: 'TRK-312',
      vehicleType: 'Cryo-Vault Mobile Carrier',
      driver: 'R. Veeramani (+91 94420 33810)',
      source: 'National Serum Institute Depot',
      destination: 'District Medical Store Trichy',
      cargo: 'Anti-Rabies Vaccines + Anti-Snake Venom',
      currentTemp: '4.1°C',
      tempStatus: 'OPTIMAL',
      route: 'Trichy Ring Road',
      status: 'SCHEDULED',
      eta: 'Departing 14:00',
      progress: 10
    }
  ];

  // Transfer Recommendations
  const transferRecommendations = [
    {
      id: 'rec-1',
      medicine: 'Human Insulin 100IU/ml Vial',
      source: 'East Valley Regional (Trichy)',
      destination: 'Metro Apex Hospital (Karur)',
      quantity: 400,
      distance: '18.4 km',
      eta: '45 mins',
      priority: 'CRITICAL',
      status: 'PENDING_APPROVAL',
      tempReq: 'COLD_CHAIN (2°C - 8°C)'
    },
    {
      id: 'rec-2',
      medicine: 'Paracetamol 500mg Tablets',
      source: 'Central Depot #4 (Trichy)',
      destination: 'North Hill CHC (Karur)',
      quantity: 1200,
      distance: '34.2 km',
      eta: '1h 15m',
      priority: 'HIGH',
      status: 'APPROVED',
      tempReq: 'ROOM_TEMP'
    },
    {
      id: 'rec-3',
      medicine: 'Amoxicillin 500mg Capsules',
      source: 'St. Jude District Hospital',
      destination: 'Community Health Center #12',
      quantity: 500,
      distance: '12.8 km',
      eta: '30 mins',
      priority: 'MEDIUM',
      status: 'IN_TRANSIT',
      tempReq: 'ROOM_TEMP'
    }
  ];

  // Cold-chain monitor data
  const coldChainShipments = [
    {
      shipmentId: 'SHP-9821',
      medicine: 'Human Insulin 100IU',
      targetTemp: '2.0°C - 8.0°C',
      actualTemp: '3.8°C',
      battery: '96%',
      carrier: 'TRK-204 (Smart IoT Vault)',
      excursion: 'NORMAL',
      lastPing: '3 mins ago'
    },
    {
      shipmentId: 'SHP-9830',
      medicine: 'Tetanus Toxoid & Biologics',
      targetTemp: '2.0°C - 8.0°C',
      actualTemp: '4.4°C',
      battery: '88%',
      carrier: 'TRK-312 (Cryo-Carrier)',
      excursion: 'NORMAL',
      lastPing: '1 min ago'
    },
    {
      shipmentId: 'SHP-9844',
      medicine: 'Anti-Rabies Vaccines',
      targetTemp: '2.0°C - 8.0°C',
      actualTemp: '5.1°C',
      battery: '91%',
      carrier: 'Central Cold Vault B',
      excursion: 'NORMAL',
      lastPing: 'Live'
    }
  ];

  const handleApprove = (id: string, med: string) => {
    approveTransfer(id);
    setActionSuccess(`Transfer for ${med} APPROVED by Supply Chain Officer. Carrier TRK-204 alerted.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDispatch = (id: string, med: string) => {
    dispatchTransfer(id);
    setActionSuccess(`Refrigerated Carrier dispatched for ${med}. Real-time IoT temperature logging initiated.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Truck className="w-5 h-5 text-amber-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Supply Chain Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Inter-Facility Logistics, Fleet Optimization & Redistribution Command • District Operations Hub
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion & CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-amber-50/80 border border-amber-200 px-3 py-2 rounded-xl text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-left">
              <span className="font-bold text-[11px] block text-amber-800">Logistics Copilot:</span>
              <span className="text-[11px] text-amber-700">"What transfers can reduce projected shortages?"</span>
            </div>
          </div>

          <button
            onClick={() => {
              setActionSuccess('Haversine Optimization Engine recalculating shortest cold-chain corridors for 8 transfer requests.');
              setTimeout(() => setActionSuccess(null), 3000);
            }}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Optimize Transfers
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {actionSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 4 LOGISTICS KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transfer Requests</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <ArrowLeftRight className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">8 Active</div>
          <p className="text-xs text-slate-500 mt-1">4 Pending Approval • 4 Scheduled</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Shortages</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">3 Facilities</div>
          <p className="text-xs text-rose-600 font-medium mt-1">Apex (Insulin), North Hill (ORS)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Surplus</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">14,500 Units</div>
          <p className="text-xs text-emerald-600 mt-1">Identified across 4 donor hospitals</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deliveries</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">6 Fleets</div>
          <p className="text-xs text-amber-600 font-bold mt-1">100% On-Time ETA adherence</p>
        </div>
      </div>

      {/* MAIN: SURPLUS → DEFICIT NETWORK VISUALIZATION */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">
              Surplus → Deficit Redistribution Network
            </h2>
            <p className="text-xs text-slate-500">
              Dynamic bilateral reallocation balancing stock buffers between regional donor hubs and receiving hospitals
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            3 Active Transfer Corridors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Corridor 1: East Valley -> Metro Apex */}
          <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-emerald-50/40 via-white to-rose-50/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Donor Facility (Surplus)</span>
                <span className="font-extrabold text-sm text-slate-900">East Valley Regional (Trichy)</span>
                <span className="text-[11px] font-bold text-emerald-700 block">+4,200 Surplus Units</span>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                  <Snowflake className="w-3 h-3 text-teal-600" />
                  <span>500 Units</span>
                </div>
                <div className="w-24 h-0.5 bg-teal-400 my-1 relative">
                  <div className="w-2 h-2 rounded-full bg-teal-600 absolute right-0 -top-0.5 animate-ping" />
                </div>
                <span className="text-[9px] font-mono text-slate-500">18.4 km • Van #TRK-204</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Deficit Facility</span>
                <span className="font-extrabold text-sm text-slate-900">Metro Apex Hospital (Karur)</span>
                <span className="text-[11px] font-bold text-rose-700 block">-1,800 Deficit (1.8d Cover)</span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
              <span>Cargo: <strong>Human Insulin 100IU Vials</strong></span>
              <span className="text-teal-700 font-bold">ETA: 38 mins (Corridor B)</span>
            </div>
          </div>

          {/* Corridor 2: Central Depot -> North Hill */}
          <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-emerald-50/40 via-white to-rose-50/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Donor Facility (Surplus)</span>
                <span className="font-extrabold text-sm text-slate-900">Central Depot #4</span>
                <span className="text-[11px] font-bold text-emerald-700 block">+12,000 Buffer</span>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  <Truck className="w-3 h-3 text-blue-600" />
                  <span>1,200 Units</span>
                </div>
                <div className="w-24 h-0.5 bg-blue-400 my-1 relative">
                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-0 -top-0.5" />
                </div>
                <span className="text-[9px] font-mono text-slate-500">34.2 km • Fleet #TRK-108</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Deficit Facility</span>
                <span className="font-extrabold text-sm text-slate-900">North Hill CHC</span>
                <span className="text-[11px] font-bold text-rose-700 block">-3,500 High Demand</span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
              <span>Cargo: <strong>Paracetamol 500mg Strips</strong></span>
              <span className="text-blue-700 font-bold">ETA: 1h 12m (Route 9)</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO PANEL SECTION:
          LEFT: TRANSFER RECOMMENDATIONS TABLE (Span 7)
          RIGHT: ACTIVE FLEET DELIVERIES (Span 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TRANSFER RECOMMENDATIONS */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Transfer Recommendations</h3>
              <p className="text-xs text-slate-500">Ranked by Haversine distance, stock urgency & shelf-life</p>
            </div>
            <span className="text-xs font-bold text-slate-400">Algorithmic Match</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Medicine & Qty</th>
                  <th className="py-2.5 px-3">Donor → Recipient</th>
                  <th className="py-2.5 px-3">Distance & ETA</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transferRecommendations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{rec.medicine}</div>
                      <span className="text-teal-700 font-bold">{rec.quantity} units</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{rec.source}</div>
                      <div className="text-[10px] text-slate-500">→ {rec.destination}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{rec.distance}</div>
                      <span className="text-[10px] text-slate-500">{rec.eta}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded font-bold text-[9px] border ${
                          rec.priority === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : rec.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {rec.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleApprove(rec.id, rec.medicine)}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Approve
                        </button>
                      ) : rec.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleDispatch(rec.id, rec.medicine)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-teal-700 text-white font-bold text-[11px]"
                        >
                          Dispatch
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          In-Transit
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVE DELIVERIES & GPS TELEMETRY */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
              Active Fleet Deliveries (GPS & Driver)
            </h3>
            <span className="text-[11px] font-bold text-slate-400">3 Vehicles Active</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {activeDeliveries.map((del) => (
              <div key={del.truckId} className="pt-2 flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-900 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {del.truckId}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{del.cargo}</span>
                  </div>
                  <span className="text-xs font-extrabold text-teal-700">{del.eta}</span>
                </div>

                <div className="text-[11px] text-slate-500">
                  {del.source} → {del.destination}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div style={{ width: `${del.progress}%` }} className="bg-teal-600 h-full rounded-full" />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Driver: {del.driver}</span>
                  <span className="font-mono font-bold text-teal-800">Temp: {del.currentTemp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLD CHAIN MONITOR */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-teal-600" />
              Cold Chain Live Telemetry & Excursion Monitor
            </h3>
            <p className="text-xs text-slate-500">
              Continuous IoT BLE beacon tracking for temperature-sensitive biologics & insulin shipments
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            0 Temperature Excursions Recorded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {coldChainShipments.map((shp) => (
            <div key={shp.shipmentId} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-700">{shp.shipmentId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {shp.excursion}
                  </span>
                </div>
                <div className="font-bold text-slate-900 mt-1">{shp.medicine}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Carrier: {shp.carrier}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Temp</span>
                  <span className="text-base font-black text-teal-700">{shp.actualTemp}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Spec Range</span>
                  <span className="font-medium text-slate-700">{shp.targetTemp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
