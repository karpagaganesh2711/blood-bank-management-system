import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DonationAppointment, BloodComponent } from '../../types/hemora';
import { mockAppointmentService } from '../../services/mockServices';
import { MOCK_CENTERS } from '../../mock/appointments';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  CalendarDays,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const DonorAppointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<DonationAppointment[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<DonationAppointment | null>(null);

  // New booking form state
  const [selectedCenterId, setSelectedCenterId] = useState(MOCK_CENTERS[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('Packed Red Blood Cells (PRBC)');
  const [notice, setNotice] = useState<string | null>(null);

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('11:30 AM');

  const loadAppointments = async () => {
    const res = await mockAppointmentService.getAppointments();
    setAppointments(res);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const center = MOCK_CENTERS.find(c => c.id === selectedCenterId) || MOCK_CENTERS[0];
    await mockAppointmentService.bookAppointment({
      donorId: user?.id || 'usr-donor-01',
      donorName: user?.name || 'Alex Rivers',
      donorBloodGroup: (user as any)?.bloodGroup || 'O-',
      centerName: center.name,
      centerAddress: center.address,
      date: selectedDate,
      timeSlot: selectedSlot,
      componentTarget: selectedComponent,
    });
    setShowBookingModal(false);
    setNotice('Donation appointment scheduled successfully!');
    setTimeout(() => setNotice(null), 4000);
    loadAppointments();
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    await mockAppointmentService.cancelAppointment(id);
    setNotice('Appointment cancelled.');
    setTimeout(() => setNotice(null), 3500);
    loadAppointments();
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt) return;
    await mockAppointmentService.rescheduleAppointment(rescheduleApt.id, rescheduleDate, rescheduleSlot);
    setRescheduleApt(null);
    setNotice('Appointment successfully rescheduled.');
    setTimeout(() => setNotice(null), 4000);
    loadAppointments();
  };

  const scheduledApts = appointments.filter(a => a.status === 'SCHEDULED');
  const pastApts = appointments.filter(a => a.status !== 'SCHEDULED');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Donation Appointments & Schedules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reserve your phlebotomy chair or apheresis machine at regional collection pavilions
          </p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Active Appointments */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-rose-600" />
          <span>Active Bookings</span>
        </h2>

        {scheduledApts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            No active appointments booked. Click "Book New Appointment" to schedule your next session.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledApts.map(apt => (
              <div
                key={apt.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {apt.appointmentCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                    Confirmed
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {apt.centerName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.centerAddress}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>{apt.date} · {apt.timeSlot}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {apt.componentTarget}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setRescheduleApt(apt);
                      setRescheduleDate(apt.date);
                      setRescheduleSlot(apt.timeSlot || '09:00 - 10:00');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>
                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past/Concluded Appointments */}
      {pastApts.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Concluded & Historic Sessions
          </h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {pastApts.map(apt => (
              <div key={apt.id} className="p-4 flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{apt.centerName}</div>
                  <div className="text-[11px] text-slate-400">{apt.date} · {apt.componentTarget}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  apt.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleBookSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-rose-600" />
                <span>Schedule Donation Appointment</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Collection Center
                </label>
                <select
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {MOCK_CENTERS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.address}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Target Component
                </label>
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC) — 350 mL</option>
                  <option value="Whole Blood">Whole Blood — 450 mL</option>
                  <option value="Platelet Apheresis">Platelet Apheresis (Platelet Single Donor)</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-600 dark:text-slate-400 text-[11px] space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Pre-Donation Advice:</div>
                <p>Ensure you drink 500mL of water, eat a healthy meal 2-3 hours prior, and avoid vigorous exercise 12 hours before.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRescheduleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Reschedule Appointment</h3>
              <button type="button" onClick={() => setRescheduleApt(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  New Time Slot
                </label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRescheduleApt(null)}
                className="px-3 py-1.5 text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
              >
                Update Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
