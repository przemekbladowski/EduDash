import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Custom hook do testowania
export function useCounter(initialValue: number = 0, step: number = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => c - step);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Custom hook do zarządzania formularzem
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (onSubmit: (values: T) => void | Promise<void>) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(values);
    };
  };

  const reset = () => setValues(initialValues);

  return { values, errors, setErrors, handleChange, handleSubmit, reset };
}

// ============ TESTY ============

describe('useCounter Hook', () => {
  it('inicjalizuje się wartością domyślną 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('inicjalizuje się podaną wartością', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('inkrementuje licznik o krok', () => {
    const { result } = renderHook(() => useCounter(0, 5));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(5);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(10);
  });

  it('dekrementuje licznik o krok', () => {
    const { result } = renderHook(() => useCounter(10, 3));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('resetuje licznik do wartości początkowej', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });

  it('obsługuje wartości ujemne', () => {
    const { result } = renderHook(() => useCounter(0, 1));

    act(() => {
      result.current.decrement();
      result.current.decrement();
    });

    expect(result.current.count).toBe(-2);
  });
});

describe('useForm Hook', () => {
  const initialValues = { email: '', password: '', name: '' };

  it('inicjalizuje się wartościami początkowymi', () => {
    const { result } = renderHook(() => useForm(initialValues));
    expect(result.current.values).toEqual(initialValues);
  });

  it('zmienia wartość pola formularza', () => {
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      const event = {
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(event);
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('resetuje formularz do wartości początkowych', () => {
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      result.current.values.email = 'test@example.com';
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
  });

  it('obsługuje wiele pól jednocześnie', () => {
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      const emailEvent = {
        target: { name: 'email', value: 'anna@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;

      const nameEvent = {
        target: { name: 'name', value: 'Anna' },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange(emailEvent);
      result.current.handleChange(nameEvent);
    });

    expect(result.current.values.email).toBe('anna@example.com');
    expect(result.current.values.name).toBe('Anna');
    expect(result.current.values.password).toBe(''); // bez zmian
  });

  it('tworzy handleSubmit callback', () => {
    const { result } = renderHook(() => useForm(initialValues));
    const mockSubmit = (values: typeof initialValues) => {
      expect(values).toEqual(initialValues);
    };

    const handler = result.current.handleSubmit(mockSubmit);
    const event = { preventDefault: () => {} } as React.FormEvent;

    act(() => {
      handler(event);
    });
  });

  it('umożliwia ustawienie błędów', () => {
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      result.current.setErrors({ email: 'Invalid email', password: 'Required' });
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.errors.password).toBe('Required');
  });
});
