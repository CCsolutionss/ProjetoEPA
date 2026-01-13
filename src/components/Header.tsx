import { Bell, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import epaLogo from '../assets/epa-logo.png';

interface HeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export function Header({ userName, userRole, onLogout }: HeaderProps) {
  // TODO: API - Buscar notificações não lidas
  // Endpoint: GET /api/notifications/unread
  // Headers: { Authorization: `Bearer ${token}` }
  // Response: { count: number, notifications: Notification[] }
  const unreadNotifications = 0;

  return (
    <header className="bg-white border-b-2 border-[#000000] px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo e Título */}
        <div className="flex items-center gap-2 sm:gap-4">
          <img 
            src={epaLogo}
            alt="Grupo EPA Logo"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-[#000000] text-base sm:text-lg">Grupo EPA</h1>
            <p className="text-xs sm:text-sm text-[#000000]/60">Portal de Medições</p>
          </div>
        </div>

        {/* Notificações e Usuário */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Notificações */}
          <button 
            className="relative p-2 hover:bg-[#EDFEE8] rounded-lg transition-colors"
            aria-label="Notificações"
            // TODO: API - Ao clicar, abrir modal com lista de notificações
            // Endpoint: GET /api/notifications
            // Headers: { Authorization: `Bearer ${token}` }
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#000000]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#00DC30] rounded-full" />
            )}
          </button>

          {/* Informações do Usuário */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-[#000000]">{userName}</p>
              <p className="text-xs text-[#000000]/60">{userRole}</p>
            </div>

            {/* Botão Sair */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-2 border-[#000000] bg-white hover:bg-[#EDFEE8] text-[#000000] rounded-lg px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
