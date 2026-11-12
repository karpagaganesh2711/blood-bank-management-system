import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DonorUser } from '../../types/hemora';
import { User, Phone, Mail, MapPin, HeartPulse, CheckCircle2, Save } from 'lucide-react';

export const DonorProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const donor = user as DonorUser;

  const [name, setName] = useState(donor?.name || 'Alex Rivers');
  const [phone, setPhone] = useState(donor?.phone || '+1 (555) 729-3312');
  const [city, setCity] = useState(donor?.city || 'Metro City');
  const [address, setAddress] = useState(donor?.address || '742 Evergreen Blvd, Apt 4B');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      city,
      address,
    } as any);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Donor Medical Profile & Contact Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Maintain your personal demographic details and check point-of-care vital statistics
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Personal & Contact */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Demographic Information
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Blood Group (Validated)
              </label>
              <input
                type="text"
                readOnly
                value={donor?.bloodGroup || 'O-'}
                className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800/80 border rounded-lg font-mono font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Phone Number (SMS Alert Dispatch)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={donor?.email || 'alex.rivers@donor.hemora.org'}
                className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800/80 border rounded-lg text-slate-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>

        {/* Right: Point-of-Care Physiological Screening Ledger */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>Phlebotomy Vital Signs Archive</span>
          </h2>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Point-of-Care Pre-Screening Standards
            </div>
            <p className="text-slate-500 text-[11px]">
              Every donor must satisfy strict clinical guidelines prior to phlebotomy. Your current registered vitals:
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Hemoglobin Level</span>
                <div className="text-[10px] text-slate-400">Fingerstick photometer check</div>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                15.2 g/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Body Mass</span>
                <div className="text-[10px] text-slate-400">Calibrated clinic scale</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                74.0 kg
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Blood Pressure</span>
                <div className="text-[10px] text-slate-400">Sphygmomanometer reading</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                118/76 mmHg
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Resting Pulse</span>
                <div className="text-[10px] text-slate-400">Radial artery count</div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                66 bpm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
