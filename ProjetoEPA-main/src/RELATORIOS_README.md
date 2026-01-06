# Tela de Relatórios - Sistema EPA

## 🎯 Resumo

A tela de relatórios foi **completamente refatorada** para trabalhar com tipos de amostras e parâmetros dinâmicos, assim como a tela de cadastro de medições.

## 📊 Fluxo de Uso

1. **Selecionar Base** (ex: PEPSICO-ITU)
2. **Selecionar Período** (datas ou atalhos: últimos 7/30 dias, este mês)
3. **Selecionar Tipo de Amostra** (ex: FLOTADOR, BIOREATOR 1A, etc.)
4. **Selecionar Parâmetro** (ex: pH, DQO, Turbidez) - carrega dinamicamente baseado na amostra

👉 Após selecionar todos os filtros, aparecem:

### Cards de Resumo (4 cards)
- **Valor Médio**: Média do parâmetro
- **Valor Mínimo**: Menor valor
- **Valor Máximo**: Maior valor
- **Quantidade**: Total de medições

### Gráficos (3 gráficos)
1. **Evolução Temporal** (linhas): Valor do parâmetro ao longo do tempo
2. **Média Diária** (colunas): Média do parâmetro por dia
3. **Distribuição por Status** (pizza): Aprovadas vs Reprovadas

### Log de Medições (tabela completa)
- Mostra **TODOS os parâmetros** do tipo de amostra selecionado
- Exemplo: FLOTADOR tem 16 parâmetros → tabela com 16 colunas de dados
- Colunas gerais: Data/Hora, Base, Tipo Amostra, Local, Status

## 🔑 Diferença Importante

- **Cards e Gráficos**: Focam APENAS no **parâmetro selecionado**
- **Tabela Log**: Mostra **TODOS os parâmetros** da **amostra selecionada**

**Exemplo:**
- Filtros: Base = PEPSICO | Período = Nov/24 | Amostra = FLOTADOR | Parâmetro = pH
- **Cards/Gráficos**: Estatísticas e evolução do **pH**
- **Tabela**: Todas as 16 colunas do **FLOTADOR** (pH, SS60, Temp, Turbidez, DQO, SST, SSV, SDT, N.Total, N.Amônia, Alcalinidade, Dureza, Fosfato, Nitrato, Ortofosfato, Sulfato)

## 📁 Arquivos Principais

```
/pages/
  ├── RelatoriosPage.tsx              ✅ Tela refatorada

/services/
  ├── relatorios.service.ts           ✅ Serviço com tipos e endpoints

/config/
  ├── amostras-eta.config.ts          ✅ Reutiliza 24 tipos de amostras

/
  ├── RELATORIOS_REFATORACAO.md       📖 Documentação completa
```

## 🔌 Backend

### Endpoints Necessários

1. **GET /api/reports/measurements** - Buscar medições filtradas
2. **GET /api/reports/statistics** - Estatísticas do parâmetro
3. **GET /api/reports/temporal** - Dados para gráfico de linhas
4. **GET /api/reports/aggregated** - Dados para gráfico de colunas
5. **GET /api/reports/status-distribution** - Dados para gráfico de pizza
6. **GET /api/reports/complete** - Relatório completo (otimizado)
7. **POST /api/reports/export/pdf** - Exportar PDF
8. **POST /api/reports/export/excel** - Exportar Excel

Veja detalhes em `/services/relatorios.service.ts` e `/RELATORIOS_REFATORACAO.md`

## ✅ Status

- ✅ Frontend: 100% implementado
- ⏳ Backend: Aguardando implementação dos endpoints
- ⏳ Exportação: Aguardando implementação de PDF/Excel

## 🎨 Screenshots

### Filtros Incompletos
```
┌─────────────────────────────────┐
│         📊                      │
│  Selecione os filtros para      │
│  visualizar os dados            │
└─────────────────────────────────┘
```

### Filtros Completos
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Média    │ │ Mínimo   │ │ Máximo   │ │ Qtd      │
│  7.15    │ │  6.80    │ │  7.50    │ │  25      │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌───────────────────┐ ┌───────────────────┐
│ Evolução Temporal │ │ Média Diária      │
│ (Linhas)          │ │ (Colunas)         │
└───────────────────┘ └───────────────────┘

┌───────────────────┐
│ Status (Pizza)    │
└───────────────────┘

┌────────────────────────────────────────────────┐
│ LOG DE MEDIÇÕES        25 registros            │
│ Data│Base│Tipo│pH│SS60│Temp│...│Local│Status  │
└────────────────────────────────────────────────┘
```

## 🚀 Como Testar

1. Acesse a tela de Relatórios
2. Selecione: Base → Período → Tipo de Amostra → Parâmetro
3. Visualize cards, gráficos e tabela completa
4. Teste atalhos de data (últimos 7/30 dias, este mês)
5. Botões de exportação estão prontos (aguardando backend)

## 📞 Documentação Completa

Consulte `/RELATORIOS_REFATORACAO.md` para:
- Estrutura de dados completa
- Especificação detalhada de endpoints
- Exemplos de requests/responses
- Lógica do backend
- Checklist de implementação
