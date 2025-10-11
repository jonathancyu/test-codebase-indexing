import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signOut, fetchAuthSession, confirmSignIn } from 'aws-amplify/auth';
import type { Config } from '@/types/cognito';

let isConfigured = false;

export const configureAuth = (config: Config) => {
  if (isConfigured) return;
  // Configure Amplify with Cognito setup
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.cognito.userPoolId,
        userPoolClientId: config.cognito.userPoolClientId,
        identityPoolId: config.cognito.identityPoolId,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          username: true,
        },
      },
    },
  });

  isConfigured = true;
};

export const getCurrentAuthUser = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
};

export const getAuthSession = async () => {
  try {
    const session = await fetchAuthSession();
    return session;
  } catch (error) {
    return null;
  }
};

export const loginWithCognito = async (username: string, password: string) => {
  const result = await signIn({
    username,
    password,
  });
  return result;
};

export const confirmSignInWithNewPassword = async (newPassword: string) => {
  const result = await confirmSignIn({
    challengeResponse: newPassword,
  });
  return result;
};

export const logout = async () => {
  await signOut();
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
};
