# Arquitetura de Microserviços - EPA Frontend

## 📋 Visão Geral

Este diretório contém toda a camada de serviços do frontend, organizados seguindo os princípios de **Clean Code** e preparados para integração com uma arquitetura de **microserviços**.

## 🏗️ Estrutura de Microserviços

### 1. **Auth Service** (Porta 3001)
- **Responsabilidade**: Autenticação e autorização
- **Endpoints**: Login, registro, recuperação de senha, validação de tokens
- **Arquivo**: `auth.service.ts`

### 2. **User Service** (Porta 3002)
- **Responsabilidade**: Gestão de usuários e permissões
- **Endpoints**: CRUD de usuários, gestão de permissões, atualização de perfis
- **Arquivo**: `user.service.ts`

### 3. **Medição Service** (Porta 3003)
- **Responsabilidade**: Medições e bases de medição
- **Endpoints**: CRUD de medições, CRUD de bases, relatórios, exportação
- **Arquivo**: `medicao.service.ts`

### 4. **Notification Service** (Porta 3004)
- **Responsabilidade**: Notificações e comunicação em tempo real
- **Endpoints**: CRUD de notificações, WebSocket para tempo real
- **Arquivo**: `notification.service.ts`

### 5. **Settings Service** (Porta 3005)
- **Responsabilidade**: Configurações do sistema e logs
- **Endpoints**: Configurações, logs de auditoria, backup/restore
- **Arquivo**: `settings.service.ts`

## 📁 Arquivos Principais

```
services/
├── README.md                    # Este arquivo
├── config.ts                    # URLs dos microserviços e configurações
├── http-client.ts               # Cliente HTTP genérico
├── index.ts                     # Exportações centralizadas
├── auth.service.ts              # Serviço de autenticação
├── user.service.ts              # Serviço de usuários
├── medicao.service.ts           # Serviço de medições
├── notification.service.ts      # Serviço de notificações
├── settings.service.ts          # Serviço de configurações
└── api.ts                       # [DEPRECATED] Manter para compatibilidade
```

## 🔧 Configuração

### Desenvolvimento

Edite o arquivo `config.ts` para configurar as URLs dos microserviços:

```typescript
const DEVELOPMENT_CONFIG = {
  AUTH_SERVICE_URL: 'http://localhost:3001/api',
  USER_SERVICE_URL: 'http://localhost:3002/api',
  // ...
};
```

### Produção

Configure as variáveis de ambiente ou atualize diretamente em `config.ts`:

```typescript
const PRODUCTION_CONFIG = {
  AUTH_SERVICE_URL: 'https://auth.epa.com.br/api',
  USER_SERVICE_URL: 'https://users.epa.com.br/api',
  // ...
};
```

## 💡 Como Usar

### Importação Básica

```typescript
import { authService, userService } from '../services';

// Login
const response = await authService.login({
  matricula: '12345',
  senha: 'senha123'
});

// Listar usuários
const users = await userService.getUsers({ page: 1, limit: 10 });
```

### Tratamento de Erros

```typescript
import { authService } from '../services';
import { HttpError } from '../services/http-client';
import { toast } from 'sonner';

try {
  await authService.login(credentials);
  toast.success('Login realizado com sucesso!');
} catch (error) {
  if (error instanceof HttpError) {
    if (error.status === 401) {
      toast.error('Credenciais inválidas');
    } else {
      toast.error(`Erro: ${error.message}`);
    }
  } else {
    toast.error('Erro inesperado');
  }
}
```

## 📝 Padrões de Código

### 1. **Nomes Descritivos**
- Classes: `PascalCase` (ex: `AuthService`)
- Métodos: `camelCase` (ex: `getUsers`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `SERVICE_URLS`)

### 2. **Single Responsibility**
Cada serviço tem uma única responsabilidade bem definida.

### 3. **DRY (Don't Repeat Yourself)**
Lógica comum está no `HttpClient`, não repetida em cada serviço.

### 4. **Documentação Clara**
Todos os métodos possuem:
- Descrição da funcionalidade
- TODO com endpoint e detalhes de implementação
- Validações necessárias
- Códigos de resposta esperados
- Regras de negócio

### 5. **Type Safety**
Todos os métodos são tipados com TypeScript.

## 🔐 Autenticação

O `HttpClient` automaticamente:
1. Adiciona o header `Authorization: Bearer <token>` em requisições autenticadas
2. Busca o token do `localStorage` ou `sessionStorage`
3. Permite requisições não autenticadas com `requiresAuth: false`

```typescript
// Requisição autenticada (padrão)
await userService.getUsers();

// Requisição não autenticada
await authService.login(credentials);
```

## ⏱️ Timeout

Todas as requisições têm timeout padrão de 30 segundos, configurável em `config.ts`:

```typescript
export const REQUEST_TIMEOUT = 30000; // 30 segundos
```

## 🚀 Migração do api.ts Antigo

O arquivo `api.ts` antigo foi mantido para compatibilidade, mas recomendamos migrar para os novos serviços:

### Antes (api.ts)
```typescript
import { apiService } from '../services/api';
await apiService.login(data);
```

### Depois (Novo)
```typescript
import { authService } from '../services';
await authService.login(data);
```

## 📋 Checklist de Integração Backend

Para cada serviço, siga este checklist:

### Auth Service
- [ ] Implementar POST /auth/login
- [ ] Implementar POST /auth/register
- [ ] Implementar GET /auth/me
- [ ] Implementar POST /auth/logout
- [ ] Implementar POST /auth/forgot-password
- [ ] Implementar POST /auth/reset-password
- [ ] Implementar POST /auth/change-password
- [ ] Implementar POST /auth/refresh-token

### User Service
- [ ] Implementar GET /users
- [ ] Implementar GET /users/:id
- [ ] Implementar POST /users
- [ ] Implementar PUT /users/:id
- [ ] Implementar DELETE /users/:id
- [ ] Implementar PUT /users/:id/password
- [ ] Implementar GET /users/:id/permissions
- [ ] Implementar PUT /users/:id/permissions
- [ ] Implementar GET /users/:id/stats

### Medição Service
- [ ] Implementar POST /medicoes
- [ ] Implementar GET /medicoes
- [ ] Implementar GET /medicoes/:id
- [ ] Implementar PUT /medicoes/:id
- [ ] Implementar DELETE /medicoes/:id
- [ ] Implementar POST /bases
- [ ] Implementar GET /bases
- [ ] Implementar GET /bases/:id
- [ ] Implementar PUT /bases/:id
- [ ] Implementar DELETE /bases/:id
- [ ] Implementar GET /relatorios
- [ ] Implementar POST /medicoes/export

### Notification Service
- [ ] Implementar GET /notifications
- [ ] Implementar GET /notifications/unread-count
- [ ] Implementar GET /notifications/unread
- [ ] Implementar PUT /notifications/:id/read
- [ ] Implementar PUT /notifications/mark-as-read
- [ ] Implementar PUT /notifications/mark-all-read
- [ ] Implementar DELETE /notifications/:id
- [ ] Implementar POST /notifications
- [ ] Implementar WebSocket connection

### Settings Service
- [ ] Implementar GET /settings
- [ ] Implementar PUT /settings
- [ ] Implementar POST /settings/reset
- [ ] Implementar GET /logs
- [ ] Implementar POST /logs
- [ ] Implementar POST /logs/export
- [ ] Implementar DELETE /logs/cleanup
- [ ] Implementar POST /backup
- [ ] Implementar GET /backup
- [ ] Implementar POST /backup/:id/restore
- [ ] Implementar DELETE /backup/:id
- [ ] Implementar PUT /backup/config
- [ ] Implementar GET /health

## 🧪 Testes

### Estrutura de Testes Recomendada

```
services/
├── __tests__/
│   ├── auth.service.test.ts
│   ├── user.service.test.ts
│   ├── medicao.service.test.ts
│   ├── notification.service.test.ts
│   └── settings.service.test.ts
```

### Exemplo de Teste

```typescript
import { authService } from '../auth.service';
import { HttpClient } from '../http-client';

jest.mock('../http-client');

describe('AuthService', () => {
  it('should login successfully', async () => {
    const mockResponse = { user: {}, token: 'abc123' };
    jest.spyOn(HttpClient.prototype, 'post').mockResolvedValue(mockResponse);

    const result = await authService.login({
      matricula: '12345',
      senha: 'senha123'
    });

    expect(result).toEqual(mockResponse);
  });
});
```

## 📚 Recursos Adicionais

- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Microservices Architecture](https://microservices.io/)

## 🤝 Contribuindo

Ao adicionar novos endpoints ou serviços:

1. Siga os padrões estabelecidos
2. Adicione documentação completa com TODO
3. Defina tipos TypeScript para request/response
4. Adicione tratamento de erros apropriado
5. Atualize este README

## 📞 Suporte

Para dúvidas sobre a integração com backend, consulte os TODOs nos arquivos de serviço que contêm todas as especificações necessárias.
