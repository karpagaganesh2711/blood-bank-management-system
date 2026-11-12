import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DonorUser } from '../types/hemora';
import { 
  Droplet, 
  LayoutDashboard, 
  Calendar, 
  History, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Heart,
  QrCode
} from 'lucide-react';

export const DonorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const donor = user as DonorUser;

  const navItems = [
    { label: 'Overview', path: '/donor', icon: LayoutDashboard },
    { label: 'Book Appointment', path: '/donor/appointments', icon: Calendar },
    { label: 'Donation History', path: '/donor/history', icon: History },
    { label: 'Donor Profile & Vitals', path: '/donor/profile', icon: User },
    { label: 'Notifications', path: '/donor/notifications', icon: Bell },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">HEMORA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900">
              Donor Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Blood Group Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white font-mono font-bold text-xs shadow-sm">
            <span>Blood Group:</span>
            <span>{donor?.bloodGroup || 'O-'}</span>
          </div>

          <Link
            to="/donor/notifications"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          </Link>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{donor?.name}</span>
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
        {/* Sidebar */}
        <aside className={`fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Donor Navigation
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
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Donor Quick Card */}
          <div className="p-3 bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-xl shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-200">Donor Badge</span>
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="font-bold text-sm">{donor?.totalDonationsCount || 14} Donations Logged</div>
            <p className="text-[11px] text-rose-100">
              Estimated {donor?.livesImpacted || 42} patient lives touched through your red cell & plasma contributions.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
