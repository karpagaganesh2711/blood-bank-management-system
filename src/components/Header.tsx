import React from 'react';
import { Droplet, AlertTriangle, Moon, Sun, RotateCcw } from 'lucide-react';

export type TabKey = 'overview' | 'inventory' | 'donors' | 'requisitions' | 'compatibility' | 'camps' | 'audit';

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSOS: () => void;
  onReset: () => void;
  criticalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onOpenSOS,
  onReset,
  criticalCount,
}) => {
  const navItems: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Dashboard' },
    { key: 'inventory', label: 'Blood Inventory' },
    { key: 'donors', label: 'Donors & Phlebotomy' },
    { key: 'requisitions', label: 'Hospital Requisitions' },
    { key: 'compatibility', label: 'Cross-Match Matrix' },
    { key: 'camps', label: 'Blood Drives' },
    { key: 'audit', label: 'Audit Trail' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <a 
              href="#overview" 
              onClick={(e) => { e.preventDefault(); onTabChange('overview'); }}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
            >
              HemaFlow <span className="font-normal text-rose-600 dark:text-rose-400">Blood Bank</span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line tabs) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (SOS Button + Theme Switcher + Reset) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSOS}
              title="Issue Emergency Blood Shortage Alert"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-white transition-all whitespace-nowrap ${
                criticalCount > 0 
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-sm animate-pulse' 
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Emergency SOS</span>
              {criticalCount > 0 && (
                <span className="ml-1 bg-white/20 px-1.5 py-0.2 rounded text-[11px] font-mono tabular-nums">
                  {criticalCount} Low
                </span>
              )}
            </button>

            <button
              onClick={onReset}
              title="Reset Sample Data"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 font-medium ${
                activeTab === item.key
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
