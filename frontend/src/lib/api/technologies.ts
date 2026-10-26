import type { Technology } from '@/types/technology';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const technologiesApi = {
  search: async (search: string): Promise<Technology[]> => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (!token) {
      throw new Error('Sesja wygasła. Zaloguj się ponownie.');
    }

    const params = new URLSearchParams({ search });

    const response = await fetch(
      `${API_URL}/technologies?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 401) {
      throw new Error('Sesja wygasła. Zaloguj się ponownie.');
    }

    if (!response.ok) {
      throw new Error('Nie udało się pobrać technologii.');
    }

    return (await response.json()) as Technology[];
  },
};