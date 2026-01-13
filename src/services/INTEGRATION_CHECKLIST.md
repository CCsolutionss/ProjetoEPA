# Checklist de Integração Backend - Sistema EPA

## 📋 Como Usar Este Checklist

Para cada endpoint implementado:
1. ✅ Marque como concluído quando implementado e testado
2. 📝 Anote a data de conclusão
3. 🔗 Link para a documentação Swagger
4. 🧪 Confirme que testes foram escritos

---

## 🔐 Auth Service (Port 3001)

### Endpoints Básicos

- [ ] **POST /api/auth/login**
  - [ ] Implementado
  - [ ] Testado (unit + integration)
  - [ ] Documentado no Swagger
  - [ ] Rate limiting configurado (5 tentativas / 15min)
  - [ ] Logs de auditoria funcionando
  - Data: ___/___/___

- [ ] **POST /api/auth/register**
  - [ ] Implementado
  - [ ] Validação de email único
  - [ ] Validação de matrícula única
  - [ ] Hash de senha com bcrypt
  - [ ] Email de boas-vindas enviado
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/auth/me**
  - [ ] Implementado
  - [ ] Validação de token JWT
  - [ ] Verificação de blacklist
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/auth/logout**
  - [ ] Implementado
  - [ ] Token adicionado à blacklist
  - [ ] Log de logout registrado
  - [ ] Testado
  - Data: ___/___/___

### Recuperação de Senha

- [ ] **POST /api/auth/forgot-password**
  - [ ] Implementado
  - [ ] Token único gerado (crypto)
  - [ ] Token salvo com expiração (1h)
  - [ ] Email enviado
  - [ ] Rate limiting (3 tentativas / 1h)
  - [ ] Sempre retorna sucesso (segurança)
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/auth/reset-password**
  - [ ] Implementado
  - [ ] Validação de token
  - [ ] Validação de senha forte
  - [ ] Hash da nova senha
  - [ ] Token invalidado após uso
  - [ ] Email de confirmação enviado
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/auth/change-password**
  - [ ] Implementado
  - [ ] Validação de senha atual
  - [ ] Validação de senha forte
  - [ ] Email de notificação
  - [ ] Testado
  - Data: ___/___/___

### Avançado

- [ ] **POST /api/auth/refresh-token**
  - [ ] Implementado
  - [ ] Refresh token validado
  - [ ] Novo par de tokens gerado
  - [ ] Refresh token antigo invalidado
  - [ ] Testado
  - Data: ___/___/___

---

## 👥 User Service (Port 3002)

### CRUD de Usuários

- [ ] **GET /api/users**
  - [ ] Implementado
  - [ ] Paginação funcionando
  - [ ] Filtros (search, role) funcionando
  - [ ] Ordenação funcionando
  - [ ] Permissions verificadas
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/users/:id**
  - [ ] Implementado
  - [ ] Permissions verificadas
  - [ ] Testado com ID inválido
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/users**
  - [ ] Implementado
  - [ ] Validação de campos obrigatórios
  - [ ] Validação de email/matrícula únicos
  - [ ] Hash de senha
  - [ ] Permissões padrão criadas
  - [ ] Email de boas-vindas enviado
  - [ ] Apenas admin pode criar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/users/:id**
  - [ ] Implementado
  - [ ] Validação de email único (se alterado)
  - [ ] Não pode alterar próprio role
  - [ ] Deve ter pelo menos 1 admin
  - [ ] Testado
  - Data: ___/___/___

- [ ] **DELETE /api/users/:id**
  - [ ] Implementado
  - [ ] Soft delete implementado
  - [ ] Não pode deletar próprio usuário
  - [ ] Deve ter pelo menos 1 admin
  - [ ] Tokens invalidados
  - [ ] Apenas admin pode deletar
  - [ ] Testado
  - Data: ___/___/___

### Senha e Permissões

- [ ] **PUT /api/users/:id/password**
  - [ ] Implementado
  - [ ] Validação de senha atual
  - [ ] Validação de senha forte
  - [ ] Email de confirmação
  - [ ] Admin pode resetar sem senha atual
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/users/:id/permissions**
  - [ ] Implementado
  - [ ] Permissions verificadas
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/users/:id/permissions**
  - [ ] Implementado
  - [ ] Validação de recursos
  - [ ] Log de alteração registrado
  - [ ] Apenas admin pode alterar
  - [ ] Testado
  - Data: ___/___/___

### Estatísticas

- [ ] **GET /api/users/:id/stats**
  - [ ] Implementado
  - [ ] Total de medições calculado
  - [ ] Última atividade retornada
  - [ ] Bases mais utilizadas calculadas
  - [ ] Testado
  - Data: ___/___/___

---

## 📊 Medição Service (Port 3003)

### CRUD de Medições

- [ ] **POST /api/medicoes**
  - [ ] Implementado
  - [ ] Base existe e está ativa validado
  - [ ] Campos obrigatórios validados
  - [ ] Tipos de dados validados
  - [ ] Data não futura validada
  - [ ] Log criado
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/medicoes**
  - [ ] Implementado
  - [ ] Paginação funcionando (padrão 20)
  - [ ] Filtros (baseId, período) funcionando
  - [ ] Busca funcionando
  - [ ] Ordenação funcionando
  - [ ] Índices no banco criados
  - [ ] Cache implementado (5min)
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/medicoes/:id**
  - [ ] Implementado
  - [ ] Dados da base incluídos
  - [ ] Dados do criador incluídos
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/medicoes/:id**
  - [ ] Implementado
  - [ ] Validação de tipos
  - [ ] Validação de data
  - [ ] Usuário pode editar apenas próprias (últimas 24h)
  - [ ] Admin pode editar qualquer
  - [ ] Histórico de alterações registrado
  - [ ] Testado
  - Data: ___/___/___

- [ ] **DELETE /api/medicoes/:id**
  - [ ] Implementado
  - [ ] Soft delete implementado
  - [ ] Validação de permissões
  - [ ] Testado
  - Data: ___/___/___

### CRUD de Bases

- [ ] **POST /api/bases**
  - [ ] Implementado
  - [ ] Nome único validado
  - [ ] Pelo menos 1 campo validado
  - [ ] Tipos de campo validados
  - [ ] IDs de campos gerados
  - [ ] Schema de validação criado
  - [ ] Apenas admin pode criar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/bases**
  - [ ] Implementado
  - [ ] Paginação funcionando
  - [ ] Filtros funcionando
  - [ ] Contagem de medições incluída
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/bases/:id**
  - [ ] Implementado
  - [ ] Contagem de medições incluída
  - [ ] Última medição incluída
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/bases/:id**
  - [ ] Implementado
  - [ ] Nome único validado (se alterado)
  - [ ] Compatibilidade com medições antigas mantida
  - [ ] Apenas admin pode atualizar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **DELETE /api/bases/:id**
  - [ ] Implementado
  - [ ] Verifica se possui medições
  - [ ] Soft delete implementado
  - [ ] Apenas admin pode deletar
  - [ ] Testado
  - Data: ___/___/___

### Relatórios e Exportação

- [ ] **GET /api/relatorios**
  - [ ] Implementado
  - [ ] Filtros por base e período funcionando
  - [ ] Agrupamento (dia/semana/mês) funcionando
  - [ ] Cálculos agregados corretos
  - [ ] Dados para gráficos incluídos
  - [ ] Cache (15min) implementado
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/medicoes/export**
  - [ ] Implementado
  - [ ] Formato CSV funcionando
  - [ ] Formato Excel funcionando
  - [ ] Formato PDF funcionando
  - [ ] Arquivo temporário gerado
  - [ ] Link de download retornado (válido 1h)
  - [ ] Job de limpeza agendado
  - [ ] Limite de 10.000 registros
  - [ ] Testado
  - Data: ___/___/___

---

## 🔔 Notification Service (Port 3004)

### REST API

- [ ] **GET /api/notifications**
  - [ ] Implementado
  - [ ] Paginação funcionando (padrão 20)
  - [ ] Filtros funcionando
  - [ ] Contagem de não lidas incluída
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/notifications/unread-count**
  - [ ] Implementado
  - [ ] Cache (1min) implementado
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/notifications/unread**
  - [ ] Implementado
  - [ ] Últimas 50 retornadas
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/notifications/:id/read**
  - [ ] Implementado
  - [ ] Data/hora de leitura registrada
  - [ ] Evento WebSocket emitido
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/notifications/mark-as-read**
  - [ ] Implementado
  - [ ] Múltiplas notificações atualizadas
  - [ ] Quantidade atualizada retornada
  - [ ] Evento WebSocket emitido
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/notifications/mark-all-read**
  - [ ] Implementado
  - [ ] Todas do usuário atualizadas
  - [ ] Evento WebSocket emitido
  - [ ] Testado
  - Data: ___/___/___

- [ ] **DELETE /api/notifications/:id**
  - [ ] Implementado
  - [ ] Apenas próprias notificações
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/notifications**
  - [ ] Implementado
  - [ ] Criar para usuário específico
  - [ ] Criar broadcast (todos)
  - [ ] Criar por grupo (role)
  - [ ] WebSocket emitido
  - [ ] Email opcional enviado
  - [ ] Apenas admin pode criar
  - [ ] Testado
  - Data: ___/___/___

### WebSocket

- [ ] **WebSocket Connection**
  - [ ] Implementado com Socket.io
  - [ ] Autenticação via JWT
  - [ ] Mapa userId->socketId funcionando
  - [ ] Evento 'connect' funcionando
  - [ ] Evento 'authenticate' funcionando
  - [ ] Evento 'new_notification' funcionando
  - [ ] Evento 'disconnect' funcionando
  - [ ] Reconexão automática configurada
  - [ ] Testado
  - Data: ___/___/___

---

## ⚙️ Settings Service (Port 3005)

### Configurações

- [ ] **GET /api/settings**
  - [ ] Implementado
  - [ ] Valores padrão retornados
  - [ ] Apenas admin pode visualizar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/settings**
  - [ ] Implementado
  - [ ] Validações funcionando
  - [ ] Log de alteração registrado
  - [ ] Configurações aplicadas
  - [ ] Apenas admin pode atualizar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/settings/reset**
  - [ ] Implementado
  - [ ] Valores padrão restaurados
  - [ ] Log registrado
  - [ ] Admins notificados
  - [ ] Apenas admin pode resetar
  - [ ] Testado
  - Data: ___/___/___

### Logs

- [ ] **GET /api/logs**
  - [ ] Implementado
  - [ ] Paginação funcionando (padrão 50)
  - [ ] Filtros funcionando
  - [ ] Índices no banco criados
  - [ ] Arquivamento de logs antigos (>90d)
  - [ ] Limite de 100k logs
  - [ ] Apenas admin pode visualizar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/logs**
  - [ ] Implementado
  - [ ] Usuário associado
  - [ ] Timestamp registrado
  - [ ] Notificação em logs críticos
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/logs/export**
  - [ ] Implementado
  - [ ] Formato CSV funcionando
  - [ ] Formato JSON funcionando
  - [ ] Arquivo temporário gerado
  - [ ] Limpeza após 1h
  - [ ] Apenas admin pode exportar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **DELETE /api/logs/cleanup**
  - [ ] Implementado
  - [ ] Logs antigos deletados
  - [ ] Logs críticos mantidos
  - [ ] Backup criado antes
  - [ ] Apenas admin pode limpar
  - [ ] Testado
  - Data: ___/___/___

### Backup

- [ ] **POST /api/backup**
  - [ ] Implementado
  - [ ] Job assíncrono criado
  - [ ] Dump do banco gerado
  - [ ] Arquivo comprimido
  - [ ] Upload para storage
  - [ ] Notificação ao concluir
  - [ ] Apenas admin pode criar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **GET /api/backup**
  - [ ] Implementado
  - [ ] Lista com informações completas
  - [ ] Ordenado por data
  - [ ] Apenas admin pode visualizar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **POST /api/backup/:id/restore**
  - [ ] Implementado
  - [ ] Backup do estado atual criado
  - [ ] Banco restaurado
  - [ ] Job assíncrono funcionando
  - [ ] Apenas admin pode restaurar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **DELETE /api/backup/:id**
  - [ ] Implementado
  - [ ] Arquivo deletado
  - [ ] Pelo menos 1 backup mantido
  - [ ] Apenas admin pode deletar
  - [ ] Testado
  - Data: ___/___/___

- [ ] **PUT /api/backup/config**
  - [ ] Implementado
  - [ ] Job cron agendado
  - [ ] Validação de horário
  - [ ] Apenas admin pode configurar
  - [ ] Testado
  - Data: ___/___/___

### Monitoramento

- [ ] **GET /api/health**
  - [ ] Implementado
  - [ ] Conexão com banco verificada
  - [ ] Espaço em disco verificado
  - [ ] Memória verificada
  - [ ] Status de microserviços verificado
  - [ ] Não requer autenticação
  - [ ] Testado
  - Data: ___/___/___

---

## 🗄️ Banco de Dados

### Schema

- [ ] **Tabela: users**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: bases**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: medicoes**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: notifications**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: logs**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: permissions**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: backups**
  - [ ] Criada com todas as colunas
  - [ ] Constraints configuradas
  - [ ] Índices criados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **Tabela: settings**
  - [ ] Criada com todas as colunas
  - [ ] Valores padrão inseridos
  - [ ] Testada
  - Data: ___/___/___

### Seeds

- [ ] **Usuário Admin Inicial**
  - [ ] Criado
  - [ ] Senha hash gerada
  - [ ] Permissões completas atribuídas
  - Data: ___/___/___

- [ ] **Bases de Exemplo**
  - [ ] Criadas (opcional)
  - Data: ___/___/___

---

## 🔒 Segurança

- [ ] **CORS**
  - [ ] Configurado corretamente
  - [ ] Origens permitidas definidas
  - [ ] Testado
  - Data: ___/___/___

- [ ] **Rate Limiting**
  - [ ] Implementado
  - [ ] Limites configurados por endpoint
  - [ ] Testado
  - Data: ___/___/___

- [ ] **Helmet.js**
  - [ ] Instalado e configurado
  - [ ] Headers de segurança adicionados
  - Data: ___/___/___

- [ ] **Validação de Input**
  - [ ] Implementada em todos os endpoints
  - [ ] Sanitização de dados
  - [ ] Testada
  - Data: ___/___/___

- [ ] **SQL Injection Protection**
  - [ ] ORM configurado (Prisma/TypeORM)
  - [ ] Queries parametrizadas
  - [ ] Testado
  - Data: ___/___/___

- [ ] **XSS Protection**
  - [ ] Sanitização de output
  - [ ] Headers configurados
  - [ ] Testado
  - Data: ___/___/___

---

## 🧪 Testes

### Unit Tests

- [ ] **Auth Service**
  - [ ] Cobertura > 80%
  - [ ] Todos os métodos testados
  - Data: ___/___/___

- [ ] **User Service**
  - [ ] Cobertura > 80%
  - [ ] Todos os métodos testados
  - Data: ___/___/___

- [ ] **Medição Service**
  - [ ] Cobertura > 80%
  - [ ] Todos os métodos testados
  - Data: ___/___/___

- [ ] **Notification Service**
  - [ ] Cobertura > 80%
  - [ ] Todos os métodos testados
  - Data: ___/___/___

- [ ] **Settings Service**
  - [ ] Cobertura > 80%
  - [ ] Todos os métodos testados
  - Data: ___/___/___

### Integration Tests

- [ ] **Auth Endpoints**
  - [ ] Todos testados
  - [ ] Happy path + error cases
  - Data: ___/___/___

- [ ] **User Endpoints**
  - [ ] Todos testados
  - [ ] Happy path + error cases
  - Data: ___/___/___

- [ ] **Medição Endpoints**
  - [ ] Todos testados
  - [ ] Happy path + error cases
  - Data: ___/___/___

- [ ] **Notification Endpoints**
  - [ ] Todos testados
  - [ ] Happy path + error cases
  - Data: ___/___/___

- [ ] **Settings Endpoints**
  - [ ] Todos testados
  - [ ] Happy path + error cases
  - Data: ___/___/___

### E2E Tests

- [ ] **Fluxo de Login Completo**
  - [ ] Testado
  - Data: ___/___/___

- [ ] **Fluxo de Criar Medição**
  - [ ] Testado
  - Data: ___/___/___

- [ ] **Fluxo de Recuperação de Senha**
  - [ ] Testado
  - Data: ___/___/___

- [ ] **Fluxo de Backup/Restore**
  - [ ] Testado
  - Data: ___/___/___

---

## 📚 Documentação

- [ ] **Swagger/OpenAPI**
  - [ ] Configurado
  - [ ] Todos os endpoints documentados
  - [ ] Exemplos de request/response
  - [ ] Disponível em /api/docs
  - Data: ___/___/___

- [ ] **README.md**
  - [ ] Instruções de instalação
  - [ ] Variáveis de ambiente
  - [ ] Como rodar localmente
  - [ ] Como rodar testes
  - Data: ___/___/___

- [ ] **Postman Collection**
  - [ ] Criada
  - [ ] Todos os endpoints incluídos
  - [ ] Variáveis configuradas
  - Data: ___/___/___

---

## 🐳 DevOps

- [ ] **Docker**
  - [ ] Dockerfile criado para cada serviço
  - [ ] docker-compose.yml criado
  - [ ] Tudo funciona via Docker
  - [ ] Testado
  - Data: ___/___/___

- [ ] **Variáveis de Ambiente**
  - [ ] .env.example criado
  - [ ] Documentação de todas as vars
  - Data: ___/___/___

- [ ] **CI/CD**
  - [ ] Pipeline criado
  - [ ] Testes automáticos
  - [ ] Deploy automático (staging)
  - Data: ___/___/___

- [ ] **Logs Estruturados**
  - [ ] Winston/Pino configurado
  - [ ] Formato JSON
  - [ ] Níveis corretos
  - Data: ___/___/___

- [ ] **Monitoramento**
  - [ ] APM configurado
  - [ ] Error tracking configurado
  - [ ] Métricas sendo coletadas
  - Data: ___/___/___

---

## ✅ Checklist Final

- [ ] Todos os endpoints implementados
- [ ] Todos os testes passando
- [ ] Cobertura de testes > 80%
- [ ] Documentação completa
- [ ] Docker funcionando
- [ ] Variáveis de ambiente documentadas
- [ ] Segurança configurada
- [ ] Logs estruturados
- [ ] Monitoramento configurado
- [ ] CI/CD funcionando
- [ ] Health checks configurados
- [ ] Backup automático funcionando
- [ ] Rate limiting configurado
- [ ] CORS configurado
- [ ] Frontend integrado e funcionando

**Data de Conclusão**: ___/___/___

**Responsável**: _______________________

**Aprovado por**: _______________________

---

## 📝 Notas Adicionais

_Use este espaço para anotar problemas encontrados, decisões técnicas importantes, ou qualquer outra informação relevante durante a integração._

---
---
---
