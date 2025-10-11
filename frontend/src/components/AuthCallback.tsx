import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmSignIn } from 'aws-amplify/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(error);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Handle the OAuth callback
        await confirmSignIn({
          challengeResponse: code,
        });

        setStatus('success');

        // Redirect to home page after successful authentication
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');

        // Redirect to home page after error (user can try again)
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            {status === 'loading' && (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we sign you in.'}
            {status === 'success' && 'Redirecting you to the application...'}
            {status === 'error' && `Error: ${error}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'error' && (
            <div className="text-center text-sm text-muted-foreground">
              You will be redirected back to try again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}