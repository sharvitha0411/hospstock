import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Send,
  Sparkles,
  User,
  Pill,
  ClipboardList,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NurseDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    patients,
    inventory
  } = useApp();

  const [selectedBedForVitals, setSelectedBedForVitals] = useState<string | null>(null);
  const [bpInput, setBpInput] = useState('120/80');
  const [pulseInput, setPulseInput] = useState(86);
  const [tempInput, setTempInput] = useState(99.4);
  const [spo2Input, setSpo2Input] = useState(98);
  const [vitalsSuccess, setVitalsSuccess] = useState<string | null>(null);
  const [administerSuccess, setAdministerSuccess] = useState<string | null>(null);

  // Inpatient Bed Board
  const [beds, setBeds] = useState([
    {
      bedNumber: 'Bed 03',
      patientName: 'Rahul Sharma',
      age: 28,
      condition: 'Acute Dengue Pyrexia (Day 3)',
      priority: 'HIGH',
      vitals: { bp: '118/76', pulse: 94, temp: 101.4, spo2: 98 },
      medicineStatus: 'Due Now',
      scheduledMed: 'Paracetamol 500mg IV'
    },
    {
      bedNumber: 'Bed 04',
      patientName: 'Anita Desai',
      age: 54,
      condition: 'Diabetic Ketoacidosis Stabilizing',
      priority: 'CRITICAL',
      vitals: { bp: '136/84', pulse: 82, temp: 98.6, spo2: 97 },
      medicineStatus: 'Active Infusion',
      scheduledMed: 'Normal Saline + Insulin Drip'
    },
    {
      bedNumber: 'Bed 07',
      patientName: 'Vikram Patel',
      age: 42,
      condition: 'Post-Op Observation (Appendectomy)',
      priority: 'ROUTINE',
      vitals: { bp: '122/78', pulse: 76, temp: 98.4, spo2: 99 },
      medicineStatus: 'Administered',
      scheduledMed: 'Amoxicillin 500mg (Next: 14:00)'
    },
    {
      bedNumber: 'Bed 09',
      patientName: 'Kavita Raman',
      age: 31,
      condition: 'Severe Gastroenteritis',
      priority: 'HIGH',
      vitals: { bp: '104/68', pulse: 102, temp: 100.2, spo2: 98 },
      medicineStatus: 'Due Now',
      scheduledMed: 'ORS + IV Hydration 500ml'
    },
    {
      bedNumber: 'Bed 12',
      patientName: 'Mohammed Farooq',
      age: 63,
      condition: 'Pneumonia with Bronchospasm',
      priority: 'CRITICAL',
      vitals: { bp: '142/88', pulse: 96, temp: 101.8, spo2: 93 },
      medicineStatus: 'Pending Pharmacy',
      scheduledMed: 'Human Insulin 10IU + Ceftriaxone'
    },
    {
      bedNumber: 'Bed 15',
      patientName: 'Meenakshi Sundaram',
      age: 38,
      condition: 'Febrile Illness with Thrombocytopenia',
      priority: 'ROUTINE',
      vitals: { bp: '114/72', pulse: 84, temp: 99.0, spo2: 98 },
      medicineStatus: 'Scheduled',
      scheduledMed: 'Oral Hydration & Antipyretic'
    }
  ]);

  // Ward Medicine Requests
  const medicationRequests = [
    {
      id: 'med-req-1',
      bed: 'Bed 12',
      medicine: 'Human Insulin 10IU',
      priority: 'Urgent',
      status: 'Pending Pharmacy Dispense',
      badge: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'med-req-2',
      bed: 'Bed 04',
      medicine: 'Normal Saline IV (0.9% NaCl)',
      priority: 'Active',
      status: 'Infusion Active (80ml/hr)',
      badge: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      id: 'med-req-3',
      bed: 'Bed 03',
      medicine: 'Paracetamol 500mg Tablets',
      priority: 'Administered',
      status: 'Administered at 10:15 AM',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'med-req-4',
      bed: 'Bed 15',
      medicine: 'Ceftriaxone 1g Injectable',
      priority: 'Scheduled',
      status: 'Due at 12:00 PM',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  // Shift Tasks Kanban
  const [shiftTasks, setShiftTasks] = useState([
    {
      category: 'Vitals Pending',
      beds: ['Bed 03 (Temp spike)', 'Bed 09 (BP re-check)', 'Bed 12 (SpO2 monitoring)'],
      color: 'border-amber-200 bg-amber-50/50 text-amber-900'
    },
    {
      category: 'Medication Pending',
      beds: ['Bed 04 (Insulin rate adjust)', 'Bed 15 (IV Ceftriaxone stat)'],
      color: 'border-rose-200 bg-rose-50/50 text-rose-900'
    },
    {
      category: 'Doctor Review',
      beds: ['Bed 07 (Surgical site dressing)', 'Bed 03 (Repeat Dengue NS1 result)'],
      color: 'border-blue-200 bg-blue-50/50 text-blue-900'
    },
    {
      category: 'Discharge Preparation',
      beds: ['Bed 02 (Discharge summary signed)', 'Bed 11 (Pharmacy discharge meds ready)'],
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
    }
  ]);

  const handleLogVitals = (bedNumber: string) => {
    setBeds(
      beds.map((b) =>
        b.bedNumber === bedNumber
          ? {
              ...b,
              vitals: { bp: bpInput, pulse: pulseInput, temp: tempInput, spo2: spo2Input }
            }
          : b
      )
    );
    setVitalsSuccess(`Vitals successfully logged for ${bedNumber}: BP ${bpInput}, Pulse ${pulseInput} bpm, Temp ${tempInput}°F, SpO2 ${spo2Input}%.`);
    setSelectedBedForVitals(null);
    setTimeout(() => setVitalsSuccess(null), 3000);
  };

  const handleAdministerMed = (bedNumber: string, medName: string) => {
    setBeds(
      beds.map((b) =>
        b.bedNumber === bedNumber ? { ...b, medicineStatus: 'Administered' } : b
      )
    );
    setAdministerSuccess(`Medication ${medName} marked as ADMINISTERED for ${bedNumber}. Audit log recorded.`);
    setTimeout(() => setAdministerSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
              <HeartPulse className="w-5 h-5 text-cyan-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Ward 3B — Nursing Station
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Inpatient Acute Care & Ward Operations • {currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital'}
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion */}
        <div className="flex items-center gap-2 bg-cyan-50/80 border border-cyan-200 px-3 py-2 rounded-xl text-xs text-cyan-900">
          <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
          <div className="text-left">
            <span className="font-bold text-[11px] block text-cyan-800">Nursing Copilot:</span>
            <span className="text-[11px] text-cyan-700">"Which patients have urgent medication orders pending?"</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {vitalsSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{vitalsSuccess}</span>
        </div>
      )}
      {administerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{administerSuccess}</span>
        </div>
      )}

      {/* KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Admitted</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <User className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">18 / 24</div>
          <p className="text-xs text-slate-500 mt-1">75% Ward Bed Occupancy</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Patients</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">3</div>
          <p className="text-xs text-rose-600 font-bold mt-1">Bed 04, Bed 12 on continuous pulse ox</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Medicine Reqs</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Pill className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">4</div>
          <p className="text-xs text-amber-600 mt-1">Awaiting Central Pharmacy dispatch</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Shift Tasks</span>
            <span className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 mt-2">7</div>
          <p className="text-xs text-teal-600 mt-1">Morning shift checklist items</p>
        </div>
      </div>

      {/* MAIN: PATIENT BOARD (SPAN 8) & RIGHT: MEDICATION REQUESTS (SPAN 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PATIENT BOARD */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Ward 3B Inpatient Board</h2>
              <p className="text-xs text-slate-500">Live bedside patient condition, vitals telemetry & medication due status</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{beds.length} Active Beds</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bed & Patient</th>
                  <th className="py-2.5 px-3">Condition & Priority</th>
                  <th className="py-2.5 px-3">Bedside Vitals</th>
                  <th className="py-2.5 px-3">Medicine Schedule</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {beds.map((b) => (
                  <tr key={b.bedNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">
                          {b.bedNumber}
                        </span>
                        {b.patientName}
                      </div>
                      <span className="text-[10px] text-slate-400">{b.age} years old</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{b.condition}</div>
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.2 rounded font-bold text-[9px] border ${
                          b.priority === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : b.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {b.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[11px] text-slate-700">
                        BP: <strong>{b.vitals.bp}</strong> • Pulse: <strong>{b.vitals.pulse}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Temp: <strong>{b.vitals.temp}°F</strong> • SpO2: <strong>{b.vitals.spo2}%</strong>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{b.scheduledMed}</div>
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.2 rounded font-bold text-[9px] border ${
                          b.medicineStatus === 'Due Now'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                            : b.medicineStatus === 'Active Infusion'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : b.medicineStatus === 'Administered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {b.medicineStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedBedForVitals(b.bedNumber)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                      >
                        Vitals
                      </button>
                      <button
                        onClick={() => handleAdministerMed(b.bedNumber, b.scheduledMed)}
                        className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px]"
                      >
                        Administer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: MEDICATION REQUESTS */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Ward Medication Requests</h3>
              <p className="text-xs text-slate-500">Pharmacy requisitions for current patients</p>
            </div>
            <button
              onClick={() => {
                setAdministerSuccess('Ward requisition form opened. Choose drug and dosage.');
                setTimeout(() => setAdministerSuccess(null), 2500);
              }}
              className="text-xs font-bold text-teal-700 hover:underline"
            >
              + New Req
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {medicationRequests.map((req) => (
              <div key={req.id} className="pt-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{req.bed}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${req.badge}`}>
                    {req.priority}
                  </span>
                </div>
                <div className="font-bold text-xs text-teal-900 mt-0.5">{req.medicine}</div>
                <span className="text-[11px] text-slate-500">{req.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK VITALS MODAL (IF SELECTED) */}
      {selectedBedForVitals && (
        <div className="bg-cyan-50/60 border-2 border-cyan-400 rounded-xl p-4 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-200 mb-3">
            <span className="font-extrabold text-xs text-slate-900">
              Log Bedside Vitals for {selectedBedForVitals}
            </span>
            <button
              onClick={() => setSelectedBedForVitals(null)}
              className="text-xs text-slate-400 font-bold hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700">Blood Pressure</label>
              <input
                type="text"
                value={bpInput}
                onChange={(e) => setBpInput(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700">Pulse (bpm)</label>
              <input
                type="number"
                value={pulseInput}
                onChange={(e) => setPulseInput(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700">Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                value={tempInput}
                onChange={(e) => setTempInput(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700">SpO2 (%)</label>
              <input
                type="number"
                value={spo2Input}
                onChange={(e) => setSpo2Input(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded border border-slate-300"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => handleLogVitals(selectedBedForVitals)}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
            >
              Save Vitals to Chart
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM: SHIFT TASKS (TASK-ORIENTED KANBAN) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-cyan-600" />
              Nurse Shift Task Checklist (Ward 3B)
            </h3>
            <p className="text-xs text-slate-500">Prioritized bedside duties for current 8-hour rotation</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Shift ends at 16:00 IST</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shiftTasks.map((taskGroup, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${taskGroup.color} flex flex-col`}>
              <span className="font-extrabold text-xs uppercase tracking-wider block mb-2">
                {taskGroup.category}
              </span>
              <ul className="space-y-2 flex-1 text-xs">
                {taskGroup.beds.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-slate-200/60">
                    <input type="checkbox" className="mt-0.5 rounded text-teal-600" />
                    <span className="font-medium text-slate-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
