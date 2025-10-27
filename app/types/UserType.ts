export type Address = {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
};

export type MedicalHistory = {
  condition: string;
  since?: string; // Date as ISO string
  notes?: string;
};

export type Allergy = {
  name: string;
  severity?: string;
};

export type EmergencyContact = {
  name: string;
  phone: string;
  relationship?: string;
};

export type Avatar = {
  url?: string;
  public_id?: string;
};

export type Availability = {
  day: string;
  from: string;
  to: string;
};

export type Rating = {
  user: string; // Refers to User ObjectId
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
};

export type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string; // ISO date string
  address?: Address;
  bloodGroup?: string;
  avatar?: Avatar;
  role: "User" | "Doctor" | "Admin" | string;
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

export type Doctor = User & {
  role: "Doctor";
  specialization: string;
  qualifications: string[];
  experienceYears: number;
  consultationFee: number;
  bio?: string;
  availability?: Availability[];
  ratings?: Rating[];
  displayName?: string;
};