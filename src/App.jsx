// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Layout
import { MainLayout } from "@/layouts/MainLayout";

// Pages
import { DashboardPage } from "@/pages/DashboardPage";
import { MembersPage } from "@/pages/MembersPage";
import { FundPage } from "@/pages/FundPage";
import { DutyPage } from "@/pages/DutyPage";
import { UtilitiesPage } from "@/pages/UtilitiesPage";
import { BeerSpinWheelPage } from "@/pages/BeerSpinWheelPage";
import { BeerCounterSetupPage } from "@/pages/BeerCounterSetupPage";
import { BeerPartyPage } from "@/pages/BeerPartyPage";
import { TeamCalendarPage } from "@/pages/TeamCalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tất cả các route này đều dùng chung MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="fund" element={<FundPage />} />
          <Route path="utilities" element={<UtilitiesPage />} /> 
          <Route path="utilities/duty" element={<DutyPage />} />
          <Route path="utilities/team-calendar" element={<TeamCalendarPage />} />
          <Route path="utilities/beer-wheel" element={<BeerSpinWheelPage />} /> 
          <Route path="utilities/beer-counter-setup" element={<BeerCounterSetupPage />} />
          <Route path="utilities/beer-party/:partyId" element={<BeerPartyPage />} /><Route path="utilities/beer-party/:partyId" element={<div />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;