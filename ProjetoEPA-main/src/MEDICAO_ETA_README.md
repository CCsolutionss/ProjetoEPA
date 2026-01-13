# Sistema de Medição ETA - Estação de Tratamento de Efluentes

## 📋 Visão Geral

O sistema de medição foi atualizado para suportar cadastro dinâmico de medições em estações de tratamento de efluentes. A tela de "Nova Medição" agora permite:
1. Selecionar uma base
2. Selecionar o tipo de amostra 
3. Preencher automaticamente os campos específicos daquele tipo

## 🎯 Funcionalidades Principais

### ✅ Fluxo de Cadastro de Medição

1. **Selecionar Base** - Escolha a base/local da medição (obrigatório)
2. **Selecionar Tipo de Amostra** - Lista com 24 tipos disponíveis (obrigatório)
3. **Preencher Campos** - Campos aparecem dinamicamente conforme o tipo selecionado
4. **Adicionar Observações** - Campo opcional para anotações
5. **Salvar** - Rascunho ou enviar medição completa

### ✅ Tipos de Amostras Disponíveis (24 tipos)

1. **Efluente Bruto** - pH, SS60, Temperatura, DQO, SST
2. **Equalização** - pH, SS60, Temperatura, DQO, SST
3. **Flotador** - 16 campos incluindo pH, SS60, Temperatura, Turbidez, DQO, SST, SSV, SDT, Nitrogênio Total, etc.
4. **Bioreator 1A** - pH, SS30, Temperatura, OD, DQO, SST, SSV
5. **Bioreator 1B** - pH, SS30, Temperatura, OD, DQO, SST, SSV
6. **Bioreator 2** - pH, OD, DQO, SST, SSV
7. **Saída MBR** - 16 campos incluindo DQO, SST, SDT, Nitrogênio Total, TOC, SDI, etc.
8. **Filtros de Cartucho** - FC1 SDI, FC2 SDI, FC3 SDI
9. **Permeado UF 1** - PTM, Pressão Bomba, pH, Turbidez
10. **Permeado UF 2** - PTM, Pressão Bomba, Turbidez, pH
11. **Tanque Permeado** - Cloro Residual Livre
12. **Entrada Osmose Reversa** - 17 campos incluindo pH, ORP, pressões, cloro, temperatura, etc.
13. **Osmose Reversa Permeado** - 9 campos incluindo pressão, vazão, turbidez, condutividade, etc.
14. **Osmose Reversa Concentrado** - Pressão, Turbidez, Temperatura, Condutividade, DQO
15. **UV** - Coliformes pré e pós UV, E. coli, Transmitância
16. **Filtros de Carvão** - Pressões dos vasos, Cloro, Coliformes, E. coli
17. **Reservatório Reuso** - pH, Nível, Cloro, Bactérias, Coliformes, E. Coli
18. **ERA** - Recuperação de Amido, Umidade, RS60, SST
19. **Descarte de Lodo** - SST, Consistências, Umidade, Vazão
20. **Energia** - Consumo
21. **Entrada OR 2** - pH, Pressões
22. **Permeado OR 2** - Pressão, Vazão, Recuperação, Turbidez, Temperatura, Condutividade
23. **Concentrado OR 2** - Pressão, Vazão, Turbidez, Temperatura, Condutividade
24. **Calha de Saída** - Temperatura, pH, SS60, DQO

### ✅ Recursos Implementados

- ✅ Seleção dinâmica de campos baseada no tipo de amostra
- ✅ Validação completa de formulário
- ✅ Data/hora com atualização automática
- ✅ Campo de observações opcional
- ✅ Identificação automática do operador
- ✅ Botões "Salvar rascunho" e "Enviar medição"
- ✅ Loading states e feedback visual
- ✅ Toast notifications
- ✅ Design responsivo
- ✅ Cores oficiais EPA

## 🚀 Como Usar

### Passo 1: Acessar a Tela
1. Faça login no sistema EPA
2. Na tela principal (HomePage), clique em **"Nova medição"**

### Passo 2: Selecionar Base
1. No campo "Selecione a base", escolha a base desejada
2. Este campo é obrigatório para continuar

### Passo 3: Selecionar Tipo de Amostra
1. No campo "Tipo de Amostra", clique para abrir a lista
2. Selecione o tipo desejado (ex: "Efluente Bruto")
3. Os campos específicos aparecerão automaticamente à esquerda

### Passo 4: Preencher Dados
1. Preencha os campos de medição desejados
2. A data/hora é atualizada automaticamente a cada segundo
3. Adicione observações se necessário (campo opcional)

### Passo 5: Salvar
- Clique em **"Salvar rascunho"** para salvar e continuar depois
- Clique em **"Enviar medição"** para finalizar o envio

## 📁 Estrutura de Arquivos

```
/types/
  ├── medicao-eta.ts              # Tipos TypeScript para medições ETA

/config/
  ├── amostras-eta.config.ts      # Configuração de todas as amostras e campos

/pages/
  ├── NovaMedicaoPage.tsx         # Tela principal de cadastro (MODIFICADA)

/services/
  ├── medicao-eta.service.ts      # Serviço para integração com backend
```

## 🔧 Configuração de Amostras

Para adicionar, editar ou remover tipos de amostras, edite o arquivo `/config/amostras-eta.config.ts`.

### Estrutura de uma Amostra

```typescript
{
  id: 'NOME_TIPO',                 // ID único (em UPPER_SNAKE_CASE)
  nome: 'Nome Exibido',            // Nome para exibição
  campos: [                         // Array de campos
    {
      id: 'campo_id',               // ID do campo (snake_case)
      label: 'Nome do Campo',       // Label para exibição
      tipo: 'numero' | 'texto',     // Tipo do campo
      unidade: 'mg/L'               // Unidade (opcional)
    }
  ]
}
```

### Exemplo - Adicionar Nova Amostra

```typescript
{
  id: 'NOVA_AMOSTRA',
  nome: 'Nova Amostra',
  campos: [
    { id: 'ph', label: 'pH', tipo: 'numero', unidade: '(0-14)' },
    { id: 'temperatura', label: 'Temperatura', tipo: 'numero', unidade: '°C' },
  ],
}
```

## 🔌 Integração com Backend

### Formato dos Dados Enviados

```json
{
  "baseId": "1",
  "tipoAmostra": "EFLUENTE_BRUTO",
  "dataHora": "01/12/2024 - 14:30",
  "valores": {
    "ph": 7.2,
    "ss60": 120,
    "temperatura": 25.5,
    "dqo": 450,
    "sst": 180
  },
  "observacoes": "Medição normal",
  "operador": "João Silva"
}
```

### Endpoints Necessários

#### 1. Enviar Medição
```
POST /api/medicoes
Headers: { Authorization: Bearer ${token} }
Body: {
  baseId: string,
  tipoAmostra: string,
  dataHora: string,
  valores: Record<string, any>,
  observacoes?: string,
  operador?: string
}
Response: MedicaoResponse
```

#### 2. Salvar Rascunho
```
POST /api/medicoes/rascunho
Headers: { Authorization: Bearer ${token} }
Body: {
  baseId: string,
  tipoAmostra: string,
  dataHora: string,
  valores: Record<string, any>,
  observacoes?: string
}
Response: MedicaoResponse
```

## 🎨 Interface do Usuário

### Layout
- **Área Principal (Esquerda)**: Seleção de tipo de amostra + Campos dinâmicos + Observações
- **Sidebar (Direita)**: Seleção de base + Informações do operador + Data/hora automática + Dica

### Validações
- ✅ Base é obrigatória
- ✅ Tipo de amostra é obrigatório
- ✅ Pelo menos 1 campo de medição deve ser preenchido
- ✅ Feedback visual para campos obrigatórios

### Estados
- Campo de tipo de amostra desabilitado até selecionar base
- Área de campos mostra placeholder quando nenhum tipo selecionado
- Botões desabilitados durante carregamento
- Animação de pulsação no relógio (data/hora)

## ✅ Status de Implementação

- ✅ Tipos TypeScript definidos
- ✅ Configuração de todas as 24 amostras
- ✅ Tela de cadastro modificada e funcional
- ✅ Validação de formulário completa
- ✅ Campos dinâmicos por tipo de amostra
- ✅ Integração com seleção de base existente
- ✅ Data/hora automática mantida
- ✅ Serviço preparado para backend
- ✅ Toast notifications
- ✅ Loading states
- ⏳ Integração com backend (aguardando endpoints)

## 📝 Diferenças da Implementação Anterior

Esta implementação substituiu a abordagem anterior de "adicionar amostras manualmente" por:
- ✅ Seleção de tipo predefinido
- ✅ Campos automáticos baseados no tipo
- ✅ Melhor validação
- ✅ Mais consistência nos dados
- ✅ Facilita integração com backend

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação técnica completa em:
- `/services/BACKEND_INTEGRATION.md`
- `/services/README.md`
- `/INTEGRATION_SUMMARY.md`
