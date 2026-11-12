import React, { useState } from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { BloodRequisition, BloodUnit } from '../types/bloodBank';
import { getCompatibleDonorGroups } from '../utils/bloodCompatibility';
import { 
  FileText, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Crosshair, 
  Clock, 
  X, 
  ShieldCheck,
  Building2,
  User,
  Activity
} from 'lucide-react';

interface RequisitionManagerProps {
  onOpenAddRequisitionModal: () => void;
}

export const RequisitionManager: React.FC<RequisitionManagerProps> = ({ onOpenAddRequisitionModal }) => {
  const { requisitions, units, crossMatchRequisition, fulfillRequisition, updateRequisitionStatus } = useBloodBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Cross-match modal state
  const [activeReqForMatch, setActiveReqForMatch] = useState<BloodRequisition | null>(null);
  const [selectedBagIds, setSelectedBagIds] = useState<string[]>([]);

  const filteredRequisitions = requisitions.filter(r => {
    const matchesSearch = 
      r.reqCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientBloodGroup.includes(searchTerm);

    const matchesUrgency = urgencyFilter === 'ALL' || r.urgency.startsWith(urgencyFilter);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesUrgency && matchesStatus;
  });

  const handleStartCrossMatch = (req: BloodRequisition) => {
    setActiveReqForMatch(req);
    setSelectedBagIds(req.matchedUnitBagIds || []);
  };

  const handleConfirmCrossMatch = () => {
    if (!activeReqForMatch) return;
    crossMatchRequisition(activeReqForMatch.id, selectedBagIds);
    setActiveReqForMatch(null);
    setSelectedBagIds([]);
  };

  // Find compatible units in inventory for this requisition
  const compatibleDonors = activeReqForMatch 
    ? getCompatibleDonorGroups(activeReqForMatch.patientBloodGroup, activeReqForMatch.requiredComponent)
    : [];

  const availableCompatibleUnits = activeReqForMatch
    ? units.filter(u => 
        (u.status === 'Available' || (activeReqForMatch.matchedUnitBagIds?.includes(u.bagId))) &&
        compatibleDonors.includes(u.bloodGroup) &&
        u.component === activeReqForMatch.requiredComponent
      )
    : [];

  return (
    <div className="space-y-5">
      {/* Search & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Hospital Blood Orders & Requisitions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Urgent trauma requests, cross-match serology verification, and emergency dispatch.
            </p>
          </div>
          <button
            onClick={onOpenAddRequisitionModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Requisition Order</span>
          </button>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Req code, hospital, patient, group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="ALL">All Urgency Levels</option>
            <option value="Emergency">Emergency (Immediate)</option>
            <option value="Urgent">Urgent (&lt;4 Hours)</option>
            <option value="Routine">Routine (Scheduled)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Cross-Matched">Cross-Matched</option>
            <option value="Approved">Approved</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>

      {/* Requisitions List */}
      <div className="space-y-3">
        {filteredRequisitions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            No blood requisitions match the selected criteria.
          </div>
        ) : (
          filteredRequisitions.map((req) => {
            const isEmergency = req.urgency.startsWith('Emergency');
            const isUrgent = req.urgency.startsWith('Urgent');

            return (
              <div
                key={req.id}
                className={`bg-white dark:bg-slate-900 border rounded-xl p-4 sm:p-5 transition-all ${
                  isEmergency
                    ? 'border-rose-300 dark:border-rose-900/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Requisition Identity & Patient Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {req.reqCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isEmergency
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 animate-pulse'
                          : isUrgent
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {req.urgency}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        req.status === 'Fulfilled' || req.status === 'Dispatched'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : req.status === 'Cross-Matched'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {req.requestedDate}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.hospitalName}</span>
                        <span className="text-slate-400 font-normal">({req.department})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span>Attending:</span>
                        <span className="text-slate-700 dark:text-slate-300">{req.doctorName}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-500">Patient:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{req.patientName}</span>
                      <span className="text-slate-400">({req.patientAge}y)</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-slate-500">Target Blood:</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                        {req.patientBloodGroup}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {req.unitsRequested} units of {req.requiredComponent}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <strong className="text-slate-700 dark:text-slate-300">Clinical Indication:</strong>{' '}
                      {req.clinicalIndication}
                    </div>

                    {req.matchedUnitBagIds && req.matchedUnitBagIds.length > 0 && (
                      <div className="text-xs flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Cross-Matched Units Allocated:</span>
                        <span className="font-mono text-slate-900 dark:text-white font-semibold">
                          {req.matchedUnitBagIds.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    {req.status === 'Pending Review' && (
                      <button
                        onClick={() => handleStartCrossMatch(req)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Cross-Match Lab</span>
                      </button>
                    )}

                    {req.status === 'Cross-Matched' && (
                      <>
                        <button
                          onClick={() => fulfillRequisition(req.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch Units</span>
                        </button>
                        <button
                          onClick={() => handleStartCrossMatch(req)}
                          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                        >
                          Adjust Units
                        </button>
                      </>
                    )}

                    {req.status === 'Dispatched' && (
                      <button
                        onClick={() => updateRequisitionStatus(req.id, 'Fulfilled')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirm Bedside Infusion</span>
                      </button>
                    )}

                    {req.status === 'Fulfilled' && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Transfusion Complete</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cross-Match Allocation Modal */}
      {activeReqForMatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cross-Match & Unit Allocation: <span className="font-mono text-rose-600">{activeReqForMatch.reqCode}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Patient {activeReqForMatch.patientName} · Required: {activeReqForMatch.unitsRequested} units of {activeReqForMatch.patientBloodGroup} {activeReqForMatch.requiredComponent}
                </p>
              </div>
              <button
                onClick={() => setActiveReqForMatch(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compatible Blood Types Guide for this requisition */}
            <div className="p-3 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-rose-900 dark:text-rose-200">
                Clinically Compatible Donor Blood Groups for {activeReqForMatch.patientBloodGroup}:
              </div>
              <div className="flex items-center gap-2 font-mono font-bold text-rose-700 dark:text-rose-300 text-sm">
                {compatibleDonors.map(bg => (
                  <span key={bg} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded border border-rose-200 dark:border-rose-800">
                    {bg}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Compatible Units in Cold Storage */}
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Select Tested Inventory Units to Cross-Match:</span>
                <span className="text-slate-500 font-mono">
                  Selected: {selectedBagIds.length} / {activeReqForMatch.unitsRequested} Required
                </span>
              </div>

              {availableCompatibleUnits.length === 0 ? (
                <div className="p-6 text-center text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                  No compatible units currently in stock for {activeReqForMatch.patientBloodGroup} ({activeReqForMatch.requiredComponent}). Please broadcast an Emergency SOS or schedule a priority donor.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {availableCompatibleUnits.map(unit => {
                    const isSelected = selectedBagIds.includes(unit.bagId);
                    return (
                      <div
                        key={unit.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedBagIds(prev => prev.filter(b => b !== unit.bagId));
                          } else {
                            if (selectedBagIds.length < activeReqForMatch.unitsRequested) {
                              setSelectedBagIds(prev => [...prev, unit.bagId]);
                            }
                          }
                        }}
                        className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="rounded text-rose-600 focus:ring-rose-500"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {unit.bagId}
                              </span>
                              <span className="px-1.5 py-0.2 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-rose-600 dark:text-rose-400">
                                {unit.bloodGroup}
                              </span>
                              <span className="text-slate-500">
                                {unit.volumeMl} mL
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {unit.storageLocation} · Exp: {unit.expiryDate}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            NAT & Serology Cleared
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                {selectedBagIds.length >= activeReqForMatch.unitsRequested 
                  ? 'All requested units accounted for.' 
                  : `Need ${activeReqForMatch.unitsRequested - selectedBagIds.length} more units.`}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReqForMatch(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedBagIds.length === 0}
                  onClick={handleConfirmCrossMatch}
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-md shadow-sm transition-colors"
                >
                  Approve Cross-Match & Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
