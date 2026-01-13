import { useMemo, useState } from 'react';
import { MapPin, Search, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import { useAuth } from '../context/AuthContext';
import { useBase } from '../context/BaseContext';

import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface SelecionarBasePageProps {
  onContinue: () => void;
  onLogout: () => void;
}

/**
 * Tela exibida logo após o login para o usuário selecionar a Base.
 *
 * TODO backend:
 * - GET /api/bases?ativo=true (listar bases disponíveis ao usuário)
 * - validar permissões (usuário só pode selecionar bases autorizadas)
 */

// MOCK (substituir pelo backend quando integrar)
const mockBases = [
  { id: '1', nome: 'Sistema de Refrigeração - Unidade A' },
  { id: '2', nome: 'Monitoramento Energético - Fábrica B' },
  { id: '3', nome: 'Qualidade do Ar - Escritório Central' },
  { id: '4', nome: 'Tratamento de Efluentes - Indústria C' },
];

export default function SelecionarBasePage({ onContinue, onLogout }: SelecionarBasePageProps) {
  const { user, logout } = useAuth();
  const { selectedBase, setSelectedBase, clearSelectedBase } = useBase();

  const [search, setSearch] = useState('');
  const [pendingId, setPendingId] = useState<string>(selectedBase?.id ?? '');

  const basesFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockBases;
    return mockBases.filter((b) => b.nome.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  }, [search]);

  const handleConfirm = () => {
    const base = mockBases.find((b) => b.id === pendingId);
    if (!base) {
      toast.error('Selecione uma base para continuar.');
      return;
    }
    setSelectedBase(base);
    toast.success(`Base selecionada: ${base.nome}`);
    onContinue();
  };

  const handleLogout = () => {
    try {
      clearSelectedBase();
      logout();
      toast.success('Logout realizado com sucesso!');
      onLogout();
    } catch (err) {
      toast.error('Erro ao fazer logout');
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDFEE8] p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl text-[#000000]">Selecione a base</h1>
            <p className="text-sm text-[#000000]/70">
              {user ? `Logado como ${user.nomeCompleto}` : 'Escolha a base para continuar'}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-2 border-[#000000] bg-white hover:bg-[#EDFEE8] text-[#000000] rounded-lg"
          >
            Sair
          </Button>
        </div>

        <Card className="border-2 border-[#000000] rounded-3xl bg-white shadow-none overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-[#000000] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#000000]" />
              <span className="text-[#000000]">Bases disponíveis</span>
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar base..."
                className="pl-9 border-2 border-[#000000] rounded-lg"
              />
            </div>
          </div>

          <div className="p-6 space-y-3">
            {basesFiltradas.length === 0 ? (
              <div className="text-sm text-gray-600">Nenhuma base encontrada.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {basesFiltradas.map((b) => {
                  const isSelected = pendingId === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setPendingId(b.id)}
                      className={`text-left rounded-2xl border-2 p-4 transition-colors ${
                        isSelected
                          ? 'border-[#00920C] bg-[#EDFEE8]'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500">ID: {b.id}</p>
                          <p className="text-base text-[#000000]">{b.nome}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#00920C]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                onClick={handleConfirm}
                className="bg-[#00DC30] hover:bg-[#00920C] text-[#000000] hover:text-white border-2 border-[#000000] rounded-lg"
              >
                Continuar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
