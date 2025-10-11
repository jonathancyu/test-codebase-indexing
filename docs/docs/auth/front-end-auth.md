##Front End Auth


This `config.json` is  read in to the Vite app as part of it's loading process in `./frontend/src/lib/config.ts`

```typescript
  const cognitoConfig = config.cognito;
  const isDevelopment = import.meta.env.DEV;
  const redirectUri = isDevelopment ? 'http://localhost:3000/callback' : `https://${config.cloudfront.domain}/callback`;

  const oidcConfig = {
    authority: `https://cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}`,
    client_id: cognitoConfig.userPoolClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email openid profile',
    loadUserInfo: true,
    onSigninCallback: () => {
      setTimeout(() => {
        navigate('/');
      }, 100);
    },
  };
```

Once logged in, the user will have an `access_token` associated with their login.  

```typescript
  const getAccessToken = useCallback(() => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      throw new Error('Not authenticated');
    }
    return auth.user.access_token;
  }, [auth]);
```

This token will be usedin `./frontend/src/lib/api-client.ts` to make the request with the associated token

```typescript
export async function getUsers(token: string): Promise<User[]> {
  const baseUrl = removeTrailingSlash(getApiUrl());
  const response = await fetch(`${baseUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}${errorText ? `, message: ${errorText}` : ''}`);
  }

  return response.json();
}
```