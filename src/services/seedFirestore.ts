import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BloodGroup, BloodInventory, Hospital, Doctor, BloodUnit, DonationAppointment, SystemSettings } from '../types/hemora';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. System Settings
    const settingsDoc: SystemSettings = {
      settingId: 'general',
      coldChainAlertThreshold: 6.0,
      emergencySlaMinutes: 15,
      autoEscalateEmergency: true,
      bloodUnitExpiryDays: 42,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'systemSettings', 'general'), settingsDoc);

    // 2. Inventory for all 8 blood groups
    for (const bg of BLOOD_GROUPS) {
      const invRef = doc(db, 'bloodInventory', bg);
      const invDoc: BloodInventory = {
        bloodGroup: bg,
        available: bg === 'O+' ? 18 : bg === 'A+' ? 14 : bg === 'B+' ? 12 : 6,
        reserved: 2,
        issued: 10,
        expired: 0,
        discarded: 0,
        minimumThreshold: 10,
        criticalThreshold: 4,
        updatedAt: new Date().toISOString()
      };
      await setDoc(invRef, invDoc);
    }

    // 3. Verified Reference Hospitals
    const hospitals: Hospital[] = [
      {
        hospitalId: 'hosp_apollo_01',
        uid: 'user_hosp_apollo',
        hospitalName: 'Apollo Specialty Super Hospital',
        registrationNumber: 'REG-TN-2024-8849',
        licenseNumber: 'NABH-BLD-99120',
        hospitalType: 'PRIVATE',
        address: '21 Greams Lane, Thousand Lights',
        city: 'Chennai',
        contactNumber: '+91 44 2829 0200',
        officialEmail: 'emergency.transfusion@apollohospitals.demo',
        contactPerson: 'Dr. S. Ramanathan, MD Transfusion',
        hospitalAdministratorName: 'V. Sundaram',
        status: 'APPROVED',
        verifiedBy: 'karpagaganesh27@gmail.com',
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        hospitalId: 'hosp_govt_general_02',
        uid: 'user_hosp_gh',
        hospitalName: 'Rajiv Gandhi Government General Hospital',
        registrationNumber: 'REG-TN-GOV-1002',
        licenseNumber: 'DHS-TN-00452',
        hospitalType: 'GOVERNMENT',
        address: 'EVR Periyar Salai, Park Town',
        city: 'Chennai',
        contactNumber: '+91 44 2530 5000',
        officialEmail: 'bloodbank.gh@tngov.demo',
        contactPerson: 'Dr. Malini Vasudevan',
        hospitalAdministratorName: 'Director Medical Services',
        status: 'APPROVED',
        verifiedBy: 'karpagaganesh27@gmail.com',
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const hosp of hospitals) {
      await setDoc(doc(db, 'hospitals', hosp.hospitalId), hosp);

      // Add doctors for each hospital
      const docId = `doc_${hosp.hospitalId}_1`;
      const docName = hosp.hospitalId === 'hosp_apollo_01' ? 'Dr. Priya Raghavan' : 'Dr. E. Natarajan';
      const doc1: Doctor = {
        id: docId,
        doctorId: docId,
        hospitalId: hosp.hospitalId,
        name: docName,
        fullName: docName,
        specialization: 'Critical Care & Trauma Surgery',
        specialty: 'Critical Care & Trauma Surgery',
        registrationNumber: 'MCI-88291',
        medicalLicense: 'MCI-88291',
        contactNumber: '+91 98840 12890',
        phone: '+91 98840 12890',
        email: 'doctor.care@hemora.internal',
        authorizedForEmergencyOrder: true,
        activeOrdersCount: 2,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'hospitals', hosp.hospitalId, 'doctors', doc1.doctorId || doc1.id), doc1);
    }

    // 4. Sample Blood Units
    const sampleUnits: BloodUnit[] = [
      {
        id: 'BU-2026-4401',
        bagId: 'BU-2026-4401',
        bloodUnitId: 'BU-2026-4401',
        donationId: 'don_seed_01',
        donorId: 'donor_seed_arun',
        bloodGroup: 'O+',
        component: 'Packed Red Blood Cells (PRBC)',
        volumeMl: 450,
        collectionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 37 * 86400000).toISOString(),
        status: 'AVAILABLE',
        barcodeValue: '*BU-2026-4401*',
        qrCodeValue: 'ISBT128:BU-2026-4401:O+:PRBC',
        testingStatus: 'PASSED',
        testedBy: 'staff_serology_1',
        testedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        approvedBy: 'karpagaganesh27@gmail.com',
        approvedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        storageZone: 'Cold Room Alpha (2°C - 6°C)',
        temperature: '3.6°C',
        donorName: 'Arun Kumar',
        screening: {
          hiv: 'Negative',
          hbv: 'Negative',
          hcv: 'Negative',
          syphilis: 'Non-reactive',
          malaria: 'Negative'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'BU-2026-4402',
        bagId: 'BU-2026-4402',
        bloodUnitId: 'BU-2026-4402',
        donationId: 'don_seed_02',
        donorId: 'donor_seed_kavya',
        bloodGroup: 'A+',
        component: 'Packed Red Blood Cells (PRBC)',
        volumeMl: 450,
        collectionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 39 * 86400000).toISOString(),
        status: 'AVAILABLE',
        barcodeValue: '*BU-2026-4402*',
        qrCodeValue: 'ISBT128:BU-2026-4402:A+:PRBC',
        testingStatus: 'PASSED',
        testedBy: 'staff_serology_1',
        testedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        approvedBy: 'karpagaganesh27@gmail.com',
        approvedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        storageZone: 'Cold Room Alpha (2°C - 6°C)',
        temperature: '3.9°C',
        donorName: 'Kavya Sundaram',
        screening: {
          hiv: 'Negative',
          hbv: 'Negative',
          hcv: 'Negative',
          syphilis: 'Non-reactive',
          malaria: 'Negative'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'BU-2026-4403',
        bagId: 'BU-2026-4403',
        bloodUnitId: 'BU-2026-4403',
        donationId: 'don_seed_03',
        donorId: 'donor_seed_rahul',
        bloodGroup: 'O-',
        component: 'Packed Red Blood Cells (PRBC)',
        volumeMl: 450,
        collectionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 40 * 86400000).toISOString(),
        status: 'AVAILABLE',
        barcodeValue: '*BU-2026-4403*',
        qrCodeValue: 'ISBT128:BU-2026-4403:O-:PRBC',
        testingStatus: 'PASSED',
        testedBy: 'staff_serology_1',
        testedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        approvedBy: 'karpagaganesh27@gmail.com',
        approvedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        storageZone: 'Emergency Reserve Alpha',
        temperature: '3.4°C',
        donorName: 'Rahul Verma',
        screening: {
          hiv: 'Negative',
          hbv: 'Negative',
          hcv: 'Negative',
          syphilis: 'Non-reactive',
          malaria: 'Negative'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const unit of sampleUnits) {
      const uId = unit.bloodUnitId || unit.id;
      await setDoc(doc(db, 'bloodUnits', uId), unit);
    }

    // 5. Open Appointment Slots
    const today = new Date().toISOString().split('T')[0];
    const slots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00'];
    for (let i = 0; i < slots.length; i++) {
      const slotId = `slot_today_${i + 1}`;
      const [startTime, endTime] = slots[i].split(' - ');
      const appt: DonationAppointment = {
        id: slotId,
        appointmentId: slotId,
        donorId: '',
        donorName: 'Available Slot',
        donorBloodGroup: 'O+',
        date: today,
        startTime,
        endTime,
        capacity: 4,
        bookedCount: i === 0 ? 3 : 1,
        status: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appointmentCode: `APT-${today.replace(/-/g, '')}-${i + 1}`,
        centerName: 'HEMORA Transfusion Logistics Center',
        centerAddress: 'Tower 4, Health City Campus, Greams Road',
        timeSlot: slots[i],
        componentTarget: 'Whole Blood'
      };
      await setDoc(doc(db, 'appointments', slotId), appt);
    }

    return { success: true, message: 'Firestore successfully initialized with HEMORA operational inventory and seed data.' };
  } catch (err) {
    console.error('Error seeding Firestore:', err);
    return { success: false, message: (err as Error).message || 'Failed to seed Firestore data.' };
  }
}
