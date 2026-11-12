import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, 
  Download, 
  Droplet, 
  CheckCircle2, 
  Printer, 
  X, 
  ShieldCheck, 
  Calendar, 
  MapPin 
} from 'lucide-react';

const MOCK_DONATION_RECORDS = [
  {
    id: 'rec-01',
    bagId: 'HMR-2026-9011',
    date: '2026-11-04',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 350,
    center: 'HEMORA Central Apheresis Pavilion',
    phlebotomist: 'Sarah Connor, RN',
    status: 'Banked & Screened Negative',
    patientRecipientHospital: 'St. Jude Metropolitan Trauma Center',
  },
  {
    id: 'rec-02',
    bagId: 'HMR-2026-8819',
    date: '2026-09-12',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 350,
    center: 'HEMORA Central Apheresis Pavilion',
    phlebotomist: 'Marcus Rivera, Phl',
    status: 'Bedside Infused (Successful Transfusion)',
    patientRecipientHospital: 'City Memorial Cancer Hospital',
  },
  {
    id: 'rec-03',
    bagId: 'HMR-2026-8412',
    date: '2026-06-18',
    component: 'Whole Blood',
    volumeMl: 450,
    center: 'Metro Civic Center Mobile Blood Unit',
    phlebotomist: 'Emma Davis, RN',
    status: 'Bedside Infused (Successful Transfusion)',
    patientRecipientHospital: 'Childrens Specialized Hospital',
  },
  {
    id: 'rec-04',
    bagId: 'HMR-2026-8104',
    date: '2026-03-24',
    component: 'Platelet Apheresis',
    volumeMl: 250,
    center: 'HEMORA North Hills Collection Station',
    phlebotomist: 'Sarah Connor, RN',
    status: 'Bedside Infused (Successful Transfusion)',
    patientRecipientHospital: 'St. Jude Metropolitan Trauma Center',
  }
];

export const DonorHistory: React.FC = () => {
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState<typeof MOCK_DONATION_RECORDS[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Lifetime Donation History & Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ledger of phlebotomy procedures, cold-chain units, and patient outcomes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300">
            Total Banked: 14 Units (4.9 Liters)
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Bag ID & Date</th>
                <th className="py-3 px-4">Component & Vol</th>
                <th className="py-3 px-4">Collection Center</th>
                <th className="py-3 px-4">Safety Screening</th>
                <th className="py-3 px-4">Clinical Destination</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_DONATION_RECORDS.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {rec.bagId}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {rec.date}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {rec.component}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {rec.volumeMl} mL
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <div>{rec.center}</div>
                    <div className="text-[10px] text-slate-400">By: {rec.phlebotomist}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CLIA/NAT Passed</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {rec.patientRecipientHospital}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      {rec.status}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCert(rec)}
                      className="px-2.5 py-1 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded font-medium text-[11px] transition-colors"
                    >
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-center">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="uppercase font-bold tracking-wider">Official Certificate of Donation</span>
              <button onClick={() => setSelectedCert(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="border-4 border-double border-rose-600/30 dark:border-rose-900/60 rounded-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  HEMORA Transfusion Medicine Network
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Certificate of Humanitarian Donation
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This certifies that voluntary blood donor <strong className="text-slate-900 dark:text-white">{user?.name}</strong> has generously donated <strong className="text-rose-600 font-mono">{selectedCert.volumeMl} mL</strong> of <strong className="text-slate-900 dark:text-white">{selectedCert.component}</strong> on <span className="font-mono">{selectedCert.date}</span> (Bag Identifier: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedCert.bagId}</span>), directly aiding critical patient care.
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <div>
                  <span className="block font-semibold text-slate-800 dark:text-slate-200">Sarah Connor, RN</span>
                  <span>Supervising Phlebotomist</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-800 dark:text-slate-200">ISO 15189 Certified</span>
                  <span>Cold-Chain Verified</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="py-2 px-4 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
