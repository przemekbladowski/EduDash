import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/schedule", label: "Harmonogram", icon: CalendarDays, end: false },
  { to: "/admin/finance", label: "Finanse & Raporty", icon: BarChart3, end: false },
  { to: "/admin/settings", label: "Ustawienia", icon: Settings, end: false },
];

export function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    else if (user?.role !== "admin") navigate("/teacher");
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col fixed inset-y-0 left-0 z-40 overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className="text-white"
                style={{ fontWeight: 700, fontSize: "1rem" }}
              >
                EduPlan
              </div>
              <div className="text-slate-500 text-xs">Panel Administratora</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
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

        {/* User */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-slate-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs" style={{ fontWeight: 700 }}>
                {user?.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs truncate" style={{ fontWeight: 600 }}>
                {user?.name}
              </div>
              <div className="text-slate-500 text-xs">Administrator</div>
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

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 px-5 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white" style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
              EduPlan
            </div>
            <div className="text-slate-400 text-xs">Administrator</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900 pt-20 overflow-y-auto">
          <nav className="px-5 py-6 space-y-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-4 rounded-xl transition-all min-h-[56px] ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-6 h-6 shrink-0" />
                    <span style={{ fontSize: "0.9375rem", fontWeight: isActive ? 600 : 500 }}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User section in mobile menu */}
          <div className="px-5 py-6 border-t border-slate-800 mt-4">
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                  <span className="text-white" style={{ fontWeight: 700 }}>
                    {user?.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate" style={{ fontWeight: 600 }}>
                    {user?.name}
                  </div>
                  <div className="text-slate-400 text-xs truncate">{user?.email}</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 active:scale-95 transition-all min-h-[56px]"
            >
              <LogOut className="w-5 h-5" />
              <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Wyloguj się</span>
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64 pt-[72px] lg:pt-0 h-screen overflow-hidden flex flex-col">
        <div className="w-full flex-1 max-w-[480px] mx-auto lg:max-w-none overflow-y-auto lg:overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
