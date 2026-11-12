import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StaffScreening: React.FC = () => {
  const [donorName, setDonorName] = useState('Alex Rivers');
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [hemoglobin, setHemoglobin] = useState(14.8);
  const [weightKg, setWeightKg] = useState(72);
  const [bloodPressure, setBloodPressure] = useState('120/78');
  const [pulse, setPulse] = useState(68);

  const [tattoosCheck, setTattoosCheck] = useState(true);
  const [medsCheck, setMedsCheck] = useState(true);
  const [temperatureCheck, setTemperatureCheck] = useState(true);

  const [verdict, setVerdict] = useState<{ eligible: boolean; message: string } | null>(null);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();

    if (hemoglobin < 12.5) {
      setVerdict({
        eligible: false,
        message: `Deferred: Hemoglobin (${hemoglobin} g/dL) is below the minimum clinical safety threshold of 12.5 g/dL. Recommend dietary iron supplementation and re-screening in 30 days.`
      });
      return;
    }

    if (weightKg < 50) {
      setVerdict({
        eligible: false,
        message: `Deferred: Donor weight (${weightKg} kg) is below 50 kg requirement for a standard 350-450 mL phlebotomy harvest.`
      });
      return;
    }

    if (!tattoosCheck || !medsCheck || !temperatureCheck) {
      setVerdict({
        eligible: false,
        message: `Deferred: Pre-donation health questionnaire criteria not satisfied. Temporary 6-month deferral protocol activated.`
      });
      return;
    }

    setVerdict({
      eligible: true,
      message: `CLEARED FOR PHLEBOTOMY: Physiological vitals optimal. Hemoglobin ${hemoglobin} g/dL, Weight ${weightKg} kg, BP ${bloodPressure}. Proceed to collection bay.`
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-teal-600" />
          <span>Point-of-Care Donor Medical Screening</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          CLIA and AABB donor qualification algorithms verifying vital signs and blood safety criteria
        </p>
      </div>

      <form onSubmit={handleEvaluate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 text-xs shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Donor Name / ID
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
              Reported Blood Group
            </label>
            <input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-bold text-rose-600"
            />
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700">
          <div className="font-bold text-slate-900 dark:text-white">
            Pre-Collection Vital Signs Inspection
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-bold">
                Hemoglobin (Hb)
              </label>
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="number"
                  step="0.1"
                  min="8"
                  max="20"
                  required
                  value={hemoglobin}
                  onChange={(e) => setHemoglobin(Number(e.target.value))}
                  className="w-full py-1.5 px-2 bg-white dark:bg-slate-900 border rounded-md font-mono font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">g/dL</span>
              </div>
              <span className="text-[10px] text-slate-400">Min 12.5</span>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-bold">
                Body Weight
              </label>
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="number"
                  min="35"
                  max="180"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full py-1.5 px-2 bg-white dark:bg-slate-900 border rounded-md font-mono font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">kg</span>
              </div>
              <span className="text-[10px] text-slate-400">Min 50 kg</span>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-bold">
                Blood Pressure
              </label>
              <input
                type="text"
                required
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full mt-1 py-1.5 px-2 bg-white dark:bg-slate-900 border rounded-md font-mono text-slate-900 dark:text-white"
                placeholder="120/80"
              />
              <span className="text-[10px] text-slate-400">Systolic &lt; 180</span>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] uppercase font-bold">
                Resting Pulse
              </label>
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="number"
                  min="40"
                  max="140"
                  required
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  className="w-full py-1.5 px-2 bg-white dark:bg-slate-900 border rounded-md font-mono text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">bpm</span>
              </div>
              <span className="text-[10px] text-slate-400">50 - 100</span>
            </div>
          </div>
        </div>

        {/* Screening Questionnaire */}
        <div className="space-y-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={tattoosCheck}
              onChange={(e) => setTattoosCheck(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-slate-700 dark:text-slate-300">
              No tattoos, body piercings, acupuncture, or invasive dental work in past 6 months.
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={medsCheck}
              onChange={(e) => setMedsCheck(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-slate-700 dark:text-slate-300">
              No active antibiotic course, aspirin within 48h (for platelets), or immunosuppressive medications.
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={temperatureCheck}
              onChange={(e) => setTemperatureCheck(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Oral body temperature measured strictly below 37.5°C (99.5°F). No acute upper respiratory symptoms.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md transition-colors"
        >
          Execute Clinical Qualification Decision
        </button>

        {verdict && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            verdict.eligible
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}>
            <div className="shrink-0 mt-0.5">
              {verdict.eligible ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
            </div>
            <div>
              <div className="font-bold text-sm">
                {verdict.eligible ? 'DONOR MEDICALLY APPROVED' : 'DONOR MEDICALLY DEFERRED'}
              </div>
              <p className="mt-1 leading-relaxed">{verdict.message}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
