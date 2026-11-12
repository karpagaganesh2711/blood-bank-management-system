import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StaffUser } from '../types/hemora';
import { 
  Stethoscope, 
  LayoutDashboard, 
  CalendarCheck, 
  HeartPulse, 
  Droplet, 
  Boxes, 
  GitPullRequest, 
  Truck, 
  LogOut, 
  Menu, 
  X,
  Thermometer
} from 'lucide-react';

export const StaffLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const staff = user as StaffUser;

  const navItems = [
    { label: 'Staff Console', path: '/staff', icon: LayoutDashboard },
    { label: 'Appointments Check-In', path: '/staff/appointments', icon: CalendarCheck },
    { label: 'Donor Medical Screening', path: '/staff/screening', icon: HeartPulse },
    { label: 'Phlebotomy & Collection', path: '/staff/donations', icon: Droplet },
    { label: 'Cold Storage Vaults', path: '/staff/inventory', icon: Boxes },
    { label: 'Requisition Triage', path: '/staff/requests', icon: GitPullRequest },
    { label: 'Cold-Chain Dispatch', path: '/staff/dispatch', icon: Truck },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">HEMORA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-900">
              Staff Clinical Workstation
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
            <Thermometer className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Vault Alpha:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+3.6°C</span>
          </div>

          <div className="text-right text-xs">
            <div className="font-semibold text-slate-900 dark:text-white">
              {staff?.name || 'Sarah Connor, RN'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Dept: {staff?.department || 'Phlebotomy'}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className={`fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clinical & Lab Workflow
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-900 text-xs space-y-1 text-teal-900 dark:text-teal-200">
            <div className="font-semibold">Shift: {staff?.shift || 'Morning'}</div>
            <p className="text-[10px] text-teal-700 dark:text-teal-400">
              Logged into CLIA compliant biological accession terminal.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
