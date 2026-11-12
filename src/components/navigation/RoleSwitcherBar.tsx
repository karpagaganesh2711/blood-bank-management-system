import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/hemora';
import { Droplet, Building2, Stethoscope, ShieldCheck, Globe, Moon, Sun } from 'lucide-react';

interface RoleSwitcherBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ isDark, onToggleTheme }) => {
  const { role, switchRole, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublic = location.pathname.startsWith('/public') || location.pathname === '/';

  const handleRoleSelect = async (targetRole: UserRole) => {
    await switchRole(targetRole);
    navigate(`/${targetRole}`);
  };

  const handlePublicClick = () => {
    navigate('/');
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-rose-400 tracking-wide uppercase text-[10px] hidden sm:inline">
          HEMORA Demo Environment
        </span>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="text-slate-400 text-[11px]">
          Simulating Active Role: <strong className="text-white capitalize">{user?.name} ({role})</strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={handlePublicClick}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
            isPublic
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="View Public HEMORA Website"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </button>

        <span className="text-slate-700">|</span>

        <button
          onClick={() => handleRoleSelect('donor')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            !isPublic && role === 'donor'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Donor</span>
        </button>

        <button
          onClick={() => handleRoleSelect('hospital')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            !isPublic && role === 'hospital'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hospital</span>
        </button>

        <button
          onClick={() => handleRoleSelect('staff')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            !isPublic && role === 'staff'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Staff</span>
        </button>

        <button
          onClick={() => handleRoleSelect('admin')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
            !isPublic && role === 'admin'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 ml-1 transition-colors"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
