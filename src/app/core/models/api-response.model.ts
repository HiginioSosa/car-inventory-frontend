export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  name: string;
  message: string;
  customMessage: string;
}
