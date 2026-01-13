# Exemplos de Uso dos Serviços - Frontend EPA

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Gestão de Usuários](#gestão-de-usuários)
3. [Medições](#medições)
4. [Notificações](#notificações)
5. [Configurações](#configurações)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Hooks Customizados](#hooks-customizados)

---

## 🔐 Autenticação

### Login

```typescript
// pages/LoginPage.tsx
import { useState } from 'react';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        matricula: '12345',
        senha: 'senha123'
      });

      // Salvar no context
      login(response.user, response.token, rememberMe);
      
      toast.success('Login realizado com sucesso!');
      navigate('/home');
      
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 401) {
          toast.error('Matrícula ou senha incorretos');
        } else if (error.status === 429) {
          toast.error('Muitas tentativas. Tente novamente mais tarde.');
        } else {
          toast.error('Erro ao fazer login. Tente novamente.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

### Esqueceu Senha

```typescript
// pages/EsqueceuSenhaPage.tsx
import { useState } from 'react';
import { authService } from '../services';
import { toast } from 'sonner';

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação client-side
    if (!email || !email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido');
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      
      setEmailEnviado(true);
      toast.success('E-mail de recuperação enviado!');
      
    } catch (error) {
      toast.error('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Logout

```typescript
// components/Header.tsx
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function Header() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout(); // Limpar context
      toast.success('Logout realizado com sucesso');
      
    } catch (error) {
      // Fazer logout local mesmo se API falhar
      logout();
    }
  };

  return (
    <button onClick={handleLogout}>Sair</button>
  );
}
```

---

## 👥 Gestão de Usuários

### Listar Usuários com Filtros

```typescript
// pages/GerenciarPermissoesPage.tsx
import { useState, useEffect } from 'react';
import { userService } from '../services';
import type { User } from '../types/user';

export default function GerenciarPermissoesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    
    try {
      const response = await userService.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter || undefined,
        sortBy: 'nomeCompleto',
        sortOrder: 'asc'
      });

      setUsers(response.users);
      setTotalPages(response.totalPages);
      
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset para primeira página
  };

  return (
    <div>
      {/* Search input */}
      <input 
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar por nome, matrícula ou email"
      />

      {/* Role filter */}
      <select 
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="admin">Admin</option>
        <option value="user">Usuário</option>
        <option value="viewer">Visualizador</option>
      </select>

      {/* Users table */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nomeCompleto}</td>
              <td>{user.matricula}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </table>
      )}

      {/* Pagination */}
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Criar Usuário

```typescript
// pages/CriarUsuarioPage.tsx
import { useState } from 'react';
import { userService } from '../services';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form@7.55.0';

interface CreateUserForm {
  nomeCompleto: string;
  matricula: string;
  email: string;
  cargo: string;
  role: 'admin' | 'user' | 'viewer';
  senha: string;
  confirmarSenha: string;
}

export default function CriarUsuarioPage({ onVoltar }: Props) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateUserForm>();

  const onSubmit = async (data: CreateUserForm) => {
    // Validações client-side
    if (data.senha !== data.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (data.senha.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmarSenha, ...userData } = data;
      
      await userService.createUser(userData);
      
      toast.success('Usuário criado com sucesso!');
      onVoltar();
      
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 409) {
          toast.error('Matrícula ou e-mail já cadastrados');
        } else if (error.status === 403) {
          toast.error('Você não tem permissão para criar usuários');
        } else {
          toast.error('Erro ao criar usuário');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('nomeCompleto', { required: true })}
        placeholder="Nome Completo"
      />
      {errors.nomeCompleto && <span>Campo obrigatório</span>}

      <input 
        {...register('email', { 
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        })}
        placeholder="E-mail"
      />
      {errors.email && <span>E-mail inválido</span>}

      {/* Outros campos */}

      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Usuário'}
      </button>
    </form>
  );
}
```

### Atualizar Permissões

```typescript
// pages/EditarUsuarioPage.tsx
import { useState, useEffect } from 'react';
import { userService } from '../services';
import type { UserPermission } from '../types/user';

export default function EditarUsuarioPage({ usuarioId }: Props) {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, [usuarioId]);

  const loadPermissions = async () => {
    try {
      const response = await userService.getUserPermissions(usuarioId);
      setPermissions(response.permissions);
    } catch (error) {
      toast.error('Erro ao carregar permissões');
    }
  };

  const handleSavePermissions = async () => {
    setLoading(true);

    try {
      await userService.updateUserPermissions(usuarioId, {
        permissions
      });

      toast.success('Permissões atualizadas com sucesso!');
      
    } catch (error) {
      toast.error('Erro ao atualizar permissões');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (
    resourceId: string, 
    permissionType: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
  ) => {
    setPermissions(prev => prev.map(perm => 
      perm.id === resourceId
        ? { ...perm, [permissionType]: !perm[permissionType] }
        : perm
    ));
  };

  return (
    <div>
      {permissions.map(perm => (
        <div key={perm.id}>
          <h3>{perm.resource}</h3>
          
          <label>
            <input 
              type="checkbox"
              checked={perm.canCreate}
              onChange={() => togglePermission(perm.id, 'canCreate')}
            />
            Criar
          </label>

          {/* Outras permissões */}
        </div>
      ))}

      <button onClick={handleSavePermissions} disabled={loading}>
        Salvar Permissões
      </button>
    </div>
  );
}
```

---

## 📊 Medições

### Criar Nova Medição

```typescript
// pages/NovaMedicaoPage.tsx
import { useState, useEffect } from 'react';
import { medicaoService } from '../services';
import type { Base, CreateMedicaoRequest } from '../types/medicao';

export default function NovaMedicaoPage() {
  const [bases, setBases] = useState<Base[]>([]);
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [valores, setValores] = useState<Record<string, any>>({});
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBases();
  }, []);

  const loadBases = async () => {
    try {
      const response = await medicaoService.getBases({ ativo: true });
      setBases(response.bases);
    } catch (error) {
      toast.error('Erro ao carregar bases');
    }
  };

  const handleBaseChange = (baseId: string) => {
    const base = bases.find(b => b.id === baseId);
    setSelectedBase(base || null);
    setValores({}); // Limpar valores quando trocar de base
  };

  const handleValorChange = (campoNome: string, valor: any) => {
    setValores(prev => ({
      ...prev,
      [campoNome]: valor
    }));
  };

  const validateForm = (): boolean => {
    if (!selectedBase) {
      toast.error('Selecione uma base');
      return false;
    }

    // Validar campos obrigatórios
    for (const campo of selectedBase.campos) {
      if (campo.obrigatorio && !valores[campo.nome]) {
        toast.error(`Campo "${campo.nome}" é obrigatório`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const medicaoData: CreateMedicaoRequest = {
        baseId: selectedBase!.id,
        data,
        valores,
        observacoes: observacoes || undefined
      };

      await medicaoService.createMedicao(medicaoData);
      
      toast.success('Medição criada com sucesso!');
      
      // Limpar formulário
      setValores({});
      setObservacoes('');
      
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 400) {
          toast.error('Dados inválidos. Verifique os campos.');
        } else if (error.status === 404) {
          toast.error('Base não encontrada');
        } else {
          toast.error('Erro ao criar medição');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Selecionar Base */}
      <select onChange={(e) => handleBaseChange(e.target.value)}>
        <option value="">Selecione uma base</option>
        {bases.map(base => (
          <option key={base.id} value={base.id}>
            {base.nome}
          </option>
        ))}
      </select>

      {/* Data */}
      <input 
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        max={new Date().toISOString().split('T')[0]}
      />

      {/* Campos Dinâmicos */}
      {selectedBase?.campos
        .sort((a, b) => a.ordem - b.ordem)
        .map(campo => (
          <div key={campo.id}>
            <label>
              {campo.nome}
              {campo.obrigatorio && ' *'}
            </label>
            
            {campo.tipo === 'numero' && (
              <input 
                type="number"
                value={valores[campo.nome] || ''}
                onChange={(e) => handleValorChange(campo.nome, parseFloat(e.target.value))}
              />
            )}

            {campo.tipo === 'texto' && (
              <input 
                type="text"
                value={valores[campo.nome] || ''}
                onChange={(e) => handleValorChange(campo.nome, e.target.value)}
              />
            )}

            {campo.tipo === 'select' && (
              <select 
                value={valores[campo.nome] || ''}
                onChange={(e) => handleValorChange(campo.nome, e.target.value)}
              >
                <option value="">Selecione</option>
                {campo.opcoes?.map(opcao => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            )}

            {campo.tipo === 'boolean' && (
              <input 
                type="checkbox"
                checked={valores[campo.nome] || false}
                onChange={(e) => handleValorChange(campo.nome, e.target.checked)}
              />
            )}
          </div>
        ))}

      {/* Observações */}
      <textarea 
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        placeholder="Observações (opcional)"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Medição'}
      </button>
    </form>
  );
}
```

### Gerar Relatório

```typescript
// pages/RelatoriosPage.tsx
import { useState } from 'react';
import { medicaoService } from '../services';

export default function RelatoriosPage() {
  const [baseId, setBaseId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [agrupamento, setAgrupamento] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [relatorio, setRelatorio] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Selecione o período');
      return;
    }

    setLoading(true);

    try {
      const response = await medicaoService.getRelatorio({
        baseId: baseId || undefined,
        dataInicio,
        dataFim,
        agrupamento
      });

      setRelatorio(response);
      toast.success('Relatório gerado com sucesso!');
      
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = async (formato: 'csv' | 'excel' | 'pdf') => {
    try {
      const blob = await medicaoService.exportarMedicoes({
        formato,
        baseId: baseId || undefined,
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined
      });

      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${Date.now()}.${formato}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Relatório exportado em ${formato.toUpperCase()}`);
      
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    }
  };

  return (
    <div>
      {/* Filtros */}
      <input 
        type="date"
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
      />
      
      <input 
        type="date"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
      />

      <select 
        value={agrupamento}
        onChange={(e) => setAgrupamento(e.target.value as any)}
      >
        <option value="dia">Diário</option>
        <option value="semana">Semanal</option>
        <option value="mes">Mensal</option>
      </select>

      <button onClick={handleGerarRelatorio} disabled={loading}>
        Gerar Relatório
      </button>

      {/* Botões de Exportação */}
      <button onClick={() => handleExportar('csv')}>
        Exportar CSV
      </button>
      <button onClick={() => handleExportar('excel')}>
        Exportar Excel
      </button>
      <button onClick={() => handleExportar('pdf')}>
        Exportar PDF
      </button>

      {/* Exibir Relatório */}
      {relatorio && (
        <div>
          {/* Renderizar gráficos e tabelas */}
        </div>
      )}
    </div>
  );
}
```

---

## 🔔 Notificações

### Listar e Marcar como Lida

```typescript
// components/NotificationBell.tsx
import { useState, useEffect } from 'react';
import { notificationService } from '../services';
import type { Notification } from '../types/notification';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações');
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getUnreadNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      toast.error('Erro ao carregar notificações');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
      toast.success('Todas as notificações foram marcadas como lidas');
      
    } catch (error) {
      toast.error('Erro ao marcar todas como lidas');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (notifications.length === 0) {
      loadNotifications();
    }
  };

  return (
    <div className="relative">
      {/* Ícone do Sino */}
      <button onClick={handleOpen} className="relative">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b flex justify-between">
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                Nenhuma notificação
              </p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b ${!notification.lida ? 'bg-blue-50' : ''}`}
                  onClick={() => !notification.lida && handleMarkAsRead(notification.id)}
                >
                  <p className="font-medium">{notification.titulo}</p>
                  <p className="text-sm text-gray-600">{notification.mensagem}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.criadoEm).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## ⚙️ Configurações

### Backup e Logs

```typescript
// pages/ConfiguracoesPage.tsx
import { useState, useEffect } from 'react';
import { settingsService } from '../services';
import type { SystemSettings, LogEntry } from '../services/settings.service';

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    loadLogs();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      setSettings(response.settings);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    }
  };

  const loadLogs = async () => {
    try {
      const response = await settingsService.getLogs({
        page: 1,
        limit: 50,
        nivel: undefined
      });
      setLogs(response.logs);
    } catch (error) {
      toast.error('Erro ao carregar logs');
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);

    try {
      await settingsService.updateSettings(settings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await settingsService.createBackup();
      toast.success('Backup iniciado! Você será notificado quando concluído.');
    } catch (error) {
      toast.error('Erro ao iniciar backup');
    }
  };

  const handleExportLogs = async () => {
    try {
      const blob = await settingsService.exportLogs({
        formato: 'csv'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Logs exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar logs');
    }
  };

  return (
    <div>
      {/* Configurações de Backup */}
      <section>
        <h2>Backup Automático</h2>
        
        <label>
          <input 
            type="checkbox"
            checked={settings.backupAutomatico || false}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              backupAutomatico: e.target.checked
            }))}
          />
          Ativar backup automático
        </label>

        <label>
          Horário do Backup:
          <input 
            type="time"
            value={settings.backupHorario || '02:00'}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              backupHorario: e.target.value
            }))}
          />
        </label>

        <button onClick={handleCreateBackup}>
          Criar Backup Agora
        </button>

        <button onClick={handleSaveSettings} disabled={loading}>
          Salvar Configurações
        </button>
      </section>

      {/* Logs do Sistema */}
      <section>
        <h2>Logs do Sistema</h2>
        
        <button onClick={handleExportLogs}>
          Exportar Logs
        </button>

        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Nível</th>
              <th>Módulo</th>
              <th>Mensagem</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${log.nivel}`}>
                    {log.nivel}
                  </span>
                </td>
                <td>{log.modulo}</td>
                <td>{log.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
```

---

## 🚨 Tratamento de Erros

### Hook Customizado para Tratamento de Erros

```typescript
// hooks/useErrorHandler.ts
import { toast } from 'sonner';
import { HttpError } from '../services/http-client';
import { useAuth } from '../context/AuthContext';

export function useErrorHandler() {
  const { logout } = useAuth();

  const handleError = (error: unknown, customMessage?: string) => {
    if (error instanceof HttpError) {
      switch (error.status) {
        case 400:
          toast.error(customMessage || 'Dados inválidos');
          break;
        
        case 401:
          toast.error('Sessão expirada. Faça login novamente.');
          logout();
          break;
        
        case 403:
          toast.error('Você não tem permissão para esta ação');
          break;
        
        case 404:
          toast.error(customMessage || 'Recurso não encontrado');
          break;
        
        case 409:
          toast.error(customMessage || 'Conflito: dados já existem');
          break;
        
        case 422:
          toast.error('Dados não puderam ser processados');
          break;
        
        case 429:
          toast.error('Muitas requisições. Aguarde um momento.');
          break;
        
        case 500:
          toast.error('Erro interno do servidor');
          break;
        
        case 503:
          toast.error('Serviço temporariamente indisponível');
          break;
        
        default:
          toast.error(error.data?.message || 'Erro desconhecido');
      }
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(customMessage || 'Erro inesperado');
    }
  };

  return { handleError };
}
```

### Uso do Hook

```typescript
// pages/ExamplePage.tsx
import { useState } from 'react';
import { userService } from '../services';
import { useErrorHandler } from '../hooks/useErrorHandler';

export default function ExamplePage() {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const handleAction = async () => {
    setLoading(true);

    try {
      await userService.createUser({
        // ...dados
      });
      
      toast.success('Usuário criado com sucesso!');
      
    } catch (error) {
      handleError(error, 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAction} disabled={loading}>
      Criar Usuário
    </button>
  );
}
```

---

## 🎣 Hooks Customizados

### Hook para Carregar Dados

```typescript
// hooks/useData.ts
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadData();
  }, dependencies);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reload: loadData };
}
```

### Uso do Hook

```typescript
// pages/ExamplePage.tsx
import { userService } from '../services';
import { useData } from '../hooks/useData';

export default function ExamplePage() {
  const { 
    data: users, 
    loading, 
    error, 
    reload 
  } = useData(
    () => userService.getUsers({ page: 1, limit: 10 }),
    []
  );

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar</p>;

  return (
    <div>
      <button onClick={reload}>Recarregar</button>
      {users?.users.map(user => (
        <div key={user.id}>{user.nomeCompleto}</div>
      ))}
    </div>
  );
}
```

---

Estes exemplos cobrem os principais casos de uso do sistema EPA. Para mais detalhes, consulte a documentação dos serviços individuais.
