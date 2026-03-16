# EduDash | Management Suite

Wyspecjalizowana platforma wewnętrzna (PWA) zaprojektowana, aby wypełnić lukę między administracją placówek edukacyjnych a kadrą nauczycielską. EduDash przekształca rozproszone operacje w ujednolicony, cyfrowy system pracy.

## 🌟 Wizja projektu

Główną misją EduDash jest maksymalizacja wydajności operacyjnej poprzez centralizację zarządzania salami, czasem i raportowaniem. Zastępując nieformalne kanały komunikacji (np. WhatsApp) oraz papierowe dzienniki, tworzymy „jedno źródło prawdy” dla całej instytucji.

---

## 🛠 Stack Technologiczny

Projekt opiera się na nowoczesnych technologiach zapewniających szybkość działania i skalowalność:

* **Design**: Figma (prototypowanie Hi-Fi i UX mobilny).
* **Frontend**: React.js + SASS (SCSS) dla modułowej stylizacji.
* **Backend**: Node.js do obsługi logiki biznesowej i algorytmów walidacji.
* **Baza danych & Auth**: Supabase (PostgreSQL) z politykami Row Level Security (RODO).
* **Hosting**: Vercel (automatyczne wdrożenia CI/CD).
* **Podejście**: Mobile-First, Progressive Web App (PWA).

---

## 🏗 Architektura Systemu (Sprint 2)

System został zaprojektowany w modelu **Decoupled Architecture**, co pozwala na niezależny rozwój frontendu i backendu.

* **Frontend (PWA)**: Reaktywny interfejs zoptymalizowany pod urządzenia mobilne, umożliwiający pracę w trybie offline i szybki dostęp z ekranu głównego smartfona.
* **Logic Layer**: Silnik walidacji (Node.js/Edge Functions) odpowiedzialny za rozwiązywanie konfliktów – uniemożliwia on przypisanie dwóch osób do tej samej sali w tym samym czasie.
* **Data Layer**: Relacyjna baza danych PostgreSQL w chmurze Supabase, zapewniająca integralność danych i izolację informacji zgodnie z wymogami RODO.

---

## 📊 Model Danych (ERD)

Struktura tabel została zoptymalizowana pod kątem eliminacji błędów operacyjnych i szybkiego generowania raportów płacowych:

| Tabela | Opis |
| :--- | :--- |
| **profiles** | Dane użytkowników (nauczyciele/admini), role i uprawnienia. |
| **rooms** | Rejestr sal lekcyjnych wraz z ich unikalną kolorystyką (ułatwienie nawigacji). |
| **lessons** | Centralny grafik łączący nauczycieli, sale i ramy czasowe zajęć. |
| **availability** | Deklaracje dostępności nauczycieli, na których opiera się planowanie semestralne. |

---

## 📡 Specyfikacja API (Kluczowe Endpointy)

* `GET /api/lessons/today` – Widok „Na dziś”: Pobieranie planu zajęć dla zalogowanego nauczyciela.
* `PATCH /api/lessons/{id}/confirm` – **Akcja 10 sekund**: Błyskawiczne potwierdzenie realizacji lekcji w celu naliczenia wynagrodzenia.
* `POST /api/admin/schedule` – Tworzenie wpisu w grafiku z automatyczną blokadą double-bookingu.
* `GET /api/admin/reports/payroll` – Automatyczne zliczanie godzin i generowanie raportów do wypłat.

---

## 🔄 Diagramy Przepływu Logicznego

1. **Planowanie (Admin)**: System weryfikuje dostępność sali i nauczyciela przed zapisem. W przypadku konfliktu, operacja jest blokowana z powiadomieniem o przyczynie.
2. **Realizacja (Nauczyciel)**: Powiadomienie Push rano -> Szybki wgląd w grafik -> Odznaczenie lekcji jednym kliknięciem po zajęciach.
3. **Zarządzanie nieobecnościami**: Nauczyciel zgłasza urlop/chorobę przez profil; system automatycznie zwalnia salę w grafiku i powiadamia administratora.

---

## 📅 Roadmapa i Postępy

### ✅ Faza 1: Strategia i Logika (Zakończone)
* Zdefiniowanie celów biznesowych i KPI (zmniejszenie czasu pracy admina, zero błędów).
* Mapowanie person (Nauczyciel vs Administrator) i ich intencji.
* Opracowanie architektury informacji i struktury URL.

### 🚧 Faza 2: Projektowanie Systemu (W toku)
* Opracowanie szczegółowej architektury technicznej (PWA + Supabase).
* Zaprojektowanie modelu danych (ERD) i dokumentacji API.
* Przygotowanie struktury repozytorium (Repository Pattern).

### 🚀 Faza 3: Rozwój Rdzenia (Nadchodzące)
* Implementacja algorytmu walidacji konfliktów w czasie rzeczywistym.
* Integracja powiadomień Push/SMS dla kadry nauczycielskiej.
* Wdrożenie modułu automatycznego generowania raportów finansowych (CSV/PDF).

---

## 💡 Kluczowe Funkcje UX

* **10-sekundowe Check-iny**: Maksymalnie uproszczony proces potwierdzania obecności za pomocą dużych przycisków.
* **Wizualna Mapa Budynku**: Kodowanie sal kolorami ułatwiające orientację nauczycielom i uczniom.
* **Silnik Dostępności**: Intuicyjny moduł do deklarowania godzin pracy, eliminujący potrzebę ręcznego ustalania planu.
* **Automatyczne Rozliczenia**: Generowanie kompletnych zestawień do wypłat jednym kliknięciem na koniec miesiąca.
