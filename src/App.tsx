// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Toaster } from "sonner"; // Import Toaster
import { LiquidBackground } from "@/components/common/LiquidBackground"; // Import Background

// Trang Public
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";

// Trang Private (yêu cầu login)
import { DashboardPage } from "@/pages/DashboardPage";
import { UsersPage } from "@/pages/UsersPage"; // Đổi tên
import { FundPage } from "@/pages/FundPage";
import { UtilitiesPage } from "@/pages/UtilitiesPage";
import { DutyPage } from "@/pages/DutyPage";
import { TeamCalendarPage } from "@/pages/TeamCalendarPage";
import { MyAccountPage } from "@/pages/MyAccountPage";
import { ThemeEventProvider } from "@/context/ThemeEventContext";
import { ThemeEffectsContainer } from "@/components/theme/ThemeEffectsContainer";
import { ThemeEventPage } from "@/pages/ThemeEventPage";

function App() {
  return (
    <ThemeEventProvider>
      <BrowserRouter>
        {/* Background toàn bộ ứng dụng */}
        <LiquidBackground />

        {/* Theme Effects Overlay */}
        <ThemeEffectsContainer />

        <Routes>
          {/* Route Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Route Private */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="members" element={<UsersPage />} />
              <Route path="fund" element={<FundPage />} />

              <Route path="utilities" element={<UtilitiesPage />} />
              <Route path="utilities/duty" element={<DutyPage />} />
              <Route path="utilities/team-calendar" element={<TeamCalendarPage />} />
              <Route path="utilities/theme-event" element={<ThemeEventPage />} />

              <Route path="account" element={<MyAccountPage />} />
            </Route>
          </Route>

        </Routes>

        <Toaster position="top-center" richColors />
      </BrowserRouter >
    </ThemeEventProvider>
  );
}

export default App;