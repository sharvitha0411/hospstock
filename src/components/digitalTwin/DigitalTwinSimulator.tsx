import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  CloudRain,
  Wind,
  Truck,
  ShieldAlert,
  Lock,
  PackageX,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Zap,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import {
  DisruptionScenarioType,
  SimulationParams,
  SimulationComparison,
  SupplyChainNode,
  SupplyChainEdge
} from '../../types';
import { DISTRICTS } from '../../data/mockData';
import { runDisruptionSimulation } from '../../services/simulationEngine';
import { useApp } from '../../context/AppContext';

export const DigitalTwinSimulator: React.FC = () => {
  const {
    currentUser,
    generateOneClickRecoveryPlan,
    recoveryPlans,
    approveRecoveryPlan,
    logAuditAction
  } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<DisruptionScenarioType>('FLOOD');
  const [affectedDistrict, setAffectedDistrict] = useState<string>('dist-3'); // River District default
  const [severity, setSeverity] = useState<number>(4);
  const [roadAccessibility, setRoadAccessibility] = useState<number>(40);
  const [warehouseImpact, setWarehouseImpact] = useState<number>(55);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [isSimulating, setIsSimulating] = useState(false);
  const [executedActionId, setExecutedActionId] = useState<string | null>(null);
  const [showRecoveryPlanModal, setShowRecoveryPlanModal] = useState<boolean>(false);
  const [activePlan, setActivePlan] = useState<any>(recoveryPlans[0] || null);

  // Simulation output state
  const [simOutput, setSimOutput] = useState<{
    comparison: SimulationComparison;
    nodes: SupplyChainNode[];
    edges: SupplyChainEdge[];
    summaryNarrative: string;
  }>(() =>
    runDisruptionSimulation({
      scenarioType: 'FLOOD',
      affectedDistrictId: 'dist-3',
      severity: 4,
      roadAccessibilityPercent: 40,
      warehouseCapacityReductionPercent: 55,
      supplierDisruptionLevel: 60,
      durationDays: 7
    })
  );

  const scenarioTypes = [
    { type: 'FLOOD', label: 'Monsoon Flood', icon: CloudRain, color: 'text-blue-500' },
    { type: 'CYCLONE', label: 'Coastal Cyclone', icon: Wind, color: 'text-teal-500' },
    { type: 'SUPPLIER_FAILURE', label: 'Supplier Outage', icon: Truck, color: 'text-amber-500' },
    { type: 'ROAD_BLOCKAGE', label: 'Bridge / Road Block', icon: ShieldAlert, color: 'text-rose-500' },
    { type: 'LOCKDOWN', label: 'District Quarantine', icon: Lock, color: 'text-purple-500' },
    { type: 'WAREHOUSE_REDUCTION', label: 'Depot Fire / Loss', icon: PackageX, color: 'text-orange-500' },
  ] as const;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = runDisruptionSimulation({
        scenarioType: selectedScenario,
        affectedDistrictId: affectedDistrict,
        severity,
        roadAccessibilityPercent: roadAccessibility,
        warehouseCapacityReductionPercent: warehouseImpact,
        supplierDisruptionLevel: 60,
        durationDays
      });
      setSimOutput(result);
      setIsSimulating(false);
    }, 700);
  };

  const handleResetToBaseline = () => {
    setSeverity(1);
    setRoadAccessibility(100);
    setWarehouseImpact(0);
    setDurationDays(3);
    const result = runDisruptionSimulation({
      scenarioType: 'FLOOD',
      affectedDistrictId: affectedDistrict,
      severity: 1,
      roadAccessibilityPercent: 100,
      warehouseCapacityReductionPercent: 0,
      supplierDisruptionLevel: 0,
      durationDays: 3
    });
    setSimOutput(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Supply Chain Digital Twin Simulator
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
              Signature Module 5
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate climate, infrastructure, and supplier shocks before they materialize to test resilience and failover pathways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToBaseline}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-600/20 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Computing Stress Matrix...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Interactive Scenario Selection Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {scenarioTypes.map((sc) => {
          const Icon = sc.icon;
          const isSelected = selectedScenario === sc.type;
          return (
            <button
              key={sc.type}
              onClick={() => {
                setSelectedScenario(sc.type as DisruptionScenarioType);
                if (sc.type === 'FLOOD') {
                  setRoadAccessibility(35);
                  setWarehouseImpact(60);
                  setSeverity(4);
                } else if (sc.type === 'SUPPLIER_FAILURE') {
                  setRoadAccessibility(85);
                  setWarehouseImpact(30);
                  setSeverity(4);
                } else if (sc.type === 'CYCLONE') {
                  setRoadAccessibility(25);
                  setWarehouseImpact(70);
                  setSeverity(5);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-50/80 border-cyan-400 ring-2 ring-cyan-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${sc.color}`} />
              <div className="font-extrabold text-xs text-slate-900">{sc.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Disruption Model</div>
            </button>
          );
        })}
      </div>

      {/* Simulator Parameters Configurator */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* District */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">Impact Epicenter</label>
          <select
            value={affectedDistrict}
            onChange={(e) => setAffectedDistrict(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="text-slate-500">Shock Severity</span>
            <span className="text-rose-600 font-mono">Category {severity} / 5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer"
          />
        </div>

        {/* Road Accessibility */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="text-slate-500">Road Corridor Accessibility</span>
            <span className="text-indigo-600 font-mono">{roadAccessibility}% Open</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={roadAccessibility}
            onChange={(e) => setRoadAccessibility(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Warehouse Impact */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="text-slate-500">Warehouse Submersion / Delay</span>
            <span className="text-amber-600 font-mono">-{warehouseImpact}% Capacity</span>
          </div>
          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={warehouseImpact}
            onChange={(e) => setWarehouseImpact(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>

      {/* BEFORE VS AFTER SIMULATION COMPARISON CARDS */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h2 className="font-extrabold text-base text-white">
                  Before vs After Simulation Stress Analysis
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{simOutput.summaryNarrative}</p>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50">
              Scenario: {selectedScenario}
            </span>
          </div>

          {/* Metric Comparison Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {/* Metric 1: Hospitals at Risk */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Hospitals at Risk</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-slate-400 text-sm font-semibold">{simOutput.comparison.before.hospitalsAtRisk}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-rose-400 text-2xl font-black">{simOutput.comparison.after.hospitalsAtRisk}</span>
              </div>
              <span className="text-[10px] font-bold text-rose-400">
                +{simOutput.comparison.after.hospitalsAtRisk - simOutput.comparison.before.hospitalsAtRisk} facilities compromised
              </span>
            </div>

            {/* Metric 2: Medicines Affected */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Medicines Affected</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-slate-400 text-sm font-semibold">{simOutput.comparison.before.medicinesAffected}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-rose-400 text-2xl font-black">{simOutput.comparison.after.medicinesAffected}</span>
              </div>
              <span className="text-[10px] font-bold text-rose-400">
                +{simOutput.comparison.after.medicinesAffected - simOutput.comparison.before.medicinesAffected} formulary items
              </span>
            </div>

            {/* Metric 3: Expected Stock-outs */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Expected Stock-Outs</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-slate-400 text-sm font-semibold">{simOutput.comparison.before.expectedStockouts}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-rose-400 text-2xl font-black">{simOutput.comparison.after.expectedStockouts}</span>
              </div>
              <span className="text-[10px] font-bold text-rose-400">
                +{simOutput.comparison.after.expectedStockouts - simOutput.comparison.before.expectedStockouts} stock-out events
              </span>
            </div>

            {/* Metric 4: Average Delivery Time */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Avg Delivery Time</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-slate-400 text-sm font-semibold">{simOutput.comparison.before.avgDeliveryTimeMinutes}m</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-amber-400 text-2xl font-black">{simOutput.comparison.after.avgDeliveryTimeMinutes}m</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400">
                +{simOutput.comparison.after.avgDeliveryTimeMinutes - simOutput.comparison.before.avgDeliveryTimeMinutes}m transit penalty
              </span>
            </div>

            {/* Metric 5: Resilience Score */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Network Resilience</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-teal-400 text-sm font-semibold">{simOutput.comparison.before.resilienceScore}%</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-rose-400 text-2xl font-black">{simOutput.comparison.after.resilienceScore}%</span>
              </div>
              <span className="text-[10px] font-bold text-rose-400">
                {simOutput.comparison.after.resilienceScore - simOutput.comparison.before.resilienceScore}% drop under shock
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATED DIGITAL TWIN NETWORK GRAPH */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-white">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="font-extrabold text-sm tracking-tight">
                Live Supply Chain Topology & Active Flow Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-echelon flow: Suppliers → Regional Warehouses → Hospitals → Clinical Demand
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-teal-400 rounded-full"></span>
              <span className="text-slate-300">Active Link</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500 rounded-full"></span>
              <span className="text-rose-300">Blocked / Flooded Route</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full border-b border-dashed"></span>
              <span className="text-cyan-300">Activated Reroute Bypass</span>
            </div>
          </div>
        </div>

        {/* SVG Network Graph */}
        <div className="relative w-full h-[360px] my-2 select-none">
          <svg viewBox="0 0 920 540" className="w-full h-full">
            {/* Edges / Routes */}
            {simOutput.edges.map((edge) => {
              const srcNode = simOutput.nodes.find((n) => n.id === edge.source);
              const tgtNode = simOutput.nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isBlocked = edge.status === 'BLOCKED';
              const isRerouted = edge.status === 'REROUTED';

              const strokeColor = isBlocked ? '#f43f5e' : isRerouted ? '#06b6d4' : '#14b8a6';
              const strokeWidth = isBlocked ? 3 : isRerouted ? 3 : 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isBlocked ? '6 6' : isRerouted ? '4 4' : 'none'}
                    className={!isBlocked ? 'animate-flow' : ''}
                    opacity={isBlocked ? 0.9 : 0.7}
                  />

                  {/* Midpoint marker for blocked road */}
                  {isBlocked && (
                    <g transform={`translate(${(srcNode.x + tgtNode.x) / 2}, ${(srcNode.y + tgtNode.y) / 2})`}>
                      <circle cx="0" cy="0" r="10" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="0" y="3.5" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                        ✕
                      </text>
                    </g>
                  )}

                  {isRerouted && (
                    <g transform={`translate(${(srcNode.x + tgtNode.x) / 2}, ${(srcNode.y + tgtNode.y) / 2})`}>
                      <circle cx="0" cy="0" r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                      <text x="0" y="2.5" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                        ✓
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {simOutput.nodes.map((node) => {
              const isDisrupted = node.status === 'DISRUPTED';
              const isCongested = node.status === 'CONGESTED';
              const isRerouted = node.status === 'REROUTED';

              const nodeColor = isDisrupted
                ? '#f43f5e'
                : isCongested
                ? '#fbbf24'
                : isRerouted
                ? '#06b6d4'
                : '#10b981';

              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Ping effect for disrupted node */}
                  {isDisrupted && (
                    <circle cx="0" cy="0" r="22" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping opacity-60" />
                  )}

                  {/* Node Body */}
                  <rect
                    x="-45"
                    y="-16"
                    width="90"
                    height="32"
                    rx="8"
                    fill="#0f172a"
                    stroke={nodeColor}
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />

                  {/* Node Label */}
                  <text
                    x="0"
                    y="-1"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#f8fafc"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>

                  {/* Sub-label for type */}
                  <text
                    x="0"
                    y="10"
                    fontSize="7.5"
                    fontWeight="600"
                    fill={nodeColor}
                    textAnchor="middle"
                  >
                    {node.type.replace('_', ' ')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* RECOMMENDED RESPONSE PROTOCOL */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                AI Automated Resilience Response Action Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized mitigation directives generated by prescriptive optimization algorithm
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const plan = generateOneClickRecoveryPlan(selectedScenario as any);
                setActivePlan(plan);
                setShowRecoveryPlanModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
              <span>Generate One-Click Recovery Plan</span>
            </button>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {simOutput.comparison.recommendedActions.length} Directives
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {simOutput.comparison.recommendedActions.map((act, i) => (
            <div
              key={act.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs">{act.title}</h4>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      act.priority === 'IMMEDIATE'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {act.priority}
                  </span>
                </div>
                <p className="text-slate-600 mt-2 leading-relaxed">{act.detail}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="font-semibold text-teal-700 text-[11px]">{act.impact}</span>
                {executedActionId === act.id ? (
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Executed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setExecutedActionId(act.id);
                      logAuditAction('Authorized Simulation Directive', 'SIMULATION', `Executed directive ${act.title}`);
                    }}
                    className="px-2.5 py-1 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] transition-colors"
                  >
                    Authorize Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ONE-CLICK RECOVERY PLAN MODAL (10-Point Resilience Protocol) */}
      {showRecoveryPlanModal && activePlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 space-y-5 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    One-Click Resilience Recovery Plan ({activePlan.scenarioType})
                  </h3>
                  <p className="text-xs text-slate-500">10-Point Decision Support Protocol for District Health Administrator</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryPlanModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* 10 Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-h-[60vh] overflow-y-auto pr-2">
              {/* 1. Critical Facilities */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">1. Critical Facilities at Risk:</span>
                <ul className="space-y-1 text-slate-700">
                  {activePlan.criticalFacilities.map((f: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{f.facilityName}</span>
                      <strong className="text-rose-600 font-mono">{f.risk}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Critical Medicines */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">2. Critical Medicines Deficit:</span>
                <ul className="space-y-1 text-slate-700">
                  {activePlan.criticalMedicines.map((m: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{m.medicineName}</span>
                      <strong className="text-rose-600 font-mono">-{m.deficitUnits} units</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Surplus Sources */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">3. Identified Surplus Sources:</span>
                <ul className="space-y-1 text-slate-700">
                  {activePlan.surplusSources.map((s: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{s.facilityName}</span>
                      <strong className="text-emerald-700 font-mono">+{s.surplusUnits} units</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Alternative Suppliers */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">4. Alternative Backup Suppliers:</span>
                <ul className="space-y-1 text-slate-700">
                  {activePlan.alternativeSuppliers.map((sup: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{sup.supplierName}</span>
                      <span className="text-slate-500 font-mono">{sup.leadTimeDays}d lead time ({sup.reliability}% rel.)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Alternative Routes */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">5. Safe Transit Corridors:</span>
                <ul className="space-y-1 text-slate-700">
                  {activePlan.alternativeRoutes.map((r: any, idx: number) => (
                    <li key={idx} className="text-[11px]">
                      <strong>{r.corridor}</strong> (+{r.addedEtaMin}m ETA bypass)
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6, 7 & 8: Emergency Transfers & Priorities */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">6, 7 & 8. Emergency Transfers & Priority:</span>
                <ul className="space-y-1 text-slate-700">
                  {activePlan.emergencyTransfers.map((t: any, idx: number) => (
                    <li key={idx} className="p-2 bg-white rounded border border-slate-200 text-[11px]">
                      <div className="font-bold text-teal-800">{t.medicine} ({t.qty} units)</div>
                      <div className="text-slate-500">{t.from} ➔ {t.to}</div>
                      <span className="text-rose-600 font-bold text-[9px] uppercase">{t.priority} PRIORITY</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 9 & 10: Estimated Time & System Explanation */}
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900">9. Estimated Network Recovery Time:</span>
                  <strong className="text-teal-800 font-mono text-sm">{activePlan.estimatedRecoveryHours} Hours</strong>
                </div>
                <div className="pt-2 border-t border-teal-200/80">
                  <span className="font-bold text-teal-900 block">10. Explainable AI System Narrative:</span>
                  <p className="text-[11px] text-teal-800 mt-1 leading-relaxed">{activePlan.systemExplanation}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer with Human Authorization */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 italic">
                Human confirmation required: {currentUser.name} ({currentUser.roleTitle})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRecoveryPlanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    approveRecoveryPlan(activePlan.id);
                    setShowRecoveryPlanModal(false);
                    setExecutedActionId('all');
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Implement Recovery Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
