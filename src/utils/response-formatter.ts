
import { ZodError } from 'zod';

interface ApiResponse<T> {
  code: number;
  data: T | null;
  error?: string | null;
}

/**
 * 格式化成功响应
 */
export function formatSuccess<T>(data: T): ApiResponse<T> {
  return {
    code: 200,
    data,
    error: null,
  };
}

/**
 * 格式化错误响应
 */
export function formatError(code: number, message: string): ApiResponse<null> {
  return {
    code,
    data: null,
    error: message,
  };
}

/**
 * 格式化Zod验证错误
 */
export function formatZodError(error: ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.join('.');
      return `${path ? path + ': ' : ''}${err.message}`;
    })
    .join('; ');
}
