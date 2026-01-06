# EPA Mobile - Aplicativo React Native

Aplicativo mobile do sistema EPA (Portal de Medições) desenvolvido com React Native e Expo.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para React Native
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **React Native Paper** - Componentes UI
- **AsyncStorage** - Armazenamento local
- **Expo Status Bar** - Controle da barra de status

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go App (para testar no dispositivo físico)

## 🔧 Instalação

1. Navegue até a pasta mobile:
```bash
cd mobile
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

## 🎮 Como Executar

### No emulador/simulador

```bash
# Android
npm run android

# iOS (apenas em Mac)
npm run ios
```

### No dispositivo físico

1. Instale o app Expo Go:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Inicie o servidor:
```bash
npm start
```

3. Escaneie o QR Code com o Expo Go

## 📱 Funcionalidades

### ✅ Implementadas

- **Login** - Autenticação de usuários
- **Home** - Dashboard com cards de navegação
- **Nova Medição** - Cadastro de novas medições
- **Relatórios** - Visualização de medições cadastradas
- **Cadastrar Base** - Adicionar novas bases
- **Consultar Base** - Listar bases cadastradas
- **Gerenciar Usuários** - Visualizar usuários
- **Criar Usuário** - Cadastrar novos usuários
- **Configurações** - Configurações e logs do sistema

### 🎨 Características

- Interface moderna com cores do EPA (#00920C, #00DC30, #EDFEE8)
- Navegação intuitiva
- Componentes reutilizáveis
- Validação de formulários
- Loading states
- Alertas e confirmações
- AsyncStorage para persistência

## 📁 Estrutura de Pastas

```
mobile/
├── App.tsx                 # Componente principal
├── app.json               # Configurações do Expo
├── package.json           # Dependências
├── tsconfig.json          # Configurações TypeScript
├── babel.config.js        # Configurações Babel
└── src/
    ├── components/        # Componentes reutilizáveis
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Header.tsx
    │   └── Input.tsx
    ├── context/           # Context API
    │   └── AuthContext.tsx
    ├── screens/           # Telas do app
    │   ├── LoginScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── NovaMedicaoScreen.tsx
    │   ├── RelatoriosScreen.tsx
    │   ├── CadastrarBaseScreen.tsx
    │   ├── ConsultarBaseScreen.tsx
    │   ├── GerenciarUsuariosScreen.tsx
    │   ├── CriarUsuarioScreen.tsx
    │   └── ConfiguracoesScreen.tsx
    └── theme.ts           # Cores e tema
```

## 🔌 Integração com Backend

Todas as telas estão preparadas para integração com backend. Os pontos de integração estão marcados com comentários `TODO: backend` indicando:

- Endpoint necessário
- Método HTTP
- Body/Headers esperados
- Response esperado

### Exemplo:
```typescript
// TODO: backend - Fazer login
// Endpoint: POST /api/auth/login
// Body: { email, senha }
// Response: { token, user }
```

## 🎨 Cores do Sistema

```typescript
primary: '#00920C'        // Verde escuro
primaryLight: '#00DC30'   // Verde claro
background: '#EDFEE8'     // Verde muito claro
white: '#FFFFFF'          // Branco
black: '#000000'          // Preto
```

## 📦 Build para Produção

### Android (APK)

```bash
expo build:android
```

### iOS (apenas em Mac)

```bash
expo build:ios
```

### EAS Build (recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

## 🔐 Autenticação

O app utiliza AsyncStorage para armazenar:
- Token de autenticação
- Dados do usuário

**Chaves utilizadas:**
- `@EPA:token`
- `@EPA:user`

## 📝 Próximos Passos

1. **Integrar com API real** - Substituir dados mockados por chamadas reais
2. **Adicionar validações** - Melhorar validação de formulários
3. **Implementar refresh** - Pull to refresh nas listagens
4. **Adicionar filtros** - Filtros avançados nos relatórios
5. **Notificações push** - Implementar notificações
6. **Modo offline** - Funcionalidades offline com sincronização
7. **Testes** - Adicionar testes unitários e de integração
8. **Gráficos** - Adicionar visualizações com gráficos
9. **Câmera** - Captura de fotos para medições
10. **Geolocalização** - Localização automática das bases

## 🐛 Problemas Conhecidos

Nenhum no momento.

## 📄 Licença

© 2024 Grupo EPA. Todos os direitos reservados.

## 👥 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
