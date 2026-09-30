import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowLeftRight,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Truck,
  Building2,
  FileText,
  Pill,
  Stethoscope,
  Factory,
  Warehouse,
  Snowflake,
  HeartPulse,
  QrCode,
  Search,
  Thermometer,
  Clock,
  Navigation,
  Shield,
  Check,
  ChevronRight,
  RotateCw,
  Box,
  UserCheck,
  Radio
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { DEMO_USERS, MEDICINES } from '../../data/mockData';
import { NavItemKey } from '../layout/Sidebar';

interface LandingPageProps {
  onEnterCommandCenter: (tab?: NavItemKey) => void;
  onExploreDigitalTwin: () => void;
  onOpenRoleModal: () => void;
  onSelectRoleUser: (user: User, targetTab?: NavItemKey) => void;
  currentUser: User;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCommandCenter,
  onExploreDigitalTwin,
  onOpenRoleModal,
  onSelectRoleUser,
  currentUser
}) => {
  const [activeWorkflowStage, setActiveWorkflowStage] = useState<number>(0);
  const [selectedBatchQuery, setSelectedBatchQuery] = useState<string>('PAR-2026-B81');
  const [copiedBatch, setCopiedBatch] = useState<boolean>(false);

  // Workflow 5-Stage Definition
  const workflowStages = [
    {
      id: 0,
      step: '01',
      title: 'Manufacturers & Labs',
      subtitle: 'Synthesis & Quality Verification',
      icon: Factory,
      accent: 'blue',
      colorBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'text-blue-700 bg-blue-100',
      dotColor: 'bg-blue-500',
      description: 'Pharmaceutical production, GS1/QR digital batch serialization, lab purity assays, and automated regulatory release certification.',
      telemetry: {
        activeBatches: '1,420 Batches',
        dailyOutput: '3.4M Doses',
        qualityAssay: '99.98% Purity',
        origin: 'Bharat Pharma & Serum Labs'
      },
      sampleLogs: [
        'Batch PAR-2026-B81: QA Spectrometry assay passed (99.96%)',
        'GS1 DataMatrix encryption generated for 50,000 vials',
        'Cold-chain baseline calibrated at +4.0°C'
      ]
    },
    {
      id: 1,
      step: '02',
      title: 'Central Warehouses',
      subtitle: 'Cold-Chain Storage & Buffers',
      icon: Warehouse,
      accent: 'teal',
      colorBg: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeColor: 'text-teal-700 bg-teal-100',
      dotColor: 'bg-teal-500',
      description: 'Regional temperature-regulated automated storage facilities, 2°C–8°C continuous IoT logging, and strategic reserve allocation.',
      telemetry: {
        storageVolume: '85,000 Pallets',
        tempCompliance: '100% in 2°C–8°C',
        reserveSafety: '45 Days Buffer',
        facility: 'State Medical Supply Depot #4'
      },
      sampleLogs: [
        'Continuous IoT Beacon: Depot A-4 ambient temperature 4.1°C',
        'Automated FIFO inventory rotation triggered for Insulin batches',
        'Barcode scan logged for pallet #PL-9821'
      ]
    },
    {
      id: 2,
      step: '03',
      title: 'Logistics & Transit',
      subtitle: 'AI Route & Dispatch Routing',
      icon: Truck,
      accent: 'indigo',
      colorBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeColor: 'text-indigo-700 bg-indigo-100',
      dotColor: 'bg-indigo-500',
      description: 'Refrigerated fleet transport, Haversine ground-distance optimization, live geo-tracking, and proactive weather rerouting.',
      telemetry: {
        activeFleet: '64 GPS Vehicles',
        avgTransitETA: '2h 15m',
        tempAlarms: '0 Breaches',
        carrier: 'Express Health Logistics'
      },
      sampleLogs: [
        'Fleet TRK-108 dispatched from Central Depot to Metro Apex',
        'Weather engine flagged flash flood on Route 7; rerouting via Corridor B',
        'Active in-transit temp: 3.8°C (Ideal cold-chain)'
      ]
    },
    {
      id: 3,
      step: '04',
      title: 'Hospitals & Care Centers',
      subtitle: 'Demand ML & Stock-Out Defense',
      icon: Building2,
      accent: 'rose',
      colorBg: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeColor: 'text-rose-700 bg-rose-100',
      dotColor: 'bg-rose-500',
      description: 'Direct ingestion into ICU and ward pharmacies, multi-variate demand forecasting, and automated inter-hospital redistribution.',
      telemetry: {
        monitoredHospitals: '22 Facilities',
        stockOutDefended: '18 Instances Averted',
        forecastAccuracy: '94.2% R²',
        hub: 'Metro Apex Multi-Specialty'
      },
      sampleLogs: [
        'Predicted surge: Dengue spike (+32.8% Paracetamol & IV fluids)',
        'Redistribution matched: 400 Insulin vials incoming from East Valley Regional',
        'Ward pharmacy stock updated at ICU Bay 2'
      ]
    },
    {
      id: 4,
      step: '05',
      title: 'Pharmacies & Patients',
      subtitle: 'Verified Point-of-Care Dispensing',
      icon: HeartPulse,
      accent: 'amber',
      colorBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'text-amber-700 bg-amber-100',
      dotColor: 'bg-amber-500',
      description: 'Point-of-care patient dosage validation, counterfeit detection via QR scanning, and immediate consumption feedback loop.',
      telemetry: {
        dispensedToday: '14,890 Doses',
        counterfeitsBlocked: '0 Doses',
        patientSatisfaction: '99.4%',
        dispensary: 'Community Health Center #12'
      },
      sampleLogs: [
        'QR verification scanned by Pharmacist: Batch PAR-2026-B81 Authenticated',
        'Patient prescription logged with dosage schedule',
        'Local stock decremented: auto-restock trigger sent to Central Hub'
      ]
    }
  ];

  // Batch samples for demo tracking
  const sampleBatches = [
    {
      batchNumber: 'PAR-2026-B81',
      medicineName: 'Paracetamol 500mg Tablets',
      manufacturer: 'Bharat Pharma Labs, Unit 4',
      mfgDate: '12 Jan 2026',
      expDate: '11 Jan 2028',
      daysUntilExpiry: 651,
      currentLocation: 'Metro Apex Hospital - Central Pharmacy',
      status: 'GENUINE & VERIFIED',
      coldChainReq: 'ROOM_TEMP (15°C - 25°C)',
      currentTemp: '21.4°C',
      hash: '0x8f4c...91b2c3d4e5f6',
      journeySteps: [
        { label: 'Manufactured & Certified', time: '12 Jan 2026, 09:30', location: 'Bharat Pharma Labs', status: 'done' },
        { label: 'Ingested into Central Warehouse', time: '15 Jan 2026, 14:10', location: 'State Depot #4', status: 'done' },
        { label: 'Dispatched via Temperature Fleet', time: '28 Jan 2026, 06:45', location: 'Route 9 Fleet TRK-108', status: 'done' },
        { label: 'Received & Verified at Hospital', time: '28 Jan 2026, 09:12', location: 'Metro Apex Hospital', status: 'done' },
        { label: 'Active in Ward Dispensing', time: 'Live Now', location: 'Inpatient Dispensary', status: 'active' }
      ]
    },
    {
      batchNumber: 'INS-2026-K12',
      medicineName: 'Human Insulin 100IU/ml Vial',
      manufacturer: 'National Serum & Biologics Ltd',
      mfgDate: '02 Feb 2026',
      expDate: '01 Feb 2027',
      daysUntilExpiry: 307,
      currentLocation: 'Cold-Chain Transit Carrier #TRK-204',
      status: 'COLD-CHAIN IN TRANSIT (3.8°C)',
      coldChainReq: 'COLD_CHAIN (2°C - 8°C)',
      currentTemp: '3.8°C',
      hash: '0x3a9d...67f1a8b9c0d1',
      journeySteps: [
        { label: 'Biologics Cold-Chain Formulation', time: '02 Feb 2026, 11:00', location: 'National Biologics Lab', status: 'done' },
        { label: 'Cryo-Vault Storage Monitored', time: '04 Feb 2026, 08:30', location: 'Hub Vault B (3.4°C)', status: 'done' },
        { label: 'In-Transit to Shortage Hospital', time: 'Live Now', location: 'Refrigerated Van #TRK-204', status: 'active' },
        { label: 'Destination Check-In Pending', time: 'Est. 45 mins', location: 'Metro Apex Hospital', status: 'pending' }
      ]
    },
    {
      batchNumber: 'AMX-2026-X99',
      medicineName: 'Amoxicillin 500mg Capsules',
      manufacturer: 'Apex Lifesciences Corp',
      mfgDate: '10 Dec 2025',
      expDate: '09 Dec 2027',
      daysUntilExpiry: 618,
      currentLocation: 'District Medical Stores, Bay 6',
      status: 'GENUINE & VERIFIED',
      coldChainReq: 'ROOM_TEMP (< 25°C)',
      currentTemp: '19.8°C',
      hash: '0x1c4e...78a9b0c1d2e3',
      journeySteps: [
        { label: 'GMP Inspection & Sealing', time: '10 Dec 2025, 16:00', location: 'Apex Lifesciences', status: 'done' },
        { label: 'Regional Depot Buffer Stock', time: '14 Dec 2025, 10:20', location: 'District Medical Store', status: 'done' },
        { label: 'Allocated for Seasonal Surge', time: 'Live Now', location: 'Regional Safety Reserve', status: 'active' }
      ]
    }
  ];

  const currentBatchData =
    sampleBatches.find((b) => b.batchNumber === selectedBatchQuery) || sampleBatches[0];

  const handleCopyBatch = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  // 5 Role Cards with specific user pairings
  const roleCards = [
    {
      id: 'manufacturer',
      title: 'Pharmaceutical Manufacturer',
      category: 'Production & Serialization',
      personaName: 'Suresh Singhania',
      personaOrg: 'Bharat Pharma Labs & Serum Facilities',
      accentColor: 'border-sky-200 bg-sky-50/60 hover:bg-sky-50/90 text-sky-950',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      buttonBg: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20',
      icon: Factory,
      features: [
        'Batch registration & QR digital serialization',
        'Raw material availability & API supplier monitoring',
        'FDA/WHO regulatory release manifests',
        'Automated dispatch scheduling to Central Depots'
      ],
      targetUser: DEMO_USERS.find((u) => u.role === 'MANUFACTURER') || DEMO_USERS[0],
      targetTab: 'suppliers' as NavItemKey
    },
    {
      id: 'distributor',
      title: 'Distributor & Cold-Chain Hub',
      category: 'Storage & Fleet Logistics',
      personaName: 'Elena Rostova',
      personaOrg: 'Central Medical Stores & Logistics Hub',
      accentColor: 'border-teal-200 bg-teal-50/60 hover:bg-teal-50/90 text-teal-950',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      buttonBg: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20',
      icon: Warehouse,
      features: [
        'Multi-district centralized warehouse buffers',
        'Continuous 2°C–8°C cold-chain IoT telemetry',
        'Refrigerated fleet route optimization & GPS tracking',
        'Automated stock-out emergency resupply dispatch'
      ],
      targetUser: DEMO_USERS.find((u) => u.role === 'DISTRIBUTOR') || DEMO_USERS[0],
      targetTab: 'redistribution' as NavItemKey
    },
    {
      id: 'hospital_admin',
      title: 'Hospital Administrator',
      category: 'Clinical Care & Stock-Out Defense',
      personaName: 'Vikram Mehta',
      personaOrg: 'Metro Apex Multi-Specialty Hospital',
      accentColor: 'border-rose-200 bg-rose-50/60 hover:bg-rose-50/90 text-rose-950',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      buttonBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20',
      icon: Building2,
      features: [
        'Real-time ICU, OT, and ward pharmacy inventory',
        'Visual predictive stock-out countdowns (e.g. 2.0 days left)',
        '1-click inter-hospital surplus-to-deficit approvals',
        'Near-expiry medicine alert & priority rotation'
      ],
      targetUser: DEMO_USERS.find((u) => u.role === 'HOSPITAL_ADMIN') || DEMO_USERS[2],
      targetTab: 'hospitals' as NavItemKey
    },
    {
      id: 'pharmacy_staff',
      title: 'Pharmacy & Primary Health Staff',
      category: 'Point-of-Care & Dispensing',
      personaName: 'Pooja Nair',
      personaOrg: 'Senior Pharmacy Inventory Officer (Apex Health)',
      accentColor: 'border-amber-200 bg-amber-50/60 hover:bg-amber-50/90 text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      buttonBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
      icon: Pill,
      features: [
        'Barcode/QR scan for instant patient dispensing',
        'Real-time consumption telemetry feedback loop',
        'Alternative generic medicine recommendations',
        'Automated local reorder requisitions'
      ],
      targetUser: DEMO_USERS.find((u) => u.role === 'HOSPITAL_STAFF') || DEMO_USERS[3],
      targetTab: 'health-data' as NavItemKey
    },
    {
      id: 'super_admin',
      title: 'State & District Health Officer',
      category: 'Command Center & Resilience',
      personaName: 'Dr. Rajesh Vardhan',
      personaOrg: 'State Health Command & District Directorate',
      accentColor: 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50/90 text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
      icon: ShieldCheck,
      features: [
        'Regional multi-district health risk intelligence map',
        'Epidemic surge AI forecasting (Monsoon, Dengue, Flu)',
        'Supply Chain Digital Twin disaster stress-testing',
        'Government compliance & formal PDF audit generation'
      ],
      targetUser: DEMO_USERS.find((u) => u.role === 'SUPER_ADMIN') || DEMO_USERS[0],
      targetTab: 'dashboard' as NavItemKey
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Logo with Stylized Teal Cross/Heart inside Node Emblem matching the requested image */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-600/20 text-white font-bold">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                <path d="M12 7v6M9 10h6" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">MediChain</span>
                <span className="text-[11px] font-black px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Smart Healthcare Supply Chain
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-teal-600 transition-colors">
              Overview
            </a>
            <a href="#roles" className="hover:text-teal-600 transition-colors">
              Role Portals
            </a>
            <a href="#workflow" className="hover:text-teal-600 transition-colors">
              Supply Chain Flow
            </a>
            <a href="#tracking" className="hover:text-teal-600 transition-colors">
              Track Medicine
            </a>
            <a href="#features" className="hover:text-teal-600 transition-colors">
              Intelligence Features
            </a>
            <button
              onClick={() => onEnterCommandCenter('dashboard')}
              className="text-teal-700 font-bold hover:text-teal-800 transition-colors flex items-center gap-1"
            >
              Command Center
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRoleModal}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Role:</span>
              <strong className="text-teal-700">{currentUser.name.split(' ')[0]}</strong>
            </button>

            <button
              onClick={() => onEnterCommandCenter('dashboard')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white"
      >
        {/* Soft Ambient Radial Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-100/40 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-0 w-[450px] h-[350px] bg-cyan-100/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Smart Healthcare Supply Chain & Resilience Network
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Transparent, Resilient & Predictive <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
              Healthcare Supply Chain Network
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Eliminate critical medicine stock-outs, forecast epidemic surges, maintain unbroken 2°C–8°C cold-chain verification, and automatically redistribute surplus supplies across hospitals, distributors, and pharmaceutical manufacturers.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#roles"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Choose Your Role</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            <button
              onClick={() => onEnterCommandCenter('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-600/25 flex items-center gap-2"
            >
              <span>Enter Live Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#tracking"
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-2xs"
            >
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>Verify Medicine Batch</span>
            </a>
          </div>

          {/* Live Telemetry / Network Performance Strip */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50 grid grid-cols-2 md:grid-cols-5 gap-4 text-left">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  On-Time Delivery
                </span>
                <div className="text-2xl font-black text-slate-900">99.8%</div>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> +1.4% this quarter
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Connected Facilities
                </span>
                <div className="text-2xl font-black text-slate-900">22 Hubs</div>
                <p className="text-[11px] text-slate-500">10 Healthcare Districts</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Critical Medicines
                </span>
                <div className="text-2xl font-black text-slate-900">32 Tracked</div>
                <p className="text-[11px] text-teal-600 font-medium">WHO Essential List</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Stock-Out Defense
                </span>
                <div className="text-2xl font-black text-emerald-600">0 Critical</div>
                <p className="text-[11px] text-slate-500">All Deficits Mitigated</p>
              </div>

              <div className="space-y-1 col-span-2 md:col-span-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cold-Chain Integrity
                </span>
                <div className="text-2xl font-black text-cyan-600">100%</div>
                <p className="text-[11px] text-slate-500">Zero Temp Excursions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHOOSE YOUR ROLE / ROLE-BASED PORTALS (Matching the visual cards in image) */}
      <section id="roles" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Role-Based Medical Operations
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Select Your Stakeholder Portal
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Each actor in the health supply chain gains a customized workspace tailored to their operational responsibilities and approval permissions.
            </p>
          </div>

          {/* 5 Distinct Role Cards with Soft Pastel Styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roleCards.map((card) => {
              const Icon = card.icon;
              const isCurrentActive = currentUser.id === card.targetUser.id;

              return (
                <div
                  key={card.id}
                  className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md ${card.accentColor}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        <Icon className="w-6 h-6 text-slate-800" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                        {card.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900">{card.title}</h3>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        Active Persona: <strong>{card.personaName}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">{card.personaOrg}</p>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-200/60">
                      {card.features.map((feat, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-4">
                    <button
                      onClick={() => onSelectRoleUser(card.targetUser, card.targetTab)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${card.buttonBg}`}
                    >
                      <span>Enter as {card.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {isCurrentActive && (
                      <p className="text-[10px] text-center font-bold text-teal-700 mt-1.5">
                        ● Currently Active Persona
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: END-TO-END HEALTHCARE SUPPLY CHAIN WORKFLOW (5-Stage Visual Interactive Flow) */}
      <section id="workflow" className="py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Autonomous Closed-Loop Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              End-to-End Healthcare Supply Chain Flow
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              How pharmaceuticals journey securely from initial batch synthesis to patient point-of-care with verifiable trust and AI resilience.
            </p>
          </div>

          {/* 5-Step Horizontal Flow Indicator with Interactive Stage Selector */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {workflowStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = activeWorkflowStage === idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveWorkflowStage(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/70 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      STAGE {stage.step}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-teal-500 animate-ping' : 'bg-slate-300'}`} />
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900">{stage.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{stage.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Telemetry & Live Inspector Box */}
          {(() => {
            const currentStage = workflowStages[activeWorkflowStage];
            const Icon = currentStage.icon;

            return (
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-slate-50/90 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-600">
                          STAGE {currentStage.step} INSPECTION
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          LIVE TELEMETRY ACTIVE
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">{currentStage.title}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => onEnterCommandCenter('dashboard')}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <span>View Telemetry in Command Center</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentStage.description}
                </p>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(currentStage.telemetry).map(([key, val]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="text-base font-extrabold text-slate-900 mt-1">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Sample Verification Audit Stream */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-teal-600" /> Recent Cryptographic Ledger Logs
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                    {currentStage.sampleLogs.map((log, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2">
                        <span className="text-teal-600 font-bold">›</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SECTION 4: LIVE MEDICINE BATCH TRACKER & VERIFICATION SIMULATOR */}
      <section id="tracking" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Instant Batch Provenance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verify Medicine Authenticity & Cold-Chain
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Inspect any medicine batch in the network to confirm genuine pharmaceutical provenance, cold-chain temperature history, and live custodian.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-8">
            {/* Search Input & Demo Quick Pickers */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Batch / GS1 Serialization Code:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedBatchQuery}
                    onChange={(e) => setSelectedBatchQuery(e.target.value.toUpperCase())}
                    placeholder="e.g. PAR-2026-B81 or INS-2026-K12"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] text-slate-500 font-medium">Quick Pick:</span>
                  {sampleBatches.map((b) => (
                    <button
                      key={b.batchNumber}
                      onClick={() => setSelectedBatchQuery(b.batchNumber)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        selectedBatchQuery === b.batchNumber
                          ? 'bg-teal-50 border-teal-500 text-teal-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {b.batchNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Batch Provenance Inspection Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900">
                      {currentBatchData.batchNumber}
                    </span>
                    <button
                      onClick={() => handleCopyBatch(currentBatchData.batchNumber)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                    >
                      {copiedBatch ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-1">
                    {currentBatchData.medicineName}
                  </h4>
                  <p className="text-xs text-slate-500">{currentBatchData.manufacturer}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{currentBatchData.status}</span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Mfg & Exp Dates</span>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {currentBatchData.mfgDate} → {currentBatchData.expDate}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {currentBatchData.daysUntilExpiry} days runway
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Cold-Chain Req</span>
                  <div className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{currentBatchData.currentTemp}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{currentBatchData.coldChainReq}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Custodian</span>
                  <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {currentBatchData.currentLocation}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active In-Network</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ledger Hash</span>
                  <div className="text-xs font-mono font-bold text-slate-700 mt-1 truncate">
                    {currentBatchData.hash}
                  </div>
                  <span className="text-[10px] text-teal-600 font-semibold">Cryptographically Sealed</span>
                </div>
              </div>

              {/* Timeline Journey */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Verifiable Supply Chain Journey:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {currentBatchData.journeySteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-3 rounded-xl border text-left ${
                        step.status === 'done'
                          ? 'bg-white border-slate-200'
                          : step.status === 'active'
                          ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-400'
                          : 'bg-slate-100 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          STEP {sIdx + 1}
                        </span>
                        {step.status === 'done' && <Check className="w-3 h-3 text-emerald-600" />}
                        {step.status === 'active' && <Radio className="w-3 h-3 text-teal-600 animate-pulse" />}
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-900 leading-snug">{step.label}</h5>
                      <p className="text-[10px] text-slate-500 mt-1">{step.location}</p>
                      <span className="text-[9px] font-mono text-slate-400 block mt-1">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ADVANCED AI RESILIENCE FEATURES PREVIEW */}
      <section id="features" className="py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Next-Gen Medical Logistics AI
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Intelligence Built for Healthcare Emergencies
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Engineered to prevent medicine stock-outs, forecast disease-driven demand spikes, and stress-test logistics before catastrophic disruptions strike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                AI Demand Forecasting (XGBoost & Prophet)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingests historical consumption, monsoon rain metrics, and epidemiologic disease counts to project 7, 30, and 90-day medicine consumption spikes before outbreaks overwhelm hospital wards.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                <span className="text-teal-700 font-bold">Rainfall &gt; 180mm</span> → +32.8% dengue surge forecast
              </div>
              <button
                onClick={() => onEnterCommandCenter('forecast')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Explore Forecasting Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Autonomous Redistribution Matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes real-time Haversine distance, travel times, and vehicle logistics costs to match surplus hospital inventory with deficit facilities, averting stockouts in under 2 hours.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                <span className="text-rose-700 font-bold">East Valley (Surplus)</span> ➔ Metro Apex (Shortage)
              </div>
              <button
                onClick={() => onEnterCommandCenter('redistribution')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View Redistribution Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Supply Chain Digital Twin Simulator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stress-test the healthcare system against Category 4 monsoons, arterial bridge failures, or supplier bankruptcies. Compare "Before vs After" network resilience metrics in seconds.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                <span className="text-cyan-700 font-bold">Disruption Stress:</span> Floods, Cyclones & Roadblocks
              </div>
              <button
                onClick={onExploreDigitalTwin}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Launch Digital Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: ENTERPRISE CALL TO ACTION BANNER */}
      <section className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Protect Your Healthcare Supply Chain?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join medical superintendents, state health directors, and pharmaceutical logistics chiefs who rely on MediChain AI for zero-stockout clinical operations.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterCommandCenter('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-teal-500/30 flex items-center gap-2"
            >
              <span>Launch Enterprise Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenRoleModal}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Select Operational Role</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                <path d="M12 7v6M9 10h6" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-slate-800">MediChain AI</span>
              <p className="text-[11px] text-slate-500">Smart Healthcare & Medical Supply Chain Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <button
              onClick={() => onEnterCommandCenter('dashboard')}
              className="hover:text-teal-600 transition-colors"
            >
              Command Center
            </button>
            <button
              onClick={() => onEnterCommandCenter('forecast')}
              className="hover:text-teal-600 transition-colors"
            >
              AI Forecast
            </button>
            <button
              onClick={() => onEnterCommandCenter('redistribution')}
              className="hover:text-teal-600 transition-colors"
            >
              Redistribution
            </button>
            <button
              onClick={onExploreDigitalTwin}
              className="hover:text-teal-600 transition-colors"
            >
              Digital Twin
            </button>
            <button onClick={onOpenRoleModal} className="hover:text-teal-600 transition-colors">
              Switch Persona
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 MediChain AI Platform. WHO Essential Medicines Standards Compliant.</p>
          <p className="font-mono">Telemetry Status: All 22 Nodes Connected • 100% Cold-Chain Integrity</p>
        </div>
      </footer>
    </div>
  );
};
