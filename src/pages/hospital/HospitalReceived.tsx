import React, { useState, useEffect } from 'react';
import { mockHospitalService } from '../../services/mockServices';
import { PackageCheck, ShieldCheck, Thermometer, CheckCircle2 } from 'lucide-react';

export const HospitalReceived: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    mockHospitalService.getReceivedBlood().then(setHistory);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-indigo-600" />
          <span>Received Blood Transfusions Ledger</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Chain-of-custody archive of delivered units with cold-chain arrival temperatures and bedside verification
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Bag ID & Req Code</th>
                <th className="py-3 px-4">Blood Group & Component</th>
                <th className="py-3 px-4">Arrival Timestamp</th>
                <th className="py-3 px-4">Cold-Chain Temp on Arrival</th>
                <th className="py-3 px-4">Receiving Clinician</th>
                <th className="py-3 px-4 text-right">Infusion Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.bagId}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.requisitionCode}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {item.bloodGroup} · {item.component}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {item.units} unit(s)
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.receivedAt}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{item.coldChainTempOnArrival}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Within ISO safety bounds</div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {item.receivedBy}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
