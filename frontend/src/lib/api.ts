/**
 * API service for making requests to the backend
 */

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `Error: ${response.status} ${response.statusText}`,
      };
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return { data: {} as T };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * API methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(url: string, options?: RequestInit) =>
    fetchApi<T>(`/api${url}`, { method: 'GET', ...options }),

  /**
   * POST request
   */
  post: <T>(url: string, data: any, options?: RequestInit) =>
    fetchApi<T>(`/api${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),

  /**
   * PUT request
   */
  put: <T>(url: string, data: any, options?: RequestInit) =>
    fetchApi<T>(`/api${url}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),

  /**
   * DELETE request
   */
  delete: <T>(url: string, options?: RequestInit) =>
    fetchApi<T>(`/api${url}`, { method: 'DELETE', ...options }),
}; 