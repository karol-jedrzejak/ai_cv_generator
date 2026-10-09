import type {
  SocialLink,
  CreateSocialLinkDto,
  UpdateSocialLinkDto,
} from '@/types/social-link';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

  if (!token) {
    throw new Error('Sesja wygasła. Zaloguj się ponownie.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw new Error('Sesja wygasła. Zaloguj się ponownie.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    throw new Error(
      message || 'Wystąpił błąd podczas komunikacji z serwerem.',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const socialLinksApi = {
  getAll: () => request<SocialLink[]>('/social-links'),

  getOne: (id: string) =>
    request<SocialLink>(
      `/social-links/${encodeURIComponent(id)}`,
    ),

  create: (data: CreateSocialLinkDto) =>
    request<SocialLink>('/social-links', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateSocialLinkDto) =>
    request<SocialLink>(
      `/social-links/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    ),

  remove: (id: string) =>
    request<SocialLink>(
      `/social-links/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    ),
};