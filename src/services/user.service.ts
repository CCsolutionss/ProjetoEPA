/**
 * Serviço de Gestão de Usuários
 * 
 * TODO: BACKEND - Microserviço de Usuários (user-service)
 * Porta: 3002
 * Base URL: /api
 * 
 * Responsabilidades:
 * - CRUD de usuários
 * - Gestão de permissões
 * - Gestão de perfis e roles
 * 
 * Permissões:
 * - Apenas admins podem criar, editar e deletar usuários
 * - Usuários podem visualizar seu próprio perfil
 * - Viewers podem apenas visualizar lista de usuários
 */

import { HttpClient } from './http-client';
import { SERVICE_URLS } from './config';
import { User, UserPermission } from '../types/user';

// ==================== REQUEST/RESPONSE TYPES ====================

export interface CreateUserRequest {
  nomeCompleto: string;
  matricula: string;
  email: string;
  cargo: string;
  role: 'admin' | 'user' | 'viewer';
  senha: string;
}

export interface UpdateUserRequest {
  nomeCompleto?: string;
  email?: string;
  cargo?: string;
  role?: 'admin' | 'user' | 'viewer';
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'user' | 'viewer';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdatePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface UpdatePermissionsRequest {
  permissions: UserPermission[];
}

// ==================== SERVICE CLASS ====================

class UserService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(SERVICE_URLS.USER);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de listagem de usuários
   * 
   * Endpoint: GET /users
   * Headers: { Authorization: Bearer <token> }
   * Query: ?page=1&limit=10&search=xxx&role=xxx&sortBy=xxx&sortOrder=xxx
   * Response: { users: User[], total: number, page: number, totalPages: number }
   * 
   * Funcionalidades:
   * - Paginação (padrão: 10 por página)
   * - Busca por nome, matrícula ou email
   * - Filtro por role
   * - Ordenação por qualquer campo
   * 
   * Permissões:
   * - Admin: pode ver todos os usuários
   * - User: pode ver apenas sua própria informação
   * - Viewer: pode ver lista básica de usuários
   * 
   * Códigos de resposta:
   * - 200: Lista retornada com sucesso
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const queryString = this.client.buildQueryString(params);
    return this.client.get<GetUsersResponse>(`/users${queryString}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de buscar usuário por ID
   * 
   * Endpoint: GET /users/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { user: User }
   * 
   * Permissões:
   * - Admin: pode ver qualquer usuário
   * - User: pode ver apenas próprio perfil
   * - Viewer: pode ver informações básicas
   * 
   * Códigos de resposta:
   * - 200: Usuário encontrado
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Usuário não encontrado
   */
  async getUserById(id: string): Promise<{ user: User }> {
    return this.client.get<{ user: User }>(`/users/${id}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de criação de usuário
   * 
   * Endpoint: POST /users
   * Headers: { Authorization: Bearer <token> }
   * Body: CreateUserRequest
   * Response: { user: User }
   * 
   * Validações:
   * - Matricula única
   * - Email único e válido
   * - Senha forte (mínimo 8 caracteres)
   * - Role válido
   * 
   * Processamento:
   * - Hash da senha
   * - Criar usuário no banco
   * - Criar permissões padrão baseado no role
   * - Enviar email de boas-vindas com credenciais
   * 
   * Permissões:
   * - Apenas admin pode criar usuários
   * 
   * Códigos de resposta:
   * - 201: Usuário criado com sucesso
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão (não é admin)
   * - 409: Matricula ou email já existem
   */
  async createUser(data: CreateUserRequest): Promise<{ user: User }> {
    return this.client.post<{ user: User }>('/users', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de atualização de usuário
   * 
   * Endpoint: PUT /users/:id
   * Headers: { Authorization: Bearer <token> }
   * Body: UpdateUserRequest
   * Response: { user: User }
   * 
   * Validações:
   * - Email único (se alterado)
   * - Role válido (se alterado)
   * 
   * Regras:
   * - Não pode alterar próprio role (evitar auto-promoção)
   * - Deve ter pelo menos 1 admin no sistema
   * 
   * Permissões:
   * - Admin: pode atualizar qualquer usuário
   * - User: pode atualizar apenas dados próprios (exceto role)
   * 
   * Códigos de resposta:
   * - 200: Usuário atualizado
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Usuário não encontrado
   * - 409: Email já existe
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<{ user: User }> {
    return this.client.put<{ user: User }>(`/users/${id}`, data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de exclusão de usuário
   * 
   * Endpoint: DELETE /users/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Regras:
   * - Não pode deletar próprio usuário
   * - Deve ter pelo menos 1 admin no sistema
   * - Soft delete (marcar como inativo) ou hard delete
   * 
   * Processamento:
   * - Marcar usuário como inativo
   * - Invalidar todos os tokens do usuário
   * - Manter histórico de medições criadas por ele
   * 
   * Permissões:
   * - Apenas admin pode deletar usuários
   * 
   * Códigos de resposta:
   * - 200: Usuário deletado
   * - 400: Não pode deletar próprio usuário
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Usuário não encontrado
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/users/${id}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de alteração de senha
   * 
   * Endpoint: PUT /users/:id/password
   * Headers: { Authorization: Bearer <token> }
   * Body: { senhaAtual: string, novaSenha: string }
   * Response: { message: string }
   * 
   * Validações:
   * - Senha atual correta
   * - Nova senha forte
   * - Nova senha diferente da atual
   * 
   * Processamento:
   * - Verificar senha atual
   * - Hash da nova senha
   * - Atualizar senha
   * - Enviar email de confirmação
   * 
   * Permissões:
   * - Usuário pode alterar própria senha
   * - Admin pode resetar senha de qualquer usuário (sem precisar senha atual)
   * 
   * Códigos de resposta:
   * - 200: Senha alterada
   * - 400: Dados inválidos
   * - 401: Senha atual incorreta ou não autenticado
   * - 403: Sem permissão
   * - 404: Usuário não encontrado
   */
  async updatePassword(id: string, data: UpdatePasswordRequest): Promise<{ message: string }> {
    return this.client.put<{ message: string }>(`/users/${id}/password`, data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de buscar permissões do usuário
   * 
   * Endpoint: GET /users/:id/permissions
   * Headers: { Authorization: Bearer <token> }
   * Response: { permissions: UserPermission[] }
   * 
   * Retorna:
   * - Lista de permissões por recurso
   * - CRUD permissions para cada recurso (medições, bases, relatórios)
   * 
   * Códigos de resposta:
   * - 200: Permissões retornadas
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Usuário não encontrado
   */
  async getUserPermissions(userId: string): Promise<{ permissions: UserPermission[] }> {
    return this.client.get<{ permissions: UserPermission[] }>(`/users/${userId}/permissions`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de atualizar permissões
   * 
   * Endpoint: PUT /users/:id/permissions
   * Headers: { Authorization: Bearer <token> }
   * Body: { permissions: UserPermission[] }
   * Response: { permissions: UserPermission[] }
   * 
   * Validações:
   * - Recursos válidos
   * - Pelo menos uma permissão de leitura para recursos críticos
   * 
   * Processamento:
   * - Substituir todas as permissões do usuário
   * - Registrar log de alteração de permissões
   * 
   * Permissões:
   * - Apenas admin pode alterar permissões
   * 
   * Códigos de resposta:
   * - 200: Permissões atualizadas
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Usuário não encontrado
   */
  async updateUserPermissions(
    userId: string,
    data: UpdatePermissionsRequest
  ): Promise<{ permissions: UserPermission[] }> {
    return this.client.put<{ permissions: UserPermission[] }>(
      `/users/${userId}/permissions`,
      data
    );
  }

  /**
   * TODO: BACKEND - Implementar endpoint de buscar estatísticas do usuário
   * 
   * Endpoint: GET /users/:id/stats
   * Headers: { Authorization: Bearer <token> }
   * Response: { stats: { totalMedicoes: number, ultimaAtividade: string, ... } }
   * 
   * Retorna:
   * - Total de medições criadas
   * - Data da última atividade
   * - Bases mais utilizadas
   * 
   * Códigos de resposta:
   * - 200: Estatísticas retornadas
   * - 401: Não autenticado
   * - 404: Usuário não encontrado
   */
  async getUserStats(userId: string): Promise<{ stats: any }> {
    return this.client.get<{ stats: any }>(`/users/${userId}/stats`);
  }
}

export const userService = new UserService();
