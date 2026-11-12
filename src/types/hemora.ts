/**
 * HEMORA Types & Data Models
 * Aligned with Firebase Firestore Schema & Strict Typed Service Contracts
 */

export type UserRole = 'DONOR' | 'HOSPITAL' | 'STAFF' | 'ADMIN' | 'donor' | 'hospital' | 'staff' | 'admin';

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED';

export interface FirebaseUserProfile {
  uid: string;
  role: 'DONOR' | 'HOSPITAL' | 'STAFF' | 'ADMIN';
  fullName: string;
  mobileNumber?: string;
  email?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  accountStatus: AccountStatus;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type BloodComponent =
  | 'Whole Blood'
  | 'Packed Red Blood Cells (PRBC)'
  | 'Platelet Apheresis'
  | 'Fresh Frozen Plasma (FFP)'
  | 'Cryoprecipitate';

export interface Donor {
  donorId: string;
  uid: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  mobileNumber: string;
  email?: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    mobileNumber: string;
  };
  lastDonationDate?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REQUIRES_REVIEW';
  createdAt: string;
  updatedAt: string;
}

export type HospitalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type HospitalType =
  | 'GOVERNMENT'
  | 'PRIVATE'
  | 'CLINIC'
  | 'MEDICAL_COLLEGE'
  | 'TEACHING_HOSPITAL';

export interface Hospital {
  hospitalId: string;
  uid: string;
  hospitalName: string;
  registrationNumber: string;
  licenseNumber?: string;
  hospitalType: HospitalType;
  address: string;
  city: string;
  contactNumber: string;
  officialEmail: string;
  contactPerson: string;
  hospitalAdministratorName: string;
  status: HospitalStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  doctorId?: string;
  hospitalId: string;
  name?: string;
  specialization?: string;
  registrationNumber?: string;
  contactNumber?: string;
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
  // UI aliases
  id: string;
  fullName: string;
  specialty: string;
  medicalLicense: string;
  phone: string;
  authorizedForEmergencyOrder?: boolean;
  activeOrdersCount?: number;
}

export type DoctorStaffItem = Doctor;

export type AppointmentStatus =
  | 'AVAILABLE'
  | 'BOOKED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'SCHEDULED';

export interface DonationAppointment {
  appointmentId?: string;
  donorId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  bookedCount?: number;
  status: AppointmentStatus;
  bookedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
  // UI fields
  id: string;
  appointmentCode: string;
  donorName?: string;
  donorBloodGroup?: BloodGroup;
  centerName?: string;
  centerAddress?: string;
  timeSlot?: string;
  componentTarget?: BloodComponent;
  notes?: string;
}

export type BloodRequestPriority = 'NORMAL' | 'URGENT' | 'EMERGENCY';
export type RequestUrgency = 'EMERGENCY' | 'URGENT' | 'ROUTINE';

export type BloodRequestStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'RESERVED'
  | 'ISSUED'
  | 'DISPATCHED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'PARTIALLY_FULFILLED'
  | 'SUBMITTED'
  | 'TRIAGED'
  | 'CROSS_MATCHED'
  | 'FULFILLED';

export interface BloodRequest {
  requestId?: string;
  patientId?: string;
  caseId?: string;
  unitsRequired?: number;
  priority?: BloodRequestPriority;
  doctorId?: string;
  approvedBy?: string;
  approvedAt?: string;
  reservedAt?: string;
  issuedAt?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;

  // UI fields
  id: string;
  requestCode: string;
  hospitalId: string;
  hospitalName?: string;
  patientName: string;
  patientAge?: number;
  bloodGroup: BloodGroup;
  component?: BloodComponent;
  unitsRequested: number;
  unitsAllocated?: number;
  urgency: RequestUrgency;
  status: BloodRequestStatus;
  requestedAt: string;
  doctorName?: string;
  clinicalDiagnosis: string;
  allocatedBagIds?: string[];
  temperatureLoggedAtDispatch?: string;
}

export type BloodUnitStatus =
  | 'COLLECTED'
  | 'UNDER_TESTING'
  | 'AVAILABLE'
  | 'RESERVED'
  | 'ISSUED'
  | 'DISPATCHED'
  | 'RECEIVED'
  | 'EXPIRED'
  | 'DISCARDED'
  | 'REJECTED'
  | 'QUARANTINED';

export interface BloodUnit {
  bloodUnitId?: string;
  donationId?: string;
  donorId: string;
  bloodGroup: BloodGroup;
  collectionDate: string;
  expiryDate: string;
  status: BloodUnitStatus;
  barcodeValue?: string;
  qrCodeValue?: string;
  testingStatus?: 'PENDING' | 'PASSED' | 'FAILED';
  testedBy?: string;
  testedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  reservedForRequestId?: string;
  issuedAt?: string;
  receivedAt?: string;
  discardedAt?: string;
  discardReason?: string;
  createdAt?: string;
  updatedAt?: string;

  // UI fields
  id: string;
  bagId: string;
  component?: BloodComponent;
  volumeMl?: number;
  storageZone?: string;
  temperature?: string;
  donorName?: string;
  screening?: {
    hiv: 'Negative' | 'Positive';
    hbv: 'Negative' | 'Positive';
    hcv: 'Negative' | 'Positive';
    syphilis: 'Non-reactive' | 'Reactive';
    malaria: 'Negative' | 'Positive';
  };
}

export type BloodUnitItem = BloodUnit;

export interface BloodInventory {
  bloodGroup: BloodGroup;
  available: number;
  reserved: number;
  issued: number;
  expired: number;
  discarded: number;
  minimumThreshold: number;
  criticalThreshold: number;
  updatedAt: string;
}

export type EmergencyStatus =
  | 'PENDING'
  | 'ACKNOWLEDGED'
  | 'IN_REVIEW'
  | 'RESERVED'
  | 'DISPATCHED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'ESCALATED'
  | 'CANCELLED';

export interface EmergencyRequest {
  emergencyId: string;
  requestId: string;
  hospitalId: string;
  patientId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  doctorId: string;
  status: EmergencyStatus;
  createdAt: string;
  responseDeadline: string;
  assignedStaffId?: string;
  escalationLevel: number;
  acknowledgedAt?: string;
  reservedAt?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  updatedAt: string;
}

export interface Donation {
  donationId: string;
  donorId: string;
  appointmentId?: string;
  screeningId: string;
  bloodUnitId?: string;
  bloodGroup: BloodGroup;
  collectionDate: string;
  collectionLocation: string;
  collectedBy: string;
  status:
    | 'SCHEDULED'
    | 'SCREENING'
    | 'COLLECTED'
    | 'TESTING'
    | 'COMPLETED'
    | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface DonorScreening {
  screeningId: string;
  donorId: string;
  appointmentId?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  hemoglobin?: number;
  weight?: number;
  questionnaire: Record<string, boolean>;
  observations?: string;
  remarks?: string;
  finalDecision: 'ELIGIBLE' | 'DEFERRED' | 'NOT_ELIGIBLE';
  screenedBy: string;
  screenedAt: string;
  createdAt: string;
}

export interface BloodDispatch {
  dispatchId: string;
  requestId: string;
  hospitalId: string;
  bloodUnitIds: string[];
  quantity: number;
  dispatchedBy: string;
  dispatchedAt: string;
  status: 'PREPARING' | 'DISPATCHED' | 'RECEIVED' | 'DISCREPANCY';
  notes?: string;
}

export interface BloodReceipt {
  receiptId: string;
  dispatchId: string;
  requestId: string;
  hospitalId: string;
  receivedBy: string;
  receivedAt: string;
  quantityReceived: number;
  bloodUnitIds: string[];
  verificationStatus: 'MATCHED' | 'DISCREPANCY';
  discrepancy?: {
    expectedQuantity: number;
    receivedQuantity: number;
    missingUnitIds?: string[];
    notes?: string;
  };
}

export type NotificationType =
  | 'APPOINTMENT'
  | 'REQUEST'
  | 'EMERGENCY'
  | 'INVENTORY'
  | 'EXPIRY'
  | 'DISPATCH'
  | 'RECEIPT'
  | 'HOSPITAL'
  | 'SYSTEM';

export interface Notification {
  notificationId?: string;
  recipientUid?: string;
  userId?: string;
  type?: NotificationType;
  title: string;
  message: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'low' | 'normal' | 'alert' | 'critical';
  read: boolean;
  relatedResourceType?: string;
  relatedResourceId?: string;
  createdAt?: string;
  readAt?: string;

  // UI fields
  id: string;
  timestamp: string;
  link?: string;
  targetRole?: UserRole;
}

export type HemoraNotification = Notification;

export interface AuditLog {
  auditId: string;
  actorUid: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  timestamp: string;
}

export interface SystemSettings {
  settingId: string;
  coldChainAlertThreshold: number;
  emergencySlaMinutes: number;
  autoEscalateEmergency: boolean;
  bloodUnitExpiryDays: number;
  updatedAt: string;
  cooldownDays?: number;
  minHbMale?: number;
  minHbFemale?: number;
}

// User context profiles
export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface DonorUser extends BaseUser {
  role: 'donor';
  bloodGroup: BloodGroup;
  phone: string;
  city: string;
  address: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastDonationDate: string | null;
  cooldownDaysRemaining: number;
  totalDonationsCount: number;
  livesImpacted: number;
  vitals: {
    hemoglobin: number;
    weightKg: number;
    bloodPressure: string;
    pulseBpm: number;
  };
}

export interface HospitalUser extends BaseUser {
  role: 'hospital';
  hospitalName: string;
  licenseNumber: string;
  emergencyContact: string;
  address: string;
  city: string;
  bedCapacity: number;
  activeDoctorsCount: number;
  bloodBankCode: string;
}

export interface StaffUser extends BaseUser {
  role: 'staff';
  staffId: string;
  department: 'Phlebotomy' | 'Serology' | 'Cold-Chain Logistics' | 'Requisition Triage';
  shift: 'Morning' | 'Evening' | 'Night';
  licenseId: string;
}

export interface AdminUser extends BaseUser {
  role: 'admin';
  superAdmin: boolean;
  clearanceLevel: 'Level 1' | 'Level 2' | 'System Director';
}

export type AuthUser = DonorUser | HospitalUser | StaffUser | AdminUser;

// Service Input Contracts
export interface RegisterDonorInput {
  email: string;
  fullName: string;
  bloodGroup: BloodGroup;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  mobileNumber: string;
  address: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    mobileNumber: string;
  };
}

export interface RegisterHospitalInput {
  email: string;
  hospitalName: string;
  registrationNumber: string;
  hospitalType: HospitalType;
  address: string;
  city: string;
  contactNumber: string;
  officialEmail: string;
  contactPerson: string;
  hospitalAdministratorName: string;
}

export interface CreateDoctorInput {
  name?: string;
  fullName?: string;
  specialization?: string;
  specialty?: string;
  registrationNumber?: string;
  medicalLicense?: string;
  contactNumber?: string;
  phone?: string;
  email?: string;
  authorizedForEmergencyOrder?: boolean;
}

export interface CreateBloodRequestInput {
  hospitalId: string;
  patientId: string;
  caseId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  priority: BloodRequestPriority;
  doctorId: string;
  component?: BloodComponent;
  patientName?: string;
  patientAge?: number;
  clinicalDiagnosis?: string;
}

export interface CreateEmergencyRequestInput {
  requestId?: string;
  hospitalId: string;
  patientId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  doctorId: string;
  emergencyReason?: string;
}

export interface ConfirmReceiptInput {
  dispatchId: string;
  requestId: string;
  hospitalId: string;
  receivedBy: string;
  quantityReceived: number;
  bloodUnitIds: string[];
  verificationStatus: 'MATCHED' | 'DISCREPANCY';
  discrepancyNotes?: string;
}

export interface CreateScreeningInput {
  donorId: string;
  appointmentId?: string;
  bloodPressure: string;
  pulse: number;
  temperature: number;
  hemoglobin: number;
  weight: number;
  questionnaire: Record<string, boolean>;
  observations?: string;
  remarks?: string;
  finalDecision: 'ELIGIBLE' | 'DEFERRED' | 'NOT_ELIGIBLE';
}

export interface RecordDonationInput {
  donorId: string;
  appointmentId?: string;
  screeningId: string;
  bloodGroup: BloodGroup;
  collectionLocation: string;
}

export interface TestingResultInput {
  testingStatus: 'PASSED' | 'FAILED';
  serologyDetails?: {
    hiv: 'Negative' | 'Positive';
    hbv: 'Negative' | 'Positive';
    hcv: 'Negative' | 'Positive';
    syphilis: 'Non-reactive' | 'Reactive';
    malaria: 'Negative' | 'Positive';
  };
  testedBy: string;
}

export interface DispatchBloodInput {
  requestId: string;
  hospitalId: string;
  bloodUnitIds: string[];
  dispatchedBy: string;
  notes?: string;
}

export interface AppointmentSlotInput {
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface BloodUnitFilters {
  bloodGroup?: BloodGroup;
  status?: BloodUnitStatus;
  testingStatus?: 'PENDING' | 'PASSED' | 'FAILED';
}

export interface AuditLogFilters {
  actorUid?: string;
  actorRole?: UserRole;
  resourceType?: string;
  limit?: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  bloodGroup?: BloodGroup;
}

export interface StaffDashboardData {
  appointmentsToday: number;
  screeningsPending: number;
  unitsTestingPending: number;
  unitsAvailable: number;
  activeEmergencyRequests: number;
  temperatureAlerts: number;
}

export interface AdminDashboardData {
  totalDonors: number;
  totalHospitals: number;
  totalUnitsAvailable: number;
  totalDispatchedThisMonth: number;
  emergencyFulfillRate: number;
  coldChainCompliance: number;
}

export interface ReportData {
  period: string;
  totalDonations: number;
  totalIssued: number;
  discardRate: number;
  breakdownByGroup: Record<BloodGroup, number>;
}

export interface ReservationResult {
  success: boolean;
  requestId: string;
  unitsReserved: number;
  allocatedUnitIds: string[];
}
