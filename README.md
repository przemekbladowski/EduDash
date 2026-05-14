# 🚀 EduDash
**Centrum dowodzenia dla nowoczesnych placówek edukacyjnych.**

![Project Status](https://img.shields.io/badge/Sprint-4_Completed-success)
![Platform](https://img.shields.io/badge/Mobile--First-PWA-blue)
![Purpose](https://img.shields.io/badge/Internal-Tool-orange)

---

## 🛠 Cel Projektu
Aplikacja ma na celu całkowitą eliminację papierowej dokumentacji i pomyłek typu **double-booking** w zarządzaniu salami. EduDash to "single source of truth" dla nauczycieli i administracji.

### Główne założenia:
*   **Optymalizacja czasu:** Skrócenie układania grafiku z 5h do 1h tygodniowo.
*   **User Experience:** Raportowanie lekcji w 10 sekund (Mobile-First).
*   **Bezpieczeństwo:** Pełna izolacja danych zgodnie z RODO (nauczyciel widzi tylko swój zakres).

---

## 👥 Persony (User Intention)

### 1. Nauczyciel / Korepetytor
> *"Chcę sprawdzić salę na telefonie i jednym kliknięciem potwierdzić lekcję, żeby mieć pewność, że kasa się zgadza."*
*   Szybki check-in zajęć.
*   Zgłaszanie niedostępności (choroba/urlop).
*   Podgląd prognozowanych zarobków w sekcji `/moje-finanse`.

### 2. Administrator / Właściciel
> *"Chcę widzieć grafik z lotu ptaka i nie martwić się, że dwóch nauczycieli wejdzie do tej samej sali."*
*   Zarządzanie macierzą grafiku.
*   Automatyczne generowanie raportów płacowych (CSV/PDF).
*   Blokada konfliktów w czasie rzeczywistym.

---

## 🗺 Struktura Systemu (IA)

### Strefa Użytkownika
*   `[ /login ]` - System zaproszeń (brak otwartej rejestracji).
*   `[ /dashboard ]` - Widok "Na dziś", szybkie powiadomienia.
*   `[ /moj-grafik ]` - Pełny kalendarz zajęć.
*   `[ /moje-finanse ]` - Zliczone godziny i stawki.
*   `[ /ustawienia ]` - Deklarowanie dostępności w semestrze.

### Strefa Admina
*   `[ /admin/harmonogram ]` - Centralny grafik (Master View).
*   `[ /admin/sale ]` - Zarządzanie fizyczną przestrzenią (kolorowanie sal).
*   `[ /admin/kadra ]` - Zarządzanie dostępami i reset haseł.
*   `[ /admin/raporty ]` - Eksport danych do księgowości.

---

## 🚀 Kluczowe Funkcjonalności (Sprint 1)
- [x] **Conflict Resolver:** Algorytm blokujący nakładanie się zajęć w tej samej sali.
- [x] **PWA Ready:** Interfejs zoptymalizowany pod "wielkie kciuki" (Mobile UX).
- [x] **Color-Coded Rooms:** Każda sala ma swój kolor w systemie dla łatwiejszej nawigacji.
- [x] **Quick Actions:** Przycisk "Zgłoś awarię w sali" bezpośrednio z dashboardu.

---

## 📈 KPI i Sukces
*   **Error Rate:** 0 konfliktów sal.
*   **Admin Time Saved:** Zyskujesz 4 godziny tygodniowo.
*   **TSS (Teacher Satisfaction Score):** Badane ankietą po wdrożeniu.

---

## 🛠 Technologia
*   **Podejście:** Mobile-First / PWA.
*   **Autoryzacja:** System zaproszeń administracyjnych (Security-First).
*   **Baza danych:** Zoptymalizowana pod szybkie filtrowanie wolnych sal.

---
