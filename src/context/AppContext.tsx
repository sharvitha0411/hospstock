import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  District,
  Hospital,
  Medicine,
  MedicineBatch,
  InventoryItem,
  RedistributionPlan,
  Supplier,
  Alert,
  AuditLog,
  Patient,
  PatientQueueItem,
  Prescription,
  PrescriptionItem,
  MLModelArtifact,
  RecoveryPlan,
  SimulationParams,
  SimulationComparison
} from '../types';
import {
  DEMO_USERS,
  DISTRICTS,
  HOSPITALS,
  MEDICINES,
  MEDICINE_BATCHES,
  INVENTORY_ITEMS,
  REDISTRIBUTION_PLANS,
  SUPPLIERS,
  ALERTS,
  AUDIT_LOGS,
  PATIENTS,
  INITIAL_QUEUE,
  INITIAL_PRESCRIPTIONS,
  ML_MODELS,
  INITIAL_RECOVERY_PLANS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRoleByEmail: (email: string) => void;
  
  // Patients & Reception
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'patientId' | 'registrationDate'>) => Patient;
  registerPatient: (data: {
    name: string;
    age: number;
    gender: string;
    phone?: string;
    chiefComplaint?: string;
    priority?: string;
    vitalSigns?: any;
  }) => Patient;
  
  // Queue & Vitals
  queue: PatientQueueItem[];
  addToQueue: (patientId: string, chiefComplaint?: string, isEmergency?: boolean) => void;
  updateQueueStatus: (queueId: string, status: PatientQueueItem['status']) => void;
  recordVitals: (queueId: string, vitals: NonNullable<PatientQueueItem['vitalSigns']>) => void;
  
  // Prescriptions & Clinical
  prescriptions: Prescription[];
  createPrescription: (data: {
    patientId: string;
    patientName: string;
    diagnosis: string;
    items: Omit<PrescriptionItem, 'id' | 'dispensedStatus'>[];
    isEmergency?: boolean;
    doctorId?: string;
    doctorName?: string;
    facilityId?: string;
    facilityName?: string;
    clinicalNotes?: string;
    status?: string;
  }) => Prescription;
  
  // Pharmacy & Inventory (FEFO)
  inventory: InventoryItem[];
  batches: MedicineBatch[];
  medicineBatches: MedicineBatch[];
  dispensePrescription: (prescriptionId: string) => { success: boolean; message: string };
  dispensePrescriptionItem: (prescriptionId: string, itemId?: string) => void;
  recordWastage: (batchId: string, quantity: number, reason: string) => void;
  adjustBatchStock: (batchId: string, deltaQty: number, reason: string) => void;
  
  // Supply Chain & Transfers
  transfers: RedistributionPlan[];
  approveTransfer: (transferId: string) => void;
  dispatchTransfer: (transferId: string) => void;
  completeTransfer: (transferId: string) => void;
  createManualTransfer: (plan: Omit<RedistributionPlan, 'id' | 'timestamp' | 'status'>) => void;
  
  // ML Model Governance
  mlModels: MLModelArtifact[];
  trainModelManually: (algorithm: MLModelArtifact['algorithm']) => Promise<MLModelArtifact>;
  approveModel: (modelId: string) => void;
  archiveModel: (modelId: string) => void;
  
  // Simulation & Recovery
  disruptions: {
    params: SimulationParams;
    comparison: SimulationComparison | null;
  };
  runDisruptionSimulation: (params: SimulationParams) => SimulationComparison;
  recoveryPlans: RecoveryPlan[];
  generateOneClickRecoveryPlan: (scenario: 'CYCLONE' | 'FLOOD' | 'ROAD_BLOCKAGE' | 'SUPPLIER_FAILURE') => RecoveryPlan;
  approveRecoveryPlan: (planId: string) => void;
  
  // Alerts & Notifications
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: string, category: AuditLog['category'], details: string) => void;
  
  // Hackathon Demo Tour Guide
  hackathonStep: number;
  setHackathonStep: (step: number) => void;
  executeDemoStep: (step: number) => void;
  
  // Filters & State
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('medichain_currentUser');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default to Pharmacist (Pooja Nair) as in the user's workspace
    const pharmacist = DEMO_USERS.find((u) => u.role === 'PHARMACIST');
    return pharmacist || DEMO_USERS[4] || DEMO_USERS[0];
  });

  useEffect(() => {
    try {
      localStorage.setItem('medichain_currentUser', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  const [patients, setPatients] = useState<Patient[]>(PATIENTS);
  const [queue, setQueue] = useState<PatientQueueItem[]>(INITIAL_QUEUE);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [batches, setBatches] = useState<MedicineBatch[]>(MEDICINE_BATCHES);
  const [transfers, setTransfers] = useState<RedistributionPlan[]>(REDISTRIBUTION_PLANS);
  const [mlModels, setMlModels] = useState<MLModelArtifact[]>(ML_MODELS);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>(INITIAL_RECOVERY_PLANS);
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  
  const [hackathonStep, setHackathonStep] = useState<number>(1);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('30D');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [disruptions, setDisruptions] = useState<{
    params: SimulationParams;
    comparison: SimulationComparison | null;
  }>({
    params: {
      scenarioType: 'CYCLONE',
      affectedDistrictId: 'dist-2',
      severity: 4,
      roadAccessibilityPercent: 40,
      warehouseCapacityReductionPercent: 50,
      supplierDisruptionLevel: 60,
      durationDays: 4
    },
    comparison: null
  });

  // Helper for hash & logging
  const logAuditAction = (action: string, category: AuditLog['category'], details: string) => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newEntry: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      category,
      details,
      facilityName: currentUser.facilityName || 'District Command',
      resource: category,
      immutableHash: `0x${randomHex}8f9c`
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const switchRoleByEmail = (email: string) => {
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      logAuditAction('User Switched Operational Persona', 'SECURITY', `Switched to ${user.name} (${user.roleTitle})`);
    }
  };

  // 1. Patient Registration
  const addPatient = (patientData: Omit<Patient, 'id' | 'patientId' | 'registrationDate'>) => {
    const count = patients.length + 1;
    const newId = `pat-${count}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      patientId: `PT-2026-0${890 + count}`,
      registrationDate: new Date().toISOString().split('T')[0]
    };
    setPatients((prev) => [newPatient, ...prev]);
    logAuditAction('Patient Registration', 'CLINICAL', `Registered new patient ${newPatient.name} (${newPatient.patientId}) at ${newPatient.facilityName}`);
    return newPatient;
  };

  const registerPatient = (data: {
    name: string;
    age: number;
    gender: string;
    phone?: string;
    chiefComplaint?: string;
    priority?: string;
    vitalSigns?: any;
  }) => {
    const isEmerg = data.priority === 'URGENT' || data.priority === 'Emergency';
    const pat = addPatient({
      name: data.name,
      age: data.age,
      gender: (data.gender?.toUpperCase() as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE',
      dateOfBirth: '1992-01-01',
      phone: data.phone || '+91 98450 12345',
      address: 'Metro Health Zone',
      emergencyContact: '+91 98450 99999',
      bloodGroup: 'B+',
      facilityId: currentUser.facilityId || 'hosp-1',
      facilityName: currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital',
    });
    addToQueue(pat.id, data.chiefComplaint || 'General Consultation', isEmerg);
    return pat;
  };

  // 2. Queue Operations
  const addToQueue = (patientId: string, chiefComplaint = 'General Checkup', isEmergency = false) => {
    const pat = patients.find((p) => p.id === patientId || p.patientId === patientId);
    if (!pat) return;

    const queueNum = `Q-${100 + queue.length + 1}`;
    const item: PatientQueueItem = {
      id: `q-${Date.now()}`,
      queueNumber: queueNum,
      patientId: pat.patientId,
      patientName: pat.name,
      age: pat.age,
      gender: pat.gender,
      bloodGroup: pat.bloodGroup,
      facilityId: pat.facilityId,
      department: isEmergency ? 'Emergency & Acute Triage' : 'General Outpatient Clinic',
      tokenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergency,
      status: 'WAITING',
      chiefComplaint,
      assignedDoctorId: 'usr-3',
      assignedDoctorName: 'Dr. Arvind Swaminathan',
      assignedNurseName: 'Sister Mary Kurian'
    };

    setQueue((prev) => [item, ...prev]);
    logAuditAction('Patient Queued', 'CLINICAL', `Assigned token ${queueNum} to ${pat.name} (Emergency: ${isEmergency ? 'YES' : 'NO'})`);
  };

  const updateQueueStatus = (queueId: string, status: PatientQueueItem['status']) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status } : q))
    );
  };

  const recordVitals = (queueId: string, vitals: NonNullable<PatientQueueItem['vitalSigns']>) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, vitalSigns: vitals } : q))
    );
    const item = queue.find((q) => q.id === queueId);
    logAuditAction('Recorded Clinical Vitals', 'CLINICAL', `Recorded BP ${vitals.bloodPressure}, Pulse ${vitals.pulseRate} for ${item?.patientName || 'Patient'}`);
  };

  // 3. Clinical Consultation & Prescriptions
  const createPrescription = (data: {
    patientId: string;
    patientName: string;
    diagnosis: string;
    items: Omit<PrescriptionItem, 'id' | 'dispensedStatus'>[];
    isEmergency?: boolean;
  }) => {
    const rxNumber = `RX-2026-0${410 + prescriptions.length + 1}`;
    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
      patientId: data.patientId,
      patientName: data.patientName,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      facilityId: currentUser.facilityId || 'hosp-1',
      facilityName: currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital',
      diagnosis: data.diagnosis,
      createdAt: 'Today, Just now',
      status: 'PENDING',
      isEmergency: !!data.isEmergency,
      items: data.items.map((it, idx) => ({
        ...it,
        id: `rxi-${Date.now()}-${idx}`,
        dispensedStatus: 'PENDING'
      }))
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    // Update queue status to PRESCRIBED
    setQueue((prev) =>
      prev.map((q) =>
        q.patientId === data.patientId || q.patientName === data.patientName
          ? { ...q, status: 'PRESCRIBED' }
          : q
      )
    );

    logAuditAction(
      'Issued Clinical Prescription',
      'CLINICAL',
      `Dr. ${currentUser.name} prescribed ${newRx.items.length} medicines for ${data.patientName}. Diagnosis: ${data.diagnosis}`
    );

    return newRx;
  };

  // 4. Pharmacy FEFO Dispense & Inventory Decrement
  const dispensePrescription = (prescriptionId: string) => {
    const rx = prescriptions.find((r) => r.id === prescriptionId);
    if (!rx) return { success: false, message: 'Prescription not found.' };

    if (rx.status === 'DISPENSED') {
      return { success: false, message: 'Prescription is already dispensed.' };
    }

    // FEFO: Deduct items from batches and inventory
    let dispensedCount = 0;
    rx.items.forEach((item) => {
      // Find candidate batches for this medicine, sort by expiryDate (FEFO)
      const medicineBatches = batches
        .filter((b) => b.medicineId === item.medicineId && b.quantity >= item.quantity)
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      if (medicineBatches.length > 0) {
        const targetBatch = medicineBatches[0];
        // Deduct from batch
        setBatches((prev) =>
          prev.map((b) =>
            b.id === targetBatch.id
              ? { ...b, quantity: Math.max(0, b.quantity - item.quantity) }
              : b
          )
        );
        dispensedCount++;
      }

      // Deduct from facility inventory item
      setInventory((prev) =>
        prev.map((inv) =>
          inv.medicineId === item.medicineId && inv.hospitalId === rx.facilityId
            ? {
                ...inv,
                currentStock: Math.max(0, inv.currentStock - item.quantity),
                daysUntilStockout: Math.max(0.5, Number((inv.currentStock / (inv.predictedDailyConsumption || 20)).toFixed(1)))
              }
            : inv
        )
      );
    });

    // Mark prescription as DISPENSED
    setPrescriptions((prev) =>
      prev.map((r) =>
        r.id === prescriptionId
          ? {
              ...r,
              status: 'DISPENSED',
              items: r.items.map((it) => ({ ...it, dispensedStatus: 'DISPENSED' }))
            }
          : r
      )
    );

    // Mark queue as COMPLETED
    setQueue((prev) =>
      prev.map((q) =>
        q.patientId === rx.patientId || q.patientName === rx.patientName
          ? { ...q, status: 'COMPLETED' }
          : q
      )
    );

    logAuditAction(
      'FEFO Medicine Dispensed',
      'INVENTORY',
      `Pharmacist ${currentUser.name} verified FEFO rules and dispensed ${rx.items.length} medications for ${rx.patientName}. Inventory balances decremented.`
    );

    return { success: true, message: `Successfully dispensed ${dispensedCount} medications according to FEFO protocol.` };
  };

  const dispensePrescriptionItem = (prescriptionId: string, _itemId?: string) => {
    dispensePrescription(prescriptionId);
  };

  const recordWastage = (batchId: string, quantity: number, reason: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, quantity: Math.max(0, b.quantity - quantity) } : b))
    );
    logAuditAction('Recorded Stock Wastage/Damage', 'INVENTORY', `Quarantined and recorded wastage of ${quantity} units for batch ${batchId}. Reason: ${reason}`);
  };

  const adjustBatchStock = (batchId: string, deltaQty: number, reason: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, quantity: Math.max(0, b.quantity + deltaQty) } : b))
    );
    logAuditAction('Adjusted Physical Inventory Count', 'INVENTORY', `Physical audit adjustment for batch ${batchId}: ${deltaQty > 0 ? '+' : ''}${deltaQty} units. Reason: ${reason}`);
  };

  // 5. Supply Chain & Redistribution
  const approveTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'APPROVED' } : t))
    );
    const plan = transfers.find((t) => t.id === transferId);
    logAuditAction(
      'Approved Redistribution Plan',
      'REDISTRIBUTION',
      `Authorized transfer of ${plan?.transferQuantity} units of ${plan?.medicineName} from ${plan?.fromHospitalName} to ${plan?.toHospitalName}. Route: ${plan?.distanceKm}km.`
    );
  };

  const dispatchTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'IN_TRANSIT' } : t))
    );
    const plan = transfers.find((t) => t.id === transferId);
    logAuditAction(
      'Dispatched Cold-Chain Fleet',
      'REDISTRIBUTION',
      `Refrigerated delivery fleet dispatched for transfer ${transferId} (${plan?.medicineName}). Real-time GPS tracking live.`
    );
  };

  const completeTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'COMPLETED' } : t))
    );
    const plan = transfers.find((t) => t.id === transferId);
    // Increment destination stock
    if (plan) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.medicineId === plan.medicineId && inv.hospitalId === plan.toHospitalId
            ? { ...inv, currentStock: inv.currentStock + plan.transferQuantity, stockStatus: 'HEALTHY' }
            : inv
        )
      );
    }
    logAuditAction(
      'Completed Transfer Ingestion',
      'REDISTRIBUTION',
      `Delivery arrived at ${plan?.toHospitalName}. Verified intact seal and ingested ${plan?.transferQuantity} units into destination pharmacy.`
    );
  };

  const createManualTransfer = (plan: Omit<RedistributionPlan, 'id' | 'timestamp' | 'status'>) => {
    const newPlan: RedistributionPlan = {
      ...plan,
      id: `redist-${Date.now()}`,
      status: 'PENDING',
      timestamp: 'Just now'
    };
    setTransfers((prev) => [newPlan, ...prev]);
    logAuditAction('Created Inter-Facility Transfer', 'REDISTRIBUTION', `Initiated transfer of ${plan.transferQuantity} units of ${plan.medicineName}`);
  };

  // 6. ML Model Governance (Manual Training & Approval)
  const trainModelManually = async (algorithm: MLModelArtifact['algorithm']): Promise<MLModelArtifact> => {
    const versionNum = mlModels.length + 1;
    const newModel: MLModelArtifact = {
      id: `mdl-${Date.now()}`,
      name: `${algorithm} Re-Trained Pipeline`,
      version: `demand_forecast_v${versionNum}.0.joblib`,
      algorithm,
      trainedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      datasetVersion: 'ds_health_clim_2023_2026_v4.2.csv (152,400 rows)',
      mae: algorithm === 'XGBoost Multi-Variate' ? 12.8 : 16.4,
      rmse: algorithm === 'XGBoost Multi-Variate' ? 20.2 : 25.1,
      mapePercent: algorithm === 'XGBoost Multi-Variate' ? 5.1 : 6.8,
      accuracyR2: algorithm === 'XGBoost Multi-Variate' ? 0.954 : 0.928,
      status: 'CANDIDATE',
      trainedBy: `${currentUser.name} (Manual Execution)`,
      featureSchema: [
        'past_14d_consumption',
        'rainfall_mm_rolling_7d',
        'avg_temp_c',
        'dengue_positivity_proxy',
        'hospital_bed_occupancy',
        'active_outbreak_flag'
      ],
      shapTopFeatures: [
        { feature: 'rainfall_mm_rolling_7d', importance: 0.41, description: 'Monsoon precipitation impact' },
        { feature: 'past_14d_consumption', importance: 0.30, description: 'Autoregressive trend' },
        { feature: 'dengue_positivity_proxy', importance: 0.19, description: 'Lab confirmed vector infections' }
      ],
      limitations: 'Validated for Q3/Q4 monsoon season. Requires human sign-off before production inference release.',
      inferenceEndpoint: '/api/v1/forecast/predict'
    };

    setMlModels((prev) => [newModel, ...prev]);
    logAuditAction('Executed Manual ML Training Pipeline', 'MODEL_GOVERNANCE', `Trained candidate model ${newModel.version} using ${algorithm}. R2: ${newModel.accuracyR2}, MAPE: ${newModel.mapePercent}%.`);
    return newModel;
  };

  const approveModel = (modelId: string) => {
    setMlModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? { ...m, status: 'ACTIVE_APPROVED' }
          : m.status === 'ACTIVE_APPROVED'
          ? { ...m, status: 'ARCHIVED' }
          : m
      )
    );
    const target = mlModels.find((m) => m.id === modelId);
    logAuditAction('Approved ML Model for Production Inference', 'MODEL_GOVERNANCE', `Model ${target?.version} signed off and promoted to ACTIVE_APPROVED.`);
  };

  const archiveModel = (modelId: string) => {
    setMlModels((prev) =>
      prev.map((m) => (m.id === modelId ? { ...m, status: 'ARCHIVED' } : m))
    );
  };

  // 7. Disruption Simulation & One-Click Recovery Plan
  const runDisruptionSimulation = (params: SimulationParams): SimulationComparison => {
    const comparison: SimulationComparison = {
      before: {
        hospitalsAtRisk: 8,
        medicinesAffected: 12,
        expectedStockouts: 7,
        avgDeliveryTimeMinutes: 185,
        resilienceScore: 42
      },
      after: {
        hospitalsAtRisk: 1,
        medicinesAffected: 2,
        expectedStockouts: 0,
        avgDeliveryTimeMinutes: 65,
        resilienceScore: 94
      },
      recommendedActions: [
        {
          id: 'act-1',
          type: 'REDISTRIBUTION',
          title: 'Direct East Valley Regional Surplus to Coastal General',
          detail: '400 vials of Human Insulin and 2,000 Normal Saline units available with 45-min transit.',
          impact: 'Prevents ICU stock-out in 48 hours',
          priority: 'IMMEDIATE'
        },
        {
          id: 'act-2',
          type: 'REROUTE',
          title: 'Reroute Fleet via Inland Ridge Corridor 4',
          detail: 'Coastal Highway 12 is 60% inundated. Ridge Corridor adds 25 km but guarantees zero waterlogging.',
          impact: 'Unbroken refrigerated cold-chain transit',
          priority: 'HIGH'
        },
        {
          id: 'act-3',
          type: 'SUPPLIER_FAILOVER',
          title: 'Activate National Emergency MedReserve Standby Contract',
          detail: 'Pre-order 5,000 units of ORS and Amoxicillin with 24h guaranteed air freight.',
          impact: 'Buffers regional secondary PHC depletion',
          priority: 'HIGH'
        }
      ]
    };

    setDisruptions({ params, comparison });
    logAuditAction(
      'Executed Supply Chain Disruption Simulation',
      'SIMULATION',
      `Simulated ${params.scenarioType} (Severity ${params.severity}/5) on District ${params.affectedDistrictId}. Pre-mitigation resilience score: 42%.`
    );

    return comparison;
  };

  const generateOneClickRecoveryPlan = (scenario: 'CYCLONE' | 'FLOOD' | 'ROAD_BLOCKAGE' | 'SUPPLIER_FAILURE'): RecoveryPlan => {
    const plan: RecoveryPlan = {
      id: `rec-${Date.now()}`,
      scenarioType: scenario,
      generatedAt: 'Just now',
      status: 'PROPOSED',
      criticalFacilities: [
        { facilityName: 'Metro Apex Multi-Specialty Hospital', risk: 'CRITICAL', deficitMeds: ['Human Insulin 100IU', 'Paracetamol 500mg'] },
        { facilityName: 'Coastal General Hospital', risk: 'CRITICAL', deficitMeds: ['Normal Saline IV', 'ORS Sachets'] },
        { facilityName: 'River Delta Memorial', risk: 'HIGH', deficitMeds: ['Amoxicillin 500mg'] }
      ],
      criticalMedicines: [
        { medicineName: 'Human Insulin 100IU/ml Vial', deficitUnits: 1200, urgency: 'IMMEDIATE (< 48 hours)' },
        { medicineName: 'Normal Saline IV (0.9% NaCl)', deficitUnits: 3400, urgency: 'HIGH (3 days)' },
        { medicineName: 'Paracetamol 500mg Tablets', deficitUnits: 15000, urgency: 'HIGH (4 days)' }
      ],
      surplusSources: [
        { facilityName: 'East Valley Regional Institute', surplusUnits: 6200 },
        { facilityName: 'Central Medical Supply Depot #4', surplusUnits: 35000 }
      ],
      alternativeSuppliers: [
        { supplierName: 'National Emergency MedReserve', leadTimeDays: 1, reliability: 99 },
        { supplierName: 'Bharat Serum Standby Vault', leadTimeDays: 2, reliability: 95 }
      ],
      alternativeRoutes: [
        { origin: 'Central Depot #4', dest: 'Metro Apex Hospital', corridor: 'Express Arterial Route B', addedEtaMin: 20 },
        { origin: 'East Valley Regional', dest: 'Coastal General', corridor: 'Inland Ridge Corridor 4', addedEtaMin: 35 }
      ],
      emergencyTransfers: [
        { from: 'East Valley Regional', to: 'Metro Apex Hospital', medicine: 'Human Insulin 100IU/ml', qty: 400, route: 'Refrigerated Fleet TRK-204', priority: 'CRITICAL' },
        { from: 'Central Depot #4', to: 'Coastal General', medicine: 'Normal Saline IV', qty: 1500, route: 'Heavy Logistics Van TRK-108', priority: 'HIGH' }
      ],
      estimatedRecoveryHours: 14,
      systemExplanation: `AI Recovery Engine evaluated 22 nodes and 48 routes under ${scenario}. Synthesized 10-point action plan eliminating all projected stock-outs with 94% network resilience recovery.`
    };

    setRecoveryPlans((prev) => [plan, ...prev]);
    logAuditAction(
      'Generated One-Click Recovery Plan',
      'SIMULATION',
      `Synthesized AI recovery plan for ${scenario}. Formulated 2 emergency transfers, 2 route failovers, and backup supplier activation.`
    );
    return plan;
  };

  const approveRecoveryPlan = (planId: string) => {
    setRecoveryPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'APPROVED' } : p))
    );
    const plan = recoveryPlans.find((p) => p.id === planId);
    logAuditAction('Approved Disruption Recovery Plan', 'SIMULATION', `Authorized implementation of recovery plan ${planId} (${plan?.scenarioType}). Dispatched emergency directives.`);
  };

  // 8. Alerts
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, assignedTo: currentUser.name } : a))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  // 9. Interactive Hackathon 12-Step Walkthrough Engine
  const executeDemoStep = (stepNumber: number) => {
    setHackathonStep(stepNumber);
    switch (stepNumber) {
      case 1: // Receptionist registers & queues patient
        switchRoleByEmail('reception@medichain.demo');
        addToQueue('pat-1', 'Acute fever with joint aches (Suspected Dengue)', true);
        break;
      case 2: // Doctor completes consultation & prescription
        switchRoleByEmail('doctor@medichain.demo');
        createPrescription({
          patientId: 'PT-2026-0891',
          patientName: 'Rahul Sharma',
          diagnosis: 'Acute Viral Dengue with Fluid Depletion',
          items: [
            { medicineId: 'med-1', medicineName: 'Paracetamol 500mg Tablets', dosage: '500mg', frequency: 'TDS', durationDays: 5, quantity: 15, instructions: 'Post-meals' },
            { medicineId: 'med-10', medicineName: 'Normal Saline IV (0.9% NaCl)', dosage: '500ml IV', frequency: 'Stat', durationDays: 1, quantity: 2, instructions: 'Slow IV infusion' }
          ],
          isEmergency: true
        });
        break;
      case 3: // Nurse records vitals & confirms administration
        switchRoleByEmail('nurse@medichain.demo');
        recordVitals('q-1', { bloodPressure: '118/76 mmHg', pulseRate: 96, temperatureF: 101.8, spO2Percent: 98, recordedAt: 'Live Now' });
        break;
      case 4: // Pharmacist dispenses via FEFO
        switchRoleByEmail('pharmacy@medichain.demo');
        dispensePrescription('rx-1');
        break;
      case 5: // ML Analyst trains & approves model
        switchRoleByEmail('ml@medichain.demo');
        trainModelManually('XGBoost Multi-Variate');
        break;
      case 6: // Stock risk flags low stock
        switchRoleByEmail('pharmacy@medichain.demo');
        break;
      case 7: // District Admin spots surplus vs deficit
        switchRoleByEmail('district@medichain.demo');
        break;
      case 8: // Supply Chain Officer reviews transfer
        switchRoleByEmail('supply@medichain.demo');
        break;
      case 9: // Supply Chain Officer approves transfer
        switchRoleByEmail('supply@medichain.demo');
        approveTransfer('redist-1');
        dispatchTransfer('redist-1');
        break;
      case 10: // Warehouse Manager dispatches shipment
        switchRoleByEmail('warehouse@medichain.demo');
        break;
      case 11: // Cyclone simulation & Recovery Plan
        switchRoleByEmail('district@medichain.demo');
        runDisruptionSimulation(disruptions.params);
        generateOneClickRecoveryPlan('CYCLONE');
        break;
      case 12: // Auditor reviews audit trail & exports report
        switchRoleByEmail('auditor@medichain.demo');
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRoleByEmail,
        patients,
        addPatient,
        registerPatient,
        queue,
        addToQueue,
        updateQueueStatus,
        recordVitals,
        prescriptions,
        createPrescription,
        inventory,
        batches,
        medicineBatches: batches,
        dispensePrescription,
        dispensePrescriptionItem,
        recordWastage,
        adjustBatchStock,
        transfers,
        approveTransfer,
        dispatchTransfer,
        completeTransfer,
        createManualTransfer,
        mlModels,
        trainModelManually,
        approveModel,
        archiveModel,
        disruptions,
        runDisruptionSimulation,
        recoveryPlans,
        generateOneClickRecoveryPlan,
        approveRecoveryPlan,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        auditLogs,
        logAuditAction,
        hackathonStep,
        setHackathonStep,
        executeDemoStep,
        selectedDistrictId,
        setSelectedDistrictId,
        selectedDateRange,
        setSelectedDateRange,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
