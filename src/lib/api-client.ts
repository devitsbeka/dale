/**
 * API Client for communicating with Rust backend
 * Handles authentication, error handling, and request/response formatting
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Send cookies for session
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Parse response body
  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Handle errors
  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || 'An error occurred',
      response.status,
      data
    );
  }

  return data as T;
}

// ============================================================================
// Auth API
// ============================================================================

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (request: SignupRequest): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Log in an existing user
   */
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Get current user info
   */
  me: async (): Promise<AuthResponse['user']> => {
    return fetchAPI<AuthResponse['user']>('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Log out current user
   */
  logout: async (): Promise<void> => {
    return fetchAPI<void>('/auth/logout', {
      method: 'POST',
    });
  },
};

// ============================================================================
// Jobs API (placeholder - to be implemented)
// ============================================================================

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  url: string;
  source: string;
  posted_at?: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  remote?: boolean;
  salary_min?: number;
  page?: number;
  limit?: number;
}

export const jobsApi = {
  /**
   * Search jobs across all sources
   */
  search: async (params: JobSearchParams): Promise<Job[]> => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return fetchAPI<Job[]>(`/api/jobs?${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Get saved jobs
   */
  saved: async (): Promise<Job[]> => {
    return fetchAPI<Job[]>('/api/jobs/saved', {
      method: 'GET',
    });
  },

  /**
   * Save a job
   */
  save: async (jobId: string): Promise<void> => {
    return fetchAPI<void>(`/api/jobs/${jobId}/save`, {
      method: 'POST',
    });
  },

  /**
   * Unsave a job
   */
  unsave: async (jobId: string): Promise<void> => {
    return fetchAPI<void>(`/api/jobs/${jobId}/save`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Resumes API (placeholder - to be implemented)
// ============================================================================

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  data: any; // JSON data
  created_at: string;
  updated_at: string;
}

export const resumesApi = {
  /**
   * Get all resumes for current user
   */
  list: async (): Promise<Resume[]> => {
    return fetchAPI<Resume[]>('/api/resumes', {
      method: 'GET',
    });
  },

  /**
   * Get a single resume by ID
   */
  get: async (id: string): Promise<Resume> => {
    return fetchAPI<Resume>(`/api/resumes/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new resume
   */
  create: async (data: Partial<Resume>): Promise<Resume> => {
    return fetchAPI<Resume>('/api/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing resume
   */
  update: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    return fetchAPI<Resume>(`/api/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a resume
   */
  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/resumes/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Health Check
// ============================================================================

export interface HealthResponse {
  status: string;
  database: string;
  timestamp: string;
}

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    return fetchAPI<HealthResponse>('/health', {
      method: 'GET',
    });
  },
};

// ============================================================================
// Default export with all API modules
// ============================================================================

const apiClient = {
  auth: authApi,
  jobs: jobsApi,
  resumes: resumesApi,
  health: healthApi,
};

export default apiClient;
