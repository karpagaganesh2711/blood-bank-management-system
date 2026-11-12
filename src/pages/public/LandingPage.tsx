import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Droplet, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Heart, 
  Building2, 
  Truck, 
  Activity, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Thermometer,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Cinematic Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Next-Gen Transfusion Logistics & Donor Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Every drop accounted for.{' '}
                <span className="text-rose-600 dark:text-rose-500">Every second saved.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                HEMORA bridges voluntary donors, intelligent cold-chain blood banks, and trauma centers with real-time cross-matching, cold-chain temperature telemetry, and sub-minute emergency requisitions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/auth/login')}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Enter HEMORA Portals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all"
                >
                  Explore How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                    18.4 min
                  </div>
                  <div className="text-slate-500 text-[11px]">Avg Dispatch Velocity</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                    100%
                  </div>
                  <div className="text-slate-500 text-[11px]">Cold Chain Verified</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                    42,800+
                  </div>
                  <div className="text-slate-500 text-[11px]">Active Donors Enrolled</div>
                </div>
              </div>
            </div>

            {/* Right Visual Card (Interactive Demo Preview) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      LIVE TRANSFUSION DISPATCH SENTINEL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    SYS NOMINAL
                  </span>
                </div>

                {/* Simulated live requisition card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      EMERGENCY CODE RED REQUISITION
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">REQ-8891</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    St. Jude Metropolitan Trauma Center
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Patient: Jonathan Hall (48y)</span>
                    <span className="font-mono font-bold text-rose-600">Blood Group: O-</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Cross-Match Status: <strong className="text-emerald-600">Cleared</strong></span>
                    <span>Carrier Temp: <strong className="text-emerald-600 font-mono">+3.8°C</strong></span>
                  </div>
                </div>

                {/* Four Quick Role Navigators */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Jump into Role Experience:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => navigate('/donor')}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-left hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all"
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-rose-600" />
                        <span>Donor Portal</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Bookings & history</div>
                    </button>

                    <button
                      onClick={() => navigate('/hospital')}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all"
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Hospital Portal</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Request & track blood</div>
                    </button>

                    <button
                      onClick={() => navigate('/staff')}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-left hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-all"
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-teal-600" />
                        <span>Staff Console</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Phlebotomy & triage</div>
                    </button>

                    <button
                      onClick={() => navigate('/admin')}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-900 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                        <span>Admin Console</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Network governance</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How HEMORA Works (Scrollytelling Flow) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Intelligent Life-Saving Pipeline
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            How HEMORA Works in Practice
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A continuous digital supply chain eliminating bureaucratic friction between donor phlebotomy and bedside transfusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Donor Engagement & Screening
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Voluntary donors book appointments at fixed centers or mobile vans. Automated health pre-screening tracks hemoglobin and cooldown periods.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Component Separation & Testing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Collected units are fractionated into PRBC, Platelets, and FFP. Nucleic Acid Testing (NAT) and serology are logged before unit release.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Instant Hospital Requisition
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Emergency room surgeons submit requests with clinical indications. HEMORA matches ABO/Rh antigens instantly with zero wait time.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-lg">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cold-Chain Monitored Transit
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Units travel in validated active-cool carriers. Arrival temperatures are confirmed before barcode scan and bedside infusion.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Donor Section */}
      <section id="donors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-rose-900 to-rose-950 text-white space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-300">
              For Voluntary Blood Donors
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              One donation can save up to three lives.
            </h2>
            <p className="text-sm text-rose-100 leading-relaxed">
              Track your donation cadence, access your digital donor card, review your point-of-care vital statistics, and receive emergency shortage notifications when your exact blood group is needed in nearby ICUs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-rose-800/80 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-white">Digital Donor ID</span>
                <span className="text-rose-200 text-[11px]">Instant barcode check-in at any regional donation drive</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-white">Vital Signs History</span>
                <span className="text-rose-200 text-[11px]">Hemoglobin, BP, and donation interval health ledger</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-white">Emergency Shortage Alerts</span>
                <span className="text-rose-200 text-[11px]">Opt-in SMS summons when rare blood types run low</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/donor')}
              className="px-5 py-2.5 bg-white text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Open Donor Portal Experience →
            </button>
          </div>
        </div>
      </section>

      {/* 4. Hospital & Emergency Section */}
      <section id="hospitals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              For Healthcare Providers & Hospitals
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Rapid Requisition & Real-Time Cold Storage Visibility
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Eliminate urgent phone chains during trauma emergencies. Authorized physicians can issue cross-match requisitions in seconds with transparent batch traceability and courier dispatch milestones.
            </p>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Automated major & minor serology compatibility verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Priority courier dispatch with continuous temperature telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Doctor authorization controls and surgery standby allocations</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => navigate('/hospital')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Access Hospital Portal →
              </button>
            </div>
          </div>

          <div id="emergency" className="lg:col-span-6 p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">
                HEMORA SOS Emergency Network
              </span>
            </div>

            <h3 className="text-2xl font-bold tracking-tight">
              Trauma Center Code Red Protocol
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              When catastrophic mass casualties occur or critical reserve thresholds are breached, the HEMORA Emergency Network triggers synchronized SMS alerts across verified universal O- donors and activates cold-box courier transfers.
            </p>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Emergency Broadcast Radius:</span>
                <span className="font-mono text-white">45 km Metro Area</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Average Emergency Allocation:</span>
                <span className="font-mono text-rose-400 font-bold">&lt; 4.2 minutes</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Universal Donor Standby Units:</span>
                <span className="font-mono text-emerald-400 font-bold">Guaranteed 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statistics & Live Impact */}
      <section id="statistics" className="bg-slate-100 dark:bg-slate-900 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Proven Network Scale
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Real-time operational figures powering safe blood banking across metropolitan healthcare clusters.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-600 dark:text-rose-500">
                142,500+
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                Units Processed & Transfused
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Zero cold-chain temperature violations
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                48
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                Partner Hospitals & ICUs
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Connected via live requisition API
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                99.8%
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                Emergency Fulfillment Rate
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Sub-hour delivery compliance
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                0.01%
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                Wastage & Expiry Rate
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Industry benchmark average is 4.8%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900 text-white text-center space-y-6 border border-slate-800">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to experience the future of transfusion medicine?
            </h2>
            <p className="text-sm text-slate-400">
              Try the interactive donor booking, hospital emergency requisition triage, and cold-chain lab workflows right now.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Register as New Donor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
