import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DonorUser, DonationAppointment } from '../../types/hemora';
import { mockAppointmentService } from '../../services/mockServices';
import { 
  Droplet, 
  Heart, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Award
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const donor = user as DonorUser;

  const [appointments, setAppointments] = useState<DonationAppointment[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    mockAppointmentService.getAppointments().then(res => {
      setAppointments(res.filter(a => a.status === 'SCHEDULED'));
    });
  }, []);

  const isEligible = (donor?.cooldownDaysRemaining ?? 0) === 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
              Donor Portal
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-mono">Registry ID: {donor?.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {donor?.name || 'Alex Rivers'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Your blood donations directly support emergency surgeries and trauma transfusions across metropolitan medical centers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Donor Pass</span>
          </button>
          <button
            onClick={() => navigate('/donor/appointments')}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Donation</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Blood Group</span>
            <Droplet className="w-4 h-4 text-rose-600 fill-current" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {donor?.bloodGroup || 'O-'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Universal Red Cell Donor
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Lifetime Donations</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {donor?.totalDonationsCount || 14} <span className="text-xs font-normal text-slate-500">units</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Gold Tier Life Saver
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Lives Impacted</span>
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ~{donor?.livesImpacted || 42}
          </div>
          <div className="text-[11px] text-slate-500">
            Based on 3 lives per whole blood unit
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Eligibility Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-5 h-5" />
            <span>Eligible to Donate</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Cooldown period 0 days remaining
          </div>
        </div>
      </div>

      {/* Two Columns: Next Scheduled Appointment & Recent Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Appointments */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Donation Appointment
              </h2>
            </div>
            <button
              onClick={() => navigate('/donor/appointments')}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
            >
              Manage & Book →
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-3">
              <p>You have no active appointment scheduled.</p>
              <button
                onClick={() => navigate('/donor/appointments')}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
              >
                Schedule Next Donation
              </button>
            </div>
          ) : (
            appointments.slice(0, 1).map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {apt.appointmentCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                    {apt.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {apt.centerName}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {apt.centerAddress}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>{apt.date} at {apt.timeSlot}</span>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Target: {apt.componentTarget}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Point-of-Care Vitals Summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Clinical Health Parameters
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Recorded Nov 2026</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-500">Hemoglobin (Hb)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {donor?.vitals?.hemoglobin || 15.2} g/dL <span className="text-[10px] font-normal text-emerald-600">(Optimal &ge; 12.5)</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-500">Body Weight</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {donor?.vitals?.weightKg || 74} kg <span className="text-[10px] font-normal text-emerald-600">(Safe &ge; 50kg)</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-500">Blood Pressure</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {donor?.vitals?.bloodPressure || '118/76'} mmHg
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-500">Resting Pulse</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {donor?.vitals?.pulseBpm || 66} bpm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Donor Pass Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="p-4 bg-gradient-to-br from-rose-600 to-rose-800 rounded-xl text-white text-left shadow-lg">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-rose-200">
                <span>Official HEMORA Donor ID</span>
                <span className="font-mono">{donor?.id}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{donor?.name}</h4>
                  <div className="text-xs text-rose-200">Voluntary Blood Donor</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white text-rose-700 font-mono font-extrabold text-base flex items-center justify-center shadow">
                  {donor?.bloodGroup || 'O-'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <QrCode className="w-28 h-28 text-slate-800 dark:text-slate-200" />
            </div>

            <p className="text-xs text-slate-500">
              Present this pass at any participating collection station for express check-in.
            </p>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
