import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import {
  User,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  CalendarCheck,
  Settings as SettingsIcon,
} from "lucide-react";

export function TeacherSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    lessonReminder: true,
    adminMessages: true,
    scheduleChanges: true,
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ── SHARED sections JSX ─────────────────────────────── */
  const notificationsSection = (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <button
        onClick={() =>
          setActiveSection(activeSection === "notifications" ? null : "notifications")
        }
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-left">
            <div className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>
              Powiadomienia
            </div>
            <div className="text-slate-500 text-xs">
              {Object.values(notifications).filter(Boolean).length} aktywne
            </div>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-slate-400 transition-transform ${
            activeSection === "notifications" ? "rotate-90" : ""
          }`}
        />
      </button>

      {activeSection === "notifications" && (
        <div className="border-t border-slate-50 divide-y divide-slate-50">
          {[
            { key: "lessonReminder", label: "Przypomnienie o lekcji", desc: "30 min przed zajęciami" },
            { key: "adminMessages", label: "Wiadomości od admina", desc: "Zmiany w grafiku, awarie" },
            { key: "scheduleChanges", label: "Zmiany w harmonogramie", desc: "Nowe lekcje, anulowania" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-slate-800 text-sm">{label}</div>
                <div className="text-slate-400 text-xs">{desc}</div>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof notifications],
                  }))
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifications[key as keyof typeof notifications] ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    notifications[key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const passwordSection = (
    <div className="bg-white rounded-2xl border border-slate-100">
      <button className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-left">
            <div className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>
              Zmień hasło
            </div>
            <div className="text-slate-500 text-xs">Zaktualizuj hasło dostępu</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );

  /* ── DESKTOP VIEW ────────────────────────────────────── */
  const DesktopView = (
    <div className="p-6 xl:p-8 max-w-3xl">
      <div className="mb-7">
        <h1 className="text-slate-900" style={{ fontSize: "1.625rem", fontWeight: 700 }}>
          Ustawienia
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Zarządzaj swoim kontem i preferencjami</p>
      </div>

      <div className="space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
              style={{ backgroundColor: user?.color || "#6366F1", fontWeight: 700, fontSize: "1.25rem" }}
            >
              {user?.initials}
            </div>
            <div>
              <div className="text-slate-900" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                {user?.name}
              </div>
              <div className="text-slate-500 text-sm">{user?.subject}</div>
              <div className="text-slate-400 text-sm mt-0.5">{user?.email}</div>
            </div>
            <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm transition-colors">
              <User className="w-4 h-4" />
              Edytuj profil
            </button>
          </div>
        </div>

        {/* Availability shortcut */}
        <div
          className="bg-indigo-600 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-indigo-700 transition-colors"
          onClick={() => navigate("/teacher/availability")}
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white" style={{ fontWeight: 700 }}>
              Zarządzaj dostępnością
            </div>
            <div className="text-indigo-200 text-sm mt-0.5">
              Interaktywna macierz godzin tygodniowych
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/70" />
        </div>

        {/* Notifications */}
        {notificationsSection}

        {/* Password */}
        {passwordSection}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-100 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Wyloguj się</span>
        </button>

        <div className="text-center text-slate-300 text-xs pb-2">
          EduPlan v1.0.0 · {user?.email}
        </div>
      </div>
    </div>
  );

  /* ── MOBILE VIEW ─────────────────────────────────────── */
  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 pt-14 pb-8">
        <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Ustawienia
        </h1>

        {/* Profile card */}
        <div className="bg-white/10 rounded-2xl p-5 mt-5 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg shrink-0"
            style={{ backgroundColor: user?.color || "#6366F1", fontWeight: 700 }}
          >
            {user?.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white truncate" style={{ fontWeight: 600 }}>
              {user?.name}
            </div>
            <div className="text-slate-400 text-sm truncate">{user?.subject}</div>
            <div className="text-slate-500 text-xs mt-0.5 truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-4">
        {/* Availability shortcut */}
        <button
          onClick={() => navigate("/teacher/availability")}
          className="w-full flex items-center justify-between bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-5 hover:bg-indigo-100 active:scale-[0.98] transition-all min-h-[72px]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-left">
              <div className="text-indigo-900 text-sm" style={{ fontWeight: 600 }}>
                Moja dostępność
              </div>
              <div className="text-indigo-500 text-xs mt-0.5">Ustaw dostępne godziny</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-indigo-400" />
        </button>

        {/* Notifications */}
        {notificationsSection}

        {/* Password */}
        {passwordSection}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-center gap-2.5 text-red-600 hover:bg-red-100 active:scale-[0.98] transition-all min-h-[56px]"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Wyloguj się</span>
        </button>

        <div className="text-center text-slate-300 text-xs pb-2">
          EduPlan v1.0.0 · {user?.email}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">{MobileView}</div>
      <div className="hidden lg:block">{DesktopView}</div>
    </>
  );
}
