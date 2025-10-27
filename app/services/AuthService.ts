import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { authRequest } from "../utils/AxiosHelper";
import axiosInstance from "../utils/AxiosHelper";
import { AuthResponse, LoginPayload, RegisterPayload, Tokens } from "../types/AuthType";
import { User, Doctor } from "../types/UserType";

const API_BASE = process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000";

const MIME_TYPE_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

const getFileExtension = (uri: string): string => {
  const cleanUri = uri.split("?")[0];
  const parts = cleanUri.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
};

const getMimeType = (extension: string, fallback?: string): string => {
  return fallback || MIME_TYPE_MAP[extension] || "image/jpeg";
};

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  gender?: "Male" | "Female" | "Other";
  dob?: string;
  bloodGroup?: string;
  isAnonymous?: boolean;
  alias?: string;
  medicalHistory?: { condition: string; since?: string; notes?: string }[];
  allergies?: { name: string; severity?: string }[];
  emergencyContact?: { name: string; phone: string; relationship?: string };
  specialization?: string;
  qualifications?: string[];
  experienceYears?: number;
  bio?: string;
  consultationFee?: number;
  availability?: { day: string; from: string; to: string }[];
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  console.log("[Auth Debug] Login attempt with payload:", payload);
  const data = await authRequest<AuthResponse>({
    url: `${API_BASE}/api/v1/auth/login`,
    method: "POST",
    data: payload,
  });

  if (data.tokens) {
    console.log("[Auth Debug] Storing access token:", data.tokens.accessToken ? "Token present" : "No token");
    await SecureStore.setItemAsync("accessToken", data.tokens.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.tokens.refreshToken);
  } else {
    console.log("[Auth Debug] No tokens in login response");
  }

  return data;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  console.log("[Auth Debug] Register attempt with payload:", payload);
  const data = await authRequest<AuthResponse>({
    url: `${API_BASE}/api/v1/auth/register`,
    method: "POST",
    data: payload,
  });

  if (data.tokens) {
    console.log("[Auth Debug] Storing access token:", data.tokens.accessToken ? "Token present" : "No token");
    await SecureStore.setItemAsync("accessToken", data.tokens.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.tokens.refreshToken);
  } else {
    console.log("[Auth Debug] No tokens in register response");
  }

  return data;
};

export const logout = async (): Promise<void> => {
  console.log("[Auth Debug] Logout attempt");
  await authRequest({
    url: `${API_BASE}/api/v1/auth/logout`,
    method: "POST",
  });
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

export const refreshToken = async (): Promise<Tokens | null> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  console.log("[Auth Debug] Retrieved refresh token:", refreshToken ? "Token present" : "No token");
  if (!refreshToken) return null;

  try {
    const data = await authRequest<Tokens>({
      url: `${API_BASE}/api/v1/auth/refresh`,
      method: "POST",
      data: { token: refreshToken },
    });

    if (data.accessToken) {
      console.log("[Auth Debug] Storing new access token:", data.accessToken ? "Token present" : "No token");
      await SecureStore.setItemAsync("accessToken", data.accessToken);
      if (data.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
      }
      return data;
    }

    console.log("[Auth Debug] Refresh token request returned no access token");
    return null;
  } catch (err) {
    console.error("[Auth Debug] Refresh token error:", err);
    return null;
  }
};

export const getMe = async (): Promise<User | Doctor> => {
  console.log("[Auth Debug] getMe attempt");
  const data = await authRequest<User | Doctor>({
    url: `${API_BASE}/api/v1/auth/me`,
    method: "GET",
  });
  return data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
  avatarFile?: any
): Promise<{ message: string; user: User | Doctor }> => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "object" && !Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (avatarFile?.uri) {
    const fileExtension = getFileExtension(avatarFile.uri);
    const mimeType = getMimeType(fileExtension, avatarFile.mimeType);
    const fileName = avatarFile.fileName || `avatar_${Date.now()}.${fileExtension}`;

    console.log("[Avatar Debug] Appending avatar to FormData:", {
      uri: avatarFile.uri,
      type: mimeType,
      name: fileName,
    });

    formData.append("avatar", {
      uri: Platform.OS === "android" ? avatarFile.uri : avatarFile.uri.replace("file://", ""),
      type: mimeType,
      name: fileName,
    } as any);
  }

  try {
    console.log("[Update Profile] Sending payload:", payload);
    console.log("[Avatar Debug] Avatar being sent:", avatarFile || "No avatar");
    const response = await axiosInstance.put(`${API_BASE}/api/v1/auth/update`, formData, 
    {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data, // 💡 prevent axios from messing with FormData
  });

    console.log("[Avatar Debug] Response status:", response.status);
    console.log("[Avatar Debug] Response data:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("[Avatar Debug] Request error:", error.message);
    if (error.response) {
      console.error("[Avatar Debug] Server error response:", error.response.data);
    }
    throw error;
  }
};