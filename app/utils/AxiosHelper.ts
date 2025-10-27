import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if exists
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle refresh token flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        // Call refresh endpoint
        const res: AxiosResponse<{ tokens: { accessToken: string; refreshToken?: string } }> =
          await axios.post(`${API_URL}/api/v1/auth/refresh`, { token: refreshToken });

        const newAccessToken = res.data?.tokens?.accessToken;
        const newRefreshToken = res.data?.tokens?.refreshToken;

        if (!newAccessToken) throw new Error("No access token in refresh response");

        // Persist tokens
        await SecureStore.setItemAsync("accessToken", newAccessToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        }

        // Retry the original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

// Generalized request wrapper
export const authRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance(config);
  return response.data;
};

export default axiosInstance;