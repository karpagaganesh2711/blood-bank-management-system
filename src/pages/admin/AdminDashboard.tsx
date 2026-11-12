import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BloodUnitItem, BloodRequest } from '../../types/hemora';
import { mockInventoryService, mockRequisitionService } from '../../services/mockServices';
import { 
  ShieldCheck, 
  Droplet, 
  Building2, 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [units, setUnits] = useState<BloodUnitItem[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    mockInventoryService.getInventory().then(setUnits);
    mockRequisitionService.getRequests().then(setRequests);
  }, []);

  // Compute stock by blood group
  const groupCounts: Record<string, number> = {
    'O-': 0, 'O+': 0, 'A-': 0, 'A+': 0, 'B-': 0, 'B+': 0, 'AB-': 0, 'AB+': 0
  };
  units.forEach(u => {
    if (u.status === 'AVAILABLE') {
      groupCounts[u.bloodGroup] = (groupCounts[u.bloodGroup] || 0) + 1;
    }
  });

  const barChartData = Object.entries(groupCounts).map(([group, count]) => ({
    group,
    count,
  }));

  const weeklyTrendData = [
    { day: 'Mon', collected: 28, transfused: 24 },
    { day: 'Tue', collected: 34, transfused: 31 },
    { day: 'Wed', collected: 42, transfused: 38 },
    { day: 'Thu', collected: 39, transfused: 35 },
    { day: 'Fri', collected: 51, transfused: 48 },
    { day: 'Sat', collected: 62, transfused: 54 },
    { day: 'Sun', collected: 45, transfused: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
              Executive Network Governance
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-mono">Central Command Node 01</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Regional Transfusion Ecosystem Overview
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Live telemetry monitoring supply sustainability, emergency fulfillment velocity, and hospital demand curves.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            System Status: 100% Operational
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Units in Vaults</span>
            <Droplet className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {units.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Across 6 metropolitan cold chambers
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Partner Hospitals</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            48 Facilities
          </div>
          <div className="text-[11px] text-slate-500">
            Directly connected via API
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Donors</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            42,800+
          </div>
          <div className="text-[11px] text-slate-500">
            +380 enrolled this week
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Fulfillment Speed</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            18.4 min
          </div>
          <div className="text-[11px] text-slate-500">
            Average request-to-dispatch
          </div>
        </div>
      </div>

      {/* Recharts Analytics Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Blood Group Inventory Distribution */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Live Stock by Blood Group (ABO & Rh)
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Available Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="group" stroke="#888888" fontSize={11} tickLine={false} />
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
                <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Weekly Transfusion vs Collection Trend */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Flow: Collections vs Bedside Transfusions
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Collected
              </span>
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Transfused
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
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
                <Line type="monotone" dataKey="collected" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="transfused" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
