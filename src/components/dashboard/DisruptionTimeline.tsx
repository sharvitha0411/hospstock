import React from 'react';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Truck,
  Droplets,
  CloudLightning
} from 'lucide-react';

interface DisruptionTimelineProps {
  onNavigateToDigitalTwin: () => void;
}

export const DisruptionTimeline: React.FC<DisruptionTimelineProps> = ({
  onNavigateToDigitalTwin
}) => {
  const events = [
    {
      id: 'disp-1',
      time: '08:15 AM (Today)',
      title: 'Flash Flood Submersion on Delta River Highway',
      type: 'WEATHER',
      severity: 'CRITICAL',
      icon: Droplets,
      affectedFacilities: 'River Delta Memorial & 3 sub-centers',
      impact: 'Arterial bridge closed. 3 pending IV Fluid shipments stalled.',
      mitigationStatus: 'Diverted via East Valley Secondary Bypass (+32 mins)',
      active: true
    },
    {
      id: 'disp-2',
      time: '06:40 AM (Today)',
      title: 'Cold-Chain Refrigeration Van Failure (MediCold)',
      type: 'SUPPLIER',
      severity: 'HIGH',
      icon: Truck,
      affectedFacilities: 'Metro Apex Medical Center',
      impact: 'Emergency Insulin lot #B-INS-41 delayed at interchange 9.',
      mitigationStatus: 'Backup van dispatched with dry ice pack',
      active: true
    },
    {
      id: 'disp-3',
      time: 'Yesterday, 11:30 PM',
      title: 'Coastal Cyclone Warning Stage 2 (Bay of Bengal)',
      type: 'WEATHER',
      severity: 'HIGH',
      icon: CloudLightning,
      affectedFacilities: 'Coastal Maritime Medical College',
      impact: 'Port customs clearance halted for emergency imported antibiotics.',
      mitigationStatus: 'Pre-positioned 3,000 units from Southern Central Depot',
      active: true
    },
    {
      id: 'disp-4',
      time: 'Yesterday, 03:00 PM',
      title: 'Warehouse Fire Drill & Physical Stock Audit',
      type: 'OPERATIONAL',
      severity: 'LOW',
      icon: CheckCircle2,
      affectedFacilities: 'Strategic Central Depot 01',
      impact: 'Temporary 2-hour dispatch freeze.',
      mitigationStatus: 'Resolved. Full operational throughput restored.',
      active: false
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Supply Disruption & Logistics Timeline
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              3 Active Incidents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of route blockages, warehouse delays, and external shocks
          </p>
        </div>

        <button
          onClick={onNavigateToDigitalTwin}
          className="px-2.5 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold hover:bg-cyan-100 flex items-center gap-1 transition-colors"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
          Simulate Impact
        </button>
      </div>

      {/* Timeline items */}
      <div className="py-3 space-y-3">
        {events.map((ev, index) => {
          const Icon = ev.icon;
          const isCrit = ev.severity === 'CRITICAL';
          const isHigh = ev.severity === 'HIGH';

          return (
            <div
              key={ev.id}
              className={`p-3 rounded-lg border text-xs flex gap-3 transition-all ${
                ev.active
                  ? isCrit
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-amber-50/60 border-amber-200'
                  : 'bg-slate-50/50 border-slate-200 opacity-70'
              }`}
            >
              <div
                className={`p-2 rounded-lg h-fit flex-shrink-0 ${
                  isCrit
                    ? 'bg-rose-500 text-white'
                    : isHigh
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 truncate">{ev.title}</h4>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                    {ev.time}
                  </span>
                </div>

                <div className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                  <span className="font-semibold text-slate-700">Affected:</span> {ev.affectedFacilities}
                  <br />
                  <span className="font-semibold text-slate-700">Impact:</span> {ev.impact}
                </div>

                <div className="mt-2 p-1.5 rounded bg-white/80 border border-slate-200/80 text-[11px] flex items-center justify-between">
                  <span className="text-teal-800 font-medium">
                    <strong>Mitigation:</strong> {ev.mitigationStatus}
                  </span>
                  {ev.active && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Incident response protocols synchronized with State Disaster Management Authority (SDMA).
        </span>
        <button
          onClick={onNavigateToDigitalTwin}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
        >
          Open Digital Twin <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
