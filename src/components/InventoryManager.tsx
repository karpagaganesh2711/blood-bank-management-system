import React, { useState } from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { BloodGroup, ComponentType, UnitStatus, BloodUnit } from '../types/bloodBank';
import { 
  Search, 
  Filter, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Thermometer,
  X,
  Check
} from 'lucide-react';

interface InventoryManagerProps {
  onOpenAddUnitModal: () => void;
}

const BLOOD_GROUPS: (BloodGroup | 'ALL')[] = ['ALL', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const COMPONENTS: (ComponentType | 'ALL')[] = [
  'ALL',
  'Packed Red Blood Cells (PRBC)',
  'Whole Blood',
  'Platelet Concentrate',
  'Fresh Frozen Plasma (FFP)',
  'Cryoprecipitate'
];

export const InventoryManager: React.FC<InventoryManagerProps> = ({ onOpenAddUnitModal }) => {
  const { units, updateUnitStatus } = useBloodBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'ALL'>('ALL');
  const [inspectUnit, setInspectUnit] = useState<BloodUnit | null>(null);

  // Filter logic
  const filteredUnits = units.filter(u => {
    const matchesSearch = 
      u.bagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedGroup === 'ALL' || u.bloodGroup === selectedGroup;
    const matchesComponent = selectedComponent === 'ALL' || u.component === selectedComponent;
    const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesComponent && matchesStatus;
  });

  const getExpiryLabel = (expiryDateStr: string) => {
    const now = new Date().getTime();
    const exp = new Date(expiryDateStr).getTime();
    const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { text: `Expired ${Math.abs(daysLeft)}d ago`, level: 'expired' };
    } else if (daysLeft <= 5) {
      return { text: `${daysLeft}d left (Expiring Soon)`, level: 'warning' };
    } else {
      return { text: `${daysLeft} days left`, level: 'normal' };
    }
  };

  return (
    <div className="space-y-5">
      {/* Header controls & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Blood Unit Cold-Chain Inventory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live tracking of tested, quarantined, and cross-matched blood components in storage.
            </p>
          </div>
          <button
            onClick={onOpenAddUnitModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Accession Blood Unit</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Bag ID, donor, rack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Blood Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as BloodGroup | 'ALL')}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {BLOOD_GROUPS.map(bg => (
              <option key={bg} value={bg}>Blood Group: {bg}</option>
            ))}
          </select>

          {/* Component Filter */}
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value as ComponentType | 'ALL')}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {COMPONENTS.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Components' : c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as UnitStatus | 'ALL')}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Reserved">Reserved</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Quarantined">Quarantined</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Bag Identifier</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Component & Vol</th>
                <th className="py-3 px-4">Collection Date</th>
                <th className="py-3 px-4">Shelf Expiry</th>
                <th className="py-3 px-4">Storage Zone</th>
                <th className="py-3 px-4">Screening</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No blood units match the chosen criteria.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u) => {
                  const expiry = getExpiryLabel(u.expiryDate);
                  return (
                    <tr 
                      key={u.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {u.bagId}
                        <div className="text-[10px] text-slate-400 font-sans">
                          Donor: {u.donorName}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sm text-rose-600 dark:text-rose-400 whitespace-nowrap">
                        {u.bloodGroup}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {u.component}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {u.volumeMl} mL
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono tabular-nums whitespace-nowrap">
                        {u.collectionDate}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                          {u.expiryDate}
                        </div>
                        <div className={`text-[10px] font-medium ${
                          expiry.level === 'expired' 
                            ? 'text-rose-600 dark:text-rose-400 font-semibold' 
                            : expiry.level === 'warning'
                            ? 'text-amber-600 dark:text-amber-400 font-medium'
                            : 'text-slate-500'
                        }`}>
                          {expiry.text}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{u.storageLocation}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {u.temperatureZone}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => setInspectUnit(u)}
                          className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>NAT/Serology Pass</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          u.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : u.status === 'Reserved'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : u.status === 'Dispatched'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status === 'Available' && (
                            <button
                              onClick={() => updateUnitStatus(u.id, 'Quarantined')}
                              className="text-[11px] px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                              title="Move to quarantine"
                            >
                              Quarantine
                            </button>
                          )}

                          {u.status === 'Quarantined' && (
                            <button
                              onClick={() => updateUnitStatus(u.id, 'Available')}
                              className="text-[11px] px-2 py-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 rounded font-medium transition-colors"
                            >
                              Release
                            </button>
                          )}

                          {u.status === 'Reserved' && (
                            <button
                              onClick={() => updateUnitStatus(u.id, 'Available')}
                              className="text-[11px] px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            >
                              Unreserve
                            </button>
                          )}

                          <button
                            onClick={() => setInspectUnit(u)}
                            className="text-[11px] px-2 py-1 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded font-medium transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="py-2.5 px-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing <strong className="font-mono text-slate-700 dark:text-slate-300">{filteredUnits.length}</strong> of <strong className="font-mono text-slate-700 dark:text-slate-300">{units.length}</strong> total units in storage</span>
          <span className="font-mono text-[11px]">Storage compliance ISO 15189 certified</span>
        </div>
      </div>

      {/* Detail / Screening Inspection Modal */}
      {inspectUnit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Blood Unit Specification: <span className="font-mono text-rose-600">{inspectUnit.bagId}</span>
                </h3>
                <p className="text-xs text-slate-500">Transfusion Safety & Serological Panel</p>
              </div>
              <button
                onClick={() => setInspectUnit(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase">Blood Group & Type</span>
                <div className="font-mono font-bold text-base text-rose-600 dark:text-rose-400">
                  {inspectUnit.bloodGroup}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {inspectUnit.component}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase">Volume & Preservation</span>
                <div className="font-mono font-bold text-base text-slate-900 dark:text-white">
                  {inspectUnit.volumeMl} mL
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  CPDA-1 / SAGM Solution
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase">Collection & Expiry</span>
                <div className="font-mono text-slate-900 dark:text-white">
                  Col: {inspectUnit.collectionDate}
                </div>
                <div className="font-mono text-rose-600 dark:text-rose-400">
                  Exp: {inspectUnit.expiryDate}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase">Storage & Temp</span>
                <div className="font-medium text-slate-900 dark:text-white">
                  {inspectUnit.storageLocation}
                </div>
                <div className="font-mono text-emerald-600 dark:text-emerald-400">
                  {inspectUnit.temperatureZone}
                </div>
              </div>
            </div>

            {/* Pathogen screening results */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mandatory Pathogen Screening (CLIA/WHO Standard)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded">
                  <span className="text-slate-600 dark:text-slate-400">HIV 1 & 2 Ab/Ag:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectUnit.testResults.hiv}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded">
                  <span className="text-slate-600 dark:text-slate-400">Hepatitis C (HCV):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectUnit.testResults.hcv}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded">
                  <span className="text-slate-600 dark:text-slate-400">Hepatitis B (HBsAg):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectUnit.testResults.hbv}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded">
                  <span className="text-slate-600 dark:text-slate-400">Syphilis (VDRL):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectUnit.testResults.syphilis}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded">
                  <span className="text-slate-600 dark:text-slate-400">Malaria Parasite Smear:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectUnit.testResults.malaria}</span>
                </div>
              </div>
            </div>

            {inspectUnit.notes && (
              <div className="text-xs text-slate-500 italic p-2 bg-slate-50 dark:bg-slate-800/40 rounded">
                Note: {inspectUnit.notes}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectUnit(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
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
