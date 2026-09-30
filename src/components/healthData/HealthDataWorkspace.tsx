import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Database,
  ArrowRight,
  Filter,
  Check,
  XCircle,
  HelpCircle,
  Trash2,
  Sliders
} from 'lucide-react';
import { InventoryItem, DiseaseMetric, WeatherMetric } from '../../types';
import { INVENTORY_ITEMS, DISEASE_METRICS, WEATHER_METRICS } from '../../data/mockData';

export const HealthDataWorkspace: React.FC<{ onNavigateToTab?: (tab: string) => void }> = ({ onNavigateToTab }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'stock' | 'consumption' | 'disease' | 'weather'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    rows: number;
    cols: number;
    quality: number;
    missingPct: number;
    duplicates: number;
    validCount: number;
    status: 'VALIDATED' | 'CLEANED';
  } | null>({
    name: 'District_Stock_Audit_Q3_2026.csv',
    size: '4.8 MB',
    rows: 104250,
    cols: 14,
    quality: 94,
    missingPct: 3.2,
    duplicates: 18,
    validCount: 100862,
    status: 'VALIDATED'
  });

  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanStep, setCleanStep] = useState<number>(0);
  const [dataCleaned, setDataCleaned] = useState(false);

  // Sample dirty rows for inspection
  const [dirtyRows, setDirtyRows] = useState([
    { id: 'err-1', medicine: 'Paracetamol 500mg', hospital: 'Metro Apex Medical Center', field: 'Current Stock', issue: 'NULL Value', action: 'Pending' },
    { id: 'err-2', medicine: 'Oral Rehydration Salts', hospital: 'River Delta Memorial', field: 'Daily Consumption', issue: 'Negative outlier (-45)', action: 'Pending' },
    { id: 'err-3', medicine: 'Human Insulin Regular', hospital: 'Capital General Hospital', field: 'Expiry Date', issue: 'Invalid Date Format (99/99/9999)', action: 'Pending' },
    { id: 'err-4', medicine: 'Amoxicillin 500mg', hospital: 'Civil Hospital Metro North', field: 'Batch ID', issue: 'Duplicate Primary Key', action: 'Pending' },
  ]);

  const handleCleanData = () => {
    setIsCleaning(true);
    setCleanStep(1);

    const interval = setInterval(() => {
      setCleanStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsCleaning(false);
          setDataCleaned(true);
          if (uploadedFile) {
            setUploadedFile({
              ...uploadedFile,
              quality: 99.4,
              missingPct: 0.1,
              duplicates: 0,
              validCount: uploadedFile.rows,
              status: 'CLEANED'
            });
          }
          setDirtyRows((rows) =>
            rows.map((r) => ({ ...r, action: 'Auto-Imputed / Reconciled' }))
          );
          return 6;
        }
        return prev + 1;
      });
    }, 600);
  };

  const pipelineStages = [
    { num: 1, name: 'Raw Data Ingest', desc: 'Schema parsing' },
    { num: 2, name: 'Validation', desc: 'Type & format check' },
    { num: 3, name: 'Missing Values', desc: 'KNN / Mean imputation' },
    { num: 4, name: 'Duplicate Removal', desc: 'Hash deduplication' },
    { num: 5, name: 'Outlier Detection', desc: 'Z-score & IQR clip' },
    { num: 6, name: 'Normalization', desc: 'Ready for AI Models' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Smart Health Data Management & Quality Pipeline
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Module 1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardize, validate, clean, and vectorize multi-source health facility stock and epidemiological data.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload' ? 'bg-white text-teal-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Data Ingestion & Pipeline
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'stock' ? 'bg-white text-teal-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Inventory Telemetry ({INVENTORY_ITEMS.length})
          </button>
          <button
            onClick={() => setActiveTab('disease')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'disease' ? 'bg-white text-teal-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Disease Metrics ({DISEASE_METRICS.length})
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'weather' ? 'bg-white text-teal-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Weather & Rainfall ({WEATHER_METRICS.length})
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Drop Zone & Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Drop Zone */}
            <div className="lg:col-span-2 bg-white rounded-xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center hover:border-teal-500 transition-colors bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Upload Hospital Stock & Telemetry File
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Drag and drop your hospital stock ledger, monthly consumption logs, or weather station telemetry.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[11px] font-semibold text-slate-600">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">CSV</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">XLSX</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">JSON</span>
                <span className="text-slate-400">Max 50MB</span>
              </div>
              <button
                onClick={() => {
                  setUploadedFile({
                    name: 'Monthly_Hospital_Inventory_Sept2026.csv',
                    size: '6.2 MB',
                    rows: 124800,
                    cols: 16,
                    quality: 92,
                    missingPct: 4.1,
                    duplicates: 24,
                    validCount: 119680,
                    status: 'VALIDATED'
                  });
                  setDataCleaned(false);
                }}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-all shadow-xs"
              >
                Browse Sample Dataset
              </button>
            </div>

            {/* Quality Summary Stats */}
            {uploadedFile && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                      <span className="font-bold text-xs text-slate-900 truncate max-w-[160px]">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        uploadedFile.status === 'CLEANED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {uploadedFile.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] font-semibold text-slate-400 block">Data Quality</span>
                      <span className="text-xl font-black text-slate-900">
                        {uploadedFile.quality}%
                      </span>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${uploadedFile.quality}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] font-semibold text-slate-400 block">Valid Records</span>
                      <span className="text-xl font-black text-teal-700">
                        {uploadedFile.validCount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">of {uploadedFile.rows.toLocaleString()}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] font-semibold text-slate-400 block">Missing Values</span>
                      <span className="text-lg font-black text-rose-600">
                        {uploadedFile.missingPct}%
                      </span>
                      <span className="text-[10px] text-slate-400">Needs Imputation</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] font-semibold text-slate-400 block">Duplicates</span>
                      <span className="text-lg font-black text-amber-600">
                        {uploadedFile.duplicates}
                      </span>
                      <span className="text-[10px] text-slate-400">Conflicting Batches</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {dataCleaned ? '✨ Data vectorized & ready for AI' : 'Requires AI cleaning step'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCleanData}
                      disabled={isCleaning || dataCleaned}
                      className="px-3.5 py-2 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin' : ''}`} />
                      {dataCleaned ? 'Data Cleaned & Validated' : isCleaning ? 'Cleaning...' : 'Validate & Clean Data'}
                    </button>
                    {dataCleaned && (
                      <button
                        onClick={() => onNavigateToTab?.('predictions')}
                        className="px-3.5 py-2 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all shadow-xs flex items-center gap-1.5 animate-in fade-in"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run ML Prediction →</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Preprocessing Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  Data Quality & Preprocessing Pipeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated six-stage data transformation before ingestion into XGBoost & Random Forest models
                </p>
              </div>
              {dataCleaned && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pipeline Fully Synchronized
                </span>
              )}
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {pipelineStages.map((stage) => {
                const isPassed = dataCleaned || cleanStep >= stage.num;
                const isCurrent = isCleaning && cleanStep === stage.num;

                return (
                  <div
                    key={stage.num}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isPassed
                        ? 'bg-teal-50/70 border-teal-300 text-teal-900 shadow-2xs'
                        : isCurrent
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/20 text-indigo-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 flex items-center justify-center">
                          {stage.num}
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs">{stage.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{stage.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anomaly Inspection Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Detected Data Anomalies & Action Review
                </h3>
                <p className="text-xs text-slate-500">
                  Review identified outliers, missing values, and corrupted telemetry records
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Medicine Name</th>
                    <th className="py-2.5 px-3">Facility</th>
                    <th className="py-2.5 px-3">Target Field</th>
                    <th className="py-2.5 px-3">Identified Issue</th>
                    <th className="py-2.5 px-3">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dirtyRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{row.medicine}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.hospital}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-700">{row.field}</td>
                      <td className="py-2.5 px-3 font-medium text-rose-600">{row.issue}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            row.action === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {row.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Tab */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Live Facility Inventory Telemetry
            </h3>
            <span className="text-xs text-slate-500">
              Showing active monitors across all districts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Medicine</th>
                  <th className="py-2.5 px-3">Hospital</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Current Stock</th>
                  <th className="py-2.5 px-3 text-right">Safety Buffer</th>
                  <th className="py-2.5 px-3 text-right">Daily Run Rate</th>
                  <th className="py-2.5 px-3 text-right">Days Runway</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {INVENTORY_ITEMS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.medicineName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.hospitalName}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{item.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {item.currentStock.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {item.safetyStockLevel.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {item.predictedDailyConsumption}/day
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span className={item.daysUntilStockout < 3 ? 'text-rose-600' : 'text-slate-800'}>
                        {item.daysUntilStockout} days
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.stockStatus === 'CRITICAL' || item.stockStatus === 'STOCK_OUT_TODAY'
                            ? 'bg-rose-100 text-rose-800'
                            : item.stockStatus === 'SURPLUS'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disease Tab */}
      {activeTab === 'disease' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DISEASE_METRICS.map((dis) => (
            <div key={dis.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <h4 className="font-extrabold text-sm text-slate-900">{dis.name}</h4>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  +{dis.changeRate}% Outbreak Surge
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Active Confirmed Cases</span>
                  <span className="text-lg font-black text-slate-900">{dis.currentActiveCases.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Seasonal Peak Period</span>
                  <span className="text-xs font-bold text-slate-700">{dis.seasonalPeak}</span>
                </div>
              </div>

              <div className="mt-3 text-xs">
                <span className="font-bold text-slate-600 text-[11px] block">Affected Districts:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dis.affectedDistricts.map((d) => (
                    <span key={d} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-teal-700 text-[11px] block">Directly Impacted Pharmaceuticals:</span>
                <span className="text-slate-600 text-[11px]">{dis.associatedMedicines.join(' • ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weather Tab */}
      {activeTab === 'weather' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-3">
            District Weather & Hydrometeorological Risk Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {WEATHER_METRICS.map((w) => (
              <div key={w.districtId} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{w.districtName}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      w.riskCondition === 'CYCLONE_WARNING'
                        ? 'bg-rose-100 text-rose-800'
                        : w.riskCondition === 'HEAVY_MONSOON'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {w.riskCondition.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Rainfall</span>
                    <span className="font-bold text-slate-800">{w.rainfallMm} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Anomaly</span>
                    <span className={`font-bold ${w.rainfallAnomalyPercent > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {w.rainfallAnomalyPercent > 0 ? '+' : ''}{w.rainfallAnomalyPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Humidity</span>
                    <span className="font-bold text-slate-800">{w.humidityPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
