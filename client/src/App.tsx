import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { RequireAdmin } from "./components/RequireAdmin";

import { Wizard } from "./pages/public/Wizard";
import { Success } from "./pages/public/Success";
import { Login } from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { CandidateList } from "./pages/admin/CandidateList";
import { CandidateProfile } from "./pages/admin/CandidateProfile";
import { JobsAdmin } from "./pages/admin/JobsAdmin";
import { StoresAdmin } from "./pages/admin/StoresAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Wizard />} />
          <Route path="/cadastro/sucesso" element={<Success />} />

          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/candidatos"
            element={
              <RequireAdmin>
                <CandidateList />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/candidatos/:id"
            element={
              <RequireAdmin>
                <CandidateProfile />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/vagas"
            element={
              <RequireAdmin>
                <JobsAdmin />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/lojas"
            element={
              <RequireAdmin>
                <StoresAdmin />
              </RequireAdmin>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
