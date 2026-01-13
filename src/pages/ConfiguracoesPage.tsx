import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Download, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from 'sonner@2.0.3';

interface ConfiguracoesPageProps {
  onVoltar: () => void;
}

interface LogEntry {
  id: string;
  dataHora: string;
  usuario: string;
  acao: string;
  detalhes: string;
}

export default function ConfiguracoesPage({ onVoltar }: ConfiguracoesPageProps) {
  const { user } = useAuth();
  const [horarioBackup, setHorarioBackup] = useState('02:00');
  const [salvando, setSalvando] = useState(false);
  const [carregandoLogs, setCarregandoLogs] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Carregar configurações e logs ao montar o componente
  useEffect(() => {
    carregarConfiguracoes();
    carregarLogs();
  }, []);

  // Carregar configurações salvas
  const carregarConfiguracoes = async () => {
    try {
      // TODO: backend - Buscar configurações do backend
      // Endpoint: GET /api/configuracoes
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { horarioBackup: string }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock de dados
      setHorarioBackup('02:00');
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  // Carregar logs do sistema
  const carregarLogs = async () => {
    setCarregandoLogs(true);
    try {
      // TODO: backend - Buscar logs do backend
      // Endpoint: GET /api/logs
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: { logs: LogEntry[] }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock de dados
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          dataHora: '13/10/2022 10:51',
          usuario: 'Rodrigo',
          acao: 'Exportação',
          detalhes: 'Relatório Pepsico Itu exportado',
        },
        {
          id: '2',
          dataHora: '20/10/2022 13:15',
          usuario: 'Juan',
          acao: 'Medição',
          detalhes: 'Adicionado medição Pepsico Itu',
        },
        {
          id: '3',
          dataHora: '22/12/2022 12:01',
          usuario: 'Lucas',
          acao: 'Exportação',
          detalhes: 'Relatório Pepsico Itu exportado',
        },
        {
          id: '4',
          dataHora: '15/01/2023 09:30',
          usuario: 'Matheus',
          acao: 'Cadastro',
          detalhes: 'Nova base cadastrada: SENAC ETAS',
        },
        {
          id: '5',
          dataHora: '18/01/2023 14:22',
          usuario: 'Rodrigo',
          acao: 'Atualização',
          detalhes: 'Dados da base Amsted atualizados',
        },
        {
          id: '6',
          dataHora: '25/01/2023 11:45',
          usuario: 'Juan',
          acao: 'Exclusão',
          detalhes: 'Usuário removido: João Silva',
        },
      ];

      setLogs(mockLogs);
    } catch (error) {
      toast.error('Erro ao carregar logs');
      console.error('Erro ao carregar logs:', error);
    } finally {
      setCarregandoLogs(false);
    }
  };

  // Salvar configurações
  const handleSalvarPreferencias = async () => {
    if (!horarioBackup) {
      toast.error('Selecione um horário para o backup!');
      return;
    }

    setSalvando(true);
    try {
      // TODO: backend - Salvar configurações no backend
      // Endpoint: PUT /api/configuracoes
      // Headers: { Authorization: `Bearer ${token}` }
      // Body: { horarioBackup: string }
      // Response: { success: boolean }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar preferências. Tente novamente.');
      console.error('Erro ao salvar preferências:', error);
    } finally {
      setSalvando(false);
    }
  };

  // Exportar logs
  const handleExportarLog = async () => {
    setExportando(true);
    try {
      // TODO: backend - Exportar logs do backend
      // Endpoint: GET /api/logs/export
      // Headers: { Authorization: `Bearer ${token}` }
      // Response: Blob (arquivo CSV ou Excel)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Criar arquivo CSV com os logs
      const csvContent =
        'Data/Hora,Usuário,Ação,Detalhes\n' +
        logs
          .map((log) => `${log.dataHora},${log.usuario},${log.acao},${log.detalhes}`)
          .join('\n');

      // Criar blob e fazer download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `logs_sistema_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Log exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar log. Tente novamente.');
      console.error('Erro ao exportar log:', error);
    } finally {
      setExportando(false);
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
                <p className="text-xs text-gray-500">Configurações e Segurança</p>
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

        {/* Card de Configurações */}
        <div className="bg-white border-2 border-black shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8">
          {/* Título */}
          <h2 className="text-xl sm:text-2xl text-gray-900 mb-6 sm:mb-8">Configurações e Segurança</h2>

          {/* Horário de Backup */}
          <div className="mb-8">
            <div className="max-w-md">
              <Label htmlFor="horario-backup" className="text-sm sm:text-base text-gray-900 mb-3 block">
                Horário de Backup Diário:
              </Label>
              <div className="relative">
                <Input
                  id="horario-backup"
                  type="time"
                  value={horarioBackup}
                  onChange={(e) => setHorarioBackup(e.target.value)}
                  className="bg-white border-2 border-gray-300 h-12 text-base focus:border-[#00920C] pr-10"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Botão Salvar Preferências */}
            <div className="mt-6">
              <Button
                onClick={handleSalvarPreferencias}
                disabled={salvando}
                className="w-full sm:w-auto bg-[#00DC30] hover:bg-[#00920C] text-black hover:text-white border-2 border-black px-6 sm:px-8 h-12 rounded-xl"
              >
                {salvando ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar preferências
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Seção de Logs */}
          <div className="mt-8 sm:mt-12">
            <h3 className="text-lg sm:text-xl text-gray-900 mb-4">Logs</h3>

            {/* Tabela de Logs */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              {carregandoLogs ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00920C]"></div>
                  <p className="text-gray-500 mt-4">Carregando logs...</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-x-auto overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-gray-100 sticky top-0">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">Data/Hora</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">Usuário</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">Ação</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            Nenhum log encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-gray-50">
                            <TableCell className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">{log.dataHora}</TableCell>
                            <TableCell className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">{log.usuario}</TableCell>
                            <TableCell className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">{log.acao}</TableCell>
                            <TableCell className="text-gray-700 text-xs sm:text-sm">{log.detalhes}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Botão Exportar Log */}
            <div className="flex justify-stretch sm:justify-end mt-6">
              <Button
                onClick={handleExportarLog}
                disabled={exportando || logs.length === 0}
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 px-4 sm:px-6 h-12 rounded-xl hover:bg-gray-50"
              >
                {exportando ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Log
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
