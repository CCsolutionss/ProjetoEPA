import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import epaLogo from '../assets/epa-logo.png';

interface EsqueceuSenhaPageProps {
  onNavigateToLogin: () => void;
}

export default function EsqueceuSenhaPage({ onNavigateToLogin }: EsqueceuSenhaPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor, preencha seu e-mail');
      return;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, insira um e-mail válido');
      return;
    }

    setLoading(true);

    try {
      // TODO: backend - PasswordResetService.requestReset()
      // Endpoint: POST /api/auth/forgot-password
      // Body: { email }
      // Response: { message: 'E-mail de recuperação enviado com sucesso' }
      
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailEnviado(true);
      toast.success('E-mail de recuperação enviado com sucesso!');
      
      // Em produção, descomentar:
      // const response = await apiService.forgotPassword({ email });
      // setEmailEnviado(true);
      // toast.success(response.message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar e-mail de recuperação';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    onNavigateToLogin();
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

        {/* Card de Recuperação de Senha */}
        <Card className="border-2 border-[#000000] rounded-3xl bg-white shadow-none overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b-2 border-[#000000] px-6 py-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-[#000000]" />
            <span className="text-[#000000]">Recuperar Senha</span>
          </div>

          {/* Form */}
          {!emailEnviado ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
              <div className="space-y-2">
                <p className="text-sm text-[#000000] opacity-80">
                  Digite seu e-mail cadastrado para receber as instruções de recuperação de senha.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-[#000000]">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                  placeholder="seu.email@exemplo.com"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00DC30] hover:bg-[#00920C] text-[#000000] hover:text-white border-2 border-[#000000] rounded-lg py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
              </Button>

              {/* Link para voltar ao login */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleVoltar}
                  className="w-full flex items-center justify-center gap-2 text-center text-sm text-[#00920C] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o Login
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6 bg-white">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto bg-[#EDFEE8] rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-[#00920C]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[#000000]">E-mail Enviado!</h3>
                  <p className="text-sm text-[#000000] opacity-80">
                    Enviamos as instruções de recuperação de senha para <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-[#000000] opacity-80">
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleVoltar}
                  className="w-full bg-[#00DC30] hover:bg-[#00920C] text-[#000000] hover:text-white border-2 border-[#000000] rounded-lg py-3 transition-colors"
                >
                  Voltar para o Login
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailEnviado(false);
                    setEmail('');
                  }}
                  className="w-full text-center text-sm text-[#00920C] hover:underline"
                >
                  Não recebeu o e-mail? Enviar novamente
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Informação adicional */}
        {!emailEnviado && (
          <div className="text-center">
            <p className="text-sm text-[#000000] opacity-70">
              Se você não possui acesso ao e-mail cadastrado, entre em contato com o administrador do sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
