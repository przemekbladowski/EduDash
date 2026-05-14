import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wallet,
  Download,
  Filter,
} from "lucide-react";
import { lessons, rooms, getDurationHours } from "../../data/mockData";

const monthlyData = [
  { month: "Sty", hours: 32, amount: 2560 },
  { month: "Lut", hours: 28, amount: 2240 },
  { month: "Mar", hours: 35, amount: 2800 },
  { month: "Kwi", hours: 28.5, amount: 2280 },
];

const AVAILABLE_MONTHS = [
  { value: "2026-04", label: "Kwiecień 2026" },
  { value: "2026-03", label: "Marzec 2026" },
  { value: "2026-02", label: "Luty 2026" },
];

function getRoomById(id: number) {
  return rooms.find((r) => r.id === id)!;
}

/* ── Custom bar chart (no recharts) ─────────────────────── */
function MonthlyEarningsChart({
  data,
  color = "#6366F1",
}: {
  data: { month: string; amount: number }[];
  color?: string;
}) {
  const maxVal = Math.max(...data.map((d) => d.amount), 1);
  return (
    <div className="flex items-end gap-2" style={{ height: 130 }}>
      {data.map((d, i) => (
        <div key={`bar-${i}`} className="flex-1 flex flex-col items-center gap-0">
          <div
            className="w-full rounded-t-[5px] transition-all"
            style={{
              height: `${(d.amount / maxVal) * 100}px`,
              backgroundColor: color,
              minHeight: 4,
            }}
            title={`${d.amount} zł`}
          />
          <div className="mt-1 text-center">
            <span className="text-slate-400 block" style={{ fontSize: 10 }}>
              {d.month}
            </span>
            <span className="text-slate-500 block" style={{ fontSize: 9 }}>
              {(d.amount / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

export function TeacherFinance() {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2026-04");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const myLessons = lessons.filter((l) => l.teacherId === user?.id);
  const hourlyRate = user?.hourlyRate ?? 80;

  const currentMonthLessons = myLessons.filter((l) => l.date.startsWith(selectedMonth));
  const confirmedLessons = currentMonthLessons.filter((l) => l.status === "confirmed");
  const pendingLessons = currentMonthLessons.filter((l) => l.status === "pending");

  const confirmedHours = confirmedLessons.reduce((acc, l) => acc + getDurationHours(l), 0);
  const pendingHours = pendingLessons.reduce((acc, l) => acc + getDurationHours(l), 0);
  const confirmedAmount = confirmedHours * hourlyRate;
  const pendingAmount = pendingHours * hourlyRate;
  const totalAmount = confirmedAmount + pendingAmount;
  const totalHours = confirmedHours + pendingHours;

  const sortedLessons = [...currentMonthLessons].sort((a, b) => b.date.localeCompare(a.date));

  const handleDownloadPDF = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const monthLabel =
    AVAILABLE_MONTHS.find((m) => m.value === selectedMonth)?.label ?? selectedMonth;

  /* ── DESKTOP VIEW ────────────────────────────────────── */
  const DesktopView = (
    <div className="p-6 xl:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.625rem", fontWeight: 700 }}>
            Finanse
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Zestawienie wynagrodzenia</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              {AVAILABLE_MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleDownloadPDF}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
              downloadSuccess
                ? "bg-green-600 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            style={{ fontWeight: 600 }}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Pobrano!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Pobierz zestawienie PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: summary + chart */}
        <div className="col-span-4 space-y-4">
          {/* Earnings card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <p className="text-slate-400 text-sm">{monthLabel}</p>
            <p className="text-white mt-1" style={{ fontSize: "2.25rem", fontWeight: 700 }}>
              {totalAmount.toFixed(0)} zł
            </p>
            <p className="text-slate-400 text-sm mt-0.5">Prognozowane wynagrodzenie</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  Potwierdzone
                </div>
                <div className="text-white" style={{ fontWeight: 700 }}>
                  {confirmedAmount.toFixed(0)} zł
                </div>
                <div className="text-slate-400 text-xs">{confirmedHours.toFixed(1)}h</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Oczekujące
                </div>
                <div className="text-white" style={{ fontWeight: 700 }}>
                  {pendingAmount.toFixed(0)} zł
                </div>
                <div className="text-slate-400 text-xs">{pendingHours.toFixed(1)}h</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center">
              <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {totalHours.toFixed(1)}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Godzin</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center">
              <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {currentMonthLessons.length}
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Lekcji</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center">
              <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {hourlyRate} zł
              </div>
              <div className="text-slate-500 text-xs mt-0.5">Stawka/h</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
                Ostatnie miesiące
              </span>
            </div>
            <MonthlyEarningsChart data={monthlyData} />
          </div>

          {/* Note */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <p className="text-indigo-700 text-xs leading-relaxed">
              💡 Wynagrodzenie za lekcje „oczekujące" zostanie naliczone po potwierdzeniu przez
              administratora.
            </p>
          </div>
        </div>

        {/* Right: detailed table */}
        <div className="col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <h2 className="text-slate-900" style={{ fontWeight: 700 }}>
                Historia przepracowanych godzin
              </h2>
              <span className="text-slate-400 text-sm">{currentMonthLessons.length} wpisów</span>
            </div>

            {currentMonthLessons.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Brak lekcji w wybranym miesiącu
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="text-left text-xs text-slate-400 px-6 py-3" style={{ fontWeight: 500 }}>Data</th>
                      <th className="text-left text-xs text-slate-400 px-4 py-3" style={{ fontWeight: 500 }}>Uczeń</th>
                      <th className="text-left text-xs text-slate-400 px-4 py-3" style={{ fontWeight: 500 }}>Przedmiot</th>
                      <th className="text-left text-xs text-slate-400 px-4 py-3" style={{ fontWeight: 500 }}>Sala</th>
                      <th className="text-left text-xs text-slate-400 px-4 py-3" style={{ fontWeight: 500 }}>Godziny</th>
                      <th className="text-right text-xs text-slate-400 px-4 py-3" style={{ fontWeight: 500 }}>Kwota</th>
                      <th className="text-center text-xs text-slate-400 px-4 py-3" style={{ fontWeight: 500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLessons.map((lesson) => {
                      const room = getRoomById(lesson.roomId);
                      const hours = getDurationHours(lesson);
                      const amount = hours * hourlyRate;
                      const isConfirmed = lesson.status === "confirmed";
                      return (
                        <tr
                          key={lesson.id}
                          className={`border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors ${
                            isConfirmed ? "" : "opacity-80"
                          }`}
                        >
                          <td className="px-6 py-3.5 text-slate-500 text-sm tabular-nums">
                            {new Date(lesson.date).toLocaleDateString("pl-PL", {
                              day: "numeric",
                              month: "short",
                            })}
                            <div className="text-slate-400 text-xs">
                              {lesson.startTime}–{lesson.endTime}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-slate-800 text-sm" style={{ fontWeight: 500 }}>
                              {lesson.student}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 text-sm">{lesson.subject}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                              style={{
                                background: room.bg,
                                color: room.text,
                                border: `1px solid ${room.border}`,
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: room.dot }}
                              />
                              {room.shortName}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 text-sm tabular-nums">
                            {hours.toFixed(1)}h
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-slate-900 text-sm tabular-nums" style={{ fontWeight: 600 }}>
                              {amount.toFixed(0)} zł
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {isConfirmed ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                Potwierdzona
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                Oczekuje
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t-2 border-slate-100">
                      <td colSpan={4} className="px-6 py-4 text-slate-700 text-sm" style={{ fontWeight: 600 }}>
                        Suma ({monthLabel})
                      </td>
                      <td className="px-4 py-4 text-slate-700 text-sm tabular-nums" style={{ fontWeight: 600 }}>
                        {totalHours.toFixed(1)}h
                      </td>
                      <td className="px-4 py-4 text-right text-slate-900 tabular-nums" style={{ fontWeight: 700, fontSize: "1rem" }}>
                        {totalAmount.toFixed(0)} zł
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── MOBILE VIEW ─────────────────────────────────────── */
  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white px-5 pt-14 pb-8">
        <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Finanse
        </h1>
        <p className="text-slate-400 text-sm mt-1">{monthLabel}</p>

        <div className="bg-white/10 rounded-2xl p-6 mt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Prognozowane wynagrodzenie</p>
              <p className="text-white mt-1" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}>
                {totalAmount.toFixed(0)} zł
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> Potwierdzone
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                  {confirmedAmount.toFixed(0)} zł
                </div>
                <div className="text-slate-400 text-sm">{confirmedHours.toFixed(1)}h</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-amber-400" /> Oczekujące
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                  {pendingAmount.toFixed(0)} zł
                </div>
                <div className="text-slate-400 text-sm">{pendingHours.toFixed(1)}h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 w-full">
        {/* Stats - vertical stack */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
            <div className="text-slate-600 text-sm">Godzin łącznie</div>
            <div className="text-slate-900" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
              {totalHours.toFixed(1)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
              <div className="text-slate-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {currentMonthLessons.length}
              </div>
              <div className="text-slate-500 text-xs mt-1">Lekcji</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
              <div className="text-slate-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {hourlyRate} zł
              </div>
              <div className="text-slate-500 text-xs mt-1">Stawka/h</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
              Wynagrodzenie — ostatnie miesiące
            </span>
          </div>
          <MonthlyEarningsChart data={monthlyData} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-5 active:bg-slate-50 transition-colors min-h-[60px]"
          >
            <span className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
              Historia lekcji ({currentMonthLessons.length})
            </span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {showDetails && (
            <div className="border-t border-slate-50">
              {sortedLessons.map((lesson, i) => {
                const room = getRoomById(lesson.roomId);
                const hours = getDurationHours(lesson);
                const amount = hours * hourlyRate;
                return (
                  <div
                    key={lesson.id}
                    className={`px-4 py-4 ${
                      i < sortedLessons.length - 1 ? "border-b border-slate-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: room.border }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-800 text-sm font-medium">{lesson.student}</div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          {new Date(lesson.date).toLocaleDateString("pl-PL", {
                            day: "numeric",
                            month: "short",
                          })} · {lesson.startTime} · {hours}h
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-5">
                      <div className={`text-xs ${lesson.status === "confirmed" ? "text-green-600" : "text-amber-500"}`}>
                        {lesson.status === "confirmed" ? "✓ Potwierdzona" : "⏳ Oczekuje"}
                      </div>
                      <div className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>
                        {amount.toFixed(0)} zł
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-indigo-700 text-xs leading-relaxed">
            💡 Wynagrodzenie za lekcje „oczekujące" zostanie naliczone po potwierdzeniu przez
            administratora. Raporty płacowe generuje admin.
          </p>
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
