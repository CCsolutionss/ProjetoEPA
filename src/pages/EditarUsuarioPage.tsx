import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
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

interface EditarUsuarioPageProps {
  onVoltar: () => void;
  usuarioId: string;
}

interface Base {
  id: string;
  nome: string;
}

interface UsuarioDetalhes {
  id: string;
  nome: string;
  matricula: string;
  tipoPermissao: string;
  baseVisivel: string;
}

export default function EditarUsuarioPage({ onVoltar, usuarioId }: EditarUsuarioPageProps) {
  const { user } = useAuth();
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [carregandoBases, setCarregandoBases] = useState(false);
  const [bases, setBases] = useState<Base[]>([]);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [tipoPermissao, setTipoPermissao] = useState('');
  const [baseVisivel, setBaseVisivel] = useState('');

  // Tipos de permissão disponíveis
  const tiposPermissao = [
    'Administrador',
    'Operador',
    'Parceiro',
    'Usuário Padrão',
    'Desenvolvedor',
  ];

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    carregarUsuario();
    carregarBases();
  }, [usuarioId]);

  // Carregar dados do usuário
  const carregarUsuario = async () => {
    setCarregando(true);
    try {
      // TODO: backend - Buscar dados do usuário no backend
      // Endpoint: GET /api/usuarios/:id
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { usuario: UsuarioDetalhes }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock de dados
      const mockUsuario: UsuarioDetalhes = {
        id: usuarioId,
        nome: 'Juan Oliveira',
        matricula: 'MAT-12345',
        tipoPermissao: 'Administrador',
        baseVisivel: 'BASE-001',
      };

      setNome(mockUsuario.nome);
      setMatricula(mockUsuario.matricula);
      setTipoPermissao(mockUsuario.tipoPermissao);
      setBaseVisivel(mockUsuario.baseVisivel);
    } catch (error) {
      toast.error('Erro ao carregar dados do usuário');
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setCarregando(false);
    }
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

  // Salvar alterações do usuário
  const handleSalvarUsuario = async () => {
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

    setSalvando(true);

    try {
      // TODO: backend - Atualizar usuário no backend
      // Endpoint: PUT /api/usuarios/:id
      // Headers: { Authorization: `Bearer ${token}` }
      // Body: {
      //   nome: string,
      //   matricula: string,
      //   tipoPermissao: string,
      //   baseVisivel: string
      // }
      // Response: {
      //   id: string,
      //   nome: string,
      //   matricula: string,
      //   tipoPermissao: string,
      //   baseVisivel: string
      // }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Usuário atualizado com sucesso!');
      
      // Voltar para a página anterior após salvar
      setTimeout(() => {
        onVoltar();
      }, 1000);
    } catch (error) {
      toast.error('Erro ao atualizar usuário. Tente novamente.');
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDFEE8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[#00920C] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">EPA</span>
              </div>
              <div>
                <h1 className="text-gray-900">Grupo EPA</h1>
                <p className="text-xs text-gray-500">Portal de Medições</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="text-right">
              <p className="text-gray-900">{user?.nomeCompleto}</p>
              <p className="text-xs text-gray-500">{user?.cargo}</p>
            </div>
            <Button variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Botão Voltar */}
        <div className="mb-8">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Editar usuário
          </h1>
          <p className="text-gray-600">
            Altere os dados do usuário conforme necessário
          </p>
        </div>

        {/* Card de Formulário */}
        <div className="flex justify-center">
          {carregando ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00920C]"></div>
              <p className="text-gray-500 mt-4">Carregando dados do usuário...</p>
            </div>
          ) : (
            <Card className="w-full max-w-3xl bg-white border-2 border-black shadow-xl rounded-3xl p-10">
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

                {/* Informação sobre senha */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                    <div>
                      <p className="text-sm text-blue-900 font-medium mb-1">
                        Redefinição de senha
                      </p>
                      <p className="text-sm text-blue-800">
                        Para alterar a senha do usuário, utilize a funcionalidade de "Redefinir senha" disponível no menu de ações.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
                  <Button
                    variant="outline"
                    onClick={onVoltar}
                    disabled={salvando}
                    className="px-8 py-6 rounded-xl text-base"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSalvarUsuario}
                    disabled={salvando}
                    className="bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black px-10 py-6 rounded-xl text-base transition-all"
                  >
                    {salvando ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Salvando alterações...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
