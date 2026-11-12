import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HospitalUser } from '../types/hemora';
import { 
  Building2, 
  LayoutDashboard, 
  FilePlus2, 
  Clock, 
  Stethoscope, 
  CheckCircle2, 
  UserCheck, 
  LogOut, 
  Menu, 
  X,
  AlertTriangle,
  PackageCheck
} from 'lucide-react';

export const HospitalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hospital = user as HospitalUser;

  const navItems = [
    { label: 'Hospital Dashboard', path: '/hospital', icon: LayoutDashboard },
    { label: 'Order Blood Requisition', path: '/hospital/request', icon: FilePlus2 },
    { label: 'Live Order Tracking', path: '/hospital/tracking', icon: Clock },
    { label: 'Authorized Doctors', path: '/hospital/doctors', icon: Stethoscope },
    { label: 'Received Transfusions', path: '/hospital/received', icon: PackageCheck },
    { label: 'Facility Profile', path: '/hospital/profile', icon: Building2 },
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
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">HEMORA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-900">
              Hospital Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/hospital/request')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Emergency Blood Order</span>
            <span className="sm:hidden">Order</span>
          </button>

          <div className="hidden sm:block text-right text-xs">
            <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
              {hospital?.hospitalName || 'St. Jude Trauma Center'}
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              License: {hospital?.licenseNumber || 'HOSP-NY-90412'}
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
              Hospital Operations
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
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Priority Hotline:
            </div>
            <div className="font-mono text-rose-600 dark:text-rose-400 font-bold">
              +1 (555) 911-HEMO
            </div>
            <p className="text-[10px] text-slate-500">
              24/7 Transfusion Medicine Consult & Emergency Dispatch.
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
