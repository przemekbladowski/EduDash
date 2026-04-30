import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  BellRing,
  Clock,
  ChevronRight,
  Zap,
  X,
  AlertTriangle,
  MessageSquare,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  lessons,
  rooms,
  getDurationHours,
} from "../../data/mockData";
import type { Lesson } from "../../data/mockData";

const TODAY = "2026-04-30";

function getRoomById(id: number) {
  return rooms.find((r) => r.id === id)!;
}

/** Adaptive Room Badge — dot on mobile, full label on desktop */
function RoomBadge({ roomId, desktop = false }: { roomId: number; desktop?: boolean }) {
  const room = getRoomById(roomId);
  if (desktop) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
        style={{
          background: room.bg,
          color: room.text,
          border: `1px solid ${room.border}`,
        }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: room.dot }} />
        {room.name}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{
        background: room.bg,
        color: room.text,
        border: `1px solid ${room.border}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: room.dot }} />
      {room.name}
    </span>
  );
}

const mockAlerts = [
  {
    id: 1,
    type: "failure" as const,
    room: "Sala Czerwona",
    roomDot: "#DC2626",
    message: "Zgłoszono awarię klimatyzacji",
    time: "09:15",
  },
];

const mockAdminMessages = [
  {
    id: 1,
    from: "Admin Systemu",
    message: "Zebranie nauczycielskie — środa 6 maja, 13:00 w Sali Żółtej.",
    time: "08:30",
    type: "info" as const,
  },
  {
    id: 2,
    from: "Admin Systemu",
    message: "Przerwa techniczna w systemie: sobota 2 maja od 22:00.",
    time: "wczoraj",
    type: "system" as const,
  },
];

/* ─────────────────────────────────────────────────────── */
export function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmedIds, setConfirmedIds] = useState<Set<number>>(new Set());
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportRoom, setReportRoom] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastLesson, setToastLesson] = useState("");

  const todayLessons = lessons
    .filter((l) => l.teacherId === user?.id && l.date === TODAY)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const nextLesson = todayLessons.find(
    (l) => !confirmedIds.has(l.id) && l.status !== "cancelled"
  );

  const confirmedToday = todayLessons.filter(
    (l) => l.status === "confirmed" || confirmedIds.has(l.id)
  ).length;

  const totalHoursToday = todayLessons.reduce(
    (acc, l) => acc + getDurationHours(l),
    0
  );

  const upcomingLessons = lessons
    .filter((l) => l.teacherId === user?.id && l.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const handleConfirm = (lesson: Lesson) => {
    setConfirmedIds((prev) => new Set([...prev, lesson.id]));
    setToastLesson(lesson.student);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSendReport = () => {
    setReportSent(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSent(false);
      setReportRoom("");
      setReportDesc("");
    }, 2000);
  };

  const dayOfWeek = new Date(TODAY).toLocaleDateString("pl-PL", { weekday: "long" });
  const dateDisplay = new Date(TODAY).toLocaleDateString("pl-PL", { day: "numeric", month: "long" });

  /* ── MOBILE VIEW ─────────────────────────────────────── */
  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white px-5 pt-14 pb-8">
        <p className="text-slate-400 text-sm capitalize">{dayOfWeek}, {dateDisplay}</p>
        <h1 className="text-white mt-1" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
          Dzień dobry, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">{user?.subject}</p>

        {/* Stats - vertical stack */}
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
              <div className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{totalHoursToday.toFixed(1)}h</div>
              <div className="text-slate-400 text-xs mt-1">Godzin razem</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {nextLesson && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-700" style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Następna lekcja
              </span>
            </div>
            <div className="rounded-2xl p-5 border-2" style={{ background: getRoomById(nextLesson.roomId).bg, borderColor: getRoomById(nextLesson.roomId).border }}>
              <div className="mb-3">
                <div className="text-slate-900 mb-1" style={{ fontSize: "1.125rem", fontWeight: 700, lineHeight: 1.2 }}>{nextLesson.student}</div>
                <div className="text-slate-600 text-sm">{nextLesson.subject}</div>
                <div className="mt-2">
                  <RoomBadge roomId={nextLesson.roomId} />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4 text-sm text-slate-600 flex-wrap">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{nextLesson.startTime} – {nextLesson.endTime}</span>
                <span>{getDurationHours(nextLesson)}h</span>
              </div>
              {confirmedIds.has(nextLesson.id) || nextLesson.status === "confirmed" ? (
                <div className="bg-green-500 text-white rounded-2xl py-4 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <span style={{ fontWeight: 600 }}>Lekcja potwierdzona!</span>
                </div>
              ) : (
                <button
                  onClick={() => handleConfirm(nextLesson)}
                  className="w-full bg-slate-900 text-white rounded-2xl py-5 flex items-center justify-center gap-2.5 hover:bg-slate-700 active:scale-[0.98] transition-all shadow-lg min-h-[56px]"
                  style={{ fontSize: "1rem" }}
                >
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <span style={{ fontWeight: 600 }}>Potwierdź realizację lekcji</span>
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowReportModal(true)}
          className="w-full flex items-center justify-between bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 hover:bg-amber-100 active:scale-[0.98] transition-all min-h-[68px]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-amber-200 rounded-xl flex items-center justify-center">
              <BellRing className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-left">
              <div className="text-amber-900 text-sm" style={{ fontWeight: 600 }}>Zgłoś awarię w sali</div>
              <div className="text-amber-600 text-xs mt-0.5">Natychmiastowe powiadomienie admina</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-500" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700" style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Plan na dziś
            </span>
          </div>
          {todayLessons.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <div className="text-slate-700 text-sm">Wolny dzień!</div>
              <div className="text-slate-400 text-xs mt-1">Brak lekcji na dziś</div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayLessons.map((lesson) => {
                const isConfirmed = confirmedIds.has(lesson.id) || lesson.status === "confirmed";
                const room = getRoomById(lesson.roomId);
                return (
                  <div
                    key={lesson.id}
                    className={`bg-white rounded-2xl border p-4 transition-all ${isConfirmed ? "opacity-60" : "border-slate-100 shadow-sm"}`}
                    style={isConfirmed ? { borderColor: "#E2E8F0" } : {}}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-center shrink-0 w-14">
                        <div className="text-slate-900" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{lesson.startTime}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{lesson.endTime}</div>
                      </div>
                      <div className="w-0.5 h-12 rounded-full shrink-0" style={{ backgroundColor: room.border }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-900 truncate" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{lesson.student}</div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <RoomBadge roomId={lesson.roomId} />
                          {isConfirmed && <span className="text-xs text-green-600">✓ Potwierdzona</span>}
                        </div>
                      </div>
                    </div>
                    {!isConfirmed && (
                      <button onClick={() => handleConfirm(lesson)} className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-green-100 hover:text-green-700 text-slate-500 flex items-center justify-center gap-2 transition-colors text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Potwierdź
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
          Dzień dobry, {user?.name?.split(" ")[0]}! 👋
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-3 flex-shrink-0">
        {[
          { icon: <Calendar className="w-4 h-4 text-indigo-600" />, bg: "bg-indigo-50", value: todayLessons.length, label: "Lekcji łącznie", badge: "Dziś", badgeColor: "text-indigo-600 bg-indigo-50" },
          { icon: <CheckCircle2 className="w-4 h-4 text-green-600" />, bg: "bg-green-50", value: confirmedToday, label: "Potwierdzone" },
          { icon: <Clock className="w-4 h-4 text-amber-600" />, bg: "bg-amber-50", value: `${totalHoursToday.toFixed(1)}h`, label: "Godzin dziś" },
          { icon: <TrendingUp className="w-4 h-4 text-purple-600" />, bg: "bg-purple-50", value: `${(totalHoursToday * (user?.hourlyRate ?? 80)).toFixed(0)} zł`, label: "Zarobki dziś" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center`}>{stat.icon}</div>
              {stat.badge && <span className={`text-xs px-1.5 py-0.5 rounded-full ${stat.badgeColor}`}>{stat.badge}</span>}
            </div>
            <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>{stat.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1 overflow-hidden">
        {/* Left: upcoming + today */}
        <div className="col-span-8 flex flex-col overflow-hidden gap-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden flex-1">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <h2 className="text-slate-900" style={{ fontWeight: 700, fontSize: "0.875rem" }}>Najbliższe lekcje</h2>
              </div>
              <button onClick={() => navigate("/teacher/schedule")} className="flex items-center gap-1 text-indigo-600 text-xs hover:text-indigo-800 transition-colors">
                Pełny grafik <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {upcomingLessons.length === 0 ? (
              <div className="p-10 text-center"><div className="text-4xl mb-3">🎉</div><div className="text-slate-600">Brak zaplanowanych lekcji</div></div>
            ) : (
              <div className="grid grid-cols-3 gap-0 divide-x divide-slate-50 overflow-y-auto">
                {upcomingLessons.map((lesson, idx) => {
                  const room = getRoomById(lesson.roomId);
                  const isConfirmed = confirmedIds.has(lesson.id) || lesson.status === "confirmed";
                  const isToday = lesson.date === TODAY;
                  const dateLabel = isToday
                    ? "Dziś"
                    : new Date(lesson.date).toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "short" });
                  return (
                    <div key={lesson.id} className="p-3 relative" style={{ background: idx === 0 ? room.bg : undefined }}>
                      {idx === 0 && (
                        <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 bg-indigo-600 text-white rounded-full">Następna</span>
                      )}
                      <div className="text-xs mb-1.5" style={{ color: idx === 0 ? room.text : "#94A3B8" }}>
                        {dateLabel} · {lesson.startTime}–{lesson.endTime}
                      </div>
                      <div className="mb-1" style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.8125rem" }}>{lesson.student}</div>
                      <div className="text-slate-500 text-xs mb-2">{lesson.subject}</div>
                      <RoomBadge roomId={lesson.roomId} desktop />
                      {idx === 0 && !isConfirmed && (
                        <button onClick={() => handleConfirm(lesson)} className="mt-2 w-full bg-slate-900 text-white rounded-xl py-1.5 text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700 active:scale-95 transition-all" style={{ fontWeight: 600 }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />Potwierdź
                        </button>
                      )}
                      {idx === 0 && isConfirmed && (
                        <div className="mt-2 w-full bg-green-500 text-white rounded-xl py-1.5 text-xs flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />Potwierdzona
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-50 flex-shrink-0">
              <h2 className="text-slate-900" style={{ fontWeight: 700, fontSize: "0.875rem" }}>Plan na dziś</h2>
            </div>
            {todayLessons.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">Brak lekcji na dziś</div>
            ) : (
              <div className="divide-y divide-slate-50 overflow-y-auto">
                {todayLessons.map((lesson) => {
                  const isConfirmed = confirmedIds.has(lesson.id) || lesson.status === "confirmed";
                  const room = getRoomById(lesson.roomId);
                  return (
                    <div key={lesson.id} className={`flex items-center gap-2 px-3 py-2 ${isConfirmed ? "opacity-60" : ""}`}>
                      <div className="text-slate-500 text-xs w-12 shrink-0 tabular-nums">{lesson.startTime}–{lesson.endTime}</div>
                      <div className="w-0.5 h-8 rounded-full shrink-0" style={{ backgroundColor: room.border }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-800" style={{ fontWeight: 600, fontSize: "0.8125rem" }}>{lesson.student}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <RoomBadge roomId={lesson.roomId} desktop />
                          {isConfirmed && <span className="text-xs text-green-600">✓</span>}
                        </div>
                      </div>
                      <div className="text-slate-400 text-xs shrink-0">{getDurationHours(lesson)}h</div>
                      {!isConfirmed ? (
                        <button onClick={() => handleConfirm(lesson)} className="shrink-0 w-6 h-6 rounded-full bg-slate-100 hover:bg-green-100 hover:text-green-700 text-slate-400 flex items-center justify-center transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: notifications */}
        <div className="col-span-4 flex flex-col gap-3 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-50 flex items-center gap-2 flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <h3 className="text-slate-900" style={{ fontWeight: 700, fontSize: "0.875rem" }}>Awarie sal</h3>
              {mockAlerts.length > 0 && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{mockAlerts.length}</span>
              )}
            </div>
            <div className="p-3 space-y-2 overflow-y-auto">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 p-2 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: alert.roomDot }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs" style={{ fontWeight: 600, color: "#7F1D1D" }}>{alert.room}</div>
                    <div className="text-xs text-red-700 mt-0.5">{alert.message}</div>
                  </div>
                  <span className="text-xs text-red-400 shrink-0">{alert.time}</span>
                </div>
              ))}
              <button onClick={() => setShowReportModal(true)} className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 rounded-xl py-2 text-slate-400 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all text-xs">
                <BellRing className="w-3.5 h-3.5" />Zgłoś nową awarię
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-50 flex items-center gap-2 flex-shrink-0">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <h3 className="text-slate-900" style={{ fontWeight: 700, fontSize: "0.875rem" }}>Wiadomości</h3>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto">
              {mockAdminMessages.map((msg) => (
                <div key={msg.id} className={`p-2 rounded-xl ${msg.type === "info" ? "bg-indigo-50 border border-indigo-100" : "bg-slate-50 border border-slate-100"}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs" style={{ fontWeight: 600, color: msg.type === "info" ? "#4338CA" : "#475569" }}>{msg.from}</span>
                    <span className="text-xs text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: msg.type === "info" ? "#3730A3" : "#475569" }}>{msg.message}</p>
                </div>
              ))}
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

      {showSuccessToast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Lekcja z {toastLesson} potwierdzona!</span>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl w-full lg:max-w-md p-6 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-900" style={{ fontWeight: 700, fontSize: "1.125rem" }}>Zgłoś awarię w sali</h3>
              <button onClick={() => setShowReportModal(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            {reportSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-slate-900" style={{ fontWeight: 600 }}>Zgłoszenie wysłane!</div>
                <div className="text-slate-500 text-sm mt-1">Administrator zostanie powiadomiony.</div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm mb-1.5">Sala</label>
                  <div className="grid grid-cols-2 gap-2">
                    {rooms.map((r) => (
                      <button key={r.id} onClick={() => setReportRoom(r.name)} className="py-2.5 px-3 rounded-xl text-sm border-2 transition-all" style={{ background: reportRoom === r.name ? r.bg : "white", borderColor: reportRoom === r.name ? r.border : "#E2E8F0", color: reportRoom === r.name ? r.text : "#64748B" }}>
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-slate-700 text-sm mb-1.5">Opis problemu</label>
                  <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} placeholder="Np. Klimatyzacja nie działa, brak kredy..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" rows={3} />
                </div>
                <button onClick={handleSendReport} disabled={!reportRoom} className="w-full bg-amber-500 text-white rounded-2xl py-4 hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-40" style={{ fontWeight: 600 }}>
                  Wyślij zgłoszenie
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
