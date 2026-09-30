import {
  InventoryItem,
  MedicineBatch,
  Hospital,
  RiskLevel
} from '../types';
import { INVENTORY_ITEMS, MEDICINE_BATCHES, HOSPITALS } from '../data/mockData';

export interface CalculatedStockRisk extends InventoryItem {
  urgencyLabel: string;
  progressBarColor: string;
}

export function computeStockRisks(items: InventoryItem[] = INVENTORY_ITEMS): CalculatedStockRisk[] {
  return items.map((item) => {
    const burnRate = item.predictedDailyConsumption > 0 ? item.predictedDailyConsumption : item.dailyAvgConsumption;
    const daysUntilStockout = Number((item.currentStock / (burnRate || 1)).toFixed(1));

    let stockStatus: InventoryItem['stockStatus'] = 'HEALTHY';
    let urgencyLabel = `${daysUntilStockout} days remaining`;
    let progressBarColor = 'bg-teal-500';

    if (daysUntilStockout <= 0.9) {
      stockStatus = 'STOCK_OUT_TODAY';
      urgencyLabel = 'STOCK-OUT TODAY';
      progressBarColor = 'bg-rose-600 animate-pulse';
    } else if (daysUntilStockout < 3.0) {
      stockStatus = 'CRITICAL';
      urgencyLabel = `${daysUntilStockout} days remaining`;
      progressBarColor = 'bg-red-500';
    } else if (daysUntilStockout < 7.0) {
      stockStatus = 'WARNING';
      urgencyLabel = `${daysUntilStockout} days remaining`;
      progressBarColor = 'bg-amber-500';
    } else if (item.currentStock > item.safetyStockLevel * 1.8) {
      stockStatus = 'SURPLUS';
      urgencyLabel = `Surplus: ${item.currentStock - item.safetyStockLevel} units`;
      progressBarColor = 'bg-blue-500';
    }

    return {
      ...item,
      daysUntilStockout,
      stockStatus,
      urgencyLabel,
      progressBarColor
    };
  });
}

export function getNearExpiryBatches(batches: MedicineBatch[] = MEDICINE_BATCHES): MedicineBatch[] {
  return [...batches].sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function calculateHospitalRisk(hospitalId: string): {
  riskLevel: RiskLevel;
  riskScore: number;
  criticalCount: number;
  surplusCount: number;
  daysToFirstStockout: number;
} {
  const hospital = HOSPITALS.find((h) => h.id === hospitalId);
  const items = computeStockRisks().filter((i) => i.hospitalId === hospitalId);

  const criticalCount = items.filter((i) => i.stockStatus === 'CRITICAL' || i.stockStatus === 'STOCK_OUT_TODAY').length;
  const surplusCount = items.filter((i) => i.stockStatus === 'SURPLUS').length;
  const minDays = items.length > 0 ? Math.min(...items.map((i) => i.daysUntilStockout)) : 30;

  let riskScore = 20;
  if (criticalCount >= 3 || minDays < 2) {
    riskScore = Math.min(96, 75 + criticalCount * 4);
  } else if (criticalCount >= 1 || minDays < 7) {
    riskScore = 50 + criticalCount * 8;
  }

  let riskLevel: RiskLevel = 'LOW';
  if (riskScore >= 75) riskLevel = 'CRITICAL';
  else if (riskScore >= 45) riskLevel = 'MEDIUM';

  return {
    riskLevel: hospital ? hospital.riskLevel : riskLevel,
    riskScore: hospital ? hospital.riskScore : riskScore,
    criticalCount,
    surplusCount,
    daysToFirstStockout: minDays
  };
}
