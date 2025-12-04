// Tipos específicos para medições de Estação de Tratamento de Efluentes

export type TipoAmostra =
  | 'EFLUENTE_BRUTO'
  | 'EQUALIZACAO'
  | 'FLOTADOR'
  | 'BIOREATOR_1A'
  | 'BIOREATOR_1B'
  | 'BIOREATOR_2'
  | 'SAIDA_MBR'
  | 'FILTROS_CARTUCHO'
  | 'PERMEADO_UF_1'
  | 'PERMEADO_UF_2'
  | 'TANQUE_PERMEADO'
  | 'ENTRADA_OSMOSE_REVERSA'
  | 'OSMOSE_REVERSA_PERMEADO'
  | 'OSMOSE_REVERSA_CONCENTRADO'
  | 'UV'
  | 'FILTROS_CARVAO'
  | 'RESERVATORIO_REUSO'
  | 'ERA'
  | 'DESCARTE_LODO'
  | 'ENERGIA'
  | 'ENTRADA_OR_2'
  | 'PERMEADO_OR_2'
  | 'CONCENTRADO_OR_2'
  | 'CALHA_SAIDA';

export interface CampoMedicaoETA {
  id: string;
  label: string;
  tipo: 'numero' | 'texto';
  unidade?: string;
  placeholder?: string;
}

export interface TipoAmostraConfig {
  id: TipoAmostra;
  nome: string;
  campos: CampoMedicaoETA[];
}

export interface MedicaoETARequest {
  tipoAmostra: TipoAmostra;
  dataHora: string;
  valores: Record<string, string | number>;
  observacoes?: string;
  operador?: string;
}

export interface MedicaoETAResponse extends MedicaoETARequest {
  id: string;
  criadoEm: string;
  atualizadoEm?: string;
}
