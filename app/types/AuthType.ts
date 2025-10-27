// types/AuthType.ts
import { User, Doctor } from "./UserType";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  message: string;
  user: User | Doctor;
  tokens: Tokens;
};

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  role?: "User" | "Doctor" | "Admin";
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string | Date;
  bloodGroup?: string;
  isAnonymous?: boolean;
  alias?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  medicalHistory?: { condition: string; since?: string | Date; notes?: string }[];
  allergies?: { name: string; severity?: string }[];
  emergencyContact?: { name: string; phone: string; relationship?: string };
  avatar?: { url?: string; public_id?: string };
  specialization?: string;
  qualifications?: string[];
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
  availability?: { day: string; from: string; to: string }[];
};

export type LoginPayload = {
  email: string;
  password: string;
};