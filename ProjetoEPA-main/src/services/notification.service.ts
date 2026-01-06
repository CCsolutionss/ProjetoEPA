/**
 * Serviço de Notificações
 * 
 * TODO: BACKEND - Microserviço de Notificações (notification-service)
 * Porta: 3004
 * Base URL: /api
 * 
 * Responsabilidades:
 * - Gestão de notificações in-app
 * - Envio de emails
 * - WebSocket para notificações em tempo real
 * 
 * Tecnologias sugeridas:
 * - Socket.io para WebSocket
 * - Nodemailer ou SendGrid para emails
 * - Bull/BullMQ para fila de emails
 */

import { HttpClient } from './http-client';
import { SERVICE_URLS } from './config';
import { Notification } from '../types/notification';

// ==================== REQUEST/RESPONSE TYPES ====================

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  lida?: boolean;
  tipo?: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface CreateNotificationRequest {
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  userId?: string; // Se não informado, notifica todos os usuários
  link?: string;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
}

// ==================== SERVICE CLASS ====================

class NotificationService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(SERVICE_URLS.NOTIFICATION);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de listagem de notificações
   * 
   * Endpoint: GET /notifications
   * Headers: { Authorization: Bearer <token> }
   * Query: ?page=1&limit=10&lida=false&tipo=xxx
   * Response: GetNotificationsResponse
   * 
   * Funcionalidades:
   * - Paginação (padrão: 20 por página)
   * - Filtro por status (lida/não lida)
   * - Filtro por tipo
   * - Ordenação por data (mais recentes primeiro)
   * 
   * Retorna:
   * - Lista de notificações do usuário
   * - Contagem de não lidas
   * 
   * Códigos de resposta:
   * - 200: Lista retornada
   * - 401: Não autenticado
   */
  async getNotifications(params?: GetNotificationsParams): Promise<GetNotificationsResponse> {
    const queryString = this.client.buildQueryString(params);
    return this.client.get<GetNotificationsResponse>(`/notifications${queryString}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de contagem de não lidas
   * 
   * Endpoint: GET /notifications/unread-count
   * Headers: { Authorization: Bearer <token> }
   * Response: { count: number }
   * 
   * Performance:
   * - Cache de 1 minuto
   * - Atualizar via WebSocket quando nova notificação
   * 
   * Códigos de resposta:
   * - 200: Contagem retornada
   * - 401: Não autenticado
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return this.client.get<{ count: number }>('/notifications/unread-count');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de buscar notificações não lidas
   * 
   * Endpoint: GET /notifications/unread
   * Headers: { Authorization: Bearer <token> }
   * Response: { notifications: Notification[] }
   * 
   * Retorna:
   * - Últimas 50 notificações não lidas
   * - Ordenadas por data (mais recentes primeiro)
   * 
   * Códigos de resposta:
   * - 200: Lista retornada
   * - 401: Não autenticado
   */
  async getUnreadNotifications(): Promise<{ notifications: Notification[] }> {
    return this.client.get<{ notifications: Notification[] }>('/notifications/unread');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de marcar como lida
   * 
   * Endpoint: PUT /notifications/:id/read
   * Headers: { Authorization: Bearer <token> }
   * Response: { notification: Notification }
   * 
   * Processamento:
   * - Atualizar flag 'lida'
   * - Registrar data/hora da leitura
   * - Emitir evento via WebSocket
   * 
   * Códigos de resposta:
   * - 200: Notificação marcada como lida
   * - 401: Não autenticado
   * - 404: Notificação não encontrada
   */
  async markAsRead(id: string): Promise<{ notification: Notification }> {
    return this.client.put<{ notification: Notification }>(`/notifications/${id}/read`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de marcar múltiplas como lidas
   * 
   * Endpoint: PUT /notifications/mark-as-read
   * Headers: { Authorization: Bearer <token> }
   * Body: { notificationIds: string[] }
   * Response: { count: number }
   * 
   * Processamento:
   * - Atualizar múltiplas notificações
   * - Retornar quantidade atualizada
   * - Emitir evento via WebSocket
   * 
   * Códigos de resposta:
   * - 200: Notificações marcadas
   * - 400: IDs inválidos
   * - 401: Não autenticado
   */
  async markMultipleAsRead(data: MarkAsReadRequest): Promise<{ count: number }> {
    return this.client.put<{ count: number }>('/notifications/mark-as-read', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de marcar todas como lidas
   * 
   * Endpoint: PUT /notifications/mark-all-read
   * Headers: { Authorization: Bearer <token> }
   * Response: { count: number }
   * 
   * Processamento:
   * - Marcar todas as notificações do usuário como lidas
   * - Retornar quantidade atualizada
   * - Emitir evento via WebSocket
   * 
   * Códigos de resposta:
   * - 200: Todas marcadas como lidas
   * - 401: Não autenticado
   */
  async markAllAsRead(): Promise<{ count: number }> {
    return this.client.put<{ count: number }>('/notifications/mark-all-read');
  }

  /**
   * TODO: BACKEND - Implementar endpoint de deletar notificação
   * 
   * Endpoint: DELETE /notifications/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Regras:
   * - Usuário pode deletar apenas próprias notificações
   * 
   * Códigos de resposta:
   * - 200: Notificação deletada
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Notificação não encontrada
   */
  async deleteNotification(id: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/notifications/${id}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de criar notificação
   * 
   * Endpoint: POST /notifications
   * Headers: { Authorization: Bearer <token> }
   * Body: CreateNotificationRequest
   * Response: { notification: Notification | Notification[] }
   * 
   * Funcionalidades:
   * - Criar para usuário específico
   * - Criar para todos os usuários (broadcast)
   * - Criar para grupo de usuários (por role)
   * - Enviar via WebSocket para usuários online
   * 
   * Permissões:
   * - Apenas admin pode criar notificações
   * 
   * Processamento:
   * - Validar dados
   * - Criar notificação(ões) no banco
   * - Emitir via WebSocket
   * - Opcional: enviar email se configurado
   * 
   * Códigos de resposta:
   * - 201: Notificação criada
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   */
  async createNotification(data: CreateNotificationRequest): Promise<{ notification: Notification }> {
    return this.client.post<{ notification: Notification }>('/notifications', data);
  }

  /**
   * TODO: BACKEND - Implementar WebSocket para notificações em tempo real
   * 
   * WebSocket URL: ws://localhost:3004
   * 
   * Eventos:
   * - 'connect': Cliente conecta
   * - 'authenticate': Cliente envia token JWT
   * - 'new_notification': Servidor envia nova notificação
   * - 'notification_read': Servidor confirma leitura
   * - 'disconnect': Cliente desconecta
   * 
   * Implementação:
   * - Usar Socket.io
   * - Autenticar conexão via JWT
   * - Manter mapa de userId -> socketId
   * - Emitir eventos apenas para usuários específicos
   * - Reconectar automaticamente em caso de queda
   * 
   * Exemplo de uso no cliente:
   * ```typescript
   * const socket = io(SERVICE_URLS.NOTIFICATION);
   * socket.emit('authenticate', { token: authToken });
   * socket.on('new_notification', (notification) => {
   *   // Exibir notificação
   * });
   * ```
   */
  connectWebSocket(token: string, onNewNotification: (notification: Notification) => void): void {
    // TODO: Implementar conexão WebSocket quando backend estiver pronto
    console.log('WebSocket notifications will be implemented with backend');
  }
}

export const notificationService = new NotificationService();
