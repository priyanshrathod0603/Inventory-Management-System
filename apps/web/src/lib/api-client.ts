export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: ApiResponseMeta;
  message?: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  [key: string]: any;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly sms_session cookie
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = json?.error || {};
    throw new ApiError(
      response.status,
      errorData.code || 'HTTP_ERROR',
      errorData.message || response.statusText || 'An unexpected error occurred',
      errorData.details,
    );
  }

  return json as ApiResponse<T>;
}

apiClient.get = <T = any>(endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>) => {
  return apiClient<T>(endpoint, { ...options, method: 'GET' });
};

apiClient.post = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<RequestInit, 'method' | 'body'>,
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
};

apiClient.patch = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<RequestInit, 'method' | 'body'>,
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
};

apiClient.put = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<RequestInit, 'method' | 'body'>,
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
};

apiClient.delete = <T = any>(endpoint: string, options?: Omit<RequestInit, 'method'>) => {
  return apiClient<T>(endpoint, { ...options, method: 'DELETE' });
};
