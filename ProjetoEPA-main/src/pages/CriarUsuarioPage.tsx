import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner@2.0.3';

interface CriarUsuarioPageProps {
  onVoltar: () => void;
}

interface Base {
  id: string;
  nome: string;
}

export default function CriarUsuarioPage({ onVoltar }: CriarUsuarioPageProps) {
  const { user } = useAuth();
  const [criando, setCriando] = useState(false);
  const [carregandoBases, setCarregandoBases] = useState(false);
  const [bases, setBases] = useState<Base[]>([]);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [tipoPermissao, setTipoPermissao] = useState('');
  const [baseVisivel, setBaseVisivel] = useState('');
  const [codigoGerado, setCodigoGerado] = useState('');

  // Tipos de permissão disponíveis
  const tiposPermissao = [
    'Administrador',
    'Operador',
    'Parceiro',
    'Usuário Padrão',
    'Desenvolvedor',
  ];

  // Gerar código aleatório ao montar o componente
  useEffect(() => {
    gerarCodigoAleatorio();
    carregarBases();
  }, []);

  // Gerar código aleatório de 8 caracteres
  const gerarCodigoAleatorio = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setCodigoGerado(codigo);
  };

  // Carregar bases disponíveis
  const carregarBases = async () => {
    setCarregandoBases(true);
    try {
      // TODO: backend - Buscar bases do backend
      // Endpoint: GET /api/bases
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { bases: Base[] }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock de dados
      const mockBases: Base[] = [
        { id: 'BASE-001', nome: 'PepsiCo Guarulhos' },
        { id: 'BASE-002', nome: 'Sorocaba - PepsiCo' },
        { id: 'BASE-003', nome: 'SENAC ETAS' },
        { id: 'BASE-004', nome: 'Amsted' },
        { id: 'BASE-005', nome: 'Acailandia area A' },
        { id: 'BASE-006', nome: 'Acailandia area B' },
      ];

      setBases(mockBases);
    } catch (error) {
      toast.error('Erro ao carregar bases');
      console.error('Erro ao carregar bases:', error);
    } finally {
      setCarregandoBases(false);
    }
  };

  // Copiar código para área de transferência
  const handleCopiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoGerado);
      toast.success('Código copiado!');
    } catch (error) {
      toast.error('Erro ao copiar código');
      console.error('Erro ao copiar código:', error);
    }
  };

  // Criar usuário
  const handleCriarUsuario = async () => {
    // Validações
    if (!nome.trim()) {
      toast.error('Preencha o nome do usuário!');
      return;
    }

    if (!matricula.trim()) {
      toast.error('Preencha a matrícula!');
      return;
    }

    if (!tipoPermissao) {
      toast.error('Selecione o tipo de permissão!');
      return;
    }

    if (!baseVisivel) {
      toast.error('Selecione a base visível!');
      return;
    }

    setCriando(true);

    try {
      // TODO: backend - Criar usuário no backend
      // Endpoint: POST /api/usuarios
      // Headers: { Authorization: `Bearer ${token}` }
      // Body: {
      //   nome: string,
      //   matricula: string,
      //   tipoPermissao: string,
      //   baseVisivel: string,
      //   codigoTemporario: string
      // }
      // Response: {
      //   id: string,
      //   nome: string,
      //   matricula: string,
      //   tipoPermissao: string,
      //   baseVisivel: string,
      //   codigoTemporario: string
      // }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Usuário criado com sucesso!');
      
      // Limpar campos
      setNome('');
      setMatricula('');
      setTipoPermissao('');
      setBaseVisivel('');
      
      // Gerar novo código
      gerarCodigoAleatorio();
    } catch (error) {
      toast.error('Erro ao criar usuário. Tente novamente.');
      console.error('Erro ao criar usuário:', error);
    } finally {
      setCriando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDFEE8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00920C] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">EPA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-gray-900">Grupo EPA</h1>
                <p className="text-xs text-gray-500">Portal de Medições</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-gray-900">{user?.nomeCompleto}</p>
              <p className="text-xs text-gray-500">{user?.cargo}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Botão Voltar */}
        <div className="mb-6 sm:mb-8">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Título */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Criar novo usuário
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Preencha os dados abaixo para cadastrar um novo usuário no sistema
          </p>
        </div>

        {/* Card de Formulário */}
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl bg-white border-2 border-black shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10">
            <div className="space-y-8">
              {/* Nome e Matrícula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="nome" className="text-gray-900 font-medium">
                    Nome do usuário
                  </Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome completo"
                    className="bg-white border-2 border-gray-300 h-12 text-base focus:border-[#00920C]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="matricula" className="text-gray-900 font-medium">
                    Matrícula
                  </Label>
                  <Input
                    id="matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Digite a matrícula"
                    className="bg-white border-2 border-gray-300 h-12 text-base focus:border-[#00920C]"
                  />
                </div>
              </div>

              {/* Tipo de Permissão */}
              <div className="space-y-3">
                <Label htmlFor="tipo-permissao" className="text-gray-900 font-medium">
                  Tipo de permissão
                </Label>
                <Select value={tipoPermissao} onValueChange={setTipoPermissao}>
                  <SelectTrigger
                    id="tipo-permissao"
                    className="bg-white border-2 border-gray-300 h-12 text-base focus:border-[#00920C]"
                  >
                    <SelectValue placeholder="Selecione o tipo de permissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposPermissao.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Base Visível */}
              <div className="space-y-3">
                <Label htmlFor="base-visivel" className="text-gray-900 font-medium">
                  Base visível
                </Label>
                <Select
                  value={baseVisivel}
                  onValueChange={setBaseVisivel}
                  disabled={carregandoBases}
                >
                  <SelectTrigger
                    id="base-visivel"
                    className="bg-white border-2 border-gray-300 h-12 text-base focus:border-[#00920C]"
                  >
                    <SelectValue
                      placeholder={
                        carregandoBases
                          ? 'Carregando bases...'
                          : 'Selecione a base visível'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map((base) => (
                      <SelectItem key={base.id} value={base.id}>
                        {base.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Código Gerado Automaticamente */}
              <div className="bg-[#EDFEE8] border-2 border-[#00920C] rounded-xl p-4 sm:p-6 mt-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#00920C] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">
                      Código de acesso gerado automaticamente
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1">
                      <code className="text-lg sm:text-xl font-mono font-bold text-gray-900 bg-white px-4 sm:px-5 py-3 rounded-lg border-2 border-gray-300 block text-center tracking-wider">
                        {codigoGerado}
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleCopiarCodigo}
                      className="bg-white hover:bg-gray-50 border-2 border-gray-300 h-12 px-5 w-full sm:w-auto"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar código
                    </Button>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-white/50 rounded-lg p-3">
                    <svg
                      className="w-5 h-5 text-[#00920C] flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-700">
                      O usuário deverá usar este código temporário no primeiro login. Após o acesso inicial, será solicitada a criação de uma nova senha.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Criar Usuário */}
              <div className="flex justify-stretch sm:justify-end pt-6 border-t-2 border-gray-100">
                <Button
                  onClick={handleCriarUsuario}
                  disabled={criando}
                  className="w-full sm:w-auto bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black px-6 sm:px-10 py-5 sm:py-6 rounded-xl text-sm sm:text-base transition-all"
                >
                  {criando ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Criando usuário...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Criar usuário
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
