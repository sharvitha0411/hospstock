import React, { useState } from 'react';
import {
  Cpu,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  FileText,
  ShieldCheck,
  TrendingUp,
  Download,
  Activity,
  Archive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MLModelArtifact } from '../../types';

export const MLGovernanceWorkspace: React.FC = () => {
  const { currentUser, mlModels, trainModelManually, approveModel, archiveModel } = useApp();

  const [selectedAlgo, setSelectedAlgo] = useState<MLModelArtifact['algorithm']>('XGBoost Multi-Variate');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainMsg, setTrainMsg] = useState<string | null>(null);

  const activeModel = mlModels.find((m) => m.status === 'ACTIVE_APPROVED') || mlModels[0];

  const handleRunManualTraining = async () => {
    setIsTraining(true);
    setTrainMsg('Executing chronological train/validation pipeline with multi-variate feature matrix...');

    setTimeout(async () => {
      const newMdl = await trainModelManually(selectedAlgo);
      setIsTraining(false);
      setTrainMsg(`Model training complete! Saved artifact: ${newMdl.version} (R²: ${newMdl.accuracyR2}, MAPE: ${newMdl.mapePercent}%). Pending human approval.`);
      setTimeout(() => setTrainMsg(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Mandatory Rule Notice */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">ML Model Governance & Inference Pipeline</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                ML / DATA ANALYST ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.name} · Healthcare AI/ML Research Lead · Multi-Variate Time-Series Demand Forecasting
            </p>
          </div>
        </div>

        {/* Governance Rule Banner */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center gap-2 max-w-md">
          <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>Strict Governance: No autonomous retraining. All model promotions require manual validation & human sign-off.</span>
        </div>
      </div>

      {trainMsg && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 text-xs font-bold flex items-center gap-2">
          {isTraining ? (
            <Activity className="w-4 h-4 text-purple-600 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          )}
          <span>{trainMsg}</span>
        </div>
      )}

      {/* Top Strip: Active Production Model */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-purple-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              ACTIVE PRODUCTION MODEL (IN SERVICE)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-800/80 text-purple-200 font-mono">
              {activeModel.version}
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            FastAPI Endpoint: <strong className="text-cyan-300">{activeModel.inferenceEndpoint}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Algorithm</span>
            <span className="text-base font-extrabold text-white">{activeModel.algorithm}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">R² Accuracy</span>
            <span className="text-base font-extrabold text-emerald-400">{(activeModel.accuracyR2 * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mean Abs. Error (MAE)</span>
            <span className="text-base font-extrabold text-cyan-300">{activeModel.mae} units</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">MAPE Error</span>
            <span className="text-base font-extrabold text-amber-300">{activeModel.mapePercent}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Training Date</span>
            <span className="text-xs font-mono text-slate-300">{activeModel.trainedAt.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Model Comparison Table & Manual Training Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Model Artifact Registry */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Model Artifact Registry</h3>
              <p className="text-xs text-slate-500">Chronological benchmarks and approval status</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Artifact Version</th>
                  <th className="py-2.5 px-3">Algorithm</th>
                  <th className="py-2.5 px-3">R² Score</th>
                  <th className="py-2.5 px-3">MAPE %</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mlModels.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{m.version}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{m.algorithm}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {(m.accuracyR2 * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">{m.mapePercent}%</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'ACTIVE_APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'CANDIDATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {m.status === 'CANDIDATE' ? (
                        <button
                          onClick={() => approveModel(m.id)}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px]"
                        >
                          Approve Model
                        </button>
                      ) : m.status === 'ACTIVE_APPROVED' ? (
                        <span className="text-[11px] font-bold text-emerald-600">● In Production</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Manual Training Pipeline Suite */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-600" />
              <span>Manual Re-Training Console</span>
            </h3>
            <p className="text-xs text-slate-500">Run training pipeline with latest dataset snapshot</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Candidate Algorithm:</label>
              <select
                value={selectedAlgo}
                onChange={(e) => setSelectedAlgo(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="XGBoost Multi-Variate">XGBoost Multi-Variate (Weather + Outbreak Covariates)</option>
                <option value="Prophet Additive">Prophet Additive (Bayesian Seasonality & Trend)</option>
                <option value="SARIMA">SARIMA (2,1,1)x(1,1,1)7 Seasonal Auto-Regressive</option>
                <option value="Random Forest Regressor">Random Forest Regressor (Non-Linear Ensemble)</option>
                <option value="Seasonal Naive">Seasonal Naive Baseline Benchmark</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Dataset Source</span>
              <div className="font-mono text-slate-800 font-bold">ds_health_clim_2023_2026_v4.2.csv</div>
              <div className="text-[11px] text-slate-500">152,400 daily consumption records across 10 districts</div>
            </div>

            <button
              onClick={handleRunManualTraining}
              disabled={isTraining}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isTraining ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Fitting Model on Chronological Split...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Manual Training Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SHAP Explainability Feature Importance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>SHAP Feature Attribution & Explainable AI</span>
            </h3>
            <p className="text-xs text-slate-500">Global feature importance explaining why the model forecasts demand surges</p>
          </div>
        </div>

        <div className="space-y-3">
          {activeModel.shapTopFeatures.map((feat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-800">{feat.feature}</span>
                <span className="font-mono font-bold text-purple-700">{(feat.importance * 100).toFixed(0)}% Importance</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-teal-500 rounded-full"
                  style={{ width: `${feat.importance * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
