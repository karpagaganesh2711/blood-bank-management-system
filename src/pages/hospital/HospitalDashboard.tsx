import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HospitalUser, BloodRequest } from '../../types/hemora';
import { mockRequisitionService } from '../../services/mockServices';
import { 
  Building2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hospital = user as HospitalUser;

  const [requests, setRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    mockRequisitionService.getRequests().then(setRequests);
  }, []);

  const activeOrders = requests.filter(r => r.status !== 'FULFILLED' && r.status !== 'CANCELLED');
  const emergencyCount = activeOrders.filter(r => r.urgency === 'EMERGENCY').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
              Hospital Transfusion Station
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-mono">License: {hospital?.licenseNumber || 'HOSP-NY-90412-T1'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {hospital?.hospitalName || 'St. Jude Metropolitan Trauma Center'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            24/7 direct integration with the HEMORA regional blood reserve and rapid cold-chain dispatch courier.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/hospital/request')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>Emergency Blood Requisition</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Orders</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {activeOrders.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {emergencyCount > 0 ? (
              <span className="text-rose-600 font-bold">{emergencyCount} Code Red Emergency</span>
            ) : (
              'All orders within standard ETA'
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>In-Transit Dispatch</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {activeOrders.filter(r => r.status === 'DISPATCHED').length}
          </div>
          <div className="text-[11px] text-slate-500">
            Active temperature telemetry
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Authorized Doctors</span>
            <Stethoscope className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {hospital?.activeDoctorsCount || 42}
          </div>
          <div className="text-[11px] text-slate-500">
            Cleared for emergency requisition
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cross-Match Velocity</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            18.4 min
          </div>
          <div className="text-[11px] text-slate-500">
            Sub-hour trauma standard met
          </div>
        </div>
      </div>

      {/* Active Hospital Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Transfusion Orders
            </h2>
            <p className="text-xs text-slate-500">Live triage status from HEMORA central laboratory</p>
          </div>
          <button
            onClick={() => navigate('/hospital/tracking')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Live Tracking Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {activeOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No active blood requisitions. Click "Emergency Blood Requisition" to order units.
            </div>
          ) : (
            activeOrders.map(req => {
              const isEmergency = req.urgency === 'EMERGENCY';
              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isEmergency
                      ? 'border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {req.requestCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isEmergency 
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      }`}>
                        {req.urgency}
                      </span>
                      <span className="font-mono text-slate-400">{req.requestedAt}</span>
                    </div>

                    <div className="text-slate-800 dark:text-slate-200">
                      Patient: <strong className="text-slate-900 dark:text-white">{req.patientName}</strong> ({req.patientAge}y)
                      <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
                      Target Blood: <strong className="font-mono text-rose-600 font-bold">{req.bloodGroup}</strong>
                      <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
                      <span>{req.unitsRequested} units of {req.component}</span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Attending: {req.doctorName} · {req.clinicalDiagnosis}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-300">
                      Status: {req.status}
                    </span>
                    <button
                      onClick={() => navigate('/hospital/tracking')}
                      className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-xs font-semibold"
                    >
                      Track
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
