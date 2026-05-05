import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description?: string;
  canonical?: string;
}

const DEFAULT_SUFFIX = ' – EduDash';
const DEFAULT_DESCRIPTION =
  'EduDash to kompleksowy system zarządzania szkołą: dziennik elektroniczny, grafik nauczycieli, finanse i raporty.';

/**
 * SeoHead – komponent do dynamicznego zarządzania SEO per strona.
 * Ustawia document.title i meta description bez zewnętrznych zależności.
 *
 * Użycie:
 *   <SeoHead title="Panel Administratora" description="Zarządzaj szkołą..." />
 */
export function SeoHead({ title, description, canonical }: SeoHeadProps) {
  useEffect(() => {
    // Ustaw tytuł strony
    const fullTitle = title.endsWith('EduDash')
      ? title
      : `${title}${DEFAULT_SUFFIX}`;
    document.title = fullTitle;

    // Ustaw meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description ?? DEFAULT_DESCRIPTION);
    }

    // Ustaw OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // Ustaw OG description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description ?? DEFAULT_DESCRIPTION);
    }

    // Ustaw canonical (opcjonalnie)
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [title, description, canonical]);

  return null;
}
