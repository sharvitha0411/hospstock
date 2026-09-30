export type UserRole =
  | 'SUPER_ADMIN'
  | 'DISTRICT_ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'PHARMACIST'
  | 'RECEPTIONIST'
  | 'SUPPLY_CHAIN_OFFICER'
  | 'WAREHOUSE_MANAGER'
  | 'ML_ANALYST'
  | 'AUDITOR'
  | 'HOSPITAL_ADMIN'
  | 'HOSPITAL_STAFF'
  | 'MANUFACTURER'
  | 'DISTRIBUTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  districtId?: string;
  hospitalId?: string;
  facilityId?: string;
  facilityName?: string;
  department?: string;
  ward?: string;
  avatarUrl?: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  population: number;
  totalHospitals: number;
  criticalShortages: number;
  surplusUnits: number;
  coordinates: { lat: number; lng: number };
}

export type HospitalType = 'TERTIARY_CARE' | 'DISTRICT_HOSPITAL' | 'COMMUNITY_HEALTH_CENTER' | 'PRIMARY_HEALTH_CENTER';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

export interface Hospital {
  id: string;
  name: string;
  code: string;
  districtId: string;
  districtName: string;
  type: HospitalType;
  beds: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  totalMedicinesMonitored: number;
  criticalMedicinesCount: number;
  surplusMedicinesCount: number;
  coordinates: { lat: number; lng: number; x: number; y: number }; // normalized x,y for custom interactive SVG map
  address: string;
  contactPerson: string;
  phone: string;
}

export type MedicineCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Medicine {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: 'ANTIBIOTIC' | 'EMERGENCY' | 'CHRONIC' | 'ANALGESIC' | 'REHYDRATION' | 'RESPIRATORY' | 'IV_FLUIDS' | 'PEDIATRIC';
  dosage: string;
  unit: string;
  unitCost: number;
  criticality: MedicineCriticality;
  minSafetyDays: number;
  tempRequirement?: 'ROOM_TEMP' | 'COLD_CHAIN_2_8C' | 'FROZEN';
}

export interface MedicineBatch {
  id: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  hospitalId: string;
  hospitalName: string;
  quantity: number;
  manufactureDate: string;
  expiryDate: string;
  daysRemaining: number;
  estimatedWasteValue: number;
  isNearExpiry: boolean;
}

export interface InventoryItem {
  id: string;
  hospitalId: string;
  hospitalName: string;
  districtId: string;
  medicineId: string;
  medicineName: string;
  category: string;
  currentStock: number;
  safetyStockLevel: number;
  dailyAvgConsumption: number;
  predictedDailyConsumption: number;
  daysUntilStockout: number;
  stockStatus: 'STOCK_OUT_TODAY' | 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'SURPLUS';
  lastUpdated: string;
}

export interface ConsumptionRecord {
  month: string;
  year: number;
  medicineId: string;
  actualDemand: number;
  predictedDemand: number;
  diseaseCases: number;
  rainfallMm: number;
  avgTempC: number;
}

export interface DiseaseMetric {
  id: string;
  name: string;
  currentActiveCases: number;
  changeRate: number; // e.g. +14%
  affectedDistricts: string[];
  associatedMedicines: string[];
  seasonalPeak: string;
}

export interface WeatherMetric {
  districtId: string;
  districtName: string;
  rainfallMm: number;
  rainfallAnomalyPercent: number; // e.g. +22%
  tempC: number;
  humidityPercent: number;
  riskCondition: 'NORMAL' | 'HEAVY_MONSOON' | 'CYCLONE_WARNING' | 'HEATWAVE';
}

export interface DemandForecastPoint {
  date: string;
  actualDemand?: number;
  predictedDemand: number;
  confidenceLower: number;
  confidenceUpper: number;
  seasonalFactor: number;
  diseaseImpactFactor: number;
  weatherImpactFactor: number;
}

export interface MLModelBenchmark {
  modelName: string;
  modelType: 'XGBoost' | 'Random Forest' | 'Prophet';
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
  trainingTimeSec: number;
  isBestPerformer: boolean;
  status: 'OPTIMAL' | 'COMPLIANT' | 'BENCHMARK';
  featuresUsed: string[];
}

export interface ExplainableAiInsight {
  id: string;
  medicineId: string;
  medicineName: string;
  hospitalId: string;
  hospitalName: string;
  headline: string;
  factors: {
    label: string;
    impact: string;
    direction: 'UP' | 'DOWN' | 'NEUTRAL';
  }[];
  confidenceScore: number;
  suggestedAction: string;
}

export type TransferStatus = 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';

export interface RedistributionPlan {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  fromHospitalId: string;
  fromHospitalName: string;
  fromHospitalDistrict: string;
  fromCurrentStock: number;
  fromSurplusQuantity: number;
  toHospitalId: string;
  toHospitalName: string;
  toHospitalDistrict: string;
  toCurrentStock: number;
  toDeficitQuantity: number;
  transferQuantity: number;
  distanceKm: number;
  etaMinutes: number;
  estimatedCostINR: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  optimizationScore: number; // 0-100 score
  status: TransferStatus;
  urgencyReason: string;
  timestamp: string;
}

export type DisruptionScenarioType = 
  | 'FLOOD' 
  | 'CYCLONE' 
  | 'SUPPLIER_FAILURE' 
  | 'ROAD_BLOCKAGE' 
  | 'LOCKDOWN' 
  | 'WAREHOUSE_REDUCTION';

export interface SimulationParams {
  scenarioType: DisruptionScenarioType;
  affectedDistrictId: string;
  severity: number; // 1 to 5
  roadAccessibilityPercent: number; // e.g. 40%
  warehouseCapacityReductionPercent: number; // e.g. 50%
  supplierDisruptionLevel: number; // e.g. 70%
  durationDays: number;
}

export interface SimulationComparison {
  before: {
    hospitalsAtRisk: number;
    medicinesAffected: number;
    expectedStockouts: number;
    avgDeliveryTimeMinutes: number;
    resilienceScore: number; // 0-100
  };
  after: {
    hospitalsAtRisk: number;
    medicinesAffected: number;
    expectedStockouts: number;
    avgDeliveryTimeMinutes: number;
    resilienceScore: number; // 0-100
  };
  recommendedActions: {
    id: string;
    type: 'SUPPLIER_FAILOVER' | 'REDISTRIBUTION' | 'REROUTE' | 'STOCK_BUFFER';
    title: string;
    detail: string;
    impact: string;
    priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM';
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  medicineCategories: string[];
  reliabilityScore: number; // 0-100
  avgLeadTimeDays: number;
  avgCostPerUnitIndex: number; // baseline 1.0
  activeContracts: number;
  status: 'ACTIVE' | 'DISRUPTED' | 'STANDBY';
  alternativeForSupplierIds?: string[];
  location: string;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertCategory = 
  | 'CRITICAL_STOCKOUT' 
  | 'NEAR_EXPIRY' 
  | 'SUPPLY_DISRUPTION' 
  | 'DEMAND_SPIKE' 
  | 'SUPPLIER_FAILURE' 
  | 'WEATHER_RISK' 
  | 'REDISTRIBUTION_REQUIRED';

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  hospitalId?: string;
  hospitalName?: string;
  districtId?: string;
  medicineId?: string;
  medicineName?: string;
  timestamp: string;
  resolved: boolean;
  assignedTo?: string;
  suggestedAction?: string;
}

export interface SupplyChainNode {
  id: string;
  label: string;
  type: 'SUPPLIER' | 'WAREHOUSE' | 'HOSPITAL' | 'DEMAND_ZONE';
  status: 'HEALTHY' | 'DISRUPTED' | 'CONGESTED' | 'REROUTED';
  x: number;
  y: number;
  stockLevel?: number;
  capacity?: number;
}

export interface SupplyChainEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  status: 'ACTIVE' | 'BLOCKED' | 'REROUTED';
  flowRate: number; // units/hr
  travelTimeMin: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'CLINICAL' | 'INVENTORY' | 'REDISTRIBUTION' | 'SIMULATION' | 'ALERT' | 'DATA_CLEAN' | 'SECURITY' | 'MODEL_GOVERNANCE';
  details: string;
  facilityName?: string;
  resource?: string;
  immutableHash?: string;
}

// PATIENT & CLINICAL ENTITIES
export interface Patient {
  id: string;
  patientId: string; // e.g. "PT-2026-0891"
  name: string;
  dateOfBirth: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  facilityId: string;
  facilityName: string;
  registrationDate: string;
}

export type QueueStatus = 'WAITING' | 'IN_CONSULTATION' | 'PRESCRIBED' | 'DISPENSED' | 'COMPLETED';

export interface PatientQueueItem {
  id: string;
  queueNumber: string; // e.g. "Q-104"
  tokenNumber?: string;
  patientId: string;
  patientName: string;
  age: number;
  patientAge?: number;
  gender: string;
  patientGender?: string;
  priority?: 'NORMAL' | 'URGENT' | 'HIGH' | 'Emergency' | string;
  bloodGroup: string;
  facilityId: string;
  department: string;
  tokenTime: string;
  isEmergency: boolean;
  status: QueueStatus;
  chiefComplaint?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedNurseName?: string;
  vitalSigns?: {
    bloodPressure: string;
    pulseRate: number;
    pulse?: number;
    temperatureF: number;
    temperature?: number;
    spO2Percent: number;
    spo2?: number;
    recordedAt: string;
  };
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string; // e.g. "TDS (3x daily)"
  durationDays: number;
  quantity: number;
  instructions: string;
  dispensedBatchId?: string;
  dispensedStatus: 'PENDING' | 'DISPENSED' | 'PARTIALLY_DISPENSED' | 'UNAVAILABLE';
}

export interface Prescription {
  id: string;
  prescriptionNumber: string; // e.g. "RX-2026-0412"
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  facilityName: string;
  diagnosis: string;
  createdAt: string;
  items: PrescriptionItem[];
  status: 'PENDING' | 'DISPENSED';
  isEmergency: boolean;
}

// ML GOVERNANCE ENTITIES
export interface MLModelArtifact {
  id: string;
  name: string;
  version: string;
  algorithm: 'XGBoost Multi-Variate' | 'Prophet Additive' | 'SARIMA' | 'Seasonal Naive' | 'Random Forest Regressor';
  trainedAt: string;
  datasetVersion: string;
  mae: number;
  rmse: number;
  mapePercent: number;
  accuracyR2: number;
  status: 'ACTIVE_APPROVED' | 'CANDIDATE' | 'ARCHIVED';
  trainedBy: string;
  featureSchema: string[];
  shapTopFeatures: { feature: string; importance: number; description: string }[];
  limitations: string;
  inferenceEndpoint: string;
  hyperparameters?: {
    learningRate?: number;
    nEstimators?: number;
    maxDepth?: number;
    regularization?: number;
    trainSplit?: number;
  };
}

// RECOVERY PLAN ENTITY
export interface RecoveryPlan {
  id: string;
  scenarioType: DisruptionScenarioType;
  generatedAt: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_EXECUTION';
  criticalFacilities: { facilityName: string; risk: string; deficitMeds: string[] }[];
  criticalMedicines: { medicineName: string; deficitUnits: number; urgency: string }[];
  surplusSources: { facilityName: string; surplusUnits: number }[];
  alternativeSuppliers: { supplierName: string; leadTimeDays: number; reliability: number }[];
  alternativeRoutes: { origin: string; dest: string; corridor: string; addedEtaMin: number }[];
  emergencyTransfers: { from: string; to: string; medicine: string; qty: number; route: string; priority: string }[];
  estimatedRecoveryHours: number;
  systemExplanation: string;
}

