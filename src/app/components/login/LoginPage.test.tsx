import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router';

// Mock useNavigate
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  it('renderuje formularz logowania', () => {
    renderLoginPage();

    // Szukamy elementów po role zamiast label text
    const emailInput = screen.getByPlaceholderText('twoj@email.pl');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /zaloguj się/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('wyświetla przyciski szybkiego logowania demo', () => {
    renderLoginPage();

    expect(screen.getByText(/Nauczyciel/i)).toBeInTheDocument();
    expect(screen.getByText(/Administrator/i)).toBeInTheDocument();
    expect(screen.getByText(/anna@szkola.pl/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@szkola.pl/i)).toBeInTheDocument();
  });

  it('zawiera sekcję informacyjną o systemie', () => {
    renderLoginPage();

    expect(screen.getByText(/EduPlan/i)).toBeInTheDocument();
    expect(screen.getByText(/System zarządzania szkołą/i)).toBeInTheDocument();
  });

  it('ma input email zamiast zwykłego text', () => {
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText('twoj@email.pl') as HTMLInputElement;
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('wyświetla przycisk "Zapomniałem hasła"', () => {
    renderLoginPage();

    expect(screen.getByRole('button', { name: /zapomniałem hasła/i })).toBeInTheDocument();
  });

  it('pokazuje hasło: 123456 w sekcji demo', () => {
    renderLoginPage();

    expect(screen.getByText(/Hasło: 123456/i)).toBeInTheDocument();
  });
});
