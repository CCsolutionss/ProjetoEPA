import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, FileDown, Calendar, TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBase } from '../context/BaseContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ReferenceLine,
} from 'recharts';
import { toast } from 'sonner@2.0.3';
import { getAmostraConfig, getAmostrasOptions } from '../config/amostras-eta.config';

interface RelatoriosPageProps {
  onVoltar: () => void;
}

// Mock de bases
const mockBases = [
  { id: '1', nome: 'Pepsico-Itu' },
  { id: '2', nome: 'Sistema de Refrigeração - Unidade A' },
  { id: '3', nome: 'Monitoramento Energético - Fábrica B' },
  { id: '4', nome: 'Tratamento de Efluentes - Indústria C' },
];

// Mock de dados de medições
// Na implementação real, isso virá do backend
const generateMockMedicoes = (tipoAmostra: string, parametro: string) => {
  const medicoes = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Gerar valores realistas baseados no parâmetro
    let valor = 0;
    if (parametro.includes('ph')) {
      valor = 6.5 + Math.random() * 1.5; // pH entre 6.5 e 8
    } else if (parametro.includes('temperatura')) {
      valor = 20 + Math.random() * 10; // Temperatura entre 20 e 30°C
    } else if (parametro.includes('pressao')) {
      valor = 2 + Math.random() * 3; // Pressão entre 2 e 5 bar
    } else {
      valor = 50 + Math.random() * 100; // Valor genérico entre 50 e 150
    }
    
    medicoes.push({
      id: i + 1,
      dataHora: date.toLocaleString('pt-BR'),
      base: 'PEPSICO',
      tipoAmostra,
      parametro,
      valor: valor.toFixed(2),
      local: `Setor ${(i % 3) + 1}`,
      status: Math.random() > 0.1 ? 'Aprovada' : 'Reprovada',
    });
  }
  
  return medicoes;
};

export default function RelatoriosPage({ onVoltar }: RelatoriosPageProps) {
  const { user } = useAuth();
  const { selectedBase } = useBase();
  
  // Estados de filtro
  const [baseId, setBaseId] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('2024-11-01');
  const [dataFim, setDataFim] = useState<string>('2024-12-01');
  const [tipoAmostra, setTipoAmostra] = useState<string>('');
  const [parametroSelecionado, setParametroSelecionado] = useState<string>('');
  
  // Estados de carregamento
  const [isLoading, setIsLoading] = useState(false);

  // Preenche a base a partir da seleção global (tela pós-login)
  // (Mantém o estado aqui pois esta tela ainda tem select; mas ele fica travado quando já existe base global)
  useEffect(() => {
    if (selectedBase?.id) {
      setBaseId(selectedBase.id);
    }
  }, [selectedBase?.id]);

  // Definir data de hoje
  const today = new Date().toISOString().split('T')[0];

  // Obter configuração da amostra selecionada
  const amostraConfig = tipoAmostra ? getAmostraConfig(tipoAmostra) : null;
  
  // Obter opções de amostras
  const opcoesAmostras = getAmostrasOptions();

  // Obter opções de parâmetros baseado na amostra selecionada
  const opcoesParametros = useMemo(() => {
    if (!amostraConfig) return [];
    return amostraConfig.campos.map((campo) => ({
      value: campo.id,
      label: campo.label,
      unidade: campo.unidade,
    }));
  }, [amostraConfig]);

  // Handler para mudança de tipo de amostra
  const handleTipoAmostraChange = (novoTipo: string) => {
    setTipoAmostra(novoTipo);
    setParametroSelecionado(''); // Limpar parâmetro ao trocar de amostra
  };

  // Verificar se todos os filtros necessários estão selecionados
  const filtrosCompletos = baseId && dataInicio && dataFim && tipoAmostra && parametroSelecionado;

  // Gerar dados mockados quando filtros estão completos
  const medicoesMock = filtrosCompletos 
    ? generateMockMedicoes(tipoAmostra, parametroSelecionado)
    : [];

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    if (medicoesMock.length === 0) {
      return {
        media: 0,
        mediana: 0,
        minimo: 0,
        maximo: 0,
        quantidade: 0,
        q1: 0,
        q3: 0,
      };
    }

    const valores = medicoesMock.map((m) => parseFloat(m.valor)).sort((a, b) => a - b);
    const soma = valores.reduce((acc, val) => acc + val, 0);
    const media = soma / valores.length;
    
    // Calcular mediana
    const meio = Math.floor(valores.length / 2);
    const mediana = valores.length % 2 === 0 
      ? (valores[meio - 1] + valores[meio]) / 2 
      : valores[meio];
    
    // Calcular quartis para boxplot
    const q1Index = Math.floor(valores.length * 0.25);
    const q3Index = Math.floor(valores.length * 0.75);
    const q1 = valores[q1Index];
    const q3 = valores[q3Index];
    
    return {
      media: media.toFixed(2),
      mediana: mediana.toFixed(2),
      minimo: Math.min(...valores).toFixed(2),
      maximo: Math.max(...valores).toFixed(2),
      quantidade: medicoesMock.length,
      q1: q1.toFixed(2),
      q3: q3.toFixed(2),
    };
  }, [medicoesMock]);

  // Preparar dados para gráfico de linhas (série temporal)
  const dadosGraficoLinhas = useMemo(() => {
    if (medicoesMock.length === 0) return [];
    
    return medicoesMock
      .slice(0, 15)
      .reverse()
      .map((m) => ({
        data: new Date(m.dataHora.split(',')[0].split('/').reverse().join('-')).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        valor: parseFloat(m.valor),
      }));
  }, [medicoesMock]);

  // Preparar dados para gráfico de colunas verticais (média por dia)
  const dadosGraficoColunas = useMemo(() => {
    if (medicoesMock.length === 0) return [];
    
    // Agrupar por dia
    const mediaPorDia: Record<string, { soma: number; count: number }> = {};
    
    medicoesMock.forEach((m) => {
      const dia = m.dataHora.split(',')[0];
      if (!mediaPorDia[dia]) {
        mediaPorDia[dia] = { soma: 0, count: 0 };
      }
      mediaPorDia[dia].soma += parseFloat(m.valor);
      mediaPorDia[dia].count += 1;
    });
    
    return Object.entries(mediaPorDia)
      .map(([dia, { soma, count }]) => ({
        dia: dia.substring(0, 5), // DD/MM
        media: parseFloat((soma / count).toFixed(2)),
      }))
      .slice(0, 10)
      .reverse();
  }, [medicoesMock]);

  // Preparar dados para gráfico de barras horizontais (distribuição por local)
  const dadosGraficoBarrasHorizontais = useMemo(() => {
    if (medicoesMock.length === 0) return [];
    
    // Agrupar por local
    const mediaPorLocal: Record<string, { soma: number; count: number }> = {};
    
    medicoesMock.forEach((m) => {
      const local = m.local;
      if (!mediaPorLocal[local]) {
        mediaPorLocal[local] = { soma: 0, count: 0 };
      }
      mediaPorLocal[local].soma += parseFloat(m.valor);
      mediaPorLocal[local].count += 1;
    });
    
    return Object.entries(mediaPorLocal)
      .map(([local, { soma, count }]) => ({
        local,
        media: parseFloat((soma / count).toFixed(2)),
      }))
      .sort((a, b) => b.media - a.media);
  }, [medicoesMock]);

  // Preparar dados para boxplot
  const dadosBoxplot = useMemo(() => {
    if (medicoesMock.length === 0) return [];
    
    const valores = medicoesMock.map((m) => parseFloat(m.valor)).sort((a, b) => a - b);
    
    const q1Index = Math.floor(valores.length * 0.25);
    const q3Index = Math.floor(valores.length * 0.75);
    const meio = Math.floor(valores.length / 2);
    
    const q1 = valores[q1Index];
    const q3 = valores[q3Index];
    const mediana = valores.length % 2 === 0 
      ? (valores[meio - 1] + valores[meio]) / 2 
      : valores[meio];
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    
    // Retornar dados para visualização de boxplot
    return [
      {
        x: 1,
        min: parseFloat(min.toFixed(2)),
        q1: parseFloat(q1.toFixed(2)),
        mediana: parseFloat(mediana.toFixed(2)),
        q3: parseFloat(q3.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
      },
    ];
  }, [medicoesMock]);

  // Preparar dados completos para a tabela (com todos os parâmetros da amostra)
  const dadosTabelaCompleta = useMemo(() => {
    if (!filtrosCompletos || !amostraConfig) return [];

    // TODO: Backend - Buscar medições completas
    // Endpoint: GET /api/medicoes?baseId=...&from=...&to=...&sampleType=...
    // Response: { medicoes: Medicao[] }
    
    // Por enquanto, gerar dados mockados com todos os parâmetros
    const medicoes = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const medicao: any = {
        id: i + 1,
        dataHora: date.toLocaleString('pt-BR'),
        base: 'PEPSICO',
        tipoAmostra: amostraConfig.nome,
        local: `Setor ${(i % 3) + 1}`,
        status: Math.random() > 0.1 ? 'Aprovada' : 'Reprovada',
      };
      
      // Adicionar valor para cada parâmetro da amostra
      amostraConfig.campos.forEach((campo) => {
        let valor = 0;
        if (campo.id.includes('ph')) {
          valor = 6.5 + Math.random() * 1.5;
        } else if (campo.id.includes('temperatura')) {
          valor = 20 + Math.random() * 10;
        } else if (campo.id.includes('pressao')) {
          valor = 2 + Math.random() * 3;
        } else {
          valor = 50 + Math.random() * 100;
        }
        medicao[campo.id] = valor.toFixed(2);
      });
      
      medicoes.push(medicao);
    }
    
    return medicoes;
  }, [filtrosCompletos, amostraConfig]);

  // Atalhos de data
  const handleUltimos7Dias = () => {
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(hoje.getDate() - 7);
    setDataInicio(seteDiasAtras.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
    toast.success('Período ajustado: Últimos 7 dias');
  };

  const handleUltimos30Dias = () => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    setDataInicio(trintaDiasAtras.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
    toast.success('Período ajustado: Últimos 30 dias');
  };

  const handleEsteMes = () => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    setDataInicio(primeiroDiaMes.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
    toast.success('Período ajustado: Este mês');
  };

  // Exportar
  const handleExportarPDF = () => {
    if (!filtrosCompletos) {
      toast.error('Selecione todos os filtros antes de exportar');
      return;
    }
    toast.success('Exportando relatório em PDF...');
    // TODO: Implementar exportação PDF
  };

  const handleExportarExcel = () => {
    if (!filtrosCompletos) {
      toast.error('Selecione todos os filtros antes de exportar');
      return;
    }
    toast.success('Exportando relatório em Excel...');
    // TODO: Implementar exportação Excel
  };

  // Obter label do parâmetro selecionado
  const parametroLabel = useMemo(() => {
    const param = opcoesParametros.find((p) => p.value === parametroSelecionado);
    return param ? `${param.label}${param.unidade ? ` ${param.unidade}` : ''}` : '';
  }, [opcoesParametros, parametroSelecionado]);

  const baseSelecionada = mockBases.find((b) => b.id === baseId);

  return (
    <div className="min-h-screen bg-[#EDFEE8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
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
            <div className="text-right">
              <p className="text-gray-900">{user?.nomeCompleto}</p>
              <p className="text-xs text-gray-500">{user?.cargo}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
        {/* Card de Filtros */}
        <Card className="bg-white shadow-sm mb-6">
          <div className="p-6">
            {/* Header com Botão Voltar */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={onVoltar} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h2 className="text-gray-900">Relatórios e Análises</h2>
            </div>

            {/* Filtros - Linha 1: Base e Datas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Base */}
              <div className="space-y-2">
                <Label htmlFor="base-select" className="text-sm">Base *</Label>
                <Select value={baseId} onValueChange={setBaseId}>
                  <SelectTrigger id="base-select" className="w-full" disabled={!!selectedBase?.id}>
                    <SelectValue placeholder="Selecione a base" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBases.map((base) => (
                      <SelectItem key={base.id} value={base.id}>
                        {base.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data Início */}
              <div className="space-y-2">
                <Label htmlFor="data-inicio" className="text-sm">De *</Label>
                <div className="relative">
                  <Input
                    id="data-inicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    max={today}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <Label htmlFor="data-fim" className="text-sm">Até *</Label>
                <div className="relative">
                  <Input
                    id="data-fim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    max={today}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Filtros - Linha 2: Tipo de Amostra e Parâmetro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Tipo de Amostra */}
              <div className="space-y-2">
                <Label htmlFor="tipo-amostra" className="text-sm">Tipo de Amostra *</Label>
                <Select value={tipoAmostra} onValueChange={handleTipoAmostraChange}>
                  <SelectTrigger id="tipo-amostra" className="w-full">
                    <SelectValue placeholder="Selecione o tipo de amostra" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {opcoesAmostras.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parâmetro */}
              <div className="space-y-2">
                <Label htmlFor="parametro" className="text-sm">Parâmetro *</Label>
                <Select 
                  value={parametroSelecionado} 
                  onValueChange={setParametroSelecionado}
                  disabled={!tipoAmostra}
                >
                  <SelectTrigger id="parametro" className="w-full">
                    <SelectValue placeholder={tipoAmostra ? "Selecione o parâmetro" : "Selecione a amostra primeiro"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {opcoesParametros.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label} {opcao.unidade && <span className="text-gray-500">- {opcao.unidade}</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Atalhos e Exportação */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleUltimos7Dias} className="flex-1 sm:flex-none">
                  Últimos 7 dias
                </Button>
                <Button variant="outline" size="sm" onClick={handleUltimos30Dias} className="flex-1 sm:flex-none">
                  Últimos 30 dias
                </Button>
                <Button variant="outline" size="sm" onClick={handleEsteMes} className="flex-1 sm:flex-none">
                  Este mês
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportarPDF} 
                  className="gap-2 flex-1 sm:flex-none"
                  disabled={!filtrosCompletos}
                >
                  <FileDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportarExcel} 
                  className="gap-2 flex-1 sm:flex-none"
                  disabled={!filtrosCompletos}
                >
                  <FileDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar Excel</span>
                  <span className="sm:hidden">Excel</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Conteúdo Principal - Mostrar apenas quando filtros estão completos */}
        {!filtrosCompletos ? (
          <Card className="bg-white shadow-sm">
            <div className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-700 mb-2">Selecione os filtros para visualizar os dados</h3>
              <p className="text-sm text-gray-500">
                Preencha: Base, Período (de/até), Tipo de Amostra e Parâmetro
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Média */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-blue-700 mb-1">Valor Médio</p>
                      <p className="text-2xl text-blue-900">{estatisticas.media}</p>
                      <p className="text-xs text-blue-600 mt-1">{parametroLabel}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-200 border-2 border-blue-300 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mínimo */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-green-700 mb-1">Valor Mínimo</p>
                      <p className="text-2xl text-green-900">{estatisticas.minimo}</p>
                      <p className="text-xs text-green-600 mt-1">{parametroLabel}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-200 border-2 border-green-300 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Máximo */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-orange-700 mb-1">Valor Máximo</p>
                      <p className="text-2xl text-orange-900">{estatisticas.maximo}</p>
                      <p className="text-xs text-orange-600 mt-1">{parametroLabel}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-200 border-2 border-orange-300 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-700" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quantidade */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs text-purple-700 mb-1">Quantidade</p>
                      <p className="text-2xl text-purple-900">{estatisticas.quantidade}</p>
                      <p className="text-xs text-purple-600 mt-1">Medições registradas</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-200 border-2 border-purple-300 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gráficos - 4 gráficos em grid 2x2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* 1. Gráfico de Linhas - Série Temporal */}
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-gray-900 mb-1">Série Temporal</h3>
                  <p className="text-xs text-gray-500 mb-4">{parametroLabel} ao longo do tempo</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dadosGraficoLinhas}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="data" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="#00920C" 
                        strokeWidth={3}
                        dot={{ fill: '#00920C', r: 4 }}
                        activeDot={{ r: 6 }}
                        name={parametroLabel}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* 2. Gráfico de Colunas (Barras Verticais) - Média Diária */}
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-gray-900 mb-1">Média Diária</h3>
                  <p className="text-xs text-gray-500 mb-4">Média de {parametroLabel} por dia</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGraficoColunas}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="dia" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="media" 
                        fill="#00920C"
                        name={`Média ${parametroLabel}`}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* 3. Gráfico de Barras Horizontais - Distribuição por Local */}
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-gray-900 mb-1">Distribuição por Local</h3>
                  <p className="text-xs text-gray-500 mb-4">Média de {parametroLabel} por setor</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGraficoBarrasHorizontais} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        dataKey="local" 
                        type="category" 
                        width={80}
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="media" 
                        fill="#00DC30"
                        name={`Média ${parametroLabel}`}
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* 4. Boxplot - Diagrama de Caixa */}
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-gray-900 mb-1">Diagrama de Caixa (Boxplot)</h3>
                  <p className="text-xs text-gray-500 mb-4">Distribuição estatística de {parametroLabel}</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={dadosBoxplot}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                        formatter={(value: any) => parseFloat(value).toFixed(2)}
                      />
                      <Legend />
                      
                      {/* Linha do máximo ao mínimo */}
                      <Bar dataKey="max" fill="transparent" stroke="transparent" />
                      <Bar dataKey="min" fill="transparent" stroke="transparent" />
                      
                      {/* Caixa (Q1 a Q3) */}
                      <Bar 
                        dataKey="q3" 
                        stackId="box" 
                        fill="#00920C" 
                        opacity={0.6}
                        name="Q3 (75%)"
                      />
                      <Bar 
                        dataKey="q1" 
                        stackId="box" 
                        fill="#00DC30" 
                        opacity={0.6}
                        name="Q1 (25%)"
                      />
                      
                      {/* Mediana */}
                      <ReferenceLine 
                        y={parseFloat(estatisticas.mediana)} 
                        stroke="#000" 
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{ value: `Mediana: ${estatisticas.mediana}`, position: 'right', fontSize: 10 }}
                      />
                      
                      {/* Máximo e Mínimo como pontos */}
                      <Scatter 
                        dataKey="max" 
                        fill="#FF0000"
                        shape="circle"
                        name="Máximo"
                      />
                      <Scatter 
                        dataKey="min" 
                        fill="#0000FF"
                        shape="circle"
                        name="Mínimo"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-gray-600">Mínimo</p>
                      <p className="font-semibold text-blue-700">{estatisticas.minimo}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Mediana</p>
                      <p className="font-semibold text-gray-700">{estatisticas.mediana}</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-gray-600">Máximo</p>
                      <p className="font-semibold text-red-700">{estatisticas.maximo}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabela de Log - Com TODOS os parâmetros da amostra */}
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900">Log de Medições Completo</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Todos os parâmetros de {amostraConfig?.nome} para o período selecionado
                    </p>
                  </div>
                  <Badge className="bg-[#00920C] hover:bg-[#00DC30]">
                    {dadosTabelaCompleta.length} registros
                  </Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#EDFEE8]">
                        <TableHead className="font-semibold">Data/Hora</TableHead>
                        <TableHead className="font-semibold">Base</TableHead>
                        <TableHead className="font-semibold">Tipo Amostra</TableHead>
                        {/* Colunas dinâmicas para cada parâmetro da amostra */}
                        {amostraConfig?.campos.map((campo) => (
                          <TableHead key={campo.id} className="font-semibold">
                            {campo.label}
                            {campo.unidade && <span className="text-xs text-gray-500 ml-1">{campo.unidade}</span>}
                          </TableHead>
                        ))}
                        <TableHead className="font-semibold">Local</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dadosTabelaCompleta.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          <TableCell className="text-sm">{row.dataHora}</TableCell>
                          <TableCell className="text-sm">{row.base}</TableCell>
                          <TableCell className="text-sm">{row.tipoAmostra}</TableCell>
                          {/* Valores dinâmicos para cada parâmetro */}
                          {amostraConfig?.campos.map((campo) => (
                            <TableCell key={campo.id} className="text-sm">
                              {row[campo.id] || '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-sm">{row.local}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                row.status === 'Aprovada' 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : 'bg-red-500 hover:bg-red-600'
                              }
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
