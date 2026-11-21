import React, { createContext, useContext, useEffect, useState } from "react";
import { SEED_USERS } from "@/src/data/seedData";
import {
  clearAllMarketplaceStorage,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from "@/src/services/storage";
import type { AccountStatus, User, UserRole } from "@/src/types";

interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  city?: string;
  businessName?: string;
  vehicleType?: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextValue {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (
    identifier: string,
    password: string,
    rememberMe?: boolean,
    portalRole?: UserRole
  ) => AuthResult;
  quickDemoLogin: (role: UserRole) => AuthResult;
  register: (payload: RegisterPayload) => AuthResult;
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  adminUpdateUserStatus: (userId: string, status: AccountStatus) => void;
  resetDemoPlatform: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/customer";
    case "seller":
      return "/seller";
    case "admin":
      return "/admin";
    case "delivery":
      return "/delivery";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() =>
    readStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS)
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    readStorage<string | null>(STORAGE_KEYS.SESSION, null)
  );

  useEffect(() => {
    writeStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.SESSION, currentUserId);
  }, [currentUserId]);

  const currentUser =
    users.find((u) => u.id === currentUserId) ?? null;

  const login = (
    identifier: string,
    password: string,
    _rememberMe = true,
    portalRole?: UserRole
  ): AuthResult => {
    const cleanId = identifier.trim().toLowerCase();
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.username.toLowerCase() === cleanId
    );

    if (!matched || matched.password !== password) {
      return {
        success: false,
        message: "Invalid username/email or password. Please check your credentials.",
      };
    }

    if (portalRole && matched.role !== portalRole) {
      return {
        success: false,
        message: `This account belongs to the ${matched.role.toUpperCase()} portal. Please switch tabs or sign in under ${matched.role}.`,
      };
    }

    if (matched.status === "suspended") {
      return {
        success: false,
        message: "This account has been suspended by Herbiz Administration.",
      };
    }

    if (matched.status === "rejected") {
      return {
        success: false,
        message: "This seller application was not approved. Please contact Herbiz support.",
      };
    }

    setCurrentUserId(matched.id);
    return { success: true, user: matched };
  };

  const quickDemoLogin = (role: UserRole): AuthResult => {
    const demoUser = users.find(
      (u) => u.role === role && u.status === "active"
    );
    if (!demoUser) {
      return { success: false, message: "Demo account not available." };
    }
    setCurrentUserId(demoUser.id);
    return { success: true, user: demoUser };
  };

  const register = (payload: RegisterPayload): AuthResult => {
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
    );
    if (emailTaken) {
      return { success: false, message: "An account with this email already exists." };
    }

    const usernameTaken = users.some(
      (u) => u.username.toLowerCase() === payload.username.trim().toLowerCase()
    );
    if (usernameTaken) {
      return { success: false, message: "That username is already taken. Try another." };
    }

    const initialStatus: AccountStatus =
      payload.role === "seller" ? "pending" : "active";

    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: payload.username.trim().toLowerCase(),
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      password: payload.password,
      role: payload.role,
      status: initialStatus,
      city: payload.city || "Addis Ababa",
      businessName: payload.businessName?.trim(),
      vehicleType: payload.vehicleType?.trim(),
      joinedAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUserId(null);
    writeStorage(STORAGE_KEYS.SESSION, null);
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const adminUpdateUserStatus = (userId: string, status: AccountStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  const resetDemoPlatform = () => {
    clearAllMarketplaceStorage();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        quickDemoLogin,
        register,
        logout,
        updateCurrentUserProfile,
        adminUpdateUserStatus,
        resetDemoPlatform,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
