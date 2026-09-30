import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Search,
  BellRing,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientQueueItem } from '../../types';

interface ReceptionDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    queue,
    registerPatient,
    updateQueueStatus
  } = useApp();

  const [searchToken, setSearchToken] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New patient registration form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number>(32);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newComplaint, setNewComplaint] = useState('Acute fever and body chills');
  const [newPriority, setNewPriority] = useState<'ROUTINE' | 'HIGH' | 'URGENT'>('ROUTINE');

  // Live Patient Flow counts
  const registeredCount = 48;
  const checkedInCount = 41;
  const waitingCount = queue.filter((q) => q.status === 'WAITING').length;
  const inConsultCount = queue.filter((q) => q.status === 'IN_CONSULTATION').length;
  const completedCount = queue.filter((q) => q.status === 'COMPLETED').length + 24;

  const handleRegisterPatient = (isEmergency = false) => {
    const generatedToken = isEmergency ? `EMG-${Math.floor(100 + Math.random() * 900)}` : `A0${queue.length + 1}`;
    registerPatient({
      name: newName || (isEmergency ? 'Emergency Trauma Walk-in' : 'New Registered Patient'),
      age: newAge,
      gender: newGender,
      phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
      chiefComplaint: isEmergency ? 'Acute trauma & high triage emergency' : newComplaint,
      priority: isEmergency ? 'URGENT' : newPriority,
      vitalSigns: {
        bloodPressure: '120/80',
        pulse: 88,
        temperature: 99.2,
        spo2: 98
      }
    });

    setSuccessBanner(
      isEmergency
        ? `EMERGENCY ALERT: Token ${generatedToken} generated and routed immediately to Acute Triage Bay 1!`
        : `Patient registered successfully. Token ${generatedToken} assigned to waiting queue.`
    );

    setIsRegisterModalOpen(false);
    setIsEmergencyModalOpen(false);
    setNewName('');
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  const handleCallToken = (tokenNumber: string, patientName: string) => {
    setSuccessBanner(`Calling Token ${tokenNumber} (${patientName}) to Consultation Room 4.`);
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  // Hourly patient footfall trend data
  const footfallHours = [
    { hour: '08:00', count: 6, label: 'Early' },
    { hour: '09:00', count: 14, label: 'Opening Surge' },
    { hour: '10:00', count: 22, label: 'Peak 1' },
    { hour: '11:00', count: 18, label: 'Active' },
    { hour: '12:00', count: 11, label: 'Midday' },
    { hour: '13:00', count: 8, label: 'Lunch' },
    { hour: '14:00', count: 16, label: 'Peak 2' },
    { hour: '15:00', count: 13, label: 'Afternoon' },
    { hour: '16:00', count: 9, label: 'Tapering' },
    { hour: '17:00', count: 5, label: 'Closing' }
  ];

  const maxFootfall = 24;

  // Today's scheduled appointments
  const scheduledAppointments = [
    { time: '10:30 AM', patient: 'Kavita Raman', doctor: 'Dr. Arvind Swaminathan', dept: 'General Medicine', status: 'Arrived' },
    { time: '11:00 AM', patient: 'Deepak Joshi', doctor: 'Dr. Arvind Swaminathan', dept: 'General Medicine', status: 'Scheduled' },
    { time: '11:30 AM', patient: 'Gita Patel', doctor: 'Dr. S. Nair', dept: 'Cardiology', status: 'Scheduled' },
    { time: '12:00 PM', patient: 'Mohammed Farooq', doctor: 'Dr. Arvind Swaminathan', dept: 'General Medicine', status: 'Scheduled' },
    { time: '02:00 PM', patient: 'Pooja Bhatt', doctor: 'Dr. R. Gupta', dept: 'Pediatrics', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              <UserCheck className="w-5 h-5 text-indigo-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Front Desk & Patient Flow
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Outpatient Registration & Queue Dispatch • {currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital'}
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion */}
        <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 px-3 py-2 rounded-xl text-xs text-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <div className="text-left">
            <span className="font-bold text-[11px] block text-indigo-800">Front Desk Assistant:</span>
            <span className="text-[11px] text-indigo-700">"How many patients are currently waiting in queue?"</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {successBanner && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* LARGE VISUAL: TODAY'S PATIENT FLOW PIPELINE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">Today's Patient Flow</h2>
            <p className="text-xs text-slate-500">Live operational throughput across outpatient care stages</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Total Handled Today: {registeredCount} Patients
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Stage 1: Registered */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registered</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{registeredCount}</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Total OPD Tokens</span>
          </div>

          {/* Stage 2: Checked-In */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 text-center">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Checked-In</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">{checkedInCount}</div>
            <span className="text-[10px] text-blue-600 mt-0.5 block">Vitals Captured</span>
          </div>

          {/* Stage 3: Waiting */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-center">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Waiting</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">{waitingCount}</div>
            <span className="text-[10px] text-amber-600 mt-0.5 block">In Waiting Area</span>
          </div>

          {/* Stage 4: In Consultation */}
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/60 text-center">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">In Consultation</span>
            <div className="text-2xl sm:text-3xl font-black text-teal-900 mt-1">{inConsultCount}</div>
            <span className="text-[10px] text-teal-600 mt-0.5 block">With Physicians</span>
          </div>

          {/* Stage 5: Completed */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-center">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Completed</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">{completedCount}</div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Prescriptions Sent</span>
          </div>
        </div>
      </div>

      {/* THREE-COLUMN MAIN WORKSPACE:
          LEFT: Quick Actions
          CENTER: Live Queue Tokens
          RIGHT: Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUICK ACTIONS (Span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3">Front Desk Quick Actions</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  + Register Patient
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-200" />
              </button>

              <button
                onClick={() => handleRegisterPatient(true)}
                className="w-full py-2.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  + Emergency Registration
                </span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-black">STAT</span>
              </button>

              <button
                onClick={() => {
                  setSuccessBanner('Appointment scheduling portal loaded. Select calendar slot below.');
                  setTimeout(() => setSuccessBanner(null), 2500);
                }}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                + Create Appointment
              </button>

              <button
                onClick={() => {
                  setSuccessBanner('Patient check-in verified. Triage vitals checklist initiated.');
                  setTimeout(() => setSuccessBanner(null), 2500);
                }}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                + Check-In Token
              </button>
            </div>
          </div>

          {/* Registration Modal Dialog (if open) */}
          {isRegisterModalOpen && (
            <div className="bg-white border-2 border-teal-500/40 rounded-xl p-4 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                <span className="font-extrabold text-xs text-slate-900">New Patient Entry</span>
                <button onClick={() => setIsRegisterModalOpen(false)} className="text-xs text-slate-400 font-bold hover:text-slate-600">
                  Cancel
                </button>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Patient Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Age</label>
                    <input
                      type="number"
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Gender</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs rounded border border-slate-300"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Chief Complaint</label>
                  <input
                    type="text"
                    value={newComplaint}
                    onChange={(e) => setNewComplaint(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs rounded border border-slate-300"
                  >
                    <option value="ROUTINE">Routine Outpatient</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent / Acute</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRegisterPatient(false)}
                  className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs mt-2"
                >
                  Generate Token & Queue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CENTER COLUMN: LIVE QUEUE (Span 6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Live Triage Queue</h2>
              <p className="text-xs text-slate-500">Real-time token calling & consultation dispatch</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{queue.length} Tokens Active</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {queue.map((item) => {
              const isConsulting = item.status === 'IN_CONSULTATION';
              const isWaiting = item.status === 'WAITING';
              return (
                <div
                  key={item.id}
                  className={`p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    isConsulting ? 'bg-teal-50/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Token</span>
                      <span className="font-mono font-black text-sm text-slate-900">{item.tokenNumber}</span>
                    </div>

                    <div>
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        {item.patientName}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            item.priority === 'URGENT'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.priority === 'HIGH'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.patientAge}y • {item.chiefComplaint}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isWaiting && (
                      <button
                        onClick={() => handleCallToken(item.tokenNumber || item.queueNumber, item.patientName)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        Call Next
                      </button>
                    )}
                    {isConsulting && (
                      <span className="text-xs font-bold text-teal-700 bg-teal-100/70 px-2.5 py-1 rounded-full border border-teal-200 animate-pulse">
                        In Consultation
                      </span>
                    )}
                    {item.status === 'COMPLETED' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: TODAY'S APPOINTMENTS (Span 3) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Today's Appointments
            </h3>
            <span className="text-[11px] font-bold text-slate-400">5 Today</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-2 mt-2">
            {scheduledAppointments.map((apt, idx) => (
              <div key={idx} className="pt-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-teal-700">{apt.time}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      apt.status === 'Arrived'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 mt-0.5">{apt.patient}</div>
                <div className="text-[10px] text-slate-500">{apt.doctor} ({apt.dept})</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: PATIENT FOOTFALL TREND */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Patient Footfall Trend (Hourly Influx)
            </h3>
            <p className="text-xs text-slate-500">Distribution of patient arrivals to balance triage staff allocation</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Peak Hours: 10:00 AM & 02:00 PM</span>
        </div>

        <div className="grid grid-cols-10 gap-2 items-end h-32 pt-4">
          {footfallHours.map((slot, idx) => {
            const heightPercent = Math.round((slot.count / maxFootfall) * 100);
            const isPeak = slot.count >= 18;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-600 mb-1 group-hover:text-teal-600">
                  {slot.count}
                </span>
                <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all ${
                      isPeak
                        ? 'bg-gradient-to-t from-teal-600 to-cyan-500'
                        : 'bg-teal-200 hover:bg-teal-300'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1.5">{slot.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
