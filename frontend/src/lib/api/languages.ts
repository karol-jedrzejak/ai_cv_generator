import type { Language } from '@/types/language-skill';
import { apiRequest } from './client';

export const languagesApi = {
  getAll: (): Promise<Language[]> =>
    apiRequest<Language[]>(
      '/languages',
      {},
      'Nie udało się pobrać listy języków.',
    ),
};
