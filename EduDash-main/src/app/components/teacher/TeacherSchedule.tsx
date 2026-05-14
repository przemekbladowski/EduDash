import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import {
  lessons,
  rooms,
  getWeekDates,
  formatDate,
  formatDateDisplay,
  WEEK_DAYS_SHORT,
  WEEK_DAYS_FULL,
  getDurationHours,
  getDurationMinutes,
  timeToMinutes,
} from "../../data/mockData";

const TODAY = "2026-04-30";

const HOUR_HEIGHT = 64; // px per hour slot
const GRID_START_HOUR = 8;
const GRID_END_HOUR = 19;
const HOUR_LABELS = Array.from(
  { length: GRID_END_HOUR - GRID_START_HOUR },
  (_, i) => GRID_START_HOUR + i
);

function getRoomById(id: number) {
  return rooms.find((r) => r.id === id)!;
}

/* ────────────────────────────────────────────── */

export function TeacherSchedule() {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [view, setView] = useState<"week" | "month">("week");

  const weekDates = getWeekDates(weekOffset);
  const myLessons = lessons.filter((l) => l.teacherId === user?.id);

  const selectedDayLessons = myLessons
    .filter((l) => l.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getMonthDates = () => {
    const date = new Date(TODAY);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const offset = startDay === 0 ? 6 : startDay - 1;
    const days: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const hasLesson = (date: string) => myLessons.some((l) => l.date === date);
  const lessonsOnDate = (date: string) => myLessons.filter((l) => l.date === date).length;

  const weekLabel = () => {
    const first = weekDates[0];
    const last = weekDates[6];
    if (weekOffset === 0) return "Ten tydzień";
    if (weekOffset === 1) return "Następny tydzień";
    if (weekOffset === -1) return "Poprzedni tydzień";
    return `${formatDateDisplay(first)} – ${formatDateDisplay(last)}`;
  };

  /* ── DESKTOP TIME-GRID ─────────────────────────────── */
  const totalGridHeight = HOUR_LABELS.length * HOUR_HEIGHT;

  const DesktopView = (
    <div className="p-6 xl:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-slate-900" style={{ fontSize: "1.625rem", fontWeight: 700 }}>
          Mój Grafik
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">{myLessons.length} lekcji łącznie</p>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setWeekOffset((o) => o - 1)}
          className="w-9 h-9 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="text-slate-700" style={{ fontWeight: 600 }}>
          {weekLabel()}
        </span>
        <button
          onClick={() => setWeekOffset((o) => o + 1)}
          className="w-9 h-9 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Time-Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="flex border-b border-slate-100">
          {/* time gutter */}
          <div className="w-16 shrink-0 bg-slate-50 border-r border-slate-100" />
          {weekDates.map((date, i) => {
            const dateStr = formatDate(date);
            const isToday = dateStr === TODAY;
            const count = lessonsOnDate(dateStr);
            return (
              <div
                key={i}
                className={`flex-1 text-center py-3 border-r border-slate-50 last:border-r-0 ${
                  isToday ? "bg-indigo-50" : ""
                }`}
              >
                <div className="text-xs text-slate-400">{WEEK_DAYS_SHORT[i]}</div>
                <div
                  className={`mt-0.5 text-sm ${isToday ? "text-indigo-700" : "text-slate-700"}`}
                  style={{ fontWeight: isToday ? 700 : 500 }}
                >
                  {date.getDate()}
                </div>
                {count > 0 && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${isToday ? "bg-indigo-500" : "bg-indigo-300"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Grid body */}
        <div className="flex" style={{ height: totalGridHeight, overflowY: "auto", maxHeight: "600px" }}>
          {/* Time labels */}
          <div className="w-16 shrink-0 border-r border-slate-100 bg-slate-50 relative" style={{ height: totalGridHeight }}>
            {HOUR_LABELS.map((h, i) => (
              <div
                key={h}
                className="absolute left-0 right-0 flex items-start justify-end pr-2"
                style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
              >
                <span className="text-xs text-slate-400 mt-1">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIdx) => {
            const dateStr = formatDate(date);
            const isToday = dateStr === TODAY;
            const dayLessons = myLessons
              .filter((l) => l.date === dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={dayIdx}
                className={`flex-1 border-r border-slate-50 last:border-r-0 relative ${isToday ? "bg-indigo-50/30" : ""}`}
                style={{ height: totalGridHeight }}
              >
                {/* Hour lines */}
                {HOUR_LABELS.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-t border-slate-100"
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}

                {/* Lesson boxes */}
                {dayLessons.map((lesson) => {
                  const startMin = timeToMinutes(lesson.startTime);
                  const gridStartMin = GRID_START_HOUR * 60;
                  const durationMin = getDurationMinutes(lesson);
                  const top = Math.max(0, ((startMin - gridStartMin) / 60) * HOUR_HEIGHT);
                  const height = Math.max(24, (durationMin / 60) * HOUR_HEIGHT - 3);
                  const room = getRoomById(lesson.roomId);
                  const isConfirmed = lesson.status === "confirmed";

                  return (
                    <div
                      key={lesson.id}
                      className="absolute inset-x-1 rounded-lg px-2 py-1.5 overflow-hidden select-none"
                      style={{
                        top,
                        height,
                        background: room.bg,
                        borderLeft: `3px solid ${room.border}`,
                      }}
                    >
                      <div
                        className="leading-tight truncate"
                        style={{ fontSize: "0.7rem", fontWeight: 700, color: room.text }}
                      >
                        {lesson.startTime}
                      </div>
                      {height > 36 && (
                        <div
                          className="truncate leading-tight"
                          style={{ fontSize: "0.7rem", color: room.text, opacity: 0.85 }}
                        >
                          {lesson.student}
                        </div>
                      )}
                      {height > 52 && (
                        <div
                          className="truncate"
                          style={{ fontSize: "0.65rem", color: room.text, opacity: 0.7 }}
                        >
                          {room.shortName} {isConfirmed ? "✓" : ""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Room legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: room.border }} />
            <span className="text-xs text-slate-500">{room.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── MOBILE VIEW ──────────────────────────────────── */
  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 pt-14 pb-7">
        <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Mój Grafik
        </h1>
        <p className="text-slate-400 text-sm mt-1">{myLessons.length} lekcji łącznie</p>

        {/* View toggle */}
        <div className="flex bg-white/10 rounded-xl p-1.5 mt-5">
          <button
            onClick={() => setView("week")}
            className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
              view === "week" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            }`}
            style={{ fontWeight: view === "week" ? 600 : 500 }}
          >
            Tydzień
          </button>
          <button
            onClick={() => setView("month")}
            className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
              view === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            }`}
            style={{ fontWeight: view === "month" ? 600 : 500 }}
          >
            Miesiąc
          </button>
        </div>
      </div>

      <div className="px-5 py-5 w-full">
        {view === "week" ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setWeekOffset((o) => o - 1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
                {weekLabel()}
              </span>
              <button
                onClick={() => setWeekOffset((o) => o + 1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Week selector - horizontal scroll */}
            <div className="overflow-x-auto -mx-5 px-5 mb-6">
              <div className="flex gap-2 min-w-max">
                {weekDates.map((date, i) => {
                  const dateStr = formatDate(date);
                  const isToday = dateStr === TODAY;
                  const isSelected = dateStr === selectedDate;
                  const count = lessonsOnDate(dateStr);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all active:scale-95 min-h-[68px] min-w-[52px] ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md"
                          : isToday
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-white text-slate-600 border border-slate-100"
                      }`}
                    >
                      <span className="text-xs whitespace-nowrap" style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                        {WEEK_DAYS_SHORT[i]}
                      </span>
                      <span className="mt-1" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                        {date.getDate()}
                      </span>
                      {count > 0 && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1 ${
                            isSelected ? "bg-white/60" : "bg-indigo-400"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 w-full">
              <h3 className="text-slate-700 text-center mb-3" style={{ fontWeight: 600 }}>
                Kwiecień 2026
              </h3>
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {WEEK_DAYS_SHORT.map((d) => (
                  <div key={d} className="text-center text-slate-400" style={{ fontSize: "0.65rem" }}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {getMonthDates().map((date, i) => {
                  if (!date) return <div key={i} />;
                  const dateStr = formatDate(date);
                  const isToday = dateStr === TODAY;
                  const isSelected = dateStr === selectedDate;
                  const count = lessonsOnDate(dateStr);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setView("week");
                      }}
                      className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all text-sm relative ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : isToday
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {date.getDate()}
                      {count > 0 && (
                        <div
                          className={`absolute bottom-1 w-1 h-1 rounded-full ${
                            isSelected ? "bg-white/60" : "bg-indigo-400"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Day's lessons */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 text-sm">
              {new Date(selectedDate).toLocaleDateString("pl-PL", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          {selectedDayLessons.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <div className="text-3xl mb-2">🗓️</div>
              <div className="text-slate-600 text-sm">Brak lekcji tego dnia</div>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayLessons.map((lesson) => {
                const room = getRoomById(lesson.roomId);
                return (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="h-1.5" style={{ backgroundColor: room.border }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-slate-900" style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                            {lesson.student}
                          </div>
                          <div className="text-slate-500 text-sm mt-1">{lesson.subject}</div>
                        </div>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: room.bg,
                            color: room.text,
                            border: `1px solid ${room.border}`,
                          }}
                        >
                          {room.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {lesson.startTime} – {lesson.endTime}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span>{getDurationHours(lesson)}h</span>
                        <span className="text-slate-300">·</span>
                        <span className={lesson.status === "confirmed" ? "text-green-600" : "text-amber-600"}>
                          {lesson.status === "confirmed" ? "✓ Potwierdzona" : "Oczekuje"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
