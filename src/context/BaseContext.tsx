import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * Contexto global da Base selecionada.
 *
 * Fluxo esperado:
 * 1) Usuário faz login
 * 2) App direciona para a tela de seleção de Base
 * 3) A Base escolhida fica salva (session/local storage) e passa a ser usada no app inteiro
 */

export type BaseResumo = {
  id: string;
  nome: string;
};

interface BaseContextType {
  selectedBase: BaseResumo | null;
  hasSelectedBase: boolean;
  setSelectedBase: (base: BaseResumo) => void;
  clearSelectedBase: () => void;
}

const STORAGE_KEYS = {
  BASE_ID: 'epa_selected_base_id',
  BASE_NAME: 'epa_selected_base_name',
} as const;

const BaseContext = createContext<BaseContextType | undefined>(undefined);

function getStorage() {
  // Mantém a base no mesmo “tipo” de storage do login (local vs session), quando possível.
  // Compatível com as duas chaves de token (uma no AuthContext e outra no services/config).
  const hasLocalToken = !!(localStorage.getItem('token') || localStorage.getItem('epa_auth_token'));
  const hasSessionToken = !!(sessionStorage.getItem('token') || sessionStorage.getItem('epa_auth_token'));
  if (hasLocalToken) return localStorage;
  if (hasSessionToken) return sessionStorage;
  return sessionStorage;
}

export function BaseProvider({ children }: { children: ReactNode }) {
  const [selectedBase, setSelectedBaseState] = useState<BaseResumo | null>(null);

  useEffect(() => {
    const storage = getStorage();
    const id = storage.getItem(STORAGE_KEYS.BASE_ID);
    const nome = storage.getItem(STORAGE_KEYS.BASE_NAME);
    if (id && nome) {
      setSelectedBaseState({ id, nome });
    }
  }, []);

  const setSelectedBase = (base: BaseResumo) => {
    setSelectedBaseState(base);
    const storage = getStorage();
    storage.setItem(STORAGE_KEYS.BASE_ID, base.id);
    storage.setItem(STORAGE_KEYS.BASE_NAME, base.nome);
  };

  const clearSelectedBase = () => {
    setSelectedBaseState(null);
    localStorage.removeItem(STORAGE_KEYS.BASE_ID);
    localStorage.removeItem(STORAGE_KEYS.BASE_NAME);
    sessionStorage.removeItem(STORAGE_KEYS.BASE_ID);
    sessionStorage.removeItem(STORAGE_KEYS.BASE_NAME);
  };

  return (
    <BaseContext.Provider
      value={{
        selectedBase,
        hasSelectedBase: !!selectedBase,
        setSelectedBase,
        clearSelectedBase,
      }}
    >
      {children}
    </BaseContext.Provider>
  );
}

export function useBase() {
  const ctx = useContext(BaseContext);
  if (!ctx) throw new Error('useBase must be used within a BaseProvider');
  return ctx;
}
