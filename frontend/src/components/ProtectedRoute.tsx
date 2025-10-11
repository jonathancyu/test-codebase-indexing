import { type ReactNode, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, login, error, needsNewPassword, confirmNewPassword } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoggingIn(true);
    try {
      await login(username, password);
    } catch (err) {
      // Error is handled by AuthProvider
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      return;
    }

    setIsSettingPassword(true);
    try {
      await confirmNewPassword(newPassword);
    } catch (err) {
      // Error is handled by AuthProvider
    } finally {
      setIsSettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (needsNewPassword) {
      // Show new password form
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Set New Password</CardTitle>
              <CardDescription>
                Your account requires a new password. Please set a secure password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewPassword} className="space-y-4">
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    minLength={8}
                  />
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <div className="text-red-600 text-sm">
                    Passwords do not match
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSettingPassword || !newPassword || newPassword !== confirmPassword}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isSettingPassword ? 'Setting Password...' : 'Set New Password'}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Password must be at least 8 characters long
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show regular login form
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your AWS Cognito credentials to access the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username or Email
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoggingIn}>
                <LogIn className="mr-2 h-4 w-4" />
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Secured by AWS Cognito
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}