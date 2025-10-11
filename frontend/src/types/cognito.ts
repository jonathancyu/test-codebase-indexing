export interface CognitoConfig {
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
  domain: string;
  region: string;
}

export interface CloudFrontConfig {
  domain: string;
}

export interface Config {
  cognito: CognitoConfig;
  cloudfront: CloudFrontConfig;
  apiUrl: string;
  staticSiteDomainName: string;
}
