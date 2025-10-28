import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType, AuthUser } from "@/types/api";
import { authService } from "@/services/ezyerpService";
import { apiClient } from "@/services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, officecode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("AuthContext: Starting login attempt...");
      const response = await authService.login({
        username,
        password,
        officecode,
      });

      console.log("AuthContext: Login response received:", response);

      // Check if response indicates success (flag: true)
      if (response.flag && response.employee) {
        console.log("AuthContext: Login successful, setting user data...");
        const userData: AuthUser = {
          userid: response.employee.empid || "",
          username: response.employee.empname || "",
          officeid: response.employee.officeid || "",
          officecode: officecode || response.employee.officecode || "",
          employee_name: response.employee.employee_name || response.employee.empname || "",
          officename: response.employee.officename || "",
          location: response.employee.location || "",
          token: response.employee.token,
          sessionid: response.employee.sessionid,
        };

        console.log("AuthContext: User data to store:", userData);
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));

        // Store token if provided
        if (response.employee.token) {
          localStorage.setItem("auth_token", response.employee.token);
          // Also set token in API client for subsequent requests
          apiClient.setToken(response.employee.token);
        }
      } else {
        // Response indicates failure
        const errorMessage = response.msg || response.error || "Login failed";
        console.warn("AuthContext: Login failed with message:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
      console.error("AuthContext: Login error:", errorMessage, err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

