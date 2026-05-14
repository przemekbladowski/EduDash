import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Prosty komponent Button do testowania
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
  };

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {loading ? 'Ładowanie...' : children}
    </button>
  );
}

// ============ TESTY ============

describe('Button Component', () => {
  it('renderuje przycisk z tekstem', () => {
    render(<Button>Kliknij mnie</Button>);
    expect(screen.getByRole('button', { name: 'Kliknij mnie' })).toBeInTheDocument();
  });

  it('obsługuje klik', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Przyciśnij</Button>);

    const button = screen.getByRole('button', { name: 'Przyciśnij' });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uniemożliwia klik gdy disabled=true', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Wyłączony
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Wyłączony' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('wyświetla "Ładowanie..." gdy loading=true', () => {
    render(<Button loading>Wysyłanie</Button>);
    expect(screen.getByRole('button', { name: 'Ładowanie...' })).toBeInTheDocument();
  });

  it('uniemożliwia klik gdy loading=true', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Wysyłanie
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Ładowanie...' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('obsługuje warianty stylów', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button', { name: 'Primary' });
    expect(button).toHaveClass('bg-indigo-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-gray-200');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button', { name: 'Danger' });
    expect(button).toHaveClass('bg-red-600');
  });

  it('przyjmuje atrybuty HTML', () => {
    render(
      <Button data-testid="custom-button" type="submit" aria-label="Custom">
        Test
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Custom');
  });

  it('pokazuje loading oraz disabled razem', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading disabled onClick={onClick}>
        Test
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Ładowanie...' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
