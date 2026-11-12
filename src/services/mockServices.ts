import { 
  AuthUser, 
  DonorUser,
  UserRole, 
  BloodUnitItem, 
  BloodRequest, 
  DonationAppointment, 
  HemoraNotification, 
  DoctorStaffItem, 
  BloodGroup,
  BloodComponent,
  Doctor
} from '../types/hemora';
import { ALL_DEMO_ACCOUNTS, MOCK_DONOR_USER } from '../mock/users';
import { INITIAL_MOCK_INVENTORY } from '../mock/inventory';
import { INITIAL_MOCK_REQUESTS } from '../mock/requests';
import { INITIAL_MOCK_APPOINTMENTS } from '../mock/appointments';
import { INITIAL_MOCK_DOCTORS, MOCK_RECEIVED_BLOOD_HISTORY } from '../mock/hospitals';
import { INITIAL_MOCK_NOTIFICATIONS } from '../mock/notifications';

const STORAGE = {
  CURRENT_USER: 'hemora_current_user',
  INVENTORY: 'hemora_inventory',
  REQUESTS: 'hemora_requests',
  APPOINTMENTS: 'hemora_appointments',
  DOCTORS: 'hemora_doctors',
  NOTIFICATIONS: 'hemora_notifications',
};

// Helper for local storage simulation with fallback
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
}

// -------------------------------------------------------------
// AUTH SERVICE (Simulating Firebase Authentication & User Claims)
// -------------------------------------------------------------
export const mockAuthService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    const saved = getLocal<AuthUser | null>(STORAGE.CURRENT_USER, null);
    return saved || MOCK_DONOR_USER;
  },

  async login(role: UserRole, email?: string, _password?: string): Promise<AuthUser> {
    await new Promise((r) => setTimeout(r, 450));
    const user = ALL_DEMO_ACCOUNTS[role] || MOCK_DONOR_USER;
    setLocal(STORAGE.CURRENT_USER, user);
    return user;
  },

  async registerDonor(data: Partial<DonorUser>): Promise<DonorUser> {
    await new Promise((r) => setTimeout(r, 600));
    const newUser: DonorUser = {
      ...MOCK_DONOR_USER,
      ...data,
      role: 'donor',
      id: `usr-donor-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLocal(STORAGE.CURRENT_USER, newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE.CURRENT_USER);
  },

  async switchRole(role: UserRole): Promise<AuthUser> {
    const user = ALL_DEMO_ACCOUNTS[role];
    setLocal(STORAGE.CURRENT_USER, user);
    return user;
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      message: `Password reset link simulated and sent to ${email}`,
    };
  }
};

// -------------------------------------------------------------
// INVENTORY SERVICE (Simulating Firestore collection 'blood_units')
// -------------------------------------------------------------
export const mockInventoryService = {
  async getInventory(): Promise<BloodUnitItem[]> {
    return getLocal<BloodUnitItem[]>(STORAGE.INVENTORY, INITIAL_MOCK_INVENTORY);
  },

  async addUnit(unit: Omit<BloodUnitItem, 'id' | 'bagId'>): Promise<BloodUnitItem> {
    const current = await this.getInventory();
    const bagId = `HMR-2026-${Math.floor(9100 + Math.random() * 8900)}`;
    const newBag: BloodUnitItem = {
      ...unit,
      id: `unit-${Date.now()}`,
      bagId,
      bloodUnitId: bagId,
      barcodeValue: `*${bagId}*`,
      qrCodeValue: `ISBT128:${bagId}:${unit.bloodGroup}`,
      testingStatus: 'PASSED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newBag, ...current];
    setLocal(STORAGE.INVENTORY, updated);
    return newBag;
  },

  async updateStatus(id: string, status: BloodUnitItem['status']): Promise<void> {
    const current = await this.getInventory();
    const updated = current.map((u) => (u.id === id ? { ...u, status } : u));
    setLocal(STORAGE.INVENTORY, updated);
  }
};

// -------------------------------------------------------------
// REQUISITION SERVICE (Simulating Firestore collection 'blood_requests')
// -------------------------------------------------------------
export const mockRequisitionService = {
  async getRequests(): Promise<BloodRequest[]> {
    return getLocal<BloodRequest[]>(STORAGE.REQUESTS, INITIAL_MOCK_REQUESTS);
  },

  async createRequest(req: Partial<BloodRequest> & {
    hospitalId: string;
    hospitalName: string;
    patientName: string;
    patientAge: number;
    bloodGroup: BloodGroup;
    component: BloodComponent;
    unitsRequested: number;
    urgency: BloodRequest['urgency'];
    doctorName: string;
    clinicalDiagnosis: string;
  }): Promise<BloodRequest> {
    const current = await this.getRequests();
    const now = new Date();
    const reqId = `req-${Date.now()}`;
    const newReq: BloodRequest = {
      ...req,
      id: reqId,
      requestId: reqId,
      requestCode: `HMR-REQ-${Math.floor(9000 + Math.random() * 999)}`,
      status: 'SUBMITTED',
      unitsAllocated: 0,
      requestedAt: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`,
      patientId: req.patientName,
      caseId: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      unitsRequired: req.unitsRequested,
      priority: req.urgency === 'EMERGENCY' ? 'EMERGENCY' : req.urgency === 'URGENT' ? 'URGENT' : 'NORMAL',
      doctorId: 'doc-default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newReq, ...current];
    setLocal(STORAGE.REQUESTS, updated);
    return newReq;
  },

  async crossMatch(requestId: string, bagIds: string[]): Promise<void> {
    const current = await this.getRequests();
    const updated = current.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'CROSS_MATCHED' as const,
            allocatedBagIds: bagIds,
            unitsAllocated: bagIds.length,
          }
        : r
    );
    setLocal(STORAGE.REQUESTS, updated);

    // Also mark inventory units as RESERVED
    const units = await mockInventoryService.getInventory();
    const updatedUnits = units.map((u) => (bagIds.includes(u.bagId || '') ? { ...u, status: 'RESERVED' as const } : u));
    setLocal(STORAGE.INVENTORY, updatedUnits);
  },

  async dispatch(requestId: string, tempLog: string): Promise<void> {
    const current = await this.getRequests();
    const target = current.find((r) => r.id === requestId);
    const updated = current.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'DISPATCHED' as const,
            temperatureLoggedAtDispatch: tempLog,
          }
        : r
    );
    setLocal(STORAGE.REQUESTS, updated);

    if (target?.allocatedBagIds) {
      const units = await mockInventoryService.getInventory();
      const updatedUnits = units.map((u) =>
        target.allocatedBagIds?.includes(u.bagId || '') ? { ...u, status: 'DISPATCHED' as const } : u
      );
      setLocal(STORAGE.INVENTORY, updatedUnits);
    }
  },

  async fulfill(requestId: string): Promise<void> {
    const current = await this.getRequests();
    const updated = current.map((r) => (r.id === requestId ? { ...r, status: 'FULFILLED' as const } : r));
    setLocal(STORAGE.REQUESTS, updated);
  }
};

// -------------------------------------------------------------
// APPOINTMENT SERVICE (Simulating Firestore collection 'appointments')
// -------------------------------------------------------------
export const mockAppointmentService = {
  async getAppointments(): Promise<DonationAppointment[]> {
    return getLocal<DonationAppointment[]>(STORAGE.APPOINTMENTS, INITIAL_MOCK_APPOINTMENTS);
  },

  async bookAppointment(data: Omit<DonationAppointment, 'id' | 'appointmentCode' | 'status'> & {
    appointmentId?: string;
  }): Promise<DonationAppointment> {
    const current = await this.getAppointments();
    const aptId = `apt-${Date.now()}`;
    const newApt: DonationAppointment = {
      ...data,
      id: aptId,
      appointmentId: aptId,
      appointmentCode: `APT-HMR-${Math.floor(4500 + Math.random() * 5400)}`,
      status: 'SCHEDULED',
      bookedCount: 1,
      capacity: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookedAt: new Date().toISOString()
    };
    const updated = [newApt, ...current];
    setLocal(STORAGE.APPOINTMENTS, updated);
    return newApt;
  },

  async cancelAppointment(id: string): Promise<void> {
    const current = await this.getAppointments();
    const updated = current.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' as const } : a));
    setLocal(STORAGE.APPOINTMENTS, updated);
  },

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<void> {
    const current = await this.getAppointments();
    const updated = current.map((a) =>
      a.id === id ? { ...a, date: newDate, timeSlot: newTime, status: 'SCHEDULED' as const } : a
    );
    setLocal(STORAGE.APPOINTMENTS, updated);
  }
};

// -------------------------------------------------------------
// HOSPITAL SERVICE (Doctors & Received History)
// -------------------------------------------------------------
export const mockHospitalService = {
  async getDoctors(): Promise<DoctorStaffItem[]> {
    return getLocal<DoctorStaffItem[]>(STORAGE.DOCTORS, INITIAL_MOCK_DOCTORS);
  },

  async addDoctor(docData: Partial<DoctorStaffItem> & { fullName: string; specialty: string; medicalLicense: string; phone: string }): Promise<DoctorStaffItem> {
    const current = await this.getDoctors();
    const id = `doc-${Date.now()}`;
    const newDoc: DoctorStaffItem = {
      id,
      doctorId: id,
      hospitalId: 'hosp_default',
      name: docData.fullName,
      fullName: docData.fullName,
      specialization: docData.specialty,
      specialty: docData.specialty,
      registrationNumber: docData.medicalLicense,
      medicalLicense: docData.medicalLicense,
      contactNumber: docData.phone,
      phone: docData.phone,
      authorizedForEmergencyOrder: docData.authorizedForEmergencyOrder ?? true,
      activeOrdersCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...current, newDoc];
    setLocal(STORAGE.DOCTORS, updated);
    return newDoc;
  },

  async removeDoctor(id: string): Promise<void> {
    const current = await this.getDoctors();
    const updated = current.filter((d) => d.id !== id);
    setLocal(STORAGE.DOCTORS, updated);
  },

  async getReceivedBlood(): Promise<typeof MOCK_RECEIVED_BLOOD_HISTORY> {
    return MOCK_RECEIVED_BLOOD_HISTORY;
  }
};

// -------------------------------------------------------------
// NOTIFICATIONS SERVICE
// -------------------------------------------------------------
export const mockNotificationService = {
  async getNotifications(): Promise<HemoraNotification[]> {
    return getLocal<HemoraNotification[]>(STORAGE.NOTIFICATIONS, INITIAL_MOCK_NOTIFICATIONS);
  },

  async markAsRead(id: string): Promise<void> {
    const current = await this.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    setLocal(STORAGE.NOTIFICATIONS, updated);
  }
};
