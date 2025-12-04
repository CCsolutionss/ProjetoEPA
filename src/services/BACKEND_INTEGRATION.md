# Guia de Integração Backend - Sistema EPA

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura de Microserviços](#arquitetura-de-microserviços)
3. [Especificações por Serviço](#especificações-por-serviço)
4. [Autenticação e Segurança](#autenticação-e-segurança)
5. [Padrões de Response](#padrões-de-response)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Exemplos de Implementação](#exemplos-de-implementação)

---

## 🎯 Visão Geral

Este documento serve como guia completo para o time de backend implementar os microserviços necessários para o sistema EPA.

### Stack Tecnológica Sugerida
- **Runtime**: Node.js 18+ ou Python 3.10+
- **Framework**: NestJS, Express (Node) ou FastAPI (Python)
- **Banco de Dados**: PostgreSQL (principal) + Redis (cache/sessions)
- **Autenticação**: JWT (JSON Web Tokens)
- **Documentação**: Swagger/OpenAPI
- **Comunicação**: REST + WebSocket (notificações)

---

## 🏗️ Arquitetura de Microserviços

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Opcional)                   │
│                    nginx ou Kong ou Traefik                  │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
         │ Auth Service│ │  User  │ │  Medição   │
         │   :3001     │ │ Service│ │  Service   │
         │             │ │ :3002  │ │   :3003    │
         └─────────────┘ └────────┘ └────────────┘
                              │
                ┌─────────────┼─────────────┐
                │                           │
         ┌──────▼──────┐           ┌───────▼────────┐
         │Notification │           │    Settings    │
         │  Service    │           │    Service     │
         │   :3004     │           │     :3005      │
         └─────────────┘           └────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    PostgreSQL     │
                    │      Redis        │
                    └───────────────────┘
```

### Comunicação Entre Serviços

- **Síncrona**: REST API (HTTP)
- **Assíncrona**: Message Queue (RabbitMQ/Redis) para operações pesadas
- **Tempo Real**: WebSocket (Socket.io) para notificações

---

## 🔐 Autenticação e Segurança

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id_here",
    "matricula": "12345",
    "role": "admin",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

### Headers Esperados

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Validação de Token

```javascript
// Pseudocódigo
function validateToken(token) {
  // 1. Verificar se token está bem formado
  // 2. Verificar assinatura
  // 3. Verificar expiração
  // 4. Verificar se está na blacklist (Redis)
  // 5. Retornar dados do usuário
}
```

### Rate Limiting

Implementar rate limiting para proteger contra ataques:

```
- Login: 5 tentativas por 15 minutos
- Forgot Password: 3 tentativas por hora
- API Geral: 100 requisições por minuto por usuário
```

---

## 📊 Padrões de Response

### Success Response (200, 201)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "nomeCompleto": "João Silva",
      "matricula": "12345",
      "email": "joao@epa.com.br",
      "role": "admin"
    }
  },
  "message": "Operação realizada com sucesso"
}
```

### List Response (200)

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Matrícula ou senha incorretos",
    "details": {
      "field": "senha",
      "reason": "Senha não corresponde ao hash armazenado"
    }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## ⚠️ Tratamento de Erros

### Códigos HTTP Padronizados

| Código | Situação | Exemplo |
|--------|----------|---------|
| 200 | Sucesso | GET, PUT, DELETE bem-sucedidos |
| 201 | Criado | POST bem-sucedido |
| 204 | Sem conteúdo | DELETE sem retorno |
| 400 | Bad Request | Dados inválidos no body |
| 401 | Não autenticado | Token inválido ou ausente |
| 403 | Sem permissão | Token válido mas sem permissão |
| 404 | Não encontrado | Recurso não existe |
| 409 | Conflito | Email/matrícula já existem |
| 422 | Entidade não processável | Validação de negócio falhou |
| 429 | Muitas requisições | Rate limit excedido |
| 500 | Erro interno | Erro não tratado no servidor |
| 503 | Serviço indisponível | Banco fora do ar |

### Mensagens de Erro

Sempre retornar mensagens úteis para o usuário:

```javascript
// ❌ Ruim
"Error"

// ✅ Bom
"A matrícula informada já está cadastrada no sistema"

// ✅ Melhor ainda
{
  "code": "MATRICULA_ALREADY_EXISTS",
  "message": "A matrícula informada já está cadastrada no sistema",
  "field": "matricula",
  "value": "12345"
}
```

---

## 📝 Especificações Detalhadas

### 1. Auth Service (Port 3001)

#### POST /api/auth/login

**Request**:
```json
{
  "matricula": "12345",
  "senha": "senha123"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "nomeCompleto": "João Silva",
      "matricula": "12345",
      "cargo": "Analista",
      "role": "admin",
      "email": "joao@epa.com.br"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

**Response 401**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Matrícula ou senha incorretos"
  }
}
```

**Validações**:
1. Matricula existe no banco
2. Senha corresponde ao hash (bcrypt.compare)
3. Usuário está ativo
4. Registrar tentativa de login (sucesso ou falha)
5. Bloquear após 5 tentativas falhadas

**Implementação Sugerida (Node.js + NestJS)**:
```typescript
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // 1. Buscar usuário por matrícula
  const user = await this.userRepository.findOne({
    where: { matricula: loginDto.matricula }
  });

  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas');
  }

  // 2. Verificar senha
  const isPasswordValid = await bcrypt.compare(
    loginDto.senha,
    user.senhaHash
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Credenciais inválidas');
  }

  // 3. Gerar tokens
  const payload = {
    sub: user.id,
    matricula: user.matricula,
    role: user.role
  };

  const token = this.jwtService.sign(payload, { expiresIn: '1h' });
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  // 4. Registrar log de login
  await this.logService.create({
    userId: user.id,
    action: 'LOGIN',
    timestamp: new Date()
  });

  // 5. Retornar resposta
  return {
    success: true,
    data: {
      user: this.sanitizeUser(user),
      token,
      refreshToken,
      expiresIn: 3600
    }
  };
}
```

---

#### POST /api/auth/forgot-password

**Request**:
```json
{
  "email": "joao@epa.com.br"
}
```

**Response 200** (sempre retorna sucesso):
```json
{
  "success": true,
  "message": "Se o e-mail estiver cadastrado, você receberá instruções para recuperação de senha"
}
```

**Processamento**:
1. Buscar usuário por email
2. Se não existir, retornar sucesso mesmo assim (segurança)
3. Gerar token único (crypto.randomBytes(32))
4. Salvar token com expiração (1 hora)
5. Enviar email com link
6. Rate limit: 3 tentativas por hora

**Implementação do Email**:
```typescript
async sendPasswordResetEmail(user: User, token: string) {
  const resetLink = `https://epa.com.br/reset-password?token=${token}`;
  
  await this.emailService.send({
    to: user.email,
    subject: 'Recuperação de Senha - EPA',
    template: 'password-reset',
    context: {
      nomeCompleto: user.nomeCompleto,
      resetLink,
      expiresIn: '1 hora'
    }
  });
}
```

---

### 2. User Service (Port 3002)

#### GET /api/users

**Query Parameters**:
```
?page=1&limit=10&search=joão&role=admin&sortBy=nomeCompleto&sortOrder=asc
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid1",
        "nomeCompleto": "João Silva",
        "matricula": "12345",
        "cargo": "Analista",
        "role": "admin",
        "email": "joao@epa.com.br",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}
```

**Implementação SQL**:
```sql
SELECT 
  id, nome_completo, matricula, cargo, role, email, 
  created_at, updated_at
FROM users
WHERE 
  (nome_completo ILIKE '%' || $1 || '%' 
   OR matricula ILIKE '%' || $1 || '%' 
   OR email ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR role = $2)
  AND deleted_at IS NULL
ORDER BY 
  CASE WHEN $3 = 'nomeCompleto' THEN nome_completo END ASC,
  CASE WHEN $3 = 'matricula' THEN matricula END ASC
LIMIT $4 OFFSET $5;
```

---

### 3. Medição Service (Port 3003)

#### POST /api/medicoes

**Request**:
```json
{
  "baseId": "base-uuid",
  "data": "2025-01-15",
  "valores": {
    "temperatura": 25.5,
    "umidade": 60,
    "pressao": 1013
  },
  "observacoes": "Medição realizada às 14h"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "medicao": {
      "id": "medicao-uuid",
      "baseId": "base-uuid",
      "baseName": "Estação Meteorológica 01",
      "data": "2025-01-15",
      "valores": {
        "temperatura": 25.5,
        "umidade": 60,
        "pressao": 1013
      },
      "observacoes": "Medição realizada às 14h",
      "criadoPor": "user-uuid",
      "criadoEm": "2025-01-15T14:00:00Z"
    }
  }
}
```

**Validações**:
1. Base existe e está ativa
2. Todos os campos obrigatórios da base estão preenchidos
3. Tipos dos valores correspondem ao schema da base
4. Data não é futura
5. Valores numéricos dentro de ranges definidos (se houver)

**Implementação de Validação**:
```typescript
async validateMedicaoData(medicao: CreateMedicaoDto) {
  // 1. Buscar base
  const base = await this.baseRepository.findOne({
    where: { id: medicao.baseId, ativo: true }
  });

  if (!base) {
    throw new NotFoundException('Base não encontrada ou inativa');
  }

  // 2. Validar campos obrigatórios
  for (const campo of base.campos) {
    if (campo.obrigatorio && !medicao.valores[campo.nome]) {
      throw new BadRequestException(
        `Campo obrigatório não preenchido: ${campo.nome}`
      );
    }

    // 3. Validar tipo
    const valor = medicao.valores[campo.nome];
    if (valor !== undefined) {
      this.validateFieldType(campo, valor);
    }
  }

  // 4. Validar data
  if (new Date(medicao.data) > new Date()) {
    throw new BadRequestException('Data não pode ser futura');
  }

  return base;
}
```

---

### 4. Notification Service (Port 3004)

#### WebSocket Connection

**Client Connection**:
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3004', {
  auth: {
    token: 'jwt_token_here'
  }
});

socket.on('connect', () => {
  console.log('Connected to notification service');
});

socket.on('new_notification', (notification) => {
  console.log('New notification:', notification);
  // Exibir toast, atualizar contador, etc
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

**Server Implementation (Socket.io)**:
```typescript
@WebSocketGateway({ 
  cors: { origin: '*' },
  namespace: '/notifications'
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>();

  @SubscribeMessage('authenticate')
  async handleAuth(client: Socket, token: string) {
    try {
      const payload = this.jwtService.verify(token);
      this.userSocketMap.set(payload.sub, client.id);
      client.data.userId = payload.sub;
    } catch (error) {
      client.disconnect();
    }
  }

  async sendToUser(userId: string, notification: Notification) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
    }
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.userSocketMap.delete(client.data.userId);
    }
  }
}
```

---

### 5. Settings Service (Port 3005)

#### POST /api/backup

**Response 202** (Accepted - Processamento Assíncrono):
```json
{
  "success": true,
  "data": {
    "backup": {
      "id": "backup-uuid",
      "status": "em_progresso",
      "iniciadoEm": "2025-01-15T14:00:00Z"
    }
  },
  "message": "Backup iniciado. Você será notificado quando concluído."
}
```

**Implementação com Bull Queue**:
```typescript
@Post('backup')
async createBackup(@CurrentUser() user: User) {
  // 1. Criar registro do backup
  const backup = await this.backupRepository.create({
    status: 'em_progresso',
    iniciadoPor: user.id,
    iniciadoEm: new Date()
  });

  // 2. Adicionar job na fila
  await this.backupQueue.add('create-backup', {
    backupId: backup.id,
    userId: user.id
  });

  // 3. Retornar resposta imediata
  return {
    success: true,
    data: { backup },
    message: 'Backup iniciado'
  };
}

// Processor
@Process('create-backup')
async processBackup(job: Job) {
  const { backupId, userId } = job.data;

  try {
    // 1. Criar dump do banco
    const filename = `backup_${Date.now()}.sql.gz`;
    await this.databaseService.createDump(filename);

    // 2. Fazer upload para S3/storage
    const url = await this.storageService.upload(filename);

    // 3. Atualizar registro
    await this.backupRepository.update(backupId, {
      status: 'sucesso',
      caminho: url,
      concluidoEm: new Date(),
      tamanho: await this.getFileSize(filename)
    });

    // 4. Notificar usuário
    await this.notificationService.create({
      userId,
      tipo: 'success',
      titulo: 'Backup Concluído',
      mensagem: 'Seu backup foi criado com sucesso'
    });

  } catch (error) {
    // Marcar como falha e notificar
    await this.backupRepository.update(backupId, {
      status: 'falha',
      erro: error.message
    });

    await this.notificationService.create({
      userId,
      tipo: 'error',
      titulo: 'Falha no Backup',
      mensagem: `Erro ao criar backup: ${error.message}`
    });
  }
}
```

---

## 🗄️ Schema do Banco de Dados

### Tabela: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo VARCHAR(255) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'viewer')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_matricula ON users(matricula);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Tabela: bases

```sql
CREATE TABLE bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) UNIQUE NOT NULL,
  descricao TEXT,
  campos JSONB NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_bases_nome ON bases(nome);
CREATE INDEX idx_bases_ativo ON bases(ativo);
```

### Tabela: medicoes

```sql
CREATE TABLE medicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_id UUID REFERENCES bases(id) ON DELETE RESTRICT,
  data DATE NOT NULL,
  valores JSONB NOT NULL,
  observacoes TEXT,
  criado_por UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_medicoes_base_id ON medicoes(base_id);
CREATE INDEX idx_medicoes_data ON medicoes(data);
CREATE INDEX idx_medicoes_criado_por ON medicoes(criado_por);
CREATE INDEX idx_medicoes_created_at ON medicoes(created_at);
```

---

## 🧪 Testes de Integração

### Exemplo com Jest + Supertest

```typescript
describe('Auth API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/auth/login (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        matricula: '12345',
        senha: 'senha123'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data).toHaveProperty('user');
      });
  });

  it('/api/auth/login (POST) - invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        matricula: '12345',
        senha: 'wrongpassword'
      })
      .expect(401)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
      });
  });
});
```

---

## 📊 Monitoramento e Logs

### Estrutura de Log Sugerida

```json
{
  "timestamp": "2025-01-15T14:30:00.123Z",
  "level": "info",
  "service": "auth-service",
  "requestId": "uuid-request",
  "userId": "uuid-user",
  "method": "POST",
  "path": "/api/auth/login",
  "statusCode": 200,
  "duration": 245,
  "message": "User logged in successfully",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Ferramentas Recomendadas
- **Logs**: Winston ou Pino
- **APM**: New Relic ou Datadog
- **Errors**: Sentry
- **Metrics**: Prometheus + Grafana

---

## ✅ Checklist Final

- [ ] Todos os endpoints implementados
- [ ] Testes unitários (cobertura > 80%)
- [ ] Testes de integração
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting configurado
- [ ] CORS configurado
- [ ] Logs estruturados
- [ ] Health check endpoint
- [ ] Docker e docker-compose
- [ ] CI/CD configurado
- [ ] Variáveis de ambiente documentadas
- [ ] Backup automático funcionando
- [ ] Monitoramento configurado

---

## 📞 Contato

Para dúvidas técnicas, consulte este documento e os arquivos de serviço que contêm especificações detalhadas em cada método.
