import React, { useState } from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { DonationCamp } from '../types/bloodBank';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Phone, 
  X,
  Target
} from 'lucide-react';

export const BloodDriveCamps: React.FC = () => {
  const { camps, addCamp, registerForCamp } = useBloodBank();
  const [showAddCampModal, setShowAddCampModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New camp form state
  const [newTitle, setNewTitle] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('09:00 - 17:00');
  const [newTargetUnits, setNewTargetUnits] = useState(100);
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    addCamp({
      title: newTitle,
      organizer: newOrganizer,
      venue: newVenue,
      city: newCity,
      date: newDate,
      time: newTime,
      targetUnits: newTargetUnits,
      contactPerson: newContactPerson,
      contactPhone: newContactPhone,
    });
    setShowAddCampModal(false);
    setNewTitle('');
    setNewOrganizer('');
    setNewVenue('');
    setNewCity('');
    setNewDate('');
    setSuccessMsg('New blood donation drive scheduled successfully!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRegisterDonor = (campId: string, title: string) => {
    registerForCamp(campId);
    setSuccessMsg(`Registered donor slot confirmed for "${title}"!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner with generated realistic image */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="h-56 sm:h-64 w-full relative">
          <img
            src="/src/assets/images/blood_drive_mobile_camp_1794459359220.jpg"
            alt="Community Mobile Blood Donation Drive"
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex items-center p-6 sm:p-8">
            <div className="max-w-xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
                Community Outreach & Mobile Fleets
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Mobile Blood Donation Drives & Field Camps
              </h2>
              <p className="text-xs text-slate-300">
                Expanding voluntary non-remunerated donor engagement across universities, tech parks, and civic community centers.
              </p>
              <button
                onClick={() => setShowAddCampModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Blood Drive</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Camps List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {camps.map(camp => {
          const isCompleted = camp.status === 'Completed';
          const progressPercent = Math.min(
            100,
            Math.round(((isCompleted ? camp.collectedUnits : camp.registeredDonorsCount) / camp.targetUnits) * 100)
          );

          return (
            <div
              key={camp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    isCompleted
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {camp.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Target: {camp.targetUnits} units
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                  {camp.title}
                </h3>
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                  Organized by {camp.organizer}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{camp.date} · {camp.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{camp.venue}, {camp.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{camp.contactPerson} ({camp.contactPhone})</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">
                      {isCompleted ? 'Units Harvested' : 'Donors Registered'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {isCompleted ? camp.collectedUnits : camp.registeredDonorsCount} / {camp.targetUnits} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? 'bg-emerald-500' : 'bg-rose-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {!isCompleted ? (
                  <button
                    onClick={() => handleRegisterDonor(camp.id, camp.title)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Register Donor Slot (+1)</span>
                  </button>
                ) : (
                  <div className="text-center py-1.5 text-xs text-slate-400 font-medium">
                    Drive concluded & banked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Camp Modal */}
      {showAddCampModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCamp}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Schedule Community Blood Drive Camp
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCampModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Event Campaign Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro University Winter Blood Drive"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Organizing Partner
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Cross / Rotary"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Target Units
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={newTargetUnits}
                    onChange={(e) => setNewTargetUnits(Number(e.target.value))}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Drive Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    placeholder="09:00 - 17:00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Venue & Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Community Hall, 500 Parkview St"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Contact Coordinator
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Coordinator Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddCampModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-sm"
              >
                Publish Blood Drive
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
