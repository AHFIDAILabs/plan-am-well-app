// Definition for standard address fields
export type Address = {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
};

// Definition for medical history records
export type MedicalHistory = {
  condition: string;
  since?: string; // Date as ISO string
  notes?: string;
};

// Definition for allergy records
export type Allergy = {
  name: string;
  severity?: string;
};

// Definition for emergency contact information
export type EmergencyContact = {
  name: string;
  phone: string;
  relationship?: string;
};

// Definition for user avatar/profile picture
export type Avatar = {
  url?: string;
  public_id?: string;
};

// --- Doctor-Specific Nested Types ---

// Definition for a doctor's scheduled availability
export type Availability = {
  day: string;
  from: string;
  to: string;
};

// Definition for user ratings/reviews
export type Rating = {
  user: string; // Refers to User ObjectId
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
};

// --- Base User Type ---

// The primary User interface for all roles (Patient, Doctor, Admin)
export type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string; // ISO date string
  address?: Address;
  bloodGroup?: string;
  avatar?: Avatar;
  role?: "User" | "Doctor" | "Admin" | string;
  isAnonymous?: boolean;
  alias?: string;
  isActive?: boolean;
  isVerified?: boolean;
  deactivatedAt?: string | null;
  medicalHistory?: MedicalHistory[];
  allergies?: Allergy[];
  emergencyContact?: EmergencyContact;
  posts?: string[]; // array of Post IDs
  createdAt?: string;
  updatedAt?: string;
};

// --- Doctor Role Type ---

/**
 * Defines the structure for a user with the 'Doctor' role,
 * making doctor-specific Mongoose schema fields required.
 */
export type Doctor = User & {
  role?: "Doctor";
  
  // Fields required by the Mongoose schema for a Doctor
  specialization?: string;
  qualifications?: string[];
  experienceYears?: number;
  consultationFee?: number;
  
  // Optional Doctor-specific fields
  bio?: string;
  availability?: Availability[];
  ratings?: Rating[];
  
  // Mongoose Virtual Field
  displayName?: string;
};
