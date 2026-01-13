# Refatoração da Tela de Relatórios - Sistema EPA

## 📋 Visão Geral

A tela de relatórios foi completamente refatorada para trabalhar com a estrutura dinâmica de tipos de amostras e parâmetros, assim como a tela de cadastro de medições.

## 🔄 O que mudou?

### ❌ Antes (Implementação Antiga)
- 4 indicadores fixos: Condutividade, Temperatura, pH, Turbidez
- Gráficos mostravam sempre os mesmos parâmetros
- Tabela com colunas fixas
- Não havia relação com tipos de amostras

### ✅ Agora (Nova Implementação)
- **Filtros dinâmicos**: Base → Período → Tipo de Amostra → Parâmetro
- **Indicadores calculados**: Média, Mínimo, Máximo, Quantidade (baseados no parâmetro selecionado)
- **Gráficos focados**: Mostram apenas o parâmetro selecionado
- **Tabela completa**: Exibe TODOS os parâmetros do tipo de amostra selecionado

## 🎯 Fluxo de Uso

### 1. Seleção de Filtros (Obrigatórios)

```
┌─────────────┐
│    BASE     │ → Selecionar a base/local
└─────────────┘
       ↓
┌─────────────┐
│   PERÍODO   │ → Selecionar datas (De / Até) ou usar atalhos
└─────────────┘
       ↓
┌─────────────┐
│TIPO AMOSTRA │ → Selecionar tipo (ex: FLOTADOR, BIOREATOR 1A, etc.)
└─────────────┘
       ↓
┌─────────────┐
│  PARÂMETRO  │ → Selecionar parâmetro específico (ex: pH, DQO, Turbidez)
└─────────────┘
       ↓
  📊 RELATÓRIO
```

### 2. Visualização Condicional

- **Filtros incompletos**: Exibe mensagem "Selecione os filtros para visualizar os dados"
- **Filtros completos**: Exibe cards, gráficos e tabela de log

## 📊 Componentes do Relatório

### 1. Cards de Estatísticas (4 cards)

| Card | Descrição | Ícone | Cor |
|------|-----------|-------|-----|
| **Valor Médio** | Média aritmética do parâmetro | Activity | Azul |
| **Valor Mínimo** | Menor valor registrado | TrendingDown | Verde |
| **Valor Máximo** | Maior valor registrado | TrendingUp | Laranja |
| **Quantidade** | Total de medições | BarChart3 | Roxo |

**Exemplo:**
- Se o usuário selecionar FLOTADOR → pH
- Os cards mostrarão: pH Médio, pH Mínimo, pH Máximo, Quantidade de medições de pH

### 2. Gráficos Analíticos (3 gráficos)

#### Gráfico 1: Evolução Temporal (Linhas)
- **Eixo X**: Data/Hora
- **Eixo Y**: Valor do parâmetro
- **Descrição**: Mostra como o parâmetro variou ao longo do tempo
- **Exemplo**: pH ao longo dos últimos 30 dias

#### Gráfico 2: Média Diária (Colunas)
- **Eixo X**: Dia (DD/MM)
- **Eixo Y**: Média do parâmetro
- **Descrição**: Média agregada por dia dentro do intervalo selecionado
- **Exemplo**: Média de DQO por dia no mês de novembro

#### Gráfico 3: Distribuição por Status (Pizza)
- **Fatias**: Aprovada / Reprovada
- **Valores**: Quantidade de medições por status
- **Descrição**: Proporção de medições aprovadas vs reprovadas

### 3. Tabela Log de Medições Completa

**Comportamento especial:**
- A tabela mostra **TODAS as colunas** de parâmetros do tipo de amostra selecionado
- Os **cards e gráficos** focam apenas no **parâmetro selecionado**

**Exemplo para FLOTADOR (16 parâmetros):**

| Data/Hora | Base | Tipo | pH | SS60 | Temp | Turbidez | DQO | SST | SSV | SDT | N.Total | N.Amônia | Alcal. | Dureza | Fosf.Tot | Nitrato | Ortofosfato | Sulfato | Local | Status |
|-----------|------|------|----|----|------|----------|-----|-----|-----|-----|---------|----------|--------|--------|----------|---------|-------------|---------|-------|--------|
| 01/12 10:00 | PEPSICO | Flotador | 7.2 | 120 | 25 | 0.5 | 450 | 180 | 150 | 300 | 35 | 12 | 200 | 150 | 8 | 5 | 3 | 50 | Setor 1 | ✅ |

**Colunas fixas:**
- Data/Hora
- Base
- Tipo de Amostra
- Local
- Status

**Colunas dinâmicas:**
- Todos os parâmetros da amostra selecionada (ex: para FLOTADOR, 16 colunas de parâmetros)

## 🔧 Configuração de Tipos de Amostras

A tela utiliza a mesma configuração da tela de cadastro:

**Arquivo**: `/config/amostras-eta.config.ts`

### 24 Tipos de Amostras Disponíveis:

1. **EFLUENTE_BRUTO** (5 parâmetros)
2. **EQUALIZACAO** (5 parâmetros)
3. **FLOTADOR** (16 parâmetros)
4. **BIOREATOR_1A** (7 parâmetros)
5. **BIOREATOR_1B** (7 parâmetros)
6. **BIOREATOR_2** (5 parâmetros)
7. **SAIDA_MBR** (16 parâmetros)
8. **FILTROS_CARTUCHO** (3 parâmetros)
9. **PERMEADO_UF_1** (4 parâmetros)
10. **PERMEADO_UF_2** (4 parâmetros)
11. **TANQUE_PERMEADO** (1 parâmetro)
12. **ENTRADA_OSMOSE_REVERSA** (17 parâmetros)
13. **OSMOSE_REVERSA_PERMEADO** (9 parâmetros)
14. **OSMOSE_REVERSA_CONCENTRADO** (5 parâmetros)
15. **UV** (5 parâmetros)
16. **FILTROS_CARVAO** (6 parâmetros)
17. **RESERVATORIO_REUSO** (7 parâmetros)
18. **ERA** (4 parâmetros)
19. **DESCARTE_LODO** (5 parâmetros)
20. **ENERGIA** (1 parâmetro)
21. **ENTRADA_OR_2** (5 parâmetros)
22. **PERMEADO_OR_2** (6 parâmetros)
23. **CONCENTRADO_OR_2** (5 parâmetros)
24. **CALHA_SAIDA** (4 parâmetros)

## 🔌 Integração com Backend

### Estrutura de Dados

#### 1. Filtros de Busca
```typescript
interface FiltrosRelatorio {
  baseId: string;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string; // YYYY-MM-DD
  tipoAmostra: string; // Ex: 'FLOTADOR'
  parametro?: string; // Ex: 'ph' (opcional)
}
```

#### 2. Medição para Relatório
```typescript
interface MedicaoRelatorio {
  id: string;
  dataHora: string;
  baseId: string;
  baseNome: string;
  tipoAmostra: string;
  valores: Record<string, number | string>; // Todos os parâmetros
  local: string;
  status: 'Aprovada' | 'Reprovada' | 'Pendente';
  operador?: string;
  observacoes?: string;
}
```

#### 3. Estatísticas do Parâmetro
```typescript
interface EstatisticasParametro {
  parametroId: string;
  parametroLabel: string;
  media: number;
  mediana: number;
  minimo: number;
  maximo: number;
  desvioPadrao: number;
  quantidade: number;
  unidade?: string;
}
```

### Endpoints Necessários

#### 1. Buscar Medições Filtradas
```
GET /api/reports/measurements
Query Params: baseId, dataInicio, dataFim, tipoAmostra, parametro (opcional)
Headers: { Authorization: Bearer ${token} }

Response: {
  medicoes: MedicaoRelatorio[],
  total: number
}
```

**Lógica do Backend:**
- Buscar todas as medições que correspondem aos filtros
- Se `parametro` for informado, incluir apenas medições que tenham esse parâmetro
- Retornar TODOS os valores de parâmetros da amostra, não apenas o selecionado
- Ordenar por data/hora (mais recente primeiro)

**Exemplo de Request:**
```
GET /api/reports/measurements?baseId=1&dataInicio=2024-11-01&dataFim=2024-12-01&tipoAmostra=FLOTADOR&parametro=ph
```

**Exemplo de Response:**
```json
{
  "medicoes": [
    {
      "id": "abc123",
      "dataHora": "2024-11-15T10:30:00",
      "baseId": "1",
      "baseNome": "PEPSICO-ITU",
      "tipoAmostra": "FLOTADOR",
      "valores": {
        "ph": 7.2,
        "ss60": 120,
        "temperatura": 25.5,
        "turbidez": 0.5,
        "dqo": 450,
        "sst": 180,
        "ssv": 150,
        "sdt": 300,
        "nitrogenio_total": 35,
        "nitrogenio_amonia": 12,
        "alcalinidade": 200,
        "dureza": 150,
        "fosfato_total": 8,
        "nitrato": 5,
        "ortofosfato": 3,
        "sulfato": 50
      },
      "local": "Setor 1",
      "status": "Aprovada",
      "operador": "João Silva"
    }
  ],
  "total": 1
}
```

#### 2. Buscar Estatísticas de um Parâmetro
```
GET /api/reports/statistics
Query Params: baseId, dataInicio, dataFim, tipoAmostra, parametro
Headers: { Authorization: Bearer ${token} }

Response: EstatisticasParametro
```

**Lógica do Backend:**
- Calcular média, mediana, mínimo, máximo, desvio padrão
- Contar quantidade de medições
- Retornar estatísticas do parâmetro específico

**Exemplo de Response:**
```json
{
  "parametroId": "ph",
  "parametroLabel": "pH",
  "media": 7.15,
  "mediana": 7.2,
  "minimo": 6.8,
  "maximo": 7.5,
  "desvioPadrao": 0.18,
  "quantidade": 25,
  "unidade": "(0-14)"
}
```

#### 3. Buscar Dados para Gráfico Temporal
```
GET /api/reports/temporal
Query Params: baseId, dataInicio, dataFim, tipoAmostra, parametro
Headers: { Authorization: Bearer ${token} }

Response: DadosGraficoTemporal[]
```

**Lógica do Backend:**
- Retornar série temporal do parâmetro
- Ordenar por data/hora crescente
- Incluir apenas medições com valor para o parâmetro especificado

**Exemplo de Response:**
```json
[
  { "data": "01/11/2024 10:00", "valor": 7.2 },
  { "data": "02/11/2024 10:00", "valor": 7.1 },
  { "data": "03/11/2024 10:00", "valor": 7.3 }
]
```

#### 4. Buscar Dados para Gráfico Agregado
```
GET /api/reports/aggregated
Query Params: baseId, dataInicio, dataFim, tipoAmostra, parametro, agregacao (dia|semana|mes)
Headers: { Authorization: Bearer ${token} }

Response: DadosGraficoAgregado[]
```

**Lógica do Backend:**
- Agrupar medições por período (dia, semana ou mês)
- Calcular média, mínimo e máximo para cada período
- Retornar dados agregados

**Exemplo de Response:**
```json
[
  { "periodo": "01/11", "media": 7.15, "minimo": 6.9, "maximo": 7.4 },
  { "periodo": "02/11", "media": 7.22, "minimo": 7.0, "maximo": 7.5 }
]
```

#### 5. Buscar Distribuição por Status
```
GET /api/reports/status-distribution
Query Params: baseId, dataInicio, dataFim, tipoAmostra, parametro (opcional)
Headers: { Authorization: Bearer ${token} }

Response: DistribuicaoStatus
```

**Lógica do Backend:**
- Contar medições por status (Aprovada, Reprovada, Pendente)
- Se parâmetro informado, considerar apenas medições com esse parâmetro

**Exemplo de Response:**
```json
{
  "aprovadas": 45,
  "reprovadas": 3,
  "pendentes": 2,
  "total": 50
}
```

#### 6. Endpoint Otimizado: Relatório Completo
```
GET /api/reports/complete
Query Params: baseId, dataInicio, dataFim, tipoAmostra, parametro
Headers: { Authorization: Bearer ${token} }

Response: RelatorioCompleto
```

**Vantagem:**
- Retorna todos os dados necessários em uma única chamada
- Reduz número de requests HTTP
- Melhor performance

**Exemplo de Response:**
```json
{
  "filtros": {
    "baseId": "1",
    "dataInicio": "2024-11-01",
    "dataFim": "2024-12-01",
    "tipoAmostra": "FLOTADOR",
    "parametro": "ph"
  },
  "medicoes": [...],
  "estatisticas": {...},
  "graficoTemporal": [...],
  "graficoAgregado": [...],
  "distribuicaoStatus": {...},
  "geradoEm": "2024-12-01T15:30:00",
  "geradoPor": "João Silva"
}
```

#### 7. Exportar para PDF
```
POST /api/reports/export/pdf
Body: FiltrosRelatorio
Headers: { Authorization: Bearer ${token} }

Response: Blob (arquivo PDF)
```

#### 8. Exportar para Excel
```
POST /api/reports/export/excel
Body: FiltrosRelatorio
Headers: { Authorization: Bearer ${token} }

Response: Blob (arquivo Excel)
```

## 🎨 Interface do Usuário

### Layout da Tela

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (Logo EPA, Usuário)                              │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  [← Voltar] Relatórios e Análises                        │
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   Base *    │ │     De *    │ │    Até *    │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                           │
│  ┌──────────────────────┐ ┌──────────────────────┐     │
│  │  Tipo de Amostra *   │ │    Parâmetro *       │     │
│  └──────────────────────┘ └──────────────────────┘     │
│                                                           │
│  [Últimos 7 dias] [Últimos 30 dias] [Este mês]          │
│                      [Exportar PDF] [Exportar Excel]     │
└──────────────────────────────────────────────────────────┘

┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ 📊 Média  │ │ 📉 Mínimo │ │ 📈 Máximo │ │ 🔢 Qtd    │
│   7.15    │ │   6.80    │ │   7.50    │ │    25     │
└───────────┘ └───────────┘ └───────────┘ └───────────┘

┌─────────────────────────┐ ┌─────────────────────────┐
│  Evolução Temporal      │ │  Média Diária           │
│  (Gráfico de Linhas)    │ │  (Gráfico de Colunas)   │
└─────────────────────────┘ └─────────────────────────┘

┌─────────────────────────┐
│  Distribuição Status    │
│  (Gráfico de Pizza)     │
└─────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  LOG DE MEDIÇÕES COMPLETO                    25 registros│
│                                                           │
│  Data/Hora│Base│Tipo│pH│SS60│Temp│...│Local│Status      │
│  ───────────────────────────────────────────────────────│
│  01/12... │PEPC│FLOT│7.2│120 │25  │...│Set1 │✅ Aprovada│
└──────────────────────────────────────────────────────────┘
```

### Estados da Interface

#### Estado 1: Filtros Incompletos
```
┌──────────────────────────────────────┐
│                                      │
│            📊                        │
│  Selecione os filtros para          │
│  visualizar os dados                 │
│                                      │
│  Preencha: Base, Período,            │
│  Tipo de Amostra e Parâmetro        │
│                                      │
└──────────────────────────────────────┘
```

#### Estado 2: Filtros Completos
- Mostra cards de estatísticas
- Mostra gráficos
- Mostra tabela de log completa

### Validações

- ✅ Base é obrigatória
- ✅ Data Início é obrigatória
- ✅ Data Fim é obrigatória
- ✅ Tipo de Amostra é obrigatório
- ✅ Parâmetro é obrigatório
- ✅ Data Fim não pode ser anterior à Data Início
- ✅ Datas não podem ser futuras
- ✅ Dropdown de Parâmetro desabilitado até selecionar Tipo de Amostra
- ✅ Botões de exportação desabilitados até todos filtros estarem completos

## 📝 Exemplo Prático de Uso

### Cenário: Analisar pH do Flotador

**Passo 1: Selecionar Base**
```
Base: PEPSICO-ITU
```

**Passo 2: Selecionar Período**
```
De: 01/11/2024
Até: 01/12/2024
(ou usar atalho: "Últimos 30 dias")
```

**Passo 3: Selecionar Tipo de Amostra**
```
Tipo de Amostra: Flotador
```

**Passo 4: Selecionar Parâmetro**
```
Parâmetro: pH (0-14)
```

**Resultado:**
- Cards mostram: pH Médio 7.15, pH Mínimo 6.80, pH Máximo 7.50, 25 medições
- Gráfico de linhas: evolução do pH ao longo de 30 dias
- Gráfico de colunas: média de pH por dia
- Gráfico de pizza: 23 aprovadas, 2 reprovadas
- Tabela: 25 linhas com TODAS as 16 colunas do FLOTADOR (pH, SS60, Temperatura, Turbidez, DQO, SST, SSV, SDT, Nitrogênio Total, etc.)

## ✅ Checklist de Implementação

### Frontend (Completo)
- ✅ Tela de relatórios refatorada
- ✅ Filtros dinâmicos (Base, Período, Tipo de Amostra, Parâmetro)
- ✅ Cards de estatísticas
- ✅ 3 gráficos (Linhas, Colunas, Pizza)
- ✅ Tabela de log com colunas dinâmicas
- ✅ Validações de filtros
- ✅ Estados de loading
- ✅ Toast notifications
- ✅ Botões de exportação (UI pronta)
- ✅ Design responsivo
- ✅ Cores oficiais EPA

### Backend (Pendente)
- ⏳ Endpoint: GET /api/reports/measurements
- ⏳ Endpoint: GET /api/reports/statistics
- ⏳ Endpoint: GET /api/reports/temporal
- ⏳ Endpoint: GET /api/reports/aggregated
- ⏳ Endpoint: GET /api/reports/status-distribution
- ⏳ Endpoint: GET /api/reports/complete (otimizado)
- ⏳ Endpoint: POST /api/reports/export/pdf
- ⏳ Endpoint: POST /api/reports/export/excel

### Integração
- ⏳ Conectar frontend aos endpoints reais
- ⏳ Implementar download de PDF
- ⏳ Implementar download de Excel
- ⏳ Implementar cache de dados
- ⏳ Implementar paginação (se necessário)

## 🚀 Próximos Passos

1. **Backend**: Implementar endpoints de relatórios
2. **Frontend**: Integrar chamadas reais (substituir mock)
3. **Exportação**: Implementar geração de PDF e Excel no backend
4. **Performance**: Otimizar queries do banco de dados
5. **Cache**: Implementar cache para relatórios frequentes
6. **Paginação**: Adicionar paginação na tabela se houver muitos dados

## 📞 Suporte

Para dúvidas sobre a implementação:
- Consulte `/services/relatorios.service.ts` para estrutura de dados
- Consulte `/config/amostras-eta.config.ts` para tipos de amostras
- Consulte `/types/medicao-eta.ts` para tipos TypeScript
