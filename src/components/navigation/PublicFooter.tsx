import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Shield, Award } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-rose-600 text-white flex items-center justify-center">
                <Droplet className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">HEMORA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Decentralized, intelligent blood supply and transfusion management ecosystem. Connecting voluntary donors, transfusion facilities, and regional trauma centers in real time.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 15189 & FDA 21 CFR Part 606 Architecture</span>
            </div>
          </div>

          {/* Nav links: Donors */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">For Donors</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/auth/login" className="hover:text-white transition-colors">Book an Appointment</Link></li>
              <li><a href="#donors" className="hover:text-white transition-colors">Eligibility Guidelines</a></li>
              <li><Link to="/auth/register" className="hover:text-white transition-colors">Join Donor Registry</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Digital Donor Pass</a></li>
            </ul>
          </div>

          {/* Nav links: Hospitals & Medical */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">For Healthcare</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/auth/login" className="hover:text-white transition-colors">Hospital Portal Access</Link></li>
              <li><a href="#emergency" className="hover:text-white transition-colors">Emergency Blood Triage</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Cold-Chain Protocol</a></li>
              <li><a href="#statistics" className="hover:text-white transition-colors">Reserve Availability Map</a></li>
            </ul>
          </div>

          {/* Quick Access to Roles */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Demo Portals</h4>
            <div className="flex flex-col gap-1.5">
              <Link to="/donor" className="text-rose-400 hover:text-rose-300 font-medium">→ Donor Portal</Link>
              <Link to="/hospital" className="text-rose-400 hover:text-rose-300 font-medium">→ Hospital Portal</Link>
              <Link to="/staff" className="text-rose-400 hover:text-rose-300 font-medium">→ Staff Portal</Link>
              <Link to="/admin" className="text-rose-400 hover:text-rose-300 font-medium">→ Admin Portal</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} HEMORA Transfusion Systems. Frontend architecture prepared for Firebase integration.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Standard</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 cursor-pointer">HIPAA & GDPR Compliant Spec</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 cursor-pointer">Cold Chain Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
