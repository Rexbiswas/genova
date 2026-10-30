const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isLocalhost ? 'http://localhost:5000/api' : '/api');

export function getAppMode(): 'demo' | 'live' {
  const stored = localStorage.getItem('genova_app_mode');
  if (stored === 'live' || stored === 'demo') return stored;
  // If running in production with no custom backend url, default to demo mode for guaranteed uptime
  if (!isLocalhost && !import.meta.env.VITE_API_BASE_URL) return 'demo';
  return import.meta.env.VITE_APP_MODE === 'live' ? 'live' : 'live';
}

export function setAppMode(mode: 'demo' | 'live'): void {
  localStorage.setItem('genova_app_mode', mode);
}

export const IS_DEMO_MODE = getAppMode() === 'demo';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only add Content-Type: application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach token if present
  const token = localStorage.getItem('genova_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 4.5 second timeout to prevent infinite loading on slow/blocked mobile connections
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers,
      credentials: 'include', // Send and receive HttpOnly cookies
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, errorBody.message || 'Network request failed', errorBody);
    }

    return (await res.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error instanceof Error ? error.message : 'Backend service is unavailable');
  }
}
