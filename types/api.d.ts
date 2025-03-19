declare module '@/types/api' {
  export interface ApiResponse<T> {
    code?: number;
    data?: T;
  }

  export interface ListResponse<T> {
    list: T[];
  }
}