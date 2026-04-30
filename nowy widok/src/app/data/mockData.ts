export type Room = {
  id: number;
  name: string;
  shortName: string;
  bg: string;
  text: string;
  border: string;
  light: string;
  dot: string;
};

export type Teacher = {
  id: number;
  name: string;
  subject: string;
  email: string;
  hourlyRate: number;
  color: string;
  initials: string;
};

export type Lesson = {
  id: number;
  teacherId: number;
  roomId: number;
  student: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
};

export type Availability = {
  teacherId: number;
  day: number; // 0=Mon, 1=Tue, ... 6=Sun
  slot: string; // "09:00"
  available: boolean;
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "Sala Żółta",
    shortName: "Żółta",
    bg: "#FEF9C3",
    text: "#713F12",
    border: "#EAB308",
    light: "#FEF08A",
    dot: "#CA8A04",
  },
  {
    id: 2,
    name: "Sala Niebieska",
    shortName: "Niebieska",
    bg: "#DBEAFE",
    text: "#1E3A8A",
    border: "#3B82F6",
    light: "#BFDBFE",
    dot: "#2563EB",
  },
  {
    id: 3,
    name: "Sala Zielona",
    shortName: "Zielona",
    bg: "#DCFCE7",
    text: "#14532D",
    border: "#22C55E",
    light: "#BBF7D0",
    dot: "#16A34A",
  },
  {
    id: 4,
    name: "Sala Czerwona",
    shortName: "Czerwona",
    bg: "#FEE2E2",
    text: "#7F1D1D",
    border: "#EF4444",
    light: "#FECACA",
    dot: "#DC2626",
  },
];

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Anna Kowalska",
    subject: "Matematyka",
    email: "anna@szkola.pl",
    hourlyRate: 80,
    color: "#6366F1",
    initials: "AK",
  },
  {
    id: 2,
    name: "Piotr Nowak",
    subject: "Fizyka",
    email: "piotr@szkola.pl",
    hourlyRate: 75,
    color: "#059669",
    initials: "PN",
  },
  {
    id: 3,
    name: "Maria Wiśniewska",
    subject: "Chemia",
    email: "maria@szkola.pl",
    hourlyRate: 80,
    color: "#DC2626",
    initials: "MW",
  },
  {
    id: 4,
    name: "Tomasz Zając",
    subject: "J. Angielski",
    email: "tomasz@szkola.pl",
    hourlyRate: 70,
    color: "#D97706",
    initials: "TZ",
  },
  {
    id: 5,
    name: "Katarzyna Lewandowska",
    subject: "Biologia",
    email: "katarzyna@szkola.pl",
    hourlyRate: 75,
    color: "#7C3AED",
    initials: "KL",
  },
];

export const lessons: Lesson[] = [
  // Today - 2026-04-30 (Anna's lessons)
  {
    id: 1,
    teacherId: 1,
    roomId: 1,
    student: "Karol Malinowski",
    subject: "Matematyka",
    date: "2026-04-30",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: 2,
    teacherId: 1,
    roomId: 2,
    student: "Zofia Krawczyk",
    subject: "Matematyka",
    date: "2026-04-30",
    startTime: "10:30",
    endTime: "12:00",
    status: "confirmed",
  },
  {
    id: 3,
    teacherId: 1,
    roomId: 1,
    student: "Jan Brzozowski",
    subject: "Matematyka",
    date: "2026-04-30",
    startTime: "13:00",
    endTime: "14:00",
    status: "pending",
  },
  {
    id: 4,
    teacherId: 1,
    roomId: 3,
    student: "Alicja Dąbrowska",
    subject: "Matematyka",
    date: "2026-04-30",
    startTime: "15:30",
    endTime: "16:30",
    status: "pending",
  },
  // Other teachers today
  {
    id: 5,
    teacherId: 2,
    roomId: 3,
    student: "Marek Wiśniewski",
    subject: "Fizyka",
    date: "2026-04-30",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: 6,
    teacherId: 3,
    roomId: 4,
    student: "Julia Kowalczyk",
    subject: "Chemia",
    date: "2026-04-30",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
  },
  {
    id: 7,
    teacherId: 4,
    roomId: 2,
    student: "Bartosz Lewandowski",
    subject: "Angielski",
    date: "2026-04-30",
    startTime: "11:00",
    endTime: "12:00",
    status: "pending",
  },
  {
    id: 8,
    teacherId: 2,
    roomId: 4,
    student: "Natalia Zając",
    subject: "Fizyka",
    date: "2026-04-30",
    startTime: "14:00",
    endTime: "15:00",
    status: "pending",
  },
  // CONFLICT! - same room (4) same time
  {
    id: 9,
    teacherId: 5,
    roomId: 4,
    student: "Michał Szymański",
    subject: "Biologia",
    date: "2026-04-30",
    startTime: "14:00",
    endTime: "15:00",
    status: "pending",
  },
  {
    id: 10,
    teacherId: 5,
    roomId: 2,
    student: "Agnieszka Kowalczyk",
    subject: "Biologia",
    date: "2026-04-30",
    startTime: "16:00",
    endTime: "17:00",
    status: "pending",
  },
  // Tomorrow - 2026-05-01
  {
    id: 11,
    teacherId: 1,
    roomId: 2,
    student: "Karol Malinowski",
    subject: "Matematyka",
    date: "2026-05-01",
    startTime: "10:00",
    endTime: "11:00",
    status: "pending",
  },
  {
    id: 12,
    teacherId: 2,
    roomId: 3,
    student: "Marek Wiśniewski",
    subject: "Fizyka",
    date: "2026-05-01",
    startTime: "11:00",
    endTime: "12:00",
    status: "pending",
  },
  {
    id: 13,
    teacherId: 3,
    roomId: 1,
    student: "Julia Kowalczyk",
    subject: "Chemia",
    date: "2026-05-01",
    startTime: "09:00",
    endTime: "10:00",
    status: "pending",
  },
  {
    id: 14,
    teacherId: 4,
    roomId: 4,
    student: "Bartosz Lewandowski",
    subject: "Angielski",
    date: "2026-05-01",
    startTime: "13:00",
    endTime: "14:00",
    status: "pending",
  },
  // 2026-05-02
  {
    id: 15,
    teacherId: 1,
    roomId: 1,
    student: "Zofia Krawczyk",
    subject: "Matematyka",
    date: "2026-05-02",
    startTime: "09:00",
    endTime: "10:30",
    status: "pending",
  },
  {
    id: 16,
    teacherId: 4,
    roomId: 2,
    student: "Bartosz Lewandowski",
    subject: "Angielski",
    date: "2026-05-02",
    startTime: "13:00",
    endTime: "14:00",
    status: "pending",
  },
  // Past lessons (for finance)
  {
    id: 17,
    teacherId: 1,
    roomId: 1,
    student: "Karol Malinowski",
    subject: "Matematyka",
    date: "2026-04-28",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: 18,
    teacherId: 1,
    roomId: 2,
    student: "Zofia Krawczyk",
    subject: "Matematyka",
    date: "2026-04-28",
    startTime: "10:30",
    endTime: "12:00",
    status: "confirmed",
  },
  {
    id: 19,
    teacherId: 1,
    roomId: 3,
    student: "Jan Brzozowski",
    subject: "Matematyka",
    date: "2026-04-25",
    startTime: "13:00",
    endTime: "14:00",
    status: "confirmed",
  },
  {
    id: 20,
    teacherId: 1,
    roomId: 1,
    student: "Alicja Dąbrowska",
    subject: "Matematyka",
    date: "2026-04-25",
    startTime: "15:00",
    endTime: "16:00",
    status: "confirmed",
  },
  {
    id: 21,
    teacherId: 1,
    roomId: 2,
    student: "Karol Malinowski",
    subject: "Matematyka",
    date: "2026-04-22",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: 22,
    teacherId: 1,
    roomId: 1,
    student: "Zofia Krawczyk",
    subject: "Matematyka",
    date: "2026-04-22",
    startTime: "11:00",
    endTime: "12:00",
    status: "confirmed",
  },
  {
    id: 23,
    teacherId: 1,
    roomId: 3,
    student: "Jan Brzozowski",
    subject: "Matematyka",
    date: "2026-04-21",
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
  },
  {
    id: 24,
    teacherId: 1,
    roomId: 4,
    student: "Alicja Dąbrowska",
    subject: "Matematyka",
    date: "2026-04-21",
    startTime: "16:00",
    endTime: "17:00",
    status: "confirmed",
  },
  // Past for other teachers
  {
    id: 25,
    teacherId: 2,
    roomId: 3,
    student: "Marek Wiśniewski",
    subject: "Fizyka",
    date: "2026-04-28",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: 26,
    teacherId: 3,
    roomId: 4,
    student: "Julia Kowalczyk",
    subject: "Chemia",
    date: "2026-04-28",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
  },
  {
    id: 27,
    teacherId: 4,
    roomId: 2,
    student: "Bartosz Lewandowski",
    subject: "Angielski",
    date: "2026-04-25",
    startTime: "11:00",
    endTime: "12:00",
    status: "confirmed",
  },
  {
    id: 28,
    teacherId: 5,
    roomId: 1,
    student: "Michał Szymański",
    subject: "Biologia",
    date: "2026-04-22",
    startTime: "16:00",
    endTime: "17:00",
    status: "confirmed",
  },
];

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const getDurationMinutes = (lesson: Lesson): number => {
  return timeToMinutes(lesson.endTime) - timeToMinutes(lesson.startTime);
};

export const getDurationHours = (lesson: Lesson): number => {
  return getDurationMinutes(lesson) / 60;
};

export const detectConflicts = (dayLessons: Lesson[]): Set<number> => {
  const conflictIds = new Set<number>();
  for (let i = 0; i < dayLessons.length; i++) {
    for (let j = i + 1; j < dayLessons.length; j++) {
      const a = dayLessons[i];
      const b = dayLessons[j];
      if (a.roomId === b.roomId) {
        const aStart = timeToMinutes(a.startTime);
        const aEnd = timeToMinutes(a.endTime);
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        if (aStart < bEnd && bStart < aEnd) {
          conflictIds.add(a.id);
          conflictIds.add(b.id);
        }
      }
    }
  }
  return conflictIds;
};

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export const WEEK_DAYS_SHORT = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"];
export const WEEK_DAYS_FULL = [
  "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela",
];

export const getWeekDates = (offset = 0): Date[] => {
  const today = new Date("2026-04-30");
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
};
