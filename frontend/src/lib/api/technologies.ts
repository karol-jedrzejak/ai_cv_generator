import type { Technology } from '@/types/technology';
import { apiRequest } from './client';

export const technologiesApi = {
  search: (search: string): Promise<Technology[]> => {
    const params = new URLSearchParams({ search });
    return apiRequest<Technology[]>(
      `/technologies?${params.toString()}`,
      {},
      'Nie udało się pobrać technologii.',
    );
  },
};