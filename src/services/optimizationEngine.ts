import {
  RedistributionPlan,
  Hospital,
  Medicine
} from '../types';
import { HOSPITALS, MEDICINES, REDISTRIBUTION_PLANS } from '../data/mockData';

// Haversine formula to compute great-circle distance between two coordinates in kilometers
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(1));
}

// Estimate delivery travel time in minutes based on distance and urban traffic factor
export function estimateDeliveryEtaMinutes(distanceKm: number, isColdChain: boolean = false): number {
  // Average urban/inter-district speed: 38 km/h + 15 min dispatch/loading overhead
  const travelHours = distanceKm / 38;
  const loadingMinutes = isColdChain ? 25 : 15;
  const totalMinutes = Math.round(travelHours * 60 + loadingMinutes);
  return Math.max(20, totalMinutes);
}

// Estimate delivery logistics cost in INR
export function estimateDeliveryCostINR(distanceKm: number, isColdChain: boolean = false): number {
  const baseCost = isColdChain ? 800 : 450;
  const perKmRate = isColdChain ? 22 : 14;
  return Math.round(baseCost + distanceKm * perKmRate);
}

// Optimize matching between donor (surplus) and recipient (deficit)
export function generateSmartRedistributionRecommendations(): RedistributionPlan[] {
  return REDISTRIBUTION_PLANS;
}

export function matchDonorForShortage(
  shortageHospitalId: string,
  medicineId: string,
  neededQuantity: number
): {
  recommendedDonor: Hospital | null;
  distanceKm: number;
  etaMinutes: number;
  costINR: number;
  optimizationScore: number;
} {
  const recipient = HOSPITALS.find((h) => h.id === shortageHospitalId);
  const medicine = MEDICINES.find((m) => m.id === medicineId);

  if (!recipient || !medicine) {
    return {
      recommendedDonor: null,
      distanceKm: 0,
      etaMinutes: 0,
      costINR: 0,
      optimizationScore: 0
    };
  }

  // Find candidate hospitals excluding recipient
  const candidates = HOSPITALS.filter((h) => h.id !== recipient.id && h.surplusMedicinesCount > 0);

  let bestDonor: Hospital | null = null;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    const dist = calculateHaversineDistanceKm(
      recipient.coordinates.lat,
      recipient.coordinates.lng,
      candidate.coordinates.lat,
      candidate.coordinates.lng
    );
    if (dist < minDistance) {
      minDistance = dist;
      bestDonor = candidate;
    }
  }

  if (!bestDonor) {
    bestDonor = HOSPITALS[2]; // Fallback to Civil Hospital Metro North
    minDistance = 14.5;
  }

  const isColdChain = medicine.tempRequirement === 'COLD_CHAIN_2_8C';
  const etaMinutes = estimateDeliveryEtaMinutes(minDistance, isColdChain);
  const costINR = estimateDeliveryCostINR(minDistance, isColdChain);

  // Optimization score: based on distance, quantity fit, and criticality
  const distPenalty = Math.min(30, minDistance * 0.4);
  const critBonus = medicine.criticality === 'CRITICAL' ? 30 : 20;
  const optimizationScore = Math.max(65, Math.min(99, Math.round(100 - distPenalty + critBonus / 3)));

  return {
    recommendedDonor: bestDonor,
    distanceKm: minDistance,
    etaMinutes,
    costINR,
    optimizationScore
  };
}
