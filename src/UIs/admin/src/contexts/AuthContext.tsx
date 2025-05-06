import {
  ReactNode,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types/user';
import { loginForm, LoginResponse } from '../types/auth';
import {
  login as loginService,
  logout as logoutService,
} from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: loginForm) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [exp, setExp] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      if (exp) {
        const currentTime = new Date();
        const isExpired = exp < currentTime;
        setIsAuthenticated(!isExpired);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [user, exp]);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTokenExp = localStorage.getItem('exp');

    if (storedUser != null && storedTokenExp != null) {
      setUser(JSON.parse(storedUser));
      setExp(new Date(JSON.parse(storedTokenExp)));
    } else {
      console.log(
        'User loaded from localStorage:',
        JSON.parse(storedUser || 'null'),
      );
      console.log(
        'Token expiration loaded from localStorage:',
        new Date(JSON.parse(storedTokenExp || 'null')),
      );
    }
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data: LoginResponse) => {
      setExp(data.accessTokenExpiresTime);
      setUser(data.user);
      console.log(data.accessTokenExpiresTime);
      setError(null);

      // Store auth data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('exp', JSON.stringify(data.accessTokenExpiresTime));

      // You might want to store tokens here too
      // localStorage.setItem('accessToken', data.accessToken);

      // Invalidate relevant queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      setError(error);
      setUser(null);
      setExp(null);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      setUser(null);
      // Clear stored auth data
      localStorage.removeItem('user');
      localStorage.removeItem('exp');

      // Reset relevant cache
      queryClient.clear();
    },
    onError: (error: Error) => {
      setError(error);
    },
  });

  const handleLogin = async (data: loginForm): Promise<LoginResponse> => {
    return loginMutation.mutateAsync(data);
  };

  const handleLogout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const value = {
    user,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: isAuthenticated,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
