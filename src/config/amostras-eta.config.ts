import { TipoAmostraConfig } from '../types/medicao-eta';

// Configuração de todas as amostras disponíveis para medição de Estação de Tratamento de Efluentes
export const AMOSTRAS_ETA_CONFIG: TipoAmostraConfig[] = [
  {
    id: 'EFLUENTE_BRUTO',
    nome: 'Efluente Bruto',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'ss60', label: 'SS60', tipo: 'numero', unidade: 'mg/L' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'EQUALIZACAO',
    nome: 'Equalização',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'ss60', label: 'SS60', tipo: 'numero', unidade: 'mg/L' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'FLOTADOR',
    nome: 'Flotador',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'ss60', label: 'SS60', tipo: 'numero', unidade: 'mg/L' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ssv', label: 'SSV', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sdt', label: 'SDT', tipo: 'numero', unidade: 'mg/L' },
      { id: 'nitrogenio_total', label: 'Nitrogênio Total', tipo: 'numero', unidade: 'mg/L' },
      { id: 'nitrogenio_amonia', label: 'Nitrogênio Amônia', tipo: 'numero', unidade: 'mg/L' },
      { id: 'alcalinidade', label: 'Alcalinidade', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dureza', label: 'Dureza', tipo: 'numero', unidade: 'mg/L' },
      { id: 'fosfato_total', label: 'Fosfato Total', tipo: 'numero', unidade: 'mg/L' },
      { id: 'nitrato', label: 'Nitrato', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ortofosfato', label: 'Ortofosfato', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sulfato', label: 'Sulfato', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'BIOREATOR_1A',
    nome: 'Bioreator 1A',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'ss30', label: 'SS30', tipo: 'numero', unidade: 'mg/L' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'od', label: 'OD', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ssv', label: 'SSV', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'BIOREATOR_1B',
    nome: 'Bioreator 1B',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'ss30', label: 'SS30', tipo: 'numero', unidade: 'mg/L' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'od', label: 'OD', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ssv', label: 'SSV', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'BIOREATOR_2',
    nome: 'Bioreator 2',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'od', label: 'OD', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ssv', label: 'SSV', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'SAIDA_MBR',
    nome: 'Saída MBR',
    campos: [
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sdt', label: 'SDT', tipo: 'numero', unidade: 'mg/L' },
      { id: 'nitrogenio_total', label: 'Nitrogênio Total', tipo: 'numero', unidade: 'mg/L' },
      { id: 'nitrogenio_amoniacal', label: 'Nitrogênio Amoniacal', tipo: 'numero', unidade: 'mg/L' },
      { id: 'fosforo_livre', label: 'Fósforo Livre', tipo: 'numero', unidade: 'mg/L' },
      { id: 'alcalinidade', label: 'Alcalinidade', tipo: 'numero', unidade: 'mg/L' },
      { id: 'toc', label: 'TOC', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dureza', label: 'Dureza', tipo: 'numero', unidade: 'mg/L' },
      { id: 'fosfato_total', label: 'Fosfato Total', tipo: 'numero', unidade: 'mg/L' },
      { id: 'nitrato', label: 'Nitrato', tipo: 'numero', unidade: 'mg/L' },
      { id: 'cloro', label: 'Cloro', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sulfato', label: 'Sulfato', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ortofosfato', label: 'Ortofosfato', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sdi', label: 'SDI', tipo: 'numero' },
      { id: 'bacterias_heterotroficas', label: 'Bactérias Heterotróficas', tipo: 'numero', unidade: 'UFC/mL' },
    ],
  },
  {
    id: 'FILTROS_CARTUCHO',
    nome: 'Filtros de Cartucho',
    campos: [
      { id: 'fc1_sdi', label: 'FC1 SDI', tipo: 'numero' },
      { id: 'fc2_sdi', label: 'FC2 SDI', tipo: 'numero' },
      { id: 'fc3_sdi', label: 'FC3 SDI', tipo: 'numero' },
    ],
  },
  {
    id: 'PERMEADO_UF_1',
    nome: 'Permeado UF 1',
    campos: [
      { id: 'ptm', label: 'PTM', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_bomba', label: 'Pressão Bomba', tipo: 'numero', unidade: 'bar' },
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
    ],
  },
  {
    id: 'PERMEADO_UF_2',
    nome: 'Permeado UF 2',
    campos: [
      { id: 'ptm', label: 'PTM', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_bomba', label: 'Pressão Bomba', tipo: 'numero', unidade: 'bar' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
    ],
  },
  {
    id: 'TANQUE_PERMEADO',
    nome: 'Tanque Permeado',
    campos: [
      { id: 'cloro_residual_livre', label: 'Cloro Residual Livre', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'ENTRADA_OSMOSE_REVERSA',
    nome: 'Entrada Osmose Reversa',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'orp', label: 'ORP', tipo: 'numero', unidade: 'mV' },
      { id: 'pressao_pos_filtros', label: 'Pressão Pós-Filtros', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_entrada_or', label: 'Pressão Entrada OR', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_1_estagio', label: 'Pressão 1° Estágio', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_2_estagio', label: 'Pressão 2° Estágio', tipo: 'numero', unidade: 'bar' },
      { id: 'cloro', label: 'Cloro', tipo: 'numero', unidade: 'mg/L' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'condutividade', label: 'Condutividade', tipo: 'numero', unidade: 'µS/cm' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'ferro', label: 'Ferro', tipo: 'numero', unidade: 'mg/L' },
      { id: 'manganes', label: 'Manganês', tipo: 'numero', unidade: 'mg/L' },
      { id: 'aluminio', label: 'Alumínio', tipo: 'numero', unidade: 'mg/L' },
      { id: 'toc', label: 'TOC', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sdi', label: 'SDI', tipo: 'numero' },
      { id: 'dureza', label: 'Dureza', tipo: 'numero', unidade: 'mg/L' },
      { id: 'silica', label: 'Sílica', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'OSMOSE_REVERSA_PERMEADO',
    nome: 'Osmose Reversa Permeado',
    campos: [
      { id: 'pressao', label: 'Pressão', tipo: 'numero', unidade: 'bar' },
      { id: 'vazao_permeado', label: 'Vazão Permeado', tipo: 'numero', unidade: 'm³/h' },
      { id: 'percentual_recuperacao', label: 'Percentual de Recuperação', tipo: 'numero', unidade: '%' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'condutividade', label: 'Condutividade', tipo: 'numero', unidade: 'µS/cm' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dureza', label: 'Dureza', tipo: 'numero', unidade: 'mg/L' },
      { id: 'silica', label: 'Sílica', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'OSMOSE_REVERSA_CONCENTRADO',
    nome: 'Osmose Reversa Concentrado',
    campos: [
      { id: 'pressao', label: 'Pressão', tipo: 'numero', unidade: 'bar' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'condutividade', label: 'Condutividade', tipo: 'numero', unidade: 'µS/cm' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'UV',
    nome: 'UV',
    campos: [
      { id: 'pre_uv_coliformes_totais', label: 'Pré-UV Coliformes Totais', tipo: 'numero', unidade: 'NMP/100mL' },
      { id: 'pre_uv_e_coli', label: 'Pré-UV E. coli', tipo: 'numero', unidade: 'NMP/100mL' },
      { id: 'transmitancia', label: 'Transmitância', tipo: 'numero', unidade: '%' },
      { id: 'pos_uv_coliformes_totais', label: 'Pós-UV Coliformes Totais', tipo: 'numero', unidade: 'NMP/100mL' },
      { id: 'pos_uv_e_coli', label: 'Pós-UV E. coli', tipo: 'numero', unidade: 'NMP/100mL' },
    ],
  },
  {
    id: 'FILTROS_CARVAO',
    nome: 'Filtros de Carvão',
    campos: [
      { id: 'pressao_vaso_1', label: 'Pressão do vaso 1', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_vaso_2', label: 'Pressão do vaso 2', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_vaso_3', label: 'Pressão do vaso 3', tipo: 'numero', unidade: 'bar' },
      { id: 'cloro_saida', label: 'Cloro Saída', tipo: 'numero', unidade: 'mg/L' },
      { id: 'pos_fc_coliformes_totais', label: 'Pós-FC Coliformes Totais', tipo: 'numero', unidade: 'NMP/100mL' },
      { id: 'pos_fc_e_coli', label: 'Pós-FC E. coli', tipo: 'numero', unidade: 'NMP/100mL' },
    ],
  },
  {
    id: 'RESERVATORIO_REUSO',
    nome: 'Reservatório Reuso',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'nivel_reservatorio', label: 'Nível do Reservatório', tipo: 'numero', unidade: '%' },
      { id: 'cloro_entrada', label: 'Cloro Entrada', tipo: 'numero', unidade: 'mg/L' },
      { id: 'cloro_saida', label: 'Cloro Saída', tipo: 'numero', unidade: 'mg/L' },
      { id: 'bacterias_heterotroficas', label: 'Bactérias Heterotróficas', tipo: 'numero', unidade: 'UFC/mL' },
      { id: 'coliformes_totais', label: 'Coliformes Totais', tipo: 'numero', unidade: 'NMP/100mL' },
      { id: 'e_coli', label: 'E. Coli', tipo: 'numero', unidade: 'NMP/100mL' },
    ],
  },
  {
    id: 'ERA',
    nome: 'ERA',
    campos: [
      { id: 'recuperacao_amido', label: 'Recuperação de Amido', tipo: 'numero', unidade: '%' },
      { id: 'teor_umidade', label: 'Teor de Umidade', tipo: 'numero', unidade: '%' },
      { id: 'rs60_clarificado', label: 'RS60 Clarificado', tipo: 'numero', unidade: 'mg/L' },
      { id: 'sst', label: 'SST', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
  {
    id: 'DESCARTE_LODO',
    nome: 'Descarte de Lodo',
    campos: [
      { id: 'sst_clarificado', label: 'SST Clarificado', tipo: 'numero', unidade: 'mg/L' },
      { id: 'consistencia_borra', label: 'Consistência da Borra', tipo: 'numero', unidade: '%' },
      { id: 'consistencia_cacamba', label: 'Consistência da Caçamba', tipo: 'numero', unidade: '%' },
      { id: 'umidade_lodo', label: 'Umidade do Lodo', tipo: 'numero', unidade: '%' },
      { id: 'vazao_descarte_lodo', label: 'Vazão Descarte de Lodo', tipo: 'numero', unidade: 'm³/h' },
    ],
  },
  {
    id: 'ENERGIA',
    nome: 'Energia',
    campos: [
      { id: 'consumo', label: 'Consumo', tipo: 'numero', unidade: 'kWh' },
    ],
  },
  {
    id: 'ENTRADA_OR_2',
    nome: 'Entrada OR 2',
    campos: [
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'pressao_pre_filtro_cart', label: 'Pressão Pré Filtro Cart.', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_pos_filtro_cart', label: 'Pressão Pós Filtro Cart.', tipo: 'numero', unidade: 'bar' },
      { id: 'pressao_entrada', label: 'Pressão Entrada', tipo: 'numero', unidade: 'bar' },
      { id: 'perda_carga_saida', label: 'Perda de Carga de Saída', tipo: 'numero', unidade: 'bar' },
    ],
  },
  {
    id: 'PERMEADO_OR_2',
    nome: 'Permeado OR 2',
    campos: [
      { id: 'pressao_osmose_permeado', label: 'Pressão Osmose Permeado', tipo: 'numero', unidade: 'bar' },
      { id: 'vazao_permeado', label: 'Vazão Permeado', tipo: 'numero', unidade: 'm³/h' },
      { id: 'percentual_recuperacao', label: 'Percentual de Recuperação', tipo: 'numero', unidade: '%' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'condutividade', label: 'Condutividade', tipo: 'numero', unidade: 'µS/cm' },
    ],
  },
  {
    id: 'CONCENTRADO_OR_2',
    nome: 'Concentrado OR 2',
    campos: [
      { id: 'pressao_osmose_concentrado', label: 'Pressão Osmose Concentrado', tipo: 'numero', unidade: 'bar' },
      { id: 'vazao_concentrado', label: 'Vazão Concentrado', tipo: 'numero', unidade: 'm³/h' },
      { id: 'turbidez', label: 'Turbidez', tipo: 'numero', unidade: 'NTU' },
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'condutividade', label: 'Condutividade', tipo: 'numero', unidade: 'µS/cm' },
    ],
  },
  {
    id: 'CALHA_SAIDA',
    nome: 'Calha de Saída',
    campos: [
      { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
      { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
      { id: 'ss60', label: 'SS60', tipo: 'numero', unidade: 'mg/L' },
      { id: 'dqo', label: 'DQO', tipo: 'numero', unidade: 'mg/L' },
    ],
  },
];

// Helper para obter configuração de amostra por ID
export const getAmostraConfig = (tipoAmostra: string) => {
  return AMOSTRAS_ETA_CONFIG.find((a) => a.id === tipoAmostra);
};

// Helper para obter lista de opções para Select
export const getAmostrasOptions = () => {
  return AMOSTRAS_ETA_CONFIG.map((a) => ({
    value: a.id,
    label: a.nome,
  }));
};
