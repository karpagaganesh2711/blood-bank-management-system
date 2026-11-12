import { DonorUser, HospitalUser, StaffUser, AdminUser, AuthUser } from '../types/hemora';

export const MOCK_DONOR_USER: DonorUser = {
  id: 'usr-donor-01',
  email: 'alex.rivers@donor.hemora.org',
  role: 'donor',
  name: 'Alex Rivers',
  bloodGroup: 'O-',
  phone: '+1 (555) 729-3312',
  city: 'Metro City',
  address: '742 Evergreen Blvd, Apt 4B',
  age: 31,
  gender: 'Male',
  lastDonationDate: '2026-09-12',
  cooldownDaysRemaining: 0,
  totalDonationsCount: 14,
  livesImpacted: 42,
  createdAt: '2024-03-15',
  vitals: {
    hemoglobin: 15.2,
    weightKg: 74,
    bloodPressure: '118/76',
    pulseBpm: 66,
  },
};

export const MOCK_HOSPITAL_USER: HospitalUser = {
  id: 'usr-hosp-01',
  email: 'admissions@stjude.hemora.med',
  role: 'hospital',
  name: 'Dr. Rebecca Shaw (Trauma Director)',
  hospitalName: 'St. Jude Metropolitan Trauma Center',
  licenseNumber: 'HOSP-NY-90412-T1',
  emergencyContact: '+1 (555) 911-4040',
  address: '800 Hospital Parkway, Building A',
  city: 'Metro City',
  bedCapacity: 650,
  activeDoctorsCount: 42,
  bloodBankCode: 'HEMORA-TX-882',
  createdAt: '2023-08-10',
};

export const MOCK_STAFF_USER: StaffUser = {
  id: 'usr-staff-01',
  email: 'sarah.connor@staff.hemora.org',
  role: 'staff',
  name: 'Sarah Connor, RN',
  staffId: 'STF-8821',
  department: 'Phlebotomy',
  shift: 'Morning',
  licenseId: 'RN-99214-CC',
  createdAt: '2024-01-20',
};

export const MOCK_ADMIN_USER: AdminUser = {
  id: 'usr-admin-01',
  email: 'director@hemora.org',
  role: 'admin',
  name: 'Dr. Arthur Sterling',
  superAdmin: true,
  clearanceLevel: 'System Director',
  createdAt: '2022-11-01',
};

export const ALL_DEMO_ACCOUNTS: Record<string, AuthUser> = {
  donor: MOCK_DONOR_USER,
  hospital: MOCK_HOSPITAL_USER,
  staff: MOCK_STAFF_USER,
  admin: MOCK_ADMIN_USER,
};
