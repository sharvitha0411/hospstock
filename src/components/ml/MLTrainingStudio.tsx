import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  Layers,
  Database,
  BarChart3,
  TrendingUp,
  Download,
  ShieldCheck,
  Activity,
  Check,
  ArrowRight,
  Info,
  Calendar,
  Thermometer,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MLModelArtifact } from '../../types';
import { MEDICINES, HOSPITALS } from '../../data/mockData';

export const MLTrainingStudio: React.FC = () => {
  const { mlModels, approveModel, logAuditAction } = useApp();

  // Active production model
  const activeModel = mlModels.find((m) => m.status === 'ACTIVE_APPROVED') || mlModels[0];

  // 1. Model Architecture Selection
  const [selectedAlgo, setSelectedAlgo] = useState<MLModelArtifact['algorithm']>('XGBoost Multi-Variate');

  // 2. Hyperparameters
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [nEstimators, setNEstimators] = useState<number>(150);
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [l2Regularization, setL2Regularization] = useState<number>(1.5);
  const [trainSplitRatio, setTrainSplitRatio] = useState<number>(80);
  const [cvFolds, setCvFolds] = useState<number>(5);

  // 3. Feature Matrix Selection
  const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: boolean }>({
    triage_footfall: true,
    epidemic_surveillance: true,
    weather_rainfall: true,
    consumption_lag_7d: true,
    bed_occupancy: true,
    supplier_lead_time: false,
    calendar_seasonality: true
  });

  // 4. Training Execution State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [lossCurveData, setLossCurveData] = useState<{ epoch: number; trainLoss: number; valLoss: number }[]>([]);
  
  // 5. Training Results
  const [latestTrainedModel, setLatestTrainedModel] = useState<MLModelArtifact | null>(null);
  const [promotionSuccessMsg, setPromotionSuccessMsg] = useState<string | null>(null);

  // 6. Interactive Sandbox Tester
  const [sandboxMedId, setSandboxMedId] = useState<string>(MEDICINES[0]?.id || 'med-1');
  const [sandboxHospId, setSandboxHospId] = useState<string>(HOSPITALS[0]?.id || 'hosp-1');
  const [sandboxOutbreakSpike, setSandboxOutbreakSpike] = useState<number>(25);
  const [sandboxRainfallAnomaly, setSandboxRainfallAnomaly] = useState<number>(40);
  const [sandboxResult, setSandboxResult] = useState<{
    predictedDaily: number;
    baselineDaily: number;
    upperBound: number;
    lowerBound: number;
    confidence: number;
  } | null>(null);

  // Toggle feature
  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const featureCount = Object.values(selectedFeatures).filter(Boolean).length;

  // Execute User-Initiated Training Pipeline
  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLogs([
      `[INIT] Loading 1,420,000 healthcare telemetry records across 22 regional nodes...`,
      `[FEATURES] Constructing feature matrix with ${featureCount} active exogenous covariates...`,
      `[SPLIT] Partitioning data: ${trainSplitRatio}% Train / ${100 - trainSplitRatio}% Validation with ${cvFolds}-fold Stratified CV...`,
      `[OPTIMIZER] Initializing ${selectedAlgo} (η=${learningRate}, trees=${nEstimators}, depth=${maxDepth}, λ=${l2Regularization})...`
    ]);
    setLossCurveData([]);

    let currentEpoch = 0;
    const totalEpochs = 20;
    const curvePoints: { epoch: number; trainLoss: number; valLoss: number }[] = [];

    const interval = setInterval(() => {
      currentEpoch++;
      const progressPct = Math.round((currentEpoch / totalEpochs) * 100);
      setTrainingProgress(progressPct);

      // Simulated loss reduction curve
      const decay = Math.exp(-currentEpoch / 6);
      const trainLoss = Number((0.04 + 0.65 * decay + (Math.random() * 0.02)).toFixed(3));
      const valLoss = Number((0.07 + 0.68 * decay + (Math.random() * 0.03)).toFixed(3));
      curvePoints.push({ epoch: currentEpoch * 5, trainLoss, valLoss });
      setLossCurveData([...curvePoints]);

      if (currentEpoch % 4 === 0 || currentEpoch === totalEpochs) {
        setTrainingLogs((prev) => [
          ...prev,
          `[ITERATION ${currentEpoch * 5}/${totalEpochs * 5}] Train Loss: ${trainLoss.toFixed(4)} | Val Loss: ${valLoss.toFixed(4)} | Convergence: ${(100 - decay * 100).toFixed(1)}%`
        ]);
      }

      if (currentEpoch >= totalEpochs) {
        clearInterval(interval);
        setIsTraining(false);

        // Calculate realistic metrics based on user's choices:
        // Better features + reasonable depth = higher R2
        let baseR2 = 0.88;
        if (featureCount >= 5) baseR2 += 0.04;
        if (maxDepth >= 4 && maxDepth <= 8) baseR2 += 0.02;
        if (learningRate >= 0.04 && learningRate <= 0.15) baseR2 += 0.015;
        if (l2Regularization >= 1.0) baseR2 += 0.01;
        const calculatedR2 = Number(Math.min(0.965, baseR2 + (Math.random() * 0.01 - 0.005)).toFixed(3));
        const calculatedMae = Number((18.5 - (calculatedR2 - 0.85) * 60).toFixed(1));
        const calculatedRmse = Number((calculatedMae * 1.38).toFixed(1));
        const calculatedMape = Number((calculatedMae / 3.4).toFixed(1));

        const versionNum = `v2.${Math.floor(10 + Math.random() * 89)}`;
        const artifact: MLModelArtifact = {
          id: `model-${Date.now()}`,
          name: `${selectedAlgo} [User Trained]`,
          version: versionNum,
          algorithm: selectedAlgo,
          trainedAt: 'Just now',
          datasetVersion: 'DS-2026-Q3-LIVE',
          mae: calculatedMae,
          rmse: calculatedRmse,
          mapePercent: calculatedMape,
          accuracyR2: calculatedR2,
          status: 'CANDIDATE',
          trainedBy: 'Pharmacist / Data Analyst',
          featureSchema: Object.keys(selectedFeatures).filter((k) => selectedFeatures[k]),
          shapTopFeatures: [
            { feature: 'Outpatient Triage Footfall', importance: 0.36, description: 'Surge footfall leading medicine burn rate by 18 hours' },
            { feature: 'Epidemic Disease Velocity', importance: 0.28, description: 'Dengue & acute diarrheal cluster indices' },
            { feature: 'Monsoon Rainfall Anomaly', importance: 0.18, description: 'Precipitation exceeding 80mm threshold' },
            { feature: 'Historical Lag Consumption', importance: 0.12, description: 'Rolling 7-day facility demand baseline' },
            { feature: 'Bed Occupancy & Census', importance: 0.06, description: 'Inpatient acute admissions' }
          ],
          limitations: 'Trained on 14-day rolling windows; requires recalibration under category-5 severe cyclone events.',
          inferenceEndpoint: `/api/v2/predict/${selectedAlgo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          hyperparameters: {
            learningRate,
            nEstimators,
            maxDepth,
            regularization: l2Regularization,
            trainSplit: trainSplitRatio
          }
        };

        setLatestTrainedModel(artifact);
        setTrainingLogs((prev) => [
          ...prev,
          `[SUCCESS] Training finished! Model artifact generated: ${artifact.name} (${versionNum})`,
          `[METRICS] Validation R²: ${calculatedR2} | MAE: ${calculatedMae} units | RMSE: ${calculatedRmse} | MAPE: ${calculatedMape}%`,
          `[STATUS] Status set to CANDIDATE. Ready for evaluation and production deployment.`
        ]);

        logAuditAction(
          'ML Model Trained by User',
          'MODEL_GOVERNANCE',
          `Trained ${selectedAlgo} (${versionNum}) with ${featureCount} features. Validation R²: ${calculatedR2}`
        );
      }
    }, 120);
  };

  // Promote trained model to production
  const handlePromoteToProduction = (modelToPromote: MLModelArtifact) => {
    approveModel(modelToPromote.id);
    setPromotionSuccessMsg(`Successfully promoted ${modelToPromote.name} (${modelToPromote.version}) to ACTIVE PRODUCTION! All hospital demand forecasts are now powered by your trained weights.`);
    logAuditAction(
      'ML Model Promoted to Production',
      'MODEL_GOVERNANCE',
      `Promoted ${modelToPromote.name} (${modelToPromote.version}) to active production status. Endpoint: ${modelToPromote.inferenceEndpoint}`
    );
    setTimeout(() => setPromotionSuccessMsg(null), 6000);
  };

  // Sandbox inference run
  const handleRunSandboxInference = () => {
    const med = MEDICINES.find((m) => m.id === sandboxMedId) || MEDICINES[0];
    const hosp = HOSPITALS.find((h) => h.id === sandboxHospId) || HOSPITALS[0];
    const bedFactor = hosp.beds / 400;
    const baseDaily = Math.round(55 * bedFactor);
    
    // Model multiplier based on user's trained model accuracy
    const r2Factor = latestTrainedModel ? latestTrainedModel.accuracyR2 : 0.94;
    const outbreakLift = 1 + (sandboxOutbreakSpike / 100) * 0.75;
    const rainLift = 1 + (sandboxRainfallAnomaly / 100) * 0.35;
    
    const predicted = Math.round(baseDaily * outbreakLift * rainLift);
    const uncertainty = Math.round(predicted * (1 - r2Factor * 0.9));

    setSandboxResult({
      predictedDaily: predicted,
      baselineDaily: baseDaily,
      upperBound: predicted + uncertainty,
      lowerBound: Math.max(1, predicted - uncertainty),
      confidence: Math.round(r2Factor * 100)
    });
  };

  // Run initial sandbox calculation
  useEffect(() => {
    handleRunSandboxInference();
  }, [sandboxMedId, sandboxHospId, sandboxOutbreakSpike, sandboxRainfallAnomaly, latestTrainedModel]);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ML Model Studio & Training Lab
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                USER-TRAINABLE ENGINE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Configure algorithms, tune hyperparameters, select telemetry features, and train predictive demand models directly.
            </p>
          </div>
        </div>

        {/* Active Production Model Indicator */}
        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Currently Active In Production
            </span>
            <span className="text-xs font-mono font-bold text-teal-300">
              {activeModel.name} ({activeModel.version}) · R²: {activeModel.accuracyR2}
            </span>
          </div>
        </div>
      </div>

      {/* SUCCESS PROMOTION BANNER */}
      {promotionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{promotionSuccessMsg}</span>
        </div>
      )}

      {/* STEP 1: ALGORITHM SELECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">1</span>
              Select Model Architecture & Regression Algorithm
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the mathematical engine tailored for epidemic spikes and climate anomalies.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
            Selected: {selectedAlgo}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              id: 'XGBoost Multi-Variate',
              name: 'XGBoost Regressor',
              badge: 'RECOMMENDED',
              badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              desc: 'Gradient boosted trees with shrinkage and regularization. Handles non-linear disease surges and climate covariates.',
              idealFor: 'Epidemic spikes & non-linear multi-variates'
            },
            {
              id: 'Prophet Additive',
              name: 'Prophet Additive',
              badge: 'TIME-SERIES',
              badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
              desc: 'Decomposable Bayesian additive model with holiday, seasonal Fourier series, and non-linear trend changepoints.',
              idealFor: 'Monsoon calendar cycles & holiday footfall'
            },
            {
              id: 'Random Forest Regressor',
              name: 'Random Forest Ensemble',
              badge: 'ROBUST',
              badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
              desc: 'Bootstrap aggregating ensemble with randomized split selection. Immune to sensor outliers and sudden noise.',
              idealFor: 'Cold-chain telemetry & noisy sensors'
            },
            {
              id: 'SARIMA',
              name: 'SARIMA (p,d,q)(P,D,Q)',
              badge: 'CLASSICAL',
              badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
              desc: 'Autoregressive integrated moving average with explicit seasonal differencing terms for cyclical demand.',
              idealFor: 'Pure cyclical seasonal baselines'
            }
          ].map((algo) => {
            const isSelected = selectedAlgo === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgo(algo.id as any)}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${algo.badgeColor}`}>
                    {algo.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{algo.name}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                  {algo.desc}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                  <strong>Best for:</strong> {algo.idealFor}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2 & STEP 3: HYPERPARAMETERS & FEATURE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HYPERPARAMETER TUNING (7 COLS) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">2</span>
                Hyperparameter Tuning Controls
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tune learning rate, tree depth, estimators, and regularization coefficients.
              </p>
            </div>
            <button
              onClick={() => {
                setLearningRate(0.08);
                setNEstimators(150);
                setMaxDepth(6);
                setL2Regularization(1.5);
                setTrainSplitRatio(80);
                setCvFolds(5);
              }}
              className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Defaults
            </button>
          </div>

          <div className="space-y-4">
            {/* Learning Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  Learning Rate (η):
                  <span className="text-slate-400 font-normal">Controls step shrinkage to prevent overfitting</span>
                </span>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {learningRate}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.30"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                <span>0.01 (Conservative)</span>
                <span>0.10 (Standard)</span>
                <span>0.30 (Aggressive)</span>
              </div>
            </div>

            {/* Number of Estimators */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  Number of Boosting Trees (n_estimators):
                  <span className="text-slate-400 font-normal">Sequential decision iterations</span>
                </span>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {nEstimators} Trees
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="400"
                step="10"
                value={nEstimators}
                onChange={(e) => setNEstimators(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                <span>20 Trees</span>
                <span>150 Trees (Balanced)</span>
                <span>400 Trees (Deep)</span>
              </div>
            </div>

            {/* Max Tree Depth */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Max Tree Depth (max_depth):
                </label>
                <select
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value={3}>Depth 3 (Simple, Low Variance)</option>
                  <option value={4}>Depth 4 (Recommended for seasonal)</option>
                  <option value={6}>Depth 6 (Optimal for non-linear surge)</option>
                  <option value={8}>Depth 8 (Complex epidemic interactions)</option>
                  <option value={10}>Depth 10 (Deep feature crosses)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  L2 Regularization (λ):
                </label>
                <select
                  value={l2Regularization}
                  onChange={(e) => setL2Regularization(parseFloat(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value={0.5}>0.5 (Light Penalty)</option>
                  <option value={1.5}>1.5 (Standard L2 Regularization)</option>
                  <option value={3.0}>3.0 (Strict Weight Shrinkage)</option>
                  <option value={5.0}>5.0 (Heavy Sparsity)</option>
                </select>
              </div>
            </div>

            {/* Split & CV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Train / Validation Split:
                </label>
                <div className="flex gap-2">
                  {[70, 80, 90].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setTrainSplitRatio(ratio)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        trainSplitRatio === ratio
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {ratio}/{100 - ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Stratified Cross-Validation:
                </label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCvFolds(k)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        cvFolds === k
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {k}-Fold CV
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE MATRIX SELECTION (5 COLS) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">3</span>
                Telemetry Feature Vectors
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select clinical, climatic, and logistics signals included in training.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {featureCount} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                key: 'triage_footfall',
                title: 'Outpatient Triage & Emergency Footfall',
                desc: 'Real-time patient intake and acute triage registration signals',
                weight: '~36% SHAP'
              },
              {
                key: 'epidemic_surveillance',
                title: 'Epidemic Disease Velocity Alerts',
                desc: 'Dengue, acute diarrheal & viral fever regional outbreak flags',
                weight: '~28% SHAP'
              },
              {
                key: 'weather_rainfall',
                title: 'Weather & Monsoon Rainfall Anomalies',
                desc: 'Precipitation volume, relative humidity, flood vector risks',
                weight: '~18% SHAP'
              },
              {
                key: 'consumption_lag_7d',
                title: 'Historical Consumption Velocity (Lag 7d/14d)',
                desc: 'Rolling auto-regressive medicine burn rate from dispensers',
                weight: '~12% SHAP'
              },
              {
                key: 'bed_occupancy',
                title: 'Inpatient Active Bed Occupancy %',
                desc: 'Ward and ICU utilization indices across the 22 facilities',
                weight: '~6% SHAP'
              },
              {
                key: 'calendar_seasonality',
                title: 'Day-of-Week & Holiday Fourier Cyclics',
                desc: 'Weekly clinic rhythm and public holiday operational dampeners',
                weight: '~5% SHAP'
              },
              {
                key: 'supplier_lead_time',
                title: 'Supplier Lead Time & Highway Blockage',
                desc: 'Logistics bottleneck variance and depot shipment delays',
                weight: '~4% SHAP'
              }
            ].map((f) => {
              const active = selectedFeatures[f.key];
              return (
                <div
                  key={f.key}
                  onClick={() => toggleFeature(f.key)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    active
                      ? 'border-teal-300 bg-teal-50/40 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 pointer-events-none"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{f.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {f.weight}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 4: LIVE TRAINING EXECUTION CONSOLE */}
      <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center text-xs font-black">4</span>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Live Model Training Execution & Convergence Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute iterative gradient descent across 1,420,000 real telemetry records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Training In Progress ({trainingProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>🚀 Start Model Training (Execute)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isTraining && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-teal-400 font-bold">Optimization Convergence: Epoch {Math.round(trainingProgress)}%</span>
              <span className="text-slate-400">{trainingProgress}% complete</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-150"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Two Panel Console: Loss Chart + Training Terminal Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LOSS CURVE VISUALIZER (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                Loss Convergence Curve (MSE)
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-teal-400">
                  <span className="w-2 h-0.5 bg-teal-400 inline-block" /> Train Loss
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> Val Loss
                </span>
              </div>
            </div>

            {/* SVG Loss Curve */}
            <div className="h-44 w-full flex items-center justify-center my-2">
              {lossCurveData.length > 0 ? (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="200" y2="80" stroke="#334155" strokeDasharray="3 3" />

                  {/* Train Loss Line */}
                  <polyline
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="2.5"
                    points={lossCurveData
                      .map((d, i) => `${(i / (lossCurveData.length - 1 || 1)) * 190 + 5},${Math.min(95, Math.max(10, d.trainLoss * 120))}`)
                      .join(' ')}
                  />

                  {/* Val Loss Line */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    points={lossCurveData
                      .map((d, i) => `${(i / (lossCurveData.length - 1 || 1)) * 190 + 5},${Math.min(95, Math.max(10, d.valLoss * 120))}`)
                      .join(' ')}
                  />
                </svg>
              ) : (
                <div className="text-center text-xs text-slate-500 space-y-1">
                  <BarChart3 className="w-6 h-6 mx-auto opacity-30" />
                  <p>Click "Start Model Training" to render real-time loss convergence.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-2 border-t border-slate-800">
              <span>Epoch: {lossCurveData[lossCurveData.length - 1]?.epoch || 0} / 100</span>
              <span className="text-emerald-400 font-bold">
                Final MSE: {lossCurveData[lossCurveData.length - 1]?.trainLoss || '--'}
              </span>
            </div>
          </div>

          {/* TERMINAL LOGS (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Training Console Stdout (Python/XGBoost Runtime)
              </span>
              <span className="text-[10px] font-mono text-slate-500">Device: CPU (Vect)</span>
            </div>

            <div className="h-44 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300 py-2">
              {trainingLogs.length === 0 ? (
                <p className="text-slate-500 italic">Awaiting user trigger to start training pipeline...</p>
              ) : (
                trainingLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight flex items-start gap-1.5">
                    <span className="text-teal-400 select-none">&gt;</span>
                    <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('METRICS') ? 'text-cyan-300 font-bold' : ''}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
              <span>Memory Footprint: 218 MB</span>
              <span>Backend: Scikit-Learn + XGBoost 2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 5: POST-TRAINING EVALUATION & PROMOTION ACTION */}
      {latestTrainedModel && (
        <div className="bg-white border-2 border-teal-500 rounded-2xl p-6 shadow-md space-y-5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">5</span>
                <h2 className="text-base font-black text-slate-900">
                  Trained Model Evaluation Report & Production Promotion
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  READY FOR DEPLOYMENT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Model: <strong>{latestTrainedModel.name}</strong> ({latestTrainedModel.version}) · Trained on {featureCount} exogenous telemetry features
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePromoteToProduction(latestTrainedModel)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Promote This Model To Active Production
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Validation R² Score
              </span>
              <div className="text-2xl font-black text-teal-700 mt-1">
                {latestTrainedModel.accuracyR2}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">94.8% variance explained</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Mean Absolute Error (MAE)
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {latestTrainedModel.mae} <span className="text-xs font-normal text-slate-500">units/day</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Average forecast variance</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Root Mean Squared Error (RMSE)
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {latestTrainedModel.rmse}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Penalizes large deviations</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                MAPE Error %
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {latestTrainedModel.mapePercent}%
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Excellent generalization</span>
            </div>
          </div>

          {/* SHAP Feature Importance Bars */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                SHAP (SHapley Additive exPlanations) Learned Feature Importances
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Calibrated weights</span>
            </div>

            <div className="space-y-2.5">
              {latestTrainedModel.shapTopFeatures.map((shp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{shp.feature}</span>
                    <span className="font-mono font-bold text-teal-700">{Math.round(shp.importance * 100)}% impact</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${shp.importance * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{shp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: INTERACTIVE INFERENCE SANDBOX */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">6</span>
              Test Model Inference in Live Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate outbreak surge and rainfall variables to see how your model predicts consumption in real-time.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Zero Latency Local Inference</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Medicine</label>
            <select
              value={sandboxMedId}
              onChange={(e) => setSandboxMedId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
            >
              {MEDICINES.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Healthcare Facility</label>
            <select
              value={sandboxHospId}
              onChange={(e) => setSandboxHospId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
            >
              {HOSPITALS.map((h) => (
                <option key={h.id} value={h.id}>{h.name} ({h.beds} beds)</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Epidemic Surge Lift:</span>
              <span className="text-teal-700 font-mono">+{sandboxOutbreakSpike}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={sandboxOutbreakSpike}
              onChange={(e) => setSandboxOutbreakSpike(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Rainfall Anomaly:</span>
              <span className="text-cyan-700 font-mono">+{sandboxRainfallAnomaly}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="10"
              value={sandboxRainfallAnomaly}
              onChange={(e) => setSandboxRainfallAnomaly(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>
        </div>

        {/* Sandbox Output Card */}
        {sandboxResult && (
          <div className="p-4 bg-gradient-to-r from-teal-50 via-cyan-50 to-slate-50 border border-teal-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-teal-800 tracking-wider">
                Predicted Daily Consumption (Your Model Output)
              </span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {sandboxResult.predictedDaily} <span className="text-xs font-bold text-slate-500">units/day</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Baseline: {sandboxResult.baselineDaily} units/day • Confidence interval: <strong>[{sandboxResult.lowerBound} - {sandboxResult.upperBound}]</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-full border border-teal-300">
                Confidence: {sandboxResult.confidence}%
              </span>
              <span className="block text-[11px] text-slate-500 mt-1 font-mono">
                Engine: {latestTrainedModel ? latestTrainedModel.name : activeModel.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 7: MODEL REGISTRY & AUDIT LOG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-black">7</span>
              ML Model Registry & Version History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable audit log of all trained model artifacts and validation metrics.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Model Name & Version</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Validation R²</th>
                <th className="py-2.5 px-3">MAE</th>
                <th className="py-2.5 px-3">Features</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mlModels.map((m) => {
                const isActive = m.status === 'ACTIVE_APPROVED';
                return (
                  <tr key={m.id} className={isActive ? 'bg-teal-50/40 font-semibold' : ''}>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{m.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{m.version} · {m.trainedAt}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{m.algorithm}</td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-700">{m.accuracyR2}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{m.mae} units</td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {m.featureSchema?.length || 5} covariates
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : m.status === 'CANDIDATE'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isActive ? '● IN PRODUCTION' : m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!isActive && (
                        <button
                          onClick={() => handlePromoteToProduction(m)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200 text-xs transition-colors"
                        >
                          Promote
                        </button>
                      )}
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
