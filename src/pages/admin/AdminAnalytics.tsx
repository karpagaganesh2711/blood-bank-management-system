import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

const MONTHLY_DATA = [
  { month: 'Jun', collected: 1240, transfused: 1220, discarded: 3 },
  { month: 'Jul', collected: 1310, transfused: 1290, discarded: 2 },
  { month: 'Aug', collected: 1450, transfused: 1430, discarded: 4 },
  { month: 'Sep', collected: 1520, transfused: 1500, discarded: 2 },
  { month: 'Oct', collected: 1680, transfused: 1665, discarded: 1 },
  { month: 'Nov', collected: 1810, transfused: 1795, discarded: 2 },
];

const COMPONENT_SPLIT = [
  { name: 'PRBC (Red Cells)', value: 58, color: '#e11d48' },
  { name: 'Platelets', value: 20, color: '#f59e0b' },
  { name: 'Plasma (FFP)', value: 16, color: '#4f46e5' },
  { name: 'Cryoprecipitate', value: 6, color: '#0d9488' },
];

const VELOCITY_TREND = [
  { week: 'Wk 1', minutes: 24.2 },
  { week: 'Wk 2', minutes: 22.0 },
  { week: 'Wk 3', minutes: 20.4 },
  { week: 'Wk 4', minutes: 19.1 },
  { week: 'Wk 5', minutes: 18.4 },
];

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>Transfusion Medicine Analytics & Intelligence</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Data models monitoring cold-chain efficiency, supply turnaround latency, and expiration mitigation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Volume */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Monthly Units Collected vs Transfused
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Past 6 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="collected" fill="#e11d48" radius={[4, 4, 0, 0]} name="Units Banked" />
                <Bar dataKey="transfused" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Bedside Transfused" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Component Pie Split */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Component Fractionation Share
          </h2>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COMPONENT_SPLIT} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}>
                  {COMPONENT_SPLIT.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {COMPONENT_SPLIT.map(entry => (
              <div key={entry.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dispatch Response Velocity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Trauma Dispatch Velocity Reduction Curve
            </h2>
            <p className="text-xs text-slate-500">Average minutes elapsed from hospital requisition submission to cold-box departure</p>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            -24% Latency in 5 Weeks
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={VELOCITY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="week" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} domain={[15, 30]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderColor: '#334155', 
                  borderRadius: '8px', 
                  color: '#fff',
                  fontSize: '12px' 
                }} 
              />
              <Line type="monotone" dataKey="minutes" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Minutes to Dispatch" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
