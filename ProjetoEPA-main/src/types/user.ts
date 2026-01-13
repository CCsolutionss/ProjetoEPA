export interface User {
  id: string;
  nomeCompleto: string;
  matricula: string;
  cargo: string;
  role: 'admin' | 'user' | 'viewer';
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPermission {
  id: string;
  userId: string;
  resource: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
