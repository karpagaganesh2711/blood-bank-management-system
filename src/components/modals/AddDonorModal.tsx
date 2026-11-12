import React, { useState } from 'react';
import { useBloodBank } from '../../context/BloodBankContext';
import { BloodGroup } from '../../types/bloodBank';
import { X, UserPlus, HeartPulse } from 'lucide-react';

interface AddDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const AddDonorModal: React.FC<AddDonorModalProps> = ({ isOpen, onClose }) => {
  const { addDonor } = useBloodBank();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Vital signs
  const [hemoglobin, setHemoglobin] = useState(14.0);
  const [weightKg, setWeightKg] = useState(65);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [pulseBpm, setPulseBpm] = useState(72);

  // Screening declarations
  const [checkWeight, setCheckWeight] = useState(true);
  const [checkTattoo, setCheckTattoo] = useState(true);
  const [checkMeds, setCheckMeds] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hemoglobin < 12.5) {
      alert('Hemoglobin level must be at least 12.5 g/dL to qualify for donation.');
      return;
    }
    if (weightKg < 50) {
      alert('Donor weight must be at least 50 kg to qualify.');
      return;
    }

    addDonor({
      fullName,
      age,
      gender,
      bloodGroup,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      city: city || 'Metro City',
      address: address || 'Main City Area',
      eligibilityStatus: 'Eligible',
      healthMetrics: {
        hemoglobin,
        weightKg,
        bloodPressure,
        pulseBpm,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-rose-600" />
              <span>Enroll New Blood Donor</span>
            </h3>
            <p className="text-xs text-slate-500">Record demographic registry & physiological pre-screening</p>
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
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samantha Miller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Blood Group (Confirmed)
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono font-bold text-rose-600 dark:text-rose-400"
              >
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Age (18-65)
              </label>
              <input
                type="number"
                min={18}
                max={65}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                City / Region
              </label>
              <input
                type="text"
                required
                placeholder="Metro City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Mobile Phone
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="donor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Vitals Section */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Physiological Pre-Screening (Point-of-Care Vitals)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-slate-500 text-[10px] uppercase">
                  Hemoglobin (Hb)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step={0.1}
                    min={10}
                    max={20}
                    value={hemoglobin}
                    onChange={(e) => setHemoglobin(Number(e.target.value))}
                    className="w-full py-1 px-2 bg-white dark:bg-slate-900 border rounded text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400">g/dL</span>
                </div>
                <span className="text-[10px] text-slate-400">Min 12.5</span>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] uppercase">
                  Body Weight
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={40}
                    max={200}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full py-1 px-2 bg-white dark:bg-slate-900 border rounded text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-slate-400">Min 50kg</span>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] uppercase">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="120/80"
                  className="w-full py-1 px-2 bg-white dark:bg-slate-900 border rounded text-xs font-mono"
                />
                <span className="text-[10px] text-slate-400">Systolic &lt; 180</span>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] uppercase">
                  Pulse Rate
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={50}
                    max={120}
                    value={pulseBpm}
                    onChange={(e) => setPulseBpm(Number(e.target.value))}
                    className="w-full py-1 px-2 bg-white dark:bg-slate-900 border rounded text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400">bpm</span>
                </div>
                <span className="text-[10px] text-slate-400">50-100</span>
              </div>
            </div>
          </div>

          {/* Questionnaire declarations */}
          <div className="space-y-1.5">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkTattoo}
                onChange={(e) => setCheckTattoo(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                required
              />
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                No tattoo, ear/body piercing, or acupuncture in the past 6 months.
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkMeds}
                onChange={(e) => setCheckMeds(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                required
              />
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                No fever, antibiotic course, dental extraction, or vaccine in the past 48-72 hours.
              </span>
            </label>
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
            Enroll Donor
          </button>
        </div>
      </form>
    </div>
  );
};
