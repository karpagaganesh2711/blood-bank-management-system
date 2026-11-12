import React, { useState } from 'react';
import { FileSpreadsheet, Download, Search, ShieldCheck } from 'lucide-react';

const MOCK_AUDIT_TRAIL = [
  { id: 'aud-01', timestamp: '2026-11-11 20:30:14', actor: 'Lab Tech. Sarah Connor (STF-8821)', event: 'Cross-Match Verified', details: 'Unit HMR-2026-9012 (O-) reserved for Requisition HMR-REQ-8891 (Patient Jonathan Hall). Compatible major/minor serology.', severity: 'INFO' },
  { id: 'aud-02', timestamp: '2026-11-11 19:40:02', actor: 'Dr. Rebecca Shaw (MED-NY-55281)', event: 'Emergency Requisition Created', details: 'Order HMR-REQ-8891 submitted with urgency code EMERGENCY. Indication: Traumatic Hemorrhagic Shock.', severity: 'CRITICAL' },
  { id: 'aud-03', timestamp: '2026-11-11 18:22:45', actor: 'Sentinel Telemetry Prober', event: 'Cold-Chain Check Nominal', details: 'Cold Vault 01 & 02 logged at steady +3.6°C. Zero temperature variance outside 2°C - 6°C threshold.', severity: 'INFO' },
  { id: 'aud-04', timestamp: '2026-11-11 14:10:00', actor: 'Courier Lead Mark Olsen', event: 'Cold Shipper Dispatched', details: 'Unit HMR-2026-9015 handed off to Rapid Courier #4 for transit to City Memorial Cancer Hospital.', severity: 'INFO' },
  { id: 'aud-05', timestamp: '2026-11-10 11:15:30', actor: 'Serologist Dr. Anita Rao', event: 'NAT Pathogen Panel Cleared', details: 'Serology and Nucleic Acid Testing negative for bag HMR-2026-9011. Unit approved for clinical inventory release.', severity: 'INFO' },
];

export const AdminAuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Event', 'Severity', 'Details'];
    const rows = MOCK_AUDIT_TRAIL.map(l => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.event}"`,
      `"${l.severity}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `hemora_compliance_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = MOCK_AUDIT_TRAIL.filter(l => 
    l.event.toLowerCase().includes(search.toLowerCase()) ||
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>FDA 21 CFR Part 606 & ISO 15189 Immutable Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of accession, cross-matching, cold-chain handover, and clinical releases
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter audit actions, operators, bag barcodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {filtered.map(entry => (
          <div key={entry.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  entry.severity === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {entry.event}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {entry.actor}
                </span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{entry.timestamp}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {entry.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
