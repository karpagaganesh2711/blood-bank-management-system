import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HemoraNotification } from '../../types/hemora';
import { mockNotificationService } from '../../services/mockServices';
import { Bell, Check, ShieldAlert, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DonorNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<HemoraNotification[]>([]);

  const loadNotifications = async () => {
    const list = await mockNotificationService.getNotifications();
    setNotifications(list.filter(n => n.targetRole === 'donor' || !n.targetRole));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await mockNotificationService.markAsRead(id);
    loadNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-600" />
            <span>Donor Notifications & Priority Broadcasts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time shortage alerts, appointment confirmations, and blood usage notifications
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((n) => {
            const isCritical = n.priority === 'critical';
            return (
              <div
                key={n.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !n.read 
                    ? 'bg-rose-50/40 dark:bg-rose-950/20' 
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isCritical
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isCritical ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {n.timestamp}
                    </div>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium self-end sm:self-auto shrink-0 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark as Read</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
