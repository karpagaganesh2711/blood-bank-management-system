/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleSwitcherBar } from './components/navigation/RoleSwitcherBar';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DonorLayout } from './layouts/DonorLayout';
import { HospitalLayout } from './layouts/HospitalLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Donor Pages
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { DonorAppointments } from './pages/donor/DonorAppointments';
import { DonorHistory } from './pages/donor/DonorHistory';
import { DonorProfile } from './pages/donor/DonorProfile';
import { DonorNotifications } from './pages/donor/DonorNotifications';

// Hospital Pages
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { HospitalRequestForm } from './pages/hospital/HospitalRequestForm';
import { HospitalTracking } from './pages/hospital/HospitalTracking';
import { HospitalDoctors } from './pages/hospital/HospitalDoctors';
import { HospitalReceived } from './pages/hospital/HospitalReceived';
import { HospitalProfile } from './pages/hospital/HospitalProfile';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffAppointments } from './pages/staff/StaffAppointments';
import { StaffScreening } from './pages/staff/StaffScreening';
import { StaffDonations } from './pages/staff/StaffDonations';
import { StaffInventory } from './pages/staff/StaffInventory';
import { StaffRequests } from './pages/staff/StaffRequests';
import { StaffDispatch } from './pages/staff/StaffDispatch';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hemora_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hemora_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hemora_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
          {/* Universal Role Switcher & Environment Bar */}
          <RoleSwitcherBar isDark={isDark} onToggleTheme={toggleTheme} />

          <Routes>
            {/* Public Marketing & Scrollytelling Website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Auth Experience */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

            {/* Role 1: Donor Portal */}
            <Route path="/donor" element={<DonorLayout />}>
              <Route index element={<DonorDashboard />} />
              <Route path="appointments" element={<DonorAppointments />} />
              <Route path="history" element={<DonorHistory />} />
              <Route path="profile" element={<DonorProfile />} />
              <Route path="notifications" element={<DonorNotifications />} />
            </Route>

            {/* Role 2: Hospital Portal */}
            <Route path="/hospital" element={<HospitalLayout />}>
              <Route index element={<HospitalDashboard />} />
              <Route path="request" element={<HospitalRequestForm />} />
              <Route path="tracking" element={<HospitalTracking />} />
              <Route path="doctors" element={<HospitalDoctors />} />
              <Route path="received" element={<HospitalReceived />} />
              <Route path="profile" element={<HospitalProfile />} />
            </Route>

            {/* Role 3: Staff Clinical & Lab Workstation */}
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<StaffDashboard />} />
              <Route path="appointments" element={<StaffAppointments />} />
              <Route path="screening" element={<StaffScreening />} />
              <Route path="donations" element={<StaffDonations />} />
              <Route path="inventory" element={<StaffInventory />} />
              <Route path="requests" element={<StaffRequests />} />
              <Route path="dispatch" element={<StaffDispatch />} />
            </Route>

            {/* Role 4: Admin Executive & Governance Console */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="audit" element={<AdminAuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
