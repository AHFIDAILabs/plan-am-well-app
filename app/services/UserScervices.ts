import { authRequest } from "../utils/AxiosHelper"; // adjust path if needed
import { User } from "../types/UserType";
import { AuthResponse } from "../types/AuthType";
import { Platform } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE = process.env.EXPO_PUBLIC_SERVER_URL;

/* -------------------------------------------
   🧠 Types
------------------------------------------- */
export type UpdateProfilePayload = Partial<
  Omit<
    User,
    | "_id"
    | "password"
    | "confirmPassword"
    | "createdAt"
    | "updatedAt"
    | "__v"
  >
>;

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





/* -------------------------------------------
   👥 Get all users (Admin only)
------------------------------------------- */
export const getAllUsers = async (): Promise<User[]> => {
  return await authRequest<User[]>({
    method: "GET",
    url: `${API_BASE}/api/v1/users`,
  });
};

/* -------------------------------------------
   🔍 Get a single user by ID
------------------------------------------- */
export const getUserById = async (id: string): Promise<User> => {
  return await authRequest<User>({
    method: "GET",
    url: `${API_BASE}/api/v1/users/${id}`,
  });
};


/* -------------------------------------------
   🕶️ Toggle anonymous mode
------------------------------------------- */
export const toggleAnonymous = async (): Promise<{
  message: string;
  isAnonymous: boolean;
}> => {
  return await authRequest({
    method: "PATCH",
    url: `${API_BASE}/api/v1/users/anonymous`,
  });
};

/* -------------------------------------------
   💤 Deactivate account
------------------------------------------- */
export const deactivateAccount = async (): Promise<{
  message: string;
  isActive: boolean;
}> => {
  return await authRequest({
    method: "PATCH",
    url: `${API_BASE}/api/v1/users/deactivate`,
  });
};

/* -------------------------------------------
   🔄 Reactivate account
------------------------------------------- */
export const reactivateAccount = async (): Promise<{
  message: string;
  isActive: boolean;
}> => {
  return await authRequest({
    method: "PATCH",
    url: `${API_BASE}/api/v1/users/reactivate`,
  });
};

/* -------------------------------------------
   🗑️ Permanently delete account
------------------------------------------- */
export const deleteAccount = async (): Promise<{ message: string }> => {
  return await authRequest({
    method: "DELETE",
    url: `${API_BASE}/api/v1/users/delete`,
  });
};
