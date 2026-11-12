import {
  FirebaseUserProfile,
  RegisterDonorInput,
  RegisterHospitalInput,
  Donor,
  DonationAppointment,
  Donation,
  Notification,
  Hospital,
  Doctor,
  CreateDoctorInput,
  BloodRequest,
  CreateBloodRequestInput,
  EmergencyRequest,
  CreateEmergencyRequestInput,
  BloodReceipt,
  ConfirmReceiptInput,
  StaffDashboardData,
  DonorScreening,
  CreateScreeningInput,
  RecordDonationInput,
  BloodUnit,
  BloodUnitFilters,
  TestingResultInput,
  BloodDispatch,
  DispatchBloodInput,
  AppointmentSlotInput,
  AdminDashboardData,
  AccountStatus,
  BloodInventory,
  BloodGroup,
  AuditLog,
  AuditLogFilters,
  ReportFilters,
  ReportData,
  SystemSettings,
  ReservationResult
} from '../types/hemora';

export interface AuthService {
  login(email: string, password: string): Promise<FirebaseUserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): FirebaseUserProfile | null;
  resetPassword(email: string): Promise<void>;
  registerDonor(data: RegisterDonorInput): Promise<FirebaseUserProfile>;
  registerHospital(data: RegisterHospitalInput): Promise<FirebaseUserProfile>;
}

export interface DonorService {
  getProfile(donorId: string): Promise<Donor>;
  updateProfile(donorId: string, data: Partial<Donor>): Promise<void>;
  getAppointments(donorId: string): Promise<DonationAppointment[]>;
  bookAppointment(donorId: string, appointmentId: string): Promise<DonationAppointment>;
  cancelAppointment(donorId: string, appointmentId: string): Promise<void>;
  getDonationHistory(donorId: string): Promise<Donation[]>;
  getNotifications(uid: string): Promise<Notification[]>;
}

export interface HospitalService {
  getProfile(hospitalId: string): Promise<Hospital>;
  updateProfile(hospitalId: string, data: Partial<Hospital>): Promise<void>;
  getDoctors(hospitalId: string): Promise<Doctor[]>;
  createDoctor(hospitalId: string, data: CreateDoctorInput): Promise<Doctor>;
  updateDoctor(doctorId: string, data: Partial<Doctor>): Promise<void>;
  createBloodRequest(data: CreateBloodRequestInput): Promise<BloodRequest>;
  getRequests(hospitalId: string): Promise<BloodRequest[]>;
  createEmergencyRequest(data: CreateEmergencyRequestInput): Promise<EmergencyRequest>;
  confirmReceipt(data: ConfirmReceiptInput): Promise<BloodReceipt>;
}

export interface StaffService {
  getDashboard(): Promise<StaffDashboardData>;
  getDonors(): Promise<Donor[]>;
  createScreening(data: CreateScreeningInput): Promise<DonorScreening>;
  recordDonation(data: RecordDonationInput): Promise<Donation>;
  getBloodUnits(filters?: BloodUnitFilters): Promise<BloodUnit[]>;
  updateTestingResult(bloodUnitId: string, data: TestingResultInput): Promise<void>;
  getRequests(): Promise<BloodRequest[]>;
  approveRequest(requestId: string): Promise<void>;
  reserveBlood(requestId: string): Promise<void>;
  dispatchBlood(data: DispatchBloodInput): Promise<BloodDispatch>;
  manageAppointmentSlots(data: AppointmentSlotInput): Promise<void>;
}

export interface AdminService {
  getDashboard(): Promise<AdminDashboardData>;
  getUsers(): Promise<FirebaseUserProfile[]>;
  updateUserStatus(uid: string, status: AccountStatus): Promise<void>;
  approveHospital(hospitalId: string): Promise<void>;
  rejectHospital(hospitalId: string, reason: string): Promise<void>;
  getInventory(): Promise<BloodInventory[]>;
  updateInventoryThreshold(
    bloodGroup: BloodGroup,
    minimum: number,
    critical: number
  ): Promise<void>;
  getAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]>;
  getReports(filters: ReportFilters): Promise<ReportData>;
  getSystemSettings(): Promise<SystemSettings>;
}

export interface HemoraFunctions {
  approveHospital(input: { hospitalId: string }): Promise<void>;
  createBloodRequest(input: CreateBloodRequestInput): Promise<BloodRequest>;
  createEmergencyRequest(input: CreateEmergencyRequestInput): Promise<EmergencyRequest>;
  reserveBlood(input: { requestId: string }): Promise<ReservationResult>;
  issueBlood(input: { requestId: string; bloodUnitIds: string[] }): Promise<BloodDispatch>;
  confirmReceipt(input: ConfirmReceiptInput): Promise<BloodReceipt>;
  recordDonation(input: RecordDonationInput): Promise<Donation>;
  processExpiredUnits(): Promise<void>;
  escalateEmergency(input: { emergencyId: string }): Promise<void>;
}
