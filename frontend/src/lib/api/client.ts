const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const SESSION_EXPIRED_MESSAGE = 'Sesja wygasła. Zaloguj się ponownie.';
const DEFAULT_ERROR_MESSAGE = 'Wystąpił błąd podczas komunikacji z serwerem.';

interface ApiErrorBody {
  message?: string | string[];
}

function getErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object' || !('message' in body)) {
    return undefined;
  }

  const message = (body as ApiErrorBody).message;
  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return typeof message === 'string' ? message : undefined;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  fallbackErrorMessage = DEFAULT_ERROR_MESSAGE,
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (!token) {
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !headers.has('Content-Type') && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new Error(getErrorMessage(body) || fallbackErrorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiAssetUrl(path: string): string {
  return new URL(path, API_URL).toString();
}

export interface CrudApi<T, CreateDto, UpdateDto> {
  getAll: () => Promise<T[]>;
  getOne: (id: string) => Promise<T>;
  create: (data: CreateDto) => Promise<T>;
  update: (id: string, data: UpdateDto) => Promise<T>;
  remove: (id: string) => Promise<T>;
}

export function createCrudApi<T, CreateDto, UpdateDto>(
  resourcePath: string,
): CrudApi<T, CreateDto, UpdateDto> {
  const itemPath = (id: string) => `${resourcePath}/${encodeURIComponent(id)}`;

  return {
    getAll: () => apiRequest<T[]>(resourcePath),
    getOne: (id) => apiRequest<T>(itemPath(id)),
    create: (data) =>
      apiRequest<T>(resourcePath, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiRequest<T>(itemPath(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    remove: (id) => apiRequest<T>(itemPath(id), { method: 'DELETE' }),
  };
}
