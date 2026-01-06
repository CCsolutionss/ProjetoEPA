import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner@2.0.3';

interface CadastrarBasePageProps {
  onVoltar: () => void;
}

interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function CadastrarBasePage({ onVoltar }: CadastrarBasePageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [buscandoCEP, setBuscandoCEP] = useState(false);

  // Campos do formulário
  const [id, setId] = useState('');
  const [nomeBase, setNomeBase] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');

  // Gerar ID automaticamente ao carregar
  useEffect(() => {
    // TODO: backend - Buscar próximo ID disponível
    // Endpoint: GET /api/bases/next-id
    // Por enquanto, gerar ID fake
    const gerarId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `BASE-${timestamp}-${random}`;
    };
    setId(gerarId());
  }, []);

  // Buscar endereço por CEP usando ViaCEP
  const handleBuscarCEP = async () => {
    // Limpar CEP (remover traços e espaços)
    const cepLimpo = cep.replace(/\D/g, '');

    // Validar CEP
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

      // Preencher campos automaticamente
      setLogradouro(data.logradouro || '');
      setCidade(data.localidade || '');
      setBairro(data.bairro || '');
      setEstado(data.uf || '');
      
      toast.success('Endereço encontrado!');
    } catch (error) {
      toast.error('Erro ao buscar CEP. Tente novamente.');
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setBuscandoCEP(false);
    }
  };

  // Formatar CEP enquanto digita
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    
    // Aplicar máscara: 00000-000
    if (valor.length > 5) {
      valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
    }
    
    setCep(valor);
  };

  // Validar e criar base
  const handleCriarBase = async () => {
    // Validações
    if (!nomeBase.trim()) {
      toast.error('Preencha o nome da base!');
      return;
    }

    if (!cep.trim()) {
      toast.error('Preencha o CEP!');
      return;
    }

    if (!logradouro.trim()) {
      toast.error('Preencha o logradouro!');
      return;
    }

    if (!cidade.trim()) {
      toast.error('Preencha a cidade!');
      return;
    }

    if (!bairro.trim()) {
      toast.error('Preencha o bairro!');
      return;
    }

    if (!estado.trim()) {
      toast.error('Preencha o estado!');
      return;
    }

    if (!numero.trim()) {
      toast.error('Preencha o número!');
      return;
    }

    setLoading(true);

    try {
      // TODO: backend - Criar base no backend
      // Endpoint: POST /api/bases
      // Headers: { Authorization: `Bearer ${token}` }
      // Body: {
      //   id: string,
      //   nomeBase: string,
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Base criada com sucesso!');
      
      // Limpar formulário
      setNomeBase('');
      setCep('');
      setLogradouro('');
      setCidade('');
      setBairro('');
      setEstado('');
      setNumero('');
      
      // Gerar novo ID
      const gerarId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `BASE-${timestamp}-${random}`;
      };
      setId(gerarId());

      // Opcional: voltar para home após sucesso
      // setTimeout(() => onVoltar(), 2000);
    } catch (error) {
      toast.error('Erro ao criar base. Tente novamente.');
      console.error('Erro ao criar base:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDFEE8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
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
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button variant="outline" onClick={onVoltar} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Card de Cadastro */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-white border-2 border-black shadow-xl rounded-2xl sm:rounded-3xl">
            <div className="p-6 sm:p-10">
              {/* Título */}
              <h2 className="text-center text-gray-900 text-lg sm:text-xl mb-6 pb-4 border-b-2 border-black">Adicionar Base</h2>

              {/* Formulário */}
              <div className="space-y-4">
                {/* ID - Somente Leitura */}
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-sm text-gray-700">Id</Label>
                  <Input
                    id="id"
                    value={id}
                    readOnly
                    disabled
                    className="bg-gray-200 cursor-not-allowed border border-gray-400"
                  />
                </div>

                {/* Nome da Base */}
                <div className="space-y-2">
                  <Label htmlFor="nome-base" className="text-sm text-gray-700">Nome da base</Label>
                  <Input
                    id="nome-base"
                    value={nomeBase}
                    onChange={(e) => setNomeBase(e.target.value)}
                    placeholder="Digite o nome da base"
                    className="bg-white border border-gray-300"
                  />
                </div>

                {/* CEP com Botão Buscar */}
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-sm text-gray-700">CEP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cep"
                      value={cep}
                      onChange={handleCEPChange}
                      placeholder="00000-000"
                      maxLength={9}
                      className="bg-white flex-1 border border-gray-300"
                    />
                    <Button
                      onClick={handleBuscarCEP}
                      disabled={buscandoCEP || cep.replace(/\D/g, '').length !== 8}
                      className="bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black px-3 sm:px-6 rounded-lg"
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
                  <Label htmlFor="logradouro" className="text-sm text-gray-700">Logradouro</Label>
                  <Input
                    id="logradouro"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    placeholder="Rua, Avenida..."
                    className="bg-white border border-gray-300"
                  />
                </div>

                {/* Cidade e Bairro */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-sm text-gray-700">Cidade</Label>
                    <Input
                      id="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Cidade"
                      className="bg-white border border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro" className="text-sm text-gray-700">Bairro</Label>
                    <Input
                      id="bairro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Bairro"
                      className="bg-white border border-gray-300"
                    />
                  </div>
                </div>

                {/* Estado e Número */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-sm text-gray-700">Estado (UF)</Label>
                    <Input
                      id="estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value.toUpperCase())}
                      placeholder="SP"
                      maxLength={2}
                      className="bg-white border border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-sm text-gray-700">Número</Label>
                    <Input
                      id="numero"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="123"
                      className="bg-white border border-gray-300"
                    />
                  </div>
                </div>

                {/* Botão Criar Nova Base */}
                <div className="pt-4">
                  <Button
                    onClick={handleCriarBase}
                    disabled={loading}
                    className="w-full bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black py-6 rounded-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar nova base'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
