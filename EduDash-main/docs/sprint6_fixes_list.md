# 🔧 Lista Wprowadzonych Poprawek – Sprint 6
## EduDash | 14 maja 2026

---

## Podsumowanie

| Kategoria | Ilość | Status |
|---|---|---|
| Poprawki krytyczne (P1) | 2 | ✅ Wszystkie naprawione |
| Poprawki ważne (P2) | 6 | ✅ Wszystkie naprawione |
| Poprawki drobne (P3) | 4 | ⏳ Zaplanowane na Sprint 7 |
| **RAZEM** | **12** | **8/12 naprawionych** |

---

## Poprawki zrealizowane w Sprint 6

### P1 — Krytyczne

| # | Problem | Plik(i) | Zmiana | Powód |
|---|---|---|---|---|
| P1-1 | Niespójny branding: sidebar i login mówią „EduPlan", landing/README mówią „EduDash" | `LoginPage.tsx`, `TeacherLayout.tsx`, `AdminLayout.tsx` | Zmieniono wszystkie wystąpienia „EduPlan" → „EduDash" | Spójność marki kluczowa przed uruchomieniem kampanii SEM |
| P1-2 | Brak dynamicznego SEO (SeoHead) na dashboardach | `TeacherDashboard.tsx`, `AdminDashboard.tsx` | Dodano komponent `<SeoHead>` z tytułem i opisem | Google indeksuje dynamicznie zmieniane title/description |

### P2 — Ważne

| # | Problem | Plik(i) | Zmiana | Standard |
|---|---|---|---|---|
| P2-1 | Brak skip-link na landing page | `LandingPage.tsx` | Dodano `<a href="#funkcje" className="sr-only focus:not-sr-only ...">` | WCAG 2.4.1 |
| P2-2 | Słaby focus ring na inputach formularza kontaktowego | `LandingPage.tsx` | Dodano `focus:ring-2 focus:ring-indigo-400/30` do inputów name i email | WCAG 2.4.7 |
| P2-3 | Kontrast tekstu slate-400 na ciemnym tle poniżej WCAG AA | `LoginPage.tsx`, `AdminLayout.tsx`, `TeacherLayout.tsx` | Zmieniono `text-slate-400` → `text-slate-300` na ciemnych tłach | WCAG 1.4.3 |
| P2-4 | Brak atrybutu `autocomplete` na formularzu kontaktowym | `LandingPage.tsx` | Dodano `autoComplete="name"` i `autoComplete="email"` | WCAG 1.3.5, UX |
| P2-5 | Badge sprintu w README nieaktualny | `README.md` | Zaktualizowano badge z „Sprint-4" → „Sprint-6" | Dokumentacja |
| P2-6 | Landing mobile nav links zamykanie menu | `LandingPage.tsx` | Zweryfikowano `onClick={() => setMenuOpen(false)}` na linkach mobilnych | UX Mobile |

---

## Szczegóły techniczne zmian

### 1. Branding Fix — EduPlan → EduDash

**Pliki zmienione:**
```
src/app/components/login/LoginPage.tsx          — linia 120
src/app/components/teacher/TeacherLayout.tsx     — linia 56
src/app/components/admin/AdminLayout.tsx         — linie 52, 119
```

**Diff przykładowy:**
```diff
- EduPlan
+ EduDash
```

**Wpływ:** Wszystkie widoczne wystąpienia nazwy produktu są teraz spójne z brandem „EduDash" używanym w kampanii SEM, landing page, manifest.json i SEO.

---

### 2. SeoHead na Dashboardach

**TeacherDashboard.tsx:**
```tsx
import { SeoHead } from "../layout/SeoHead";
// ...
<SeoHead 
  title="Dashboard Nauczyciela" 
  description="Panel nauczyciela EduDash — podgląd lekcji, potwierdzanie realizacji, 
               zgłaszanie awarii i szybki dostęp do grafiku." 
/>
```

**AdminDashboard.tsx:**
```tsx
import { SeoHead } from "../layout/SeoHead";
// ...
<SeoHead 
  title="Panel Administratora" 
  description="Panel administracyjny EduDash — przegląd grafiku, konflikty sal, 
               statystyki i zarządzanie placówką edukacyjną." 
/>
```

**Wpływ:** Dynamiczne tagi `<title>` i `<meta description>` dla każdej strony aplikacji, co poprawia wynik SEO i UX (zakładki w przeglądarce).

---

### 3. Skip Link (a11y)

**LandingPage.tsx:**
```tsx
<a href="#funkcje" 
   className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 
              focus:z-[100] focus:bg-indigo-600 focus:text-white focus:px-4 
              focus:py-2 focus:rounded-xl focus:text-sm focus:font-semibold">
  Przejdź do treści
</a>
```

**Wpływ:** Użytkownicy nawigujący klawiaturą (Tab) mogą pominąć nawigację i przejść bezpośrednio do treści. Link jest niewidoczny wizualnie, ale pojawia się przy focusie.

---

### 4. Focus Ring i Autocomplete

**LandingPage.tsx — formularz kontaktowy:**
```diff
- className="... outline-none focus:border-indigo-400 transition-colors"
+ className="... outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-colors"

- <input ... type="text" placeholder="Jan Kowalski"
+ <input ... type="text" placeholder="Jan Kowalski" autoComplete="name"

- <input ... type="email" placeholder="dyrektor@szkola.pl"
+ <input ... type="email" placeholder="dyrektor@szkola.pl" autoComplete="email"
```

**Wpływ:** Lepszy feedback wizualny + szybsze wypełnianie formularza (autouzupełnianie przeglądarki).

---

### 5. Kontrast tekstu (WCAG AA)

**Zmiana ogólna na ciemnych tłach:**
```diff
- className="text-slate-400 text-xs"  // ratio ~3.2:1 ❌
+ className="text-slate-300 text-xs"  // ratio ~5.1:1 ✅
```

**Dotyczy:**
- Login page — podpis „System zarządzania szkołą"
- Admin layout — mobile header „Administrator"
- Teacher layout — sidebar „Panel Nauczyciela"

---

## Poprawki zaplanowane na Sprint 7 (P3)

| # | Problem | Plik | Rekomendacja |
|---|---|---|---|
| P3-1 | Toast potwierdzenia znika zbyt szybko (3s) | `TeacherDashboard.tsx` | Wydłużyć do 5s + dodać `aria-live="polite"` |
| P3-2 | Brak sekcji FAQ / Help | Nowy komponent | Dodać stronę /help z FAQ |
| P3-3 | Brak opcji „Cofnij" po potwierdzeniu lekcji | `TeacherDashboard.tsx` | Dodać undo button w toast |
| P3-4 | Brak walidacji min. znaków w opisie awarii | `TeacherDashboard.tsx` | Dodać `minLength={10}` na textarea |

---

## Pliki nowe (Sprint 6)

| Plik | Typ | Opis |
|---|---|---|
| `docs/sprint6_sem_campaign.md` | Dokumentacja | Projekt kampanii SEM (Google Ads) |
| `docs/sprint6_user_testing_report.md` | Dokumentacja | Raport z testów użytkowników |
| `docs/sprint6_fixes_list.md` | Dokumentacja | Lista wprowadzonych poprawek (ten plik) |
| `CHANGELOG.md` | Dokumentacja | Dziennik zmian (changelog) |

## Pliki zmodyfikowane (Sprint 6)

| Plik | Rodzaj zmiany |
|---|---|
| `src/app/components/login/LoginPage.tsx` | Branding fix, kontrast |
| `src/app/components/teacher/TeacherLayout.tsx` | Branding fix, kontrast |
| `src/app/components/admin/AdminLayout.tsx` | Branding fix, kontrast |
| `src/app/components/teacher/TeacherDashboard.tsx` | SeoHead |
| `src/app/components/admin/AdminDashboard.tsx` | SeoHead |
| `src/app/components/landing/LandingPage.tsx` | Skip-link, focus, autocomplete |
| `README.md` | Badge sprintu |

---

*Dokument przygotowany przez: EduDash Development Team*  
*Sprint 6 — 14 maja 2026*
