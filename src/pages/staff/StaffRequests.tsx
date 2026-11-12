import React, { useState, useEffect } from 'react';
import { BloodRequest, BloodUnitItem, BloodGroup } from '../../types/hemora';
import { mockRequisitionService, mockInventoryService } from '../../services/mockServices';
import { GitPullRequest, Crosshair, ShieldCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';

// Compatibility lookup for RBC
const RBC_COMPATIBLE: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

export const StaffRequests: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [inventory, setInventory] = useState<BloodUnitItem[]>([]);
  const [matchingReq, setMatchingReq] = useState<BloodRequest | null>(null);
  const [selectedBags, setSelectedBags] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = async () => {
    const r = await mockRequisitionService.getRequests();
    const inv = await mockInventoryService.getInventory();
    setRequests(r);
    setInventory(inv);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenMatchModal = (req: BloodRequest) => {
    setMatchingReq(req);
    setSelectedBags(req.allocatedBagIds || []);
  };

  const handleConfirmCrossMatch = async () => {
    if (!matchingReq) return;
    await mockRequisitionService.crossMatch(matchingReq.id, selectedBags);
    setNotice(`Cross-match verified & ${selectedBags.length} unit(s) reserved for ${matchingReq.requestCode}!`);
    setTimeout(() => setNotice(null), 4000);
    setMatchingReq(null);
    loadData();
  };

  // Find compatible units
  const acceptableGroups = matchingReq ? RBC_COMPATIBLE[matchingReq.bloodGroup] || [matchingReq.bloodGroup] : [];
  const candidateUnits = matchingReq 
    ? inventory.filter(u => 
        (u.status === 'AVAILABLE' || matchingReq.allocatedBagIds?.includes(u.bagId)) &&
        acceptableGroups.includes(u.bloodGroup) &&
        u.component === matchingReq.component
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-rose-600" />
          <span>Hospital Requisition Triage & Immunohematology Cross-Match</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Serological antigen matching, cross-match verification, and reserve allocation
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-3">
        {requests.map(req => {
          const isEmergency = req.urgency === 'EMERGENCY';
          return (
            <div
              key={req.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm text-xs ${
                isEmergency ? 'border-rose-300 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {req.requestCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    isEmergency ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.urgency}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {req.hospitalName}
                  </span>
                </div>

                <div className="text-slate-600 dark:text-slate-300">
                  Patient: <strong className="text-slate-900 dark:text-white">{req.patientName}</strong> ({req.patientAge}y)
                  <span className="mx-2 text-slate-300">|</span>
                  Group: <strong className="font-mono text-rose-600 font-bold">{req.bloodGroup}</strong>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>{req.unitsRequested} units of {req.component}</span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Doctor: {req.doctorName} · {req.clinicalDiagnosis}
                </div>

                {req.allocatedBagIds && req.allocatedBagIds.length > 0 && (
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Allocated Bags: <strong className="font-mono">{req.allocatedBagIds.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                  {req.status}
                </span>

                {req.status === 'SUBMITTED' || req.status === 'TRIAGED' ? (
                  <button
                    onClick={() => handleOpenMatchModal(req)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Cross-Match</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenMatchModal(req)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded text-[11px]"
                  >
                    Modify
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Match Modal */}
      {matchingReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Serology Cross-Match: {matchingReq.requestCode}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Patient {matchingReq.patientName} ({matchingReq.bloodGroup}) · Requires {matchingReq.unitsRequested} units
                </p>
              </div>
              <button onClick={() => setMatchingReq(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 space-y-1">
              <div className="font-semibold text-rose-900 dark:text-rose-200">
                Acceptable Antigen-Compatible Donor Groups:
              </div>
              <div className="font-mono font-bold text-rose-700 dark:text-rose-300">
                {acceptableGroups.join(', ')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Select Cold Vault Units to Allocate:</span>
                <span className="font-mono">{selectedBags.length} / {matchingReq.unitsRequested} Selected</span>
              </div>

              {candidateUnits.length === 0 ? (
                <div className="p-6 text-center text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                  No compatible tested units available in stock. Trigger donor emergency call.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border rounded-xl">
                  {candidateUnits.map(unit => {
                    const isSelected = selectedBags.includes(unit.bagId);
                    return (
                      <div
                        key={unit.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedBags(prev => prev.filter(b => b !== unit.bagId));
                          } else {
                            if (selectedBags.length < matchingReq.unitsRequested) {
                              setSelectedBags(prev => [...prev, unit.bagId]);
                            }
                          }
                        }}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-rose-50 dark:bg-rose-950/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={isSelected} readOnly className="rounded text-rose-600" />
                          <div>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{unit.bagId}</span>
                            <span className="ml-2 font-mono font-bold text-rose-600">{unit.bloodGroup}</span>
                            <span className="text-slate-400 text-[11px] ml-2">{unit.storageZone}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">NAT Negative</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMatchingReq(null)}
                className="px-3 py-1.5 text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedBags.length === 0}
                onClick={handleConfirmCrossMatch}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-md"
              >
                Confirm Cross-Match & Reserve Units
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
