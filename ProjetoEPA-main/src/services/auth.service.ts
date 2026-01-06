/**
 * Serviço de Autenticação
 * 
 * TODO: BACKEND - Microserviço de Autenticação (auth-service)
 * Porta: 3001
 * Base URL: /api
 * 
 * Responsabilidades:
 * - Login e registro de usuários
 * - Validação e renovação de tokens JWT
 * - Recuperação de senha
 * - Logout e invalidação de tokens
 * 
 * Tecnologias sugeridas:
 * - Node.js + Express/NestJS
 * - JWT para tokens
 * - bcrypt para hash de senhas
 * - Redis para blacklist de tokens
 */

import { HttpClient } from './http-client';
import { SERVICE_URLS, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';
import { User } from '../types/user';

// ==================== REQUEST/RESPONSE TYPES ====================

export interface LoginRequest {
  matricula: string;
  senha: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  nomeCompleto: string;
  matricula: string;
  email: string;
  cargo: string;
  senha: string;
  confirmarSenha: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
  confirmarSenha: string;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

// ==================== SERVICE CLASS ====================

class AuthService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(SERVICE_URLS.AUTH);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de login
   * 
   * Endpoint: POST /auth/login
   * Headers: { Content-Type: application/json }
   * Body: { matricula: string, senha: string }
   * Response: { user: User, token: string, refreshToken?: string, expiresIn?: number }
   * 
   * Validações:
   * - Matricula e senha são obrigatórios
   * - Verificar se usuário existe
   * - Verificar se senha está correta (bcrypt.compare)
   * - Gerar token JWT com dados do usuário
   * - Registrar log de login
   * 
   * Códigos de resposta:
   * - 200: Login bem-sucedido
   * - 400: Dados inválidos
   * - 401: Credenciais inválidas
   * - 429: Muitas tentativas de login (rate limiting)
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>(
      '/auth/login',
      data,
      { requiresAuth: false }
    );

    // Salva token no storage
    if (response.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * TODO: BACKEND - Implementar endpoint de registro
   * 
   * Endpoint: POST /auth/register
   * Headers: { Content-Type: application/json }
   * Body: RegisterRequest
   * Response: { user: User, token: string }
   * 
   * Validações:
   * - Todos os campos obrigatórios preenchidos
   * - Email válido
   * - Matricula não existe no sistema
   * - Email não existe no sistema
   * - Senha forte (mínimo 8 caracteres, letras e números)
   * - Senhas coincidem
   * 
   * Processamento:
   * - Hash da senha com bcrypt
   * - Criar usuário no banco
   * - Gerar token JWT
   * - Enviar email de boas-vindas (async)
   * 
   * Códigos de resposta:
   * - 201: Usuário criado com sucesso
   * - 400: Dados inválidos
   * - 409: Matricula ou email já existem
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    return this.client.post<LoginResponse>(
      '/auth/register',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * TODO: BACKEND - Implementar endpoint de verificação de usuário
   * 
   * Endpoint: GET /auth/me
   * Headers: { Authorization: Bearer <token> }
   * Response: { user: User }
   * 
   * Validações:
   * - Token válido e não expirado
   * - Token não está na blacklist
   * - Usuário ainda existe e está ativo
   * 
   * Códigos de resposta:
   * - 200: Usuário encontrado
   * - 401: Token inválido ou expirado
   * - 404: Usuário não encontrado
   */
  async getCurrentUser(): Promise<{ user: User }> {
    return this.client.get<{ user: User }>('/auth/me');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de logout
   * 
   * Endpoint: POST /auth/logout
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Processamento:
   * - Adicionar token na blacklist (Redis)
   * - Registrar log de logout
   * 
   * Códigos de resposta:
   * - 200: Logout bem-sucedido
   * - 401: Token inválido
   */
  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      // Remove token do storage mesmo se a requisição falhar
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  /**
   * TODO: BACKEND - Implementar endpoint de esqueceu senha
   * 
   * Endpoint: POST /auth/forgot-password
   * Headers: { Content-Type: application/json }
   * Body: { email: string }
   * Response: { message: string }
   * 
   * Processamento:
   * - Verificar se email existe
   * - Gerar token de recuperação (válido por 1 hora)
   * - Salvar token no banco com data de expiração
   * - Enviar email com link de recuperação
   * - Link formato: https://epa.com.br/reset-password?token=xxxxx
   * 
   * Segurança:
   * - Sempre retornar sucesso mesmo se email não existir (evitar enumeration)
   * - Rate limiting: máximo 3 tentativas por hora
   * - Token único e seguro (crypto.randomBytes)
   * 
   * Códigos de resposta:
   * - 200: Email enviado (ou não, mas sempre retorna 200)
   * - 429: Muitas tentativas
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.client.post<{ message: string }>(
      '/auth/forgot-password',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * TODO: BACKEND - Implementar endpoint de redefinir senha
   * 
   * Endpoint: POST /auth/reset-password
   * Headers: { Content-Type: application/json }
   * Body: { token: string, novaSenha: string, confirmarSenha: string }
   * Response: { message: string }
   * 
   * Validações:
   * - Token existe e não expirou
   * - Senha forte
   * - Senhas coincidem
   * - Nova senha diferente da anterior
   * 
   * Processamento:
   * - Hash da nova senha
   * - Atualizar senha no banco
   * - Invalidar token de recuperação
   * - Invalidar todos os tokens JWT do usuário (força novo login)
   * - Enviar email de confirmação
   * 
   * Códigos de resposta:
   * - 200: Senha alterada com sucesso
   * - 400: Dados inválidos ou senhas não coincidem
   * - 401: Token inválido ou expirado
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.client.post<{ message: string }>(
      '/auth/reset-password',
      data,
      { requiresAuth: false }
    );
  }

  /**
   * TODO: BACKEND - Implementar endpoint de trocar senha
   * 
   * Endpoint: POST /auth/change-password
   * Headers: { Authorization: Bearer <token> }
   * Body: { senhaAtual: string, novaSenha: string, confirmarSenha: string }
   * Response: { message: string }
   * 
   * Validações:
   * - Senha atual está correta
   * - Nova senha diferente da atual
   * - Senha forte
   * - Senhas coincidem
   * 
   * Processamento:
   * - Verificar senha atual
   * - Hash da nova senha
   * - Atualizar senha no banco
   * - Enviar email de notificação
   * 
   * Códigos de resposta:
   * - 200: Senha alterada com sucesso
   * - 400: Dados inválidos
   * - 401: Senha atual incorreta
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.client.post<{ message: string }>('/auth/change-password', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de renovação de token
   * 
   * Endpoint: POST /auth/refresh-token
   * Headers: { Content-Type: application/json }
   * Body: { refreshToken: string }
   * Response: { token: string, refreshToken: string, expiresIn: number }
   * 
   * Validações:
   * - Refresh token válido e não expirado
   * - Refresh token não está na blacklist
   * 
   * Processamento:
   * - Gerar novo access token
   * - Gerar novo refresh token
   * - Invalidar refresh token antigo
   * 
   * Códigos de resposta:
   * - 200: Token renovado
   * - 401: Refresh token inválido
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.client.post<LoginResponse>(
      '/auth/refresh-token',
      { refreshToken },
      { requiresAuth: false }
    );
  }
}

export const authService = new AuthService();
