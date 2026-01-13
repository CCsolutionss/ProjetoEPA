import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';

/**
 * Authentication Context Type Definition
 * Provides authentication state and methods throughout the application
 */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Storage keys constants
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Manages global authentication state using Context API.
 * Persists auth data in localStorage (remember me) or sessionStorage.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * TODO: [Backend Integration Required]
   * 
   * Validate stored token on app initialization
   * 
   * Endpoint: GET /api/auth/me
   * Auth: Bearer token required
   * 
   * Response (200):
   * {
   *   user: User,
   *   tokenValid: boolean
   * }
   * 
   * Errors:
   * - 401: Invalid/expired token -> Clear storage and logout
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // TODO: Validate token with backend here
        // If invalid, call logout()
      } catch (error) {
        console.error('Failed to restore authentication state:', error);
        logout();
      }
    }
  }, []);

  /**
   * Login function
   * Stores user data and token in appropriate storage based on "remember me" option
   * 
   * @param {User} userData - Authenticated user data
   * @param {string} authToken - JWT authentication token
   * @param {boolean} remember - Whether to persist in localStorage (true) or sessionStorage (false)
   */
  const login = (userData: User, authToken: string, remember: boolean = false) => {
    setUser(userData);
    setToken(authToken);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.TOKEN, authToken);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  /**
   * Logout function
   * Clears all authentication data from both storage types and resets state
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear from both storages to ensure complete cleanup
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  };

  /**
   * Update user data
   * Updates user information in state and persistent storage
   * 
   * @param {User} updatedUser - Updated user object
   */
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Update in the same storage that was originally used
    const storage = localStorage.getItem(STORAGE_KEYS.USER) ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Must be used within AuthProvider component tree.
 * 
 * @throws {Error} If used outside AuthProvider
 * @returns {AuthContextType} Authentication context value
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
