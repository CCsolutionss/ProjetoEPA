/**
 * Serviço de Medições e Bases
 * 
 * TODO: BACKEND - Microserviço de Medições (medicao-service)
 * Porta: 3003
 * Base URL: /api
 * 
 * Responsabilidades:
 * - CRUD de medições
 * - CRUD de bases de medição
 * - Geração de relatórios
 * - Exportação de dados (CSV, Excel, PDF)
 * - Validação de dados de medição
 */

import { HttpClient } from './http-client';
import { SERVICE_URLS } from './config';
import { Medicao, Base, CampoBase, CreateMedicaoRequest, CreateBaseRequest } from '../types/medicao';

// ==================== REQUEST/RESPONSE TYPES ====================

export interface GetMedicoesParams {
  page?: number;
  limit?: number;
  baseId?: string;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetMedicoesResponse {
  medicoes: Medicao[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateMedicaoRequest {
  data?: string;
  valores?: Record<string, any>;
  observacoes?: string;
}

export interface GetBasesParams {
  page?: number;
  limit?: number;
  search?: string;
  ativo?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetBasesResponse {
  bases: Base[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateBaseRequest {
  nome?: string;
  descricao?: string;
  campos?: CampoBase[];
  ativo?: boolean;
}

export interface GetRelatorioParams {
  baseId?: string;
  dataInicio: string;
  dataFim: string;
  agrupamento?: 'dia' | 'semana' | 'mes';
  campos?: string[];
}

export interface ExportParams {
  formato: 'csv' | 'excel' | 'pdf';
  baseId?: string;
  dataInicio?: string;
  dataFim?: string;
}

// ==================== SERVICE CLASS ====================

class MedicaoService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient(SERVICE_URLS.MEDICAO);
  }

  // ==================== MEDIÇÕES ====================

  /**
   * TODO: BACKEND - Implementar endpoint de criação de medição
   * 
   * Endpoint: POST /medicoes
   * Headers: { Authorization: Bearer <token> }
   * Body: CreateMedicaoRequest
   * Response: { medicao: Medicao }
   * 
   * Validações:
   * - Base existe e está ativa
   * - Todos os campos obrigatórios preenchidos
   * - Valores correspondem aos tipos dos campos
   * - Data válida (não futura)
   * 
   * Processamento:
   * - Validar valores contra schema da base
   * - Associar usuário criador
   * - Gerar ID único
   * - Salvar no banco
   * - Criar notificação se configurado
   * 
   * Códigos de resposta:
   * - 201: Medição criada
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão de criação
   * - 404: Base não encontrada
   */
  async createMedicao(data: CreateMedicaoRequest): Promise<{ medicao: Medicao }> {
    return this.client.post<{ medicao: Medicao }>('/medicoes', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de listagem de medições
   * 
   * Endpoint: GET /medicoes
   * Headers: { Authorization: Bearer <token> }
   * Query: ?page=1&limit=10&baseId=xxx&dataInicio=xxx&dataFim=xxx&search=xxx&sortBy=xxx&sortOrder=xxx
   * Response: GetMedicoesResponse
   * 
   * Funcionalidades:
   * - Paginação (padrão: 20 por página)
   * - Filtro por base
   * - Filtro por período
   * - Busca por valores ou observações
   * - Ordenação por data, base, criador
   * 
   * Performance:
   * - Índices no banco: baseId, data, criadoPor
   * - Cache de 5 minutos para consultas comuns
   * 
   * Códigos de resposta:
   * - 200: Lista retornada
   * - 401: Não autenticado
   * - 403: Sem permissão de leitura
   */
  async getMedicoes(params?: GetMedicoesParams): Promise<GetMedicoesResponse> {
    const queryString = this.client.buildQueryString(params);
    return this.client.get<GetMedicoesResponse>(`/medicoes${queryString}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de buscar medição por ID
   * 
   * Endpoint: GET /medicoes/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { medicao: Medicao }
   * 
   * Retorna:
   * - Dados completos da medição
   * - Dados da base associada
   * - Informações do criador
   * 
   * Códigos de resposta:
   * - 200: Medição encontrada
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Medição não encontrada
   */
  async getMedicaoById(id: string): Promise<{ medicao: Medicao }> {
    return this.client.get<{ medicao: Medicao }>(`/medicoes/${id}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de atualização de medição
   * 
   * Endpoint: PUT /medicoes/:id
   * Headers: { Authorization: Bearer <token> }
   * Body: UpdateMedicaoRequest
   * Response: { medicao: Medicao }
   * 
   * Validações:
   * - Valores correspondem aos tipos dos campos
   * - Data válida
   * 
   * Regras:
   * - Usuários podem editar apenas próprias medições
   * - Admins podem editar qualquer medição
   * - Registrar histórico de alterações
   * 
   * Códigos de resposta:
   * - 200: Medição atualizada
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Medição não encontrada
   */
  async updateMedicao(id: string, data: UpdateMedicaoRequest): Promise<{ medicao: Medicao }> {
    return this.client.put<{ medicao: Medicao }>(`/medicoes/${id}`, data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de exclusão de medição
   * 
   * Endpoint: DELETE /medicoes/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Regras:
   * - Usuários podem deletar apenas próprias medições (últimas 24h)
   * - Admins podem deletar qualquer medição
   * - Soft delete (manter no banco com flag deletado)
   * 
   * Códigos de resposta:
   * - 200: Medição deletada
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Medição não encontrada
   */
  async deleteMedicao(id: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/medicoes/${id}`);
  }

  // ==================== BASES ====================

  /**
   * TODO: BACKEND - Implementar endpoint de criação de base
   * 
   * Endpoint: POST /bases
   * Headers: { Authorization: Bearer <token> }
   * Body: CreateBaseRequest
   * Response: { base: Base }
   * 
   * Validações:
   * - Nome único
   * - Pelo menos 1 campo definido
   * - Tipos de campo válidos
   * - Ordem dos campos única
   * 
   * Processamento:
   * - Gerar IDs para campos
   * - Associar usuário criador
   * - Criar schema de validação
   * 
   * Permissões:
   * - Apenas admin pode criar bases
   * 
   * Códigos de resposta:
   * - 201: Base criada
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 409: Nome já existe
   */
  async createBase(data: CreateBaseRequest): Promise<{ base: Base }> {
    return this.client.post<{ base: Base }>('/bases', data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de listagem de bases
   * 
   * Endpoint: GET /bases
   * Headers: { Authorization: Bearer <token> }
   * Query: ?page=1&limit=10&search=xxx&ativo=true&sortBy=xxx&sortOrder=xxx
   * Response: GetBasesResponse
   * 
   * Funcionalidades:
   * - Paginação
   * - Filtro por status (ativo/inativo)
   * - Busca por nome ou descrição
   * - Ordenação
   * 
   * Retorna:
   * - Lista de bases com contagem de medições
   * 
   * Códigos de resposta:
   * - 200: Lista retornada
   * - 401: Não autenticado
   */
  async getBases(params?: GetBasesParams): Promise<GetBasesResponse> {
    const queryString = this.client.buildQueryString(params);
    return this.client.get<GetBasesResponse>(`/bases${queryString}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de buscar base por ID
   * 
   * Endpoint: GET /bases/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { base: Base }
   * 
   * Retorna:
   * - Dados completos da base
   * - Contagem de medições associadas
   * - Última medição realizada
   * 
   * Códigos de resposta:
   * - 200: Base encontrada
   * - 401: Não autenticado
   * - 404: Base não encontrada
   */
  async getBaseById(id: string): Promise<{ base: Base }> {
    return this.client.get<{ base: Base }>(`/bases/${id}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de atualização de base
   * 
   * Endpoint: PUT /bases/:id
   * Headers: { Authorization: Bearer <token> }
   * Body: UpdateBaseRequest
   * Response: { base: Base }
   * 
   * Validações:
   * - Nome único (se alterado)
   * - Tipos de campo válidos
   * 
   * Regras:
   * - Alterar campos pode afetar medições existentes
   * - Avisar antes de remover campos com dados
   * - Manter compatibilidade com medições antigas
   * 
   * Permissões:
   * - Apenas admin pode atualizar bases
   * 
   * Códigos de resposta:
   * - 200: Base atualizada
   * - 400: Dados inválidos
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Base não encontrada
   * - 409: Nome já existe
   */
  async updateBase(id: string, data: UpdateBaseRequest): Promise<{ base: Base }> {
    return this.client.put<{ base: Base }>(`/bases/${id}`, data);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de exclusão de base
   * 
   * Endpoint: DELETE /bases/:id
   * Headers: { Authorization: Bearer <token> }
   * Response: { message: string }
   * 
   * Regras:
   * - Não pode deletar base com medições associadas
   * - Ou fazer soft delete (marcar como inativa)
   * 
   * Permissões:
   * - Apenas admin pode deletar bases
   * 
   * Códigos de resposta:
   * - 200: Base deletada
   * - 400: Base possui medições associadas
   * - 401: Não autenticado
   * - 403: Sem permissão
   * - 404: Base não encontrada
   */
  async deleteBase(id: string): Promise<{ message: string }> {
    return this.client.delete<{ message: string }>(`/bases/${id}`);
  }

  // ==================== RELATÓRIOS ====================

  /**
   * TODO: BACKEND - Implementar endpoint de geração de relatório
   * 
   * Endpoint: GET /relatorios
   * Headers: { Authorization: Bearer <token> }
   * Query: ?baseId=xxx&dataInicio=xxx&dataFim=xxx&agrupamento=xxx&campos[]=xxx
   * Response: { dados: any[], agregacoes: any, graficos: any }
   * 
   * Funcionalidades:
   * - Filtro por base e período
   * - Agrupamento por dia/semana/mês
   * - Seleção de campos específicos
   * - Cálculos agregados (média, soma, min, max)
   * - Dados para gráficos
   * 
   * Performance:
   * - Cache de 15 minutos
   * - Processar em background para períodos grandes
   * 
   * Códigos de resposta:
   * - 200: Relatório gerado
   * - 400: Parâmetros inválidos
   * - 401: Não autenticado
   */
  async getRelatorio(params: GetRelatorioParams): Promise<any> {
    const queryString = this.client.buildQueryString(params);
    return this.client.get<any>(`/relatorios${queryString}`);
  }

  /**
   * TODO: BACKEND - Implementar endpoint de exportação de dados
   * 
   * Endpoint: POST /medicoes/export
   * Headers: { Authorization: Bearer <token> }
   * Body: ExportParams
   * Response: Blob (arquivo CSV/Excel/PDF)
   * 
   * Formatos suportados:
   * - CSV: simples e rápido
   * - Excel: com formatação e múltiplas abas
   * - PDF: com gráficos e tabelas
   * 
   * Processamento:
   * - Gerar arquivo temporário
   * - Retornar link de download (válido por 1 hora)
   * - Limpar arquivos antigos (job agendado)
   * 
   * Códigos de resposta:
   * - 200: Arquivo gerado
   * - 400: Parâmetros inválidos
   * - 401: Não autenticado
   * - 413: Muitos dados (limite: 10.000 registros)
   */
  async exportarMedicoes(params: ExportParams): Promise<Blob> {
    return this.client.post<Blob>('/medicoes/export', params);
  }
}

export const medicaoService = new MedicaoService();
