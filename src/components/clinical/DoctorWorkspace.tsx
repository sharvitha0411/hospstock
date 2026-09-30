import React, { useState } from 'react';
import {
  Stethoscope,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Plus,
  Send,
  Search,
  Activity,
  ShieldAlert,
  FileText,
  HeartPulse
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientQueueItem, PrescriptionItem } from '../../types';

export const DoctorWorkspace: React.FC = () => {
  const {
    currentUser,
    queue,
    updateQueueStatus,
    createPrescription,
    inventory,
    patients
  } = useApp();

  const [selectedQueueItem, setSelectedQueueItem] = useState<PatientQueueItem | null>(
    queue.find((q) => q.status === 'IN_CONSULTATION') || queue[0] || null
  );

  const [diagnosis, setDiagnosis] = useState<string>('Acute Dengue-Like Pyrexia with Mild Dehydration');
  const [rxItems, setRxItems] = useState<Omit<PrescriptionItem, 'id' | 'dispensedStatus'>[]>([
    {
      medicineId: 'med-1',
      medicineName: 'Paracetamol 500mg Tablets',
      dosage: '500mg',
      frequency: 'TDS (3x daily)',
      durationDays: 5,
      quantity: 15,
      instructions: 'Take after meals with plenty of fluids'
    },
    {
      medicineId: 'med-10',
      medicineName: 'Normal Saline IV (0.9% NaCl)',
      dosage: '500ml IV Infusion',
      frequency: 'Stat',
      durationDays: 1,
      quantity: 2,
      instructions: 'Slow IV hydration under nursing supervision'
    }
  ]);

  const [newMedId, setNewMedId] = useState<string>('med-2');
  const [newMedDosage, setNewMedDosage] = useState<string>('1 Sachet in 1L');
  const [newMedQty, setNewMedQty] = useState<number>(6);
  const [rxSuccessMessage, setRxSuccessMessage] = useState<string | null>(null);

  const handleStartConsultation = (item: PatientQueueItem) => {
    setSelectedQueueItem(item);
    updateQueueStatus(item.id, 'IN_CONSULTATION');
  };

  const handleAddMedItem = () => {
    const med = inventory.find((m) => m.medicineId === newMedId);
    if (!med) return;

    setRxItems((prev) => [
      ...prev,
      {
        medicineId: med.medicineId,
        medicineName: med.medicineName,
        dosage: newMedDosage,
        frequency: 'BD (2x daily)',
        durationDays: 4,
        quantity: newMedQty,
        instructions: 'Take as directed'
      }
    ]);
  };

  const handleRemoveMedItem = (index: number) => {
    setRxItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleIssuePrescription = () => {
    if (!selectedQueueItem) return;

    createPrescription({
      patientId: selectedQueueItem.patientId,
      patientName: selectedQueueItem.patientName,
      diagnosis,
      items: rxItems,
      isEmergency: selectedQueueItem.isEmergency
    });

    setRxSuccessMessage(`Prescription successfully transmitted to Central Pharmacy for ${selectedQueueItem.patientName}!`);
    setTimeout(() => setRxSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Clinical Safety Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Clinical Consultation & Prescribing</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                DOCTOR ROLE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Dr. {currentUser.name} · {currentUser.facilityName || 'Metro Apex Hospital'} · {currentUser.department}
            </p>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2 max-w-md">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>Clinical Decision Support Only. Prescriptions require licensed physician authorization. No autonomous diagnosis.</span>
        </div>
      </div>

      {rxSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{rxSuccessMessage}</span>
        </div>
      )}

      {/* Main Grid: Queue & Consultation Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Today's Patient Queue</h3>
              <p className="text-[11px] text-slate-500">Live triage arrivals for Dr. {currentUser.name.split(' ')[1] || currentUser.name}</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {queue.length} Patients
            </span>
          </div>

          <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
            {queue.map((item) => {
              const isSelected = selectedQueueItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleStartConsultation(item)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-800">{item.queueNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.status === 'IN_CONSULTATION'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'PRESCRIBED'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mt-1">{item.patientName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Age: {item.age} · {item.gender} · Blood: {item.bloodGroup}
                  </p>

                  {item.isEmergency && (
                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                      EMERGENCY ARRIVAL
                    </span>
                  )}

                  {item.chiefComplaint && (
                    <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-1">
                      "{item.chiefComplaint}"
                    </p>
                  )}

                  {item.vitalSigns && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-3 text-[10px] text-slate-600 font-mono">
                      <span>BP: {item.vitalSigns.bloodPressure}</span>
                      <span>Pulse: {item.vitalSigns.pulseRate} bpm</span>
                      <span>Temp: {item.vitalSigns.temperatureF}°F</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Consultation & Prescription Builder */}
        <div className="lg:col-span-2 space-y-6">
          {selectedQueueItem ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Selected Patient Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {selectedQueueItem.queueNumber} · {selectedQueueItem.patientId}
                    </span>
                    {selectedQueueItem.isEmergency && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        URGENT
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{selectedQueueItem.patientName}</h3>
                  <p className="text-xs text-slate-500">
                    Age: {selectedQueueItem.age} · Gender: {selectedQueueItem.gender} · Blood: {selectedQueueItem.bloodGroup} · Chief Complaint: {selectedQueueItem.chiefComplaint}
                  </p>
                </div>

                {selectedQueueItem.vitalSigns && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nursing Triage Vitals:</span>
                    <div>BP: <strong>{selectedQueueItem.vitalSigns.bloodPressure}</strong></div>
                    <div>Pulse: <strong>{selectedQueueItem.vitalSigns.pulseRate} bpm</strong> · SpO2: <strong>{selectedQueueItem.vitalSigns.spO2Percent}%</strong></div>
                    <div>Temp: <strong className="text-rose-600">{selectedQueueItem.vitalSigns.temperatureF}°F</strong></div>
                  </div>
                )}
              </div>

              {/* Clinical Assessment & Diagnosis Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Clinical Assessment & Working Diagnosis:
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="e.g. Acute Dengue Pyrexia / Severe Hyperglycemia"
                />
              </div>

              {/* Medicine Availability Checker & Prescription Item List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Prescribed Medications</span>
                  </h4>
                  <span className="text-xs text-slate-500">Real-time Hospital Pharmacy Check</span>
                </div>

                {/* Prescription Items Table */}
                <div className="space-y-2">
                  {rxItems.map((item, idx) => {
                    const inv = inventory.find((i) => i.medicineId === item.medicineId);
                    const isLowStock = inv && inv.currentStock < 100;

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{item.medicineName}</span>
                            <span className="font-mono text-slate-500">({item.dosage})</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {item.frequency} for {item.durationDays} days · Total: {item.quantity} units · {item.instructions}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {inv && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isLowStock
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {inv.currentStock} units in stock ({inv.daysUntilStockout}d cover)
                            </span>
                          )}
                          <button
                            onClick={() => handleRemoveMedItem(idx)}
                            className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Medicine to Prescription Form */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Add Medicine to Prescription:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <select
                        value={newMedId}
                        onChange={(e) => setNewMedId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                      >
                        {inventory.map((inv) => (
                          <option key={inv.medicineId} value={inv.medicineId}>
                            {inv.medicineName} ({inv.currentStock} in stock)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        placeholder="Dosage (e.g. 500mg)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={newMedQty}
                        onChange={(e) => setNewMedQty(Number(e.target.value))}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddMedItem}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>

              {/* Submit Prescription Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  Transmitting will send this electronic order directly to Chief Pharmacist Pooja Nair's FEFO queue.
                </div>
                <button
                  onClick={handleIssuePrescription}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition-all shadow-md shadow-teal-600/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Prescription to Pharmacy</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700">No Patient Selected for Consultation</h4>
              <p className="text-xs text-slate-400">Click any patient in the queue on the left to review vitals and prescribe medicines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
