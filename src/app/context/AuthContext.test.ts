import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from './AuthContext';
import React from 'react';

describe('useAuth Hook', () => {
  it('zwraca domyślny stan - brak użytkownika', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loguje użytkownika z poprawnymi danymi', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      const success = result.current.login('anna@szkola.pl', '123456');
      expect(success).toBe(true);
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.name).toBe('Anna Kowalska');
    expect(result.current.user?.role).toBe('teacher');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('nie loguje użytkownika z niepoprawnym hasłem', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      const success = result.current.login('anna@szkola.pl', 'wrongpassword');
      expect(success).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loguje administratora', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      const success = result.current.login('admin@szkola.pl', '123456');
      expect(success).toBe(true);
    });

    expect(result.current.user?.role).toBe('admin');
    expect(result.current.user?.name).toBe('Admin Systemu');
  });

  it('wylogowuje użytkownika', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Najpierw zaloguj
    act(() => {
      result.current.login('anna@szkola.pl', '123456');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Następnie wyloguj
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
