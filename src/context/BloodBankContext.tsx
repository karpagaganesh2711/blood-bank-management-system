import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BloodUnit, 
  Donor, 
  BloodRequisition, 
  DonationCamp, 
  AuditEntry,
  BloodGroup,
  ComponentType,
  RequisitionStatus,
  UnitStatus
} from '../types/bloodBank';
import { 
  INITIAL_BLOOD_UNITS, 
  INITIAL_DONORS, 
  INITIAL_REQUISITIONS, 
  INITIAL_CAMPS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

interface BloodBankContextType {
  units: BloodUnit[];
  donors: Donor[];
  requisitions: BloodRequisition[];
  camps: DonationCamp[];
  auditLogs: AuditEntry[];
  
  // Quick filters & stats
  stats: {
    totalUnits: number;
    availableUnits: number;
    expiringWithin7Days: number;
    activeRequisitions: number;
    criticalShortages: BloodGroup[];
    unitsByGroup: Record<BloodGroup, number>;
  };

  // Actions
  addBloodUnit: (unit: Omit<BloodUnit, 'id' | 'bagId'>) => void;
  updateUnitStatus: (id: string, status: UnitStatus) => void;
  addDonor: (donor: Omit<Donor, 'id' | 'donorCode' | 'totalDonations' | 'lastDonationDate' | 'cooldownDaysLeft'>) => void;
  recordDonation: (donorId: string, component: ComponentType, volumeMl: number, storageLocation: string) => void;
  createRequisition: (req: Omit<BloodRequisition, 'id' | 'reqCode' | 'unitsAllocated' | 'status' | 'requestedDate'>) => void;
  updateRequisitionStatus: (reqId: string, status: RequisitionStatus, unitIds?: string[]) => void;
  crossMatchRequisition: (reqId: string, unitBagIds: string[]) => boolean;
  fulfillRequisition: (reqId: string) => void;
  addCamp: (camp: Omit<DonationCamp, 'id' | 'collectedUnits' | 'registeredDonorsCount' | 'status'>) => void;
  registerForCamp: (campId: string) => void;
  broadcastEmergencyAlert: (bloodGroup: BloodGroup, unitsNeeded: number, reason: string) => void;
  resetToDefaults: () => void;
}

const BloodBankContext = createContext<BloodBankContextType | null>(null);

const STORAGE_KEYS = {
  UNITS: 'hemaflow_units_v1',
  DONORS: 'hemaflow_donors_v1',
  REQUISITIONS: 'hemaflow_requisitions_v1',
  CAMPS: 'hemaflow_camps_v1',
  AUDIT: 'hemaflow_audit_v1',
};

const ALL_BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<BloodUnit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNITS);
      return saved ? JSON.parse(saved) : INITIAL_BLOOD_UNITS;
    } catch {
      return INITIAL_BLOOD_UNITS;
    }
  });

  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONORS);
      return saved ? JSON.parse(saved) : INITIAL_DONORS;
    } catch {
      return INITIAL_DONORS;
    }
  });

  const [requisitions, setRequisitions] = useState<BloodRequisition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUISITIONS);
      return saved ? JSON.parse(saved) : INITIAL_REQUISITIONS;
    } catch {
      return INITIAL_REQUISITIONS;
    }
  });

  const [camps, setCamps] = useState<DonationCamp[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPS);
      return saved ? JSON.parse(saved) : INITIAL_CAMPS;
    } catch {
      return INITIAL_CAMPS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUISITIONS, JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(camps));
  }, [camps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditEntry = (
    action: string, 
    actor: string, 
    category: AuditEntry['category'], 
    details: string, 
    badgeLevel: AuditEntry['badgeLevel'] = 'normal'
  ) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      action,
      actor,
      category,
      details,
      badgeLevel,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Compute live statistics
  const nowMs = Date.now();
  const sevenDaysFromNow = nowMs + 7 * 24 * 60 * 60 * 1000;

  const unitsByGroup = ALL_BLOOD_GROUPS.reduce((acc, bg) => {
    acc[bg] = units.filter(u => u.bloodGroup === bg && u.status === 'Available').length;
    return acc;
  }, {} as Record<BloodGroup, number>);

  const expiringWithin7Days = units.filter(u => {
    if (u.status !== 'Available') return false;
    const exp = new Date(u.expiryDate).getTime();
    return exp > nowMs && exp <= sevenDaysFromNow;
  }).length;

  const criticalShortages = ALL_BLOOD_GROUPS.filter(bg => unitsByGroup[bg] <= 1);

  const stats = {
    totalUnits: units.length,
    availableUnits: units.filter(u => u.status === 'Available').length,
    expiringWithin7Days,
    activeRequisitions: requisitions.filter(r => r.status !== 'Fulfilled' && r.status !== 'Cancelled').length,
    criticalShortages,
    unitsByGroup,
  };

  const addBloodUnit = (unitData: Omit<BloodUnit, 'id' | 'bagId'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bagId = `BAG-${new Date().getFullYear()}-${randomSuffix}`;
    const newUnit: BloodUnit = {
      ...unitData,
      id: `unit-${Date.now()}`,
      bagId,
    };
    setUnits(prev => [newUnit, ...prev]);
    addAuditEntry(
      'Blood Unit Logged & Sequestered',
      'Blood Bank Accession Officer',
      'Inventory',
      `Registered bag ${bagId} (${newUnit.bloodGroup} ${newUnit.component}) from donor ${newUnit.donorName}. Cold storage: ${newUnit.storageLocation}.`,
      'normal'
    );
  };

  const updateUnitStatus = (id: string, status: UnitStatus) => {
    setUnits(prev => prev.map(u => {
      if (u.id === id) {
        addAuditEntry(
          'Unit Status Modified',
          'Inventory Controller',
          'Inventory',
          `Unit ${u.bagId} status shifted from ${u.status} to ${status}.`,
          status === 'Quarantined' || status === 'Expired' ? 'warning' : 'normal'
        );
        return { ...u, status };
      }
      return u;
    }));
  };

  const addDonor = (donorData: Omit<Donor, 'id' | 'donorCode' | 'totalDonations' | 'lastDonationDate' | 'cooldownDaysLeft'>) => {
    const donorCode = `DNR-${Math.floor(1060 + Math.random() * 9000)}`;
    const newDonor: Donor = {
      ...donorData,
      id: `donor-${Date.now()}`,
      donorCode,
      totalDonations: 0,
      lastDonationDate: null,
      cooldownDaysLeft: 0,
      eligibilityStatus: 'Eligible',
    };
    setDonors(prev => [newDonor, ...prev]);
    addAuditEntry(
      'New Donor Screened & Enrolled',
      'Donor Receptionist',
      'Donor',
      `Registered donor ${newDonor.fullName} (${newDonor.bloodGroup}, Age ${newDonor.age}). Pre-screening health parameters approved.`,
      'normal'
    );
  };

  const recordDonation = (
    donorId: string, 
    component: ComponentType, 
    volumeMl: number, 
    storageLocation: string
  ) => {
    const targetDonor = donors.find(d => d.id === donorId);
    if (!targetDonor) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    // Calculate expiry based on component
    let shelfDays = 35; // Default PRBC / Whole blood
    let tempZone = '2°C - 6°C';

    if (component === 'Platelet Concentrate') {
      shelfDays = 5;
      tempZone = '20°C - 24°C';
    } else if (component === 'Fresh Frozen Plasma (FFP)' || component === 'Cryoprecipitate') {
      shelfDays = 365;
      tempZone = '-30°C or colder';
    }

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + shelfDays);
    const expiryStr = expDate.toISOString().slice(0, 10);

    // Create blood unit
    addBloodUnit({
      bloodGroup: targetDonor.bloodGroup,
      component,
      volumeMl,
      collectionDate: todayStr,
      expiryDate: expiryStr,
      donorId: targetDonor.id,
      donorName: targetDonor.fullName,
      storageLocation,
      temperatureZone: tempZone,
      status: 'Available',
      testResults: {
        hiv: 'Negative',
        hcv: 'Negative',
        hbv: 'Negative',
        syphilis: 'Non-reactive',
        malaria: 'Negative',
      },
      notes: `Phlebotomy completed uneventfully. Donor tolerated well.`
    });

    // Update donor cooldown (e.g. 56 days for whole blood/red cells)
    setDonors(prev => prev.map(d => {
      if (d.id === donorId) {
        return {
          ...d,
          totalDonations: d.totalDonations + 1,
          lastDonationDate: todayStr,
          eligibilityStatus: 'Cooldown',
          cooldownDaysLeft: 56,
        };
      }
      return d;
    }));

    addAuditEntry(
      'Blood Donation Collected',
      'Clinical Phlebotomist',
      'Donor',
      `Collected ${volumeMl}ml of ${component} from ${targetDonor.fullName} (${targetDonor.bloodGroup}). Cooldown period initiated.`,
      'normal'
    );
  };

  const createRequisition = (reqData: Omit<BloodRequisition, 'id' | 'reqCode' | 'unitsAllocated' | 'status' | 'requestedDate'>) => {
    const reqCode = `REQ-${Math.floor(9100 + Math.random() * 8900)}`;
    const now = new Date();
    const requestedDate = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    
    const newReq: BloodRequisition = {
      ...reqData,
      id: `req-${Date.now()}`,
      reqCode,
      unitsAllocated: 0,
      status: 'Pending Review',
      requestedDate,
    };

    setRequisitions(prev => [newReq, ...prev]);
    addAuditEntry(
      'Blood Requisition Registered',
      'Hospital Liason Nurse',
      'Requisition',
      `Requisition ${reqCode} logged from ${newReq.hospitalName} (${newReq.department}) for ${newReq.unitsRequested} units of ${newReq.patientBloodGroup} ${newReq.requiredComponent}. Urgency: ${newReq.urgency}.`,
      newReq.urgency.includes('Emergency') ? 'critical' : 'normal'
    );
  };

  const updateRequisitionStatus = (reqId: string, status: RequisitionStatus, unitIds?: string[]) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status,
          ...(unitIds ? { matchedUnitBagIds: unitIds, unitsAllocated: unitIds.length } : {})
        };
      }
      return r;
    }));
  };

  const crossMatchRequisition = (reqId: string, unitBagIds: string[]): boolean => {
    const req = requisitions.find(r => r.id === reqId);
    if (!req) return false;

    // Reserve the selected units
    setUnits(prev => prev.map(u => {
      if (unitBagIds.includes(u.bagId)) {
        return { ...u, status: 'Reserved' };
      }
      return u;
    }));

    updateRequisitionStatus(reqId, 'Cross-Matched', unitBagIds);

    addAuditEntry(
      'Cross-Match Laboratory Clearance',
      'Senior Immunohematology Tech',
      'CrossMatch',
      `Requisition ${req.reqCode} successfully cross-matched with units [${unitBagIds.join(', ')}]. Serological and Coombs testing passed.`,
      'normal'
    );

    return true;
  };

  const fulfillRequisition = (reqId: string) => {
    const req = requisitions.find(r => r.id === reqId);
    if (!req) return;

    // Mark reserved units as Dispatched
    if (req.matchedUnitBagIds && req.matchedUnitBagIds.length > 0) {
      setUnits(prev => prev.map(u => {
        if (req.matchedUnitBagIds?.includes(u.bagId)) {
          return { ...u, status: 'Dispatched' };
        }
        return u;
      }));
    }

    updateRequisitionStatus(reqId, 'Fulfilled');

    addAuditEntry(
      'Cold-Chain Dispatch & Fulfillment Completed',
      'Transfusion Dispatch Supervisor',
      'Requisition',
      `Requisition ${req.reqCode} for ${req.hospitalName} fulfilled. Cold-chain seal applied, units dispatched.`,
      'normal'
    );
  };

  const addCamp = (campData: Omit<DonationCamp, 'id' | 'collectedUnits' | 'registeredDonorsCount' | 'status'>) => {
    const newCamp: DonationCamp = {
      ...campData,
      id: `camp-${Date.now()}`,
      collectedUnits: 0,
      registeredDonorsCount: 0,
      status: 'Upcoming',
    };
    setCamps(prev => [newCamp, ...prev]);
    addAuditEntry(
      'Blood Donation Drive Scheduled',
      'Community Outreach Director',
      'Emergency',
      `Blood drive "${newCamp.title}" scheduled for ${newCamp.date} at ${newCamp.venue}. Target: ${newCamp.targetUnits} units.`,
      'normal'
    );
  };

  const registerForCamp = (campId: string) => {
    setCamps(prev => prev.map(c => {
      if (c.id === campId) {
        return {
          ...c,
          registeredDonorsCount: c.registeredDonorsCount + 1,
        };
      }
      return c;
    }));
  };

  const broadcastEmergencyAlert = (bloodGroup: BloodGroup, unitsNeeded: number, reason: string) => {
    addAuditEntry(
      'CRITICAL BLOOD SHORTAGE SOS BROADCAST',
      'Medical Director / Blood Bank Chief',
      'Emergency',
      `Emergency broadcast issued for ${unitsNeeded} units of ${bloodGroup} blood! Indication: ${reason}. Automated SMS notification pushed to eligible registered ${bloodGroup} donors.`,
      'critical'
    );
  };

  const resetToDefaults = () => {
    setUnits(INITIAL_BLOOD_UNITS);
    setDonors(INITIAL_DONORS);
    setRequisitions(INITIAL_REQUISITIONS);
    setCamps(INITIAL_CAMPS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.REQUISITIONS);
    localStorage.removeItem(STORAGE_KEYS.CAMPS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
  };

  return (
    <BloodBankContext.Provider
      value={{
        units,
        donors,
        requisitions,
        camps,
        auditLogs,
        stats,
        addBloodUnit,
        updateUnitStatus,
        addDonor,
        recordDonation,
        createRequisition,
        updateRequisitionStatus,
        crossMatchRequisition,
        fulfillRequisition,
        addCamp,
        registerForCamp,
        broadcastEmergencyAlert,
        resetToDefaults,
      }}
    >
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBank = () => {
  const context = useContext(BloodBankContext);
  if (!context) {
    throw new Error('useBloodBank must be used within a BloodBankProvider');
  }
  return context;
};
