export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: true;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  [key: string]: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[] | Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}
