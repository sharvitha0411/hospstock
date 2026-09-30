import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User } from '../../types';
import { HOSPITALS, MEDICINES, REDISTRIBUTION_PLANS, ALERTS } from '../../data/mockData';

interface ReportGeneratorProps {
  currentUser: User;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ currentUser }) => {
  const [reportType, setReportType] = useState<string>('WEEKLY_RISK');
  const [districtScope, setDistrictScope] = useState<string>('ALL');

  const reportTemplates = [
    { id: 'DAILY_SUPPLY', name: 'Daily Supply Telemetry Briefing', freq: 'Daily', pages: '2 Pages' },
    { id: 'WEEKLY_RISK', name: 'Weekly Executive Risk & Buffer Audit', freq: 'Weekly', pages: '4 Pages' },
    { id: 'DISTRICT_HEALTH', name: 'District Health Logistics Assessment', freq: 'Monthly', pages: '6 Pages' },
    { id: 'FORECAST_REPORT', name: 'AI Demand Forecast & Disease Outbreak Impact', freq: 'Bi-Weekly', pages: '5 Pages' },
    { id: 'STOCKOUT_EXPIRY', name: 'Critical Stock-Out & Expiry Exposure Report', freq: 'Real-Time', pages: '3 Pages' },
    { id: 'DIGITAL_TWIN_SIM', name: 'Digital Twin Climate Disruption Simulation Report', freq: 'Scenario', pages: '4 Pages' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Screen Controls (Hidden during Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Executive Report Generation & PDF Dispatch
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Module 7
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Produce certified health supply chain resilience documentation for state authorities, hospital boards, and disaster response teams.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md shadow-teal-600/20"
        >
          <Printer className="w-4 h-4" />
          Generate & Print PDF
        </button>
      </div>

      {/* Template Chooser Bar (Hidden during Print) */}
      <div className="no-print grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {reportTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => setReportType(t.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              reportType === t.id
                ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-500/20 text-teal-900 shadow-2xs'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span>{t.freq}</span>
              <span>{t.pages}</span>
            </div>
            <h4 className="font-extrabold text-xs line-clamp-2">{t.name}</h4>
          </button>
        ))}
      </div>

      {/* PRINT-READY EXECUTIVE REPORT PREVIEW CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
              <ShieldCheck className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  MedResilience AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Autonomous Healthcare Supply Chain Command & Resilience Authority
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">
              Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Ref Code: REP-MED-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <div className="text-teal-700 font-bold text-[11px] mt-0.5">
              Officer: {currentUser.name} ({currentUser.roleTitle})
            </div>
          </div>
        </div>

        {/* Title of Report */}
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 tracking-wider">
            EXECUTIVE AUDIT BRIEFING
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Weekly Medical Stock Resilience & Prescriptive Redistribution Briefing
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Synthesized operational analysis of 22 healthcare facilities, active monsoonal disease surge vectors, and inter-hospital stock balancing protocols.
          </p>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <p>
            During the current surveillance period, multi-variate XGBoost modeling identified an accelerated <strong>+18.4% Dengue fever</strong> cluster in Metro Central and Coastal South, coupled with a <strong>+24.2% waterborne diarrheal outbreak</strong> in River District. These epidemiological factors expanded the daily consumption velocity of <em>Paracetamol 500mg</em>, <em>ORS Sachets</em>, and <em>Normal Saline 0.9%</em> by an average of <strong>32.8%</strong> above historical seasonal baselines.
          </p>
          <p>
            Without mitigation, <strong>4 tertiary healthcare facilities</strong> face complete stock-outs within 72 hours. However, regional surplus stockpiles at <em>Civil Hospital Metro North</em> and <em>East Valley Regional Institute</em> contain <strong>18,400+ excess units</strong>. Execution of the 5 prioritized algorithmic redistribution routes successfully neutralizes 100% of critical shortages with an average dispatch time of <strong>48 minutes</strong> and estimated logistics cost under <strong>₹6,770</strong>.
          </p>
        </div>

        {/* Key Metrics Table */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
            2. High-Level Command Metrics
          </h3>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] block">Total Monitored Facilities</span>
              <span className="text-lg font-black text-slate-900">22 Centers</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] block">Critical Runway (&lt;3d)</span>
              <span className="text-lg font-black text-rose-600">4 Medicines</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] block">Surplus Ready For Transfer</span>
              <span className="text-lg font-black text-teal-700">18,400 Units</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] block">Near-Expiry Financial Value</span>
              <span className="text-lg font-black text-indigo-700">₹106,270</span>
            </div>
          </div>
        </div>

        {/* Top Critical Deficits */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
            3. Critical Deficit Facilities Requiring Immediate Allocation
          </h3>
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="py-2 px-3">Medicine</th>
                <th className="py-2 px-3">Hospital</th>
                <th className="py-2 px-3 text-right">Physical Stock</th>
                <th className="py-2 px-3 text-right">Predicted Daily Rate</th>
                <th className="py-2 px-3 text-right">Days Runway</th>
                <th className="py-2 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-bold">Artesunate Injection 60mg</td>
                <td className="py-2 px-3">Coastal Maritime Medical College</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">15 vials</td>
                <td className="py-2 px-3 text-right font-mono">22/day</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">0.7 Days</td>
                <td className="py-2 px-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">STOCKOUT TODAY</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Human Insulin Regular 100IU</td>
                <td className="py-2 px-3">Metro Apex Medical Center</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">48 vials</td>
                <td className="py-2 px-3 text-right font-mono">24/day</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">2.0 Days</td>
                <td className="py-2 px-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">CRITICAL</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Oral Rehydration Salts (ORS)</td>
                <td className="py-2 px-3">Metro Apex Medical Center</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">320 pkts</td>
                <td className="py-2 px-3 text-right font-mono">115/day</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">2.8 Days</td>
                <td className="py-2 px-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">CRITICAL</span></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold">Normal Saline IV (0.9% NaCl)</td>
                <td className="py-2 px-3">River Delta Memorial Hospital</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">180 bottles</td>
                <td className="py-2 px-3 text-right font-mono">150/day</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-rose-600">1.2 Days</td>
                <td className="py-2 px-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">CRITICAL</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Priority Transfer Recommendations */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
            4. Prescriptive Smart Redistribution Routing Directives
          </h3>
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="py-2 px-3">Item</th>
                <th className="py-2 px-3">Donor Facility (Surplus)</th>
                <th className="py-2 px-3">Recipient Facility (Shortage)</th>
                <th className="py-2 px-3 text-right">Transfer Qty</th>
                <th className="py-2 px-3 text-right">Dist / ETA</th>
                <th className="py-2 px-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {REDISTRIBUTION_PLANS.slice(0, 4).map((p) => (
                <tr key={p.id}>
                  <td className="py-2 px-3 font-bold">{p.medicineName}</td>
                  <td className="py-2 px-3 text-slate-600">{p.fromHospitalName}</td>
                  <td className="py-2 px-3 text-slate-600">{p.toHospitalName}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-teal-700">{p.transferQuantity} units</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600">{p.distanceKm}km ({p.etaMinutes}m)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{p.estimatedCostINR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Sign-off and Seal */}
        <div className="pt-6 border-t-2 border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 block">Command Approval Signature:</span>
            <div className="font-mono text-teal-800 text-base font-bold italic mt-1">Dr. Rajesh Vardhan</div>
            <span className="text-[10px] text-slate-400">State Health Director & Command Chief</span>
          </div>

          <div className="text-right">
            <div className="inline-block p-2 border-2 border-dashed border-teal-600 rounded-lg text-center">
              <span className="text-[10px] font-bold text-teal-700 block">MEDRESILIENCE AI</span>
              <span className="text-[8px] text-slate-500 font-mono">DIGITALLY VERIFIED SEAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
