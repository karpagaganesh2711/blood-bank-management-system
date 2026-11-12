import React, { useState } from 'react';
import { useBloodBank } from '../../context/BloodBankContext';
import { BloodGroup, ComponentType } from '../../types/bloodBank';
import { X, Plus, ShieldCheck } from 'lucide-react';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const COMPONENTS: { type: ComponentType; defaultDays: number; defaultTemp: string; defaultVol: number }[] = [
  { type: 'Packed Red Blood Cells (PRBC)', defaultDays: 35, defaultTemp: '2°C - 6°C', defaultVol: 350 },
  { type: 'Whole Blood', defaultDays: 35, defaultTemp: '2°C - 6°C', defaultVol: 450 },
  { type: 'Platelet Concentrate', defaultDays: 5, defaultTemp: '20°C - 24°C', defaultVol: 250 },
  { type: 'Fresh Frozen Plasma (FFP)', defaultDays: 365, defaultTemp: '-30°C or colder', defaultVol: 250 },
  { type: 'Cryoprecipitate', defaultDays: 365, defaultTemp: '-30°C or colder', defaultVol: 150 },
];

export const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose }) => {
  const { addBloodUnit, donors } = useBloodBank();

  const [donorName, setDonorName] = useState(donors[0]?.fullName || 'Walk-in Voluntary Donor');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [component, setComponent] = useState<ComponentType>('Packed Red Blood Cells (PRBC)');
  const [volumeMl, setVolumeMl] = useState(350);
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().slice(0, 10));

  // Compute default expiry based on component
  const calculateDefaultExpiry = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const [expiryDate, setExpiryDate] = useState(calculateDefaultExpiry(35));
  const [storageLocation, setStorageLocation] = useState('Cold Chamber 01 - Rack A1');
  const [temperatureZone, setTemperatureZone] = useState('2°C - 6°C');
  const [notes, setNotes] = useState('Anticoagulant CPDA-1. Visual inspection normal.');

  // Screening state
  const [testsPassed, setTestsPassed] = useState(true);

  if (!isOpen) return null;

  const handleComponentChange = (selected: ComponentType) => {
    setComponent(selected);
    const conf = COMPONENTS.find(c => c.type === selected);
    if (conf) {
      setExpiryDate(calculateDefaultExpiry(conf.defaultDays));
      setTemperatureZone(conf.defaultTemp);
      setVolumeMl(conf.defaultVol);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBloodUnit({
      bloodGroup,
      component,
      volumeMl,
      collectionDate,
      expiryDate,
      donorId: `d-walkin-${Date.now()}`,
      donorName,
      storageLocation,
      temperatureZone,
      status: 'Available',
      testResults: {
        hiv: 'Negative',
        hcv: 'Negative',
        hbv: 'Negative',
        syphilis: 'Non-reactive',
        malaria: 'Negative',
      },
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Accession Blood Unit into Cold Storage
            </h3>
            <p className="text-xs text-slate-500">Record tested bag parameters and barcode into active stock</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Blood Group (ABO & Rh)
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

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Component Type
              </label>
              <select
                value={component}
                onChange={(e) => handleComponentChange(e.target.value as ComponentType)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              >
                {COMPONENTS.map(c => (
                  <option key={c.type} value={c.type}>{c.type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Donor Name / ID
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Net Volume (mL)
              </label>
              <input
                type="number"
                min={50}
                max={550}
                value={volumeMl}
                onChange={(e) => setVolumeMl(Number(e.target.value))}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Collection Date
              </label>
              <input
                type="date"
                required
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Calculated Expiry Date
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono text-rose-600 dark:text-rose-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Storage Enclosure & Shelf
              </label>
              <input
                type="text"
                required
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                placeholder="e.g. Cold Chamber 01 - Rack B2"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Temperature Target
              </label>
              <input
                type="text"
                readOnly
                value={temperatureZone}
                className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="testsCheckbox"
                checked={testsPassed}
                onChange={(e) => setTestsPassed(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
                required
              />
              <label htmlFor="testsCheckbox" className="text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                Mandatory Serology & NAT Testing Verified Negative
              </label>
            </div>
            <p className="text-[11px] text-slate-500 pl-5">
              Confirms non-reactive screening for HIV 1/2, Hepatitis B (HBsAg), Hepatitis C (HCV), Syphilis (VDRL), and Malaria.
            </p>
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
            Save & Label Unit
          </button>
        </div>
      </form>
    </div>
  );
};
