import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/hemora';
import { 
  Droplet, 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [email, setEmail] = useState('alex.rivers@donor.hemora.org');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleConfigs: { role: UserRole; title: string; defaultEmail: string; icon: any; color: string }[] = [
    {
      role: 'donor',
      title: 'Blood Donor',
      defaultEmail: 'alex.rivers@donor.hemora.org',
      icon: Droplet,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50',
    },
    {
      role: 'hospital',
      title: 'Hospital ICU / Surgeon',
      defaultEmail: 'admissions@stjude.hemora.med',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      role: 'staff',
      title: 'Clinical Lab Staff',
      defaultEmail: 'sarah.connor@staff.hemora.org',
      icon: Stethoscope,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50',
    },
    {
      role: 'admin',
      title: 'System Director / Admin',
      defaultEmail: 'director@hemora.org',
      icon: ShieldCheck,
      color: 'text-slate-800 bg-slate-100 dark:text-slate-200 dark:bg-slate-800',
    },
  ];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const cfg = roleConfigs.find(r => r.role === role);
    if (cfg) {
      setEmail(cfg.defaultEmail);
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      await login(selectedRole, email, password);
      setSuccessMessage(`Authenticated as ${selectedRole.toUpperCase()}. Redirecting to dashboard...`);
      setTimeout(() => {
        navigate(`/${selectedRole}`);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    }
  };

  // 1-Click Instant Demo Login
  const handleInstantDemoLogin = async (role: UserRole) => {
    setSelectedRole(role);
    const cfg = roleConfigs.find(r => r.role === role);
    if (cfg) setEmail(cfg.defaultEmail);
    await login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <Droplet className="w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              HEMORA
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sign In to Your Workspace
          </h2>
          <p className="text-xs text-slate-500">
            Select your clinical, donor, or administrative role below
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {roleConfigs.map((cfg) => {
            const Icon = cfg.icon;
            const isSelected = selectedRole === cfg.role;
            return (
              <button
                key={cfg.role}
                type="button"
                onClick={() => handleRoleChange(cfg.role)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`p-2 rounded-lg ${cfg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] capitalize">{cfg.role}</span>
              </button>
            );
          })}
        </div>

        {/* 1-Click Instant Demo Quick Launch Box */}
        <div className="p-3 bg-gradient-to-r from-rose-50 to-indigo-50 dark:from-rose-950/30 dark:to-indigo-950/30 border border-rose-200/80 dark:border-rose-900/60 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Instant Demo Access (1-Click)</span>
            </span>
            <span className="text-[10px] text-slate-500">Mock Auth</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('donor')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium text-[11px]"
            >
              Demo as Donor
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('hospital')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium text-[11px]"
            >
              Demo as Hospital
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('staff')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium text-[11px]"
            >
              Demo as Staff
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('admin')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium text-[11px]"
            >
              Demo as Admin
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link to="/auth/forgot-password" className="text-rose-600 dark:text-rose-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-rose-600 dark:text-rose-400 font-semibold hover:underline">
              Register as Donor
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
