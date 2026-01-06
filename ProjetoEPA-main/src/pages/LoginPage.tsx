import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Context & Services
import { useAuth } from '../context/AuthContext';

// Components
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

// Constants
import { NETWORK_DELAYS } from '../constants/api.constants';

// Assets
import epaLogo from '../assets/epa-logo.png';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

/**
 * LoginPage Component
 * 
 * Handles user authentication with employee ID (matricula) and password.
 * Supports "Remember Me" functionality using localStorage/sessionStorage.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLoginSuccess - Callback executed on successful login
 * @param {Function} props.onNavigateToRegister - Navigate to registration page
 * @param {Function} props.onNavigateToForgotPassword - Navigate to password recovery
 */
export default function LoginPage({ 
  onNavigateToRegister, 
  onNavigateToForgotPassword, 
  onLoginSuccess 
}: LoginPageProps) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!matricula || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      /**
       * TODO: [Backend Integration Required]
       * 
       * Replace mock authentication with real API call
       * 
       * Endpoint: POST /api/auth/login
       * Auth: None (public endpoint)
       * 
       * Request:
       * {
       *   matricula: string,
       *   senha: string
       * }
       * 
       * Response (200):
       * {
       *   user: {
       *     id: string,
       *     nomeCompleto: string,
       *     matricula: string,
       *     cargo: string,
       *     role: 'admin' | 'operador' | 'visualizador',
       *     email: string
       *   },
       *   token: string (JWT)
       * }
       * 
       * Errors:
       * - 400: Invalid credentials
       * - 401: Unauthorized
       * - 500: Server error
       * 
       * Implementation:
       * const response = await apiService.login({ matricula, senha });
       * login(response.user, response.token, rememberMe);
       */
      
      // MOCK DATA - Remove when backend is integrated
      const mockResponse = {
        user: {
          id: `mock-user-${Date.now()}`,
          nomeCompleto: 'Usuário EPA',
          matricula,
          cargo: 'Administrador',
          role: 'admin' as const,
          email: 'usuario@epa.com.br',
        },
        token: `mock-token-${Date.now()}`,
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, NETWORK_DELAYS.MEDIUM));
      
      // Save authentication state
      login(mockResponse.user, mockResponse.token, rememberMe);
      
      toast.success('Login realizado com sucesso!');
      onLoginSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      toast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onNavigateToForgotPassword();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDFEE8] p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={epaLogo}
            alt="Grupo EPA Logo"
            className="h-20 w-auto"
          />
        </div>

        {/* Login Card */}
        <Card className="border-2 border-[#000000] rounded-3xl bg-white shadow-none overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b-2 border-[#000000] px-6 py-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-[#000000]" />
            <span className="text-[#000000]">Login</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
            <div className="space-y-2">
              <label htmlFor="matricula" className="block text-sm text-[#000000]">
                Número de matrícula
              </label>
              <Input
                id="matricula"
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                placeholder="Digite sua matrícula"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="senha" className="block text-sm text-[#000000]">
                Senha
              </label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Lembrar de mim */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#000000] data-[state=checked]:bg-[#00920C] data-[state=checked]:border-[#00920C]"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-[#000000] cursor-pointer select-none"
              >
                Lembrar de mim
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00DC30] hover:bg-[#00920C] text-[#000000] hover:text-white border-2 border-[#000000] rounded-lg py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Links inferiores */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-center text-sm text-[#00920C] hover:underline"
              >
                Esqueceu a senha?
              </button>
              
              <div className="text-center text-sm">
                <span className="text-[#000000]">Não possui conta? </span>
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="text-[#00920C] hover:underline"
                >
                  Cadastre-se
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
