import { createContext, useContext } from "react";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  admin: AdminUser | null;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthContext.Provider");
  return ctx;
}
