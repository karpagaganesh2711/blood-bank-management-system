import React, { useState, useEffect } from 'react';
import { BloodRequest } from '../../types/hemora';
import { mockRequisitionService } from '../../services/mockServices';
import { 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  FileText,
  Search
} from 'lucide-react';

export const HospitalTracking: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmNotice, setConfirmNotice] = useState<string | null>(null);

  const loadRequests = async () => {
    const list = await mockRequisitionService.getRequests();
    setRequests(list);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleConfirmBedsideReceipt = async (requestId: string, reqCode: string) => {
    await mockRequisitionService.fulfill(requestId);
    setConfirmNotice(`Bedside receipt & cold-chain transfer confirmed for ${reqCode}!`);
    setTimeout(() => setConfirmNotice(null), 4000);
    loadRequests();
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterUrgency === 'ALL' || r.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  const getStepIndex = (status: BloodRequest['status']) => {
    switch (status) {
      case 'SUBMITTED': return 1;
      case 'TRIAGED': return 2;
      case 'CROSS_MATCHED': return 3;
      case 'DISPATCHED': return 4;
      case 'FULFILLED': return 5;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Real-Time Transfusion Tracking Board</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor central laboratory cross-matching, cold-box courier dispatch, and arrival telemetry
          </p>
        </div>
      </div>

      {confirmNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{confirmNotice}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search request code, patient, physician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
          />
        </div>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
        >
          <option value="ALL">All Urgencies</option>
          <option value="EMERGENCY">Emergency (Immediate)</option>
          <option value="URGENT">Urgent (&lt;4 Hours)</option>
          <option value="ROUTINE">Routine Standby</option>
        </select>
      </div>

      {/* Request Cards with Progress Pipeline */}
      <div className="space-y-4">
        {filteredRequests.map(req => {
          const step = getStepIndex(req.status);
          const isEmergency = req.urgency === 'EMERGENCY';

          return (
            <div
              key={req.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 space-y-4 shadow-sm transition-all ${
                isEmergency
                  ? 'border-rose-300 dark:border-rose-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {req.requestCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    isEmergency
                      ? 'bg-rose-600 text-white animate-pulse'
                      : req.urgency === 'URGENT'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {req.urgency}
                  </span>
                </div>

                <div className="text-slate-400 font-mono text-[11px]">
                  Ordered: {req.requestedAt} · Doctor: {req.doctorName}
                </div>
              </div>

              {/* Patient & Blood Info */}
              <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                <div>
                  Patient: <strong className="text-slate-900 dark:text-white">{req.patientName}</strong> ({req.patientAge}y)
                </div>
                <div className="text-slate-300 dark:text-slate-700">|</div>
                <div>
                  Blood: <strong className="font-mono text-rose-600 font-bold">{req.bloodGroup}</strong> ({req.unitsRequested} units of {req.component})
                </div>
                <div className="text-slate-300 dark:text-slate-700">|</div>
                <div className="text-slate-500 truncate max-w-md">
                  Indication: {req.clinicalDiagnosis}
                </div>
              </div>

              {/* Multi-Step Pipeline Visualizer */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-semibold text-slate-500 mb-1.5">
                  <span className={step >= 1 ? 'text-rose-600 dark:text-rose-400' : ''}>1. Order Submitted</span>
                  <span className={step >= 2 ? 'text-rose-600 dark:text-rose-400' : ''}>2. Lab Triaged</span>
                  <span className={step >= 3 ? 'text-rose-600 dark:text-rose-400' : ''}>3. Cross-Matched</span>
                  <span className={step >= 4 ? 'text-rose-600 dark:text-rose-400' : ''}>4. Courier Dispatched</span>
                  <span className={step >= 5 ? 'text-emerald-600 dark:text-emerald-400' : ''}>5. Bedside Infused</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step === 5 ? 'bg-emerald-500' : 'bg-rose-600'
                    }`}
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Details & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <div>
                  {req.allocatedBagIds && req.allocatedBagIds.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Allocated Tested Bags:</span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">
                        {req.allocatedBagIds.join(', ')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Awaiting serological reservation from Central Vault</span>
                  )}

                  {req.temperatureLoggedAtDispatch && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Transit condition: {req.temperatureLoggedAtDispatch}
                    </div>
                  )}
                </div>

                <div>
                  {req.status === 'DISPATCHED' && (
                    <button
                      onClick={() => handleConfirmBedsideReceipt(req.id, req.requestCode)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Bedside Receipt</span>
                    </button>
                  )}

                  {req.status === 'FULFILLED' && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Transfusion Completed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
