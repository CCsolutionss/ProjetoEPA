import { toast } from 'sonner@2.0.3';

// Context
import { useAuth } from '../context/AuthContext';

// Components
import { Header } from '../components/Header';
import { DashboardCard } from '../components/DashboardCard';

interface HomePageProps {
  onLogout: () => void;
  onNavigateToNovaMedicao: () => void;
  onNavigateToRelatorios: () => void;
  onNavigateToCadastrarBase: () => void;
  onNavigateToConsultarBase: () => void;
  onNavigateToGerenciarPermissoes: () => void;
  onNavigateToConfiguracoes: () => void;
}

/**
 * HomePage Component
 * 
 * Main dashboard displaying available actions based on user permissions.
 * Features:
 * - Role-based access control (future implementation)
 * - Quick access to main features
 * - User information display
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Logout callback
 * @param {Function} props.onNavigateToNovaMedicao - Navigate to new measurement
 * @param {Function} props.onNavigateToRelatorios - Navigate to reports
 * @param {Function} props.onNavigateToCadastrarBase - Navigate to register base
 * @param {Function} props.onNavigateToConsultarBase - Navigate to consult bases
 * @param {Function} props.onNavigateToGerenciarPermissoes - Navigate to manage users
 * @param {Function} props.onNavigateToConfiguracoes - Navigate to settings
 */
export default function HomePage({ 
  onLogout, 
  onNavigateToNovaMedicao, 
  onNavigateToRelatorios, 
  onNavigateToCadastrarBase, 
  onNavigateToConsultarBase, 
  onNavigateToGerenciarPermissoes, 
  onNavigateToConfiguracoes 
}: HomePageProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logout realizado com sucesso!');
      onLogout();
    } catch (err) {
      toast.error('Erro ao fazer logout');
      console.error('Logout error:', err);
    }
  };

  /**
   * TODO: [Backend Integration Required]
   * 
   * Fetch user permissions to control feature visibility
   * 
   * Endpoint: GET /api/users/{userId}/permissions
   * Auth: Bearer token required
   * 
   * Response (200):
   * {
   *   permissions: Array<{
   *     resource: 'medicoes' | 'bases' | 'usuarios' | 'configuracoes',
   *     actions: Array<'create' | 'read' | 'update' | 'delete'>
   *   }>
   * }
   * 
   * Use these permissions to show/hide dashboard cards and buttons
   * based on user role (admin, operador, visualizador)
   */

  const dashboardCards = [
    {
      title: 'Medições',
      buttons: [
        {
          label: 'Nova medição',
          variant: 'primary' as const,
          onClick: () => {
            onNavigateToNovaMedicao();
          },
        },
        {
          label: 'Consultar Medições',
          variant: 'secondary' as const,
          onClick: () => {
            onNavigateToRelatorios();
          },
        },
      ],
    },
    {
      title: 'Bases de Medições',
      buttons: [
        {
          label: 'Cadastrar Base',
          variant: 'primary' as const,
          onClick: () => {
            onNavigateToCadastrarBase();
          },
        },
        {
          label: 'Consultar Base',
          variant: 'secondary' as const,
          onClick: () => {
            onNavigateToConsultarBase();
          },
        },
      ],
    },
    {
      title: 'Usuários',
      buttons: [
        {
          label: 'Gerenciar Usuários',
          variant: 'primary' as const,
          onClick: () => {
            onNavigateToGerenciarPermissoes();
          },
        },
      ],
    },
    {
      title: 'Configurações e Segurança',
      buttons: [
        {
          label: 'Configurações',
          variant: 'primary' as const,
          onClick: () => {
            onNavigateToConfiguracoes();
          },
        },
      ],
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen h-full bg-[#EDFEE8]">
      <Header 
        userName={user.nomeCompleto} 
        userRole={user.cargo}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              buttons={card.buttons}
            />
          ))}
        </div>
      </main>
    </div>
  );
}