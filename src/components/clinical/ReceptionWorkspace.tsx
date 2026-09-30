import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Shield,
  ArrowRight,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReceptionWorkspace: React.FC = () => {
  const {
    currentUser,
    patients,
    addPatient,
    queue,
    addToQueue
  } = useApp();

  const [activeTab, setActiveTab] = useState<'REGISTER' | 'QUEUE' | 'DIRECTORY'>('QUEUE');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Patient Form State
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<string>('1992-06-15');
  const [age, setAge] = useState<number>(34);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('B+');
  const [chiefComplaint, setChiefComplaint] = useState<string>('Fever & body pain');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleRegisterAndQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPat = addPatient({
      name,
      dateOfBirth: dob,
      age: Number(age),
      gender,
      phone,
      address,
      emergencyContact,
      bloodGroup,
      facilityId: currentUser.facilityId || 'hosp-1',
      facilityName: currentUser.facilityName || 'Metro Apex Multi-Specialty Hospital'
    });

    addToQueue(newPat.patientId, chiefComplaint, isEmergency);

    setRegSuccess(`Patient ${newPat.name} registered (${newPat.patientId}) and assigned to acute triage queue!`);
    setName('');
    setPhone('');
    setAddress('');
    setEmergencyContact('');
    setTimeout(() => setRegSuccess(null), 4000);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header & Least Privilege Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Patient Registration & Front-Desk Triage</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                RECEPTION ROLE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentUser.name} · {currentUser.facilityName || 'Metro Apex Hospital'} · Desk: <strong>Central Outpatient Reception</strong>
            </p>
          </div>
        </div>

        {/* Least Privilege Badge */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-2 max-w-sm">
          <Shield className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>Role Restricted: Registration & queue management only. No clinical records or supply-chain permissions.</span>
        </div>
      </div>

      {regSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{regSuccess}</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Today's Registrations</span>
          <div className="text-2xl font-black text-slate-900">{patients.length + 18}</div>
          <span className="text-[11px] text-teal-600 font-semibold">+12% vs yesterday</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Waiting in Queue</span>
          <div className="text-2xl font-black text-amber-600">
            {queue.filter((q) => q.status === 'WAITING').length}
          </div>
          <span className="text-[11px] text-slate-500">Active tokens</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Emergency Arrivals</span>
          <div className="text-2xl font-black text-rose-600">
            {queue.filter((q) => q.isEmergency).length}
          </div>
          <span className="text-[11px] text-rose-500 font-semibold">Priority Triage</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg. Waiting Time</span>
          <div className="text-2xl font-black text-slate-900">14 min</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Under 20m target</span>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('QUEUE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'QUEUE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Today's Live Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab('REGISTER')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'REGISTER'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Register New Patient
        </button>
        <button
          onClick={() => setActiveTab('DIRECTORY')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'DIRECTORY'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Patient Directory ({patients.length})
        </button>
      </div>

      {/* TAB 1: QUEUE */}
      {activeTab === 'QUEUE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Active Token Queue Status</h3>
              <p className="text-xs text-slate-500">Live queue monitored across triage, clinical rooms, and pharmacy</p>
            </div>
            <button
              onClick={() => setActiveTab('REGISTER')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Registration</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Token #</th>
                  <th className="py-2.5 px-3">Patient ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Age/Gender</th>
                  <th className="py-2.5 px-3">Blood Group</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Check-In Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-black text-slate-900 flex items-center gap-2">
                      <span>{item.queueNumber}</span>
                      {item.isEmergency && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                          EMERGENCY
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.patientId}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.patientName}</td>
                    <td className="py-3 px-3 text-slate-600">{item.age} yrs · {item.gender}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.bloodGroup}</td>
                    <td className="py-3 px-3 text-slate-600">{item.department}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.tokenTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER FORM */}
      {activeTab === 'REGISTER' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-3xl">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900">Patient Demographic Intake</h3>
            <p className="text-xs text-slate-500">Collect verified details and issue instant triage queue token</p>
          </div>

          <form onSubmit={handleRegisterAndQueue} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXX-XXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth & Age</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-2/3 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    placeholder="Age"
                    className="w-1/3 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gender & Blood Group</label>
                <div className="flex gap-2">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street / Sector / District"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Relative Name & Phone"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chief Complaint</label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Acute chest discomfort / High fever"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <label htmlFor="isEmergency" className="text-xs font-bold text-rose-700 cursor-pointer">
                  Mark as Critical Emergency (Fast-track to Acute Care Bay)
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
              >
                <span>Register & Issue Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DIRECTORY */}
      {activeTab === 'DIRECTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Registered Patient Directory</h3>
              <p className="text-xs text-slate-500">Facility ID: {currentUser.facilityId || 'hosp-1'}</p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient name, ID, phone..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {p.patientId}
                  </span>
                  <span className="font-mono font-bold text-slate-600">Blood: {p.bloodGroup}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                <p className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.phone}</span>
                </p>
                <p className="text-slate-500 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{p.address}</span>
                </p>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Reg: {p.registrationDate}</span>
                  <button
                    onClick={() => {
                      addToQueue(p.patientId, 'Follow-up visit', false);
                      setActiveTab('QUEUE');
                    }}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Check In →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
