import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StaffUser, BloodUnitItem, BloodRequest } from '../../types/hemora';
import { mockInventoryService, mockRequisitionService, mockAppointmentService } from '../../services/mockServices';
import { 
  Stethoscope, 
  Boxes, 
  HeartPulse, 
  GitPullRequest, 
  Truck, 
  CalendarCheck, 
  AlertTriangle,
  ArrowRight,
  Thermometer,
  ShieldCheck
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const staff = user as StaffUser;

  const [units, setUnits] = useState<BloodUnitItem[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    mockInventoryService.getInventory().then(setUnits);
    mockRequisitionService.getRequests().then(setRequests);
    mockAppointmentService.getAppointments().then(res => {
      setScheduledCount(res.filter(a => a.status === 'SCHEDULED').length);
    });
  }, []);

  const pendingCrossMatch = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'TRIAGED');
  const availableUnitsCount = units.filter(u => u.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      {/* Staff Workspace Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">
              Clinical Transfusion Console
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-mono">Operator ID: {staff?.staffId || 'STF-8821'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {staff?.name || 'Sarah Connor, RN'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Active Shift: <strong className="text-slate-900 dark:text-white">{staff?.shift || 'Morning'}</strong> · Department: <strong className="text-slate-900 dark:text-white">{staff?.department || 'Phlebotomy & Accession'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/staff/screening')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Screen Donor</span>
          </button>
          <button
            onClick={() => navigate('/staff/requests')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Triage Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Donors in Queue</span>
            <CalendarCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {scheduledCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Awaiting phlebotomy chair
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Cross-Match</span>
            <GitPullRequest className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {pendingCrossMatch.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Urgent trauma requests
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cold Vault Units</span>
            <Boxes className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {availableUnitsCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Tested & ready in storage
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cold-Chain Alarms</span>
            <Thermometer className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            0 Active
          </div>
          <div className="text-[11px] text-slate-500">
            Chambers at nominal +3.6°C
          </div>
        </div>
      </div>

      {/* Two Column Section: Clinical Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requisition Triage Needed */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <GitPullRequest className="w-4 h-4 text-rose-600" />
              <span>Pending Hospital Requisition Queue</span>
            </h2>
            <button
              onClick={() => navigate('/staff/requests')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Open Triage Lab →
            </button>
          </div>

          <div className="space-y-3">
            {pendingCrossMatch.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                All hospital orders have been cross-matched and staged.
              </div>
            ) : (
              pendingCrossMatch.map(req => (
                <div
                  key={req.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {req.requestCode}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {req.hospitalName}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        req.urgency === 'EMERGENCY' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Need: <strong className="font-mono text-rose-600">{req.bloodGroup}</strong> ({req.unitsRequested} units of {req.component})
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/staff/requests')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    Cross-Match
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Clinical Actions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Station Quick Launch
          </h2>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => navigate('/staff/appointments')}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Donor Check-In Queue</div>
                <div className="text-[11px] text-slate-500">Scan QR passes & assign to phlebotomy station</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/staff/donations')}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Record Phlebotomy Collection</div>
                <div className="text-[11px] text-slate-500">Label bag, record volume, and test tube barcodes</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/staff/dispatch')}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Cold-Chain Courier Dispatch</div>
                <div className="text-[11px] text-slate-500">Pack validated cooler boxes & issue manifest</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
