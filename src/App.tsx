import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicOnlyRoute } from "@/components/layout/PublicOnlyRoute";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/Auth/LoginPage";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { GenerateLeadsPage } from "@/pages/Leads/GenerateLeadsPage";
import { SavedLeadsPage } from "@/pages/Leads/SavedLeadsPage";
import { RemovedLeadsPage } from "@/pages/Leads/RemovedLeadsPage";
import { TodosPage } from "@/pages/Todos/TodosPage";
import { CalendarPage } from "@/pages/Calendar/CalendarPage";
import { ProfilePage } from "@/pages/Profile/ProfilePage";
import { useAuthStore } from "@/store/authStore";

const App = () => {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leads/generate" element={<GenerateLeadsPage />} />
          <Route path="/leads/saved" element={<SavedLeadsPage />} />
          <Route path="/leads/removed" element={<RemovedLeadsPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
