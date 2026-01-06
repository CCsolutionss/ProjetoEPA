import { useState } from 'react';
import { apiService } from '../services/api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import epaLogo from '../assets/epa-logo.png';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
}

export default function RegisterPage({ onNavigateToLogin }: RegisterPageProps) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [matricula, setMatricula] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!nomeCompleto || !matricula || !codigoAcesso || !senha || !confirmarSenha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (!acceptTerms) {
      toast.error('Você precisa aceitar os termos de uso');
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // TODO: backend - AuthService.signUp()
      // Endpoint: POST /api/auth/register
      // Body: { nomeCompleto, matricula, codigoAcesso, senha }
      // Response: { message: string }
      await apiService.register({ nomeCompleto, matricula, codigoAcesso, senha });
      
      toast.success('Cadastro realizado com sucesso!');
      
      // Aguardar um pouco e redirecionar para login
      setTimeout(() => {
        onNavigateToLogin();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar cadastro';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: backend - Link para termos de uso
    toast.info('Termos de uso - Em desenvolvimento');
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: backend - Link para política de privacidade
    toast.info('Política de privacidade - Em desenvolvimento');
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

        {/* Cadastro Card */}
        <Card className="border-2 border-[#000000] rounded-3xl bg-white shadow-none overflow-hidden">
          {/* Header com fundo verde claro 20% opacidade */}
          <div 
            className="px-6 py-4 flex items-center gap-2 border-b-2 border-[#000000]"
            style={{ backgroundColor: 'rgba(237, 254, 232, 0.2)' }}
          >
            <ArrowRight className="w-5 h-5 text-[#000000]" />
            <span className="text-[#000000]">Cadastro</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
            {/* Nome Completo */}
            <div className="space-y-2">
              <label htmlFor="nomeCompleto" className="block text-sm text-[#000000]">
                Nome Completo
              </label>
              <Input
                id="nomeCompleto"
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                placeholder="Nome Completo"
                disabled={loading}
              />
            </div>

            {/* Matrícula */}
            <div className="space-y-2">
              <label htmlFor="matricula" className="block text-sm text-[#000000]">
                Matrícula
              </label>
              <Input
                id="matricula"
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                placeholder="Número de matrícula"
                disabled={loading}
              />
            </div>

            {/* Código de Acesso */}
            <div className="space-y-2">
              <label htmlFor="codigoAcesso" className="block text-sm text-[#000000]">
                Código de acesso
              </label>
              <Input
                id="codigoAcesso"
                type="password"
                value={codigoAcesso}
                onChange={(e) => setCodigoAcesso(e.target.value)}
                className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Crie uma senha */}
            <div className="space-y-2">
              <label htmlFor="senha" className="block text-sm text-[#000000]">
                Crie uma senha
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

            {/* Confirmar senha */}
            <div className="space-y-2">
              <label htmlFor="confirmarSenha" className="block text-sm text-[#000000]">
                Confirmar senha
              </label>
              <Input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full border-2 border-[#000000] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#00920C] placeholder:opacity-40"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Aceitar termos */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-1 border-[#000000] data-[state=checked]:bg-[#00920C] data-[state=checked]:border-[#00920C]"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-[#000000] cursor-pointer select-none"
              >
                Aceito os{' '}
                <button
                  type="button"
                  onClick={handleTermsClick}
                  className="text-[#00920C] hover:underline"
                >
                  termos de uso
                </button>
                {' '}e{' '}
                <button
                  type="button"
                  onClick={handlePrivacyClick}
                  className="text-[#00920C] hover:underline"
                >
                  política de privacidade
                </button>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full bg-[#00DC30] hover:bg-[#00920C] text-[#000000] hover:text-white border-2 border-[#000000] rounded-lg py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-[#000000]">Já possui conta? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-[#00920C] hover:underline"
              >
                Fazer Login
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
