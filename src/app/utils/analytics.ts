/**
 * EduDash – Analytics Utility (GA4)
 *
 * Centralny moduł do śledzenia zdarzeń w Google Analytics 4.
 *
 * KONWERSJE:
 *  - MAKRO: contact_form_submitted – wysłanie formularza kontaktowego przez dyrektora na /landing
 *  - MIKRO: cta_clicked             – klik CTA „Wypróbuj bezpłatnie" / „Umów demo"
 *  - MIKRO: pwa_install_prompt_shown – wyświetlenie promptu instalacji PWA
 *  - MIKRO: app_installed            – pomyślna instalacja PWA
 *  - MIKRO: login_success            – udane logowanie do systemu
 *
 * Użycie:
 *   import { trackEvent } from '@/app/utils/analytics';
 *   trackEvent('login_success', { method: 'email' });
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Wysyła zdarzenie do Google Analytics 4.
 * Bezpieczne – sprawdza dostępność gtag przed wywołaniem.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params ?? {});
  }
}

// ─── Predefiniowane zdarzenia (typy zdarzeń GA4) ─────────────────────────────

/** MIKRO-KONWERSJA: Udane logowanie do systemu */
export const trackLoginSuccess = (role: 'admin' | 'teacher') =>
  trackEvent('login_success', { method: 'email', user_role: role });

/** Nieudana próba logowania */
export const trackLoginFailure = () =>
  trackEvent('login_failure', { method: 'email' });

/**
 * ZDARZENIE: Generowanie raportu okresowego.
 * Wywołać przy kliknięciu przycisku PDF / CSV w AdminFinance / TeacherFinance.
 */
export const trackReportGenerated = (
  reportType: 'csv' | 'pdf',
  period: string
) =>
  trackEvent('report_generated', {
    report_type: reportType,
    period,
  });

/** MIKRO-KONWERSJA: Wyświetlenie promptu instalacji PWA */
export const trackPwaInstallPromptShown = () =>
  trackEvent('pwa_install_prompt_shown');

/** MIKRO-KONWERSJA: Pomyślna instalacja PWA */
export const trackAppInstalled = () =>
  trackEvent('app_installed', { source: 'pwa_prompt' });

/** MIKRO-KONWERSJA: Klik CTA na landing page */
export const trackCtaClicked = (ctaLabel: string, location: string) =>
  trackEvent('cta_clicked', { cta_label: ctaLabel, location });

/**
 * MAKRO-KONWERSJA: Wysłanie formularza kontaktowego przez dyrektora.
 * To jest GŁÓWNA konwersja zdefiniowana dla kampanii EduDash.
 */
export const trackContactFormSubmitted = (role: string) =>
  trackEvent('contact_form_submitted', {
    user_role: role,
    conversion: true, // Oznacznik konwersji makro
  });
