import { useAuth } from '@/components/AuthProvider';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { waitForConfig } from '@/lib/config';
import { getAuthSession } from '@/lib/auth';

function removeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// Base hook for authentication and token management
export function useApi() {
  const auth = useAuth();

  const getIdToken = useCallback(async () => {
    if (!auth.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const session = await getAuthSession();
    const idToken = session?.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('No ID token available');
    }

    return idToken;
  }, [auth.isAuthenticated]);

  const callApi = useCallback(
    async (method: string, path: string, body?: any) => {
      try {
        const token = await getIdToken();

        // Use localhost in development, otherwise use configured API URL
        let baseUrl: string;
        if (import.meta.env.DEV) {
          baseUrl = 'http://localhost:8000';
        } else {
          const config = await waitForConfig();
          baseUrl = removeTrailingSlash(config.apiUrl);
        }

        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = `HTTP error! status: ${response.status}${errorText ? `, message: ${errorText}` : ''}`;

          // Toast the error
          toast.error('API Error', {
            description: errorMessage,
            action: {
              label: 'Dismiss',
              onClick: () => {}, // sonner will auto-dismiss, but we can add custom action if needed
            },
          });

          throw new Error(errorMessage);
        }

        return response.json();
      } catch (error) {
        // If it's not already handled (like HTTP errors), handle other errors
        if (error instanceof Error && !error.message.includes('HTTP error!')) {
          toast.error('Request Failed', {
            description: error.message,
            action: {
              label: 'Dismiss',
              onClick: () => {},
            },
          });
        }
        throw error;
      }
    },
    [getIdToken],
  );

  const callApiFormData = useCallback(
    async (path: string, formData: FormData) => {
      try {
        const token = await getIdToken();

        // Use localhost in development, otherwise use configured API URL
        let baseUrl: string;
        if (import.meta.env.DEV) {
          baseUrl = 'http://localhost:8000';
        } else {
          const config = await waitForConfig();
          baseUrl = removeTrailingSlash(config.apiUrl);
        }

        const response = await fetch(`${baseUrl}${path}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let the browser set it with the boundary for multipart/form-data
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage: string;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.detail || errorJson.message || 'Failed to upload file';
          } catch {
            errorMessage = errorText || 'Failed to upload file';
          }

          // Toast the error
          toast.error('Upload Failed', {
            description: errorMessage,
            action: {
              label: 'Dismiss',
              onClick: () => {},
            },
          });

          throw new Error(errorMessage);
        }

        return response.json();
      } catch (error) {
        // If it's not already handled (like HTTP errors), handle other errors
        if (
          error instanceof Error &&
          !error.message.includes('Failed to upload file') &&
          !error.message.includes('HTTP error!')
        ) {
          toast.error('Upload Failed', {
            description: error.message,
            action: {
              label: 'Dismiss',
              onClick: () => {},
            },
          });
        }
        throw error;
      }
    },
    [getIdToken],
  );

  return { getAccessToken: getIdToken, isAuthenticated: auth.isAuthenticated, callApi, callApiFormData };
}
