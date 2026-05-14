import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, CalendarCheck, Info } from "lucide-react";
import { WEEK_DAYS_SHORT, WEEK_DAYS_FULL, TIME_SLOTS } from "../../data/mockData";

// Initial availability: Mon-Fri, 09:00-17:00
const initAvailability = (): Record<string, boolean> => {
  const map: Record<string, boolean> = {};
  for (let day = 0; day < 7; day++) {
    for (const slot of TIME_SLOTS) {
      const key = `${day}-${slot}`;
      const isWeekday = day < 5;
      const hour = parseInt(slot);
      map[key] = isWeekday && hour >= 9 && hour < 17;
    }
  }
  return map;
};

// For mobile: derive per-day start/end time from availability map
const getTimeRangeForDay = (day: number, availability: Record<string, boolean>) => {
  const activeSlotsForDay = TIME_SLOTS.filter((s) => availability[`${day}-${s}`]);
  if (activeSlotsForDay.length === 0) return { enabled: false, from: "09:00", to: "17:00" };
  return { enabled: true, from: activeSlotsForDay[0], to: activeSlotsForDay[activeSlotsForDay.length - 1] };
};

const setTimeRangeForDay = (
  day: number,
  from: string,
  to: string,
  prev: Record<string, boolean>
): Record<string, boolean> => {
  const fromIdx = TIME_SLOTS.indexOf(from);
  const toIdx = TIME_SLOTS.indexOf(to);
  const next = { ...prev };
  TIME_SLOTS.forEach((slot, idx) => {
    next[`${day}-${slot}`] = idx >= fromIdx && idx <= toIdx;
  });
  return next;
};

/* ─────────────────────────────────────────────────────────── */

export function TeacherAvailability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState(initAvailability);
  const [saved, setSaved] = useState(false);
  const isDraggingRef = useRef(false);
  const dragValueRef = useRef(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const countActiveDays = () => {
    return Array.from({ length: 7 }, (_, d) => d).filter((d) =>
      TIME_SLOTS.some((s) => availability[`${d}-${s}`])
    ).length;
  };

  const countActiveSlots = () => Object.values(availability).filter(Boolean).length;

  /* ── Desktop: Drag grid ─────────────────────────────── */
  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleCellMouseDown = useCallback((day: number, slot: string) => {
    const key = `${day}-${slot}`;
    const newVal = !availability[key];
    dragValueRef.current = newVal;
    isDraggingRef.current = true;
    setAvailability((prev) => ({ ...prev, [key]: newVal }));
  }, [availability]);

  const handleCellMouseEnter = useCallback((day: number, slot: string) => {
    if (!isDraggingRef.current) return;
    const key = `${day}-${slot}`;
    setAvailability((prev) => ({ ...prev, [key]: dragValueRef.current }));
  }, []);

  /* ── Mobile: Per-day toggles + time selects ────────── */
  const toggleDay = (day: number, enabled: boolean) => {
    setAvailability((prev) => {
      const next = { ...prev };
      TIME_SLOTS.forEach((s) => {
        const hour = parseInt(s);
        next[`${day}-${s}`] = enabled && hour >= 9 && hour < 17;
      });
      return next;
    });
  };

  const handleFromChange = (day: number, from: string) => {
    const range = getTimeRangeForDay(day, availability);
    const toIdx = TIME_SLOTS.indexOf(range.to);
    const fromIdx = TIME_SLOTS.indexOf(from);
    const to = fromIdx >= toIdx ? TIME_SLOTS[Math.min(fromIdx + 2, TIME_SLOTS.length - 1)] : range.to;
    setAvailability((prev) => setTimeRangeForDay(day, from, to, prev));
  };

  const handleToChange = (day: number, to: string) => {
    const range = getTimeRangeForDay(day, availability);
    const fromIdx = TIME_SLOTS.indexOf(range.from);
    const toIdx = TIME_SLOTS.indexOf(to);
    const from = toIdx <= fromIdx ? TIME_SLOTS[Math.max(toIdx - 2, 0)] : range.from;
    setAvailability((prev) => setTimeRangeForDay(day, from, to, prev));
  };

  /* ── DESKTOP VIEW ────────────────────────────────────── */
  const DesktopView = (
    <div className="p-6 xl:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.625rem", fontWeight: 700 }}>
            Moja Dostępność
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {countActiveDays()} dni · {countActiveSlots()} godzin tygodniowo aktywnych
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            saved ? "bg-green-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          style={{ fontWeight: 600 }}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Zapisano!
            </>
          ) : (
            "Zapisz dostępność"
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
        <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-indigo-700 text-sm leading-relaxed">
          Kliknij komórkę, aby ją zaznaczyć / odznaczyć. Przeciągnij myszą po wielu komórkach,
          aby zmienić kilka naraz.
        </p>
      </div>

      {/* Drag Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table style={{ minWidth: "640px", width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="border-b border-slate-100">
                <th
                  className="text-slate-400 text-xs pb-3 pt-4 pl-6 pr-4 text-left bg-slate-50"
                  style={{ width: "72px", fontWeight: 500 }}
                >
                  Godz.
                </th>
                {WEEK_DAYS_FULL.map((d, i) => (
                  <th
                    key={d}
                    className="text-slate-600 text-sm py-4 text-center bg-slate-50"
                    style={{ fontWeight: 600 }}
                  >
                    <div>{d.slice(0, 3)}</div>
                    <div className="text-xs text-slate-400 mt-0.5" style={{ fontWeight: 400 }}>
                      {WEEK_DAYS_FULL[i]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, si) => (
                <tr
                  key={slot}
                  className="border-b border-slate-50 last:border-b-0"
                >
                  <td className="text-slate-400 text-xs pl-6 pr-4 py-0 bg-slate-50/50" style={{ height: "40px" }}>
                    {slot}
                  </td>
                  {WEEK_DAYS_SHORT.map((_, day) => {
                    const key = `${day}-${slot}`;
                    const active = availability[key];
                    return (
                      <td
                        key={day}
                        className="text-center p-0.5 cursor-pointer"
                        onMouseDown={() => handleCellMouseDown(day, slot)}
                        onMouseEnter={() => handleCellMouseEnter(day, slot)}
                        onDragStart={(e) => e.preventDefault()}
                      >
                        <div
                          className="w-full rounded-lg transition-all"
                          style={{
                            height: "32px",
                            background: active ? "#6366F1" : "#F1F5F9",
                            border: active ? "none" : "1px solid #E2E8F0",
                            boxShadow: active ? "0 2px 4px rgba(99,102,241,0.25)" : "none",
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo-600" />
            <span className="text-xs text-slate-500">Dostępny</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200" />
            <span className="text-xs text-slate-500">Niedostępny</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── MOBILE VIEW ─────────────────────────────────────── */
  const MobileView = (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 pt-14 pb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <CalendarCheck className="w-6 h-6 text-indigo-400" />
          <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Moja Dostępność
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          {countActiveDays()} dni aktywnych
        </p>
      </div>

      <div className="px-5 py-6 space-y-4">
        <p className="text-slate-500 text-sm">
          Ustaw dostępne godziny dla każdego dnia tygodnia.
        </p>

        {WEEK_DAYS_FULL.map((dayName, day) => {
          const range = getTimeRangeForDay(day, availability);
          return (
            <div key={day} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-slate-800" style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                    {dayName}
                  </div>
                  {range.enabled && (
                    <div className="text-indigo-600 text-xs mt-1">
                      {range.from} – {range.to}
                    </div>
                  )}
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleDay(day, !range.enabled)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${
                    range.enabled ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      range.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {range.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-xs mb-1.5">Od</label>
                    <div className="relative">
                      <select
                        value={range.from}
                        onChange={(e) => handleFromChange(day, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        viewBox="0 0 20 20" fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs mb-1.5">Do</label>
                    <div className="relative">
                      <select
                        value={range.to}
                        onChange={(e) => handleToChange(day, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        viewBox="0 0 20 20" fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={handleSave}
          className={`w-full rounded-2xl py-5 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] min-h-[56px] ${
            saved ? "bg-green-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          style={{ fontWeight: 600 }}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Zapisano!
            </>
          ) : (
            "Zapisz dostępność"
          )}
        </button>
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
