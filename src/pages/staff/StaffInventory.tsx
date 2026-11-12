import React, { useState, useEffect } from 'react';
import { BloodUnitItem, BloodGroup, BloodComponent } from '../../types/hemora';
import { mockInventoryService } from '../../services/mockServices';
import { Boxes, Search, ShieldCheck, Thermometer, AlertTriangle } from 'lucide-react';

const BLOOD_GROUPS: (BloodGroup | 'ALL')[] = ['ALL', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const StaffInventory: React.FC = () => {
  const [units, setUnits] = useState<BloodUnitItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const loadUnits = async () => {
    const list = await mockInventoryService.getInventory();
    setUnits(list);
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleStatusToggle = async (id: string, newStatus: BloodUnitItem['status']) => {
    await mockInventoryService.updateStatus(id, newStatus);
    loadUnits();
  };

  const filtered = units.filter(u => {
    const matchesSearch = 
      (u.bagId || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.storageZone || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.donorName || '').toLowerCase().includes(search.toLowerCase());
    const matchesGroup = filterGroup === 'ALL' || u.bloodGroup === filterGroup;
    const matchesStatus = filterStatus === 'ALL' || u.status === filterStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            <span>Central Blood Bank Vault & Component Storage</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active monitoring of blood fractions across cold chambers, platelet agitators, and ultra-low plasma freezers
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Bag ID, shelf, donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value as any)}
          className="py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
        >
          {BLOOD_GROUPS.map(bg => (
            <option key={bg} value={bg}>Blood Group: {bg}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="AVAILABLE">Available for Cross-Match</option>
          <option value="RESERVED">Reserved</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="QUARANTINED">Quarantined</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Bag ID</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Component & Volume</th>
                <th className="py-3 px-4">Shelf & Zone</th>
                <th className="py-3 px-4">Temp</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(unit => (
                <tr key={unit.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {unit.bagId}
                    <div className="text-[10px] text-slate-400 font-sans font-normal">Donor: {unit.donorName}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                    {unit.bloodGroup}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{unit.component}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{unit.volumeMl} mL</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {unit.storageZone}
                  </td>

                  <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {unit.temperature}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {unit.expiryDate}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      unit.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : unit.status === 'RESERVED'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : unit.status === 'DISPATCHED'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {unit.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {unit.status === 'AVAILABLE' && (
                      <button
                        onClick={() => handleStatusToggle(unit.id, 'QUARANTINED')}
                        className="px-2 py-1 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded text-[11px] transition-colors"
                      >
                        Quarantine
                      </button>
                    )}
                    {unit.status === 'QUARANTINED' && (
                      <button
                        onClick={() => handleStatusToggle(unit.id, 'AVAILABLE')}
                        className="px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded text-[11px] font-semibold transition-colors"
                      >
                        Release
                      </button>
                    )}
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
