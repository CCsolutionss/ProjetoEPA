/**
 * Serviço de Configurações e Logs
 * 
 * TODO: BACKEND - Microserviço de Configurações (settings-service)
 * Porta: 3005
 * Base URL: /api
 * 
 * Responsabilidades:
 * - Gestão de configurações do sistema
 * - Logs de auditoria
 * - Backup e restore
 * - Monitoramento de sistema
 */

import { HttpClient } from './http-client';
import { SERVICE_URLS } from './config';

// ==================== REQUEST/RESPONSE TYPES ====================

export interface SystemSettings {
  backupHorario?: string;
  backupAutomatico?: boolean;
  retencaoDados?: number; // dias
  notificacoesEmail?: boolean;
  emailAdministrador?: string;
  limiteUsuarios?: number;
  limiteMedicoesPorDia?: number;
  manutencaoModo?: boolean;
  versaoSistema?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  nivel: 'info' | 'warning' | 'error' | 'critical';
  modulo: string;
  mensagem: string;
  userId?: string;
  userName?: string;
  detalhes?: any;
}

export interface GetLogsParams {
  page?: number;
  limit?: number;
  dataInicio?: string;
  dataFim?: string;
  nivel?: 'info' | 'warning' | 'error' | 'critical';
  modulo?: string;
  userId?: string;
}

export interface GetLogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BackupConfig {
  horario: string;
  automatico: boolean;
  retencao: number;
}

export interface BackupInfo {
  id: string;
  data: string;
  tamanho: number;
  status: 'sucesso' | 'falha' | 'em_progresso';
  caminho?: string;
}

// ==================== SERVICE CLASS ====================

class SettingsService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(SERVICE_URLS.SETTINGS);
  }

  // ==================== CONFIGURAÇÕES ====================

  /**
   * TODO: BACKEND - Implementar endpoint de buscar configurações
   * 
   * Endpoint: GET /settings
   * Headers: { Authorization: Bearer <token> }
   * Response: { settings: SystemSettings }
   * 
   * Retorna:
   * - Todas as configurações do sistema
   * - Valores padrão se não configurado
   * 
   * Permissões:
   * - Apenas admin pode visualizar configurações
   * 
   * Códigos de resposta:
   * - 200: Configurações retornadas
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async getSettings(): Promise<{ settings: SystemSettings }> {
    return this.client.get<{ settings: SystemSettings }>('/settings');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de atualizar configurações
   * 
   * Endpoint: PUT /settings
   * Headers: { Authorization: Bearer <token> }
   * Body: Partial<SystemSettings>
   * Response: { settings: SystemSettings }
   * 
   * Validações:
   * - Horário de backup válido (HH:MM)
   * - Retenção mínima de 7 dias
   * - Email válido
   * - Limites razoáveis
   * 
   * Processamento:
   * - Atualizar configurações
   * - Registrar log de alteração
   * - Aplicar novas configurações (ex: reagendar backup)
   * - Notificar outros serviços se necessário
   * 
   * Permissões:
   * - Apenas admin pode atualizar configurações
   * 
   * Códigos de resposta:
   * - 200: Configurações atualizadas
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async updateSettings(data: Partial<SystemSettings>): Promise<{ settings: SystemSettings }> {
    return this.client.put<{ settings: SystemSettings }>('/settings', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de resetar configurações
   * 
   * Endpoint: POST /settings/reset
   * Headers: { Authorization: Bearer <token> }
   * Response: { settings: SystemSettings }
   * 
   * Processamento:
   * - Resetar para valores padrão
   * - Registrar log de reset
   * - Notificar administradores
   * 
   * Permissões:
   * - Apenas admin pode resetar
   * 
   * Códigos de resposta:
   * - 200: Configurações resetadas
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async resetSettings(): Promise<{ settings: SystemSettings }> {
    return this.client.post<{ settings: SystemSettings }>('/settings/reset');
  }

  // ==================== LOGS ====================

  /**
   * TODO: BACKEND - Implementar endpoint de listagem de logs
   * 
   * Endpoint: GET /logs
   * Headers: { Authorization: Bearer <token> }
   * Query: ?page=1&limit=50&dataInicio=xxx&dataFim=xxx&nivel=xxx&modulo=xxx&userId=xxx
   * Response: GetLogsResponse
   * 
   * Funcionalidades:
   * - Paginação (padrão: 50 por página)
   * - Filtro por período
   * - Filtro por nível de log
   * - Filtro por módulo
   * - Filtro por usuário
   * - Ordenação por data (mais recentes primeiro)
   * 
   * Performance:
   * - Índices: timestamp, nivel, modulo, userId
   * - Arquivar logs antigos (> 90 dias)
   * - Limite de 100.000 logs no banco
   * 
   * Permissões:
   * - Apenas admin pode visualizar logs
   * 
   * Códigos de resposta:
   * - 200: Logs retornados
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async getLogs(params?: GetLogsParams): Promise<GetLogsResponse> {
    const queryString = this.client.buildQueryString(params);
    return this.client.get<GetLogsResponse>(`/logs${queryString}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de criar log
   * 
   * Endpoint: POST /logs
   * Headers: { Authorization: Bearer <token> }
   * Body: { nivel: string, modulo: string, mensagem: string, detalhes?: any }
   * Response: { log: LogEntry }
   * 
   * Processamento:
   * - Criar entrada de log
   * - Associar usuário autenticado
   * - Armazenar timestamp
   * - Se nível critical, notificar admins
   * 
   * Códigos de resposta:
   * - 201: Log criado
   * - 400: Dados inválidos
   * - 401: Não autenticado
   */
  async createLog(data: Omit<LogEntry, 'id' | 'timestamp'>): Promise<{ log: LogEntry }> {
    return this.client.post<{ log: LogEntry }>('/logs', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de exportar logs
   * 
   * Endpoint: POST /logs/export
   * Headers: { Authorization: Bearer <token> }
   * Body: { dataInicio?: string, dataFim?: string, formato: 'csv' | 'json' }
   * Response: Blob (arquivo)
   * 
   * Funcionalidades:
   * - Exportar para CSV ou JSON
   * - Filtro por período
   * - Incluir todos os campos
   * 
   * Processamento:
   * - Gerar arquivo temporário
   * - Retornar link de download
   * - Limpar após 1 hora
   * 
   * Permissões:
   * - Apenas admin pode exportar logs
   * 
   * Códigos de resposta:
   * - 200: Arquivo gerado
   * - 400: Parâmetros inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async exportLogs(params: { dataInicio?: string; dataFim?: string; formato: 'csv' | 'json' }): Promise<Blob> {
    return this.client.post<Blob>('/logs/export', params);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de limpar logs antigos
   * 
   * Endpoint: DELETE /logs/cleanup
   * Headers: { Authorization: Bearer <token> }
   * Query: ?diasRetencao=90
   * Response: { deleted: number }
   * 
   * Processamento:
   * - Deletar logs mais antigos que X dias
   * - Manter logs críticos por mais tempo
   * - Criar backup antes de deletar
   * 
   * Permissões:
   * - Apenas admin pode limpar logs
   * 
   * Códigos de resposta:
   * - 200: Logs limpos
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async cleanupLogs(diasRetencao: number = 90): Promise<{ deleted: number }> {
    return this.client.delete<{ deleted: number }>(`/logs/cleanup?diasRetencao=${diasRetencao}`);
  }

  // ==================== BACKUP ====================

  /**
   * TODO: BACKEND - Implementar endpoint de criar backup
   * 
   * Endpoint: POST /backup
   * Headers: { Authorization: Bearer <token> }
   * Response: { backup: BackupInfo }
   * 
   * Processamento:
   * - Criar dump do banco de dados
   * - Comprimir arquivo
   * - Armazenar em local seguro (S3, NFS, etc)
   * - Registrar informações do backup
   * - Executar em background (pode demorar)
   * 
   * Permissões:
   * - Apenas admin pode criar backup
   * 
   * Códigos de resposta:
   * - 202: Backup iniciado (async)
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async createBackup(): Promise<{ backup: BackupInfo }> {
    return this.client.post<{ backup: BackupInfo }>('/backup');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de listar backups
   * 
   * Endpoint: GET /backup
   * Headers: { Authorization: Bearer <token> }
   * Response: { backups: BackupInfo[] }
   * 
   * Retorna:
   * - Lista de todos os backups
   * - Ordenados por data (mais recentes primeiro)
   * - Informações de tamanho e status
   * 
   * Permissões:
   * - Apenas admin pode visualizar backups
   * 
   * Códigos de resposta:
   * - 200: Lista retornada
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async getBackups(): Promise<{ backups: BackupInfo[] }> {
    return this.client.get<{ backups: BackupInfo[] }>('/backup');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de restaurar backup
   * 
   * Endpoint: POST /backup/:id/restore
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Processamento:
   * - Verificar se backup existe
   * - Criar backup do estado atual antes de restaurar
   * - Restaurar banco de dados
   * - Reiniciar serviços se necessário
   * - Executar em background
   * 
   * Permissões:
   * - Apenas admin pode restaurar backup
   * 
   * ATENÇÃO: Operação crítica e irreversível
   * 
   * Códigos de resposta:
   * - 202: Restore iniciado (async)
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Backup não encontrado
   */
  async restoreBackup(backupId: string): Promise<{ message: string }> {
    return this.client.post<{ message: string }>(`/backup/${backupId}/restore`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de deletar backup
   * 
   * Endpoint: DELETE /backup/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Processamento:
   * - Deletar arquivo de backup
   * - Remover registro do banco
   * - Manter pelo menos 1 backup
   * 
   * Permissões:
   * - Apenas admin pode deletar backup
   * 
   * Códigos de resposta:
   * - 200: Backup deletado
   * - 400: Não pode deletar último backup
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Backup não encontrado
   */
  async deleteBackup(backupId: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/backup/${backupId}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de configurar backup automático
   * 
   * Endpoint: PUT /backup/config
   * Headers: { Authorization: Bearer <token> }
   * Body: BackupConfig
   * Response: { config: BackupConfig }
   * 
   * Processamento:
   * - Atualizar configurações de backup
   * - Agendar job cron se automático
   * - Validar horário
   * 
   * Permissões:
   * - Apenas admin pode configurar
   * 
   * Códigos de resposta:
   * - 200: Configuração atualizada
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async updateBackupConfig(data: BackupConfig): Promise<{ config: BackupConfig }> {
    return this.client.put<{ config: BackupConfig }>('/backup/config', data);
  }

  // ==================== MONITORAMENTO ====================

  /**
   * TODO: BACKEND - Implementar endpoint de health check
   * 
   * Endpoint: GET /health
   * Response: { status: 'healthy' | 'unhealthy', services: any }
   * 
   * Verifica:
   * - Conexão com banco de dados
   * - Espaço em disco
   * - Memória disponível
   * - Status de cada microserviço
   * 
   * Códigos de resposta:
   * - 200: Sistema saudável
   * - 503: Sistema com problemas
   */
  async healthCheck(): Promise<{ status: string; services: any }> {
    return this.client.get<{ status: string; services: any }>('/health', { requiresAuth: false });
  }
}

export const settingsService = new SettingsService();
