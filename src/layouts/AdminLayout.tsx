import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminUser } from '../types/hemora';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Boxes, 
  Activity, 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  AlertOctagon
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const admin = user as AdminUser;

  const navItems = [
    { label: 'Executive Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'User & Facility Registry', path: '/admin/users', icon: Users },
    { label: 'Central Reserve Vaults', path: '/admin/inventory', icon: Boxes },
    { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Audit & Compliance Logs', path: '/admin/audit', icon: FileSpreadsheet },
    { label: 'System Policy & Settings', path: '/admin/settings', icon: Settings },
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
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">HEMORA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
              Admin & Network Command
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="font-semibold text-slate-900 dark:text-white">
              {admin?.name || 'Dr. Arthur Sterling'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Role: {admin?.clearanceLevel || 'System Director'}
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
        <aside className={`fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Governance & Analytics
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
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full System Authority</span>
            </div>
            <p className="text-[10px]">
              Ready for production Firebase security rules & RBAC deployment.
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
