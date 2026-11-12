import React from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { BloodGroup } from '../types/bloodBank';
import { TabKey } from './Header';
import { 
  Droplet, 
  AlertCircle, 
  Clock, 
  FileText, 
  Users, 
  Thermometer, 
  ArrowRight,
  ShieldAlert,
  PlusCircle,
  Search,
  CheckCircle2
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (tab: TabKey) => void;
  onOpenSOS: () => void;
  onOpenAddUnit: () => void;
  onOpenAddDonor: () => void;
  onOpenAddRequisition: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenSOS,
  onOpenAddUnit,
  onOpenAddDonor,
  onOpenAddRequisition,
}) => {
  const { stats, requisitions, donors, units } = useBloodBank();

  // Top urgent requisitions
  const pendingRequisitions = requisitions.filter(r => r.status === 'Pending Review' || r.status === 'Cross-Matched');

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner if any blood group is low */}
      {stats.criticalShortages.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                Critical Blood Reserve Shortage Detected
              </h2>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Immediate donor recruitment required for: <strong className="font-mono">{stats.criticalShortages.join(', ')}</strong>. Reserve levels are under safety margins.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSOS}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              Broadcast Donor SOS
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 text-xs font-medium rounded-md transition-colors whitespace-nowrap"
            >
              Contact Donors
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Available Units</span>
            <div className="p-1.5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-md">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.availableUnits}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Total Logged: <strong className="font-mono text-slate-700 dark:text-slate-300">{stats.totalUnits}</strong></span>
            <button onClick={() => onNavigate('inventory')} className="text-rose-600 dark:text-rose-400 hover:underline">
              View inventory →
            </button>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Hospital Requests</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-md">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.activeRequisitions}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Pending triage</span>
            <button onClick={() => onNavigate('requisitions')} className="text-rose-600 dark:text-rose-400 hover:underline">
              Fulfill orders →
            </button>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Expiring in 7 Days</span>
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.expiringWithin7Days}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Prioritize for routine surgery standby
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Donors</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-md">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {donors.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{donors.filter(d => d.eligibilityStatus === 'Eligible').length} Currently Eligible</span>
            <button onClick={() => onNavigate('donors')} className="text-rose-600 dark:text-rose-400 hover:underline">
              Manage →
            </button>
          </div>
        </div>
      </div>

      {/* Blood Group Inventory Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Blood Stock Reserves by Blood Group
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live available units ready for immediate cross-matching and transfusion.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddUnit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Blood Unit</span>
            </button>
            <button
              onClick={() => onNavigate('compatibility')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Compatibility Check</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
          {BLOOD_GROUPS.map((bg) => {
            const count = stats.unitsByGroup[bg] || 0;
            const isCritical = count <= 1;
            const isSafe = count >= 3;

            return (
              <div
                key={bg}
                className={`p-3 rounded-lg border text-center transition-all ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20'
                    : isSafe
                    ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{bg}</span>
                </div>
                
                <div className="my-2">
                  <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {count}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">units</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCritical ? 'bg-rose-600' : isSafe ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(15, count * 25))}%` }}
                  />
                </div>

                <div className="mt-2 text-[11px] font-medium">
                  {isCritical ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">Low Reserve</span>
                  ) : isSafe ? (
                    <span className="text-emerald-700 dark:text-emerald-400">Adequate</span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400">Moderate</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Urgent Hospital Requisitions & Cold Chain Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Requisitions (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Active Hospital Blood Requests
                </h3>
              </div>
              <button
                onClick={onOpenAddRequisition}
                className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1"
              >
                + New Requisition
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-3">
              {pendingRequisitions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No pending requisitions awaiting triage. All orders dispatched.
                </div>
              ) : (
                pendingRequisitions.slice(0, 3).map((req) => (
                  <div key={req.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {req.reqCode}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {req.hospitalName}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          · {req.department}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Patient: <span className="font-medium text-slate-900 dark:text-white">{req.patientName}</span> ({req.patientAge}y)
                        <span className="mx-1.5 text-slate-300 dark:text-slate-700">|</span>
                        Group: <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{req.patientBloodGroup}</span>
                        <span className="mx-1.5 text-slate-300 dark:text-slate-700">|</span>
                        <span>{req.unitsRequested} units of {req.requiredComponent}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-md">
                        {req.clinicalIndication}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {req.urgency.split(' ')[0]}
                      </div>
                      <button
                        onClick={() => onNavigate('requisitions')}
                        className="mt-2 text-xs px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-800 rounded font-medium transition-colors"
                      >
                        Cross-Match
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Showing urgent orders</span>
            <button
              onClick={() => onNavigate('requisitions')}
              className="text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1"
            >
              <span>Manage all requisitions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Cold Chain Telemetry & Storage Facility (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="relative h-36 w-full bg-slate-800">
            <img
              src="/src/assets/images/medical_cold_storage_1794459359929.jpg"
              alt="Medical Blood Bank Cold Storage Laboratory"
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-rose-300 font-semibold">
                  Facility Cold-Chain Sentinel
                </span>
                <h4 className="text-sm font-bold text-white">Central Storage Enclosures</h4>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Cold Chambers 01 & 02</div>
                  <div className="text-[11px] text-slate-500">Whole Blood & PRBC (2°C - 6°C)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+3.8°C</span>
                <div className="text-[10px] text-slate-500">Nominal</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Platelet Agitators A & B</div>
                  <div className="text-[11px] text-slate-500">Continuous Oscillation (20°C - 24°C)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+22.1°C</span>
                <div className="text-[10px] text-slate-500">60 cpm Active</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Ultra-Low Plasma Freezers</div>
                  <div className="text-[11px] text-slate-500">FFP & Cryoprecipitate (≤ -30°C)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-32.5°C</span>
                <div className="text-[10px] text-slate-500">Nominal</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sensors calibrated today</span>
            </span>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-rose-600 dark:text-rose-400 font-medium hover:underline"
            >
              Inspect Cold Zones →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
