import type { Language } from '@/types/language-skill';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const languagesApi = {
  getAll: async (): Promise<Language[]> => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (!token) {
      throw new Error('Sesja wygasła. Zaloguj się ponownie.');
    }

    const response = await fetch(`${API_URL}/languages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error('Sesja wygasła. Zaloguj się ponownie.');
    }

    if (!response.ok) {
      throw new Error('Nie udało się pobrać listy języków.');
    }

    return (await response.json()) as Language[];
  },
};
