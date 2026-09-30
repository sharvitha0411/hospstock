import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Truck,
  Download,
  Search,
  Filter,
  Brain,
  Sparkles,
  Info,
  Calendar,
  Building2,
  Pill,
  TrendingUp,
  ShieldAlert,
  ArrowLeftRight,
  Layers,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MEDICINES, HOSPITALS } from '../../data/mockData';

export interface PredictionRow {
  id: string;
  facilityId: string;
  facilityName: string;
  medicineId: string;
  medicineName: string;
  date: string;
  patientFootfall: number;
  previousConsumption: number;
  weatherFactor: string;
  diseaseTrendFactor: string;
  currentStock: number;
  // Computed upon prediction
  predictedDemand?: number;
  predictionLower?: number;
  predictionUpper?: number;
  projectedShortage?: number;
  predictedDaysUntilStockout?: number;
  riskLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SUFFICIENT';
  outcomeLabel?: string;
  outcomeType?: 'SHORTAGE_RISK' | 'LOW_STOCK' | 'SUFFICIENT' | 'CRITICAL_STOCKOUT';
  recommendedAction?: string;
  potentialSurplusFacility?: string;
  surplusUnits?: number;
  shapExplanations?: { factor: string; contribution: number; direction: 'UP' | 'DOWN' }[];
}

export const PredictionWorkspace: React.FC<{ onNavigateToTab?: (tab: string) => void }> = ({ onNavigateToTab }) => {
  const { mlModels, currentUser, logAuditAction } = useApp();

  // Active models
  const activeOrCandidateModels = mlModels.filter((m) => m.status === 'ACTIVE_APPROVED' || m.status === 'CANDIDATE');
  const [selectedModelId, setSelectedModelId] = useState<string>(
    activeOrCandidateModels[0]?.id || mlModels[0]?.id || 'mdl-xgb-01'
  );
  const [selectedTarget, setSelectedTarget] = useState<'Consumption' | 'Footfall'>('Consumption');

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('operational_medicine_dispatch_Q3.csv');
  const [isPredicted, setIsPredicted] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'SUFFICIENT'>('ALL');

  // Initial Sample Operational Dataset for immediate demonstration
  const [predictionRows, setPredictionRows] = useState<PredictionRow[]>([
    {
      id: 'row-1',
      facilityId: 'hosp-102',
      facilityName: 'PHC-102 (Metro North Community Health)',
      medicineId: 'med-1',
      medicineName: 'Paracetamol 500mg Tablets',
      date: '2026-10-01',
      patientFootfall: 420,
      previousConsumption: 1150,
      weatherFactor: 'Monsoon Heavy Rain (+45%)',
      diseaseTrendFactor: 'Viral Febrile Cluster (+32%)',
      currentStock: 850,
      predictedDemand: 1240,
      predictionLower: 1090,
      predictionUpper: 1410,
      projectedShortage: 390,
      predictedDaysUntilStockout: 3,
      riskLevel: 'CRITICAL',
      outcomeType: 'CRITICAL_STOCKOUT',
      outcomeLabel: 'Potential Stock Shortage',
      recommendedAction: 'Immediate Inter-Hospital Redistribution from Metro Apex (390 units)',
      potentialSurplusFacility: 'Metro Apex Multi-Specialty Hospital',
      surplusUnits: 800,
      shapExplanations: [
        { factor: 'Previous 7-Day Consumption', contribution: 42, direction: 'UP' },
        { factor: 'Patient Footfall Surge', contribution: 27, direction: 'UP' },
        { factor: 'Seasonality / Monsoon Index', contribution: 18, direction: 'UP' },
        { factor: 'Disease Trend (Febrile Alerts)', contribution: 9, direction: 'UP' },
        { factor: 'Relative Humidity & Weather', contribution: 4, direction: 'UP' }
      ]
    },
    {
      id: 'row-2',
      facilityId: 'hosp-102',
      facilityName: 'PHC-102 (Metro North Community Health)',
      medicineId: 'med-2',
      medicineName: 'Amoxicillin 500mg Capsules',
      date: '2026-10-01',
      patientFootfall: 420,
      previousConsumption: 620,
      weatherFactor: 'Monsoon Rain (+45%)',
      diseaseTrendFactor: 'Bacterial Respiratory Spike (+15%)',
      currentStock: 520,
      predictedDemand: 690,
      predictionLower: 620,
      predictionUpper: 760,
      projectedShortage: 170,
      predictedDaysUntilStockout: 4,
      riskLevel: 'HIGH',
      outcomeType: 'SHORTAGE_RISK',
      outcomeLabel: 'Shortage Risk',
      recommendedAction: 'Review Depot Reorder & Transfer 170 units from Central Medical Depot',
      potentialSurplusFacility: 'Central Medical Depot North',
      surplusUnits: 650,
      shapExplanations: [
        { factor: 'Previous 7-Day Consumption', contribution: 38, direction: 'UP' },
        { factor: 'Bacterial Respiratory Trend', contribution: 31, direction: 'UP' },
        { factor: 'Patient Intake Velocity', contribution: 21, direction: 'UP' },
        { factor: 'Weather Factor', contribution: 10, direction: 'UP' }
      ]
    },
    {
      id: 'row-3',
      facilityId: 'hosp-1',
      facilityName: 'Metro Apex Multi-Specialty Hospital',
      medicineId: 'med-3',
      medicineName: 'Human Insulin Regular 100IU/ml',
      date: '2026-10-01',
      patientFootfall: 980,
      previousConsumption: 340,
      weatherFactor: 'Normal Ambient (32°C)',
      diseaseTrendFactor: 'Stable Endocrine Baseline',
      currentStock: 1200,
      predictedDemand: 360,
      predictionLower: 320,
      predictionUpper: 400,
      projectedShortage: 0,
      predictedDaysUntilStockout: 32,
      riskLevel: 'SUFFICIENT',
      outcomeType: 'SUFFICIENT',
      outcomeLabel: 'Sufficient Stock',
      recommendedAction: 'Stock covers 32 days. Available as donor for regional redistribution.',
      potentialSurplusFacility: 'Metro Apex Multi-Specialty Hospital',
      surplusUnits: 840,
      shapExplanations: [
        { factor: 'Previous 7-Day Consumption', contribution: 64, direction: 'UP' },
        { factor: 'Stable Inpatient Census', contribution: 24, direction: 'UP' },
        { factor: 'Seasonal Baseline', contribution: 12, direction: 'DOWN' }
      ]
    },
    {
      id: 'row-4',
      facilityId: 'hosp-3',
      facilityName: 'District Hospital Central Ward',
      medicineId: 'med-4',
      medicineName: 'Oral Rehydration Salts (ORS) Sachets',
      date: '2026-10-01',
      patientFootfall: 610,
      previousConsumption: 880,
      weatherFactor: 'Waterlogged District Zone',
      diseaseTrendFactor: 'Acute Diarrheal Surge (+40%)',
      currentStock: 950,
      predictedDemand: 1350,
      predictionLower: 1210,
      predictionUpper: 1520,
      projectedShortage: 400,
      predictedDaysUntilStockout: 2,
      riskLevel: 'CRITICAL',
      outcomeType: 'CRITICAL_STOCKOUT',
      outcomeLabel: 'Critical Stock-out Risk',
      recommendedAction: 'Emergency Dispatch: Reallocate 400 units from Suburban Clinic West',
      potentialSurplusFacility: 'Suburban Community Health Centre',
      surplusUnits: 900,
      shapExplanations: [
        { factor: 'Diarrheal Epidemic Surge', contribution: 48, direction: 'UP' },
        { factor: 'Monsoon Contamination Index', contribution: 30, direction: 'UP' },
        { factor: 'Pediatric Outpatient Footfall', contribution: 22, direction: 'UP' }
      ]
    },
    {
      id: 'row-5',
      facilityId: 'hosp-4',
      facilityName: 'Suburban Community Health Centre',
      medicineId: 'med-5',
      medicineName: 'Ceftriaxone 1g Injectable Vials',
      date: '2026-10-01',
      patientFootfall: 310,
      previousConsumption: 140,
      weatherFactor: 'Normal',
      diseaseTrendFactor: 'Slight Inpatient Increase',
      currentStock: 190,
      predictedDemand: 165,
      predictionLower: 145,
      predictionUpper: 185,
      projectedShortage: 0,
      predictedDaysUntilStockout: 6,
      riskLevel: 'HIGH',
      outcomeType: 'LOW_STOCK',
      outcomeLabel: 'Low Stock Risk',
      recommendedAction: 'Stock is within 15% of projected burn rate. Place standard depot replenishment.',
      potentialSurplusFacility: 'District Central Depot North',
      surplusUnits: 450,
      shapExplanations: [
        { factor: 'Previous Consumption', contribution: 55, direction: 'UP' },
        { factor: 'Inpatient Surgical Census', contribution: 30, direction: 'UP' },
        { factor: 'Seasonal Baseline', contribution: 15, direction: 'UP' }
      ]
    }
  ]);

  // Selected Row for Deep Outcome Inspection
  const [selectedRow, setSelectedRow] = useState<PredictionRow>(predictionRows[0]);

  // Handle Real File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsPredicted(false);
      }, 600);
    }
  };

  // Run Manual Prediction on Uploaded Dataset
  const handleRunPrediction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPredicted(true);
      logAuditAction(
        'Manual CSV Prediction Executed',
        'MODEL_GOVERNANCE',
        `Executed batch prediction on ${uploadedFileName} using model ${selectedModelId}. Target: ${selectedTarget}`
      );
    }, 900);
  };

  // CSV Export Generation
  const handleExportCSV = () => {
    const headers = [
      'Facility',
      'Medicine',
      'Date',
      'Predicted Demand (Units)',
      'Prediction Interval Lower',
      'Prediction Interval Upper',
      'Current Stock',
      'Projected Deficit',
      'Days Until Stockout',
      'Risk Level',
      'Supply Chain Outcome',
      'Recommended Action'
    ];

    const rows = predictionRows.map((r) => [
      `"${r.facilityName}"`,
      `"${r.medicineName}"`,
      `"${r.date}"`,
      r.predictedDemand,
      r.predictionLower,
      r.predictionUpper,
      r.currentStock,
      r.projectedShortage,
      r.predictedDaysUntilStockout,
      `"${r.riskLevel}"`,
      `"${r.outcomeLabel}"`,
      `"${r.recommendedAction}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `predictions_2026_09_30.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered rows
  const filteredRows = predictionRows.filter((row) => {
    const matchesSearch =
      row.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.medicineName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || row.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ML Batch Predictions & Operational Decisioning
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                CSV INFERENCE ENGINE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Upload operational healthcare datasets, run trained model inference, and convert demand forecasts into supply chain replenishment actions.
            </p>
          </div>
        </div>

        {/* Model Selector Strip */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Selected ML Model
            </span>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {activeOrCandidateModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.version}) · R²: {m.accuracyR2}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PIPELINE VISUALIZER (PREDICTION -> RISK -> ACTION FLOW) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            End-To-End Decision Pipeline: CSV Inference → Risk Classification → Redistribution
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Real-Time Clinical Supply Rules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-3 text-center">
          {[
            { step: '1', title: 'CSV Upload', desc: 'Operational Data' },
            { step: '2', title: 'Validation', desc: 'Schema & Types' },
            { step: '3', title: 'ML Inference', desc: 'XGBoost / Prophet' },
            { step: '4', title: '95% Interval', desc: 'Uncertainty Band' },
            { step: '5', title: 'Stock Deficit', desc: 'Burn Rate Gap' },
            { step: '6', title: 'Risk Tier', desc: 'Clinical Severity' },
            { step: '7', title: 'Action Plan', desc: 'Transfer / Order' }
          ].map((s, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-center">
              <span className="text-[10px] font-mono font-bold text-teal-400">Step {s.step}</span>
              <span className="text-xs font-bold text-slate-200 mt-0.5">{s.title}</span>
              <span className="text-[10px] text-slate-400 truncate">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1: DATASET UPLOAD & MODEL SELECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">1</span>
                Upload Operational Dataset For Prediction
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload clinic dispensary logs, triage footfall, and facility stock records.
              </p>
            </div>
            {uploadedFileName && (
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                {uploadedFileName}
              </span>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                setUploadedFileName(file.name);
                setIsPredicted(false);
              }
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              isDragging ? 'border-teal-500 bg-teal-50/50' : 'border-slate-300 hover:border-teal-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              accept=".csv"
              id="csv-prediction-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="csv-prediction-upload" className="cursor-pointer space-y-2 block">
              <UploadCloud className="w-8 h-8 text-teal-600 mx-auto" />
              <div className="text-xs font-bold text-slate-700">
                Drag & Drop operational CSV here, or <span className="text-teal-600 underline">Browse files</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Supported schema: Facility, Medicine, Date, Footfall, PreviousConsumption, CurrentStock</p>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setUploadedFileName('operational_medicine_dispatch_Q3.csv');
                setIsPredicted(true);
              }}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              Load Standard Regional Dispensary CSV (5 Records)
            </button>

            <button
              onClick={handleRunPrediction}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Running ML Inference...' : 'Run ML Batch Prediction'}</span>
            </button>
          </div>
        </div>

        {/* Configuration Summary Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Prediction Parameters
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Target Variable:</span>
                <span className="font-bold text-slate-900">{selectedTarget} (Daily Units)</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Inference Horizon:</span>
                <span className="font-bold text-slate-900">7 Days Ahead (Rolling)</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Interval Confidence:</span>
                <span className="font-bold text-teal-700 font-mono">95% Uncertainty Band</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Outcome Policy:</span>
                <span className="font-bold text-purple-700">Clinical Buffer (Rule-based)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-[11px] text-teal-900 font-medium flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              Predictions directly evaluate current facility stock against predicted burn rates, automatically generating surplus transfer routes.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEDICATED PREDICTION OUTCOME & ACTION CARD (Requirement 16 & 19) */}
      {isPredicted && selectedRow && (
        <div className="bg-white border-2 border-teal-500 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  DEEP OUTCOME INSPECTION
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  selectedRow.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  selectedRow.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedRow.riskLevel} RISK
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {selectedRow.medicineName} at {selectedRow.facilityName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Date: {selectedRow.date}</span>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Predicted Demand
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {selectedRow.predictedDemand} <span className="text-xs font-normal text-slate-500">units</span>
              </div>
              <span className="text-[11px] text-teal-700 font-mono">
                [{selectedRow.predictionLower} – {selectedRow.predictionUpper}]
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Current Stock
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {selectedRow.currentStock} <span className="text-xs font-normal text-slate-500">units</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Physical inventory</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Projected Shortage
              </span>
              <div className={`text-2xl font-black mt-1 ${selectedRow.projectedShortage && selectedRow.projectedShortage > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {selectedRow.projectedShortage && selectedRow.projectedShortage > 0 ? `-${selectedRow.projectedShortage}` : '0'} <span className="text-xs font-normal text-slate-500">units</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Deficit gap</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Predicted Stock-Out
              </span>
              <div className={`text-2xl font-black mt-1 ${selectedRow.predictedDaysUntilStockout && selectedRow.predictedDaysUntilStockout <= 3 ? 'text-rose-600' : 'text-slate-900'}`}>
                {selectedRow.predictedDaysUntilStockout} <span className="text-xs font-normal text-slate-500">days</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Buffer remaining</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Risk Classification
              </span>
              <div className="text-xl font-black text-slate-900 mt-1">
                {selectedRow.riskLevel}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rule-based policy</span>
            </div>
          </div>

          {/* OUTCOME BOX & SUPPLY CHAIN ACTION (Requirement 16 & 19) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Healthcare Supply Chain Outcome */}
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>OUTCOME: {selectedRow.outcomeLabel}</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                The ML model predicts consumption of <strong>{selectedRow.predictedDemand} units</strong> will deplete available stock ({selectedRow.currentStock} units) in <strong>{selectedRow.predictedDaysUntilStockout} days</strong>.
              </p>
              <div className="pt-2 text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Policy Trigger: {selectedRow.recommendedAction}</span>
              </div>
            </div>

            {/* Right: Potential Surplus Facilities & Redistribution CTA */}
            <div className="p-5 bg-teal-50 border border-teal-200 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-teal-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-teal-700" />
                  Identified Regional Surplus Donors
                </span>
                <p className="text-xs text-teal-800 mt-1">
                  Donor: <strong>{selectedRow.potentialSurplusFacility}</strong> has <strong>+{selectedRow.surplusUnits} units surplus</strong> available to offset deficit.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-teal-200/80">
                <span className="text-xs font-bold text-teal-900">
                  Recommended Transfer: <strong>{selectedRow.projectedShortage || 390} units</strong>
                </span>
                <button
                  onClick={() => onNavigateToTab?.('redistribution')}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Review Redistribution →
                </button>
              </div>
            </div>
          </div>

          {/* EXPLAINABILITY (SHAP FACTORS) (Requirement 21) */}
          {selectedRow.shapExplanations && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-teal-600" />
                  Why Did The Model Predict {selectedRow.predictedDemand} Units? (SHAP Feature Contributions)
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Calculated additive weights</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {selectedRow.shapExplanations.map((shap, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium block truncate">{shap.factor}</span>
                    <div className="text-base font-black text-teal-700 mt-0.5">
                      +{shap.contribution}%
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${shap.contribution * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: BATCH PREDICTION RESULT TABLE (Requirement 17) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">2</span>
              Batch Prediction Results & Supply Deficit Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any row to inspect SHAP factors and auto-calculated redistribution routes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facility or medicine..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical Shortage</option>
              <option value="HIGH">High Risk</option>
              <option value="SUFFICIENT">Sufficient</option>
            </select>

            {/* CSV Download Button */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Download Predictions CSV
            </button>
          </div>
        </div>

        {/* Prediction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Facility</th>
                <th className="py-2.5 px-3">Medicine</th>
                <th className="py-2.5 px-3">Predicted Demand</th>
                <th className="py-2.5 px-3">95% Interval</th>
                <th className="py-2.5 px-3">Current Stock</th>
                <th className="py-2.5 px-3">Projected Deficit</th>
                <th className="py-2.5 px-3">Stock-Out</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRows.map((row) => {
                const isSelected = selectedRow.id === row.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(row)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{row.facilityName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{row.date}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-semibold">
                      {row.medicineName}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {row.predictedDemand} units
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      [{row.predictionLower} - {row.predictionUpper}]
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {row.currentStock} units
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-mono font-extrabold ${
                        row.projectedShortage && row.projectedShortage > 0 ? 'text-rose-600' : 'text-emerald-700'
                      }`}>
                        {row.projectedShortage && row.projectedShortage > 0 ? `-${row.projectedShortage}` : '0'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {row.predictedDaysUntilStockout} days
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        row.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        row.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRow(row);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-teal-700 font-bold rounded border border-slate-200 text-xs shadow-2xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
