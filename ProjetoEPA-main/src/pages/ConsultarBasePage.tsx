import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { toast } from 'sonner@2.0.3';

interface ConsultarBasePageProps {
  onVoltar: () => void;
}

interface Base {
  id: string;
  nome: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function ConsultarBasePage({ onVoltar }: ConsultarBasePageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bases, setBases] = useState<Base[]>([]);
  
  // Estados para modal de exclusão
  const [baseParaApagar, setBaseParaApagar] = useState<Base | null>(null);
  const [apagando, setApagando] = useState(false);
  
  // Estados para modal de edição
  const [baseParaEditar, setBaseParaEditar] = useState<Base | null>(null);
  const [editando, setEditando] = useState(false);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  
  // Campos do formulário de edição
  const [editNome, setEditNome] = useState('');
  const [editCep, setEditCep] = useState('');
  const [editLogradouro, setEditLogradouro] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editBairro, setEditBairro] = useState('');
  const [editEstado, setEditEstado] = useState('');
  const [editNumero, setEditNumero] = useState('');

  // Carregar bases ao montar o componente
  useEffect(() => {
    carregarBases();
  }, []);

  // Carregar bases do backend
  const carregarBases = async () => {
    setLoading(true);
    try {
      // TODO: backend - Buscar bases do backend
      // Endpoint: GET /api/bases
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { bases: Base[] }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock de dados
      const mockBases: Base[] = [
        {
          id: 'BASE-001',
          nome: 'PepsiCo Guarulhos',
          endereco: {
            cep: '07030-010',
            logradouro: 'Av. Santos Dumont',
            numero: '7260',
            bairro: 'Bom Clima',
            cidade: 'Guarulhos',
            estado: 'SP',
          },
        },
        {
          id: 'BASE-002',
          nome: 'Sorocaba - PepsiCo',
          endereco: {
            cep: '18087-220',
            logradouro: 'Rodovia Raposo Tavares',
            numero: 'Km 96',
            bairro: 'Éden',
            cidade: 'Sorocaba',
            estado: 'SP',
          },
        },
        {
          id: 'BASE-003',
          nome: 'SENAC ETAS',
          endereco: {
            cep: '01310-100',
            logradouro: 'Av. Paulista',
            numero: '1000',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP',
          },
        },
        {
          id: 'BASE-004',
          nome: 'Amsted',
          endereco: {
            cep: '09550-051',
            logradouro: 'Av. Industrial',
            numero: '3500',
            bairro: 'Jardim',
            cidade: 'São Caetano do Sul',
            estado: 'SP',
          },
        },
        {
          id: 'BASE-005',
          nome: 'Acailandia area A',
          endereco: {
            cep: '65930-000',
            logradouro: 'Rua Principal',
            numero: '100',
            bairro: 'Centro',
            cidade: 'Açailândia',
            estado: 'MA',
          },
        },
        {
          id: 'BASE-006',
          nome: 'Acailandia area B',
          endereco: {
            cep: '65930-000',
            logradouro: 'Rua Secundária',
            numero: '200',
            bairro: 'Industrial',
            cidade: 'Açailândia',
            estado: 'MA',
          },
        },
      ];

      setBases(mockBases);
    } catch (error) {
      toast.error('Erro ao carregar bases. Tente novamente.');
      console.error('Erro ao carregar bases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de exclusão
  const handleApagarClick = (base: Base) => {
    setBaseParaApagar(base);
  };

  // Confirmar exclusão
  const handleConfirmarApagar = async () => {
    if (!baseParaApagar) return;

    setApagando(true);

    try {
      // TODO: backend - Apagar base no backend
      // Endpoint: DELETE /api/bases/:id
      // Headers: { Authorization: `Bearer ${token}` }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remover da lista local
      setBases(bases.filter((b) => b.id !== baseParaApagar.id));

      toast.success('Base apagada com sucesso!');
      setBaseParaApagar(null);
    } catch (error) {
      toast.error('Erro ao apagar base. Tente novamente.');
      console.error('Erro ao apagar base:', error);
    } finally {
      setApagando(false);
    }
  };

  // Abrir modal de edição
  const handleEditarClick = (base: Base) => {
    setBaseParaEditar(base);
    setEditNome(base.nome);
    setEditCep(base.endereco.cep);
    setEditLogradouro(base.endereco.logradouro);
    setEditCidade(base.endereco.cidade);
    setEditBairro(base.endereco.bairro);
    setEditEstado(base.endereco.estado);
    setEditNumero(base.endereco.numero);
  };

  // Formatar CEP enquanto digita
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    
    // Aplicar máscara: 00000-000
    if (valor.length > 5) {
      valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
    }
    
    setEditCep(valor);
  };

  // Buscar endereço por CEP usando ViaCEP
  const handleBuscarCEP = async () => {
    const cepLimpo = editCep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      toast.error('CEP inválido! Digite um CEP com 8 dígitos.');
      return;
    }

    setBuscandoCEP(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: EnderecoViaCEP = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado!');
        return;
      }

      setEditLogradouro(data.logradouro || '');
      setEditCidade(data.localidade || '');
      setEditBairro(data.bairro || '');
      setEditEstado(data.uf || '');
      
      toast.success('Endereço encontrado!');
    } catch (error) {
      toast.error('Erro ao buscar CEP. Tente novamente.');
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setBuscandoCEP(false);
    }
  };

  // Salvar edição
  const handleSalvarEdicao = async () => {
    if (!baseParaEditar) return;

    // Validações
    if (!editNome.trim()) {
      toast.error('Preencha o nome da base!');
      return;
    }

    if (!editCep.trim() || editCep.replace(/\D/g, '').length !== 8) {
      toast.error('CEP inválido!');
      return;
    }

    if (!editLogradouro.trim()) {
      toast.error('Preencha o logradouro!');
      return;
    }

    if (!editCidade.trim()) {
      toast.error('Preencha a cidade!');
      return;
    }

    if (!editBairro.trim()) {
      toast.error('Preencha o bairro!');
      return;
    }

    if (!editEstado.trim()) {
      toast.error('Preencha o estado!');
      return;
    }

    if (!editNumero.trim()) {
      toast.error('Preencha o número!');
      return;
    }

    setEditando(true);

    try {
      // TODO: backend - Atualizar base no backend
      // Endpoint: PUT /api/bases/:id
      // Headers: { Authorization: `Bearer ${token}` }
      // Body: {
      //   nome: string,
      //   endereco: {
      //     cep: string,
      //     logradouro: string,
      //     numero: string,
      //     bairro: string,
      //     cidade: string,
      //     estado: string
      //   }
      // }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Atualizar na lista local
      const baseAtualizada: Base = {
        ...baseParaEditar,
        nome: editNome,
        endereco: {
          cep: editCep,
          logradouro: editLogradouro,
          numero: editNumero,
          bairro: editBairro,
          cidade: editCidade,
          estado: editEstado,
        },
      };

      setBases(bases.map((b) => (b.id === baseParaEditar.id ? baseAtualizada : b)));

      toast.success('Base atualizada com sucesso!');
      setBaseParaEditar(null);
    } catch (error) {
      toast.error('Erro ao atualizar base. Tente novamente.');
      console.error('Erro ao atualizar base:', error);
    } finally {
      setEditando(false);
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
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button variant="outline" onClick={onVoltar} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Card de Lista */}
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl bg-white border-2 border-black shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Título com fundo verde */}
            <div className="bg-[#EDFEE8] border-b-2 border-black py-4 sm:py-6">
              <h2 className="text-center text-gray-900 font-bold text-lg sm:text-xl">Lista de Bases</h2>
            </div>

            {/* Lista de Bases */}
            <div className="p-4 sm:p-8">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00920C]" />
                </div>
              ) : bases.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Nenhuma base cadastrada
                </div>
              ) : (
                <div className="space-y-3">
                  {bases.map((base) => (
                    <div
                      key={base.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => handleEditarClick(base)}
                        className="flex-1 text-left text-gray-900 hover:text-[#00920C] transition-colors text-sm sm:text-base"
                      >
                        {base.nome}
                      </button>
                      
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditarClick(base)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApagarClick(base)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Apagar</span>
                          <span className="sm:hidden">Del</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={baseParaApagar !== null} onOpenChange={() => setBaseParaApagar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja apagar a base <strong>{baseParaApagar?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={apagando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarApagar}
              disabled={apagando}
              className="bg-red-600 hover:bg-red-700"
            >
              {apagando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Apagando...
                </>
              ) : (
                'Apagar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Edição */}
      <Dialog open={baseParaEditar !== null} onOpenChange={() => setBaseParaEditar(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Base</DialogTitle>
            <DialogDescription>
              Edite as informações da base cadastrada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* ID - Somente Leitura */}
            <div className="space-y-2">
              <Label htmlFor="edit-id" className="text-sm text-gray-700">Id</Label>
              <Input
                id="edit-id"
                value={baseParaEditar?.id || ''}
                readOnly
                disabled
                className="bg-gray-200 cursor-not-allowed border border-gray-400"
              />
            </div>

            {/* Nome da Base */}
            <div className="space-y-2">
              <Label htmlFor="edit-nome" className="text-sm text-gray-700">Nome da base</Label>
              <Input
                id="edit-nome"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                placeholder="Digite o nome da base"
                className="bg-white border border-gray-300"
              />
            </div>

            {/* CEP com Botão Buscar */}
            <div className="space-y-2">
              <Label htmlFor="edit-cep" className="text-sm text-gray-700">CEP</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-cep"
                  value={editCep}
                  onChange={handleCEPChange}
                  placeholder="00000-000"
                  maxLength={9}
                  className="bg-white flex-1 border border-gray-300"
                />
                <Button
                  onClick={handleBuscarCEP}
                  disabled={buscandoCEP || editCep.replace(/\D/g, '').length !== 8}
                  className="bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black px-3 sm:px-6 rounded-lg"
                  type="button"
                >
                  {buscandoCEP ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </div>
            </div>

            {/* Logradouro */}
            <div className="space-y-2">
              <Label htmlFor="edit-logradouro" className="text-sm text-gray-700">Logradouro</Label>
              <Input
                id="edit-logradouro"
                value={editLogradouro}
                onChange={(e) => setEditLogradouro(e.target.value)}
                placeholder="Rua, Avenida..."
                className="bg-white border border-gray-300"
              />
            </div>

            {/* Cidade e Bairro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cidade" className="text-sm text-gray-700">Cidade</Label>
                <Input
                  id="edit-cidade"
                  value={editCidade}
                  onChange={(e) => setEditCidade(e.target.value)}
                  placeholder="Cidade"
                  className="bg-white border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bairro" className="text-sm text-gray-700">Bairro</Label>
                <Input
                  id="edit-bairro"
                  value={editBairro}
                  onChange={(e) => setEditBairro(e.target.value)}
                  placeholder="Bairro"
                  className="bg-white border border-gray-300"
                />
              </div>
            </div>

            {/* Estado e Número */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-estado" className="text-sm text-gray-700">Estado (UF)</Label>
                <Input
                  id="edit-estado"
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value.toUpperCase())}
                  placeholder="SP"
                  maxLength={2}
                  className="bg-white border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numero" className="text-sm text-gray-700">Número</Label>
                <Input
                  id="edit-numero"
                  value={editNumero}
                  onChange={(e) => setEditNumero(e.target.value)}
                  placeholder="123"
                  className="bg-white border border-gray-300"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setBaseParaEditar(null)}
              disabled={editando}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvarEdicao}
              disabled={editando}
              className="w-full sm:w-auto bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black"
            >
              {editando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
