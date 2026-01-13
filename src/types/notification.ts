export interface Notification {
  id: string;
  userId: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  lida: boolean;
  link?: string;
  criadoEm: string;
  lidaEm?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UnreadNotificationsResponse {
  count: number;
  notifications: Notification[];
}
