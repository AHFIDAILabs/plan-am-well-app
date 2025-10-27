import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin, register as apiRegister, logout as logoutApi, refreshToken as refreshTokenFn, getMe } from "../services/AuthService";
import { User, Doctor } from "../types/UserType";
import { AuthResponse, LoginPayload, RegisterPayload, Tokens } from "../types/AuthType";
import { signInWithGoogle, SocialAuthResponse } from "../services/GoogleAuthService"; // your file with Google Sign-In logic


type AuthContextType = {
  user: User | Doctor | null;
  setUser: React.Dispatch<React.SetStateAction<User | Doctor | null>>;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<Tokens | null>;
  signInWithGoogle: (role?: "user" | "doctor") => Promise<User | Doctor | null>;
  setAuthTokens: (accessToken: string, refreshToken: string) => Promise<void>; // << add here
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | Doctor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const clearAuth = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
    } catch (err) {
      console.warn("SecureStore clear error:", err);
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  useEffect(() => {
    if (user) {
      SecureStore.setItemAsync("user", JSON.stringify(user)).catch((err) =>
        console.warn("Failed to persist user:", err)
      );
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const loadAuth = async () => {
      try {
        const storedAccess = await SecureStore.getItemAsync("accessToken");
        const storedRefresh = await SecureStore.getItemAsync("refreshToken");
        const storedUser = await SecureStore.getItemAsync("user");

        console.log("[Auth Debug] Stored access token:", storedAccess ? "Token present" : "No token");
        console.log("[Auth Debug] Stored refresh token:", storedRefresh ? "Token present" : "No token");

        if (!mounted) return;

        if (storedAccess) setAccessToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);
        if (storedUser) setUser(JSON.parse(storedUser));

        if (storedAccess) {
          try {
            const profile = await getMe();
            if (mounted) setUser(profile);
          } catch (err) {
            console.warn("Profile fetch failed, attempting refresh:", err);
            const tokens = await refreshTokenFn();
            if (tokens && mounted) {
              console.log("[Auth Debug] Refreshed access token:", tokens.accessToken ? "Token present" : "No token");
              setAccessToken(tokens.accessToken);
              if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
              try {
                const profile = await getMe();
                if (mounted) setUser(profile);
              } catch (e) {
                console.warn("Profile fetch after refresh failed:", e);
                await clearAuth();
              }
            } else {
              console.warn("[Auth Debug] Refresh token failed, clearing auth");
              await clearAuth();
            }
          }
        }
      } catch (err) {
        console.warn("Error restoring auth:", err);
        await clearAuth();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAuth();
    return () => {
      mounted = false;
    };
  }, [clearAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const payload: LoginPayload = { email, password };
      const res: AuthResponse = await apiLogin(payload);

      console.log("[Auth Debug] Login response tokens:", res.tokens ? "Tokens received" : "No tokens");

      if (res.tokens) {
        setAccessToken(res.tokens.accessToken);
        setRefreshToken(res.tokens.refreshToken);
        await SecureStore.setItemAsync("accessToken", res.tokens.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.tokens.refreshToken);
      }
      if (res.user) {
        setUser(res.user);
        await SecureStore.setItemAsync("user", JSON.stringify(res.user));
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const res: AuthResponse = await apiRegister(payload);

      console.log("[Auth Debug] Register response tokens:", res.tokens ? "Tokens received" : "No tokens");

      if (res.tokens) {
        setAccessToken(res.tokens.accessToken);
        setRefreshToken(res.tokens.refreshToken);
        await SecureStore.setItemAsync("accessToken", res.tokens.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.tokens.refreshToken);
      }
      if (res.user) {
        setUser(res.user);
        await SecureStore.setItemAsync("user", JSON.stringify(res.user));
      }
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogleAuth = useCallback(
  async (role: "user" | "doctor" = "user") => {
    setLoading(true);
    try {
      const res: SocialAuthResponse | null = await signInWithGoogle(role);

      if (!res) {
        console.warn("Google Sign-In canceled or failed.");
        return null;
      }

      // Save tokens
      if (res.tokens) {
        setAccessToken(res.tokens.accessToken);
        setRefreshToken(res.tokens.refreshToken);
        await SecureStore.setItemAsync("accessToken", res.tokens.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.tokens.refreshToken);
      }

      // Save user
      if (res.user) {
        setUser(res.user);
        await SecureStore.setItemAsync("user", JSON.stringify(res.user));
      }

      console.log("Google Sign-In successful!");
      return res.user;
    } catch (err) {
      console.error("Google Sign-In Auth failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  []
);


const setAuthTokens = useCallback(
  async (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  },
  []
);


  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout service failed, clearing local auth:", err);
    } finally {
      await clearAuth();
      setLoading(false);
    }
  }, [clearAuth]);

  const refreshSession = useCallback(async (): Promise<Tokens | null> => {
    setLoading(true);
    try {
      const tokens = await refreshTokenFn();

      console.log("[Auth Debug] Refresh session tokens:", tokens ? "Tokens received" : "No tokens");

      if (tokens) {
        setAccessToken(tokens.accessToken);
        if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
        await SecureStore.setItemAsync("accessToken", tokens.accessToken);
        if (tokens.refreshToken) await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
        try {
          const profile = await getMe();
          setUser(profile);
          await SecureStore.setItemAsync("user", JSON.stringify(profile));
        } catch (e) {
          console.warn("Profile fetch after refresh failed:", e);
          await clearAuth();
          return null;
        }
        return tokens;
      }

      console.warn("No valid tokens returned, clearing session.");
      await clearAuth();
      return null;
    } catch (err: any) {
      console.warn("refreshSession failed:", err?.message || err);
      await clearAuth();
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        refreshToken,
        loading,
        login,
        register,
        logout,
        refreshSession,
         signInWithGoogle: signInWithGoogleAuth,
    setAuthTokens, // << add here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};