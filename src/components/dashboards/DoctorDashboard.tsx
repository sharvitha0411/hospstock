import React, { useState } from 'react';
import {
  Stethoscope,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Pill,
  Search,
  Plus,
  Send,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Activity,
  HeartPulse,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientQueueItem, PrescriptionItem } from '../../types';

interface DoctorDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    queue,
    updateQueueStatus,
    createPrescription,
    inventory,
    patients
  } = useApp();

  const [activeQueueFilter, setActiveQueueFilter] = useState<'ALL' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED'>('ALL');
  const [selectedPatientForConsult, setSelectedPatientForConsult] = useState<PatientQueueItem | null>(null);
  const [consultDiagnosis, setConsultDiagnosis] = useState<string>('Acute Dengue-Like Pyrexia with Mild Dehydration');
  const [consultRxItems, setConsultRxItems] = useState<Omit<PrescriptionItem, 'id' | 'dispensedStatus'>[]>([
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

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    if (activeQueueFilter === 'ALL') return true;
    return item.status === activeQueueFilter;
  });

  const waitingCount = queue.filter((q) => q.status === 'WAITING').length;
  const inConsultCount = queue.filter((q) => q.status === 'IN_CONSULTATION').length;
  const completedCount = queue.filter((q) => q.status === 'COMPLETED').length;
  const urgentCount = queue.filter((q) => q.priority === 'URGENT' && q.status !== 'COMPLETED').length;

  const handleStartConsultation = (item: PatientQueueItem) => {
    updateQueueStatus(item.id, 'IN_CONSULTATION');
    setSelectedPatientForConsult(item);
  };

  const handleAddMedToRx = () => {
    const med = inventory.find((i) => i.medicineId === newMedId);
    if (!med) return;
    setConsultRxItems([
      ...consultRxItems,
      {
        medicineId: med.medicineId,
        medicineName: med.medicineName,
        dosage: newMedDosage,
        frequency: 'BD (2x daily)',
        durationDays: 3,
        quantity: newMedQty,
        instructions: 'Take as directed'
      }
    ]);
  };

  const handleRemoveRxItem = (index: number) => {
    setConsultRxItems(consultRxItems.filter((_, i) => i !== index));
  };

  const handleSubmitPrescription = () => {
    if (!selectedPatientForConsult) return;
    createPrescription({
      patientId: selectedPatientForConsult.patientId,
      patientName: selectedPatientForConsult.patientName,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      facilityId: currentUser.facilityId || 'hosp-1',
      facilityName: currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital',
      diagnosis: consultDiagnosis,
      items: consultRxItems,
      clinicalNotes: 'Patient advised rest, high fluid intake, and repeat complete blood count (CBC) in 48 hours.',
      status: 'PENDING_PHARMACY'
    });
    updateQueueStatus(selectedPatientForConsult.id, 'COMPLETED');
    setRxSuccessMessage(`Prescription successfully submitted for ${selectedPatientForConsult.patientName} & sent to Central Pharmacy.`);
    setTimeout(() => {
      setRxSuccessMessage(null);
      setSelectedPatientForConsult(null);
    }, 2500);
  };

  // Schedule Timeline
  const scheduleSlots = [
    { time: '09:00 AM', patient: 'Rahul Sharma', complaint: 'High Fever & Shivering', status: 'Completed', type: 'Outpatient' },
    { time: '09:30 AM', patient: 'Anita Desai', complaint: 'Type 2 Diabetes Glycemic Review', status: 'Completed', type: 'Chronic Follow-up' },
    { time: '10:00 AM', patient: 'Meenakshi Sundaram', complaint: 'Dengue pyrexia & Hydration', status: 'In Consultation', type: 'Acute Care' },
    { time: '10:30 AM', patient: 'John David', complaint: 'Hypertension BP Check (148/92)', status: 'Waiting', type: 'Routine' },
    { time: '11:00 AM', patient: 'Fatimah Begum', complaint: 'Acute Abdominal Cramps & Nausea', status: 'Waiting', type: 'Priority' },
    { time: '11:30 AM', patient: 'Vikram Patel', complaint: 'Upper Respiratory Infection', status: 'Upcoming', type: 'Routine' },
    { time: '12:00 PM', patient: 'Ward 3B Rounds', complaint: 'Inpatient Clinical Rounds (6 beds)', status: 'Upcoming', type: 'Hospital Ward' }
  ];

  // Key Medicines Availability for Doctors
  const doctorMedicines = [
    { name: 'Paracetamol 500mg', status: 'Available', qty: '850 strips', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Human Insulin 100IU', status: 'Low Stock', qty: '14 vials (1.8 days cover)', badge: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },
    { name: 'Amoxicillin 500mg', status: 'Available', qty: '420 packs', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'ORS Electrolyte Sachets', status: 'Available', qty: '1,200 sachets', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Normal Saline IV 500ml', status: 'Adequate', qty: '310 bags', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Ceftriaxone 1g IV', status: 'Low Stock', qty: '8 vials', badge: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <Stethoscope className="w-5 h-5 text-teal-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Good Morning, {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Today's Clinical Overview • {currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital'} ({currentUser.department || 'Internal Medicine'})
              </p>
            </div>
          </div>
        </div>

        {/* Doctor AI Copilot Quick Prompt */}
        <div className="flex items-center gap-2 bg-teal-50/80 border border-teal-200 px-3 py-2 rounded-xl text-xs text-teal-900">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <div className="text-left">
            <span className="font-bold text-[11px] block text-teal-800">Clinical Copilot Suggestion:</span>
            <span className="text-[11px] text-teal-700">"Which critical medicines are currently low or unavailable at my facility?"</span>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Appointments</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">14</div>
          <p className="text-xs text-slate-500 mt-1">7 Outpatient • 4 Inpatient • 3 Follow-up</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Waiting</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{waitingCount}</div>
          <p className="text-xs text-amber-600 mt-1">Avg wait time: 14 mins</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Consultations</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{completedCount}</div>
          <p className="text-xs text-emerald-600 mt-1">All e-prescriptions dispatched</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Cases</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">{urgentCount}</div>
          <p className="text-xs text-rose-600 mt-1">Priority acute triage pending</p>
        </div>
      </div>

      {/* SUCCESS BANNER WHEN PRESCRIPTION SUBMITTED */}
      {rxSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{rxSuccessMessage}</span>
        </div>
      )}

      {/* MAIN LAYOUT: LEFT LARGE PATIENT QUEUE & RIGHT TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT LARGE PANEL: PATIENT QUEUE (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Active Patient Queue
              </h2>
              <p className="text-xs text-slate-500">Live triage token order for Room 4 Consultation</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              {(['ALL', 'WAITING', 'IN_CONSULTATION', 'COMPLETED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveQueueFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    activeQueueFilter === filter
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Token & Patient</th>
                  <th className="py-2.5 px-3">Age/Sex</th>
                  <th className="py-2.5 px-3">Chief Complaint</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Wait Time</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.map((item) => {
                  const isConsulting = item.status === 'IN_CONSULTATION';
                  const isDone = item.status === 'COMPLETED';
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isConsulting ? 'bg-teal-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {item.tokenNumber}
                          </span>
                          {item.patientName}
                        </div>
                        <span className="text-[10px] text-slate-400">ID: {item.patientId}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {item.patientAge}y / {item.patientGender}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{item.chiefComplaint}</span>
                        {item.vitalSigns && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            BP: {item.vitalSigns.bloodPressure} • Pulse: {item.vitalSigns.pulse} • Temp: {item.vitalSigns.temperature}°F
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            item.priority === 'URGENT'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.priority === 'HIGH'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {item.status === 'COMPLETED' ? 'Done' : '12 mins'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : isConsulting ? (
                          <button
                            onClick={() => setSelectedPatientForConsult(item)}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                          >
                            Active Consult
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartConsultation(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                          >
                            Start Consultation
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

        {/* RIGHT PANEL: TODAY'S SCHEDULE TIMELINE */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Today's Schedule
            </h2>
            <span className="text-[11px] font-bold text-slate-400">7 Slots</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto mt-2 space-y-2 pr-1">
            {scheduleSlots.map((slot, idx) => (
              <div key={idx} className="pt-2 flex items-start gap-3">
                <div className="font-mono text-[11px] font-bold text-slate-500 w-16 shrink-0 mt-0.5">
                  {slot.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{slot.patient}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        slot.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : slot.status === 'In Consultation'
                          ? 'bg-teal-50 text-teal-700 border-teal-200 animate-pulse'
                          : slot.status === 'Waiting'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{slot.complaint}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{slot.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE CONSULTATION DRAWER / MODAL (IF SELECTED) */}
      {selectedPatientForConsult && (
        <div className="bg-teal-50/40 border-2 border-teal-500/40 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-teal-200">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">In-Progress Consultation</span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {selectedPatientForConsult.patientName} ({selectedPatientForConsult.patientAge}y / {selectedPatientForConsult.patientGender})
              </h3>
            </div>
            <button
              onClick={() => setSelectedPatientForConsult(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Close Panel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis & Assessment</label>
              <input
                type="text"
                value={consultDiagnosis}
                onChange={(e) => setConsultDiagnosis(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-teal-600"
              />

              <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Triage Vital Signs</span>
                <div className="grid grid-cols-3 gap-2 text-slate-600">
                  <div>BP: <strong className="text-slate-900">{selectedPatientForConsult.vitalSigns?.bloodPressure || '118/76'}</strong></div>
                  <div>Pulse: <strong className="text-slate-900">{selectedPatientForConsult.vitalSigns?.pulse || 94} bpm</strong></div>
                  <div>Temp: <strong className="text-slate-900">{selectedPatientForConsult.vitalSigns?.temperature || 101.4}°F</strong></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Prescription Items (FEFO Validated)</label>
                <span className="text-[10px] text-teal-700 font-bold">{consultRxItems.length} items prescribed</span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {consultRxItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.medicineName}</div>
                      <div className="text-[11px] text-slate-500">{item.dosage} • {item.frequency} • Qty: {item.quantity}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveRxItem(idx)}
                      className="text-rose-600 text-[11px] font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add item row */}
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={newMedId}
                  onChange={(e) => setNewMedId(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  {inventory.slice(0, 8).map((inv) => (
                    <option key={inv.id} value={inv.medicineId}>
                      {inv.medicineName} ({inv.currentStock} in stock)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddMedToRx}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-teal-200 flex items-center justify-end gap-3">
            <button
              onClick={() => setSelectedPatientForConsult(null)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPrescription}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Sign & Transmit Prescription to Pharmacy
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM SECTION: THREE COLUMNS
          1. Recent Patients
          2. Medicine Availability
          3. Clinical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BOTTOM LEFT: RECENT PATIENTS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Recent Patients
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">This Week</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto space-y-2 mt-2">
            {patients.slice(0, 4).map((pt) => (
              <div key={pt.id} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{pt.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {pt.age}y • {pt.gender} • Blood: {pt.bloodGroup || 'O+'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Active
                  </span>
                  <div className="text-[9px] text-slate-400 mt-0.5">Last Visit: 2d ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CENTER: MEDICINE AVAILABILITY */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              Medicine Availability
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">Facility Central Store</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-2 mt-2">
            {doctorMedicines.map((med, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{med.name}</div>
                  <div className="text-[10px] text-slate-500">{med.qty}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${med.badge}`}>
                  {med.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM RIGHT: CLINICAL ALERTS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Clinical Alerts
            </h3>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              3 Active
            </span>
          </div>

          <div className="space-y-3 mt-3">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Insulin Safety Buffer Breached
              </div>
              <p className="text-[11px] text-rose-800 mt-1">
                Insulin availability at your facility is below the configured safety level (1.8 days of cover remaining).
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Monsoon Febrile Surge Warning
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Dengue surge alert in Metro Central: 34% rise in febrile cases. Monitor platelet counts carefully.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Batch Provenance Verified
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">
                Batch AMX-2026-X99 verified genuine via GS1 DataMatrix cryptographically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
