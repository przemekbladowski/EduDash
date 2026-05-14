# 📋 Dziennik Zmian – EduDash (CHANGELOG)

Wszystkie istotne zmiany w projekcie EduDash są dokumentowane w tym pliku.
Format: [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/)

---

## [Sprint 6] – 2026-05-14

### 📄 Dokumentacja & Marketing

#### Dodano
- **Projekt kampanii SEM** (`docs/sprint6_sem_campaign.md`)
  - Pełna struktura kampanii Google Ads (Search + Display + Remarketing)
  - 4 grupy reklamowe z dedykowanymi słowami kluczowymi i reklamami
  - Budżet miesięczny: 3 800 zł → szacowane ~64 leady/miesiąc
  - Plan rozszerzeń reklam (sitelinks, callout, structured snippets)
  - Konfiguracja GTM z mapowaniem konwersji GA4
  - Plan testów A/B (5 wariantów)
  - Segmenty remarketingowe (4 grupy odbiorców)
  - Harmonogram uruchomienia (4 tygodnie)

- **Raport z testów użytkowników** (`docs/sprint6_user_testing_report.md`)
  - Ewaluacja heurystyczna (Nielsen's 10 Heuristics) — ocena: 4.4/5.0
  - 6 scenariuszy testowych — 100% pass rate
  - Audit dostępności WCAG 2.1 AA — 9 kryteriów sprawdzonych
  - Audit SEO — 12 elementów zweryfikowanych
  - Test responsywności — 6 viewport'ów, 100% pass
  - Lista 12 zidentyfikowanych problemów (8 naprawionych, 4 na Sprint 7)

- **Lista wprowadzonych poprawek** (`docs/sprint6_fixes_list.md`)
  - Szczegółowa tabela wszystkich poprawek z lokalizacją i statusem

- **Dziennik zmian** (`CHANGELOG.md`)
  - Plik śledzący historię zmian między sprintami

### 🔧 Poprawki kodu (Bug Fixes & UX Improvements)

#### Naprawiono
- **[CRITICAL] Branding mismatch — EduPlan → EduDash**
  - `LoginPage.tsx` — Nagłówek na stronie logowania wyświetlał "EduPlan" zamiast "EduDash"
  - `TeacherLayout.tsx` — Sidebar nauczyciela wyświetlał "EduPlan"
  - `AdminLayout.tsx` — Sidebar admina + mobile header wyświetlał "EduPlan"
  - Spójność marki jest kluczowa dla kampanii SEM i zaufania użytkowników

- **[IMPORTANT] Brak SeoHead na dashboardach**
  - `TeacherDashboard.tsx` — Dodano `<SeoHead title="Dashboard Nauczyciela">` z pełnym description
  - `AdminDashboard.tsx` — Dodano `<SeoHead title="Panel Administratora">` z pełnym description
  - Dynamiczne SEO teraz działa na wszystkich kluczowych stronach

- **[A11Y] Skip-link na Landing Page**
  - `LandingPage.tsx` — Dodano ukryty link "Przejdź do treści" widoczny przy nawigacji klawiaturowej
  - Zgodność z WCAG 2.1 kryterium 2.4.1 (Bypass Blocks)

- **[A11Y] Kontrast tekstu na ciemnym tle**
  - `LoginPage.tsx` — Poprawiono kolor tekstu z `slate-400` na `slate-300` (ratio ≥ 4.5:1)
  - `AdminLayout.tsx` — Poprawiono kontrast w mobile header
  - `TeacherLayout.tsx` — Poprawiono kontrast w sidebar
  - Zgodność z WCAG 2.1 kryterium 1.4.3 (Contrast Minimum)

- **[A11Y] Focus ring na formularzach Landing Page**
  - `LandingPage.tsx` — Wzmocniono focus ring na inputach: dodano `focus:ring-2 focus:ring-indigo-400/30`
  - Lepszy feedback wizualny dla użytkowników nawigujących klawiaturą
  - Zgodność z WCAG 2.1 kryterium 2.4.7 (Focus Visible)

- **[UX] Autocomplete na formularzu kontaktowym**
  - `LandingPage.tsx` — Dodano `autoComplete="name"` i `autoComplete="email"` do inputów
  - Szybsze wypełnianie formularza → wyższy conversion rate

#### Zmieniono
- **README.md** — Badge sprintu zaktualizowany z "Sprint 4" na "Sprint 6"

---

## [Sprint 5] – (wcześniej)

> Brak danych — dziennik zmian rozpoczęto od Sprint 6.

---

## [Sprint 4] – (wcześniej)

> Brak danych — dziennik zmian rozpoczęto od Sprint 6.

---

## [Sprint 1-3] – (wcześniej)

### Dodano (retrospektywnie)
- System autoryzacji z rolami (admin/teacher)
- Landing page z formularzem kontaktowym
- Panel nauczyciela (Dashboard, Grafik, Finanse, Dostępność, Ustawienia)
- Panel administratora (Dashboard, Harmonogram, Finanse & Raporty, Ustawienia)
- Conflict Resolver — algorytm blokujący nakładanie się zajęć
- Color-coded rooms (4 sale z unikalnymi kolorami)
- PWA manifest z shortcuts
- GA4 analytics z 6 zdarzeniami niestandardowymi
- SEO: sitemap.xml, robots.txt, Schema.org, Open Graph, Twitter Cards
- Responsive design (Mobile-First + Desktop sidebar)
- Onboarding page
- Quick login demo (teacher/admin)

---

*Dziennik zmian prowadzony od: Sprint 6 (14 maja 2026)*
*Format: Keep a Changelog 1.1.0*
