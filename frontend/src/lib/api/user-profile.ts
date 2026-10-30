import type { UpdateUserProfileDto, UserProfile } from '@/types/user-profile';
import { apiRequest, apiAssetUrl } from './client';

export const userProfileApi = {
  get: () => apiRequest<UserProfile>('/users/me'),
  update: (data: UpdateUserProfileDto) =>
    apiRequest<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  uploadPhoto: (photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);
    return apiRequest<UserProfile>('/users/me/photo', {
      method: 'PATCH',
      body: formData,
    });
  },
  photoUrl: (path: string) => apiAssetUrl(path),
};
