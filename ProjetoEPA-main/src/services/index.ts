/**
 * Exportações centralizadas de todos os serviços
 * 
 * Uso:
 * import { authService, userService } from './services';
 */

export * from './config';
export * from './http-client';
export * from './auth.service';
export * from './user.service';
export * from './medicao.service';
export * from './notification.service';
export * from './settings.service';

// Exportações nomeadas para facilitar importação
export { authService } from './auth.service';
export { userService } from './user.service';
export { medicaoService } from './medicao.service';
export { notificationService } from './notification.service';
export { settingsService } from './settings.service';
