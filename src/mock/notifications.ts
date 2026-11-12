import { HemoraNotification } from '../types/hemora';

export const INITIAL_MOCK_NOTIFICATIONS: HemoraNotification[] = [
  {
    id: 'notif-01',
    targetRole: 'donor',
    userId: 'usr-donor-01',
    title: 'Urgent Need for O- Blood in Metro City',
    message: 'Local emergency trauma network is experiencing a 35% reserve dip in O- Negative units. Your eligibility is active!',
    timestamp: '15 mins ago',
    read: false,
    priority: 'critical',
  },
  {
    id: 'notif-02',
    targetRole: 'donor',
    userId: 'usr-donor-01',
    title: 'Upcoming Appointment Confirmed',
    message: 'Your apheresis slot at HEMORA Central Pavilion is scheduled for Nov 14 at 09:30 AM.',
    timestamp: '2 hours ago',
    read: true,
    priority: 'normal',
  },
  {
    id: 'notif-03',
    targetRole: 'hospital',
    userId: 'usr-hosp-01',
    title: 'Blood Units Cross-Matched for Req HMR-REQ-8891',
    message: 'Major & minor serology testing cleared for Patient Jonathan Hall. Unit HMR-2026-9012 is staged for transport.',
    timestamp: '25 mins ago',
    read: false,
    priority: 'alert',
  },
  {
    id: 'notif-04',
    targetRole: 'staff',
    title: 'New Emergency Requisition Logged',
    message: 'St. Jude Trauma ICU submitted emergency requisition for 2 units O- PRBC. Immediate triage requested.',
    timestamp: '40 mins ago',
    read: false,
    priority: 'critical',
  },
  {
    id: 'notif-05',
    targetRole: 'admin',
    title: 'Cold-Chain Sentinel Weekly Audit Report',
    message: 'All 6 central cold vaults maintained ISO compliant +3.5°C to +4.2°C temperature variance over the last 168 hours.',
    timestamp: '1 day ago',
    read: true,
    priority: 'normal',
  }
];
