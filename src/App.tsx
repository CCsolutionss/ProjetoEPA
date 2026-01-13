import { useState, useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EsqueceuSenhaPage from './pages/EsqueceuSenhaPage';
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

  // Estado de roteamento
  type PageType = 'login' | 'register' | 'esqueceu-senha' | 'home' | 'nova-medicao' | 'relatorios' | 'cadastrar-base' | 'consultar-base' | 'criar-usuario' | 'gerenciar-permissoes' | 'editar-usuario' | 'configuracoes';
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('');

  // TODO: backend - Verificar autenticação ao carregar a aplicação
  // Endpoint: GET /api/auth/me
  // Headers: { Authorization: `Bearer ${token}` }
  useEffect(() => {
    // Verifica se já tem autenticação
    if (isAuthenticated) {
      setCurrentPage('home');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    logout();
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

      {currentPage === 'home' && (
        <HomePage 
          onLogout={handleLogout}
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
      <AppContent />
    </AuthProvider>
  );
}