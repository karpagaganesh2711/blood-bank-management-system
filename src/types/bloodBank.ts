export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType = 
  | 'Whole Blood' 
  | 'Packed Red Blood Cells (PRBC)' 
  | 'Platelet Concentrate' 
  | 'Fresh Frozen Plasma (FFP)' 
  | 'Cryoprecipitate';

export type UnitStatus = 'Available' | 'Reserved' | 'Dispatched' | 'Quarantined' | 'Expired';

export interface BloodTestScreening {
  hiv: 'Negative' | 'Positive';
  hcv: 'Negative' | 'Positive';
  hbv: 'Negative' | 'Positive';
  syphilis: 'Non-reactive' | 'Reactive';
  malaria: 'Negative' | 'Positive';
}

export interface BloodUnit {
  id: string;
  bagId: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  volumeMl: number;
  collectionDate: string;
  expiryDate: string;
  donorId: string;
  donorName: string;
  storageLocation: string;
  temperatureZone: string;
  status: UnitStatus;
  testResults: BloodTestScreening;
  notes?: string;
}

export interface Donor {
  id: string;
  donorCode: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalDonations: number;
  lastDonationDate: string | null;
  eligibilityStatus: 'Eligible' | 'Cooldown' | 'Deferred';
  cooldownDaysLeft: number;
  healthMetrics: {
    hemoglobin: number; // in g/dL
    weightKg: number;
    bloodPressure: string;
    pulseBpm: number;
  };
}

export type UrgencyLevel = 'Emergency (Immediate)' | 'Urgent (<4 Hours)' | 'Routine (Scheduled)';

export type RequisitionStatus = 
  | 'Pending Review' 
  | 'Cross-Matched' 
  | 'Approved' 
  | 'Dispatched' 
  | 'Fulfilled' 
  | 'Cancelled';

export interface BloodRequisition {
  id: string;
  reqCode: string;
  hospitalName: string;
  department: string;
  doctorName: string;
  patientName: string;
  patientAge: number;
  patientBloodGroup: BloodGroup;
  requiredComponent: ComponentType;
  unitsRequested: number;
  unitsAllocated: number;
  urgency: UrgencyLevel;
  status: RequisitionStatus;
  requestedDate: string;
  clinicalIndication: string;
  matchedUnitBagIds?: string[];
}

export interface DonationCamp {
  id: string;
  title: string;
  organizer: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  targetUnits: number;
  collectedUnits: number;
  registeredDonorsCount: number;
  status: 'Upcoming' | 'Active Today' | 'Completed';
  contactPerson: string;
  contactPhone: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  category: 'Inventory' | 'Donor' | 'Requisition' | 'CrossMatch' | 'Emergency';
  details: string;
  badgeLevel: 'normal' | 'warning' | 'critical';
}
