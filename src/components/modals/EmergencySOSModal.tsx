import React, { useState } from 'react';
import { useBloodBank } from '../../context/BloodBankContext';
import { BloodGroup } from '../../types/bloodBank';
import { getCompatibleDonorGroups } from '../../utils/bloodCompatibility';
import { X, AlertTriangle, Radio, Send, CheckCircle2 } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const { stats, donors, broadcastEmergencyAlert } = useBloodBank();

  const initialGroup = stats.criticalShortages[0] || 'O-';
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(initialGroup);
  const [unitsNeeded, setUnitsNeeded] = useState(4);
  const [reason, setReason] = useState('Critical depletion in emergency trauma reserves. Impending code red shortage.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  // Find eligible donors that match this group or compatible donor groups
  const compatibleDonors = getCompatibleDonorGroups(selectedGroup, 'Packed Red Blood Cells (PRBC)');
  const matchingEligibleDonors = donors.filter(d => 
    compatibleDonors.includes(d.bloodGroup) && d.eligibilityStatus === 'Eligible'
  );

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastEmergencyAlert(selectedGroup, unitsNeeded, reason);
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Critical Blood Shortage Emergency SOS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {broadcastSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              SOS Broadcast Dispatched Successfully!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Urgent summons sent via SMS/Email to {matchingEligibleDonors.length} eligible donors with matching compatible blood profiles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Select Deficient Blood Group in Shortage:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => {
                  const isCurrentCritical = stats.criticalShortages.includes(bg);
                  return (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setSelectedGroup(bg)}
                      className={`py-2 px-2 rounded-lg font-mono font-bold text-xs border text-center transition-all ${
                        selectedGroup === bg
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {bg}
                      {isCurrentCritical && (
                        <span className="block text-[9px] font-normal text-rose-300">
                          Shortage
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Required Units Immediately
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Recipient Hospital Network
                </label>
                <input
                  type="text"
                  readOnly
                  value="Metropolitan Trauma Coalition"
                  className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Emergency Clinical Indication
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Target Donor Reach Breakdown */}
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-rose-900 dark:text-rose-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                  <span>Automated Donor Recruitment Radius:</span>
                </span>
                <span className="font-mono text-rose-700 dark:text-rose-400">
                  {matchingEligibleDonors.length} Donors Reachable
                </span>
              </div>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                Will dispatch high-priority summons to registered {selectedGroup} donors & compatible alternate donors ({compatibleDonors.join(', ')}).
              </p>
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
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Emergency SOS</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
