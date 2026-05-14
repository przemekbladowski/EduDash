import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

describe('API Integration Tests with MSW', () => {
  it('pobiera listę użytkowników z /api/users', async () => {
    const response = await fetch('/api/users');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.data[0].name).toBe('Anna Kowalska');
    expect(data.total).toBe(2);
  });

  it('pobiera użytkownika po ID', async () => {
    const response = await fetch('/api/users/1');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.id).toBe(1);
    expect(data.name).toBe('Test User');
  });

  it('zwraca 404 dla nieistniejącego użytkownika', async () => {
    const response = await fetch('/api/users/999');

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.message).toBe('Not found');
  });

  it('uwierzytelnia użytkownika z poprawnymi danymi', async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anna@szkola.pl', password: '123456' }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.role).toBe('teacher');
  });

  it('odrzuca logowanie z niepoprawnym hasłem', async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anna@szkola.pl', password: 'wrongpassword' }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toBe('Invalid credentials');
  });

  it('tworzy nową lekcję', async () => {
    const newLesson = {
      teacherId: 1,
      studentName: 'Jan Kowalski',
      subject: 'Matematyka',
      date: '2026-04-30',
    };

    const response = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLesson),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBe(99);
    expect(data.teacherId).toBe(newLesson.teacherId);
  });

  it('obsługuje błędy API - nadpisanie handlera', async () => {
    // Nadpisz handler dla tego testu
    server.use(
      http.get('/api/users/:id', () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 })
      )
    );

    const response = await fetch('/api/users/1');

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.message).toBe('Server error');

    // Handler zostanie zresetowany po teście przez setup.ts
  });

  it('obsługuje pagination', async () => {
    const response = await fetch('/api/users?page=2');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.page).toBe(2);
  });
});
