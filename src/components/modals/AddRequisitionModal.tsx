import React, { useState } from 'react';
import { useBloodBank } from '../../context/BloodBankContext';
import { BloodGroup, ComponentType, UrgencyLevel } from '../../types/bloodBank';
import { X, FilePlus2, AlertTriangle } from 'lucide-react';

interface AddRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const COMPONENTS: ComponentType[] = [
  'Packed Red Blood Cells (PRBC)',
  'Whole Blood',
  'Platelet Concentrate',
  'Fresh Frozen Plasma (FFP)',
  'Cryoprecipitate'
];

export const AddRequisitionModal: React.FC<AddRequisitionModalProps> = ({ isOpen, onClose }) => {
  const { createRequisition } = useBloodBank();

  const [hospitalName, setHospitalName] = useState('St. Jude General Hospital');
  const [department, setDepartment] = useState('Trauma & Emergency ICU');
  const [doctorName, setDoctorName] = useState('Dr. Rebecca Shaw');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(42);
  const [patientBloodGroup, setPatientBloodGroup] = useState<BloodGroup>('O+');
  const [requiredComponent, setRequiredComponent] = useState<ComponentType>('Packed Red Blood Cells (PRBC)');
  const [unitsRequested, setUnitsRequested] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('Urgent (<4 Hours)');
  const [clinicalIndication, setClinicalIndication] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequisition({
      hospitalName,
      department,
      doctorName,
      patientName,
      patientAge,
      patientBloodGroup,
      requiredComponent,
      unitsRequested,
      urgency,
      clinicalIndication: clinicalIndication || 'Acute hemorrhage secondary to trauma; hemoglobin critical.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FilePlus2 className="w-4 h-4 text-rose-600" />
              <span>Create Hospital Blood Requisition</span>
            </h3>
            <p className="text-xs text-slate-500">Submit clinical requisition for cross-matching & dispatch</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Hospital & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Ordering Hospital
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Department / Ward
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Attending Physician / Surgeon
            </label>
            <input
              type="text"
              required
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
            />
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Patient Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Anderson"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                min={0}
                max={120}
                required
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Blood & Component */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Patient Blood Group
              </label>
              <select
                value={patientBloodGroup}
                onChange={(e) => setPatientBloodGroup(e.target.value as BloodGroup)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono font-bold text-rose-600 dark:text-rose-400"
              >
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Units Requested
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={unitsRequested}
                onChange={(e) => setUnitsRequested(Number(e.target.value))}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Required Component
            </label>
            <select
              value={requiredComponent}
              onChange={(e) => setRequiredComponent(e.target.value as ComponentType)}
              className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
            >
              {COMPONENTS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Emergency (Immediate)', 'Urgent (<4 Hours)', 'Routine (Scheduled)'] as UrgencyLevel[]).map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setUrgency(lvl)}
                  className={`py-2 px-2 text-center rounded-lg border text-xs font-semibold transition-all ${
                    urgency === lvl
                      ? lvl.startsWith('Emergency')
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : lvl.startsWith('Urgent')
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-slate-800'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Clinical Indication & Diagnosis
            </label>
            <textarea
              rows={2}
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              placeholder="e.g. Major vehicular polytrauma, ruptured spleen, massive transfusion protocol activated."
              className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-sm"
          >
            Submit Requisition
          </button>
        </div>
      </form>
    </div>
  );
};
