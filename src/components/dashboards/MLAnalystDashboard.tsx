import React, { useState } from 'react';
import {
  Brain,
  Activity,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MLAnalystDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const MLAnalystDashboard: React.FC<MLAnalystDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    mlModels,
    trainModelManually,
    approveModel
  } = useApp();

  const [isTraining, setIsTraining] = useState(false);
  const [trainSuccess, setTrainSuccess] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<'Paracetamol' | 'Insulin' | 'Amoxicillin'>('Paracetamol');

  // Time-series points for Actual vs Predicted
  const timeSeriesData = [
    { day: 'Day -6', actual: 420, predicted: 410, lower: 390, upper: 430 },
    { day: 'Day -5', actual: 445, predicted: 440, lower: 415, upper: 465 },
    { day: 'Day -4', actual: 480, predicted: 475, lower: 450, upper: 500 },
    { day: 'Day -3', actual: 520, predicted: 515, lower: 490, upper: 540 },
    { day: 'Day -2', actual: 590, predicted: 585, lower: 555, upper: 615 },
    { day: 'Day -1', actual: 640, predicted: 630, lower: 600, upper: 660 },
    { day: 'Today', actual: 690, predicted: 685, lower: 650, upper: 720 },
    { day: '+1 Day', actual: null, predicted: 740, lower: 700, upper: 780 },
    { day: '+2 Day', actual: null, predicted: 795, lower: 750, upper: 840 },
    { day: '+3 Day', actual: null, predicted: 830, lower: 780, upper: 880 }
  ];

  const maxVal = 900;

  // Model Comparison Benchmark Table
  const modelComparison = [
    {
      name: 'Seasonal Naive Baseline',
      mae: 42.1,
      rmse: 58.4,
      mape: '14.8%',
      status: 'BASELINE',
      notes: 'No exogenous feature input'
    },
    {
      name: 'SARIMA (1,1,1)(1,1,1)7',
      mae: 28.6,
      rmse: 39.2,
      mape: '9.4%',
      status: 'STAGING',
      notes: 'Weekly seasonality only'
    },
    {
      name: 'Prophet (Additive Surge)',
      mae: 22.4,
      rmse: 31.0,
      mape: '7.2%',
      status: 'VALIDATED',
      notes: 'Monsoon calendar covariates'
    },
    {
      name: 'XGBoost + Surge & Weather',
      mae: 14.2,
      rmse: 19.8,
      mape: '4.6%',
      status: 'PRODUCTION (WINNER)',
      notes: 'Rainfall, triage footfall, fever spike'
    }
  ];

  // Feature Importance Weights
  const featureImportance = [
    { feature: 'Previous 7-day Hospital Consumption', weight: 38, color: 'bg-teal-600' },
    { feature: 'Outpatient Triage Footfall', weight: 24, color: 'bg-cyan-600' },
    { feature: 'Historical Monsoon Seasonality', weight: 16, color: 'bg-blue-600' },
    { feature: 'Regional Weather & Relative Humidity', weight: 12, color: 'bg-indigo-600' },
    { feature: 'Reported Febrile Disease Alert Flags', weight: 10, color: 'bg-purple-600' }
  ];

  const handleManualTrain = () => {
    setIsTraining(true);
    trainModelManually('XGBoost Multi-Variate');
    setTimeout(() => {
      setIsTraining(false);
      setTrainSuccess('Manual XGBoost training complete! New weights calibrated on 1.4M telemetry points. Validation R² improved to 0.946.');
      setTimeout(() => setTrainSuccess(null), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <Brain className="w-5 h-5 text-purple-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                MediChain ML Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Data Science Workspace • Epidemic Demand Forecasting, Model Registry & Feature Explainability
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion & Manual Train CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-purple-50/80 border border-purple-200 px-3 py-2 rounded-xl text-xs text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="text-left">
              <span className="font-bold text-[11px] block text-purple-800">Model Copilot:</span>
              <span className="text-[11px] text-purple-700">"Why did XGBoost outperform SARIMA for Paracetamol?"</span>
            </div>
          </div>

          <button
            onClick={handleManualTrain}
            disabled={isTraining}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            <span>{isTraining ? 'Training Model...' : 'Train Model (Manual)'}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {trainSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{trainSuccess}</span>
        </div>
      )}

      {/* TOP MODEL METADATA BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Model</span>
          <div className="text-base font-black text-slate-900 mt-1">XGBoost Ensemble</div>
          <span className="text-[10px] text-teal-600 font-bold">Production v4.2</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Training Dataset</span>
          <div className="text-base font-black text-slate-900 mt-1">1.4M Rows</div>
          <span className="text-[10px] text-slate-500">18-Month Multi-District</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Last Training</span>
          <div className="text-base font-black text-slate-900 mt-1">Yesterday</div>
          <span className="text-[10px] text-slate-500">18:30 IST (Manual Signoff)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Validation Score</span>
          <div className="text-base font-black text-emerald-700 mt-1">R² 0.942</div>
          <span className="text-[10px] text-emerald-600 font-medium">MAPE: 4.6%</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Inference Latency</span>
          <div className="text-base font-black text-teal-700 mt-1">18 ms</div>
          <span className="text-[10px] text-slate-500">Sub-second real-time</span>
        </div>
      </div>

      {/* MAIN LARGE: ACTUAL VS PREDICTED DEMAND CHART */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">
              Actual vs. Predicted Medicine Demand (Time Series)
            </h2>
            <p className="text-xs text-slate-500">
              XGBoost forecast with 95% confidence interval bounds overlaid with actual consumption telemetry
            </p>
          </div>

          {/* Medicine Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Medicine:</span>
            {(['Paracetamol', 'Insulin', 'Amoxicillin'] as const).map((med) => (
              <button
                key={med}
                onClick={() => setSelectedMedicine(med)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  selectedMedicine === med
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {med}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Chart */}
        <div className="grid grid-cols-10 gap-2 items-end h-48 pt-6 border-b border-slate-200 pb-2">
          {timeSeriesData.map((pt, idx) => {
            const predHeight = Math.round((pt.predicted / maxVal) * 100);
            const actualHeight = pt.actual ? Math.round((pt.actual / maxVal) * 100) : null;
            const isForecast = pt.actual === null;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono font-bold text-slate-600 mb-1">
                  {pt.predicted}
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Actual bar (if historical) */}
                  {actualHeight !== null && (
                    <div
                      style={{ height: `${actualHeight}%` }}
                      className="w-1/2 bg-slate-800 rounded-t-sm"
                      title={`Actual: ${pt.actual} units`}
                    />
                  )}

                  {/* Predicted bar */}
                  <div
                    style={{ height: `${predHeight}%` }}
                    className={`w-1/2 rounded-t-sm transition-all ${
                      isForecast
                        ? 'bg-gradient-to-t from-purple-600 to-cyan-500 animate-pulse'
                        : 'bg-purple-400'
                    }`}
                    title={`Predicted: ${pt.predicted} units (95% CI: ${pt.lower} - ${pt.upper})`}
                  />
                </div>

                <span className={`text-[10px] mt-2 font-medium ${isForecast ? 'text-purple-700 font-bold' : 'text-slate-500'}`}>
                  {pt.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-5 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-800 rounded-xs" />
            <span className="text-slate-600">Historical Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-purple-400 rounded-xs" />
            <span className="text-slate-600">Historical Fitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-purple-600 rounded-xs animate-pulse" />
            <span className="font-bold text-purple-700">Future 72h Surge Forecast</span>
          </div>
        </div>
      </div>

      {/* TWO PANEL SECTION:
          LEFT: MODEL COMPARISON BENCHMARK (Span 6)
          RIGHT: FEATURE IMPORTANCE & SHAP EXPLANATION (Span 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODEL COMPARISON */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Model Comparison Benchmark</h3>
              <p className="text-xs text-slate-500">Cross-validation metrics on holdout test set</p>
            </div>
            <span className="text-xs font-bold text-slate-400">4 Architectures</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Model Architecture</th>
                  <th className="py-2.5 px-3">MAE</th>
                  <th className="py-2.5 px-3">RMSE</th>
                  <th className="py-2.5 px-3">MAPE</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modelComparison.map((m, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50 transition-colors ${m.status.includes('WINNER') ? 'bg-purple-50/40' : ''}`}>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{m.name}</div>
                      <span className="text-[10px] text-slate-500">{m.notes}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{m.mae}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{m.rmse}</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">{m.mape}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        m.status.includes('WINNER')
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEATURE IMPORTANCE & SHAP */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Feature Importance (SHAP Analysis)</h3>
                <p className="text-xs text-slate-500">Weight contributions to Paracetamol demand surge</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Gini Impurity
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {featureImportance.map((f, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-800">{f.feature}</span>
                    <span className="font-bold text-slate-900">{f.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div style={{ width: `${f.weight}%` }} className={`h-full rounded-full ${f.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SHAP Explanation Callout */}
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs">
            <span className="font-bold text-purple-900 block mb-1">
              SHAP Insight: Why is demand predicted to increase by +34.2%?
            </span>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Positive shapley attribution driven primarily by <strong>Rainfall spike in Metro Central (+18.4%)</strong>,
              compounded by a <strong>32% rise in reported febrile outpatient triage</strong>, matching the 2024 monsoon surge profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
