import { useNavigate } from "react-router";
import {
  Users,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  Building2,
} from "lucide-react";
import {
  lessons,
  teachers,
  rooms,
  detectConflicts,
  getDurationHours,
} from "../../data/mockData";

const TODAY = "2026-04-30";

function getRoomById(id: number) {
  return rooms.find((r) => r.id === id)!;
}
function getTeacherById(id: number) {
  return teachers.find((t) => t.id === id)!;
}

const weeklyData = [
  { day: "Pon", confirmed: 6, pending: 2 },
  { day: "Wt", confirmed: 4, pending: 3 },
  { day: "Śr", confirmed: 5, pending: 1 },
  { day: "Czw", confirmed: 7, pending: 4 },
  { day: "Pt", confirmed: 3, pending: 2 },
  { day: "Sob", confirmed: 2, pending: 1 },
  { day: "Niedz", confirmed: 1, pending: 0 },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  const todayLessons = lessons.filter((l) => l.date === TODAY);
  const conflicts = detectConflicts(todayLessons);
  const confirmedToday = todayLessons.filter((l) => l.status === "confirmed").length;
  const activeTeachersToday = new Set(todayLessons.map((l) => l.teacherId)).size;

  const sortedLessons = [...todayLessons].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const dayOfWeek = new Date(TODAY).toLocaleDateString("pl-PL", { weekday: "long" });
  const dateDisplay = new Date(TODAY).toLocaleDateString("pl-PL", { day: "numeric", month: "long" });

  /* ── MOBILE VIEW ─────────────────────────────────────── */
  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white px-5 pt-14 pb-8">
        <p className="text-slate-400 text-sm capitalize">{dayOfWeek}, {dateDisplay}</p>
        <h1 className="text-white mt-1" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
          Dzień dobry 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Przegląd dzisiejszego dnia w szkole</p>

        {/* Stats - Mobile */}
        <div className="space-y-3 mt-6">
          <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="text-slate-300 text-sm">Lekcji dziś</div>
            <div className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>{todayLessons.length}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{confirmedToday}</div>
              <div className="text-slate-400 text-xs mt-1">Potwierdzone</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{activeTeachersToday}</div>
              <div className="text-slate-400 text-xs mt-1">Nauczycieli</div>
            </div>
          </div>
          {conflicts.size > 0 && (
            <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-4 flex items-center justify-between">
              <div className="text-red-100 text-sm">Konflikty</div>
              <div className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>{conflicts.size}</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Conflict Alert */}
        {conflicts.size > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-red-900" style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                  Wykryto {conflicts.size} konflikt{conflicts.size > 1 ? "y" : ""}!
                </div>
                <div className="text-red-700 text-sm mt-1">
                  Sala Czerwona jest podwójnie zarezerwowana o 14:00.
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/schedule")}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-all"
              style={{ fontWeight: 600 }}
            >
              Rozwiąż konflikty
            </button>
          </div>
        )}

        {/* Schedule List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="text-slate-900" style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
              Dzisiejszy grafik
            </h2>
            <button
              onClick={() => navigate("/admin/schedule")}
              className="flex items-center gap-1 text-indigo-600 text-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {sortedLessons.slice(0, 5).map((lesson) => {
              const teacher = getTeacherById(lesson.teacherId);
              const room = getRoomById(lesson.roomId);
              const isConflict = conflicts.has(lesson.id);
              return (
                <div key={lesson.id} className={`p-4 ${isConflict ? "bg-red-50" : ""}`}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-slate-500 text-sm shrink-0 font-mono" style={{ fontWeight: 600 }}>
                      {lesson.startTime}
                    </div>
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: teacher.color }}
                    />
                    <div className="flex-1">
                      <div className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>
                        {teacher.name}
                      </div>
                      <div className="text-slate-500 text-sm mt-0.5">{lesson.student}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-16">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: room.bg,
                        color: room.text,
                        border: `1px solid ${room.border}`,
                      }}
                    >
                      {room.shortName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── DESKTOP VIEW ────────────────────────────────────── */
  const DesktopView = (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <div className="mb-3 flex-shrink-0">
        <p className="text-slate-500 text-xs capitalize">{dayOfWeek}, {dateDisplay}</p>
        <h1 className="text-slate-900 mt-0.5" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
          Dzień dobry 👋
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-3 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-slate-900 mt-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {todayLessons.length}
          </div>
          <div className="text-slate-500 text-xs mt-0.5">Lekcji łącznie</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-slate-900 mt-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {confirmedToday}
          </div>
          <div className="text-slate-500 text-xs mt-0.5">Potwierdzone</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-slate-900 mt-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {activeTeachersToday}/{teachers.length}
          </div>
          <div className="text-slate-500 text-xs mt-0.5">Nauczycieli dziś</div>
        </div>

        <div className={`rounded-2xl border-2 shadow-sm p-3 ${
          conflicts.size > 0 ? "bg-red-50 border-red-200" : "bg-white border-slate-100"
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            conflicts.size > 0 ? "bg-red-100" : "bg-slate-50"
          }`}>
            <AlertTriangle className={`w-4 h-4 ${
              conflicts.size > 0 ? "text-red-600" : "text-slate-400"
            }`} />
          </div>
          <div className={`mt-2 ${conflicts.size > 0 ? "text-red-700" : "text-slate-900"}`}
            style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {conflicts.size}
          </div>
          <div className={`text-xs mt-0.5 ${
            conflicts.size > 0 ? "text-red-600" : "text-slate-500"
          }`}>
            Konflikty
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 flex-1 overflow-hidden">
        {/* Schedule */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50 flex-shrink-0">
            <h2 className="text-slate-900" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              Dzisiejszy grafik
            </h2>
            <button
              onClick={() => navigate("/admin/schedule")}
              className="flex items-center gap-1 text-indigo-600 text-xs"
            >
              Pełny widok <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50 flex-1 overflow-y-auto">
            {sortedLessons.slice(0, 5).map((lesson) => {
              const teacher = getTeacherById(lesson.teacherId);
              const room = getRoomById(lesson.roomId);
              const isConflict = conflicts.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 px-3 py-2 ${isConflict ? "bg-red-50" : ""}`}
                >
                  <div className="text-slate-500 text-xs w-10 shrink-0">{lesson.startTime}</div>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: teacher.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-800 text-xs truncate">
                      <span style={{ fontWeight: 600 }}>{teacher.name}</span>{" "}
                      <span className="text-slate-400">·</span> {lesson.student}
                    </div>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: room.bg, color: room.text, border: `1px solid ${room.border}` }}
                  >
                    {room.shortName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 overflow-hidden">
          {/* Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              Ten tydzień
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-green-500" />
                <span className="text-xs text-slate-500">Potwierdzone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-yellow-300" />
                <span className="text-xs text-slate-500">Oczekujące</span>
              </div>
            </div>
            <WeeklyBarChart data={weeklyData} />
          </div>

          {/* Rooms */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex-1 overflow-y-auto">
            <h3 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
              Sale – status dziś
            </h3>
            <div className="space-y-1.5">
              {rooms.map((room) => {
                const roomLessons = todayLessons.filter((l) => l.roomId === room.id);
                const hasConflict = roomLessons.some((l) => conflicts.has(l.id));
                return (
                  <div
                    key={room.id}
                    className={`flex items-center justify-between p-2 rounded-xl ${
                      hasConflict ? "bg-red-50 border border-red-200" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: room.dot }} />
                      <span className="text-xs text-slate-700">{room.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{roomLessons.length} lekcji</span>
                      {hasConflict && <AlertTriangle className="w-3 h-3 text-red-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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

function WeeklyBarChart({ data }: { data: { day: string; confirmed: number; pending: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.confirmed, d.pending])) || 1;
  return (
    <div className="flex items-end gap-1 h-[80px]">
      {data.map((d, i) => (
        <div key={`week-bar-${i}`} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full flex items-end gap-px h-[60px]">
            <div
              className="flex-1 rounded-t-[3px] bg-green-500"
              style={{ height: `${(d.confirmed / maxVal) * 60}px`, minHeight: d.confirmed > 0 ? 3 : 0 }}
            />
            <div
              className="flex-1 rounded-t-[3px] bg-yellow-300"
              style={{ height: `${(d.pending / maxVal) * 60}px`, minHeight: d.pending > 0 ? 3 : 0 }}
            />
          </div>
          <span className="text-slate-400" style={{ fontSize: "9px" }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}
