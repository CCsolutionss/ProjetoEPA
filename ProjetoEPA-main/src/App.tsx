import { useState, useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BaseProvider, useBase } from './context/BaseContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EsqueceuSenhaPage from './pages/EsqueceuSenhaPage';
import SelecionarBasePage from './pages/SelecionarBasePage';
import HomePage from './pages/HomePage';
import NovaMedicaoPage from './pages/NovaMedicaoPage';
import RelatoriosPage from './pages/RelatoriosPage';
import CadastrarBasePage from './pages/CadastrarBasePage';
import ConsultarBasePage from './pages/ConsultarBasePage';
import CriarUsuarioPage from './pages/CriarUsuarioPage';
import GerenciarPermissoesPage from './pages/GerenciarPermissoesPage';
import EditarUsuarioPage from './pages/EditarUsuarioPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';

function AppContent() {
  const { logout, isAuthenticated } = useAuth();
  const { hasSelectedBase, clearSelectedBase } = useBase();

  type PageType =
    | 'login'
    | 'register'
    | 'esqueceu-senha'
    | 'selecionar-base'
    | 'home'
    | 'nova-medicao'
    | 'relatorios'
    | 'cadastrar-base'
    | 'consultar-base'
    | 'criar-usuario'
    | 'gerenciar-permissoes'
    | 'editar-usuario'
    | 'configuracoes';

  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('');

  /**
   * ✅ Regra do efeito:
   * - Se não está autenticado -> manda pro login
   * - Se está autenticado e NÃO tem base -> força selecionar-base (se ainda não estiver nela)
   * - Se está autenticado e TEM base -> NÃO interfere na navegação normal
   *   (só corrige caso você esteja numa tela de auth por algum motivo)
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }

    if (!hasSelectedBase) {
      if (currentPage !== 'selecionar-base') {
        setCurrentPage('selecionar-base');
      }
      return;
    }

    // Se está autenticado + tem base, só tira da tela de auth se estiver nela
    if (currentPage === 'login' || currentPage === 'register' || currentPage === 'esqueceu-senha') {
      setCurrentPage('home');
    }
  }, [isAuthenticated, hasSelectedBase, currentPage]);

  const handleLoginSuccess = () => {
    setCurrentPage(hasSelectedBase ? 'home' : 'selecionar-base');
  };

  const handleLogout = () => {
    logout();
    clearSelectedBase();
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage
          onNavigateToRegister={() => setCurrentPage('register')}
          onNavigateToForgotPassword={() => setCurrentPage('esqueceu-senha')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}

      {currentPage === 'esqueceu-senha' && (
        <EsqueceuSenhaPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}

      {currentPage === 'selecionar-base' && (
        <SelecionarBasePage
          onContinue={() => setCurrentPage('home')}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'home' && (
        <HomePage
          onLogout={handleLogout}
          onNavigateToSelecionarBase={() => setCurrentPage('selecionar-base')}
          onNavigateToNovaMedicao={() => setCurrentPage('nova-medicao')}
          onNavigateToRelatorios={() => setCurrentPage('relatorios')}
          onNavigateToCadastrarBase={() => setCurrentPage('cadastrar-base')}
          onNavigateToConsultarBase={() => setCurrentPage('consultar-base')}
          onNavigateToGerenciarPermissoes={() => setCurrentPage('gerenciar-permissoes')}
          onNavigateToConfiguracoes={() => setCurrentPage('configuracoes')}
        />
      )}

      {currentPage === 'nova-medicao' && (
        <NovaMedicaoPage onVoltar={() => setCurrentPage('home')} />
      )}

      {currentPage === 'relatorios' && (
        <RelatoriosPage onVoltar={() => setCurrentPage('home')} />
      )}

      {currentPage === 'cadastrar-base' && (
        <CadastrarBasePage onVoltar={() => setCurrentPage('home')} />
      )}

      {currentPage === 'consultar-base' && (
        <ConsultarBasePage onVoltar={() => setCurrentPage('home')} />
      )}

      {currentPage === 'criar-usuario' && (
        <CriarUsuarioPage onVoltar={() => setCurrentPage('gerenciar-permissoes')} />
      )}

      {currentPage === 'gerenciar-permissoes' && (
        <GerenciarPermissoesPage
          onVoltar={() => setCurrentPage('home')}
          onNovoUsuario={() => setCurrentPage('criar-usuario')}
          onEditarUsuario={(usuarioId) => {
            setSelectedUsuarioId(usuarioId);
            setCurrentPage('editar-usuario');
          }}
        />
      )}

      {currentPage === 'editar-usuario' && (
        <EditarUsuarioPage
          onVoltar={() => setCurrentPage('gerenciar-permissoes')}
          usuarioId={selectedUsuarioId}
        />
      )}

      {currentPage === 'configuracoes' && (
        <ConfiguracoesPage onVoltar={() => setCurrentPage('home')} />
      )}

      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BaseProvider>
        <AppContent />
      </BaseProvider>
    </AuthProvider>
  );
}
