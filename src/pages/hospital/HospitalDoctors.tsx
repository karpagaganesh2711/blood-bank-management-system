import React, { useState, useEffect } from 'react';
import { DoctorStaffItem } from '../../types/hemora';
import { mockHospitalService } from '../../services/mockServices';
import { Stethoscope, Plus, Trash2, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HospitalDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorStaffItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [specialty, setSpecialty] = useState('Trauma Surgery');
  const [phone, setPhone] = useState('');
  const [emergencyAuth, setEmergencyAuth] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const loadDoctors = async () => {
    const list = await mockHospitalService.getDoctors();
    setDoctors(list);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockHospitalService.addDoctor({
      hospitalId: 'usr-hosp-01',
      fullName,
      medicalLicense,
      specialty,
      phone,
      authorizedForEmergencyOrder: emergencyAuth,
    });
    setShowAddModal(false);
    setFullName('');
    setMedicalLicense('');
    setPhone('');
    setNotice('Physician credential added to authorized transfusion roster.');
    setTimeout(() => setNotice(null), 3500);
    loadDoctors();
  };

  const handleRemoveDoctor = async (id: string) => {
    if (!window.confirm('Remove this doctor from authorized ordering roster?')) return;
    await mockHospitalService.removeDoctor(id);
    loadDoctors();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-indigo-600" />
            <span>Authorized Medical Staff & Surgeons</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hospital physicians credentialed to issue blood transfusions and activate MTP trauma orders
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Authorize New Doctor</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {doc.fullName}
                </h3>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {doc.specialty}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                doc.authorizedForEmergencyOrder
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {doc.authorizedForEmergencyOrder ? 'Code Red Cleared' : 'Routine Only'}
              </span>
            </div>

            <div className="space-y-1 text-slate-600 dark:text-slate-400">
              <div>License: <span className="font-mono text-slate-800 dark:text-slate-200">{doc.medicalLicense}</span></div>
              <div>Direct Phone: <span className="font-mono text-slate-800 dark:text-slate-200">{doc.phone}</span></div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Active Orders: {doc.activeOrdersCount}</span>
              <button
                onClick={() => handleRemoveDoctor(doc.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                title="Revoke Authorization"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddDoctor}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Authorize Attending Physician
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Doctor Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Samuel Chen, MD"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Medical License ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="MED-NY-12345"
                  value={medicalLicense}
                  onChange={(e) => setMedicalLicense(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Department / Specialty
                </label>
                <input
                  type="text"
                  required
                  placeholder="Trauma & Acute Care Surgery"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Direct Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 911-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center gap-2">
                <input
                  type="checkbox"
                  id="authCodeRed"
                  checked={emergencyAuth}
                  onChange={(e) => setEmergencyAuth(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="authCodeRed" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                  Authorize for Uncrossmatched Code Red Orders
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
              >
                Save Authorization
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
