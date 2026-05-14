import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";
import { trackLoginSuccess, trackLoginFailure } from "../../utils/analytics";
import { SeoHead } from "../layout/SeoHead";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = login(email, password);
    setLoading(false);
    if (success) {
      const role = email === "admin@szkola.pl" ? "admin" : "teacher";
      trackLoginSuccess(role);
      if (email === "admin@szkola.pl") {
        navigate("/admin");
      } else {
        navigate("/onboarding");
      }
    } else {
      trackLoginFailure();
      setError("Nieprawidłowy e-mail lub hasło. Sprawdź dane i spróbuj ponownie.");
    }
  };

  const quickLogin = (acc: string) => {
    if (acc === "teacher") {
      setEmail("anna@szkola.pl");
      setPassword("123456");
    } else {
      setEmail("admin@szkola.pl");
      setPassword("123456");
    }
  };

  if (showForgot) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-5 overflow-hidden">
        <div className="w-full max-w-[400px] px-4 sm:px-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
            <button
              onClick={() => setShowForgot(false)}
              className="text-slate-500 text-sm mb-5 flex items-center gap-1 hover:text-slate-800 transition-colors py-2"
            >
              ← Powrót
            </button>
            <h1 className="text-slate-900 mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Odzyskaj hasło
            </h1>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">
              Podaj swój adres e-mail, a wyślemy Ci link do resetowania hasła.
            </p>
            {forgotSent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800 text-sm text-center">
                ✓ Link wysłany! Sprawdź swoją skrzynkę e-mail.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all mb-3"
                />
                <button
                  onClick={() => setForgotSent(true)}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Wyślij link
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <SeoHead title="Logowanie" description="Zaloguj się do systemu EduDash – centrum dowodzenia dla dyrektorów i nauczycieli." />
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366F1, transparent)" }}
        />
        <div
          className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #818CF8, transparent)" }}
        />
      </div>

      <div className="w-full max-w-[400px] relative px-4 sm:px-0">
        {/* Logo */}
        <div className="text-center mb-4 lg:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 bg-indigo-600 rounded-2xl mb-3 shadow-lg">
            <BookOpen className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1
            className="text-white mb-1"
            style={{ fontSize: "1.25rem", fontWeight: 700 }}
          >
            EduPlan
          </h1>
          <p className="text-slate-400 text-xs">System zarządzania szkołą</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-5 lg:p-8">
          <h2
            className="text-slate-900 mb-4 lg:mb-6"
            style={{ fontSize: "1rem", fontWeight: 700 }}
          >
            Zaloguj się
          </h2>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-700 text-xs mb-1.5 font-medium">
                Adres e-mail
              </label>
              <input
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-700 text-xs mb-1.5 font-medium">
                Hasło
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-11 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </button>
          </form>

          <button
            onClick={() => setShowForgot(true)}
            className="w-full text-center text-indigo-600 text-xs mt-3 hover:text-indigo-800 transition-colors py-1.5 flex items-center justify-center"
          >
            Zapomniałem hasła
          </button>

          {/* Demo shortcuts */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-slate-400 text-xs text-center mb-2.5 font-medium">
              Demo — szybkie logowanie
            </p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin("teacher")}
                className="w-full bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] transition-all flex items-center gap-2.5"
              >
                <div className="text-base">👩‍🏫</div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-xs">Nauczyciel</div>
                  <div className="text-slate-400" style={{ fontSize: "0.65rem" }}>anna@szkola.pl</div>
                </div>
              </button>
              <button
                onClick={() => quickLogin("admin")}
                className="w-full bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] transition-all flex items-center gap-2.5"
              >
                <div className="text-base">🔧</div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-xs">Administrator</div>
                  <div className="text-slate-400" style={{ fontSize: "0.65rem" }}>admin@szkola.pl</div>
                </div>
              </button>
            </div>
            <p className="text-slate-300 text-xs text-center mt-2.5">Hasło: 123456</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
