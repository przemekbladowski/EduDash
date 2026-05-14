import React from "react";
import { trackReportGenerated } from "../../utils/analytics";
import { SeoHead } from "../layout/SeoHead";
import { useState } from "react";
import {
  Download,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  lessons,
  teachers,
  rooms,
  getDurationHours,
} from "../../data/mockData";

const MONTH = "2026-04";
const MONTH_LABEL = "Kwiecień 2026";

function getRoomById(id: number) {
  return rooms.find((r) => r.id === id)!;
}

type TeacherReport = {
  teacher: (typeof teachers)[0];
  confirmedHours: number;
  pendingHours: number;
  totalHours: number;
  confirmedAmount: number;
  pendingAmount: number;
  totalAmount: number;
  lessonCount: number;
};

function HoursBarChart({
  data,
}: {
  data: { name: string; potwierdzone: number; oczekujące: number; color: string }[];
}) {
  const maxVal = Math.max(...data.flatMap((d) => [d.potwierdzone, d.oczekujące]), 1);
  const yTicks = [0, Math.ceil(maxVal / 2), Math.ceil(maxVal)];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
          <span className="text-xs text-slate-500">Potwierdzone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-yellow-300" />
          <span className="text-xs text-slate-500">Oczekujące</span>
        </div>
      </div>
      <div className="flex gap-1" style={{ height: 180 }}>
        <div className="flex flex-col justify-between items-end pr-2 pb-5" style={{ minWidth: 28 }}>
          {[...yTicks].reverse().map((t) => (
            <span key={`ytick-${t}`} className="text-slate-400" style={{ fontSize: 10 }}>
              {t}h
            </span>
          ))}
        </div>
        <div className="flex-1 flex items-end gap-3">
          {data.map((d, i) => (
            <div key={`bar-group-${i}`} className="flex-1 flex flex-col items-center gap-0">
              <div className="w-full flex items-end gap-0.5" style={{ height: 150 }}>
                <div
                  className="flex-1 rounded-t-[4px] bg-green-500 transition-all"
                  style={{
                    height: `${(d.potwierdzone / maxVal) * 150}px`,
                    minHeight: d.potwierdzone > 0 ? 4 : 0,
                  }}
                  title={`Potwierdzone: ${d.potwierdzone}h`}
                />
                <div
                  className="flex-1 rounded-t-[4px] bg-yellow-300 transition-all"
                  style={{
                    height: `${(d.oczekujące / maxVal) * 150}px`,
                    minHeight: d.oczekujące > 0 ? 4 : 0,
                  }}
                  title={`Oczekujące: ${d.oczekujące}h`}
                />
              </div>
              <span className="text-slate-500 mt-1" style={{ fontSize: 11 }}>
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CostShareChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = Math.round((d.value / total) * 100);
        return (
          <div key={`cost-${i}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-slate-600">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{pct}%</span>
                <span className="text-xs text-slate-800" style={{ fontWeight: 600 }}>
                  {d.value.toFixed(0)} zł
                </span>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminFinance() {
  const [selectedMonth, setSelectedMonth] = useState(MONTH);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null);

  const monthLessons = lessons.filter((l) => l.date.startsWith(selectedMonth));

  const reports: TeacherReport[] = teachers.map((teacher) => {
    const tLessons = monthLessons.filter((l) => l.teacherId === teacher.id);
    const confirmed = tLessons.filter((l) => l.status === "confirmed");
    const pending = tLessons.filter((l) => l.status === "pending");

    const confirmedHours = confirmed.reduce((acc, l) => acc + getDurationHours(l), 0);
    const pendingHours = pending.reduce((acc, l) => acc + getDurationHours(l), 0);
    const totalHours = confirmedHours + pendingHours;
    const confirmedAmount = confirmedHours * teacher.hourlyRate;
    const pendingAmount = pendingHours * teacher.hourlyRate;
    const totalAmount = totalHours * teacher.hourlyRate;

    return {
      teacher,
      confirmedHours,
      pendingHours,
      totalHours,
      confirmedAmount,
      pendingAmount,
      totalAmount,
      lessonCount: tLessons.length,
    };
  });

  const totalConfirmedAmount = reports.reduce((acc, r) => acc + r.confirmedAmount, 0);
  const totalPendingAmount = reports.reduce((acc, r) => acc + r.pendingAmount, 0);
  const totalAmount = reports.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalHours = reports.reduce((acc, r) => acc + r.totalHours, 0);
  const totalLessons = monthLessons.length;

  const chartData = reports.map((r) => ({
    name: r.teacher.name.split(" ")[0],
    potwierdzone: parseFloat(r.confirmedHours.toFixed(1)),
    oczekujące: parseFloat(r.pendingHours.toFixed(1)),
    color: r.teacher.color,
  }));

  const pieData = reports
    .filter((r) => r.totalAmount > 0)
    .map((r) => ({
      name: r.teacher.name.split(" ")[0],
      value: r.totalAmount,
      color: r.teacher.color,
    }));

  const handleDownloadCSV = () => {
    const headers = [
      "Nauczyciel",
      "Przedmiot",
      "Lekcji",
      "Godz. (potw.)",
      "Godz. (oczek.)",
      "Godz. łącznie",
      "Stawka/h",
      "Kwota (potw.)",
      "Kwota (oczek.)",
      "Kwota łącznie",
    ];

    const rows = reports.map((r) => [
      r.teacher.name,
      r.teacher.subject,
      r.lessonCount,
      r.confirmedHours.toFixed(2),
      r.pendingHours.toFixed(2),
      r.totalHours.toFixed(2),
      r.teacher.hourlyRate,
      r.confirmedAmount.toFixed(2),
      r.pendingAmount.toFixed(2),
      r.totalAmount.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raport_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    trackReportGenerated("csv", selectedMonth);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const MobileView = (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="bg-slate-900 text-white px-5 pt-14 pb-7">
        <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Finanse & Raporty
        </h1>
        <p className="text-slate-400 text-sm mt-1">{MONTH_LABEL}</p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-slate-400 text-xs mb-1">Łączny koszt</div>
            <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {totalAmount.toFixed(0)} zł
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-slate-400 text-xs mb-1">Do wypłaty</div>
            <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {totalConfirmedAmount.toFixed(0)} zł
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-slate-400 text-xs mb-1">Godzin łącznie</div>
            <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {totalHours.toFixed(1)}h
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-slate-400 text-xs mb-1">Lekcji</div>
            <div className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {totalLessons}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
          >
            <option value="2026-04" className="text-slate-900">Kwiecień 2026</option>
            <option value="2026-03" className="text-slate-900">Marzec 2026</option>
            <option value="2026-02" className="text-slate-900">Luty 2026</option>
            <option value="2026-01" className="text-slate-900">Styczeń 2026</option>
          </select>
          <button
            onClick={handleDownloadCSV}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h2 className="text-slate-900 mb-4 text-sm" style={{ fontWeight: 700 }}>
            Godziny według nauczyciela
          </h2>
          <HoursBarChart data={chartData} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h2 className="text-slate-900 mb-4 text-sm" style={{ fontWeight: 700 }}>
            Udział w kosztach
          </h2>
          <CostShareChart data={pieData} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-50">
            <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>
              Szczegółowe zestawienie
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {reports.map((r) => (
              <div key={r.teacher.id} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs shrink-0"
                    style={{ backgroundColor: r.teacher.color, fontWeight: 700 }}
                  >
                    {r.teacher.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>
                      {r.teacher.name}
                    </div>
                    <div className="text-slate-400 text-xs">{r.teacher.subject}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Lekcji: </span>
                    <span className="text-slate-800" style={{ fontWeight: 600 }}>{r.lessonCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Godz.: </span>
                    <span className="text-slate-800" style={{ fontWeight: 600 }}>{r.totalHours.toFixed(1)}h</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Stawka: </span>
                    <span className="text-slate-800" style={{ fontWeight: 600 }}>{r.teacher.hourlyRate} zł/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Do wypłaty: </span>
                    <span className="text-green-700" style={{ fontWeight: 700 }}>{r.confirmedAmount.toFixed(0)} zł</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const DesktopView = (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Finanse & Raporty
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">{MONTH_LABEL}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
          >
            <option value="2026-04">Kwiecień 2026</option>
            <option value="2026-03">Marzec 2026</option>
            <option value="2026-02">Luty 2026</option>
            <option value="2026-01">Styczeń 2026</option>
          </select>
          <button
            onClick={handleDownloadCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
              downloadSuccess
                ? "bg-green-600 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
            style={{ fontWeight: 600 }}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pobrano!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                CSV
              </>
            )}
          </button>
          <button
            onClick={() => {
              trackReportGenerated("pdf", selectedMonth);
              setDownloadSuccess(true);
              setTimeout(() => setDownloadSuccess(false), 2500);
            }}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs hover:bg-indigo-700 transition-colors"
            style={{ fontWeight: 600 }}
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3 flex-shrink-0">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {totalAmount.toFixed(0)} zł
          </div>
          <div className="text-slate-500 text-xs">Łączny koszt</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {totalConfirmedAmount.toFixed(0)} zł
          </div>
          <div className="text-slate-500 text-xs">Do wypłaty</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {totalHours.toFixed(1)}h
          </div>
          <div className="text-slate-500 text-xs">Godzin łącznie</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {totalLessons}
          </div>
          <div className="text-slate-500 text-xs">Lekcji w miesiącu</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 flex-shrink-0">
        <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <h2 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>
            Godziny według nauczyciela
          </h2>
          <HoursBarChart data={chartData} />
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
          <h2 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>
            Udział w kosztach
          </h2>
          <CostShareChart data={pieData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-slate-50 flex-shrink-0">
          <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>
            Szczegółowe zestawienie
          </h2>
          <span className="text-slate-400 text-xs">{MONTH_LABEL}</span>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-50">
                <th className="text-left text-slate-500 text-xs px-3 py-2">Nauczyciel</th>
                <th className="text-right text-slate-500 text-xs px-3 py-2">Lekcji</th>
                <th className="text-right text-slate-500 text-xs px-3 py-2">Godz. potw.</th>
                <th className="text-right text-slate-500 text-xs px-3 py-2">Godz. łącznie</th>
                <th className="text-right text-slate-500 text-xs px-3 py-2">Stawka</th>
                <th className="text-right text-slate-500 text-xs px-3 py-2">Do wypłaty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((r) => (
                <React.Fragment key={r.teacher.id}>
                  <tr
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() =>
                      setExpandedTeacher(
                        expandedTeacher === r.teacher.id ? null : r.teacher.id
                      )
                    }
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: r.teacher.color, fontWeight: 700, fontSize: "0.65rem" }}
                        >
                          {r.teacher.initials}
                        </div>
                        <div>
                          <div className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>
                            {r.teacher.name}
                          </div>
                          <div className="text-slate-400" style={{ fontSize: "0.65rem" }}>{r.teacher.subject}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right text-slate-600 text-xs px-3 py-2.5">
                      {r.lessonCount}
                    </td>
                    <td className="text-right text-xs px-3 py-2.5">
                      <span className="text-green-700">{r.confirmedHours.toFixed(1)}h</span>
                    </td>
                    <td className="text-right text-slate-600 text-xs px-3 py-2.5">
                      {r.totalHours.toFixed(1)}h
                    </td>
                    <td className="text-right text-slate-400 text-xs px-3 py-2.5">
                      {r.teacher.hourlyRate} zł/h
                    </td>
                    <td className="text-right px-3 py-2.5">
                      <div className="text-slate-900 text-xs" style={{ fontWeight: 700 }}>
                        {r.confirmedAmount.toFixed(0)} zł
                      </div>
                      {r.pendingAmount > 0 && (
                        <div className="text-amber-500" style={{ fontSize: "0.65rem" }}>
                          +{r.pendingAmount.toFixed(0)} zł oczek.
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedTeacher === r.teacher.id && (
                    <tr>
                      <td colSpan={6} className="px-3 py-2 bg-slate-50">
                        <div className="space-y-1">
                          {monthLessons
                            .filter((l) => l.teacherId === r.teacher.id)
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .map((l) => {
                              const room = getRoomById(l.roomId);
                              const hours = getDurationHours(l);
                              return (
                                <div
                                  key={l.id}
                                  className="flex items-center justify-between py-0.5"
                                >
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <div
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ backgroundColor: room.dot }}
                                    />
                                    <span style={{ fontSize: "0.65rem" }}>
                                      {new Date(l.date).toLocaleDateString("pl-PL", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                    <span style={{ fontSize: "0.65rem" }}>{l.startTime}–{l.endTime}</span>
                                    <span className="text-slate-700" style={{ fontSize: "0.65rem" }}>{l.student}</span>
                                    <span
                                      className="px-1 py-0.5 rounded-full"
                                      style={{
                                        background: room.bg,
                                        color: room.text,
                                        fontSize: "0.6rem",
                                      }}
                                    >
                                      {room.shortName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2" style={{ fontSize: "0.65rem" }}>
                                    <span className="text-slate-500">{hours}h</span>
                                    <span className="text-slate-800" style={{ fontWeight: 600 }}>
                                      {(hours * r.teacher.hourlyRate).toFixed(0)} zł
                                    </span>
                                    <span
                                      className={`px-1 py-0.5 rounded-full ${
                                        l.status === "confirmed"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                      style={{ fontSize: "0.6rem" }}
                                    >
                                      {l.status === "confirmed" ? "✓" : "Oczek."}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
    </>
  );
}
