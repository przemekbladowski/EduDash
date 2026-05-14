import { useState } from "react";
import {
  Users,
  Building2,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Settings as SettingsIcon,
  Bell,
  ChevronRight,
} from "lucide-react";
import { teachers as initialTeachers, rooms } from "../../data/mockData";
import type { Teacher } from "../../data/mockData";

export function AdminSettings() {
  const [teacherList, setTeacherList] = useState<Teacher[]>(initialTeachers);
  const [editingTeacher, setEditingTeacher] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Teacher>>({});
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    subject: "",
    email: "",
    hourlyRate: 75,
    color: "#6366F1",
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"teachers" | "rooms" | "system">(
    "teachers"
  );
  const [notifications, setNotifications] = useState({
    conflictAlerts: true,
    dailySummary: true,
    weeklyReport: false,
    issueReports: true,
  });

  const startEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher.id);
    setEditForm({ ...teacher });
  };

  const cancelEdit = () => {
    setEditingTeacher(null);
    setEditForm({});
  };

  const saveEdit = () => {
    setTeacherList((prev) =>
      prev.map((t) =>
        t.id === editingTeacher ? { ...t, ...editForm } : t
      )
    );
    setEditingTeacher(null);
    setEditForm({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteTeacher = (id: number) => {
    if (confirm("Czy na pewno chcesz usunąć tego nauczyciela?")) {
      setTeacherList((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const addTeacher = () => {
    if (!addForm.name || !addForm.email || !addForm.subject) return;
    const initials = addForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newTeacher: Teacher = {
      id: Math.max(...teacherList.map((t) => t.id)) + 1,
      ...addForm,
      initials,
    };
    setTeacherList((prev) => [...prev, newTeacher]);
    setShowAddTeacher(false);
    setAddForm({ name: "", subject: "", email: "", hourlyRate: 75, color: "#6366F1" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const COLORS = [
    "#6366F1", "#059669", "#DC2626", "#D97706",
    "#7C3AED", "#0EA5E9", "#EC4899", "#14B8A6",
  ];

  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white px-5 pt-14 pb-7">
        <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Ustawienia
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Zarządzaj nauczycielami, salami i systemem
        </p>

        {saved && (
          <div className="flex items-center gap-2 bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-2 rounded-xl text-sm mt-4">
            <CheckCircle2 className="w-4 h-4" />
            Zapisano
          </div>
        )}

        <div className="flex gap-1 bg-white/10 rounded-xl p-1 mt-5">
          {[
            { key: "teachers", label: "Nauczyciele", icon: Users },
            { key: "rooms", label: "Sale", icon: Building2 },
            { key: "system", label: "System", icon: SettingsIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs transition-all ${
                activeTab === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400"
              }`}
              style={{ fontWeight: activeTab === key ? 600 : 500 }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {activeTab === "teachers" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>
                Nauczyciele ({teacherList.length})
              </h2>
              <button
                onClick={() => setShowAddTeacher(!showAddTeacher)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs hover:bg-indigo-700 transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-3.5 h-3.5" />
                Dodaj
              </button>
            </div>

            {showAddTeacher && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-4">
                <h3 className="text-indigo-900 mb-3 text-sm" style={{ fontWeight: 600 }}>
                  Nowy nauczyciel
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">Imię i nazwisko</label>
                    <input
                      type="text"
                      placeholder="Jan Kowalski"
                      value={addForm.name}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">Przedmiot</label>
                    <input
                      type="text"
                      placeholder="np. Matematyka"
                      value={addForm.subject}
                      onChange={(e) => setAddForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">E-mail</label>
                    <input
                      type="email"
                      placeholder="jan@szkola.pl"
                      value={addForm.email}
                      onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">Stawka (zł/h)</label>
                    <input
                      type="number"
                      min={40}
                      max={200}
                      value={addForm.hourlyRate}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, hourlyRate: parseInt(e.target.value) }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-2">Kolor</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAddForm((f) => ({ ...f, color: c }))}
                          className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                            addForm.color === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : ""
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={addTeacher}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setShowAddTeacher(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {teacherList.map((teacher) => {
                const isEditing = editingTeacher === teacher.id;
                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3"
                  >
                    {isEditing ? (
                      <div>
                        <div className="space-y-2 mb-3">
                          <div>
                            <label className="block text-slate-600 text-xs mb-1">Imię i nazwisko</label>
                            <input
                              type="text"
                              value={editForm.name || ""}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, name: e.target.value }))
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-600 text-xs mb-1">Przedmiot</label>
                              <input
                                type="text"
                                value={editForm.subject || ""}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, subject: e.target.value }))
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 text-xs mb-1">Stawka</label>
                              <input
                                type="number"
                                value={editForm.hourlyRate || 75}
                                onChange={(e) =>
                                  setEditForm((f) => ({
                                    ...f,
                                    hourlyRate: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-700 transition-colors"
                          >
                            <Save className="w-3 h-3" />
                            Zapisz
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Anuluj
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: teacher.color, fontWeight: 700, fontSize: "0.7rem" }}
                        >
                          {teacher.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>
                            {teacher.name}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {teacher.subject} · {teacher.hourlyRate} zł/h
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startEdit(teacher)}
                            className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-slate-500"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteTeacher(teacher.id)}
                            className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors text-slate-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div>
            <h2 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>
              Sale ({rooms.length})
            </h2>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: room.bg, border: `2px solid ${room.border}` }}
                    >
                      <Building2
                        className="w-4 h-4"
                        style={{ color: room.dot }}
                      />
                    </div>
                    <div>
                      <div className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>
                        {room.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: room.dot }}
                        />
                        <span className="text-slate-500 text-xs">Aktywna</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <div className="text-slate-900 font-medium">10</div>
                      <div className="text-slate-500 text-xs">Miejsc</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <div className="text-slate-900 font-medium">Parter</div>
                      <div className="text-slate-500 text-xs">Piętro</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>
                    Powiadomienia administratora
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  {
                    key: "conflictAlerts",
                    label: "Alerty konfliktów",
                    desc: "Natychmiastowe powiadomienie",
                  },
                  {
                    key: "dailySummary",
                    label: "Codzienny raport",
                    desc: "Podsumowanie dnia o 20:00",
                  },
                  {
                    key: "weeklyReport",
                    label: "Tygodniowy raport",
                    desc: "Zestawienie godzin",
                  },
                  {
                    key: "issueReports",
                    label: "Zgłoszenia awarii",
                    desc: "Powiadomienia od nauczycieli",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-3"
                  >
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
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        notifications[key as keyof typeof notifications]
                          ? "bg-indigo-600"
                          : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                          notifications[key as keyof typeof notifications]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <SettingsIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>
                  Parametry systemu
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-700 text-sm">Domyślna stawka</div>
                    <div className="text-slate-400 text-xs">Dla nowych nauczycieli</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      defaultValue={75}
                      className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-right outline-none"
                    />
                    <span className="text-slate-500 text-xs">zł/h</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div>
                    <div className="text-slate-700 text-sm">Czas lekcji</div>
                    <div className="text-slate-400 text-xs">Domyślny</div>
                  </div>
                  <select defaultValue="60" className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none">
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
                className="w-full mt-3 bg-indigo-600 text-white rounded-xl py-2 text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Save className="w-3.5 h-3.5" />
                Zapisz ustawienia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DesktopView = (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Ustawienia
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Zarządzaj nauczycielami, salami i systemem
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zapisano
          </div>
        )}
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-3 flex-shrink-0">
        {[
          { key: "teachers", label: "Nauczyciele", icon: Users },
          { key: "rooms", label: "Sale", icon: Building2 },
          { key: "system", label: "System", icon: SettingsIcon },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            style={{ fontWeight: activeTab === key ? 600 : 400 }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "teachers" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>
                Nauczyciele ({teacherList.length})
              </h2>
              <button
                onClick={() => setShowAddTeacher(!showAddTeacher)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs hover:bg-indigo-700 transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-3.5 h-3.5" />
                Dodaj
              </button>
            </div>

            {showAddTeacher && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-3">
                <h3 className="text-indigo-900 mb-3 text-sm" style={{ fontWeight: 600 }}>
                  Nowy nauczyciel
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">Imię i nazwisko</label>
                    <input
                      type="text"
                      placeholder="Jan Kowalski"
                      value={addForm.name}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">Przedmiot</label>
                    <input
                      type="text"
                      placeholder="np. Matematyka"
                      value={addForm.subject}
                      onChange={(e) => setAddForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">E-mail</label>
                    <input
                      type="email"
                      placeholder="jan@szkola.pl"
                      value={addForm.email}
                      onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs mb-1">Stawka (zł/h)</label>
                    <input
                      type="number"
                      min={40}
                      max={200}
                      value={addForm.hourlyRate}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, hourlyRate: parseInt(e.target.value) }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-slate-700 text-xs mb-1">Kolor</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setAddForm((f) => ({ ...f, color: c }))}
                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                          addForm.color === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={addTeacher}
                    className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs hover:bg-indigo-700 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Zapisz nauczyciela
                  </button>
                  <button
                    onClick={() => setShowAddTeacher(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs hover:bg-slate-50 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {teacherList.map((teacher) => {
                const isEditing = editingTeacher === teacher.id;
                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3"
                  >
                    {isEditing ? (
                      <div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="block text-slate-600 text-xs mb-1">Imię i nazwisko</label>
                            <input
                              type="text"
                              value={editForm.name || ""}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, name: e.target.value }))
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 text-xs mb-1">Przedmiot</label>
                            <input
                              type="text"
                              value={editForm.subject || ""}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, subject: e.target.value }))
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 text-xs mb-1">E-mail</label>
                            <input
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, email: e.target.value }))
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 text-xs mb-1">Stawka (zł/h)</label>
                            <input
                              type="number"
                              value={editForm.hourlyRate || 75}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  hourlyRate: parseInt(e.target.value),
                                }))
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex items-center gap-1 bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs hover:bg-indigo-700 transition-colors"
                          >
                            <Save className="w-3 h-3" />
                            Zapisz
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs hover:bg-slate-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Anuluj
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: teacher.color, fontWeight: 700, fontSize: "0.65rem" }}
                        >
                          {teacher.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-900 text-xs" style={{ fontWeight: 600 }}>
                            {teacher.name}
                          </div>
                          <div className="text-slate-500" style={{ fontSize: "0.65rem" }}>
                            {teacher.subject} · {teacher.email} · {teacher.hourlyRate} zł/h
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startEdit(teacher)}
                            className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-slate-500"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteTeacher(teacher.id)}
                            className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors text-slate-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div>
            <h2 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>
              Sale ({rooms.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: room.bg, border: `2px solid ${room.border}` }}
                    >
                      <Building2
                        className="w-4 h-4"
                        style={{ color: room.dot }}
                      />
                    </div>
                    <div>
                      <div className="text-slate-900 text-xs" style={{ fontWeight: 600 }}>
                        {room.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: room.dot }}
                        />
                        <span className="text-slate-500" style={{ fontSize: "0.65rem" }}>Aktywna</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <div className="text-slate-900 text-xs font-medium">10</div>
                      <div className="text-slate-500" style={{ fontSize: "0.65rem" }}>Miejsc</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <div className="text-slate-900 text-xs font-medium">Parter</div>
                      <div className="text-slate-500" style={{ fontSize: "0.65rem" }}>Piętro</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-slate-900 text-xs" style={{ fontWeight: 600 }}>
                    Powiadomienia administratora
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  {
                    key: "conflictAlerts",
                    label: "Alerty konfliktów",
                    desc: "Natychmiastowe powiadomienie",
                  },
                  {
                    key: "dailySummary",
                    label: "Codzienny raport",
                    desc: "Podsumowanie dnia o 20:00",
                  },
                  {
                    key: "weeklyReport",
                    label: "Tygodniowy raport",
                    desc: "Zestawienie godzin",
                  },
                  {
                    key: "issueReports",
                    label: "Zgłoszenia awarii",
                    desc: "Powiadomienia od nauczycieli",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-2.5"
                  >
                    <div>
                      <div className="text-slate-800 text-xs">{label}</div>
                      <div className="text-slate-400" style={{ fontSize: "0.65rem" }}>{desc}</div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof notifications],
                        }))
                      }
                      className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                        notifications[key as keyof typeof notifications]
                          ? "bg-indigo-600"
                          : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                          notifications[key as keyof typeof notifications]
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
              <div className="flex items-center gap-2 mb-3">
                <SettingsIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-slate-900 text-xs" style={{ fontWeight: 600 }}>
                  Parametry systemu
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-700 text-xs">Domyślna stawka</div>
                    <div className="text-slate-400" style={{ fontSize: "0.65rem" }}>Dla nowych nauczycieli</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      defaultValue={75}
                      className="w-14 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-right outline-none"
                    />
                    <span className="text-slate-500 text-xs">zł/h</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                  <div>
                    <div className="text-slate-700 text-xs">Czas lekcji</div>
                    <div className="text-slate-400" style={{ fontSize: "0.65rem" }}>Domyślny</div>
                  </div>
                  <select defaultValue="60" className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none">
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
                className="w-full mt-3 bg-indigo-600 text-white rounded-xl py-1.5 text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Save className="w-3 h-3" />
                Zapisz ustawienia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">{MobileView}</div>
      <div className="hidden lg:block h-full">{DesktopView}</div>
    </>
  );
}
