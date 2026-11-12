import React, { useState } from 'react';
import { useBloodBank } from '../context/BloodBankContext';
import { Shield, Search, Download, Filter } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useBloodBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Actor', 'Category', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.actor}"`,
      `"${l.category}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hemaflow_transfusion_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Transfusion Safety Compliance & Chain of Custody</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              FDA 21 CFR Part 606 & ISO 15189 compliant immutable chain-of-custody audit logs.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-md transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit actions, officers, unit IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Inventory">Inventory Accession & Cold-Chain</option>
            <option value="Donor">Donor Screening & Collection</option>
            <option value="Requisition">Hospital Orders & Dispatch</option>
            <option value="CrossMatch">Immunohematology Cross-Match</option>
            <option value="Emergency">Emergency Broadcasts</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No audit entries match the current filter.
            </div>
          ) : (
            filteredLogs.map(log => {
              const isCritical = log.badgeLevel === 'critical';
              const isWarning = log.badgeLevel === 'warning';

              return (
                <div key={log.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {log.category}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {log.action}
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>Officer / Sentinel:</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{log.actor}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
