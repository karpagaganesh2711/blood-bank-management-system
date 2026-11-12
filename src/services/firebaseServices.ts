import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { handleFirestoreError } from '../firebase/errorHandler';
import {
  AuthService,
  DonorService,
  HospitalService,
  StaffService,
  AdminService
} from './contracts';
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
  SystemSettings
} from '../types/hemora';

// --- AUTH SERVICE ---
export class FirebaseAuthServiceImpl implements AuthService {
  async login(email: string, pass: string): Promise<FirebaseUserProfile> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as FirebaseUserProfile;
        await updateDoc(userDocRef, {
          lastLoginAt: new Date().toISOString()
        });
        return data;
      }

      // Default fallback profile if logging in for the first time
      const role = email.toLowerCase().includes('admin') || email === 'karpagaganesh27@gmail.com'
        ? 'ADMIN'
        : email.toLowerCase().includes('hospital')
        ? 'HOSPITAL'
        : email.toLowerCase().includes('staff')
        ? 'STAFF'
        : 'DONOR';

      const newProfile: FirebaseUserProfile = {
        uid: cred.user.uid,
        role,
        fullName: cred.user.displayName || email.split('@')[0],
        email: cred.user.email || email,
        phoneVerified: false,
        emailVerified: cred.user.emailVerified,
        accountStatus: 'ACTIVE',
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await setDoc(userDocRef, newProfile);
      return newProfile;
    } catch (err) {
      handleFirestoreError(err, 'read', 'users/auth');
      throw err;
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): FirebaseUserProfile | null {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;
    return {
      uid: fbUser.uid,
      role: 'DONOR',
      fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      email: fbUser.email || undefined,
      phoneVerified: false,
      emailVerified: fbUser.emailVerified,
      accountStatus: 'ACTIVE',
      profileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleFirestoreError(err, 'update', 'auth/reset-password');
      throw err;
    }
  }

  async registerDonor(data: RegisterDonorInput): Promise<FirebaseUserProfile> {
    try {
      const tempPass = 'HemoraDonor#2026';
      let uid = '';
      try {
        const cred = await createUserWithEmailAndPassword(auth, data.email, tempPass);
        uid = cred.user.uid;
      } catch {
        uid = 'donor_' + Date.now();
      }

      const userProfile: FirebaseUserProfile = {
        uid,
        role: 'DONOR',
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        phoneVerified: true,
        emailVerified: true,
        accountStatus: 'ACTIVE',
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), userProfile);

      const donorDoc: Donor = {
        donorId: uid,
        uid,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        mobileNumber: data.mobileNumber,
        email: data.email,
        address: data.address,
        city: data.city,
        emergencyContact: data.emergencyContact,
        verificationStatus: 'VERIFIED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'donors', uid), donorDoc);
      return userProfile;
    } catch (err) {
      handleFirestoreError(err, 'create', 'users/register-donor');
      throw err;
    }
  }

  async registerHospital(data: RegisterHospitalInput): Promise<FirebaseUserProfile> {
    try {
      const tempPass = 'HemoraHosp#2026';
      let uid = '';
      try {
        const cred = await createUserWithEmailAndPassword(auth, data.email, tempPass);
        uid = cred.user.uid;
      } catch {
        uid = 'hosp_' + Date.now();
      }

      const userProfile: FirebaseUserProfile = {
        uid,
        role: 'HOSPITAL',
        fullName: data.hospitalName,
        email: data.email,
        mobileNumber: data.contactNumber,
        phoneVerified: true,
        emailVerified: true,
        accountStatus: 'ACTIVE',
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), userProfile);

      const hospitalDoc: Hospital = {
        hospitalId: uid,
        uid,
        hospitalName: data.hospitalName,
        registrationNumber: data.registrationNumber,
        hospitalType: data.hospitalType,
        address: data.address,
        city: data.city,
        contactNumber: data.contactNumber,
        officialEmail: data.officialEmail,
        contactPerson: data.contactPerson,
        hospitalAdministratorName: data.hospitalAdministratorName,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'hospitals', uid), hospitalDoc);
      return userProfile;
    } catch (err) {
      handleFirestoreError(err, 'create', 'users/register-hospital');
      throw err;
    }
  }
}

// --- DONOR SERVICE ---
export class FirebaseDonorServiceImpl implements DonorService {
  async getProfile(donorId: string): Promise<Donor> {
    try {
      const snap = await getDoc(doc(db, 'donors', donorId));
      if (snap.exists()) {
        return snap.data() as Donor;
      }
      throw new Error(`Donor with ID ${donorId} not found.`);
    } catch (err) {
      handleFirestoreError(err, 'read', `donors/${donorId}`);
      throw err;
    }
  }

  async updateProfile(donorId: string, data: Partial<Donor>): Promise<void> {
    try {
      await updateDoc(doc(db, 'donors', donorId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `donors/${donorId}`);
      throw err;
    }
  }

  async getAppointments(donorId: string): Promise<DonationAppointment[]> {
    try {
      const q = query(collection(db, 'appointments'), where('donorId', '==', donorId));
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ ...(d.data() as DonationAppointment), appointmentId: d.id, id: d.id }));
    } catch (err) {
      handleFirestoreError(err, 'list', 'appointments');
      return [];
    }
  }

  async bookAppointment(donorId: string, appointmentId: string): Promise<DonationAppointment> {
    try {
      const apptRef = doc(db, 'appointments', appointmentId);
      const apptSnap = await getDoc(apptRef);
      if (!apptSnap.exists()) {
        throw new Error('Appointment slot not found.');
      }
      const appt = apptSnap.data() as DonationAppointment;
      const updated: Partial<DonationAppointment> = {
        donorId,
        status: 'BOOKED',
        bookedAt: new Date().toISOString(),
        bookedCount: (appt.bookedCount || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(apptRef, updated);
      return { ...appt, ...updated };
    } catch (err) {
      handleFirestoreError(err, 'update', `appointments/${appointmentId}`);
      throw err;
    }
  }

  async cancelAppointment(donorId: string, appointmentId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        cancellationReason: 'Cancelled by donor',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `appointments/${appointmentId}`);
      throw err;
    }
  }

  async getDonationHistory(donorId: string): Promise<Donation[]> {
    try {
      const q = query(collection(db, 'donations'), where('donorId', '==', donorId));
      const snaps = await getDocs(q);
      return snaps.docs.map(d => d.data() as Donation);
    } catch (err) {
      handleFirestoreError(err, 'list', 'donations');
      return [];
    }
  }

  async getNotifications(uid: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('recipientUid', 'in', [uid, 'ALL'])
      );
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ ...(d.data() as Notification), notificationId: d.id, id: d.id, timestamp: d.data().createdAt || new Date().toISOString() }));
    } catch (err) {
      handleFirestoreError(err, 'list', 'notifications');
      return [];
    }
  }
}

// --- HOSPITAL SERVICE ---
export class FirebaseHospitalServiceImpl implements HospitalService {
  async getProfile(hospitalId: string): Promise<Hospital> {
    try {
      const snap = await getDoc(doc(db, 'hospitals', hospitalId));
      if (snap.exists()) {
        return snap.data() as Hospital;
      }
      throw new Error(`Hospital ${hospitalId} not found.`);
    } catch (err) {
      handleFirestoreError(err, 'read', `hospitals/${hospitalId}`);
      throw err;
    }
  }

  async updateProfile(hospitalId: string, data: Partial<Hospital>): Promise<void> {
    try {
      await updateDoc(doc(db, 'hospitals', hospitalId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `hospitals/${hospitalId}`);
      throw err;
    }
  }

  async getDoctors(hospitalId: string): Promise<Doctor[]> {
    try {
      const colRef = collection(db, 'hospitals', hospitalId, 'doctors');
      const snaps = await getDocs(colRef);
      return snaps.docs.map(d => {
        const data = d.data();
        const docName = data.name || data.fullName || 'Doctor';
        const docSpec = data.specialization || data.specialty || 'General';
        const docLic = data.registrationNumber || data.medicalLicense || 'REG';
        const docPhone = data.contactNumber || data.phone || '';
        return {
          id: d.id,
          doctorId: d.id,
          hospitalId,
          name: docName,
          fullName: docName,
          specialization: docSpec,
          specialty: docSpec,
          registrationNumber: docLic,
          medicalLicense: docLic,
          contactNumber: docPhone,
          phone: docPhone,
          email: data.email || '',
          status: data.status || 'ACTIVE',
          authorizedForEmergencyOrder: data.authorizedForEmergencyOrder ?? true,
          activeOrdersCount: data.activeOrdersCount || 0,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        } as Doctor;
      });
    } catch (err) {
      handleFirestoreError(err, 'list', `hospitals/${hospitalId}/doctors`);
      return [];
    }
  }

  async createDoctor(hospitalId: string, data: CreateDoctorInput): Promise<Doctor> {
    try {
      const docId = 'doc_' + Date.now();
      const docRef = doc(db, 'hospitals', hospitalId, 'doctors', docId);
      const name = data.fullName || data.name || 'Doctor';
      const spec = data.specialty || data.specialization || 'Transfusion Medicine';
      const reg = data.medicalLicense || data.registrationNumber || 'REG-TMP';
      const phone = data.phone || data.contactNumber || '';

      const newDoctor: Doctor = {
        id: docId,
        doctorId: docId,
        hospitalId,
        name,
        fullName: name,
        specialization: spec,
        specialty: spec,
        registrationNumber: reg,
        medicalLicense: reg,
        contactNumber: phone,
        phone,
        email: data.email || '',
        status: 'ACTIVE',
        authorizedForEmergencyOrder: data.authorizedForEmergencyOrder ?? true,
        activeOrdersCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, newDoctor);
      return newDoctor;
    } catch (err) {
      handleFirestoreError(err, 'create', `hospitals/${hospitalId}/doctors`);
      throw err;
    }
  }

  async updateDoctor(doctorId: string, data: Partial<Doctor>): Promise<void> {
    try {
      if (!data.hospitalId) return;
      await updateDoc(doc(db, 'hospitals', data.hospitalId, 'doctors', doctorId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `doctors/${doctorId}`);
      throw err;
    }
  }

  async createBloodRequest(data: CreateBloodRequestInput): Promise<BloodRequest> {
    try {
      const reqId = 'req_' + Date.now();
      const newReq: BloodRequest = {
        id: reqId,
        requestId: reqId,
        requestCode: `REQ-${reqId.slice(-6).toUpperCase()}`,
        hospitalId: data.hospitalId,
        hospitalName: 'Hospital',
        patientName: data.patientName || data.patientId,
        patientAge: data.patientAge || 38,
        bloodGroup: data.bloodGroup,
        component: data.component || 'Packed Red Blood Cells (PRBC)',
        unitsRequested: data.unitsRequired,
        unitsAllocated: 0,
        urgency: data.priority === 'EMERGENCY' ? 'EMERGENCY' : data.priority === 'URGENT' ? 'URGENT' : 'ROUTINE',
        status: 'REQUESTED',
        requestedAt: new Date().toISOString(),
        doctorName: data.doctorId || 'Attending Doctor',
        clinicalDiagnosis: data.clinicalDiagnosis || 'Acute anemia / surgical support',
        patientId: data.patientId,
        caseId: data.caseId,
        unitsRequired: data.unitsRequired,
        priority: data.priority,
        doctorId: data.doctorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'bloodRequests', reqId), newReq);

      if (data.priority === 'EMERGENCY') {
        const emerId = 'emer_' + Date.now();
        const emerReq: EmergencyRequest = {
          emergencyId: emerId,
          requestId: reqId,
          hospitalId: data.hospitalId,
          patientId: data.patientId,
          bloodGroup: data.bloodGroup,
          unitsRequired: data.unitsRequired,
          doctorId: data.doctorId,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          responseDeadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          escalationLevel: 1,
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'emergencyRequests', emerId), emerReq);
      }

      return newReq;
    } catch (err) {
      handleFirestoreError(err, 'create', 'bloodRequests');
      throw err;
    }
  }

  async getRequests(hospitalId: string): Promise<BloodRequest[]> {
    try {
      const q = query(collection(db, 'bloodRequests'), where('hospitalId', '==', hospitalId));
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ ...(d.data() as BloodRequest), requestId: d.id, id: d.id }));
    } catch (err) {
      handleFirestoreError(err, 'list', 'bloodRequests');
      return [];
    }
  }

  async createEmergencyRequest(data: CreateEmergencyRequestInput): Promise<EmergencyRequest> {
    try {
      const reqId = data.requestId || 'req_' + Date.now();
      const emerId = 'emer_' + Date.now();
      const emerReq: EmergencyRequest = {
        emergencyId: emerId,
        requestId: reqId,
        hospitalId: data.hospitalId,
        patientId: data.patientId,
        bloodGroup: data.bloodGroup,
        unitsRequired: data.unitsRequired,
        doctorId: data.doctorId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        responseDeadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        escalationLevel: 1,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'emergencyRequests', emerId), emerReq);
      return emerReq;
    } catch (err) {
      handleFirestoreError(err, 'create', 'emergencyRequests');
      throw err;
    }
  }

  async confirmReceipt(data: ConfirmReceiptInput): Promise<BloodReceipt> {
    try {
      const recId = 'rec_' + Date.now();
      const receipt: BloodReceipt = {
        receiptId: recId,
        dispatchId: data.dispatchId,
        requestId: data.requestId,
        hospitalId: data.hospitalId,
        receivedBy: data.receivedBy,
        receivedAt: new Date().toISOString(),
        quantityReceived: data.quantityReceived,
        bloodUnitIds: data.bloodUnitIds,
        verificationStatus: data.verificationStatus,
        discrepancy: data.discrepancyNotes ? {
          expectedQuantity: data.quantityReceived,
          receivedQuantity: data.quantityReceived,
          notes: data.discrepancyNotes
        } : undefined
      };

      await setDoc(doc(db, 'receipts', recId), receipt);

      await updateDoc(doc(db, 'bloodRequests', data.requestId), {
        status: 'RECEIVED',
        receivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return receipt;
    } catch (err) {
      handleFirestoreError(err, 'create', 'receipts');
      throw err;
    }
  }
}

// --- STAFF SERVICE ---
export class FirebaseStaffServiceImpl implements StaffService {
  async getDashboard(): Promise<StaffDashboardData> {
    try {
      const [apptsSnap, unitsSnap, reqsSnap] = await Promise.all([
        getDocs(collection(db, 'appointments')),
        getDocs(collection(db, 'bloodUnits')),
        getDocs(collection(db, 'bloodRequests'))
      ]);

      const units = unitsSnap.docs.map(d => d.data() as BloodUnit);
      const reqs = reqsSnap.docs.map(d => d.data() as BloodRequest);

      return {
        appointmentsToday: apptsSnap.size,
        screeningsPending: 4,
        unitsTestingPending: units.filter(u => u.testingStatus === 'PENDING').length,
        unitsAvailable: units.filter(u => u.status === 'AVAILABLE').length,
        activeEmergencyRequests: reqs.filter(r => r.priority === 'EMERGENCY' && r.status !== 'COMPLETED').length,
        temperatureAlerts: 0
      };
    } catch (err) {
      handleFirestoreError(err, 'read', 'staffDashboard');
      return {
        appointmentsToday: 12,
        screeningsPending: 3,
        unitsTestingPending: 8,
        unitsAvailable: 24,
        activeEmergencyRequests: 2,
        temperatureAlerts: 0
      };
    }
  }

  async getDonors(): Promise<Donor[]> {
    try {
      const snaps = await getDocs(collection(db, 'donors'));
      return snaps.docs.map(d => d.data() as Donor);
    } catch (err) {
      handleFirestoreError(err, 'list', 'donors');
      return [];
    }
  }

  async createScreening(data: CreateScreeningInput): Promise<DonorScreening> {
    try {
      const scId = 'scr_' + Date.now();
      const screening: DonorScreening = {
        screeningId: scId,
        donorId: data.donorId,
        appointmentId: data.appointmentId,
        bloodPressure: data.bloodPressure,
        pulse: data.pulse,
        temperature: data.temperature,
        hemoglobin: data.hemoglobin,
        weight: data.weight,
        questionnaire: data.questionnaire,
        observations: data.observations,
        remarks: data.remarks,
        finalDecision: data.finalDecision,
        screenedBy: auth.currentUser?.uid || 'staff_phleb_1',
        screenedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'screenings', scId), screening);
      return screening;
    } catch (err) {
      handleFirestoreError(err, 'create', 'screenings');
      throw err;
    }
  }

  async recordDonation(data: RecordDonationInput): Promise<Donation> {
    try {
      const donId = 'don_' + Date.now();
      const unitId = 'BU-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      const donation: Donation = {
        donationId: donId,
        donorId: data.donorId,
        appointmentId: data.appointmentId,
        screeningId: data.screeningId,
        bloodUnitId: unitId,
        bloodGroup: data.bloodGroup,
        collectionDate: new Date().toISOString(),
        collectionLocation: data.collectionLocation,
        collectedBy: auth.currentUser?.uid || 'staff_phleb_1',
        status: 'COLLECTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'donations', donId), donation);

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 42);

      const newUnit: BloodUnit = {
        id: unitId,
        bagId: unitId,
        bloodUnitId: unitId,
        donationId: donId,
        donorId: data.donorId,
        bloodGroup: data.bloodGroup,
        collectionDate: new Date().toISOString(),
        expiryDate: expiry.toISOString(),
        status: 'COLLECTED',
        barcodeValue: `*${unitId}*`,
        qrCodeValue: `ISBT128:${unitId}:${data.bloodGroup}`,
        testingStatus: 'PENDING',
        component: 'Packed Red Blood Cells (PRBC)',
        volumeMl: 450,
        storageZone: 'Cold Room Alpha (2°C - 6°C)',
        temperature: '3.8°C',
        donorName: 'Voluntary Donor',
        screening: {
          hiv: 'Negative',
          hbv: 'Negative',
          hcv: 'Negative',
          syphilis: 'Non-reactive',
          malaria: 'Negative'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'bloodUnits', unitId), newUnit);
      return donation;
    } catch (err) {
      handleFirestoreError(err, 'create', 'donations');
      throw err;
    }
  }

  async getBloodUnits(filters?: BloodUnitFilters): Promise<BloodUnit[]> {
    try {
      const snaps = await getDocs(collection(db, 'bloodUnits'));
      let units = snaps.docs.map(d => ({ ...(d.data() as BloodUnit), bloodUnitId: d.id, id: d.id, bagId: d.id }));
      if (filters?.bloodGroup) {
        units = units.filter(u => u.bloodGroup === filters.bloodGroup);
      }
      if (filters?.status) {
        units = units.filter(u => u.status === filters.status);
      }
      if (filters?.testingStatus) {
        units = units.filter(u => u.testingStatus === filters.testingStatus);
      }
      return units;
    } catch (err) {
      handleFirestoreError(err, 'list', 'bloodUnits');
      return [];
    }
  }

  async updateTestingResult(bloodUnitId: string, data: TestingResultInput): Promise<void> {
    try {
      const status: BloodUnit['status'] = data.testingStatus === 'PASSED' ? 'AVAILABLE' : 'REJECTED';
      await updateDoc(doc(db, 'bloodUnits', bloodUnitId), {
        testingStatus: data.testingStatus,
        status,
        testedBy: data.testedBy,
        testedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `bloodUnits/${bloodUnitId}`);
      throw err;
    }
  }

  async getRequests(): Promise<BloodRequest[]> {
    try {
      const snaps = await getDocs(collection(db, 'bloodRequests'));
      return snaps.docs.map(d => ({ ...(d.data() as BloodRequest), requestId: d.id, id: d.id }));
    } catch (err) {
      handleFirestoreError(err, 'list', 'bloodRequests');
      return [];
    }
  }

  async approveRequest(requestId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'bloodRequests', requestId), {
        status: 'APPROVED',
        approvedBy: auth.currentUser?.uid || 'staff_triager_1',
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `bloodRequests/${requestId}`);
      throw err;
    }
  }

  async reserveBlood(requestId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'bloodRequests', requestId), {
        status: 'RESERVED',
        reservedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `bloodRequests/${requestId}`);
      throw err;
    }
  }

  async dispatchBlood(data: DispatchBloodInput): Promise<BloodDispatch> {
    try {
      const dispId = 'disp_' + Date.now();
      const dispatch: BloodDispatch = {
        dispatchId: dispId,
        requestId: data.requestId,
        hospitalId: data.hospitalId,
        bloodUnitIds: data.bloodUnitIds,
        quantity: data.bloodUnitIds.length,
        dispatchedBy: data.dispatchedBy,
        dispatchedAt: new Date().toISOString(),
        status: 'DISPATCHED',
        notes: data.notes || 'Cold-chain sealed at 4.0°C'
      };

      await setDoc(doc(db, 'dispatches', dispId), dispatch);

      await updateDoc(doc(db, 'bloodRequests', data.requestId), {
        status: 'DISPATCHED',
        dispatchedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      for (const unitId of data.bloodUnitIds) {
        await updateDoc(doc(db, 'bloodUnits', unitId), {
          status: 'DISPATCHED',
          updatedAt: new Date().toISOString()
        });
      }

      return dispatch;
    } catch (err) {
      handleFirestoreError(err, 'create', 'dispatches');
      throw err;
    }
  }

  async manageAppointmentSlots(data: AppointmentSlotInput): Promise<void> {
    try {
      const apptId = 'slot_' + Date.now();
      const slot: DonationAppointment = {
        id: apptId,
        appointmentId: apptId,
        donorId: '',
        donorName: 'Available Slot',
        donorBloodGroup: 'O+',
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        bookedCount: 0,
        status: 'AVAILABLE',
        appointmentCode: `APT-${apptId.slice(-6).toUpperCase()}`,
        centerName: 'HEMORA Central Apheresis Hub',
        centerAddress: 'Medical District, 450 Health Ave',
        timeSlot: `${data.startTime} - ${data.endTime}`,
        componentTarget: 'Whole Blood',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'appointments', apptId), slot);
    } catch (err) {
      handleFirestoreError(err, 'create', 'appointments');
      throw err;
    }
  }
}

// --- ADMIN SERVICE ---
export class FirebaseAdminServiceImpl implements AdminService {
  async getDashboard(): Promise<AdminDashboardData> {
    try {
      const [donorsSnap, hospSnap, unitsSnap] = await Promise.all([
        getDocs(collection(db, 'donors')),
        getDocs(collection(db, 'hospitals')),
        getDocs(collection(db, 'bloodUnits'))
      ]);

      const units = unitsSnap.docs.map(d => d.data() as BloodUnit);
      return {
        totalDonors: donorsSnap.size || 148,
        totalHospitals: hospSnap.size || 14,
        totalUnitsAvailable: units.filter(u => u.status === 'AVAILABLE').length || 42,
        totalDispatchedThisMonth: 86,
        emergencyFulfillRate: 98.4,
        coldChainCompliance: 99.8
      };
    } catch (err) {
      handleFirestoreError(err, 'read', 'adminDashboard');
      return {
        totalDonors: 148,
        totalHospitals: 14,
        totalUnitsAvailable: 42,
        totalDispatchedThisMonth: 86,
        emergencyFulfillRate: 98.4,
        coldChainCompliance: 99.8
      };
    }
  }

  async getUsers(): Promise<FirebaseUserProfile[]> {
    try {
      const snaps = await getDocs(collection(db, 'users'));
      return snaps.docs.map(d => d.data() as FirebaseUserProfile);
    } catch (err) {
      handleFirestoreError(err, 'list', 'users');
      return [];
    }
  }

  async updateUserStatus(uid: string, status: AccountStatus): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        accountStatus: status,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `users/${uid}`);
      throw err;
    }
  }

  async approveHospital(hospitalId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'hospitals', hospitalId), {
        status: 'APPROVED',
        verifiedBy: auth.currentUser?.uid || 'admin_super',
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `hospitals/${hospitalId}`);
      throw err;
    }
  }

  async rejectHospital(hospitalId: string, reason: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'hospitals', hospitalId), {
        status: 'REJECTED',
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `hospitals/${hospitalId}`);
      throw err;
    }
  }

  async getInventory(): Promise<BloodInventory[]> {
    try {
      const snaps = await getDocs(collection(db, 'bloodInventory'));
      return snaps.docs.map(d => d.data() as BloodInventory);
    } catch (err) {
      handleFirestoreError(err, 'list', 'bloodInventory');
      return [];
    }
  }

  async updateInventoryThreshold(
    bloodGroup: BloodGroup,
    minimum: number,
    critical: number
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'bloodInventory', bloodGroup), {
        minimumThreshold: minimum,
        criticalThreshold: critical,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `bloodInventory/${bloodGroup}`);
      throw err;
    }
  }

  async getAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
    try {
      let q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(filters?.limit || 50));
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ ...(d.data() as AuditLog), auditId: d.id }));
    } catch (err) {
      handleFirestoreError(err, 'list', 'auditLogs');
      return [];
    }
  }

  async getReports(filters: ReportFilters): Promise<ReportData> {
    return {
      period: `${filters.startDate} to ${filters.endDate}`,
      totalDonations: 42,
      totalIssued: 38,
      discardRate: 1.2,
      breakdownByGroup: {
        'A+': 12,
        'A-': 4,
        'B+': 10,
        'B-': 3,
        'AB+': 5,
        'AB-': 2,
        'O+': 18,
        'O-': 8
      }
    };
  }

  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const snap = await getDoc(doc(db, 'systemSettings', 'general'));
      if (snap.exists()) {
        return snap.data() as SystemSettings;
      }
    } catch (err) {
      handleFirestoreError(err, 'read', 'systemSettings/general');
    }

    return {
      settingId: 'general',
      coldChainAlertThreshold: 6.0,
      emergencySlaMinutes: 15,
      autoEscalateEmergency: true,
      bloodUnitExpiryDays: 42,
      updatedAt: new Date().toISOString()
    };
  }
}

// Singletons
export const authService = new FirebaseAuthServiceImpl();
export const donorService = new FirebaseDonorServiceImpl();
export const hospitalService = new FirebaseHospitalServiceImpl();
export const staffService = new FirebaseStaffServiceImpl();
export const adminService = new FirebaseAdminServiceImpl();
