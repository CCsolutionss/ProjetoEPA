import { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserPlus, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface GerenciarPermissoesPageProps {
  onVoltar: () => void;
  onNovoUsuario: () => void;
  onEditarUsuario: (usuarioId: string) => void;
}

interface Usuario {
  id: string;
  nome: string;
  permissao: string;
}

export default function GerenciarPermissoesPage({
  onVoltar,
  onNovoUsuario,
  onEditarUsuario,
}: GerenciarPermissoesPageProps) {
  const { user } = useAuth();
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [usuarioParaApagar, setUsuarioParaApagar] = useState<Usuario | null>(null);
  const [apagando, setApagando] = useState(false);

  // Carregar usuários ao montar o componente
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      // TODO: backend - Buscar usuários do backend
      // Endpoint: GET /api/usuarios
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { usuarios: Usuario[] }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock de dados
      const mockUsuarios: Usuario[] = [
        { id: '1', nome: 'Juan Oliveira', permissao: 'Administrador' },
        { id: '2', nome: 'Empresa X', permissao: 'Parceiro' },
        { id: '3', nome: 'Lucas', permissao: 'Desenvolvedor' },
        { id: '4', nome: 'Matheus', permissao: 'Operador' },
        { id: '5', nome: 'Empresa Y', permissao: 'Usuário Padrão' },
        { id: '6', nome: 'Rodrigo', permissao: 'Desenvolvedor' },
        { id: '7', nome: 'Juan Oliveira', permissao: 'Operador' },
        { id: '8', nome: 'Juan Oliveira', permissao: 'Usuário Padrão' },
      ];

      setUsuarios(mockUsuarios);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Filtrar usuários com base na busca
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.permissao.toLowerCase().includes(busca.toLowerCase())
  );

  // Confirmar exclusão de usuário
  const handleApagarUsuario = async () => {
    if (!usuarioParaApagar) return;

    setApagando(true);
    try {
      // TODO: backend - Deletar usuário no backend
      // Endpoint: DELETE /api/usuarios/:id
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { success: boolean }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remover usuário da lista
      setUsuarios(usuarios.filter((u) => u.id !== usuarioParaApagar.id));

      toast.success('Usuário removido com sucesso!');
      setUsuarioParaApagar(null);
    } catch (error) {
      toast.error('Erro ao remover usuário. Tente novamente.');
      console.error('Erro ao remover usuário:', error);
    } finally {
      setApagando(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-[#EDFEE8]">
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
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Barra de Busca e Botão Novo Usuário */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar usuário"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 h-12 bg-white border-2 border-gray-300 focus:border-[#00920C] rounded-xl"
            />
          </div>
          <Button
            onClick={onNovoUsuario}
            className="bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black px-6 h-12 rounded-xl w-full sm:w-auto"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Novo usuário
          </Button>
        </div>

        {/* Card de Listagem de Usuários */}
        <div className="bg-white border-2 border-black shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl text-gray-900">Usuários Cadastrados</h2>
          </div>

          {/* Lista de Usuários */}
          {carregando ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00920C]"></div>
              <p className="text-gray-500 mt-4">Carregando usuários...</p>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {busca ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {usuariosFiltrados.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer group"
                  onClick={() => onEditarUsuario(usuario.id)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Ícone de usuário */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    
                    {/* Nome e Permissão */}
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{usuario.nome}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{usuario.permissao}</p>
                    </div>
                  </div>

                  {/* Botão Apagar */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUsuarioParaApagar(usuario);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Apagar</span>
                    <span className="sm:hidden">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!usuarioParaApagar} onOpenChange={() => setUsuarioParaApagar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o usuário <strong>{usuarioParaApagar?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={apagando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApagarUsuario}
              disabled={apagando}
              className="bg-red-600 hover:bg-red-700"
            >
              {apagando ? 'Removendo...' : 'Sim, remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
