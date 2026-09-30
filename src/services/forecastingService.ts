import {
  Medicine,
  Hospital,
  DemandForecastPoint,
  DiseaseMetric,
  WeatherMetric,
  ExplainableAiInsight
} from '../types';
import { MEDICINES, HOSPITALS, DISEASE_METRICS, WEATHER_METRICS } from '../data/mockData';

export interface ForecastGenerationOptions {
  medicineId: string;
  hospitalId: string;
  horizonDays: 7 | 30 | 90;
}

export function generateDemandForecast(options: ForecastGenerationOptions): {
  points: DemandForecastPoint[];
  dailyAverageRunRate: number;
  projectedTotalDemand: number;
  confidenceScore: number;
  explainableInsight: ExplainableAiInsight;
} {
  const medicine = MEDICINES.find((m) => m.id === options.medicineId) || MEDICINES[0];
  const hospital = HOSPITALS.find((h) => h.id === options.hospitalId) || HOSPITALS[0];
  const weather = WEATHER_METRICS.find((w) => w.districtId === hospital.districtId) || WEATHER_METRICS[0];
  
  // Find disease correlation
  const relatedDisease = DISEASE_METRICS.find((d) =>
    d.associatedMedicines.some((medName) => medName.toLowerCase().includes(medicine.name.toLowerCase().slice(0, 5)))
  );

  // Base daily demand baseline based on hospital size
  const bedFactor = hospital.beds / 500;
  const baseDaily = Math.round(
    (medicine.category === 'ANALGESIC' ? 90 :
     medicine.category === 'REHYDRATION' ? 80 :
     medicine.category === 'IV_FLUIDS' ? 85 :
     medicine.category === 'CHRONIC' ? 22 :
     medicine.category === 'ANTIBIOTIC' ? 30 :
     medicine.category === 'RESPIRATORY' ? 20 : 15) * bedFactor
  );

  const diseaseImpact = relatedDisease ? relatedDisease.changeRate / 100 : 0.05;
  const weatherImpact = weather.rainfallAnomalyPercent > 0 ? (weather.rainfallAnomalyPercent / 100) * 0.4 : 0.02;

  const points: DemandForecastPoint[] = [];
  const today = new Date('2026-09-30T07:13:30');

  // Generate historical 14 days before today + future horizonDays
  const totalDays = 14 + options.horizonDays;
  let totalProjected = 0;

  for (let i = -14; i <= options.horizonDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    // Seasonal sine wave + day-of-week factor
    const dayOfWeek = d.getDay();
    const weekendDampener = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.88 : 1.05;
    const seasonalFactor = Math.sin((i + 14) / 7) * 0.08 + 1.0;
    
    // Growth trend if disease is active
    const trendFactor = 1.0 + (diseaseImpact * 0.8) + (weatherImpact * 0.5);

    const projected = Math.round(baseDaily * seasonalFactor * weekendDampener * trendFactor);
    const uncertaintyBand = Math.round(projected * 0.12);

    if (i <= 0) {
      // Historical actual demand with realistic variance
      const variance = (Math.sin(i * 3) * 0.07);
      const actual = Math.round(baseDaily * seasonalFactor * weekendDampener * (1 + variance));
      points.push({
        date: dateStr,
        actualDemand: actual,
        predictedDemand: projected,
        confidenceLower: projected - uncertaintyBand,
        confidenceUpper: projected + uncertaintyBand,
        seasonalFactor: Number(seasonalFactor.toFixed(2)),
        diseaseImpactFactor: Number(diseaseImpact.toFixed(2)),
        weatherImpactFactor: Number(weatherImpact.toFixed(2))
      });
    } else {
      // Future projection
      totalProjected += projected;
      points.push({
        date: dateStr,
        predictedDemand: projected,
        confidenceLower: projected - uncertaintyBand,
        confidenceUpper: projected + uncertaintyBand,
        seasonalFactor: Number(seasonalFactor.toFixed(2)),
        diseaseImpactFactor: Number(diseaseImpact.toFixed(2)),
        weatherImpactFactor: Number(weatherImpact.toFixed(2))
      });
    }
  }

  const dailyAverageRunRate = Math.round(totalProjected / options.horizonDays);

  const headline = relatedDisease 
    ? `${relatedDisease.name} surge amplifying daily ${medicine.name} usage`
    : `Seasonal weather fluctuation influencing ${medicine.name} requirement`;

  const explainableInsight: ExplainableAiInsight = {
    id: `xai-${options.medicineId}-${options.hospitalId}`,
    medicineId: medicine.id,
    medicineName: medicine.name,
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    headline,
    factors: [
      {
        label: relatedDisease ? `${relatedDisease.name} cases (${relatedDisease.changeRate > 0 ? '+' : ''}${relatedDisease.changeRate}%)` : 'Baseline epidemiological index',
        impact: `+${Math.round(diseaseImpact * 100)}% demand lift`,
        direction: 'UP'
      },
      {
        label: `Rainfall anomaly in ${hospital.districtName} (${weather.rainfallAnomalyPercent > 0 ? '+' : ''}${weather.rainfallAnomalyPercent}%)`,
        impact: `+${Math.round(weatherImpact * 100)}% vector exposure`,
        direction: 'UP'
      },
      {
        label: `Current bed occupancy (${hospital.beds} beds @ ~88% capacity)`,
        impact: `${dailyAverageRunRate} units/day burn rate`,
        direction: 'DOWN'
      }
    ],
    confidenceScore: 94,
    suggestedAction: dailyAverageRunRate > 60 
      ? `Pre-position additional ${dailyAverageRunRate * 7} units to maintain 14-day safe buffer.`
      : `Stock consumption remains within planned safety threshold.`
  };

  return {
    points,
    dailyAverageRunRate,
    projectedTotalDemand: totalProjected,
    confidenceScore: 94,
    explainableInsight
  };
}
