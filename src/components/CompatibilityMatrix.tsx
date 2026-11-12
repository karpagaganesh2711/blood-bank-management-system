import React, { useState } from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { BloodGroup, ComponentType } from '../types/bloodBank';
import { 
  RBC_COMPATIBILITY, 
  PLASMA_COMPATIBILITY, 
  checkTransfusionCompatibility 
} from '../utils/bloodCompatibility';
import { Check, X, Info, Search, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const CompatibilityMatrix: React.FC = () => {
  const { units } = useBloodBank();
  const [selectedRecipient, setSelectedRecipient] = useState<BloodGroup>('O-');
  const [selectedDonor, setSelectedDonor] = useState<BloodGroup>('O-');
  const [componentType, setComponentType] = useState<ComponentType>('Packed Red Blood Cells (PRBC)');

  const isPlasma = componentType === 'Fresh Frozen Plasma (FFP)' || componentType === 'Cryoprecipitate';
  const compatibilityMap = isPlasma ? PLASMA_COMPATIBILITY : RBC_COMPATIBILITY;

  const testResult = checkTransfusionCompatibility(selectedDonor, selectedRecipient, componentType);

  // Available stock count for the compatible donors
  const compatibleDonorsList = compatibilityMap[selectedRecipient] || [];
  const matchingUnitsInStock = units.filter(u => 
    u.status === 'Available' && 
    compatibleDonorsList.includes(u.bloodGroup) &&
    u.component === componentType
  );

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Blood Transfusion Compatibility & Cross-Match Matrix
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Clinically certified immunohematology algorithm based on ABO antigen presence and Rh(D) isohemagglutinins.
        </p>

        {/* Component Selector Tabs */}
        <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit text-xs">
          <button
            onClick={() => setComponentType('Packed Red Blood Cells (PRBC)')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              !isPlasma 
                ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Red Blood Cells / Whole Blood
          </button>
          <button
            onClick={() => setComponentType('Fresh Frozen Plasma (FFP)')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              isPlasma 
                ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Plasma & Cryoprecipitate
          </button>
        </div>
      </div>

      {/* Interactive Pair Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Recipient & Donor Selector */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Search className="w-4 h-4 text-rose-600" />
            <span>Real-Time Cross-Match Calculator</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recipient Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                1. Recipient (Patient) Blood Group:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setSelectedRecipient(bg)}
                    className={`py-2 px-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      selectedRecipient === bg
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Potential Donor Blood Group:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setSelectedDonor(bg)}
                    className={`py-2 px-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      selectedDonor === bg
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Verdict Box */}
          <div className={`p-4 rounded-xl border mt-4 transition-all ${
            testResult.isCompatible
              ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900'
              : 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg text-white shrink-0 mt-0.5 ${
                testResult.isCompatible ? 'bg-emerald-600' : 'bg-rose-600'
              }`}>
                {testResult.isCompatible ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {testResult.isCompatible ? 'COMPATIBLE FOR TRANSFUSION' : 'INCOMPATIBLE - DO NOT TRANSFUSE'}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white dark:bg-slate-800 border">
                    Donor {selectedDonor} → Recipient {selectedRecipient}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {testResult.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Live Units In Stock For Recipient */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Compatible Units in Cold Storage: <strong className="font-mono text-slate-900 dark:text-white">{matchingUnitsInStock.length} units</strong>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Acceptable donor groups: {compatibleDonorsList.join(', ')}
            </span>
          </div>
        </div>

        {/* Right: Transfusion Fundamentals & Universal Rules */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Universal Donor & Recipient Rules</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
              <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>O- Negative (Universal Red Cell Donor)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Lacks A, B, and Rh(D) antigens on erythrocyte membranes. Safe for emergency un-crossmatched infusion when patient blood group is unknown.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>AB+ Positive (Universal Red Cell Recipient)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Possesses both A, B, and Rh(D) antigens; does not produce anti-A, anti-B, or anti-D antibodies. Can safely receive red cells from all 8 blood types.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
              <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>AB Plasma (Universal Plasma Donor)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Plasma contains neither anti-A nor anti-B isohemagglutinins. Can be transfused to patients of any blood group without hemolyzing recipient cells.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive ABO/Rh Cross-Match Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Complete Compatibility Reference Grid ({isPlasma ? 'Plasma Transfusions' : 'Red Cell Transfusions'})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <th className="py-2.5 px-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                  Recipient ↓ / Donor →
                </th>
                {BLOOD_GROUPS.map(bg => (
                  <th key={bg} className="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                    {bg}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {BLOOD_GROUPS.map(recipient => {
                const acceptable = compatibilityMap[recipient] || [];
                return (
                  <tr key={recipient} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-left font-mono font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/20">
                      {recipient}
                    </td>
                    {BLOOD_GROUPS.map(donor => {
                      const isMatch = acceptable.includes(donor);
                      return (
                        <td key={donor} className="py-2 px-2">
                          {isMatch ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 text-slate-300 dark:text-slate-700 text-xs">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
