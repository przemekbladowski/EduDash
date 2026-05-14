import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET /api/users — zwraca listę użytkowników
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    return HttpResponse.json({
      data: [
        { id: 1, name: 'Anna Kowalska', email: 'anna@szkola.pl', role: 'teacher' },
        { id: 2, name: 'Piotr Nowak', email: 'piotr@szkola.pl', role: 'teacher' },
      ],
      total: 2,
      page,
    });
  }),

  // GET /api/users/:id — zwraca użytkownika
  http.get('/api/users/:id', ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({
      id: +params.id,
      name: 'Test User',
      email: 'test@example.com',
      role: 'teacher',
    });
  }),

  // POST /api/login — logowanie
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'anna@szkola.pl' && body.password === '123456') {
      return HttpResponse.json(
        { id: 1, name: 'Anna Kowalska', email: 'anna@szkola.pl', role: 'teacher' },
        { status: 200 }
      );
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // POST /api/lessons — tworzy lekcję
  http.post('/api/lessons', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 99, ...body }, { status: 201 });
  }),
];
