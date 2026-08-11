import { useCallback, useState, type ReactNode } from "react";
import { AuthContext, type AdminUser } from "../store/authStore";
import { clearToken, setToken } from "../services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const login = useCallback((token: string, adminUser: AdminUser) => {
    setToken(token);
    setAdmin(adminUser);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAdmin(null);
    window.location.href = "/admin/login";
  }, []);

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
}
