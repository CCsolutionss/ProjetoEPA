/**
 * Configuração de URLs dos Microserviços
 * 
 * TODO: BACKEND - Configurar URLs dos microserviços em produção
 * 
 * Estrutura de Microserviços do EPA:
 * - auth-service: Autenticação e autorização
 * - user-service: Gestão de usuários e permissões
 * - medicao-service: Medições e bases de medição
 * - notification-service: Notificações do sistema
 * - settings-service: Configurações e logs do sistema
 * 
 * Em desenvolvimento, todos os serviços podem apontar para o mesmo servidor
 * usando diferentes prefixos de rota. Em produção, cada serviço terá sua própria URL.
 */

// Ambiente atual (development, staging, production)
const ENVIRONMENT = import.meta.env.MODE || 'development';

// URLs base para desenvolvimento
const DEVELOPMENT_CONFIG = {
  AUTH_SERVICE_URL: 'http://localhost:3001/api',
  USER_SERVICE_URL: 'http://localhost:3002/api',
  MEDICAO_SERVICE_URL: 'http://localhost:3003/api',
  NOTIFICATION_SERVICE_URL: 'http://localhost:3004/api',
  SETTINGS_SERVICE_URL: 'http://localhost:3005/api',
};

// URLs base para produção
const PRODUCTION_CONFIG = {
  AUTH_SERVICE_URL: 'https://auth.epa.com.br/api',
  USER_SERVICE_URL: 'https://users.epa.com.br/api',
  MEDICAO_SERVICE_URL: 'https://medicoes.epa.com.br/api',
  NOTIFICATION_SERVICE_URL: 'https://notifications.epa.com.br/api',
  SETTINGS_SERVICE_URL: 'https://settings.epa.com.br/api',
};

// Seleciona configuração baseada no ambiente
const config = ENVIRONMENT === 'production' ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG;

export const SERVICE_URLS = {
  AUTH: config.AUTH_SERVICE_URL,
  USER: config.USER_SERVICE_URL,
  MEDICAO: config.MEDICAO_SERVICE_URL,
  NOTIFICATION: config.NOTIFICATION_SERVICE_URL,
  SETTINGS: config.SETTINGS_SERVICE_URL,
};

// Timeout padrão para requisições (em milissegundos)
export const REQUEST_TIMEOUT = 30000;

// Chave para armazenar o token no localStorage/sessionStorage
export const TOKEN_STORAGE_KEY = 'epa_auth_token';
export const USER_STORAGE_KEY = 'epa_user_data';
