import { apiRequest, initializeCsrf } from '@/shared/api/apiClient';

export type User = {
  id: number;
  name: string;
  email: string;
  onboarding_skipped_at: string | null;
};

export type LoginData = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function login(data: LoginData): Promise<{ user: User }> {
  await initializeCsrf();

  return apiRequest<{ user: User }>('/api/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterData): Promise<{ user: User }> {
  await initializeCsrf();

  return apiRequest<{ user: User }>('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/user');
}

export async function logout(): Promise<void> {
  await initializeCsrf();

  return apiRequest<void>('/api/logout', {
    method: 'POST',
  });
}
