export interface StackConfig {
  projectName: string;
  region: string;
  cognitoConfig?: {
    emailConfig?: {
      fromEmail: string;
      fromName: string;
      verificationSubject: string;
      verificationBody: string;
    };
    oauthConfig?: {
      callbackUrls: string[];
      logoutUrls: string[];
    };
  };
}

export function getConfig(): StackConfig {
  return {
    projectName: 'PROJECT_NAME_PLACEHOLDER',
    region: 'us-west-2',
  };
}
