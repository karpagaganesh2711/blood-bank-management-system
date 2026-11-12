import React, { useState, useEffect } from 'react';
import { DonationAppointment } from '../../types/hemora';
import { mockAppointmentService } from '../../services/mockServices';
import { CalendarCheck, CheckCircle2, Search, QrCode } from 'lucide-react';

export const StaffAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<DonationAppointment[]>([]);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const loadAppointments = async () => {
    const res = await mockAppointmentService.getAppointments();
    setAppointments(res);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCheckIn = (apt: DonationAppointment) => {
    setNotice(`Donor ${apt.donorName} (${apt.donorBloodGroup}) checked in at Phlebotomy Station 02!`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filtered = appointments.filter(a => 
    (a.donorName || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.appointmentCode || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.donorBloodGroup || '').includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-teal-600" />
            <span>Donor Appointment Roster & Check-In</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify arriving donors, match digital QR passes, and route to screening nurse
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search donor name, code, blood group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Slot & Date</th>
                <th className="py-3 px-4">Target Component</th>
                <th className="py-3 px-4 text-right">Station Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {apt.appointmentCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {apt.donorName}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                    {apt.donorBloodGroup}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {apt.date} · {apt.timeSlot}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {apt.componentTarget}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {apt.status === 'SCHEDULED' ? (
                      <button
                        onClick={() => handleCheckIn(apt)}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        Check-In Donor
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">{apt.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
