import { BloodGroup, ComponentType } from '../types/bloodBank';

export interface CompatibilityResult {
  isCompatible: boolean;
  priorityScore: number; // 1 = exact match, 2 = compatible alternate
  reason: string;
}

// Red Blood Cells compatibility (Antigen matching: Recipient antibodies must not attack Donor antigens)
export const RBC_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  // Recipient : list of acceptable Donors
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal Donor
};

// Plasma compatibility (Antibody matching: Donor plasma must not attack Recipient red cells)
export const PLASMA_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  // Recipient : list of acceptable Donors
  'A+': ['A+', 'A-', 'AB+', 'AB-'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'B-', 'AB+', 'AB-'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+', 'AB-'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], // O is universal plasma recipient
  'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
};

export function getCompatibleDonorGroups(
  recipientGroup: BloodGroup,
  component: ComponentType = 'Packed Red Blood Cells (PRBC)'
): BloodGroup[] {
  if (component === 'Fresh Frozen Plasma (FFP)' || component === 'Cryoprecipitate') {
    return PLASMA_COMPATIBILITY[recipientGroup] || [recipientGroup];
  }
  return RBC_COMPATIBILITY[recipientGroup] || [recipientGroup];
}

export function checkTransfusionCompatibility(
  donorGroup: BloodGroup,
  recipientGroup: BloodGroup,
  component: ComponentType
): CompatibilityResult {
  const isPlasma = component === 'Fresh Frozen Plasma (FFP)' || component === 'Cryoprecipitate';
  const acceptableDonors = isPlasma 
    ? PLASMA_COMPATIBILITY[recipientGroup] 
    : RBC_COMPATIBILITY[recipientGroup];

  if (donorGroup === recipientGroup) {
    return {
      isCompatible: true,
      priorityScore: 1,
      reason: 'Exact ABO/Rh identical match. Clinically optimal.'
    };
  }

  if (acceptableDonors.includes(donorGroup)) {
    return {
      isCompatible: true,
      priorityScore: 2,
      reason: isPlasma
        ? `Compatible plasma match without anti-recipient isohemagglutinins.`
        : `Compatible alternate donor group. Rh & ABO antigens safe for cross-match.`
    };
  }

  return {
    isCompatible: false,
    priorityScore: 0,
    reason: isPlasma 
      ? 'Incompatible plasma: Risk of acute hemolytic transfusion reaction due to anti-A or anti-B antibodies.'
      : 'Incompatible red cell antigens: High risk of intravascular hemolysis.'
  };
}
