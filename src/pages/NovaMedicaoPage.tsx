import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, AlertCircle, Droplet } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Context
import { useAuth } from '../context/AuthContext';

// Components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card } from '../components/ui/card';

// Config & Types
import { AMOSTRAS_ETA_CONFIG, getAmostraConfig, getAmostrasOptions } from '../config/amostras-eta.config';
import { TipoAmostra } from '../types/medicao-eta';

// Constants & Utils
import { TIME_INTERVALS, NETWORK_DELAYS } from '../constants/api.constants';
import { getCurrentDateTime } from '../utils/format.utils';

interface NovaMedicaoPageProps {
  onVoltar: () => void;
}

/**
 * TODO: [Backend Integration Required]
 * 
 * Fetch available measurement bases
 * 
 * Endpoint: GET /api/bases
 * Auth: Bearer token required
 * Query: ?ativo=true
 * 
 * Response (200):
 * {
 *   bases: Array<{
 *     id: string,
 *     nome: string,
 *     ativo: boolean,
 *     localizacao?: string
 *   }>
 * }
 */
// MOCK DATA - Remove when backend is integrated
const mockBases = [
  { id: '1', nome: 'Sistema de Refrigeração - Unidade A' },
  { id: '2', nome: 'Monitoramento Energético - Fábrica B' },
  { id: '3', nome: 'Qualidade do Ar - Escritório Central' },
  { id: '4', nome: 'Tratamento de Efluentes - Indústria C' },
];

/**
 * NovaMedicaoPage Component
 * 
 * Allows operators to record new measurements for different sample types.
 * Features:
 * - Dynamic form fields based on selected sample type
 * - Real-time timestamp updates
 * - Draft saving functionality
 * - Comprehensive validation
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onVoltar - Navigate back callback
 */
export default function NovaMedicaoPage({ onVoltar }: NovaMedicaoPageProps) {
  const { user } = useAuth();
  
  // Form state
  const [baseId, setBaseId] = useState<string>('');
  const [tipoAmostra, setTipoAmostra] = useState<string>('');
  const [valores, setValores] = useState<Record<string, string>>({});
  const [observacoes, setObservacoes] = useState<string>('');
  const [dataHora, setDataHora] = useState<string>(getCurrentDateTime());
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Auto-update timestamp every second
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setDataHora(getCurrentDateTime());
    }, TIME_INTERVALS.TIMESTAMP_UPDATE);

    return () => clearInterval(interval);
  }, []);

  /**
   * Handle sample type change
   * Clears all field values when switching sample types
   */
  const handleTipoAmostraChange = (novoTipo: string) => {
    setTipoAmostra(novoTipo);
    setValores({});
  };

  /**
   * Handle field value change
   * Updates the valores object with new field value
   */
  const handleValorChange = (campoId: string, valor: string) => {
    setValores((prev) => ({
      ...prev,
      [campoId]: valor,
    }));
  };

  /**
   * Validate form before submission
   * @returns {boolean} True if form is valid
   */
  const validarFormulario = (): boolean => {
    if (!baseId) {
      toast.error('Selecione uma base antes de continuar');
      return false;
    }

    if (!tipoAmostra) {
      toast.error('Selecione o tipo de amostra');
      return false;
    }

    // Check if at least one field has been filled
    const algumCampoPreenchido = Object.values(valores).some(
      (valor) => valor && valor.trim() !== ''
    );

    if (!algumCampoPreenchido) {
      toast.error('Preencha pelo menos um campo de medição');
      return false;
    }

    return true;
  };

  /**
   * Prepare data for API submission
   * Filters empty values and converts numeric strings to numbers
   * @returns {Object} Formatted measurement data
   */
  const prepararDadosEnvio = () => {
    // Filter only filled values
    const valoresFiltrados: Record<string, string | number> = {};
    
    Object.entries(valores).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        // Try to convert to number if numeric
        const numeroValor = parseFloat(value);
        valoresFiltrados[key] = isNaN(numeroValor) ? value : numeroValor;
      }
    });

    return {
      baseId,
      tipoAmostra: tipoAmostra as TipoAmostra,
      dataHora,
      valores: valoresFiltrados,
      observacoes: observacoes.trim() || undefined,
      operador: user?.nomeCompleto,
    };
  };

  /**
   * Save measurement as draft
   * Allows users to save incomplete measurements for later completion
   */
  const handleSalvarRascunho = async () => {
    // Minimal validation for drafts
    if (!baseId) {
      toast.error('Selecione uma base antes de salvar');
      return;
    }

    if (!tipoAmostra) {
      toast.error('Selecione o tipo de amostra antes de salvar');
      return;
    }

    setIsLoading(true);
    
    try {
      const dados = prepararDadosEnvio();
      
      /**
       * TODO: [Backend Integration Required]
       * 
       * Save measurement as draft
       * 
       * Endpoint: POST /api/medicoes/rascunho
       * Auth: Bearer token required
       * 
       * Request:
       * {
       *   baseId: string,
       *   tipoAmostra: TipoAmostra,
       *   dataHora: string,
       *   valores: Record<string, number | string>,
       *   observacoes?: string,
       *   operador: string
       * }
       * 
       * Response (201):
       * {
       *   id: string,
       *   status: 'draft',
       *   savedAt: string (ISO 8601)
       * }
       */
      
      console.log('Salvando rascunho:', dados);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAYS.LONG));
      toast.success('Rascunho salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar rascunho');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit measurement
   * Validates and sends completed measurement to backend
   */
  const handleEnviarMedicao = async () => {
    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const dados = prepararDadosEnvio();

      /**
       * TODO: [Backend Integration Required]
       * 
       * Submit completed measurement
       * 
       * Endpoint: POST /api/medicoes
       * Auth: Bearer token required
       * 
       * Request:
       * {
       *   baseId: string,
       *   tipoAmostra: TipoAmostra,
       *   dataHora: string,
       *   valores: Record<string, number | string>,
       *   observacoes?: string,
       *   operador: string
       * }
       * 
       * Response (201):
       * {
       *   id: string,
       *   status: 'approved' | 'pending_review',
       *   createdAt: string (ISO 8601),
       *   validationErrors?: string[]
       * }
       * 
       * Errors:
       * - 400: Validation error
       * - 401: Unauthorized
       * - 500: Server error
       */
      
      console.log('Enviando medição:', dados);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAYS.LONG));
      toast.success('Medição enviada com sucesso!');
      
      // Navigate back after short delay
      setTimeout(() => {
        onVoltar();
      }, 1000);
    } catch (error) {
      toast.error('Erro ao enviar medição');
      console.error('Measurement submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseSelecionada = mockBases.find((b) => b.id === baseId);
  const amostraConfig = tipoAmostra ? getAmostraConfig(tipoAmostra) : null;
  const opcoesAmostras = getAmostrasOptions();

  return (
    <div className="min-h-screen h-full bg-[#EDFEE8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Botão Voltar */}
        <Button
          variant="outline"
          onClick={onVoltar}
          className="mb-6"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Card Principal */}
        <Card className="bg-white shadow-lg overflow-hidden">
          {/* Header com título */}
          <div className="bg-[#EDFEE8] border-b border-[#00920C]/20 px-4 sm:px-8 py-4 sm:py-6">
            <h2 className="text-gray-900 text-lg sm:text-xl">Nova Medição</h2>
          </div>

          {/* Conteúdo Principal - Layout com Sidebar */}
          <div className="flex flex-col lg:flex-row">
            {/* Área principal - Campos de Medição */}
            <div className="flex-1 p-4 sm:p-8 lg:border-r border-gray-200">
              {/* Seleção de Tipo de Amostra */}
              <div className="mb-6">
                <Label htmlFor="tipo-amostra" className="text-sm text-gray-700">
                  Tipo de Amostra *
                </Label>
                <div
                  className={`mt-2 rounded-lg border-2 transition-all ${
                    tipoAmostra
                      ? 'border-[#00920C] bg-[#EDFEE8]/30'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <Select value={tipoAmostra} onValueChange={handleTipoAmostraChange}>
                    <SelectTrigger
                      id="tipo-amostra"
                      className="w-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
                      disabled={!baseId}
                    >
                      <SelectValue placeholder={baseId ? "Selecione o tipo de amostra" : "Selecione uma base primeiro"} />
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
                {!tipoAmostra && baseId && (
                  <div className="flex items-center gap-2 text-orange-500 text-xs mt-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>Selecione o tipo de amostra para visualizar os campos</span>
                  </div>
                )}
              </div>

              {/* Campos de Medição Dinâmicos */}
              {amostraConfig ? (
                <div className="space-y-6">
                  {/* Header dos Campos */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-[#00920C]/20">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-[#00920C]" />
                      <h3 className="text-[#00920C]">
                        Campos de Medição - {amostraConfig.nome}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      {amostraConfig.campos.length} campo{amostraConfig.campos.length !== 1 && 's'}
                    </span>
                  </div>

                  {/* Grid de Campos */}
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {amostraConfig.campos.map((campo) => (
                        <div key={campo.id} className="space-y-2">
                          <Label
                            htmlFor={campo.id}
                            className="text-xs text-gray-700"
                          >
                            {campo.label}
                            {campo.unidade && (
                              <span className="text-gray-500 ml-1">{campo.unidade}</span>
                            )}
                          </Label>
                          <Input
                            id={campo.id}
                            type={campo.tipo === 'numero' ? 'number' : 'text'}
                            step={campo.tipo === 'numero' ? 'any' : undefined}
                            value={valores[campo.id] || ''}
                            onChange={(e) => handleValorChange(campo.id, e.target.value)}
                            placeholder={`Digite ${campo.label.toLowerCase()}`}
                            className="bg-white border-gray-300 focus:border-[#00920C] focus:ring-[#00920C]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="space-y-2 pt-4 border-t-2 border-gray-200">
                    <Label htmlFor="observacoes" className="text-sm text-gray-700">
                      Observações (opcional)
                    </Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Adicione observações relevantes sobre esta medição..."
                      rows={3}
                      className="bg-white border-gray-300 focus:border-[#00920C] focus:ring-[#00920C] resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center space-y-3">
                    <Droplet className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="text-gray-500">
                      {!baseId 
                        ? 'Selecione uma base para continuar'
                        : 'Selecione um tipo de amostra para visualizar os campos de medição'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Direita - Informações */}
            <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 space-y-4">
              {/* Select Base */}
              <div className="space-y-2">
                <Label htmlFor="base-select" className="text-sm text-gray-700">
                  Selecione a base *
                </Label>
                <div className={`rounded-lg border-2 transition-all ${
                  baseId 
                    ? 'border-[#00920C] bg-[#EDFEE8]/30' 
                    : 'border-red-300 bg-red-50/30'
                }`}>
                  <Select value={baseId} onValueChange={setBaseId}>
                    <SelectTrigger 
                      id="base-select" 
                      className="w-full border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
                    >
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
                {!baseId && (
                  <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Obrigatório para continuar</span>
                  </div>
                )}
              </div>

              {/* Base Selecionada */}
              {baseSelecionada && (
                <div className="p-4 rounded-lg border-2 border-[#00920C] bg-white">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#00920C] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Base selecionada:</p>
                      <p className="text-sm text-gray-900">{baseSelecionada.nome}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Operador */}
              <div className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-[#00920C] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">
                      {user?.nomeCompleto.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Operador:</p>
                    <p className="text-sm text-gray-900">{user?.nomeCompleto}</p>
                    <p className="text-xs text-gray-500">{user?.cargo}</p>
                  </div>
                </div>
              </div>

              {/* Data/Hora - Atualização Automática */}
              <div className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#00920C] mt-1 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Data/hora atual:</p>
                    <p className="text-gray-900">{dataHora}</p>
                    <p className="text-xs text-gray-400 mt-1">Atualização automática</p>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Dica:</strong> Primeiro selecione a base, depois o tipo de amostra. Os campos aparecerão automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé - Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 border-t-2 border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={handleSalvarRascunho}
              disabled={isLoading || !baseId || !tipoAmostra}
              className="gap-2 border-gray-300 w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Salvar rascunho
            </Button>

            <Button
              onClick={handleEnviarMedicao}
              disabled={isLoading || !baseId || !tipoAmostra}
              className="bg-[#00920C] hover:bg-[#00DC30] gap-2 px-6 sm:px-8 w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              {isLoading ? 'Enviando...' : 'Enviar medição'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
