import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Github, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="font-semibold text-lg text-black">8090 Solutions</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="!text-black hover:!text-black/80">
              Home
            </Link>
            <Link to="/architecture" className="!text-black hover:!text-black/80">
              Architecture
            </Link>
            <Link to="/application-tier" className="!text-black hover:!text-black/80">
              Application Tier
            </Link>
            <Link to="/frontend" className="!text-black hover:!text-black/80">
              Frontend
            </Link>
            <Link to="/users" className="!text-black hover:!text-black/80">
              Users
            </Link>
            <div className="h-4 w-px bg-border"></div>
            <a
              href="https://github.com/8090-inc/three-tier-app/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-black hover:!text-black/80 transition-colors"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            {isAuthenticated && (
              <>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="text-black">
                      {user?.signInDetails?.loginId || user?.username || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="!text-black hover:!text-black/80"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-semibold">8090 Solutions</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 8090 Solutions. Built with modern three-tier architecture.
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
