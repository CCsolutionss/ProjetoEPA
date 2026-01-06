/**
 * Tipos relacionados à autenticação
 * 
 * NOTA: Os tipos principais de Request/Response estão em auth.service.ts
 * Este arquivo mantém apenas tipos auxiliares e re-exportações
 */

import { User } from './user';

// Re-exportar User para compatibilidade
export type { User };

// Tipos legados - manter por compatibilidade com código antigo
// TODO: Migrar código existente para usar os tipos do auth.service.ts
export interface LegacyLoginRequest {
  matricula: string;
  senha: string;
}

export interface LegacyRegisterRequest {
  nome: string;
  matricula: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}
