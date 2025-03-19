import { ApiResponse } from '@/types/api';

interface RequestOptions {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || '') {
    this.baseUrl = baseUrl;
  }

  async GET<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = new URL(path, this.baseUrl);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString());
    return response.json();
  }

  async POST<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    return response.json();
  }
}

const client = new ApiClient();
export default client;