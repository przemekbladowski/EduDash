import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  Settings,
  CalendarCheck,
  BookOpen,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/teacher/schedule", label: "Grafik", icon: Calendar, end: false },
  { to: "/teacher/finance", label: "Finanse", icon: Wallet, end: false },
  { to: "/teacher/availability", label: "Dostępność", icon: CalendarCheck, end: false },
  { to: "/teacher/settings", label: "Ustawienia", icon: Settings, end: false },
];

const tabBarItems = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/teacher/schedule", label: "Grafik", icon: Calendar, end: false },
  { to: "/teacher/finance", label: "Finanse", icon: Wallet, end: false },
  { to: "/teacher/availability", label: "Dostępność", icon: CalendarCheck, end: false },
  { to: "/teacher/settings", label: "Ustawienia", icon: Settings, end: false },
];

export function TeacherLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    else if (user?.role !== "teacher") navigate("/admin");
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-slate-50 overflow-hidden">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex w-60 bg-slate-900 flex-col fixed inset-y-0 left-0 z-40 overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>
                EduPlan
              </div>
              <div className="text-slate-500 text-xs">Panel Nauczyciela</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm" style={{ fontWeight: isActive ? 600 : 400 }}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: user?.color || "#6366F1", fontWeight: 700, fontSize: "0.75rem" }}
            >
              {user?.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs truncate" style={{ fontWeight: 600 }}>
                {user?.name}
              </div>
              <div className="text-slate-500 text-xs">{user?.subject}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Wyloguj
          </button>
        </div>
      </aside>

      {/* ── Content area ────────────────────────────────── */}
      <div className="lg:ml-60 h-screen overflow-hidden flex flex-col">
        {/* Mobile: max 480px centred + bottom padding for tab bar */}
        {/* Desktop: fill container with no overflow */}
        <div className="max-w-[480px] mx-auto lg:max-w-none pb-20 lg:pb-0 w-full flex-1 overflow-y-auto lg:overflow-hidden">
          <Outlet />
        </div>
      </div>

      {/* ── Mobile Bottom Tab Bar ───────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t border-slate-200 flex items-center z-50 shadow-lg"
        style={{
          width: "min(480px, 100vw)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {tabBarItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors min-h-[56px] ${
                isActive ? "text-indigo-600" : "text-slate-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? "bg-indigo-50" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span style={{ fontSize: "0.65rem", fontWeight: isActive ? 600 : 500 }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
