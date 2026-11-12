import React, { useState } from 'react';
import { BloodGroup, BloodComponent } from '../../types/hemora';
import { mockInventoryService } from '../../services/mockServices';
import { Droplet, Barcode, CheckCircle2, ShieldCheck, Plus } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const StaffDonations: React.FC = () => {
  const [donorName, setDonorName] = useState('Alex Rivers');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('Packed Red Blood Cells (PRBC)');
  const [volumeMl, setVolumeMl] = useState(350);
  const [storageZone, setStorageZone] = useState('Cold Vault 01 - Shelf B2');
  const [createdBag, setCreatedBag] = useState<string | null>(null);

  const handleHarvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().slice(0, 10);
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + (component === 'Platelet Apheresis' ? 5 : 35));

    const newUnit = await mockInventoryService.addUnit({
      bloodGroup,
      component,
      volumeMl,
      collectionDate: today,
      expiryDate: expDate.toISOString().slice(0, 10),
      storageZone,
      temperature: component === 'Platelet Apheresis' ? '+22.0°C' : '+3.8°C',
      status: 'AVAILABLE',
      donorName,
      donorId: 'usr-donor-01',
      screening: {
        hiv: 'Negative',
        hbv: 'Negative',
        hcv: 'Negative',
        syphilis: 'Non-reactive',
        malaria: 'Negative',
      },
    });

    setCreatedBag(newUnit.bagId);
    setTimeout(() => setCreatedBag(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Droplet className="w-5 h-5 text-rose-600 fill-current" />
          <span>Phlebotomy Collection & Barcode Accession</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Log completed phlebotomy harvest, print GS1-128 barcoded label, and store in temperature-controlled zone
        </p>
      </div>

      {createdBag && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="font-bold">Unit Banked Successfully!</div>
              <div>Generated Bag Barcode: <strong className="font-mono">{createdBag}</strong></div>
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
            NAT Screened
          </span>
        </div>
      )}

      <form onSubmit={handleHarvestSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Screened Donor Name
            </label>
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Confirmed ABO/Rh Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-bold text-rose-600"
            >
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Separated Component
            </label>
            <select
              value={component}
              onChange={(e) => {
                const comp = e.target.value as BloodComponent;
                setComponent(comp);
                if (comp === 'Whole Blood') setVolumeMl(450);
                else if (comp === 'Platelet Apheresis') setVolumeMl(260);
                else setVolumeMl(350);
              }}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
              <option value="Whole Blood">Whole Blood</option>
              <option value="Platelet Apheresis">Platelet Apheresis</option>
              <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
              <option value="Cryoprecipitate">Cryoprecipitate</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Harvested Volume (mL)
            </label>
            <input
              type="number"
              min={100}
              max={550}
              required
              value={volumeMl}
              onChange={(e) => setVolumeMl(Number(e.target.value))}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Cold Storage Vault & Shelf Assignment
          </label>
          <input
            type="text"
            required
            value={storageZone}
            onChange={(e) => setStorageZone(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Preservative CPDA-1 Added · Anticoagulant ratio 1:7 verified</span>
          </span>
          <span className="font-mono">CLIA Protocol 88-B</span>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Barcode className="w-4 h-4" />
          <span>Accession & Generate Barcode</span>
        </button>
      </form>
    </div>
  );
};
