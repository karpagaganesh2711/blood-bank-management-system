import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAuthService } from '../../services/mockServices';
import { Droplet, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await mockAuthService.resetPassword(email);
    setMsg(res.message);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
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
            Reset Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your email to receive simulated recovery credentials
          </p>
        </div>

        {submitted ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Link Dispatched</h3>
            <p className="text-slate-600 dark:text-slate-400">{msg}</p>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold hover:underline pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="user@hemora.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/auth/login" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
