import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Plus,
  X,
  CheckCircle2,
  Filter,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  lessons as initialLessons,
  teachers,
  rooms,
  TIME_SLOTS,
  WEEK_DAYS_SHORT,
  WEEK_DAYS_FULL,
  getWeekDates,
  formatDate,
  formatDateDisplay,
  detectConflicts,
  timeToMinutes,
  getDurationHours,
  type Lesson,
} from "../../data/mockData";

const TODAY = "2026-04-30";

function getTeacherById(id: number) {
  return teachers.find((t) => t.id === id);
}
function getRoomById(id: number) {
  return rooms.find((r) => r.id === id)!;
}

function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return (
    timeToMinutes(aStart) < timeToMinutes(bEnd) &&
    timeToMinutes(bStart) < timeToMinutes(aEnd)
  );
}

export function AdminSchedule() {
  const [lessonList, setLessonList] = useState<Lesson[]>(initialLessons);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [filterTeacher, setFilterTeacher] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    teacherId: "",
    roomId: "",
    student: "",
    subject: "",
    startTime: "09:00",
    endTime: "10:00",
  });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [conflictToResolve, setConflictToResolve] = useState<number | null>(null);

  const weekDates = getWeekDates(weekOffset);

  const dayLessons = lessonList.filter((l) => l.date === selectedDate);
  const filteredDayLessons = filterTeacher
    ? dayLessons.filter((l) => l.teacherId === filterTeacher)
    : dayLessons;

  const selectedDayLessons = filteredDayLessons.sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const conflicts = detectConflicts(dayLessons);

  const getSlotRoomLessons = (slot: string, roomId: number) => {
    const slotStart = slot;
    const slotEnd = `${String(parseInt(slot) + 1).padStart(2, "0")}:00`;
    return filteredDayLessons.filter(
      (l) =>
        l.roomId === roomId &&
        timesOverlap(l.startTime, l.endTime, slotStart, slotEnd)
    );
  };

  const handleAddLesson = () => {
    setAddError("");
    const { teacherId, roomId, student, subject, startTime, endTime } = addForm;

    if (!teacherId || !roomId || !student || !subject) {
      setAddError("Wypełnij wszystkie pola.");
      return;
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      setAddError("Godzina zakończenia musi być późniejsza niż rozpoczęcia.");
      return;
    }

    const sameDayLessons = lessonList.filter((l) => l.date === selectedDate);
    const roomConflict = sameDayLessons.find(
      (l) =>
        l.roomId === parseInt(roomId) &&
        timesOverlap(l.startTime, l.endTime, startTime, endTime)
    );
    const teacherConflict = sameDayLessons.find(
      (l) =>
        l.teacherId === parseInt(teacherId) &&
        timesOverlap(l.startTime, l.endTime, startTime, endTime)
    );

    if (roomConflict) {
      setAddError(
        `⚠️ Konflikt! ${getRoomById(parseInt(roomId)).name} jest już zajęta ${roomConflict.startTime}–${roomConflict.endTime}.`
      );
      return;
    }

    if (teacherConflict) {
      const t = getTeacherById(parseInt(teacherId));
      setAddError(
        `⚠️ Konflikt! ${t?.name} ma już lekcję ${teacherConflict.startTime}–${teacherConflict.endTime}.`
      );
      return;
    }

    const newLesson: Lesson = {
      id: Math.max(...lessonList.map((l) => l.id)) + 1,
      teacherId: parseInt(teacherId),
      roomId: parseInt(roomId),
      student,
      subject,
      date: selectedDate,
      startTime,
      endTime,
      status: "pending",
    };

    setLessonList((prev) => [...prev, newLesson]);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddModal(false);
      setAddForm({
        teacherId: "",
        roomId: "",
        student: "",
        subject: "",
        startTime: "09:00",
        endTime: "10:00",
      });
    }, 1500);
  };

  const removeLesson = (id: number) => {
    setLessonList((prev) => prev.filter((l) => l.id !== id));
    setConflictToResolve(null);
  };

  const weekLabel = () => {
    if (weekOffset === 0) return "Ten tydzień";
    if (weekOffset === 1) return "Następny tydzień";
    if (weekOffset === -1) return "Poprzedni tydzień";
    return `${formatDateDisplay(weekDates[0])} – ${formatDateDisplay(weekDates[6])}`;
  };

  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white px-5 pt-14 pb-7">
        <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Harmonogram
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {lessonList.length} lekcji łącznie
        </p>

        {conflicts.size > 0 && (
          <div className="flex items-center gap-1.5 bg-red-500/20 text-red-300 border border-red-500/30 text-sm px-3 py-2 rounded-xl mt-4">
            <AlertTriangle className="w-4 h-4" />
            {conflicts.size} konflikty
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors mt-4"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Dodaj lekcję
        </button>
      </div>

      <div className="px-5 py-5 w-full">
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

        <div className="overflow-x-auto -mx-5 px-5 mb-6">
          <div className="flex gap-2 min-w-max">
            {weekDates.map((date, i) => {
              const dateStr = formatDate(date);
              const isToday = dateStr === TODAY;
              const isSelected = dateStr === selectedDate;
              const dayLessonsCount = lessonList.filter(
                (l) => l.date === dateStr
              ).length;
              const dayConflicts = detectConflicts(
                lessonList.filter((l) => l.date === dateStr)
              );
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
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ fontSize: "0.65rem", opacity: 0.7 }}
                  >
                    {WEEK_DAYS_SHORT[i]}
                  </span>
                  <span className="mt-1" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                    {date.getDate()}
                  </span>
                  <div className="flex gap-0.5 mt-1">
                    {dayLessonsCount > 0 && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-white/60" : "bg-indigo-400"
                        }`}
                      />
                    )}
                    {dayConflicts.size > 0 && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-red-300" : "bg-red-400"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <button
            onClick={() => setFilterTeacher(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
              filterTeacher === null
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            Wszyscy
          </button>
          {teachers.map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setFilterTeacher(filterTeacher === t.id ? null : t.id)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                filterTeacher === t.id
                  ? "text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
              style={
                filterTeacher === t.id ? { backgroundColor: t.color } : {}
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    filterTeacher === t.id ? "white" : t.color,
                }}
              />
              {t.name.split(" ")[0]}
            </button>
          ))}
        </div>

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
                const teacher = getTeacherById(lesson.teacherId);
                const isConflict = conflicts.has(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                      isConflict
                        ? "border-red-400"
                        : "border-slate-100"
                    }`}
                  >
                    <div
                      className="h-1.5"
                      style={{ backgroundColor: room.border }}
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                              style={{
                                backgroundColor: teacher?.color,
                                fontWeight: 700,
                                fontSize: "0.65rem",
                              }}
                            >
                              {teacher?.initials}
                            </div>
                            <div
                              className="text-slate-900"
                              style={{ fontWeight: 600, fontSize: "0.9375rem" }}
                            >
                              {teacher?.name}
                            </div>
                          </div>
                          <div className="text-slate-900" style={{ fontWeight: 600 }}>
                            {lesson.student}
                          </div>
                          <div className="text-slate-500 text-sm mt-1">
                            {lesson.subject}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
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
                          {isConflict && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Konflikt
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {lesson.startTime} – {lesson.endTime}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span>{getDurationHours(lesson)}h</span>
                        <span className="text-slate-300">·</span>
                        <span
                          className={
                            lesson.status === "confirmed"
                              ? "text-green-600"
                              : "text-amber-600"
                          }
                        >
                          {lesson.status === "confirmed"
                            ? "✓ Potwierdzona"
                            : "Oczekuje"}
                        </span>
                      </div>
                      {isConflict && (
                        <button
                          onClick={() => removeLesson(lesson.id)}
                          className="w-full mt-3 bg-red-50 text-red-600 text-xs py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Usuń lekcję
                        </button>
                      )}
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

  const DesktopView = (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <div className="mb-3 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Harmonogram
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Macierz sal i nauczycieli
          </p>
        </div>
        <div className="flex items-center gap-2">
          {conflicts.size > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1.5 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5" />
              {conflicts.size} konflikty
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs hover:bg-indigo-700 transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Plus className="w-3.5 h-3.5" />
            Dodaj lekcję
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 mb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <span className="text-slate-700 text-xs" style={{ fontWeight: 600 }}>
            {weekLabel()}
          </span>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, i) => {
            const dateStr = formatDate(date);
            const isToday = dateStr === TODAY;
            const isSelected = dateStr === selectedDate;
            const dayLessonsCount = lessonList.filter(
              (l) => l.date === dateStr
            ).length;
            const dayConflicts = detectConflicts(
              lessonList.filter((l) => l.date === dateStr)
            );
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : isToday
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span
                  className="text-xs"
                  style={{ fontSize: "0.6rem", opacity: 0.7 }}
                >
                  {WEEK_DAYS_SHORT[i]}
                </span>
                <span className="mt-0.5" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                  {date.getDate()}
                </span>
                <div className="flex gap-0.5 mt-0.5">
                  {dayLessonsCount > 0 && (
                    <div
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? "bg-white/60" : "bg-indigo-400"
                      }`}
                    />
                  )}
                  {dayConflicts.size > 0 && (
                    <div
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? "bg-red-300" : "bg-red-400"
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 flex-shrink-0">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          onClick={() => setFilterTeacher(null)}
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-all ${
            filterTeacher === null
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Wszyscy
        </button>
        {teachers.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTeacher(filterTeacher === t.id ? null : t.id)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1 ${
              filterTeacher === t.id
                ? "text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
            style={
              filterTeacher === t.id
                ? { backgroundColor: t.color }
                : {}
            }
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: filterTeacher === t.id ? "white" : t.color }}
            />
            {t.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-1">
        <div className="overflow-auto h-full">
          <table className="w-full" style={{ minWidth: "600px" }}>
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-100">
                <th className="text-slate-500 text-xs py-2 px-3 text-left w-16">
                  Godz.
                </th>
                {rooms.map((room) => (
                  <th key={room.id} className="text-center py-2 px-2">
                    <div className="inline-flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: room.dot }}
                      />
                      <span
                        className="text-xs text-slate-700"
                        style={{ fontWeight: 600 }}
                      >
                        {room.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, slotIdx) => (
                <tr
                  key={slot}
                  className={slotIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="text-slate-400 text-xs py-1.5 px-3 whitespace-nowrap border-r border-slate-100">
                    {slot}
                  </td>
                  {rooms.map((room) => {
                    const cellLessons = getSlotRoomLessons(slot, room.id);
                    const hasConflict = cellLessons.some((l) =>
                      conflicts.has(l.id)
                    );

                    return (
                      <td
                        key={room.id}
                        className={`py-1 px-1.5 align-top border-r border-slate-50 ${
                          hasConflict ? "bg-red-50" : ""
                        }`}
                        style={{ minHeight: "42px", minWidth: "120px" }}
                      >
                        {cellLessons.length === 0 ? (
                          <button
                            onClick={() => {
                              setAddForm((f) => ({
                                ...f,
                                roomId: String(room.id),
                                startTime: slot,
                                endTime: `${String(parseInt(slot) + 1).padStart(2, "0")}:00`,
                              }));
                              setShowAddModal(true);
                            }}
                            className="w-full h-8 rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3 text-slate-300 hover:text-indigo-400" />
                          </button>
                        ) : (
                          <div className="space-y-1">
                            {cellLessons.map((lesson) => {
                              const teacher = getTeacherById(lesson.teacherId);
                              const isConflict = conflicts.has(lesson.id);
                              return (
                                <div
                                  key={lesson.id}
                                  className={`rounded-lg px-1.5 py-1 text-xs relative group cursor-pointer ${
                                    isConflict
                                      ? "border-2 border-red-400 bg-red-50"
                                      : ""
                                  }`}
                                  style={
                                    !isConflict
                                      ? {
                                          backgroundColor: teacher
                                            ? `${teacher.color}20`
                                            : "#F1F5F9",
                                          border: `1px solid ${teacher?.color || "#E2E8F0"}50`,
                                        }
                                      : {}
                                  }
                                  onClick={() =>
                                    setConflictToResolve(
                                      conflictToResolve === lesson.id
                                        ? null
                                        : lesson.id
                                    )
                                  }
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="min-w-0">
                                      <div
                                        className="truncate"
                                        style={{
                                          fontWeight: 600,
                                          fontSize: "0.65rem",
                                          color: teacher?.color,
                                        }}
                                      >
                                        {teacher?.name.split(" ")[0]}
                                      </div>
                                      <div className="text-slate-500 truncate" style={{ fontSize: "0.6rem" }}>
                                        {lesson.student}
                                      </div>
                                      <div className="text-slate-400" style={{ fontSize: "0.6rem" }}>
                                        {lesson.startTime}–{lesson.endTime}
                                      </div>
                                    </div>
                                    {isConflict && (
                                      <AlertTriangle className="w-2.5 h-2.5 text-red-500 shrink-0 mt-0.5" />
                                    )}
                                  </div>

                                  {conflictToResolve === lesson.id && (
                                    <div className="absolute z-20 top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 p-2.5 w-44">
                                      <div className="text-slate-700 text-xs font-medium mb-1.5">
                                        {teacher?.name}
                                      </div>
                                      <div className="text-slate-500 text-xs mb-2">
                                        {lesson.startTime}–{lesson.endTime} · {lesson.student}
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeLesson(lesson.id);
                                        }}
                                        className="w-full bg-red-50 text-red-600 text-xs py-1 rounded-lg hover:bg-red-100 transition-colors"
                                      >
                                        Usuń lekcję
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">{MobileView}</div>
      <div className="hidden lg:block h-full">{DesktopView}</div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-slate-900" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                Dodaj nową lekcję
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddError("");
                  setAddSuccess(false);
                }}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-slate-900 font-medium">Lekcja dodana!</div>
                <div className="text-slate-500 text-sm mt-1">
                  Bez konfliktów — wszystko gotowe.
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="text-slate-600 text-sm bg-slate-50 px-3 py-2 rounded-xl">
                  📅 Data:{" "}
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("pl-PL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>

                {addError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    {addError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 text-sm mb-1">Nauczyciel</label>
                    <select
                      value={addForm.teacherId}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, teacherId: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    >
                      <option value="">Wybierz...</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm mb-1">Sala</label>
                    <select
                      value={addForm.roomId}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, roomId: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    >
                      <option value="">Wybierz...</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm mb-1">Uczeń</label>
                  <input
                    type="text"
                    placeholder="Imię i nazwisko ucznia"
                    value={addForm.student}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, student: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm mb-1">Przedmiot</label>
                  <input
                    type="text"
                    placeholder="np. Matematyka"
                    value={addForm.subject}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 text-sm mb-1">Godz. od</label>
                    <select
                      value={addForm.startTime}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, startTime: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    >
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm mb-1">Godz. do</label>
                    <select
                      value={addForm.endTime}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, endTime: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                    >
                      {TIME_SLOTS.filter(
                        (s) =>
                          timeToMinutes(s) > timeToMinutes(addForm.startTime)
                      ).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="19:00">19:00</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddLesson}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Dodaj lekcję
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
