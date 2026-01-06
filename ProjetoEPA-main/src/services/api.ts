/**
 * @deprecated Este arquivo está sendo mantido apenas para compatibilidade com código legado.
 * 
 * NOVO: Use os serviços específicos da pasta /services:
 * - authService (auth.service.ts)
 * - userService (user.service.ts)
 * - medicaoService (medicao.service.ts)
 * - notificationService (notification.service.ts)
 * - settingsService (settings.service.ts)
 * 
 * Importação nova:
 * import { authService, userService } from '../services';
 * 
 * Benefícios da nova estrutura:
 * - Arquitetura de microserviços
 * - Código mais limpo e organizado
 * - Melhor tipagem TypeScript
 * - Documentação completa com TODOs
 * - HttpClient genérico com timeout e tratamento de erros
 */

import type { LegacyLoginRequest as LoginRequest, LegacyRegisterRequest as RegisterRequest } from '../types/auth';
import type { User } from '../types/user';

export interface LoginResponse {
  token: string;
  user: User;
}

// Configure a URL base da API aqui
// Altere esta URL para apontar para o seu backend
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Método genérico para fazer requisições
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Erro ao processar requisição',
        }));
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro desconhecido ao fazer requisição');
    }
  }

  // Serviços de autenticação
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Salvar token no localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    // TODO: API - Fazer logout no backend (invalidar token)
    // Endpoint: POST /api/auth/logout
    // Headers: { Authorization: `Bearer ${token}` }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
  }

  // TODO: API - Buscar dados do usuário autenticado
  // Endpoint: GET /api/auth/me
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { user: User }
  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // ==================== MEDIÇÕES ====================
  
  // TODO: API - Criar nova medição
  // Endpoint: POST /api/medicoes
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { baseId: string, data: string, valores: object, observacoes?: string }
  // Response: { medicao: Medicao }
  async createMedicao(data: any) {
    return this.request('/medicoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // TODO: API - Listar medições com filtros
  // Endpoint: GET /api/medicoes
  // Headers: { Authorization: `Bearer ${token}` }
  // Query: ?page=1&limit=10&baseId=xxx&dataInicio=xxx&dataFim=xxx&search=xxx
  // Response: { medicoes: Medicao[], total: number, page: number, totalPages: number }
  async getMedicoes(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/medicoes${queryString ? `?${queryString}` : ''}`);
  }

  // TODO: API - Buscar medição por ID
  // Endpoint: GET /api/medicoes/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { medicao: Medicao }
  async getMedicaoById(id: string) {
    return this.request(`/medicoes/${id}`);
  }

  // TODO: API - Atualizar medição
  // Endpoint: PUT /api/medicoes/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { data?: string, valores?: object, observacoes?: string }
  // Response: { medicao: Medicao }
  async updateMedicao(id: string, data: any) {
    return this.request(`/medicoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // TODO: API - Deletar medição
  // Endpoint: DELETE /api/medicoes/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { message: string }
  async deleteMedicao(id: string) {
    return this.request(`/medicoes/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== BASES DE MEDIÇÕES ====================

  // TODO: API - Criar nova base
  // Endpoint: POST /api/bases
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { nome: string, descricao?: string, campos: array, ativo: boolean }
  // Response: { base: Base }
  async createBase(data: any) {
    return this.request('/bases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // TODO: API - Listar bases
  // Endpoint: GET /api/bases
  // Headers: { Authorization: `Bearer ${token}` }
  // Query: ?page=1&limit=10&search=xxx&ativo=true
  // Response: { bases: Base[], total: number, page: number, totalPages: number }
  async getBases(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bases${queryString ? `?${queryString}` : ''}`);
  }

  // TODO: API - Buscar base por ID
  // Endpoint: GET /api/bases/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { base: Base }
  async getBaseById(id: string) {
    return this.request(`/bases/${id}`);
  }

  // TODO: API - Atualizar base
  // Endpoint: PUT /api/bases/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { nome?: string, descricao?: string, campos?: array, ativo?: boolean }
  // Response: { base: Base }
  async updateBase(id: string, data: any) {
    return this.request(`/bases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // TODO: API - Deletar base
  // Endpoint: DELETE /api/bases/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { message: string }
  async deleteBase(id: string) {
    return this.request(`/bases/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== USUÁRIOS ====================

  // TODO: API - Criar novo usuário
  // Endpoint: POST /api/users
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { nomeCompleto: string, matricula: string, email: string, cargo: string, role: string, senha: string }
  // Response: { user: User }
  // Permissão: Apenas admin
  async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // TODO: API - Listar usuários
  // Endpoint: GET /api/users
  // Headers: { Authorization: `Bearer ${token}` }
  // Query: ?page=1&limit=10&search=xxx&role=xxx
  // Response: { users: User[], total: number, page: number, totalPages: number }
  async getUsers(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  // TODO: API - Buscar usuário por ID
  // Endpoint: GET /api/users/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { user: User }
  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  // TODO: API - Atualizar usuário
  // Endpoint: PUT /api/users/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { nomeCompleto?: string, email?: string, cargo?: string, role?: string }
  // Response: { user: User }
  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // TODO: API - Deletar usuário
  // Endpoint: DELETE /api/users/:id
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { message: string }
  // Permissão: Apenas admin
  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // TODO: API - Alterar senha do usuário
  // Endpoint: PUT /api/users/:id/password
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { senhaAtual: string, novaSenha: string }
  // Response: { message: string }
  async updatePassword(id: string, data: { senhaAtual: string; novaSenha: string }) {
    return this.request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== PERMISSÕES ====================

  // TODO: API - Buscar permissões do usuário
  // Endpoint: GET /api/users/:id/permissions
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { permissions: UserPermission[] }
  async getUserPermissions(userId: string) {
    return this.request(`/users/${userId}/permissions`);
  }

  // TODO: API - Atualizar permissões do usuário
  // Endpoint: PUT /api/users/:id/permissions
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { permissions: UserPermission[] }
  // Response: { permissions: UserPermission[] }
  // Permissão: Apenas admin
  async updateUserPermissions(userId: string, permissions: any) {
    return this.request(`/users/${userId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  }

  // ==================== NOTIFICAÇÕES ====================

  // TODO: API - Buscar notificações não lidas
  // Endpoint: GET /api/notifications/unread
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { count: number, notifications: Notification[] }
  async getUnreadNotifications() {
    return this.request('/notifications/unread');
  }

  // TODO: API - Buscar todas as notificações
  // Endpoint: GET /api/notifications
  // Headers: { Authorization: `Bearer ${token}` }
  // Query: ?page=1&limit=10
  // Response: { notifications: Notification[], total: number, page: number, totalPages: number }
  async getNotifications(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  // TODO: API - Marcar notificação como lida
  // Endpoint: PUT /api/notifications/:id/read
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { notification: Notification }
  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // ==================== CONFIGURAÇÕES ====================

  // TODO: API - Buscar configurações do sistema
  // Endpoint: GET /api/settings
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { settings: Settings }
  // Permissão: Apenas admin
  async getSettings() {
    return this.request('/settings');
  }

  // TODO: API - Atualizar configurações do sistema
  // Endpoint: PUT /api/settings
  // Headers: { Authorization: `Bearer ${token}` }
  // Body: { key: value, ... }
  // Response: { settings: Settings }
  // Permissão: Apenas admin
  async updateSettings(data: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
