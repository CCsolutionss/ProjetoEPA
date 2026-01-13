export interface Medicao {
  id: string;
  baseId: string;
  baseName?: string;
  data: string;
  valores: Record<string, any>;
  observacoes?: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Base {
  id: string;
  nome: string;
  descricao?: string;
  campos: CampoBase[];
  ativo: boolean;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface CampoBase {
  id: string;
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'boolean' | 'select';
  obrigatorio: boolean;
  opcoes?: string[]; // Para tipo 'select'
  ordem: number;
}

export interface CreateMedicaoRequest {
  baseId: string;
  data: string;
  valores: Record<string, any>;
  observacoes?: string;
}

export interface CreateBaseRequest {
  nome: string;
  descricao?: string;
  campos: Omit<CampoBase, 'id'>[];
  ativo: boolean;
}
