import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to access user session data
 * Provides convenient access to user information and session management
 */
export const useUserSession = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return {
    user,
    isAuthenticated,
    officeid: user?.officeid || "",
    officecode: user?.officecode || "",
    userid: user?.userid || "",
    username: user?.username || "",
    logout,
  };
};

