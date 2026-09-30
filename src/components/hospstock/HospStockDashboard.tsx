import React, { useState, useEffect, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Brain,
  Layers,
  Building2,
  Pill,
  Clock,
  Activity,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Sliders,
  Database
} from 'lucide-react';
import {
  DataProfile,
  CleaningReport,
  parseUploadedFile,
  parseCSVString,
  profileDataset,
  cleanDataset
} from '../../services/dataCleaningEngine';
import {
  MLPredictionOutput,
  runHospitalDemandML
} from '../../services/mlPredictionEngine';
import { generateSampleHospitalStockCSV } from '../../data/sampleHospitalStockDataset';
import { EDACharts } from './EDACharts';

export const HospStockDashboard: React.FC = () => {
  // 1. Raw Dataset State
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [cleanedRows, setCleanedRows] = useState<Record<string, any>[]>([]);
  const [profile, setProfile] = useState<DataProfile | null>(null);

  // 2. Workflow Stage
  const [isCleaning, setIsCleaning] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [cleaningReport, setCleaningReport] = useState<CleaningReport | null>(null);

  // 3. ML Prediction State
  const [isTraining, setIsTraining] = useState(false);
  const [mlOutput, setMlOutput] = useState<MLPredictionOutput | null>(null);
  const [mlError, setMlError] = useState<string | null>(null);

  // 4. UI Alerts & Table state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 12;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Load sample dataset on initial load or button click (Requirement 2: 1000+ realistic records)
  const handleLoadSampleDataset = () => {
    try {
      const csvText = generateSampleHospitalStockCSV();
      const parsed = parseCSVString(csvText, 'Hospital_Stock_Ledger_2025_Q3.csv');
      const prof = profileDataset(parsed.headers, parsed.rows, parsed.fileName, parsed.fileSize);

      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setCleanedRows([]);
      setProfile(prof);
      setIsCleaned(false);
      setCleaningReport(null);
      setMlOutput(null);
      setMlError(null);
      setTablePage(1);
      showToast(`Loaded ${parsed.rows.length.toLocaleString()} realistic sample hospital stock records.`);
    } catch (err: any) {
      alert(`Failed to load sample dataset: ${err.message}`);
    }
  };

  // Load sample on initial mount
  useEffect(() => {
    handleLoadSampleDataset();
  }, []);

  // Handle User File Upload (CSV, XLSX, JSON)
  const handleFileUpload = async (file: File) => {
    try {
      const parsed = await parseUploadedFile(file);
      const prof = profileDataset(parsed.headers, parsed.rows, parsed.fileName, parsed.fileSize);

      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setCleanedRows([]);
      setProfile(prof);
      setIsCleaned(false);
      setCleaningReport(null);
      setMlOutput(null);
      setMlError(null);
      setTablePage(1);
      showToast(`Uploaded ${parsed.fileName} (${parsed.rows.length.toLocaleString()} rows, ${parsed.headers.length} columns).`);
    } catch (err: any) {
      alert(`Error parsing file: ${err.message}`);
    }
  };

  // Run Real Cleaning & Validation Pipeline (Section 3, 4 & 5)
  const handleCleanData = () => {
    if (!profile || rawRows.length === 0) return;
    setIsCleaning(true);

    setTimeout(() => {
      try {
        const { cleanedRows: newCleaned, report, newProfile } = cleanDataset(headers, rawRows, profile);
        setCleanedRows(newCleaned);
        setCleaningReport(report);
        setProfile(newProfile);
        setIsCleaned(true);
        setIsCleaning(false);
        showToast('Dataset cleaned and validated successfully.');
      } catch (err: any) {
        setIsCleaning(false);
        alert(`Cleaning error: ${err.message}`);
      }
    }, 600);
  };

  // Run Real ML Prediction (Section 8, 9, 10, 11)
  const handleRunPrediction = () => {
    const activeData = isCleaned && cleanedRows.length > 0 ? cleanedRows : rawRows;
    if (activeData.length === 0) return;

    setIsTraining(true);
    setMlError(null);

    setTimeout(() => {
      try {
        const output = runHospitalDemandML(activeData, headers);
        setMlOutput(output);
        setIsTraining(false);
        showToast(`ML demand model trained successfully! R² = ${output.evaluation.r2Score}, MAE = ${output.evaluation.mae} units.`);
      } catch (err: any) {
        setIsTraining(false);
        setMlError(err.message || 'ML training failed.');
      }
    }, 800);
  };

  // Reset Dataset (Section 16)
  const handleReset = () => {
    setHeaders([]);
    setRawRows([]);
    setCleanedRows([]);
    setProfile(null);
    setIsCleaned(false);
    setCleaningReport(null);
    setMlOutput(null);
    setMlError(null);
    showToast('Dataset reset. Please upload a file or browse sample dataset.');
  };

  // Download Cleaned CSV (Section 6)
  const handleDownloadCleanedCSV = () => {
    const dataToExport = isCleaned && cleanedRows.length > 0 ? cleanedRows : rawRows;
    if (dataToExport.length === 0) return;

    const csvRows = [headers.join(',')];
    dataToExport.forEach((r) => {
      const line = headers.map((h) => {
        const val = r[h] ?? '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      });
      csvRows.push(line.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cleaned_${profile?.fileName || 'dataset.csv'}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Cleaned CSV downloaded successfully.');
  };

  // Download Prediction Report CSV (Section 16)
  const handleDownloadPredictionCSV = () => {
    if (!mlOutput) return;
    const predHeaders = [
      'Medicine',
      'Department',
      'Current_Stock',
      'Reorder_Level',
      'Predicted_Demand',
      'Stock_Status',
      'Recommended_Action',
      'Stockout_Risk_Score',
      'Risk_Level'
    ];
    const csvLines = [predHeaders.join(',')];
    mlOutput.predictions.forEach((p) => {
      csvLines.push([
        `"${p.medicine}"`,
        `"${p.department}"`,
        p.currentStock,
        p.reorderLevel,
        p.predictedDemand,
        `"${p.stockStatus}"`,
        `"${p.recommendedAction}"`,
        p.stockoutRiskScore,
        `"${p.riskLevel}"`
      ].join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HospStock_Prediction_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Prediction Report CSV downloaded.');
  };

  // Export Comprehensive Audit Report (Section 16)
  const handleExportFullReport = () => {
    if (!profile) return;
    const reportText = `=====================================================
HospStock AI – Comprehensive Audit & Demand Report
Generated: ${new Date().toLocaleString()}
=====================================================

1. DATASET SUMMARY:
Filename: ${profile.fileName}
Total Records: ${profile.totalRows.toLocaleString()}
Total Columns: ${profile.totalColumns}
Data Quality Score: ${profile.dataQualityScore}%
Status: ${profile.status}
Missing Cells: ${profile.missingCount} (${profile.missingPercentage}%)
Duplicates: ${profile.duplicateCount}

2. CLEANING AUDIT:
${cleaningReport ? `
- Imputed Numeric Cells: ${cleaningReport.imputedNumericCells}
- Imputed Categorical Cells: ${cleaningReport.imputedCategoricalCells}
- Duplicates Removed: ${cleaningReport.duplicatesRemoved}
- Negative Stock Corrected: ${cleaningReport.negativeValuesFixed}
- Cleaned Row Count: ${cleaningReport.cleanedRowCount.toLocaleString()}
` : 'Dataset in raw uncleaned state.'}

3. ML MODEL & PERFORMANCE:
${mlOutput ? `
Model: ${mlOutput.evaluation.modelName}
Target Column: ${mlOutput.evaluation.targetColumn}
Training Split: ${mlOutput.evaluation.trainRecords.toLocaleString()} rows (80%)
Testing Split: ${mlOutput.evaluation.testRecords.toLocaleString()} rows (20%)
Features Used (${mlOutput.evaluation.featuresUsed.length}): ${mlOutput.evaluation.featuresUsed.join(', ')}
Test MAE: ${mlOutput.evaluation.mae} units
Test RMSE: ${mlOutput.evaluation.rmse}
Test R² Score: ${mlOutput.evaluation.r2Score}
` : 'ML model not yet trained.'}

4. INVENTORY RISK & RECOMMENDATIONS:
${mlOutput ? `
Critical Stockouts: ${mlOutput.risks.criticalStockouts.join(', ') || 'None'}
Fast Moving Items: ${mlOutput.risks.fastMovingItems.join(', ') || 'None'}
Low Stock Items Count: ${mlOutput.risks.lowStockItemsCount}
Overstock Items Count: ${mlOutput.risks.overstockItemsCount}

Top AI Insights:
${mlOutput.aiInsights.map((ins, i) => `[${i + 1}] ${ins}`).join('\n')}
` : 'Awaiting ML inference execution.'}

=====================================================
HospStock AI — Hospital Inventory & Demand Prediction System
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HospStock_Comprehensive_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Comprehensive report exported.');
  };

  // Paginated and Filtered Table rows
  const displayRows = isCleaned && cleanedRows.length > 0 ? cleanedRows : rawRows;
  const filteredRows = useMemo(() => {
    if (!tableSearch.trim()) return displayRows;
    const term = tableSearch.toLowerCase();
    return displayRows.filter((r) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(term))
    );
  }, [displayRows, tableSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPageRows = filteredRows.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-slate-900 text-white border border-teal-500 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION: HospStock AI branding */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20 font-black text-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                HospStock AI
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                INVENTORY & DEMAND PREDICTION SYSTEM
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Production AI/ML pipeline: Real CSV profiling, data cleaning, EDA, regression model training, and automated inventory replenishment.
            </p>
          </div>
        </div>

        {/* Global Action Buttons (Section 16) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportFullReport}
            disabled={!profile}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Export full textual audit report"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Clear and reset dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Dataset</span>
          </button>
        </div>
      </div>

      {/* PIPELINE STATUS VISUALIZER (Section 18) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Automated Hospital Inventory & ML Prediction Pipeline
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Dynamic State Tracking</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-3 text-center">
          {[
            { label: 'Upload', done: Boolean(profile && profile.totalRows > 0) },
            { label: 'Data Profiling', done: Boolean(profile) },
            { label: 'Cleaning', done: isCleaned },
            { label: 'Validation', done: isCleaned },
            { label: 'EDA', done: Boolean(profile) },
            { label: 'ML Training', done: Boolean(mlOutput) },
            { label: 'Prediction', done: Boolean(mlOutput) },
            { label: 'Inventory Action', done: Boolean(mlOutput) }
          ].map((step, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border flex flex-col justify-center transition-all ${
                step.done
                  ? 'bg-teal-950/80 border-teal-500/60 text-teal-200'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                {step.done ? <Check className="w-3 h-3 text-teal-400" /> : <span className="w-2 h-2 rounded-full bg-slate-600" />}
                <span>{step.label}</span>
              </div>
              <span className="text-[9px] font-mono mt-0.5 text-slate-400">
                {step.done ? '✓ Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1: DATASET UPLOAD CARD (Section 1 & 2) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">1</span>
              Upload Hospital Stock & Telemetry File
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your hospital stock ledger, monthly consumption logs, or healthcare inventory data. Supported: CSV, XLSX, JSON (Max 50 MB).
            </p>
          </div>

          {profile && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Loaded Dataset</span>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {profile.fileName} ({profile.totalRows.toLocaleString()} rows)
              </span>
            </div>
          )}
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragging ? 'border-teal-500 bg-teal-50/50' : 'border-slate-300 hover:border-teal-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            accept=".csv, .xlsx, .xls, .json"
            id="hospstock-file-input"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <label htmlFor="hospstock-file-input" className="cursor-pointer space-y-2 block">
            <UploadCloud className="w-9 h-9 text-teal-600 mx-auto" />
            <div className="text-xs font-bold text-slate-800">
              Drag & Drop Kaggle or Hospital CSV here, or <span className="text-teal-600 underline">Browse File</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Auto-detects columns: Date, Medicine_Name, Department, Category, Opening_Stock, Stock_Consumed, Closing_Stock, Demand...
            </p>
          </label>
        </div>

        {/* Action Buttons: Browse File & Browse Sample Dataset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <label
            htmlFor="hospstock-file-input"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-slate-600" />
            <span>Browse / Upload Dataset</span>
          </label>

          <button
            onClick={handleLoadSampleDataset}
            className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <span>Browse Sample Dataset (1,080 Records)</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: DYNAMIC DATA QUALITY DASHBOARD (Section 4 & 5) */}
      {profile && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">2</span>
                Data Quality & Statistical Profiling
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Computed dynamically from the actual uploaded dataset ({profile.fileName}). Zero static hardcoded metrics.
              </p>
            </div>

            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                profile.status === 'CLEANED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              STATUS: {profile.status}
            </span>
          </div>

          {/* 5 Real Quality Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Data Quality</span>
              <div className="text-2xl font-black text-teal-700 mt-1">
                {profile.dataQualityScore}%
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: `${profile.dataQualityScore}%` }} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valid Records</span>
              <div className="text-xl font-black text-slate-900 mt-1 truncate">
                {profile.validRecordCount.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {profile.totalRows.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Clean rows</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missing Values</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {profile.missingPercentage}%
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">{profile.missingCount} total null cells</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duplicates</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {profile.duplicateCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Exact row matches</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invalid Records</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {profile.invalidRecordCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Negative/format issues</span>
            </div>
          </div>

          {/* Action Row: Clean & Validate Button + Run Prediction Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium">
              {isCleaned
                ? '✨ Dataset successfully cleaned using median & mode imputation and deduplication.'
                : 'Dataset requires validation and median imputation before executing ML training.'}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* BUTTON 3: DATA CLEANED & VALIDATED (Section 5) */}
              <button
                onClick={handleCleanData}
                disabled={isCleaning || isCleaned}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                  isCleaned
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                } disabled:opacity-70`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCleaning ? 'animate-spin' : ''}`} />
                <span>
                  {isCleaning
                    ? 'Running Cleaning Pipeline...'
                    : isCleaned
                    ? 'Data Cleaned & Validated'
                    : 'Data Cleaned & Validated'}
                </span>
              </button>

              {/* BUTTON 4: RUN ML PREDICTION (Section 8) - Enabled only after cleaning! */}
              <button
                onClick={handleRunPrediction}
                disabled={!isCleaned || isTraining}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={!isCleaned ? 'Please run "Data Cleaned & Validated" first to unlock ML Prediction' : 'Train regression model'}
              >
                <Brain className={`w-4 h-4 ${isTraining ? 'animate-spin text-purple-200' : ''}`} />
                <span>{isTraining ? 'Training ML Model...' : 'Run ML Prediction →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CLEANED DATA PREVIEW & TABLE (Section 6) */}
      {profile && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">3</span>
                Cleaned Dataset Preview & Schema
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {displayRows.length.toLocaleString()} records · {profile.totalColumns} features ({profile.numericColumns.length} numeric, {profile.categoricalColumns.length} categorical, {profile.dateColumns.length} dates)
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setTablePage(1);
                  }}
                  placeholder="Search table values..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Download Cleaned CSV Button (Section 6) */}
              <button
                onClick={handleDownloadCleanedCSV}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Cleaned CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="py-2.5 px-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentPageRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    {headers.map((h) => (
                      <td key={h} className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                        {row[h] !== undefined && row[h] !== null ? String(row[h]) : <span className="text-slate-300 italic">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing {Math.min(filteredRows.length, (tablePage - 1) * pageSize + 1)} to{' '}
              {Math.min(filteredRows.length, tablePage * pageSize)} of {filteredRows.length.toLocaleString()} rows
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                disabled={tablePage === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-800 font-mono">
                Page {tablePage} of {totalPages}
              </span>
              <button
                onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                disabled={tablePage === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: EXPLORATORY DATA ANALYSIS (EDA) CHARTS (Section 7) */}
      {profile && (
        <EDACharts rows={displayRows} headers={headers} />
      )}

      {/* SECTION 5: ML PREDICTION & EVALUATION RESULTS (Section 8, 9, 10, 11, 12, 13, 14, 15) */}
      {mlError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{mlError}</span>
        </div>
      )}

      {mlOutput && (
        <div className="space-y-6 animate-in fade-in">
          {/* ML EVALUATION METRICS CARD (Section 11) */}
          <div className="bg-white border-2 border-purple-500 rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  TRAINED ON UPLOADED DATASET
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Model Performance: {mlOutput.evaluation.modelName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target Variable: <strong className="text-purple-700 font-mono font-bold">{mlOutput.evaluation.targetColumn}</strong> · Features: <strong>{mlOutput.evaluation.featuresUsed.length} engineered predictors</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPredictionCSV}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Prediction Report</span>
                </button>
              </div>
            </div>

            {/* 4 True Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MAE (Mean Absolute Error)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {mlOutput.evaluation.mae} <span className="text-xs font-normal text-slate-500">units</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">True test error</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RMSE</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {mlOutput.evaluation.rmse}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Root mean squared error</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">R² Score</span>
                <div className="text-2xl font-black text-purple-700 mt-1">
                  {mlOutput.evaluation.r2Score}
                </div>
                <span className="text-[11px] text-purple-600 font-bold">Variance explained</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Train / Test Split</span>
                <div className="text-sm font-black text-slate-900 mt-1 font-mono">
                  {mlOutput.evaluation.trainRecords.toLocaleString()} / {mlOutput.evaluation.testRecords.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">80% Train · 20% Test</span>
              </div>
            </div>
          </div>

          {/* INVENTORY DEMAND PREDICTION TABLE (Section 12) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  Inventory Demand Prediction & Replenishment Actions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated reorder classification based on predicted burn rate and safe lead time buffer.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-500">
                {mlOutput.predictions.length} Medicine Categories Evaluated
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Medicine Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Current Stock</th>
                    <th className="py-2.5 px-3">Reorder Level</th>
                    <th className="py-2.5 px-3">Predicted Demand</th>
                    <th className="py-2.5 px-3">Stock Status</th>
                    <th className="py-2.5 px-3">Recommended Action</th>
                    <th className="py-2.5 px-3 text-right">Stockout Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mlOutput.predictions.map((p, idx) => (
                    <tr key={idx} className={p.stockStatus === 'REORDER NOW' ? 'bg-rose-50/40' : ''}>
                      <td className="py-3 px-3 font-extrabold text-slate-900">{p.medicine}</td>
                      <td className="py-3 px-3 text-slate-600">{p.department}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{p.currentStock.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{p.reorderLevel.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono font-bold text-teal-700">{p.predictedDemand.toLocaleString()} units</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border ${
                            p.stockStatus === 'REORDER NOW'
                              ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                              : p.stockStatus === 'LOW STOCK'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {p.stockStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs font-semibold text-slate-800">
                        {p.recommendedAction}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={p.stockoutRiskScore > 60 ? 'text-rose-600' : p.stockoutRiskScore > 30 ? 'text-amber-600' : 'text-emerald-700'}>
                          {p.stockoutRiskScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FUTURE DEMAND FORECAST & AI INSIGHTS (Section 14 & 15) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart: Actual vs Predicted Demand Forecast (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Future Demand Forecast (Actual vs Predicted)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  14-day projection curve with 95% confidence uncertainty interval.
                </p>
              </div>

              {/* Forecast SVG Chart */}
              <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2">
                {mlOutput.forecastPoints.map((pt, i) => {
                  const maxVal = Math.max(...mlOutput.forecastPoints.map((p) => p.upperBound), 100);
                  const predHeight = Math.max(10, Math.round((pt.predictedDemand / maxVal) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full bg-gradient-to-t from-teal-500 to-purple-500 rounded-t relative transition-all"
                        style={{ height: `${predHeight}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                          {pt.predictedDemand} units [{pt.lowerBound}-{pt.upperBound}]
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 truncate w-full text-center">
                        {pt.period}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex justify-between">
                <span>Projection includes uncertainty buffer</span>
                <span className="text-purple-600 font-bold">14-Day Horizon</span>
              </div>
            </div>

            {/* AI Inventory Insights (5 cols) (Section 15) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  AI Inventory Insights & Risk Detection
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synthesized automatically from dataset features and predicted stockout vectors.
                </p>

                <div className="space-y-3 pt-3">
                  {mlOutput.aiInsights.map((insight, idx) => (
                    <div key={idx} className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-xl flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-purple-950 font-medium leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                <span>Calculated from active regression results</span>
                <span className="text-teal-700 font-bold">HospStock Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
