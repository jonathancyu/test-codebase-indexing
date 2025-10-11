import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getCurrentAuthUser, configureAuth, logout as authLogout } from '@/lib/auth';
import { waitForConfig } from '@/lib/config';
import type { AuthUser } from 'aws-amplify/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
  needsNewPassword: boolean;
  confirmNewPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsNewPassword, setNeedsNewPassword] = useState(false);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentAuthUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { loginWithCognito } = await import('@/lib/auth');
      const result = await loginWithCognito(username, password);

      // Check if sign-in is complete or needs additional steps
      if (result.isSignedIn) {
        setNeedsNewPassword(false);
        // Add a small delay to ensure tokens are properly set
        await new Promise(resolve => setTimeout(resolve, 500));
        await checkAuthState();
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setNeedsNewPassword(true);
        setError(null); // Clear any previous errors
      } else {
        setError('Sign-in requires additional steps. Please contact administrator.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      setNeedsNewPassword(false);
    } catch (error) {
    }
  };

  const confirmNewPassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const { confirmSignInWithNewPassword } = await import('@/lib/auth');
      const result = await confirmSignInWithNewPassword(newPassword);

      if (result.isSignedIn) {
        setNeedsNewPassword(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        await checkAuthState();
      } else {
        setError('Failed to confirm new password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set new password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const config = await waitForConfig();
        configureAuth(config);
        await checkAuthState();
      } catch (error) {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    error,
    needsNewPassword,
    confirmNewPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}