import React, { useState } from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { Donor, BloodGroup, ComponentType } from '../types/bloodBank';
import { 
  Users, 
  Search, 
  Plus, 
  Heart, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Printer, 
  X, 
  Activity, 
  Droplet 
} from 'lucide-react';

interface DonorManagerProps {
  onOpenAddDonorModal: () => void;
}

const BLOOD_GROUPS: (BloodGroup | 'ALL')[] = ['ALL', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const DonorManager: React.FC<DonorManagerProps> = ({ onOpenAddDonorModal }) => {
  const { donors, recordDonation } = useBloodBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [selectedDonorCard, setSelectedDonorCard] = useState<Donor | null>(null);
  const [donationDonor, setDonationDonor] = useState<Donor | null>(null);
  const [donationComponent, setDonationComponent] = useState<ComponentType>('Packed Red Blood Cells (PRBC)');
  const [donationVolume, setDonationVolume] = useState<number>(350);
  const [donationLocation, setDonationLocation] = useState<string>('Cold Chamber 01 - Rack A2');

  const filteredDonors = donors.filter(d => {
    const matchesSearch = 
      d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchesStatus = selectedStatus === 'ALL' || d.eligibilityStatus === selectedStatus;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  const handleRecordDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationDonor) return;
    recordDonation(donationDonor.id, donationComponent, donationVolume, donationLocation);
    setDonationDonor(null);
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Donor Roster & Phlebotomy Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Screening histories, cooldown intervals, and blood collection processing.
            </p>
          </div>
          <button
            onClick={onOpenAddDonorModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Donor</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search donor name, ID, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as BloodGroup | 'ALL')}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {BLOOD_GROUPS.map(bg => (
              <option key={bg} value={bg}>Blood Group: {bg}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="ALL">All Eligibility Statuses</option>
            <option value="Eligible">Eligible (Ready to Donate)</option>
            <option value="Cooldown">In Cooldown Interval</option>
            <option value="Deferred">Medically Deferred</option>
          </select>
        </div>
      </div>

      {/* Donors Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            No donors found matching the current search parameters.
          </div>
        ) : (
          filteredDonors.map((donor) => {
            const isEligible = donor.eligibilityStatus === 'Eligible';
            return (
              <div
                key={donor.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition-all"
              >
                <div>
                  {/* Top line with code and blood badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-500 font-medium">
                      {donor.donorCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs rounded border border-rose-200 dark:border-rose-900">
                        {donor.bloodGroup}
                      </span>
                    </div>
                  </div>

                  {/* Donor Name & basic metadata */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {donor.fullName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {donor.gender} · {donor.age} yrs · {donor.city}
                  </div>

                  {/* Contact details */}
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                    <div>Phone: <span className="font-mono text-slate-800 dark:text-slate-200">{donor.phone}</span></div>
                    <div className="truncate text-slate-500">{donor.email}</div>
                  </div>

                  {/* Clinical Vital Signs Bar */}
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div>
                      <div className="text-slate-400 text-[10px]">Hb Level</div>
                      <div className="font-mono font-semibold text-slate-900 dark:text-white">
                        {donor.healthMetrics.hemoglobin} <span className="text-[9px] font-normal text-slate-400">g/dL</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Weight</div>
                      <div className="font-mono font-semibold text-slate-900 dark:text-white">
                        {donor.healthMetrics.weightKg} <span className="text-[9px] font-normal text-slate-400">kg</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">BP / Pulse</div>
                      <div className="font-mono font-semibold text-slate-900 dark:text-white">
                        {donor.healthMetrics.bloodPressure}
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Status */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Eligibility Status</span>
                    {isEligible ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Eligible (Safe)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Cooldown ({donor.cooldownDaysLeft}d)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDonorCard(donor)}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Donor Card</span>
                  </button>

                  <button
                    disabled={!isEligible}
                    onClick={() => {
                      setDonationDonor(donor);
                      setDonationVolume(350);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                      isEligible
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Collect Blood</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record Blood Collection Modal */}
      {donationDonor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleRecordDonationSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Phlebotomy & Blood Accession
                </h3>
                <p className="text-xs text-slate-500">
                  Donor: {donationDonor.fullName} ({donationDonor.bloodGroup})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDonationDonor(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Component to Harvest
                </label>
                <select
                  value={donationComponent}
                  onChange={(e) => setDonationComponent(e.target.value as ComponentType)}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                >
                  <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                  <option value="Whole Blood">Whole Blood (450 mL)</option>
                  <option value="Platelet Concentrate">Platelet Apheresis</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Collected Volume (mL)
                </label>
                <input
                  type="number"
                  min={100}
                  max={500}
                  step={10}
                  value={donationVolume}
                  onChange={(e) => setDonationVolume(Number(e.target.value))}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Destination Storage Unit & Rack
                </label>
                <input
                  type="text"
                  value={donationLocation}
                  onChange={(e) => setDonationLocation(e.target.value)}
                  className="w-full py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                  placeholder="e.g. Cold Chamber 01 - Rack B2"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-800 dark:text-emerald-300">
                <div className="font-semibold">Automated Safety Protocol:</div>
                <div className="text-[11px] mt-0.5">
                  Collection will automatically issue a 56-day donor cooldown and generate unique barcoded Bag ID with pre-cleared NAT test sequencing.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDonationDonor(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-sm"
              >
                Confirm Phlebotomy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Digital Donor Card / Certificate Modal */}
      {selectedDonorCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>National Blood Donor Registry</span>
              <button
                onClick={() => setSelectedDonorCard(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Donor Card Header */}
            <div className="relative p-5 bg-gradient-to-br from-rose-600 to-rose-800 rounded-xl text-white text-left shadow-lg overflow-hidden">
              <div className="absolute right-3 -bottom-4 opacity-15">
                <Droplet className="w-28 h-28" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-rose-200">
                  Official Blood Donor Card
                </span>
                <span className="font-mono text-xs font-bold text-rose-100">
                  {selectedDonorCard.donorCode}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {selectedDonorCard.fullName}
                  </h4>
                  <div className="text-xs text-rose-200 mt-0.5">
                    {selectedDonorCard.gender} · Age {selectedDonorCard.age}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-white text-rose-700 font-mono font-extrabold text-lg flex items-center justify-center shadow-md">
                  {selectedDonorCard.bloodGroup}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-500/50 flex justify-between text-[11px] text-rose-100">
                <div>
                  <span className="text-[9px] uppercase block text-rose-300">Lifetime Donations</span>
                  <span className="font-mono font-bold text-white text-sm">{selectedDonorCard.totalDonations} units</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase block text-rose-300">Emergency Contact</span>
                  <span className="font-mono text-white">{selectedDonorCard.phone}</span>
                </div>
              </div>
            </div>

            {/* QR Mock & Barcode */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-around">
              <div className="w-16 h-16 bg-white p-1 rounded border border-slate-300 flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <div className="text-left text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Scan at Phlebotomy Desk</div>
                <div className="text-slate-500 text-[11px]">Valid across all regional blood centers and mobile donation vans.</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Donor Card</span>
              </button>
              <button
                onClick={() => setSelectedDonorCard(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
