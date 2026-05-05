import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SeoHead } from "../layout/SeoHead";
import {
  trackCtaClicked,
  trackContactFormSubmitted,
  trackPwaInstallPromptShown,
  trackAppInstalled,
} from "../../utils/analytics";
import {
  BookOpen, CheckCircle2, BarChart2, Calendar, Shield,
  Smartphone, FileText, Star, ChevronDown, Menu, X, Download,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const features = [
  { icon: Calendar, title: "Grafik Nauczycieli", desc: "Inteligentne planowanie zajęć z automatycznym wykrywaniem konfliktów sal i nauczycieli.", color: "#6366F1" },
  { icon: BookOpen, title: "Dziennik Elektroniczny", desc: "Kompletna dokumentacja postępów uczniów, obecności i ocen w jednym miejscu.", color: "#059669" },
  { icon: BarChart2, title: "Finanse i Raporty", desc: "Automatyczne zestawienia finansowe, stawki godzinowe i eksport do CSV/PDF.", color: "#DC2626" },
  { icon: FileText, title: "Raporty Okresowe", desc: "Generuj raporty miesięczne i semestralne jednym kliknięciem.", color: "#D97706" },
  { icon: Shield, title: "Zgodność z RODO", desc: "Dane uczniów i nauczycieli chronione zgodnie z przepisami RODO/GDPR.", color: "#7C3AED" },
  { icon: Smartphone, title: "Dostęp Mobilny PWA", desc: "Zainstaluj aplikację na telefonie i zarządzaj szkołą z dowolnego miejsca.", color: "#0891B2" },
];

const testimonials = [
  { name: "Marta Wiśniewska", role: "Dyrektor, SP nr 12 w Krakowie", text: "EduDash zredukował czas planowania grafiku o 70%. Konflikty sal to już przeszłość.", stars: 5 },
  { name: "Tomasz Kowalczyk", role: "Dyrektor, LO im. Kopernika", text: "Finanse i raporty, które kiedyś zajmowały cały dzień, teraz gotowe są w 5 minut.", stars: 5 },
  { name: "Anna Dąbrowska", role: "Wicedyrektor, Szkoła Językowa", text: "Nauczyciele uwielbiają panel mobilny. Dostępność i grafik zawsze pod ręką.", stars: 5 },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Dyrektor", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      trackPwaInstallPromptShown();
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setPwaInstalled(true);
      trackAppInstalled();
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setPwaInstalled(true);
      trackAppInstalled();
    }
    setDeferredPrompt(null);
  };

  const handleCta = (label: string) => {
    trackCtaClicked(label, "landing_hero");
    navigate("/");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    trackContactFormSubmitted(form.role);
    setFormLoading(false);
    setFormSent(true);
  };

  return (
    <>
      <SeoHead
        title="EduDash – Nowoczesny System Zarządzania Szkołą"
        description="Centrum dowodzenia dla dyrektorów i nauczycieli. Grafik, dziennik elektroniczny, finanse i raporty w jednej aplikacji PWA. Zgodność z RODO."
        canonical="https://edudash.pl/landing"
      />

      <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* ── NAV ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-900 font-bold text-lg">EduDash</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["Funkcje", "Korzyści PWA", "Opinie", "Kontakt"].map((label) => (
                <a key={label} href={`#${label.toLowerCase().replace(" ", "-")}`}
                  className="text-slate-600 text-sm hover:text-indigo-600 transition-colors font-medium">
                  {label}
                </a>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => { trackCtaClicked("Zaloguj się", "nav"); navigate("/"); }}
                className="text-slate-700 text-sm font-semibold hover:text-indigo-600 transition-colors px-4 py-2">
                Zaloguj się
              </button>
              <button id="nav-cta-demo"
                onClick={() => { trackCtaClicked("Wypróbuj bezpłatnie", "nav"); document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" }); }}
                className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                Wypróbuj bezpłatnie
              </button>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 space-y-3">
              {["Funkcje", "Korzyści PWA", "Opinie", "Kontakt"].map((label) => (
                <a key={label} href={`#${label.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-slate-700 text-sm font-medium py-1.5">
                  {label}
                </a>
              ))}
              <button onClick={() => { trackCtaClicked("Zaloguj się", "mobile_nav"); navigate("/"); }}
                className="w-full text-left text-slate-700 text-sm font-medium py-1.5">
                Zaloguj się
              </button>
              <button onClick={() => handleCta("Wypróbuj bezpłatnie – mobile")}
                className="w-full bg-indigo-600 text-white text-sm font-semibold px-4 py-3 rounded-xl">
                Wypróbuj bezpłatnie
              </button>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #818CF8, transparent)" }} />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #6366F1, transparent)" }} />
          </div>
          <div className="max-w-5xl mx-auto px-5 text-center relative">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-indigo-200 text-xs font-medium">Zaufany przez 500+ placówek w Polsce</span>
            </div>
            <h1 className="text-white mb-6 leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Centrum Dowodzenia dla<br />
              <span style={{ background: "linear-gradient(135deg, #818CF8, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Nowoczesnych Placówek
              </span>
            </h1>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontSize: "1.125rem" }}>
              EduDash to kompleksowy system zarządzania szkołą — grafik nauczycieli, dziennik elektroniczny,
              finanse i raporty w jednej aplikacji PWA. Zgodność z RODO gwarantowana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button id="hero-cta-primary"
                onClick={() => handleCta("Wypróbuj bezpłatnie")}
                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl hover:shadow-indigo-500/25 active:scale-95"
                style={{ fontSize: "1rem" }}>
                Wypróbuj bezpłatnie →
              </button>
              <button id="hero-cta-demo"
                onClick={() => { trackCtaClicked("Umów demo", "landing_hero"); document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" }); }}
                className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm"
                style={{ fontSize: "1rem" }}>
                Umów prezentację
              </button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
              {["✓ Bezpłatne demo", "✓ Bez karty kredytowej", "✓ Konfiguracja w 5 min", "✓ RODO-compliant"].map((item) => (
                <span key={item} className="font-medium">{item}</span>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to top, white, transparent)" }} />
        </section>

        {/* ── FEATURES ── */}
        <section id="funkcje" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-14">
              <h2 className="text-slate-900 mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800 }}>
                Wszystko czego potrzebuje Twoja szkoła
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto" style={{ fontSize: "1rem" }}>
                Jeden system zastępujący dziesiątki arkuszy kalkulacyjnych i papierowych rejestrów.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div key={title}
                  className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${color}18` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="text-slate-900 font-bold mb-2" style={{ fontSize: "1rem" }}>{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PWA BENEFITS ── */}
        <section id="korzyści-pwa" className="py-20"
          style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)" }}>
          <div className="max-w-5xl mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-3 py-1 mb-4">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-700 text-xs font-semibold">Aplikacja PWA</span>
                </div>
                <h2 className="text-slate-900 mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800 }}>
                  Zainstaluj EduDash na swoim urządzeniu
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Działa jak natywna aplikacja mobilna — bez pobierania ze sklepu. Działa offline,
                  ładuje się błyskawicznie i zawsze jest pod ręką.
                </p>
                <ul className="space-y-3 mb-8">
                  {["Dostęp offline bez internetu", "Powiadomienia push o nowych zajęciach", "Ikona na ekranie głównym telefonu", "Działa na iOS i Android"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {pwaInstalled ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-semibold text-sm">EduDash zainstalowany! ✓</span>
                  </div>
                ) : (
                  <button id="pwa-install-btn"
                    onClick={handleInstall}
                    className="flex items-center gap-2.5 bg-indigo-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95">
                    <Download className="w-5 h-5" />
                    Zainstaluj aplikację
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-50">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">EduDash</div>
                      <div className="text-slate-400 text-xs">System zarządzania szkołą</div>
                    </div>
                    <div className="ml-auto text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">Online</div>
                  </div>
                  {[
                    { label: "Lekcji dziś", val: "12", color: "#6366F1" },
                    { label: "Nauczycieli aktywnych", val: "8/10", color: "#059669" },
                    { label: "Do wypłaty w maju", val: "8 640 zł", color: "#DC2626" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                      <span className="text-slate-600 text-sm">{label}</span>
                      <span className="font-bold text-sm" style={{ color }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="opinie" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-12">
              <h2 className="text-slate-900 mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800 }}>
                Co mówią dyrektorzy szkół?
              </h2>
              <p className="text-slate-500 text-sm">Ponad 500 placówek edukacyjnych w Polsce</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map(({ name, role, text, stars }) => (
                <div key={name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-5">"{text}"</p>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT FORM (KONWERSJA MAKRO) ── */}
        <section id="kontakt" className="py-20"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)" }}>
          <div className="max-w-2xl mx-auto px-5">
            <div className="text-center mb-10">
              <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800 }}>
                Umów bezpłatną prezentację
              </h2>
              <p className="text-slate-400 text-sm">
                Pokażemy Ci jak EduDash może usprawnić zarządzanie Twoją placówką
              </p>
            </div>
            {formSent ? (
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2">Dziękujemy za kontakt!</h3>
                <p className="text-slate-300 text-sm">Skontaktujemy się z Tobą w ciągu 24 godzin.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1.5">Imię i nazwisko *</label>
                    <input required id="contact-name" type="text" placeholder="Jan Kowalski"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1.5">Adres e-mail *</label>
                    <input required id="contact-email" type="email" placeholder="dyrektor@szkola.pl"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-400 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Stanowisko</label>
                  <select id="contact-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-400 transition-colors">
                    <option value="Dyrektor" className="text-slate-900">Dyrektor</option>
                    <option value="Wicedyrektor" className="text-slate-900">Wicedyrektor</option>
                    <option value="Nauczyciel" className="text-slate-900">Nauczyciel</option>
                    <option value="Inne" className="text-slate-900">Inne</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1.5">Wiadomość</label>
                  <textarea id="contact-message" rows={3} placeholder="Opisz czego szukasz..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-400 transition-colors resize-none" />
                </div>
                <button id="contact-submit" type="submit" disabled={formLoading}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {formLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Wysyłanie...</>
                  ) : "Wyślij i umów prezentację →"}
                </button>
                <p className="text-slate-500 text-xs text-center">
                  🔒 Twoje dane są chronione zgodnie z RODO. Nie spamujemy.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-slate-950 py-10 px-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">EduDash</span>
              <span className="text-slate-500 text-sm ml-1">– System Zarządzania Szkołą</span>
            </div>
            <div className="flex gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Polityka Prywatności</a>
              <a href="#" className="hover:text-white transition-colors">RODO / GDPR</a>
              <a href="#" className="hover:text-white transition-colors">Regulamin</a>
              <a href="#kontakt" className="hover:text-white transition-colors">Kontakt</a>
            </div>
            <p className="text-slate-600 text-xs">© 2026 EduDash. Wszelkie prawa zastrzeżone.</p>
          </div>
        </footer>

        {/* Scroll indicator */}
        <a href="#funkcje"
          className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 md:hidden"
          aria-label="Przewiń w dół">
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </>
  );
}
