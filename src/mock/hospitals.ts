import { DoctorStaffItem } from '../types/hemora';

export const INITIAL_MOCK_DOCTORS: DoctorStaffItem[] = [
  {
    id: 'doc-01',
    hospitalId: 'usr-hosp-01',
    fullName: 'Dr. Rebecca Shaw',
    medicalLicense: 'MED-NY-55281',
    specialty: 'Trauma & Critical Care Surgery',
    phone: '+1 (555) 911-4041',
    authorizedForEmergencyOrder: true,
    activeOrdersCount: 2,
  },
  {
    id: 'doc-02',
    hospitalId: 'usr-hosp-01',
    fullName: 'Dr. Kenneth Morales',
    medicalLicense: 'MED-NY-66190',
    specialty: 'Cardiothoracic Surgery',
    phone: '+1 (555) 911-4042',
    authorizedForEmergencyOrder: true,
    activeOrdersCount: 1,
  },
  {
    id: 'doc-03',
    hospitalId: 'usr-hosp-01',
    fullName: 'Dr. David Kim',
    medicalLicense: 'MED-NY-77215',
    specialty: 'Pediatric Anesthesiology',
    phone: '+1 (555) 911-4043',
    authorizedForEmergencyOrder: false,
    activeOrdersCount: 0,
  },
  {
    id: 'doc-04',
    hospitalId: 'usr-hosp-01',
    fullName: 'Dr. Maria Santos',
    medicalLicense: 'MED-NY-88102',
    specialty: 'Obstetrics & High-Risk Perinatology',
    phone: '+1 (555) 911-4044',
    authorizedForEmergencyOrder: true,
    activeOrdersCount: 0,
  }
];

export const MOCK_RECEIVED_BLOOD_HISTORY = [
  {
    id: 'rcv-01',
    requisitionCode: 'HMR-REQ-8890',
    bagId: 'HMR-2026-9013',
    bloodGroup: 'O+',
    component: 'Whole Blood',
    units: 1,
    receivedAt: '2026-11-11 12:45',
    receivedBy: 'Nurse Supervisor Amy Liu, BSN',
    coldChainTempOnArrival: '+4.1°C',
    status: 'Verified & Bedside Infused',
  },
  {
    id: 'rcv-02',
    requisitionCode: 'HMR-REQ-8874',
    bagId: 'HMR-2026-8802',
    bloodGroup: 'A+',
    component: 'Packed Red Blood Cells (PRBC)',
    units: 2,
    receivedAt: '2026-11-09 17:30',
    receivedBy: 'Blood Bank Officer Mark Cole',
    coldChainTempOnArrival: '+3.9°C',
    status: 'Verified & Bedside Infused',
  },
  {
    id: 'rcv-03',
    requisitionCode: 'HMR-REQ-8860',
    bagId: 'HMR-2026-8744',
    bloodGroup: 'B+',
    component: 'Platelet Apheresis',
    units: 1,
    receivedAt: '2026-11-07 14:10',
    receivedBy: 'Oncology Charge Nurse Clara Ross',
    coldChainTempOnArrival: '+22.0°C',
    status: 'Verified & Bedside Infused',
  }
];
