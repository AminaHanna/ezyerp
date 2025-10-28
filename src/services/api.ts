// API Configuration and HTTP Client
const API_BASE_URL = "https://ezyerp.ezyplus.in";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: FormData | Record<string, any>;
  token?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken(): void {
    const stored = localStorage.getItem("auth_token");
    if (stored) {
      this.token = stored;
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const method = options.method || "POST";

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...options.headers,
    };

    let body: string | FormData | undefined;

    if (options.body) {
      if (options.body instanceof FormData) {
        body = options.body;
      } else {
        // Convert object to FormData for form-based API
        const formData = new FormData();
        Object.entries(options.body).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });
        body = formData;
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      body,
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      // Check if response looks like SQL (starts with SELECT, INSERT, etc.)
      if (responseText.trim().toUpperCase().startsWith('SELECT') ||
          responseText.trim().toUpperCase().startsWith('INSERT') ||
          responseText.trim().toUpperCase().startsWith('UPDATE')) {
        console.error(`API Error [${endpoint}]: Backend returned SQL instead of JSON:`, responseText.substring(0, 100));
        throw new Error(`Backend error: API endpoint returned invalid response. Please contact support.`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`API Error [${endpoint}]: Failed to parse JSON response:`, responseText.substring(0, 200));
        throw new Error(`Invalid API response format. Expected JSON but got: ${responseText.substring(0, 50)}`);
      }

      // Log the response for debugging
      console.log(`API Response [${endpoint}]:`, data);

      // Check if response has a 'flag' field (EzyERP API pattern)
      if (typeof data === 'object' && data !== null && 'flag' in data) {
        if (!data.flag) {
          // API returned flag: false, throw error with message
          const errorMessage = data.msg || data.error || 'API request failed';
          console.warn(`API Error [${endpoint}]: ${errorMessage}`, data);
          const error = new Error(errorMessage);
          (error as any).apiResponse = data;
          throw error;
        }
      }

      return data as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: Record<string, any>,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

