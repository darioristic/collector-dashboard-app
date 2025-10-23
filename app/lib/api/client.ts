class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL = '') {
    this.baseURL = baseURL;
    // Set demo token immediately
    this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjEyMjgxMTcsImV4cCI6MTc2MTMxNDUxN30.D8jSuzXS3omj9edQkfnMEfwE9M_hYmh_Uammz5HoTfQ";
    console.log('🔧 API Client initialized with token:', this.token ? 'YES' : 'NO');
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    });

    // Always set the demo token for now
    const demoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjEyMjgxMTcsImV4cCI6MTc2MTMxNDUxN30.D8jSuzXS3omj9edQkfnMEfwE9M_hYmh_Uammz5HoTfQ";
    headers.set('Authorization', `Bearer ${demoToken}`);
    console.log('🔑 API Request with demo token:', demoToken.substring(0, 20) + '...');

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.error?.message || 'Request failed',
          response.status,
          data.error?.code,
          data.error?.details
        );
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params
      ? `?${new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => [k, String(v)])
        )}`
      : '';

    return this.request<T>(`${endpoint}${searchParams}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Use mock APIs if NEXT_PUBLIC_USE_MOCK_API is set
const useMockAPI = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const baseURL = useMockAPI ? '/api/v1' : '/api/v1';

export const apiClient = new APIClient(baseURL);

export { APIError };

// Helper to check if using mock data
export const isMockMode = () => useMockAPI;

