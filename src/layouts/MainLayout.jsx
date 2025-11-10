// src/layouts/MainLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { Users, DollarSign, LayoutDashboard, AppWindow } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

// Danh sách các link nav
const navItems = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/members", label: "Thành viên", icon: Users },
  { to: "/fund", label: "Sổ quỹ", icon: DollarSign },
  // { to: "/duty", label: "Xoay tua", icon: ClipboardList },
  { to: "/utilities", label: "Tiện ích", icon: AppWindow },
];

export function MainLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen bg-background">
        
        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="hidden md:flex flex-col w-64 border-r">
          <div className="h-16 flex items-center justify-center border-b">
            <h1 className="text-2xl font-bold text-blue-600">🚀 TeamHub</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <DesktopNavLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
            ))}
          </nav>
        </aside>

        {/* --- Wrapper cho MAIN CONTENT + BOTTOM NAV --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          <header className="h-16 flex md:hidden items-center p-4 border-b">
             <h1 className="text-2xl font-bold text-blue-600">🚀TeamHub</h1>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </main>

          {/* --- BOTTOM NAV (Mobile) --- */}
          <footer className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t">
            {/* Đảm bảo nav chiếm toàn bộ chiều rộng */}
            <nav className="flex justify-around items-center h-16 w-full">
              {navItems.map((item) => (
                <MobileNavLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
              ))}
            </nav>
          </footer>
        </div>

      </div>
    </TooltipProvider>
  );
}

// Component con cho link Desktop (Không đổi)
const DesktopNavLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors
       ${isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`
    }
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

// --- 🚀 COMPONENT MOBILENAVLINK ĐÃ NÂNG CẤP ---
const MobileNavLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex flex-col items-center justify-center h-full w-full p-2 
       transition-colors
       ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"}
      `
    }
  >
    {({ isActive }) => (
      <>
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{label}</span>
        
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator" 
            className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
);