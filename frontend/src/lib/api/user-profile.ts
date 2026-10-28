import type { UpdateUserProfileDto, UserProfile } from '@/types/user-profile';
import { apiRequest } from './client';

export const userProfileApi = {
  get: () => apiRequest<UserProfile>('/users/me'),
  update: (data: UpdateUserProfileDto) =>
    apiRequest<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
