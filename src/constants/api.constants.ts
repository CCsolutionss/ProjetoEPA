/**
 * API Constants
 * 
 * Centralized configuration for API endpoints, delays, and other constants.
 * Update these values when integrating with the real backend.
 */

/**
 * Network simulation delays (milliseconds)
 * Used for mocking API calls during development
 */
export const NETWORK_DELAYS = {
  /** Short delay for simple operations (e.g., validation) */
  SHORT: 500,
  /** Medium delay for standard operations (e.g., login, save) */
  MEDIUM: 800,
  /** Long delay for complex operations (e.g., reports, bulk operations) */
  LONG: 1500,
} as const;

/**
 * API Endpoints
 * Define all backend endpoints here
 * TODO: Update with actual backend URL when available
 */
export const API_ENDPOINTS = {
  // Base URL - Update this when backend is deployed
  BASE_URL: 'http://localhost:3000/api',
  
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_TOKEN: '/auth/me',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PERMISSIONS: (id: string) => `/users/${id}/permissions`,
  },
  
  // Bases
  BASES: {
    LIST: '/bases',
    CREATE: '/bases',
    GET_BY_ID: (id: string) => `/bases/${id}`,
    UPDATE: (id: string) => `/bases/${id}`,
    DELETE: (id: string) => `/bases/${id}`,
    NEXT_ID: '/bases/next-id',
  },
  
  // Measurements (Medições)
  MEDICOES: {
    LIST: '/medicoes',
    CREATE: '/medicoes',
    GET_BY_ID: (id: string) => `/medicoes/${id}`,
    UPDATE: (id: string) => `/medicoes/${id}`,
    DELETE: (id: string) => `/medicoes/${id}`,
    DRAFT: '/medicoes/rascunho',
  },
  
  // Reports (Relatórios)
  RELATORIOS: {
    GENERATE: '/relatorios',
    EXPORT: '/relatorios/export',
    STATISTICS: '/relatorios/statistics',
  },
  
  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Storage Keys
 * Keys used for localStorage and sessionStorage
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

/**
 * Time intervals (milliseconds)
 */
export const TIME_INTERVALS = {
  /** Timestamp update interval */
  TIMESTAMP_UPDATE: 1000,
  /** Token refresh interval (15 minutes) */
  TOKEN_REFRESH: 15 * 60 * 1000,
  /** Session timeout warning (25 minutes) */
  SESSION_WARNING: 25 * 60 * 1000,
  /** Session timeout (30 minutes) */
  SESSION_TIMEOUT: 30 * 60 * 1000,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf', 'text/csv', 'application/vnd.ms-excel'],
} as const;
