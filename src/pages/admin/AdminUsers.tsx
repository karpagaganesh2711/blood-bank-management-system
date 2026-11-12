import React, { useState } from 'react';
import { UserRole } from '../../types/hemora';
import { Users, Search, ShieldCheck, CheckCircle2, UserX } from 'lucide-react';

const MOCK_SYSTEM_USERS = [
  { id: 'usr-1', name: 'Alex Rivers', email: 'alex.rivers@donor.hemora.org', role: 'donor', status: 'ACTIVE', joined: '2024-03-15', detail: 'O- Negative · 14 Donations' },
  { id: 'usr-2', name: 'Elena Rostova', email: 'elena.r@donor.hemora.org', role: 'donor', status: 'ACTIVE', joined: '2024-05-12', detail: 'O- Negative · 12 Donations' },
  { id: 'usr-3', name: 'Dr. Rebecca Shaw', email: 'admissions@stjude.hemora.med', role: 'hospital', status: 'ACTIVE', joined: '2023-08-10', detail: 'St. Jude Metropolitan Trauma Center' },
  { id: 'usr-4', name: 'City Memorial Cancer Hospital', email: 'bloodbank@citymemorial.org', role: 'hospital', status: 'ACTIVE', joined: '2023-10-01', detail: 'Licensed ICU Facility #441' },
  { id: 'usr-5', name: 'Sarah Connor, RN', email: 'sarah.connor@staff.hemora.org', role: 'staff', status: 'ACTIVE', joined: '2024-01-20', detail: 'Senior Phlebotomist (STF-8821)' },
  { id: 'usr-6', name: 'Marcus Rivera, Phl', email: 'marcus.r@staff.hemora.org', role: 'staff', status: 'ACTIVE', joined: '2024-04-11', detail: 'Apheresis Technician (STF-8829)' },
  { id: 'usr-7', name: 'Dr. Arthur Sterling', email: 'director@hemora.org', role: 'admin', status: 'ACTIVE', joined: '2022-11-01', detail: 'System Director / SuperAdmin' },
];

export const AdminUsers: React.FC = () => {
  const [usersList, setUsersList] = useState(MOCK_SYSTEM_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const toggleStatus = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
      }
      return u;
    }));
  };

  const filtered = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.detail.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>User & Healthcare Facility Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access management for donors, partner hospitals, clinical staff, and system admins
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, facility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="py-1.5 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
        >
          <option value="ALL">All Roles</option>
          <option value="donor">Donors Only</option>
          <option value="hospital">Hospitals Only</option>
          <option value="staff">Clinical Staff Only</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">User / Facility</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Profile Credentials</th>
                <th className="py-3 px-4">Enrolled Date</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="capitalize px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {u.detail}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {u.joined}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 rounded text-[11px] border border-slate-200 dark:border-slate-700"
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
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
