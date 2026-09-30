import {
  DisruptionScenarioType,
  SimulationParams,
  SimulationComparison,
  SupplyChainNode,
  SupplyChainEdge
} from '../types';

export function runDisruptionSimulation(params: SimulationParams): {
  comparison: SimulationComparison;
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
  summaryNarrative: string;
} {
  const { scenarioType, severity, roadAccessibilityPercent, warehouseCapacityReductionPercent } = params;

  // Base metrics before disruption
  const before = {
    hospitalsAtRisk: 8,
    medicinesAffected: 12,
    expectedStockouts: 3,
    avgDeliveryTimeMinutes: 42,
    resilienceScore: 84
  };

  // Compute impact multiplier based on severity (1-5)
  const severityMultiplier = 1 + (severity - 1) * 0.45;
  const roadPenalty = (100 - roadAccessibilityPercent) / 100;
  const warehousePenalty = warehouseCapacityReductionPercent / 100;

  const afterHospitalsAtRisk = Math.min(22, Math.round(before.hospitalsAtRisk * severityMultiplier * (1 + roadPenalty * 0.5)));
  const afterMedicinesAffected = Math.min(32, Math.round(before.medicinesAffected * (1 + severityMultiplier * 0.5)));
  const afterExpectedStockouts = Math.min(18, Math.round(before.expectedStockouts * (1 + (roadPenalty + warehousePenalty) * 2.2)));
  const afterAvgDeliveryTimeMinutes = Math.round(before.avgDeliveryTimeMinutes * (1 + roadPenalty * 1.5 + (severity * 0.2)));
  const afterResilienceScore = Math.max(25, Math.round(before.resilienceScore - (severity * 9) - (roadPenalty * 20)));

  const comparison: SimulationComparison = {
    before,
    after: {
      hospitalsAtRisk: afterHospitalsAtRisk,
      medicinesAffected: afterMedicinesAffected,
      expectedStockouts: afterExpectedStockouts,
      avgDeliveryTimeMinutes: afterAvgDeliveryTimeMinutes,
      resilienceScore: afterResilienceScore
    },
    recommendedActions: [
      {
        id: 'act-1',
        type: 'SUPPLIER_FAILOVER',
        title: 'Activate Strategic Backup Depot',
        detail: 'Reroute urgent IV fluids and antibiotics through National Emergency MedReserve (Standby Supplier).',
        impact: '+35% stock throughput restored',
        priority: 'IMMEDIATE'
      },
      {
        id: 'act-2',
        type: 'REDISTRIBUTION',
        title: 'Pre-position 4,500 Units from East Valley',
        detail: 'Deploy inter-hospital transfer from unaffected surplus facilities to high-deficit centers before route congestion worsens.',
        impact: 'Prevents 6 critical hospital stock-outs',
        priority: 'IMMEDIATE'
      },
      {
        id: 'act-3',
        type: 'REROUTE',
        title: 'Enforce Secondary Bypass Transit Corridor',
        detail: 'Divert pharma cargo via Eastern Expressway avoiding flood-inundated arterial link.',
        impact: 'Saves ~38 minutes travel delay per convoy',
        priority: 'HIGH'
      },
      {
        id: 'act-4',
        type: 'STOCK_BUFFER',
        title: 'Elevate Safety Stock Multiplier to 2.5x',
        detail: 'Temporarily increase safety days buffer for top 8 critical emergency life-saving pharmaceuticals.',
        impact: 'Builds 96-hour buffer against secondary shocks',
        priority: 'HIGH'
      }
    ]
  };

  // Build Supply Chain Network Graph nodes & edges
  const isFloodOrBlockage = scenarioType === 'FLOOD' || scenarioType === 'ROAD_BLOCKAGE' || scenarioType === 'CYCLONE';
  const isSupplierFault = scenarioType === 'SUPPLIER_FAILURE';

  const nodes: SupplyChainNode[] = [
    // Suppliers (Left)
    { id: 'node-sup-1', label: 'Apex Pharma', type: 'SUPPLIER', status: 'HEALTHY', x: 80, y: 100 },
    { id: 'node-sup-2', label: 'MediCold Express', type: 'SUPPLIER', status: 'HEALTHY', x: 80, y: 240 },
    { id: 'node-sup-3', label: 'Delta Lifesciences', type: 'SUPPLIER', status: isSupplierFault ? 'DISRUPTED' : 'HEALTHY', x: 80, y: 380 },
    { id: 'node-sup-5', label: 'National Reserve', type: 'SUPPLIER', status: 'REROUTED', x: 80, y: 500 },

    // Warehouses / Depots (Center-Left)
    { id: 'node-wh-1', label: 'Central Hub Alpha', type: 'WAREHOUSE', status: 'HEALTHY', x: 300, y: 150 },
    { id: 'node-wh-2', label: 'Delta River Depot', type: 'WAREHOUSE', status: isFloodOrBlockage ? 'DISRUPTED' : 'HEALTHY', x: 300, y: 350 },

    // Hospitals (Center-Right)
    { id: 'node-hosp-1', label: 'Metro Apex', type: 'HOSPITAL', status: 'CONGESTED', x: 580, y: 120 },
    { id: 'node-hosp-2', label: 'Capital General', type: 'HOSPITAL', status: 'HEALTHY', x: 580, y: 220 },
    { id: 'node-hosp-6', label: 'Coastal Maritime', type: 'HOSPITAL', status: isFloodOrBlockage ? 'DISRUPTED' : 'HEALTHY', x: 580, y: 340 },
    { id: 'node-hosp-9', label: 'River Delta', type: 'HOSPITAL', status: isFloodOrBlockage ? 'DISRUPTED' : 'CONGESTED', x: 580, y: 460 },

    // Patient Demand Zones (Right)
    { id: 'node-dem-1', label: 'Metro Inpatients (1.2k)', type: 'DEMAND_ZONE', status: 'HEALTHY', x: 800, y: 130 },
    { id: 'node-dem-2', label: 'Monsoon Clinic Zone (2.8k)', type: 'DEMAND_ZONE', status: 'CONGESTED', x: 800, y: 360 },
    { id: 'node-dem-3', label: 'Emergency Trauma (450)', type: 'DEMAND_ZONE', status: 'HEALTHY', x: 800, y: 470 }
  ];

  const edges: SupplyChainEdge[] = [
    // Supplier to Warehouses
    { id: 'e-1', source: 'node-sup-1', target: 'node-wh-1', label: 'Primary Link', status: 'ACTIVE', flowRate: 850, travelTimeMin: 35 },
    { id: 'e-2', source: 'node-sup-2', target: 'node-wh-1', label: 'Cold Express', status: 'ACTIVE', flowRate: 320, travelTimeMin: 45 },
    { id: 'e-3', source: 'node-sup-3', target: 'node-wh-2', label: 'Delta Route', status: isFloodOrBlockage || isSupplierFault ? 'BLOCKED' : 'ACTIVE', flowRate: isFloodOrBlockage ? 0 : 540, travelTimeMin: 85 },
    { id: 'e-4', source: 'node-sup-5', target: 'node-wh-1', label: 'Emergency Backup', status: 'REROUTED', flowRate: 750, travelTimeMin: 40 },

    // Warehouses to Hospitals
    { id: 'e-5', source: 'node-wh-1', target: 'node-hosp-1', label: 'Arterial Corridor', status: 'ACTIVE', flowRate: 600, travelTimeMin: 25 },
    { id: 'e-6', source: 'node-wh-1', target: 'node-hosp-2', label: 'East Loop', status: 'ACTIVE', flowRate: 400, travelTimeMin: 30 },
    { id: 'e-7', source: 'node-wh-2', target: 'node-hosp-6', label: 'Coastal Highway', status: isFloodOrBlockage ? 'BLOCKED' : 'ACTIVE', flowRate: isFloodOrBlockage ? 0 : 480, travelTimeMin: 90 },
    { id: 'e-8', source: 'node-wh-2', target: 'node-hosp-9', label: 'River Bridge', status: isFloodOrBlockage ? 'BLOCKED' : 'ACTIVE', flowRate: isFloodOrBlockage ? 0 : 350, travelTimeMin: 110 },
    { id: 'e-9', source: 'node-wh-1', target: 'node-hosp-9', label: 'Northern Diversion', status: isFloodOrBlockage ? 'REROUTED' : 'ACTIVE', flowRate: 310, travelTimeMin: 85 },

    // Hospitals to Demand
    { id: 'e-10', source: 'node-hosp-1', target: 'node-dem-1', label: 'Daily Dispense', status: 'ACTIVE', flowRate: 500, travelTimeMin: 5 },
    { id: 'e-11', source: 'node-hosp-6', target: 'node-dem-2', label: 'Outbreak Outpatient', status: isFloodOrBlockage ? 'BLOCKED' : 'ACTIVE', flowRate: 200, travelTimeMin: 15 },
    { id: 'e-12', source: 'node-hosp-9', target: 'node-dem-3', label: 'Trauma Triage', status: 'ACTIVE', flowRate: 150, travelTimeMin: 8 }
  ];

  const summaryNarrative = `Simulation completed: Under ${scenarioType} severity level ${severity}, road accessibility dropped to ${roadAccessibilityPercent}%. Expected stockouts increased from ${before.expectedStockouts} to ${afterExpectedStockouts} across ${afterHospitalsAtRisk} at-risk healthcare centers. Activating recommended failover actions restores 78% supply continuity.`;

  return {
    comparison,
    nodes,
    edges,
    summaryNarrative
  };
}
