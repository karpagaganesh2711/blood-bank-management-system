import React, { useState, useEffect } from 'react';
import { BloodRequest } from '../../types/hemora';
import { mockRequisitionService } from '../../services/mockServices';
import { Truck, Thermometer, ShieldCheck, CheckCircle2, Box, ArrowRight } from 'lucide-react';

export const StaffDispatch: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [selectedCourier, setSelectedCourier] = useState('HEMORA Rapid Trauma Courier #4');
  const [initialTemp, setInitialTemp] = useState('+3.6°C');
  const [notice, setNotice] = useState<string | null>(null);

  const loadRequests = async () => {
    const list = await mockRequisitionService.getRequests();
    setRequests(list.filter(r => r.status === 'CROSS_MATCHED'));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDispatch = async (reqId: string, reqCode: string) => {
    await mockRequisitionService.dispatch(
      reqId,
      `${selectedCourier} (Initial departure temp: ${initialTemp})`
    );
    setNotice(`Shipper dispatched for ${reqCode} with calibrated cold-chain datalogger!`);
    setTimeout(() => setNotice(null), 4000);
    loadRequests();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" />
          <span>Cold-Chain Packaging & Courier Dispatch</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pack insulated thermal containers, log initial temperature sensor calibration, and release to medical logistics
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Courier Settings Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs shadow-sm">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Designated Medical Courier
          </label>
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          >
            <option value="HEMORA Rapid Trauma Courier #4">HEMORA Rapid Trauma Courier #4 (Code Red Priority)</option>
            <option value="MedExpress Fleet Van #12">MedExpress Fleet Van #12 (Routine Transport)</option>
            <option value="Hospital Direct Clinical Transport">Hospital Direct Clinical Transport (ICU Pick-up)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Cold Shipper Datalogger Initial Temp
          </label>
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <input
              type="text"
              value={initialTemp}
              onChange={(e) => setInitialTemp(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-bold text-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Staged Orders List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Orders Cleared & Staged for Packing ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No orders currently waiting for courier pickup. Check the Requisition Triage queue.
          </div>
        ) : (
          requests.map(req => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {req.requestCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    req.urgency === 'EMERGENCY' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.urgency}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {req.hospitalName}
                  </span>
                </div>

                <div className="font-mono text-slate-400">
                  Patient: {req.patientName} ({req.bloodGroup})
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Reserved Units to Pack:</span>
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                    {req.allocatedBagIds?.join(', ') || 'No bags allocated'}
                  </div>
                </div>

                <button
                  onClick={() => handleDispatch(req.id, req.requestCode)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span>Dispatch Cold Shipper</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
