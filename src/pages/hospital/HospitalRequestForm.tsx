import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BloodGroup, BloodComponent, RequestUrgency, DoctorStaffItem } from '../../types/hemora';
import { mockRequisitionService, mockHospitalService } from '../../services/mockServices';
import { 
  FilePlus2, 
  AlertTriangle, 
  Send, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Clock, 
  User 
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const COMPONENTS: BloodComponent[] = [
  'Packed Red Blood Cells (PRBC)',
  'Whole Blood',
  'Platelet Apheresis',
  'Fresh Frozen Plasma (FFP)',
  'Cryoprecipitate'
];

export const HospitalRequestForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<DoctorStaffItem[]>([]);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(42);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('Packed Red Blood Cells (PRBC)');
  const [unitsRequested, setUnitsRequested] = useState(2);
  const [urgency, setUrgency] = useState<RequestUrgency>('EMERGENCY');
  const [doctorName, setDoctorName] = useState('');
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    mockHospitalService.getDoctors().then(docs => {
      setDoctors(docs);
      if (docs.length > 0) setDoctorName(docs[0].fullName);
    });
  }, []);

  // Quick 1-click Trauma Presets
  const applyPreset = (preset: 'MTP' | 'TRAUMA_O_NEG' | 'SURGERY_STANDBY') => {
    if (preset === 'MTP') {
      setBloodGroup('O-');
      setComponent('Packed Red Blood Cells (PRBC)');
      setUnitsRequested(4);
      setUrgency('EMERGENCY');
      setClinicalDiagnosis('Massive Transfusion Protocol (MTP) activated: Exsanguinating traumatic hemorrhage.');
    } else if (preset === 'TRAUMA_O_NEG') {
      setBloodGroup('O-');
      setComponent('Packed Red Blood Cells (PRBC)');
      setUnitsRequested(2);
      setUrgency('EMERGENCY');
      setClinicalDiagnosis('Acute hypovolemic hemorrhagic shock secondary to trauma. Urgent uncrossmatched resuscitation.');
    } else {
      setBloodGroup('A+');
      setComponent('Packed Red Blood Cells (PRBC)');
      setUnitsRequested(2);
      setUrgency('ROUTINE');
      setClinicalDiagnosis('Elective vascular graft surgery routine standby cross-match.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await mockRequisitionService.createRequest({
        hospitalId: user?.id || 'usr-hosp-01',
        hospitalName: (user as any)?.hospitalName || 'St. Jude Metropolitan Trauma Center',
        patientName,
        patientAge,
        bloodGroup,
        component,
        unitsRequested,
        urgency,
        doctorName: doctorName || 'Dr. Rebecca Shaw',
        clinicalDiagnosis: clinicalDiagnosis || 'Severe trauma hemorrhage protocol.',
      });

      navigate('/hospital/tracking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-rose-600" />
            <span>Hospital Blood Requisition Console</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue certified orders for immediate cold-chain allocation and cross-match triage
          </p>
        </div>
      </div>

      {/* Emergency Quick Presets */}
      <div className="p-4 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/40 dark:to-amber-950/30 border border-rose-200 dark:border-rose-900 rounded-xl space-y-2 text-xs">
        <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-rose-600" />
          <span>Trauma Center Fast Presets (1-Click Fill):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('TRAUMA_O_NEG')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-50 transition-colors"
          >
            Trauma Stat: 2 Units O- PRBC
          </button>
          <button
            type="button"
            onClick={() => applyPreset('MTP')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-50 transition-colors"
          >
            Code Red MTP: 4 Units O-
          </button>
          <button
            type="button"
            onClick={() => applyPreset('SURGERY_STANDBY')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 transition-colors"
          >
            Routine Surgery Standby
          </button>
        </div>
      </div>

      {/* Requisition Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 text-xs shadow-sm">
        {/* Urgency Level Selector */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
            Urgency Priority Classification
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setUrgency('EMERGENCY')}
              className={`p-3 rounded-xl border text-center transition-all ${
                urgency === 'EMERGENCY'
                  ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-md'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">EMERGENCY</div>
              <div className="text-[10px] opacity-80">&lt; 15 mins dispatch</div>
            </button>

            <button
              type="button"
              onClick={() => setUrgency('URGENT')}
              className={`p-3 rounded-xl border text-center transition-all ${
                urgency === 'URGENT'
                  ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-md'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">URGENT</div>
              <div className="text-[10px] opacity-80">&lt; 2-4 hours</div>
            </button>

            <button
              type="button"
              onClick={() => setUrgency('ROUTINE')}
              className={`p-3 rounded-xl border text-center transition-all ${
                urgency === 'ROUTINE'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-slate-800 font-bold shadow-md'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">ROUTINE</div>
              <div className="text-[10px] opacity-80">Scheduled standby</div>
            </button>
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Patient Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jonathan Hall"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Patient Age
            </label>
            <input
              type="number"
              min={0}
              max={120}
              required
              value={patientAge}
              onChange={(e) => setPatientAge(Number(e.target.value))}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Blood Group & Units */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Target Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-bold text-rose-600 dark:text-rose-400"
            >
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Component Type
            </label>
            <select
              value={component}
              onChange={(e) => setComponent(e.target.value as BloodComponent)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            >
              {COMPONENTS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Number of Units
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={unitsRequested}
              onChange={(e) => setUnitsRequested(Number(e.target.value))}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Ordering Physician */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Ordering Attending Physician
          </label>
          <select
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.fullName}>
                {d.fullName} ({d.specialty} · License {d.medicalLicense})
              </option>
            ))}
          </select>
        </div>

        {/* Clinical Diagnosis */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Clinical Diagnosis & Transfusion Indication
          </label>
          <textarea
            rows={3}
            required
            placeholder="e.g. Hemorrhagic shock secondary to liver laceration; baseline hemoglobin 5.8 g/dL."
            value={clinicalDiagnosis}
            onChange={(e) => setClinicalDiagnosis(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 text-[11px]">
            Requisition enters immediate immunohematology cross-match queue.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Submit Requisition</span>
          </button>
        </div>
      </form>
    </div>
  );
};
