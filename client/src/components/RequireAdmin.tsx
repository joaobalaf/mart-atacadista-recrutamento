import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { api, ApiError, getToken } from "../services/api";
import type { AdminUser } from "../store/authStore";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, login } = useAuth();
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(!!admin);

  useEffect(() => {
    if (admin) {
      setChecked(true);
      setValid(true);
      return;
    }
    const token = getToken();
    if (!token) {
      setChecked(true);
      setValid(false);
      return;
    }
    api
      .get<{ admin: { sub: string; email: string; name: string } }>("/auth/me", true)
      .then((res) => {
        const adminUser: AdminUser = { id: res.admin.sub, email: res.admin.email, name: res.admin.name };
        login(token, adminUser);
        setValid(true);
      })
      .catch((err) => {
        if (err instanceof ApiError) setValid(false);
      })
      .finally(() => setChecked(true));
  }, [admin, login]);

  if (!checked) return null;
  if (!valid) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
