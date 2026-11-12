import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HospitalUser } from '../../types/hemora';
import { Building2, ShieldCheck, MapPin, Phone, Mail, Save, CheckCircle2 } from 'lucide-react';

export const HospitalProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const hospital = user as HospitalUser;

  const [hospitalName, setHospitalName] = useState(hospital?.hospitalName || 'St. Jude Metropolitan Trauma Center');
  const [address, setAddress] = useState(hospital?.address || '800 Hospital Parkway, Building A');
  const [city, setCity] = useState(hospital?.city || 'Metro City');
  const [emergencyContact, setEmergencyContact] = useState(hospital?.emergencyContact || '+1 (555) 911-4040');
  const [bedCapacity, setBedCapacity] = useState(hospital?.bedCapacity || 650);
  const [notice, setNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      hospitalName,
      address,
      city,
      emergencyContact,
      bedCapacity,
    } as any);
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <span>Hospital Facility Profile & Emergency Routing</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Accreditation credentials, facility capacity, and 24/7 trauma emergency contact information
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Hospital profile updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Registered Facility Name
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              State Medical Facility License
            </label>
            <input
              type="text"
              readOnly
              value={hospital?.licenseNumber || 'HOSP-NY-90412-T1'}
              className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800/80 border rounded-lg font-mono text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Trauma ICU Hotline
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Total Inpatient Bed Capacity
            </label>
            <input
              type="number"
              value={bedCapacity}
              onChange={(e) => setBedCapacity(Number(e.target.value))}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Physical Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Metro Region
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Facility Credentials</span>
          </button>
        </div>
      </form>
    </div>
  );
};
