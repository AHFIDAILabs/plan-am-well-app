// services/DoctorServices.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Doctor, Address, Availability } from "../types/DoctorType"; // Assuming types are correctly imported

// NOTE: Please define API_BASE in your environment configuration
const API_BASE = "YOUR_API_BASE_URL"; 

// --- Helper Types for Payload ---

/**
 * Defines the allowed data fields for updating a Doctor's profile.
 * Note: Arrays and objects are stringified before sending.
 */
export type UpdateDoctorProfilePayload = {
  // General User Fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "Male" | "Female" | "Other";
  alias?: string;
  isAnonymous?: boolean;
  address?: Address;

  // Doctor-Specific Fields
  specialization?: string;
  qualifications?: string[] | string;
  experienceYears?: number;
  bio?: string;
  consultationFee?: number;
  availability?: Availability[] | string;
};

// --- Utility Functions for File Upload ---

// Simple utility function to get file extension from a URI
const getFileExtension = (uri: string): string => {
  const match = /\.(\w+)$/.exec(uri);
  return match ? match[1].toLowerCase() : "";
};

// Simple utility function to determine MIME type
const getMimeType = (extension: string, defaultMime?: string): string => {
  if (defaultMime) return defaultMime;
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "heic":
      return "image/heic";
    default:
      return "application/octet-stream";
  }
};

// --- Doctor Service Functions ---

/**
 * Updates the doctor's profile information, including avatar upload.
 * It sends data as FormData to handle the file upload and field updates simultaneously.
 * @param payload - The data fields to update.
 * @param avatarFile - Optional temporary file object from ImagePicker.
 * @returns A promise resolving to the server response containing the updated Doctor object.
 */
export const updateDoctorProfile = async (
  payload: UpdateDoctorProfilePayload,
  avatarFile?: any
): Promise<{ message: string; user: Doctor }> => {
  const formData = new FormData();

  // 1. Append payload fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Stringify nested objects or arrays (like 'address', 'qualifications', 'availability') 
    // to be safely parsed by the server's update controller.
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  // 2. Add avatar file
  if (avatarFile?.uri) {
    const fileExtension = getFileExtension(avatarFile.uri);
    const mimeType = getMimeType(fileExtension, avatarFile.mimeType);
    const fileName = avatarFile.fileName || `doctor_avatar_${Date.now()}.${fileExtension}`;

    formData.append("avatar", {
      // Fix URI scheme for Android
      uri: Platform.OS === "android" ? avatarFile.uri : avatarFile.uri.replace("file://", ""),
      type: mimeType,
      name: fileName,
    } as any);
  }

  // 3. Send the request
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    // Using a dedicated doctor profile update endpoint
    const response = await fetch(`${API_BASE}/api/v1/doctors/profile`, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        // NOTE: Content-Type is intentionally omitted; 
        // fetch auto-generates the correct 'multipart/form-data' header with boundary.
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update doctor profile");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("[DoctorService] Request error:", error);
    throw error;
  }
};
