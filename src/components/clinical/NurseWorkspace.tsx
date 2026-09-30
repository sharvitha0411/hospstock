import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Plus,
  Send,
  Pill,
  ShieldAlert,
  Thermometer,
  BedDouble
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientQueueItem } from '../../types';

export const NurseWorkspace: React.FC = () => {
  const {
    currentUser,
    queue,
    recordVitals,
    prescriptions,
    inventory,
    logAuditAction
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(queue[0]?.id || '');
  const [bp, setBp] = useState<string>('118/76');
  const [pulse, setPulse] = useState<number>(96);
  const [temp, setTemp] = useState<number>(101.8);
  const [spO2, setSpO2] = useState<number>(98);
  const [vitalsSaved, setVitalsSaved] = useState<boolean>(false);
  const [shortageReported, setShortageReported] = useState<string | null>(null);

  const selectedPatient = queue.find((q) => q.id === selectedPatientId) || queue[0];

  const handleSaveVitals = () => {
    if (!selectedPatient) return;
    recordVitals(selectedPatient.id, {
      bloodPressure: `${bp} mmHg`,
      pulseRate: Number(pulse),
      temperatureF: Number(temp),
      spO2Percent: Number(spO2),
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setVitalsSaved(true);
    setTimeout(() => setVitalsSaved(false), 3000);
  };

  const handleReportUrgentShortage = (medName: string) => {
    logAuditAction(
      'Reported Urgent Ward Shortage',
      'ALERT',
      `Nurse ${currentUser.name} reported urgent shortage of ${medName} in Ward 3B. Immediate resupply requested.`
    );
    setShortageReported(`Emergency resupply alert logged for ${medName}. Pharmacy alerted.`);
    setTimeout(() => setShortageReported(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Inpatient Ward & Clinical Care</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                NURSE ROLE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.name} · {currentUser.facilityName || 'Metro Apex Hospital'} · Assigned to: <strong>Ward 3B & Emergency Observation</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">
            Ward Census: 18 Beds Occupied / 22 Total
          </span>
        </div>
      </div>

      {vitalsSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Vitals recorded successfully and synchronized with Dr. Arvind's triage console!</span>
        </div>
      )}

      {shortageReported && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{shortageReported}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Patients List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-cyan-600" />
              <span>Ward 3B Active Patients</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">{queue.length} Inpatients</span>
          </div>

          <div className="space-y-2.5">
            {queue.map((item) => {
              const isSelected = selectedPatient?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPatientId(item.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/60 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{item.queueNumber}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      Bed #{item.id.replace(/\D/g, '') || '04'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{item.patientName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Age: {item.age} · Blood: {item.bloodGroup} · {item.department}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vitals Recording & Administration Console */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                    PATIENT CARE SHEET · {selectedPatient.patientId}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{selectedPatient.patientName}</h3>
                  <p className="text-xs text-slate-500">
                    Assigned Physician: {selectedPatient.assignedDoctorName} · Nurse in Charge: {currentUser.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-600 block">
                    Chief Complaint:
                  </span>
                  <span className="text-xs text-slate-800 italic">
                    "{selectedPatient.chiefComplaint || 'Under Observation'}"
                  </span>
                </div>
              </div>

              {/* Record Vitals Panel */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span>Log Triage Vitals & Clinical Observations</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Blood Pressure (mmHg)</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full font-mono font-bold text-sm text-slate-900 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <span className="text-[10px] text-slate-400">Normal: 120/80</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(Number(e.target.value))}
                      className="w-full font-mono font-bold text-sm text-slate-900 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <span className="text-[10px] text-slate-400">Normal: 60-100</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Temperature (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temp}
                      onChange={(e) => setTemp(Number(e.target.value))}
                      className="w-full font-mono font-bold text-sm text-rose-600 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <span className="text-[10px] text-rose-500 font-semibold">&gt; 100.4°F Pyrexia</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      value={spO2}
                      onChange={(e) => setSpO2(Number(e.target.value))}
                      className="w-full font-mono font-bold text-sm text-slate-900 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <span className="text-[10px] text-slate-400">Target: 95-100%</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveVitals}
                    className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Vitals to Chart</span>
                  </button>
                </div>
              </div>

              {/* Medication Administration Schedule */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Doctor Prescriptions & Administration Checklist</span>
                  </h4>
                  <span className="text-xs text-slate-500">Facility ID: {currentUser.facilityId || 'hosp-1'}</span>
                </div>

                <div className="space-y-2">
                  {prescriptions
                    .filter((p) => p.patientId === selectedPatient.patientId || p.patientName === selectedPatient.patientName)
                    .map((rx) => (
                      <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-800">{rx.prescriptionNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                            {rx.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">Diagnosis: <strong>{rx.diagnosis}</strong></p>
                        <div className="space-y-1.5 pt-1">
                          {rx.items.map((it, iIdx) => (
                            <div key={iIdx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                              <span>{it.medicineName} ({it.dosage}) · {it.instructions}</span>
                              <span className="font-bold text-slate-700">{it.dispensedStatus}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Report Ward Shortage Button */}
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-xs mt-4">
                  <div className="flex items-center gap-2 text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Notice any depleted emergency drugs on the ward cart?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReportUrgentShortage('Normal Saline IV 500ml')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Report Saline Depletion
                    </button>
                    <button
                      onClick={() => handleReportUrgentShortage('Human Insulin Vials')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Report Insulin Depletion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
