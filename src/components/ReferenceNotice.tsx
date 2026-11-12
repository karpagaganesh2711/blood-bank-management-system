import React, { useState } from 'react';
import { Info, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const ReferenceNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-rose-50 via-slate-50 to-indigo-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-indigo-950/30 border-b border-rose-200/70 dark:border-rose-900/40 px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1 rounded-md bg-rose-600 text-white shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">Foundation Ready:</span>{' '}
            Complete Blood Bank & Transfusion platform loaded with Cold-Chain Inventory, Donor Health Screening, Hospital Requisitions & Cross-Match Matrix.{' '}
            <span className="text-rose-700 dark:text-rose-300 font-medium">
              Share your custom design references, workflow rules, or required screens in the next message and we will tailor everything immediately!
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Demo Ready</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
