export type Category = 'equipment' | 'safety';

export interface Product {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  summary_ar: string | null;
  summary_en: string | null;
  category: Category;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function token(): string | null {
  return localStorage.getItem('kuriha_token');
}

export function setToken(value: string | null) {
  if (value) localStorage.setItem('kuriha_token', value);
  else localStorage.removeItem('kuriha_token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  const current = token();
  if (current) headers.set('Authorization', `Bearer ${current}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || 'تعذر تنفيذ الطلب');
  }
  return body as T;
}
