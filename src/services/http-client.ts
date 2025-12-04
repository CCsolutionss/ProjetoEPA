/**
 * Cliente HTTP genérico para comunicação com os microserviços
 * 
 * Responsabilidades:
 * - Fazer requisições HTTP (GET, POST, PUT, DELETE)
 * - Adicionar headers de autenticação automaticamente
 * - Tratar erros de forma consistente
 * - Adicionar timeout nas requisições
 */

import { TOKEN_STORAGE_KEY, REQUEST_TIMEOUT } from './config';

export interface HttpClientOptions extends RequestInit {
  timeout?: number;
  requiresAuth?: boolean;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`HTTP Error ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtém o token de autenticação do storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Cria headers padrão para requisições
   */
  private createHeaders(requiresAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Faz uma requisição HTTP genérica com timeout
   */
  private async request<T>(
    endpoint: string,
    options: HttpClientOptions = {}
  ): Promise<T> {
    const { 
      timeout = REQUEST_TIMEOUT, 
      requiresAuth = true,
      ...fetchOptions 
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...this.createHeaders(requiresAuth),
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Trata respostas sem conteúdo (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new HttpError(
          response.status,
          response.statusText,
          data
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Requisição excedeu o tempo limite de ${timeout}ms`);
        }
        throw new Error(`Erro na requisição: ${error.message}`);
      }

      throw new Error('Erro desconhecido na requisição');
    }
  }

  /**
   * Método GET
   */
  async get<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Método POST
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Método PUT
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Método PATCH
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Método DELETE
   */
  async delete<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Constrói query string a partir de objeto
   */
  buildQueryString(params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }

    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}
