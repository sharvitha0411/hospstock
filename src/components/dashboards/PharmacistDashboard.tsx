import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeftRight,
  TrendingDown,
  CheckCircle2,
  Search,
  Plus,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PharmacistDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    inventory,
    batches,
    prescriptions,
    dispensePrescription
  } = useApp();

  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dispenseSuccess, setDispenseSuccess] = useState<string | null>(null);
  const [isReplenishModalOpen, setIsReplenishModalOpen] = useState(false);
  const [replenishSuccess, setReplenishSuccess] = useState<string | null>(null);

  // FEFO Queue items sorted by earliest expiry
  const fefoQueue = [
    {
      id: 'fefo-1',
      medicineName: 'Amoxicillin 500mg Capsules',
      batchNumber: 'AMX-2026-X99',
      currentQty: 180,
      expiryDate: '15 Oct 2026',
      daysLeft: 5,
      isCriticalExpiry: true,
      storageTemp: '20.4°C',
      urgency: 'EXPIRING IN 5 DAYS'
    },
    {
      id: 'fefo-2',
      medicineName: 'Human Insulin 100IU/ml Vial',
      batchNumber: 'INS-2026-K12',
      currentQty: 45,
      expiryDate: '28 Oct 2026',
      daysLeft: 18,
      isCriticalExpiry: false,
      storageTemp: '3.8°C (Cold-Chain)',
      urgency: 'EXPIRING IN 18 DAYS'
    },
    {
      id: 'fefo-3',
      medicineName: 'Azithromycin 250mg Tablets',
      batchNumber: 'AZT-2026-C04',
      currentQty: 90,
      expiryDate: '12 Nov 2026',
      daysLeft: 33,
      isCriticalExpiry: false,
      storageTemp: '22.1°C',
      urgency: 'EXPIRING IN 33 DAYS'
    },
    {
      id: 'fefo-4',
      medicineName: 'Ceftriaxone 1g Injectable',
      batchNumber: 'CEF-2026-F19',
      currentQty: 24,
      expiryDate: '20 Nov 2026',
      daysLeft: 41,
      isCriticalExpiry: false,
      storageTemp: '21.0°C',
      urgency: 'EXPIRING IN 41 DAYS'
    }
  ];

  // Pending Ward/Emergency Requests
  const pendingRequests = [
    {
      id: 'req-1',
      ward: 'Ward 3B (Inpatient)',
      medicine: 'Paracetamol 500mg Tablets',
      quantity: 20,
      priority: 'Urgent',
      requester: 'Sister Mary Kurian',
      status: 'Pending FEFO Dispense'
    },
    {
      id: 'req-2',
      ward: 'Emergency Observation Bay',
      medicine: 'Normal Saline IV (0.9% NaCl)',
      quantity: 50,
      priority: 'Stat',
      requester: 'Dr. Anita Desai',
      status: 'Ready for Dispatch'
    },
    {
      id: 'req-3',
      ward: 'ICU High Dependency',
      medicine: 'Human Insulin 100IU/ml',
      quantity: 10,
      priority: 'Critical',
      requester: 'Sister Priya',
      status: 'Stock-out Risk Flagged'
    }
  ];

  // Stock-out forecast items
  const stockoutForecast = [
    {
      medicine: 'Human Insulin 100IU',
      currentStock: '45 vials',
      daysCover: '1.8 Days',
      predictedStockout: 'In 44 Hours',
      riskLevel: 'CRITICAL',
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      medicine: 'Ceftriaxone 1g',
      currentStock: '24 vials',
      daysCover: '2.5 Days',
      predictedStockout: 'In 3 Days',
      riskLevel: 'HIGH',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      medicine: 'ORS Sachets',
      currentStock: '1,200 units',
      daysCover: '14.2 Days',
      predictedStockout: 'Safe Buffer',
      riskLevel: 'LOW',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      medicine: 'Paracetamol 500mg',
      currentStock: '850 strips',
      daysCover: '8.4 Days',
      predictedStockout: 'Normal Turnover',
      riskLevel: 'NORMAL',
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    }
  ];

  const handleDispenseFefo = (medicine: string, batch: string) => {
    setDispenseSuccess(`Dispensed from priority batch ${batch} (${medicine}). Local inventory updated according to FEFO protocols.`);
    setTimeout(() => setDispenseSuccess(null), 3000);
  };

  const handleTriggerReplenishment = (medicine: string) => {
    setReplenishSuccess(`Replenishment purchase order dispatched to Central Supply Depot for ${medicine}. Priority: High.`);
    setTimeout(() => setReplenishSuccess(null), 3500);
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.medicineName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(inventorySearch.toLowerCase());
    if (selectedCategory === 'ALL') return matchesSearch;
    return matchesSearch && item.category.toUpperCase() === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Pill className="w-5 h-5 text-emerald-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Pharmacy Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Inpatient & Outpatient Dispensary • {currentUser.facilityName || 'Metro Apex Central Pharmacy'}
              </p>
            </div>
          </div>
        </div>

        {/* Pharmacist Actions & Copilot */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-left">
              <span className="font-bold text-[11px] block text-emerald-800">FEFO Copilot:</span>
              <span className="text-[11px] text-emerald-700">"Which medicines should I replenish first?"</span>
            </div>
          </div>

          <button
            onClick={() => handleTriggerReplenishment('Human Insulin 100IU')}
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            + Request Replenishment
          </button>

          <button
            onClick={() => onNavigateToTab?.('pharmacy-ml')}
            className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            title="Open ML Model Studio to train or recalibrate demand models"
          >
            <Brain className="w-3.5 h-3.5 text-purple-200" />
            ML Training Studio
          </button>

          <button
            onClick={() => onNavigateToTab?.('pharmacy-transfers')}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
            Create Transfer
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {dispenseSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{dispenseSuccess}</span>
        </div>
      )}
      {replenishSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{replenishSuccess}</span>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total SKUs Active</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">142</div>
          <p className="text-xs text-slate-500 mt-1">4 Categories • 88 Batches tracked</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock SKUs</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">3</div>
          <p className="text-xs text-amber-600 mt-1">Insulin, Ceftriaxone, Azithromycin</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiring Soon</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">5</div>
          <p className="text-xs text-rose-600 font-bold mt-1">Batches expiring in &lt; 30 days</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Stock-Out Risk</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">1</div>
          <p className="text-xs text-rose-600 mt-1">Human Insulin: 1.8 days cover left</p>
        </div>
      </div>

      {/* MAIN FEATURE 1: FEFO QUEUE (FIRST-EXPIRY-FIRST-OUT) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900">
                FEFO Priority Queue (First-Expiry-First-Out)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                AUTOMATED ROTATION
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Dispense strictly from earliest expiring batches to eliminate pharmaceutical wastage.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Medicine & Batch</th>
                <th className="py-2.5 px-3">Batch Quantity</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3">Days Left</th>
                <th className="py-2.5 px-3">Storage Temp</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fefoQueue.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    item.isCriticalExpiry ? 'bg-rose-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{item.medicineName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                        {item.batchNumber}
                      </span>
                      {item.isCriticalExpiry && (
                        <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300">
                          {item.urgency}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{item.currentQty} units</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{item.expiryDate}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                        item.daysLeft <= 7
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.daysLeft <= 30
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.daysLeft} days
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600">{item.storageTemp}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDispenseFefo(item.medicineName, item.batchNumber)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      Dispense (FEFO Priority)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO PANEL SECTION: PENDING MEDICINE REQUESTS & STOCK-OUT FORECAST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PENDING MEDICINE REQUESTS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Pending Medicine Requests
              </h3>
              <p className="text-xs text-slate-500">Inbound requisitions from wards & emergency stations</p>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              3 Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span>{req.ward}</span>
                    <span className="text-teal-700 font-extrabold">→ {req.quantity} units</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {req.medicine} • Requester: {req.requester}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{req.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      req.priority === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : req.priority === 'Stat'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {req.priority}
                  </span>
                  <button
                    onClick={() => handleDispenseFefo(req.medicine, 'BATCH-REQ')}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                  >
                    Dispense
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STOCK-OUT FORECAST */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                AI Stock-Out Risk Forecast
              </h3>
              <p className="text-xs text-slate-500">Calculated based on 7-day consumption & predicted footfall</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Next 7 Days</span>
              <button
                onClick={() => onNavigateToTab?.('pharmacy-ml')}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1 transition-colors"
                title="Recalibrate or train a new ML forecast model"
              >
                <Brain className="w-3 h-3 text-purple-600" />
                Train / Tune Model →
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {stockoutForecast.map((fc, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{fc.medicine}</div>
                  <div className="text-[11px] text-slate-500">
                    Stock: {fc.currentStock} • Run-out: <strong>{fc.predictedStockout}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-xs text-slate-900">{fc.daysCover}</div>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${fc.color}`}>
                    {fc.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAJOR PANEL: LIVE INVENTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">
              Live Pharmacy Inventory Master
            </h2>
            <p className="text-xs text-slate-500">Dense institutional stock telemetry with real-time audit ledger</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search SKU or category..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-teal-600"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="ANTIBIOTICS">Antibiotics</option>
              <option value="ANALGESICS">Analgesics</option>
              <option value="BIOLOGICS">Biologics</option>
              <option value="IV_FLUIDS">IV Fluids</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Medicine Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Current Stock</th>
                <th className="py-2.5 px-3">Reorder Point</th>
                <th className="py-2.5 px-3">Days Cover</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Replenish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.slice(0, 10).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{inv.medicineName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: {inv.medicineId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {inv.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {inv.currentStock} units
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-medium">
                    {inv.safetyStockLevel} units
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-slate-800">{inv.daysUntilStockout} Days</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                        inv.stockStatus === 'CRITICAL' || inv.stockStatus === 'STOCK_OUT_TODAY'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : inv.stockStatus === 'WARNING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : inv.stockStatus === 'SURPLUS'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {inv.stockStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleTriggerReplenishment(inv.medicineName)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
