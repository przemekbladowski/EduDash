import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Calendar, BellRing, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: <Calendar className="w-12 h-12 text-indigo-600" />,
    bg: "bg-indigo-50",
    dot: "bg-indigo-600",
    title: "Sprawdź grafik w 3 sekundy",
    description:
      "Twój dzisiejszy plan lekcji jest widoczny od razu po zalogowaniu. Sala, godzina, uczeń — wszystko na jednym ekranie.",
    visual: (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mt-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#EAB308" }}
          />
          <span className="text-slate-600 text-sm">09:00 – 10:00</span>
        </div>
        <div className="text-slate-900 text-sm font-medium">Karol Malinowski</div>
        <div className="text-slate-500 text-xs mt-1">Matematyka · Sala Żółta</div>
        <div className="mt-3 inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          Sala Żółta
        </div>
      </div>
    ),
  },
  {
    icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
    bg: "bg-green-50",
    dot: "bg-green-600",
    title: "Potwierdź lekcję jednym kliknięciem",
    description:
      "Duży zielony przycisk — kliknij po zakończeniu lekcji. Twoje wynagrodzenie nalicza się automatycznie.",
    visual: (
      <div className="mt-6">
        <button className="w-full bg-green-500 text-white rounded-2xl py-5 flex items-center justify-center gap-3 shadow-lg shadow-green-200">
          <CheckCircle2 className="w-7 h-7" />
          <span className="text-base font-medium">Potwierdź realizację lekcji</span>
        </button>
        <p className="text-center text-slate-400 text-xs mt-3">
          Lekcja z Karolem Malinowskim · 1h
        </p>
      </div>
    ),
  },
  {
    icon: <BellRing className="w-12 h-12 text-amber-600" />,
    bg: "bg-amber-50",
    dot: "bg-amber-600",
    title: "Zgłoś problem błyskawicznie",
    description:
      "Awaria w sali? Jeden przycisk wyśle powiadomienie do administratora. Bez telefonów, bez stresu.",
    visual: (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mt-6 space-y-3">
        <button className="w-full border-2 border-amber-300 bg-amber-50 text-amber-800 rounded-xl py-3 text-sm flex items-center justify-center gap-2">
          <BellRing className="w-4 h-4" />
          Zgłoś awarię w sali
        </button>
        <button className="w-full border-2 border-slate-200 bg-slate-50 text-slate-700 rounded-xl py-3 text-sm flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Zgłoś niedostępność
        </button>
      </div>
    ),
  },
];

export function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/teacher");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-10">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-indigo-600"
                  : i < current
                  ? "w-8 bg-indigo-300"
                  : "w-8 bg-slate-200"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => navigate("/teacher")}
          className="text-slate-400 text-sm hover:text-slate-600 min-h-[44px] px-3"
        >
          Pomiń
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-10 flex flex-col">
        {/* Icon */}
        <div
          className={`w-24 h-24 ${slide.bg} rounded-3xl flex items-center justify-center mb-8 mt-6`}
        >
          {slide.icon}
        </div>

        {/* Text */}
        <h1
          className="text-slate-900 mb-4"
          style={{ fontSize: "1.625rem", fontWeight: 700, lineHeight: 1.2 }}
        >
          {slide.title}
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed" style={{ fontSize: "0.9375rem" }}>
          {slide.description}
        </p>

        {/* Visual */}
        {slide.visual}

        {/* Navigation */}
        <div className="mt-auto pt-10">
          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white rounded-2xl py-5 flex items-center justify-center gap-2.5 hover:bg-slate-800 active:scale-[0.98] transition-all min-h-[56px]"
          >
            <span className="font-semibold text-base">
              {isLast ? "Zaczynamy!" : "Dalej"}
            </span>
            {!isLast && <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  i === current ? "bg-slate-900 w-6" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
