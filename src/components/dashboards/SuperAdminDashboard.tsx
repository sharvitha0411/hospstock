import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  Server,
  Activity,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Key,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';

interface SuperAdminDashboardProps {
  onNavigateToTab?: (tabKey: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigateToTab }) => {
  const { currentUser } = useApp();
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState('');

  // Microservices Health Status
  const systemServices = [
    { name: 'API Gateway Service', status: 'HEALTHY', latency: '24ms', uptime: '99.99%', load: '18%' },
    { name: 'PostgreSQL / Database Master', status: 'HEALTHY', latency: '8ms', uptime: '100%', load: '32%' },
    { name: 'ML Prediction Inference Engine', status: 'HEALTHY', latency: '18ms', uptime: '99.95%', load: '45%' },
    { name: 'Cold-Chain IoT Beacon Ingestion', status: 'HEALTHY', latency: '12ms', uptime: '100%', load: '22%' },
    { name: 'Push Notification Dispatcher', status: 'HEALTHY', latency: '15ms', uptime: '99.98%', load: '8%' }
  ];

  // Security Events Log
  const securityEvents = [
    {
      id: 'SEC-901',
      event: 'Failed Login Blocked (Rate Limit)',
      ip: '192.168.4.112',
      target: 'admin@medichain.demo',
      severity: 'WARNING',
      timestamp: 'Today, 09:14 AM'
    },
    {
      id: 'SEC-902',
      event: 'RBAC Permission Scope Verified',
      ip: '10.0.1.45',
      target: 'Dr. Arvind Swaminathan (Doctor)',
      severity: 'INFO',
      timestamp: 'Today, 08:30 AM'
    },
    {
      id: 'SEC-903',
      event: 'Automated API Secret Rotation Completed',
      ip: 'System Daemon',
      target: 'Internal Token Service',
      severity: 'INFO',
      timestamp: 'Yesterday, 23:59 IST'
    }
  ];

  const handleResetUser = (userName: string) => {
    setAdminSuccess(`Security credentials & session state reset for ${userName}. Audit logged.`);
    setTimeout(() => setAdminSuccess(null), 3000);
  };

  const filteredUsers = DEMO_USERS.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <Lock className="w-5 h-5 text-purple-600" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                MediChain Administration & System Governance
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Global Platform Control, User Directory, Service Health & Security Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Copilot Suggestion */}
        <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 px-3 py-2 rounded-xl text-xs text-purple-900">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="text-left">
            <span className="font-bold text-[11px] block text-purple-800">Admin Copilot:</span>
            <span className="text-[11px] text-purple-700">"Which facilities have system connectivity issues?"</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {adminSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{adminSuccess}</span>
        </div>
      )}

      {/* 6 TOP GOVERNANCE KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Users Active</span>
          <div className="text-2xl font-black text-slate-900 mt-1">48</div>
          <span className="text-[10px] text-slate-400">10 Distinct Roles</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Facilities</span>
          <div className="text-2xl font-black text-slate-900 mt-1">22</div>
          <span className="text-[10px] text-slate-400">Hospitals & Depots</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">Active Sessions</span>
          <div className="text-2xl font-black text-teal-700 mt-1">14</div>
          <span className="text-[10px] text-teal-600 font-bold">Online Now</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">System Health</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">99.98%</div>
          <span className="text-[10px] text-emerald-600">30-day Uptime</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">API Latency</span>
          <div className="text-2xl font-black text-blue-700 mt-1">24 ms</div>
          <span className="text-[10px] text-blue-600">Avg response time</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Database Health</span>
          <div className="text-2xl font-black text-purple-700 mt-1">100%</div>
          <span className="text-[10px] text-purple-600">Zero Replication Lag</span>
        </div>
      </div>

      {/* MAIN: USER MANAGEMENT TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">User & RBAC Access Directory</h2>
            <p className="text-xs text-slate-500">Global role definitions, facility assignment, and session security status</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search user, role, email..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">User & Email</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Facility / District</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900">{u.name}</div>
                    <span className="text-[10px] text-slate-500">{u.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{u.roleTitle}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {u.facilityName || 'Metro Central Directorate'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleResetUser(u.name)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                    >
                      Reset Token
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO PANEL SECTION:
          LEFT: SYSTEM HEALTH & MICROSERVICES (Span 6)
          RIGHT: SECURITY AUDIT EVENTS (Span 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MICROSERVICES HEALTH */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-purple-600" />
              Microservices & Infrastructure Health
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              All Operational
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {systemServices.map((svc, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{svc.name}</div>
                  <div className="text-[10px] text-slate-500">Latency: {svc.latency} • Uptime: {svc.uptime}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {svc.status}
                  </span>
                  <div className="text-[9px] text-slate-400 mt-0.5">Load: {svc.load}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY EVENTS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Recent Security Audit Events
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Zero Breaches</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 space-y-3 mt-3">
            {securityEvents.map((sec) => (
              <div key={sec.id} className="pt-2 flex flex-col space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{sec.event}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    sec.severity === 'WARNING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {sec.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{sec.target} • IP: {sec.ip}</div>
                <span className="text-[10px] text-slate-400">{sec.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
