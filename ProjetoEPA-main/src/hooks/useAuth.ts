import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { LoginRequest, User } from '../types/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // TODO: API - Verificar se usuário está autenticado ao montar o componente
  // Endpoint: GET /api/auth/me
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { user: User }
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // const userData = await apiService.getCurrentUser();
          // setUser(userData);
          // setIsAuthenticated(true);
          
          // Mock data for development
          setUser({
            id: '1',
            nomeCompleto: 'Rodrigo Rameh',
            matricula: '12345',
            cargo: 'Administrador'
          });
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // TODO: API - Fazer logout no backend
    // Endpoint: POST /api/auth/logout
    // Headers: { Authorization: `Bearer ${token}` }
    await apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };
}
