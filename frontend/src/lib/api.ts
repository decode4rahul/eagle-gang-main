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
        ...options?.headers,
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
    
  /**
   * File upload with form data
   */
  uploadFile: async <T>(url: string, file: File, projectData?: any): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      
      // Append file to form data
      formData.append('file', file);
      
      // Append project data as JSON string
      if (projectData) {
        formData.append('project', new Blob([JSON.stringify(projectData)], {
          type: 'application/json'
        }));
      }
      
      const response = await fetch(`/api${url}`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, browser will set it with the boundary
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || `Error: ${response.status} ${response.statusText}`,
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
  
  /**
   * Download a file
   */
  downloadFile: (url: string): void => {
    window.location.href = `/api${url}`;
  }
}; 