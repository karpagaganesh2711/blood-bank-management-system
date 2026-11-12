import React, { useState, useEffect } from 'react';
import { BloodUnitItem, BloodGroup } from '../../types/hemora';
import { mockInventoryService } from '../../services/mockServices';
import { Boxes, AlertTriangle, ShieldAlert, CheckCircle2, Droplet, Radio } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const AdminInventory: React.FC = () => {
  const [units, setUnits] = useState<BloodUnitItem[]>([]);
  const [broadcastGroup, setBroadcastGroup] = useState<BloodGroup | null>(null);
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    mockInventoryService.getInventory().then(setUnits);
  }, []);

  const counts: Record<BloodGroup, number> = {
    'O-': 0, 'O+': 0, 'A-': 0, 'A+': 0, 'B-': 0, 'B+': 0, 'AB-': 0, 'AB+': 0
  };

  units.forEach(u => {
    if (u.status === 'AVAILABLE') {
      counts[u.bloodGroup] = (counts[u.bloodGroup] || 0) + 1;
    }
  });

  const handleBroadcastSOS = (bg: BloodGroup) => {
    setBroadcastGroup(bg);
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastGroup(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-rose-600" />
            <span>Central Blood Bank Reserve Governance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time threshold controls, safety minimum triggers, and metropolitan shortage broadcasts
          </p>
        </div>
      </div>

      {broadcastSent && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-900 dark:text-rose-200 flex items-center gap-3">
          <Radio className="w-5 h-5 text-rose-600 animate-pulse" />
          <div>
            <div className="font-bold">Emergency Shortage Broadcast Dispatched!</div>
            <div>Automated SMS summons pushed to eligible registered {broadcastGroup} donors across 45km radius.</div>
          </div>
        </div>
      )}

      {/* Blood Group Reserve Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {BLOOD_GROUPS.map(bg => {
          const count = counts[bg] || 0;
          const isCritical = count <= 1;

          return (
            <div
              key={bg}
              className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                isCritical
                  ? 'border-rose-300 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="font-mono font-bold text-xl text-slate-900 dark:text-white">{bg}</div>
              <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{count}</div>
              <div className="text-[10px] text-slate-500">Units Ready</div>

              {isCritical ? (
                <button
                  onClick={() => handleBroadcastSOS(bg)}
                  className="w-full py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold shadow-sm"
                >
                  Alert Donors
                </button>
              ) : (
                <div className="text-[10px] text-emerald-600 font-semibold py-1">Adequate</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cold Storage Monitoring Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Active Vault Cold-Chain Enclosures (ISO 15189 Standard)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Vault Chamber 01 & 02</span>
            <div className="font-bold text-slate-900 dark:text-white">PRBC & Whole Blood</div>
            <div className="font-mono text-emerald-600 font-bold text-base mt-2">+3.6°C (Target: 2°C – 6°C)</div>
            <div className="text-[11px] text-slate-400">All backup compressors active</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Agitator Alpha & Beta</span>
            <div className="font-bold text-slate-900 dark:text-white">Platelet Apheresis Pods</div>
            <div className="font-mono text-emerald-600 font-bold text-base mt-2">+21.8°C (Target: 20°C – 24°C)</div>
            <div className="text-[11px] text-slate-400">60 cpm continuous mechanical rocking</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Ultra-Low Freezer Pods</span>
            <div className="font-bold text-slate-900 dark:text-white">FFP & Cryoprecipitate</div>
            <div className="font-mono text-emerald-600 font-bold text-base mt-2">-34.2°C (Target: &le; -30°C)</div>
            <div className="text-[11px] text-slate-400">Cryopreservation compliant</div>
          </div>
        </div>
      </div>
    </div>
  );
};
