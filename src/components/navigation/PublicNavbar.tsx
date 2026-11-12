import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, ArrowRight } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              HEMORA
            </span>
          </Link>

          {/* Zone 2: 4-5 concise single-line links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap shrink-0">
              How HEMORA Works
            </a>
            <a href="#donors" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap shrink-0">
              For Donors
            </a>
            <a href="#hospitals" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap shrink-0">
              For Hospitals
            </a>
            <a href="#emergency" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap shrink-0">
              Emergency Network
            </a>
            <a href="#statistics" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap shrink-0">
              Live Impact
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/auth/login')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <span>Sign In / Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
