import { describe, it, expect } from 'vitest';

// Funkcje utility do testowania
export function formatTime(time: string): string {
  if (!time || typeof time !== 'string') return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function formatCurrency(amount: number, currency: string = 'PLN'): string {
  if (typeof amount !== 'number') throw new TypeError('Oczekiwano liczby');
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ============ TESTY ============

describe('formatTime', () => {
  it('formatuje godzinę prawidłowo', () => {
    expect(formatTime('09:30')).toBe('09:30');
    expect(formatTime('14:45')).toBe('14:45');
  });

  it('zwraca pusty string dla nieprawidłowych danych', () => {
    expect(formatTime('')).toBe('');
    expect(formatTime(null as any)).toBe('');
  });
});

describe('isValidEmail', () => {
  it('sprawdza czy email jest prawidłowy', () => {
    expect(isValidEmail('anna@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
  });

  it('odrzuca nieprawidłowe emaile', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('invalid email@example.com')).toBe(false);
  });
});

describe('truncate', () => {
  it('skraca długi tekst', () => {
    const longText = 'To jest bardzo długi tekst który powinien zostać skrócony';
    const result = truncate(longText, 20);
    expect(result).toBe('To jest bardzo długi...');
  });

  it('nie skraca tekstu krótszego niż limit', () => {
    expect(truncate('Short', 20)).toBe('Short');
  });

  it('używa domyślnego limitu 50 znaków', () => {
    const text = 'a'.repeat(60);
    const result = truncate(text);
    expect(result.length).toBeLessThanOrEqual(53); // 50 + '...'
  });
});

describe('formatCurrency', () => {
  it('formatuje kwotę w PLN', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('zł');
  });

  it('obsługuje inne waluty', () => {
    const result = formatCurrency(100, 'EUR');
    expect(result).toContain('€');
  });

  it('rzuca błąd dla nie-liczby', () => {
    expect(() => formatCurrency('100' as any)).toThrow(TypeError);
  });

  it('formatuje zero prawidłowo', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('zł');
  });

  it('obsługuje wartości ujemne', () => {
    const result = formatCurrency(-50);
    expect(result).toContain('zł');
  });
});
